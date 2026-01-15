import OpenAI from 'openai';

// ============================================================
// INTEREST RATE ASSUMPTIONS (same as Liability AI)
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

// Estimate rate from account type if not provided
function estimateRateByType(accountType) {
    if (!accountType) return null;
    const type = accountType.toLowerCase();
    
    for (const [key, value] of Object.entries(RATE_ASSUMPTIONS)) {
        if (type.includes(key)) {
            return { rate: value.rate, assumed: true, note: value.note };
        }
    }
    
    // Don't estimate for mortgages/HELOCs
    if (type.includes('mortgage') || type.includes('heloc')) {
        return null;
    }
    
    return null;
}

// ============================================================
// MODEL PARAMETERS - Slightly creative for conversation
// ============================================================
const MODEL_CONFIG = {
    model: 'gpt-4o-mini',
    temperature: 0.4,
    max_tokens: 1000,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0.1
};

// ============================================================
// SYSTEM PROMPT - Objection Handling & Benefit Calculation
// ============================================================
const SYSTEM_PROMPT = `You are a Sales Coach assistant helping Loan Officers (LOs) with two key areas:
1. **Objection Handling** - Helping LOs respond effectively to client objections regarding loan offers, payments, and refinancing.
2. **Benefit Calculation** - Assisting LOs in calculating and clearly communicating the financial benefits of loan options to clients.

---

## CRITICAL: USE THE CLIENT'S ACTUAL DATA

You have access to the client's REAL financial data below. **Always reference specific numbers, creditors, and rates in your responses.**

When you see opportunities in the data, CALL THEM OUT specifically:
- High credit card balances at 20%+ rates? Mention the specific cards and rates.
- High credit utilization? Point out the exact percentage and impact on their score.
- Multiple payments adding up? Calculate the total and show the monthly burden.
- Low mortgage rate but high-rate consumer debt? Explain the blended rate opportunity.

**Example of a GOOD response:**
"I see your client has $10,200 on their WFBNA Card at 24.99% and another $2,500 on AMEX at 19.99%. That's $12,700 in revolving debt costing them roughly $265/month in interest alone. If we consolidate at 7%, they'd drop that interest cost to about $74/month - a $191/month savings just on those two cards."

**Example of a BAD response:**
"High-interest debt can be consolidated to save money." (Too generic - doesn't use the actual data)

---

## RESPONSE FORMAT RULES

**SIMPLE MATH ONLY - NO LATEX:**
- NEVER use \frac{}{}, \times, \( \), or any LaTeX/math notation
- Write simply: "$10,200 at ~25% = roughly $2,500/year"
- Keep it simple and readable

**ALL INTEREST CALCULATIONS ARE ESTIMATES:**
- Interest costs are ALWAYS approximations - never state as exact facts
- Use words like: "roughly", "approximately", "around", "about", "estimated"
- Rates shown are what's reported or assumed - may not be exact
- Example: "roughly $200/month in interest" NOT "costing him $213.45/month"

**DO:**
- Reference ONLY accounts that exist in the data
- Present all calculations as estimates/approximations
- Round numbers for readability ($2,500 not $2,549.80)
- Be helpful but acknowledge these are estimates

**DO NOT:**
- State interest costs as exact facts
- Use LaTeX: \frac, \times, \( \), \\, etc.
- Show precise calculations to the penny
- Use em dashes

**EXAMPLE OF GOOD RESPONSE:**
"Your client's WFBNA Card has about $10,200 at roughly 25% - that's approximately $200/month going to interest. Combined with other high-rate debts, they're likely paying around $300/month just in interest charges."

---

## Objection Handling

When handling objections:
1. **Acknowledge** the client's concern empathetically.
2. **Avoid confrontation** - pivot the conversation to a positive and supportive tone.
3. **Use precision selling techniques** to structure the response with clear, persuasive wording.
4. **Incorporate Socratic questioning** to dig deeper into the client's true concerns, if needed.
5. **Utilize effective sales tie-downs and closing techniques.**

### Common Objections & Response Strategies:

**"I don't want to increase my mortgage rate."**
- Acknowledge: "I understand that keeping a low rate is important to you."
- Pivot: "However, what if we could show you how to lower your overall blended rate and free up extra cash each month?"
- Provide Clarity: Use blended rate calculations to compare the total cost of debt.

**"I don't want to pay closing costs."**
- Acknowledge: "That's a valid concern, no one likes unnecessary costs."
- Explain Reinvestment Benefits: Show how closing costs can be recouped through monthly savings within a calculated timeframe.

**"I don't see the benefit in refinancing."**
- Uncover Deeper Concerns: "What's your biggest financial priority right now - monthly savings, paying off debt, or long-term savings?"
- Present Value Proposition: Tailor the response based on their answer.

---

## Benefit Calculation

When assisting with benefit calculations:
- Ensure the LO provides specific loan details (current and proposed interest rates, monthly payments, loan term, debts to consolidate).
- If details are missing, ask for them before calculating.
- Use structured benefit calculations to highlight savings and advantages clearly.
- Frame the numbers persuasively using best practices.

### Types of Benefit Calculations You Can Handle:

**Blended Interest Rate Calculation**
- Compare the weighted average of multiple debts vs. the new consolidated mortgage rate.
- Show how refinancing can reduce overall interest costs.

**Monthly Savings & Cash Flow Impact**
- Compare current vs. new monthly payments.
- Factor in deferred mortgage payments, escrow refunds, and debt payoffs.

**Time to Recoup Closing Costs**
- Calculate how long it will take for monthly savings to offset closing costs.

**Loan Term Reduction Through Reinvestment**
- Show how applying savings to principal can reduce the loan term and overall interest.

**Debt Snowball Strategy**
- Guide on how to structure debt payoffs using the smallest balance method.

---

## Best Practices
- Use engaging, clear, and structured responses - no jargon or unnecessary complexity.
- Highlight the benefits persuasively - focus on the impact on the client's financial goals.
- Use bullet points and bold key numbers to improve readability.
- Always verify information first before calculating or responding.

### Mistakes to Avoid
- **Guessing Missing Information** - Always ask LOs for details first.
- **Overloading Clients with Numbers** - Keep explanations simple and impactful.
- **Focusing Only on Interest Rates** - Always highlight total financial impact.
- **Using Weak Language** - Be confident and persuasive (e.g., "This will save you $12,500 over the next 5 years" vs. "This might be a good option").

---

## Interest Rate Assumptions

When calculating blended rates or comparing debts, use these assumptions if actual rates are not provided:
- **Revolving / Credit Card:** 22%
- **Installment / Personal Loan:** 9%
- **Auto Loan:** 6.5%
- **Student Loan:** 5.5%
- **Mortgage / HELOC:** Do not estimate (use actual rate only)

When using assumed rates, mention "(assumed)" to the LO so they know to verify with the client.`;

