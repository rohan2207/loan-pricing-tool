import OpenAI from 'openai';
import { z } from 'zod';

// ============================================================
// MODEL PARAMETERS (Task 6: Deterministic settings)
// ============================================================
const MODEL_CONFIG = {
    model: 'gpt-4o-mini',
    temperature: 0.2,
    max_tokens: 900,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    response_format: { type: 'json_object' }
};

// ============================================================
// SYSTEM PROMPT
// ============================================================
const SYSTEM_PROMPT = `You are an assistant helping a mortgage loan officer prepare for a first conversation.
Your job is to generate a concise, structured customer briefing using:
1) loan and liabilities data
2) property and equity context
3) localized context from web results (optional)

You must follow all rules.

HARD RULES:
1) Deterministic format. Do not change section order or bullet counts.
2) No invented facts. If something is missing, say "Not provided".
3) Do not include sensitive or creepy personalization. Keep it professional and loan focused.
4) Treat web context as low confidence. Use it only as light conversation starters, never as underwriting facts.
5) Do not mention the existence of web search tools or APIs.
6) Do not reference LTV, AUS, guidelines, approval odds, or underwriting rules.

CALCULATION RULES:
Equity:
- Total liens = sum of property lien balances
- Estimated equity = working property value − total liens
- If estimated equity <= 0, do not suggest cash-out. Suggest rate and term or credit improvement angles instead.

Debt consolidation angle:
- Focus on high interest non-mortgage debt, high monthly payment burden, and simplification.
- Never estimate LTV, never discuss guideline limits unless explicitly provided.

Output valid JSON only.`;

// ============================================================
// RESPONSE SCHEMA (Zod)
// ============================================================
const CallPrepBriefSchema = z.object({
    one_line_summary: z.string(),
    key_numbers: z.object({
        working_property_value: z.number(),
        total_liens: z.number(),
        estimated_equity: z.number(),
        total_non_mortgage_debt: z.number(),
        total_monthly_payments: z.number(),
        credit_snapshot: z.string()
    }),
    what_we_see: z.array(z.string()),
    how_we_can_help: z.array(z.string()),
    suggested_talk_track: z.object({
        opening_line: z.string(),
        discovery_questions: z.array(z.string()),
        value_statement: z.string(),
        close_for_next_step: z.string()
    }),
    conversation_starters: z.array(z.string()),
    missing_info_to_confirm: z.array(z.string())
});

// ============================================================
// COMPUTE FACTS (Task 7: Pre-compute to reduce prompt size)
// ============================================================
function computeFacts(input) {
    const { valuation, liabilities, creditScores, creditTier } = input;
    
    // Working property value
    const workingPropertyValue = valuation?.avmValue || 785000;
    
    // Separate liens from non-mortgage debts
    const liens = (liabilities || []).filter(l => {
        const type = (l.type || '').toLowerCase();
        return type.includes('mortgage') || type.includes('heloc');
    });
    
    const nonMortgageDebts = (liabilities || []).filter(l => {
        const type = (l.type || '').toLowerCase();
        return !type.includes('mortgage') && !type.includes('heloc');
    });
    
    // Computed totals
    const totalLiens = liens.reduce((sum, l) => sum + (l.balance || 0), 0);
    const totalNonMortgageDebt = nonMortgageDebts.reduce((sum, l) => sum + (l.balance || 0), 0);
    const totalNonMortgagePayments = nonMortgageDebts.reduce((sum, l) => sum + (l.payment || 0), 0);
    const estimatedEquity = workingPropertyValue - totalLiens;
    
    // Credit snapshot
    const borrowerScore = creditScores?.borrower || 608;
    const coBorrowerScore = creditScores?.coBorrower || null;
    const creditSnapshot = coBorrowerScore 
        ? `${borrowerScore} / ${coBorrowerScore}`
        : `${borrowerScore}`;
    
    return {
        workingPropertyValue,
        totalLiens,
        estimatedEquity,
        totalNonMortgageDebt,
        totalNonMortgagePayments,
        creditSnapshot,
        creditTier: creditTier || 'Unknown',
        liens,
        nonMortgageDebts
    };
}

