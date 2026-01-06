import OpenAI from 'openai';
import { z } from 'zod';

// ============================================================
// MODEL PARAMETERS (Task 6: Deterministic settings)
// ============================================================
const MODEL_CONFIG = {
    model: 'gpt-4o-mini',
    temperature: 0.15,
    max_tokens: 1200,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    response_format: { type: 'json_object' }
};

// ============================================================
// INTEREST RATE ASSUMPTIONS
// ============================================================
const RATE_ASSUMPTIONS = {
    revolving: { rate: 22.0, note: 'credit card assumption' },
    credit: { rate: 22.0, note: 'credit card assumption' },
    auto: { rate: 6.5, note: 'auto loan assumption' },
    car: { rate: 6.5, note: 'auto loan assumption' },
    installment: { rate: 9.0, note: 'installment assumption' },
    personal: { rate: 9.0, note: 'personal loan assumption' },
    student: { rate: 5.5, note: 'student loan assumption' }
};

// ============================================================
// SYSTEM PROMPT (Task 2: Removed guideline language)
// ============================================================
const SYSTEM_PROMPT = `You are a mortgage-focused liability analysis assistant.
Your purpose is to analyze borrower liabilities and determine whether home equity can be used to consolidate debt through a refinance or cash-out refinance.

You must follow all rules exactly.
Do not vary structure, section order, or bullet counts.
Do not speculate or invent values.

CORE RULES:
1. Use only the data provided or defined assumptions
2. Be deterministic and concise
3. Always separate facts from recommendations
4. Never double count refinanced mortgages
5. Never present speculative savings or APRs as facts
6. Do not reference LTV, AUS, guidelines, approval odds, or underwriting rules
7. Use the provided consolidation_budget number only - never recompute it

INTEREST RATE ASSUMPTIONS (Use only if rate is missing):
- Revolving / Credit card: 22%
- Installment / Personal loan: 9%
- Auto loan: 6.5%
- Student loan: 5.5%
- Mortgage / HELOC: do not estimate

If a real interest rate is present, always use it instead of assumptions.
Always disclose assumptions explicitly.

PRIORITIZATION RULES (when budget cannot cover all debts):
Rank debts in this exact order:
1) Revolving / credit cards
2) Installment / personal loans
3) Auto loans
4) Student loans
5) Other or unknown

Within the same type:
- Higher interest rate first
- If rate missing, use assumptions
- If still tied, higher monthly payment first
- If payment missing, higher balance first

Output valid JSON only.`;

// ============================================================
// RESPONSE SCHEMA (Task 3: Updated credit_score_impact)
// ============================================================
const CreditScoreImpactSchema = z.object({
    direction: z.enum(['Likely positive', 'Neutral', 'Unclear']),
    drivers: z.array(z.string()),
    note: z.string()
});

const DebtIncludedSchema = z.object({
    creditor: z.string(),
    balance: z.number(),
    rate: z.string(),
    rate_assumed: z.boolean().optional(),
    monthly_payment: z.number(),
    priority: z.enum(['High Priority', 'Medium Priority', 'Low Priority'])
});

const DebtExcludedSchema = z.object({
    creditor: z.string(),
    reason: z.string()
});

const LiabilityAIResponseSchema = z.object({
    borrower_snapshot: z.object({
        property_value: z.number(),
        total_liens: z.number(),
        estimated_equity: z.number(),
        consolidation_budget: z.number(),
        total_monthly_non_mortgage: z.number()
    }),
    key_observations: z.array(z.string()),
    payoff_assessment: z.object({
        can_pay_all: z.boolean(),
        plan_type: z.string(),
        debts_included: z.array(DebtIncludedSchema),
        debts_excluded: z.array(DebtExcludedSchema).optional(),
        total_balance_to_payoff: z.number(),
        monthly_payments_eliminated: z.number(),
        budget_remaining: z.number()
    }),
    refinance_benefits: z.array(z.string()),
    assumptions_used: z.array(z.string()),
    credit_score_impact: CreditScoreImpactSchema.optional(),
    recommended_next_step: z.string(),
    conversation_opener: z.string()
});