// ============================================================
// BUILD LOAN SCENARIO CONTEXT
// ============================================================
function buildLoanScenarioContext(loanScenario) {
    if (!loanScenario) return '';

    const { 
        borrower, property, creditUtilization, goodLeapLoan,
        currentMortgage, secondMortgage, allDebts, debtsBeingPaidOff, 
        proposedLoan, comparison 
    } = loanScenario;

    let context = `\n\n---\n\n## CLIENT'S ACTUAL FINANCIAL DATA\n\n**IMPORTANT: Use these REAL numbers in your responses. Reference specific creditors, balances, and rates.**\n\n`;

    // Borrower info
    if (borrower) {
        context += `### Borrower Profile\n`;
        context += `- Name: ${borrower.name || 'Not provided'}\n`;
        context += `- Location: ${borrower.city || ''}, ${borrower.state || ''}\n`;
        if (borrower.creditScore) context += `- Credit Score: ${borrower.creditScore}`;
        if (borrower.coBorrowerScore) context += ` / Co-Borrower: ${borrower.coBorrowerScore}`;
        context += `\n\n`;
    }

    // Property info with equity analysis
    if (property) {
        context += `### Property & Equity Analysis\n`;
        context += `- Address: ${property.address || 'Not provided'}\n`;
        context += `- Property Value (AVM): $${(property.value || 0).toLocaleString()}\n`;
        context += `- Total Mortgage Liens: $${(property.totalLiens || 0).toLocaleString()}\n`;
        context += `- Estimated Equity: $${(property.estimatedEquity || property.equity || 0).toLocaleString()}\n`;
        context += `- 80% LTV Max Loan: $${(property.maxLTV80 || Math.round((property.value || 0) * 0.8)).toLocaleString()}\n`;
        context += `- **Consolidation Budget: $${(property.consolidationBudget || 0).toLocaleString()}**\n`;
        context += `  _(This is how much debt can be paid off while staying at 80% LTV)_\n\n`;
    }

    // Credit utilization
    if (creditUtilization) {
        context += `### Credit Card Utilization\n`;
        context += `- Total Credit Limit: $${(creditUtilization.totalLimit || 0).toLocaleString()}\n`;
        context += `- Current Balance: $${(creditUtilization.totalBalance || 0).toLocaleString()}\n`;
        context += `- Available Credit: $${(creditUtilization.available || 0).toLocaleString()}\n`;
        context += `- Utilization: ${(creditUtilization.utilizationPercent || 0).toFixed(1)}%\n\n`;
    }

    // GoodLeap / Consumer Finance loan
    if (goodLeapLoan && goodLeapLoan.balance > 0) {
        context += `### GoodLeap / Consumer Finance Loan\n`;
        context += `- Product: ${goodLeapLoan.product || 'Consumer Finance'}\n`;
        context += `- Balance: $${(goodLeapLoan.balance || 0).toLocaleString()}\n`;
        if (goodLeapLoan.rate) context += `- Rate: ${goodLeapLoan.rate}%\n`;
        if (goodLeapLoan.payment) context += `- Payment: $${(goodLeapLoan.payment || 0).toLocaleString()}/mo\n`;
        context += `\n`;
    }

    // Current mortgage(s)
    if (currentMortgage) {
        context += `### Current Mortgages\n`;
        context += `**1st Mortgage (${currentMortgage.creditor || 'Unknown'}):**\n`;
        context += `- Balance: $${(currentMortgage.balance || 0).toLocaleString()}\n`;
        context += `- Rate: ${currentMortgage.rate || '?'}%\n`;
        context += `- Monthly P&I: $${(currentMortgage.payment || 0).toLocaleString()}\n`;
        
        if (secondMortgage) {
            context += `\n**2nd Mortgage/HELOC (${secondMortgage.creditor || 'Unknown'}):**\n`;
            context += `- Balance: $${(secondMortgage.balance || 0).toLocaleString()}\n`;
            context += `- Rate: ${secondMortgage.rate || '?'}%\n`;
            context += `- Monthly Payment: $${(secondMortgage.payment || 0).toLocaleString()}\n`;
        }
        context += `\n`;
    }

    // ALL debts (full picture)
    if (allDebts && allDebts.length > 0) {
        const totalBalance = allDebts.reduce((sum, d) => sum + (d.balance || 0), 0);
        const totalPayment = allDebts.reduce((sum, d) => sum + (d.payment || 0), 0);
        
        context += `### ALL Non-Mortgage Debts (${allDebts.length} accounts)\n`;
        context += `**Totals:** $${totalBalance.toLocaleString()} balance | $${totalPayment.toLocaleString()}/mo in payments\n\n`;
        
        allDebts.forEach(d => {
            const rateDisplay = d.rate 
                ? (d.rateAssumed ? `${d.rate}% (ESTIMATED)` : `${d.rate}%`)
                : 'unknown rate';
            const selected = d.willPay ? ' [SELECTED FOR PAYOFF]' : '';
            context += `- **${d.creditor}** (${d.accountType}): $${(d.balance || 0).toLocaleString()} at ${rateDisplay}, paying $${(d.payment || 0).toLocaleString()}/mo${selected}\n`;
        });
        
        // Add note about estimated rates
        const hasEstimatedRates = allDebts.some(d => d.rateAssumed);
        if (hasEstimatedRates) {
            context += `\n**Note:** Rates marked (ESTIMATED) are assumptions - verify with client.\n`;
        }
        context += `\n`;
    }

    // Debts being paid off summary with consolidation analysis
    if (debtsBeingPaidOff && debtsBeingPaidOff.length > 0) {
        const totalBalance = debtsBeingPaidOff.reduce((sum, d) => sum + (d.balance || 0), 0);
        const totalPayment = debtsBeingPaidOff.reduce((sum, d) => sum + (d.payment || 0), 0);
        const consolidationBudget = property?.consolidationBudget || 0;
        const canPayAll = consolidationBudget >= totalBalance;
        
        context += `### Debts Selected for Payoff (${debtsBeingPaidOff.length} accounts)\n`;
        context += `- **Total to pay off:** $${totalBalance.toLocaleString()}\n`;
        context += `- **Monthly payments eliminated:** $${totalPayment.toLocaleString()}/mo\n`;
        context += `- **Annual payment savings:** $${(totalPayment * 12).toLocaleString()}/yr\n\n`;
        
        // Consolidation feasibility
        context += `### Consolidation Feasibility\n`;
        context += `- Consolidation Budget (at 80% LTV): $${consolidationBudget.toLocaleString()}\n`;
        context += `- Total Debt to Pay Off: $${totalBalance.toLocaleString()}\n`;
        if (canPayAll) {
            context += `- **Status: ✓ CAN pay off all selected debts** (Budget covers $${totalBalance.toLocaleString()})\n`;
            context += `- Remaining budget after payoff: $${(consolidationBudget - totalBalance).toLocaleString()}\n`;
        } else {
            context += `- **Status: ⚠ CANNOT pay off all debts at 80% LTV**\n`;
            context += `- Shortfall: $${(totalBalance - consolidationBudget).toLocaleString()}\n`;
            context += `- May need to prioritize which debts to include or consider higher LTV\n`;
        }
        context += `\n`;
    }

    // Proposed loan
    if (proposedLoan) {
        context += `### Proposed Loan\n`;
        if (proposedLoan.notYetPriced) {
            context += `**Note: Loan has not been priced yet. The following are estimates only.**\n`;
            context += `- Estimated Loan Amount: $${(proposedLoan.amount || 0).toLocaleString()}\n`;
            context += `- Rate: Not yet determined (needs pricing)\n`;
            context += `- Monthly P&I: Not yet calculated (needs pricing)\n`;
            context += `- Estimated LTV: ${proposedLoan.ltv || '?'}%\n`;
        } else {
            context += `- Loan Amount: $${(proposedLoan.amount || 0).toLocaleString()}\n`;
            context += `- Rate: ${proposedLoan.rate || 0}%\n`;
            context += `- Monthly P&I: $${(proposedLoan.payment || 0).toLocaleString()}\n`;
            context += `- Term: ${proposedLoan.term || 30} years\n`;
            context += `- LTV: ${proposedLoan.ltv || 0}%\n`;
            if (proposedLoan.cashout) context += `- Cash Out: $${proposedLoan.cashout.toLocaleString()}\n`;
            if (proposedLoan.closingCosts) context += `- Estimated Closing Costs: $${proposedLoan.closingCosts.toLocaleString()}\n`;
        }
        context += `\n`;
    }

    // Comparison / savings
    if (comparison) {
        context += `### Comparison Summary\n`;
        if (comparison.notYetPriced) {
            context += `**Note: Full comparison requires pricing the loan first.**\n`;
            context += `- Current Total Payment: $${(comparison.currentTotal || 0).toLocaleString()}/mo\n`;
            context += `- Debt Payments That Would Be Eliminated: $${(comparison.debtsPaymentToEliminate || 0).toLocaleString()}/mo\n`;
            context += `- Proposed Total: Not yet calculated (needs pricing)\n`;
            context += `- Monthly Savings: Cannot calculate until loan is priced\n`;
        } else {
            context += `- Current Total Payment: $${(comparison.currentTotal || 0).toLocaleString()}/mo\n`;
            context += `- Proposed Total Payment: $${(comparison.proposedTotal || 0).toLocaleString()}/mo\n`;
            context += `- Monthly Savings: $${(comparison.monthlySavings || 0).toLocaleString()}/mo\n`;
            context += `- Annual Savings: $${(comparison.annualSavings || 0).toLocaleString()}/yr\n`;
            if (comparison.breakEvenMonths) context += `- Break-Even: ${comparison.breakEvenMonths} months\n`;
        }
        context += `\n`;
    }

    // Add closing instruction
    context += `---\n\n`;
    context += `**IMPORTANT:** Use ONLY the data above. Do NOT invent numbers or assume values not shown here. `;
    context += `If you need additional information to answer the LO's question, ASK for it first.\n`;

    return context;
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
        const { messages, loanScenario } = req.body;

        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            return res.status(400).json({ error: 'Messages array is required' });
        }

        // Build the full system prompt with loan scenario context
        const loanContext = buildLoanScenarioContext(loanScenario);
        const fullSystemPrompt = SYSTEM_PROMPT + loanContext;

        console.log('📤 Sales Coach - Sending to OpenAI...');
        const startTime = Date.now();

        const response = await client.chat.completions.create({
            ...MODEL_CONFIG,
            messages: [
                { role: 'system', content: fullSystemPrompt },
                ...messages
            ]
        });

        console.log(`⏱️ Response in ${Date.now() - startTime}ms`);

        const content = response.choices[0]?.message?.content;
        if (!content) {
            return res.status(500).json({ error: 'OpenAI returned empty response' });
        }

        console.log('✅ Sales Coach response generated successfully');
        return res.status(200).json({ 
            message: content,
            usage: response.usage
        });

    } catch (error) {
        console.error('❌ Sales Coach error:', error.message);
        return res.status(500).json({ 
            error: 'Failed to generate response', 
            details: error.message 
        });
    }
}