// ============================================================
// BUILD PROMPT
// ============================================================
function buildPrompt(input, facts) {
    const { property, goodLeapLoan } = input;
    const {
        workingPropertyValue, totalLiens, estimatedEquity,
        totalNonMortgageDebt, totalNonMortgagePayments,
        creditSnapshot, creditTier, liens, nonMortgageDebts
    } = facts;

    // GoodLeap context
    const goodLeapContext = goodLeapLoan?.hasLoan
        ? `- Existing GoodLeap loan: ${goodLeapLoan.purpose}, $${goodLeapLoan.balance?.toLocaleString()}, ${goodLeapLoan.yearsSinceOrigination} years old`
        : '- No existing GoodLeap loan';

    return `Generate a Call Prep Brief for this customer.

CUSTOMER
- Location: ${property?.city || 'Unknown'}, ${property?.state || 'Unknown'}
- Loan stage: Initial Call

BORROWER SNAPSHOT
- Credit scores: ${creditSnapshot}
- Credit tier: ${creditTier}

PROPERTY
- Address: ${property?.address || 'Not provided'}
- Working property value: $${workingPropertyValue.toLocaleString()}

COMPUTED TOTALS
- Total liens: $${totalLiens.toLocaleString()}
- Estimated equity: $${estimatedEquity.toLocaleString()}
- Total non-mortgage debt: $${totalNonMortgageDebt.toLocaleString()}
- Total monthly non-mortgage payments: $${totalNonMortgagePayments.toLocaleString()}

LIENS (${liens.length} accounts):
${liens.map(l => `- ${l.creditor}: $${(l.balance || 0).toLocaleString()}`).join('\n') || 'None'}

NON-MORTGAGE DEBTS (${nonMortgageDebts.length} accounts):
${nonMortgageDebts.map(l => `- ${l.creditor}: ${l.type}, $${(l.balance || 0).toLocaleString()}, $${(l.payment || 0).toLocaleString()}/mo`).join('\n') || 'None'}

GOODLEAP CONTEXT
${goodLeapContext}

Return this EXACT JSON structure:
{
  "one_line_summary": "One sentence: Who they are, where they are, and the likely reason we can help",
  "key_numbers": {
    "working_property_value": ${workingPropertyValue},
    "total_liens": ${totalLiens},
    "estimated_equity": ${estimatedEquity},
    "total_non_mortgage_debt": ${totalNonMortgageDebt},
    "total_monthly_payments": ${totalNonMortgagePayments},
    "credit_snapshot": "${creditSnapshot}"
  },
  "what_we_see": ["equity assessment", "debt assessment", "credit flags", "complexity note"],
  "how_we_can_help": ["primary positioning", "benefit framing", "secondary option"],
  "suggested_talk_track": {
    "opening_line": "string",
    "discovery_questions": ["question 1", "question 2"],
    "value_statement": "string",
    "close_for_next_step": "string"
  },
  "conversation_starters": ["local topic 1", "local topic 2"],
  "missing_info_to_confirm": ["item 1", "item 2", "item 3"]
}

RULES:
- one_line_summary: exactly 1 sentence
- what_we_see: exactly 4 bullets
- how_we_can_help: exactly 3 bullets
- discovery_questions: exactly 2 questions
- conversation_starters: max 2 items
- missing_info_to_confirm: max 3 items
- Output JSON only`;
}

// ============================================================
// JSON REPAIR (Task 5: Repair fallback)
// ============================================================
async function repairJSON(client, invalidJSON, schema) {
    const repairPrompt = `You are a JSON formatter. Return ONLY valid JSON.

INVALID JSON:
${invalidJSON}

REQUIRED SCHEMA:
{
  "one_line_summary": "string",
  "key_numbers": { "working_property_value": number, "total_liens": number, "estimated_equity": number, "total_non_mortgage_debt": number, "total_monthly_payments": number, "credit_snapshot": "string" },
  "what_we_see": ["string", "string", "string", "string"],
  "how_we_can_help": ["string", "string", "string"],
  "suggested_talk_track": { "opening_line": "string", "discovery_questions": ["string", "string"], "value_statement": "string", "close_for_next_step": "string" },
  "conversation_starters": ["string"],
  "missing_info_to_confirm": ["string"]
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
        max_tokens: 900,
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
        const input = req.body;
        
        // Task 7: Compute facts before prompting
        const facts = computeFacts(input);
        const prompt = buildPrompt(input, facts);

        console.log('📤 Call Prep Brief - Sending to OpenAI...');
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
        const validated = CallPrepBriefSchema.safeParse(parsed);

        if (!validated.success) {
            console.log('⚠️ Validation failed, attempting repair...');
            
            // Task 5: JSON repair attempt
            const repairedContent = await repairJSON(client, content, CallPrepBriefSchema);
            
            if (repairedContent) {
                try {
                    const repairedParsed = JSON.parse(repairedContent);
                    const repairedValidated = CallPrepBriefSchema.safeParse(repairedParsed);
                    
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

        console.log('✅ Call Prep Brief generated successfully');
        return res.status(200).json(validated.data);

    } catch (error) {
        console.error('❌ Call Prep Brief error:', error.message);
        return res.status(500).json({ 
            error: 'Failed to generate briefing', 
            details: error.message 
        });
    }
}