// ============================================================
// COMPUTE FACTS (Task 7: Pre-compute to reduce prompt size)
// ============================================================
function estimateRateByType(accountType) {
    const type = (accountType || '').toLowerCase();
    if (type.includes('mortgage')) return { rate: null, estimated: false, note: 'mortgage - not estimated' };
    if (type.includes('heloc') || type.includes('equity')) return { rate: null, estimated: false, note: 'HELOC - not estimated' };
    
    for (const [key, value] of Object.entries(RATE_ASSUMPTIONS)) {
        if (type.includes(key)) {
            return { rate: value.rate, estimated: true, note: value.note };
        }
    }
    return { rate: 9.0, estimated: true, note: 'unknown type - installment assumption' };
}

function getPriorityTier(accountType) {
    const type = (accountType || '').toLowerCase();
    if (type.includes('revolving') || type.includes('credit')) return { tier: 1, label: 'High Priority' };
    if (type.includes('installment') || type.includes('personal')) return { tier: 2, label: 'Medium Priority' };
    if (type.includes('auto') || type.includes('car')) return { tier: 3, label: 'Medium Priority' };
    if (type.includes('student')) return { tier: 4, label: 'Low Priority' };
    return { tier: 5, label: 'Low Priority' };
}

function computeFacts(accounts, propertyValue, consolidationBudget) {
    // Separate property liens from non-mortgage debts
    const propertyLiens = accounts.filter(acc => {
        const type = (acc.accountType || '').toLowerCase();
        return type.includes('mortgage') || type.includes('heloc') || type.includes('equity');
    });
    
    const nonMortgageDebts = accounts.filter(acc => {
        const type = (acc.accountType || '').toLowerCase();
        return !type.includes('mortgage') && !type.includes('heloc') && !type.includes('equity');
    });

    // Computed totals
    const totalLiens = propertyLiens.reduce((sum, acc) => sum + acc.balance, 0);
    const estimatedEquity = propertyValue - totalLiens;
    const totalNonMortgagePayments = nonMortgageDebts.reduce((sum, acc) => sum + acc.payment, 0);
    const totalNonMortgageBalance = nonMortgageDebts.reduce((sum, acc) => sum + acc.balance, 0);

    // Normalize accounts with rate and priority
    const normalizedAccounts = accounts.map(acc => {
        const priority = getPriorityTier(acc.accountType);
        let rateUsed;
        let rateAssumed = false;
        
        if (acc.interestRate && acc.interestRate > 0) {
            rateUsed = acc.interestRate;
        } else {
            const estimated = estimateRateByType(acc.accountType);
            rateUsed = estimated.rate;
            rateAssumed = estimated.estimated;
        }
        
        return {
            ...acc,
            rateUsed,
            rateAssumed,
            priorityTier: priority.tier,
            priorityLabel: priority.label
        };
    });

    return {
        propertyValue,
        totalLiens,
        estimatedEquity,
        consolidationBudget,
        totalNonMortgagePayments,
        totalNonMortgageBalance,
        canPayAll: consolidationBudget >= totalNonMortgageBalance,
        normalizedAccounts
    };
}

// ============================================================
// BUILD PROMPT (Task 2: Removed LTV references)
// ============================================================
function buildPrompt(facts, proposedRate = 7.0) {
    const {
        propertyValue, totalLiens, estimatedEquity, consolidationBudget,
        totalNonMortgagePayments, totalNonMortgageBalance, canPayAll, normalizedAccounts
    } = facts;

    // Build liability list with pre-computed rates
    const liabilityList = normalizedAccounts.map(acc => {
        const rateStr = acc.rateUsed 
            ? `${acc.rateUsed}% (${acc.rateAssumed ? 'assumed' : 'actual'})`
            : 'N/A';
        return `- ${acc.creditor}: ${acc.accountType}, $${acc.balance.toLocaleString()} balance, $${acc.payment.toLocaleString()}/mo, ${rateStr}, ${acc.priorityLabel}`;
    }).join('\n');

    return `Analyze these borrower liabilities for home equity debt consolidation.

PROPERTY & EQUITY:
- Property value: $${propertyValue.toLocaleString()}
- Total property liens: $${totalLiens.toLocaleString()}
- Estimated equity: $${estimatedEquity.toLocaleString()}
- Consolidation budget (provided): $${consolidationBudget.toLocaleString()}
- Proposed refinance rate: ${proposedRate}%

LIABILITIES (pre-computed rates and priorities):
${liabilityList}

SUMMARY:
- Total non-mortgage monthly payments: $${totalNonMortgagePayments.toLocaleString()}
- Total non-mortgage debt balance: $${totalNonMortgageBalance.toLocaleString()}
- Can all non-mortgage debts be paid off with budget: ${canPayAll ? 'Yes' : 'No'}

Return this EXACT JSON structure:
{
  "borrower_snapshot": {
    "property_value": ${propertyValue},
    "total_liens": ${totalLiens},
    "estimated_equity": ${estimatedEquity},
    "consolidation_budget": ${consolidationBudget},
    "total_monthly_non_mortgage": ${totalNonMortgagePayments}
  },
  "key_observations": [
    "High-interest debt exposure observation",
    "Monthly payment fragmentation observation",
    "Cash flow or utilization pressure observation",
    "Lien or complexity consideration"
  ],
  "payoff_assessment": {
    "can_pay_all": ${canPayAll},
    "plan_type": "${canPayAll ? 'Full payoff' : 'Prioritized payoff'}",
    "debts_included": [
      { "creditor": "string", "balance": number, "rate": "X%", "rate_assumed": boolean, "monthly_payment": number, "priority": "High Priority" }
    ],
    "debts_excluded": [
      { "creditor": "string", "reason": "string" }
    ],
    "total_balance_to_payoff": number,
    "monthly_payments_eliminated": number,
    "budget_remaining": number
  },
  "refinance_benefits": [
    "Monthly cash flow improvement statement",
    "Interest cost efficiency statement",
    "Financial simplification statement"
  ],
  "assumptions_used": ["List each rate assumption applied"],
  "credit_score_impact": {
    "direction": "Likely positive" | "Neutral" | "Unclear",
    "drivers": ["utilization reduction", "fewer revolving balances"],
    "note": "Impact varies; depends on reporting and utilization."
  },
  "recommended_next_step": "One sentence focused on evaluating refinance",
  "conversation_opener": "Opening line for borrower conversation"
}

RULES:
- debts_included: sorted by priority (High first), then by rate (highest first)
- Only include debts up to the consolidation budget of $${consolidationBudget.toLocaleString()}
- Mortgages and HELOCs are NEVER in debts_included
- credit_score_impact.direction must be exactly: "Likely positive", "Neutral", or "Unclear"
- Do not estimate numeric point increases for credit scores
- Output JSON only`;
}

// ============================================================
// JSON REPAIR (Task 5: Repair fallback)
// ============================================================
async function repairJSON(client, invalidJSON) {
    const repairPrompt = `You are a JSON formatter. Return ONLY valid JSON.

INVALID JSON:
${invalidJSON}

REQUIRED SCHEMA:
{
  "borrower_snapshot": { "property_value": number, "total_liens": number, "estimated_equity": number, "consolidation_budget": number, "total_monthly_non_mortgage": number },
  "key_observations": ["string"],
  "payoff_assessment": { "can_pay_all": boolean, "plan_type": "string", "debts_included": [{ "creditor": "string", "balance": number, "rate": "string", "monthly_payment": number, "priority": "High Priority|Medium Priority|Low Priority" }], "total_balance_to_payoff": number, "monthly_payments_eliminated": number, "budget_remaining": number },
  "refinance_benefits": ["string"],
  "assumptions_used": ["string"],
  "credit_score_impact": { "direction": "Likely positive|Neutral|Unclear", "drivers": ["string"], "note": "string" },
  "recommended_next_step": "string",
  "conversation_opener": "string"
}

INSTRUCTIONS:
- Keep the same values from the invalid JSON
- Only fix structure and types
- Do not add new facts
- Return valid JSON only`;

    const response = await client.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
            { role: 'system', content: 'You are a JSON formatter. Return ONLY valid JSON.' },
            { role: 'user', content: repairPrompt }
        ],
        temperature: 0,
        max_tokens: 1200,
        response_format: { type: 'json_object' }
    });

    return response.choices[0]?.message?.content;
}

// ============================================================
// MAIN HANDLER
// ============================================================
export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const apiKey = process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: 'OpenAI API key not configured on server. Set OPENAI_API_KEY in .env.local' });
    }

    const client = new OpenAI({ apiKey });

    try {
        const { accounts, propertyValue = 785000, consolidationBudget, proposedRate = 7.0 } = req.body;

        if (!accounts || !Array.isArray(accounts)) {
            return res.status(400).json({ error: 'accounts array is required' });
        }

        // Calculate consolidation budget if not provided
        const propertyLiens = accounts.filter(acc => {
            const type = (acc.accountType || '').toLowerCase();
            return type.includes('mortgage') || type.includes('heloc') || type.includes('equity');
        });
        const totalLiens = propertyLiens.reduce((sum, acc) => sum + acc.balance, 0);
        const budget = consolidationBudget ?? Math.max(0, propertyValue * 0.8 - totalLiens);

        // Task 7: Compute facts before prompting
        const facts = computeFacts(accounts, propertyValue, budget);
        const prompt = buildPrompt(facts, proposedRate);

        console.log('📤 Liability AI - Sending to OpenAI...');
        const startTime = Date.now();

        const response = await client.chat.completions.create({
            ...MODEL_CONFIG,
            messages: [
                { role: 'system', content: SYSTEM_PROMPT },
                { role: 'user', content: prompt }
            ]
        });

        console.log(`⏱️ Response in ${Date.now() - startTime}ms`);

        const content = response.choices[0]?.message?.content;
        if (!content) {
            return res.status(500).json({ error: 'OpenAI returned empty response' });
        }

        let parsed;
        try {
            parsed = JSON.parse(content);
        } catch (e) {
            return res.status(422).json({ 
                error: 'Invalid JSON from OpenAI', 
                details: e.message,
                raw: content.substring(0, 500)
            });
        }

        // Validate with Zod
        const validated = LiabilityAIResponseSchema.safeParse(parsed);

        if (!validated.success) {
            console.log('⚠️ Validation failed, attempting repair...');
            
            // Task 5: JSON repair attempt
            const repairedContent = await repairJSON(client, content);
            
            if (repairedContent) {
                try {
                    const repairedParsed = JSON.parse(repairedContent);
                    const repairedValidated = LiabilityAIResponseSchema.safeParse(repairedParsed);
                    
                    if (repairedValidated.success) {
                        console.log('✅ Repair successful');
                        return res.status(200).json(repairedValidated.data);
                    }
                } catch (e) {
                    // Repair also failed
                }
            }

            // Return 422 if repair failed
            return res.status(422).json({
                error: 'Validation failed after repair attempt',
                details: validated.error.errors,
                raw: parsed
            });
        }

        console.log('✅ Liability AI analysis complete');
        return res.status(200).json(validated.data);

    } catch (error) {
        console.error('❌ Liability AI error:', error.message);
        return res.status(500).json({ 
            error: 'Failed to analyze liabilities', 
            details: error.message 
        });
    }
}

