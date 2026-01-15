// ============================================================
// Sales Coach LLM Service
// Handles conversational AI for Objection Handling & Benefit Calculation
// ============================================================

const API_BASE = '/api/ai';

// ============================================================
// INTEREST RATE ASSUMPTIONS (same as Liability AI)
// ============================================================
const RATE_ASSUMPTIONS = {
    revolving: 22.0,
    credit: 22.0,
    auto: 6.5,
    car: 6.5,
    installment: 9.0,
    personal: 9.0,
    student: 5.5
};

// Estimate rate from account type if not provided
function estimateRateByType(accountType) {
    if (!accountType) return null;
    const type = accountType.toLowerCase();
    
    for (const [key, rate] of Object.entries(RATE_ASSUMPTIONS)) {
        if (type.includes(key)) {
            return rate;
        }
    }
    
    // Don't estimate for mortgages/HELOCs
    if (type.includes('mortgage') || type.includes('heloc')) {
        return null;
    }
    
    return null;
}

/**
 * Build loan scenario object from accounts and borrowerData
 * This pre-computes the context that will be injected into the system prompt
 */
export function buildLoanScenario(accounts = [], borrowerData = {}, advantageData = null) {
    const parseAmount = (val) => {
        if (typeof val === 'number') return val;
        if (typeof val === 'string') return parseFloat(val.replace(/[$,]/g, '')) || 0;
        return 0;
    };

    const parseRate = (val) => {
        if (typeof val === 'number') return val;
        if (typeof val === 'string') return parseFloat(val.replace(/[%]/g, '')) || null;
        return null;
    };

    // Borrower info
    const borrower = {
        name: borrowerData?.borrower?.name || 'Not provided',
        city: borrowerData?.property?.city || '',
        state: borrowerData?.property?.state || '',
        creditScore: borrowerData?.creditScores?.borrower || null,
        coBorrowerScore: borrowerData?.creditScores?.coBorrower || null
    };

    // Property info
    const propertyValue = borrowerData?.property?.avmValue || 785000;
    
    // Calculate total liens (mortgages + HELOCs)
    const mortgageLiens = accounts.filter(acc => {
        const type = (acc.accountType || '').toLowerCase();
        return type.includes('mortgage') || type.includes('heloc');
    });
    const totalLiens = mortgageLiens.reduce((sum, acc) => sum + parseAmount(acc.balance), 0);
    
    // Calculate equity and consolidation budget (80% LTV rule)
    const estimatedEquity = propertyValue - totalLiens;
    const consolidationBudget = Math.max(0, propertyValue * 0.8 - totalLiens);
    
    const property = {
        address: borrowerData?.property?.address || 'Not provided',
        value: propertyValue,
        totalLiens,
        estimatedEquity,
        consolidationBudget, // How much they can realistically consolidate at 80% LTV
        maxLTV80: Math.round(propertyValue * 0.8) // 80% of property value
    };

    // Credit utilization from borrowerData
    const creditUtilization = borrowerData?.creditUtilization ? {
        totalLimit: borrowerData.creditUtilization.totalLimit || 0,
        totalBalance: borrowerData.creditUtilization.totalBalance || 0,
        available: borrowerData.creditUtilization.available || 0,
        utilizationPercent: borrowerData.creditUtilization.utilizationPercent || 0
    } : null;

    // GoodLeap / Consumer Finance loan
    const goodLeapLoan = borrowerData?.consumerFinance ? {
        product: borrowerData.consumerFinance.product || 'Consumer Finance',
        balance: borrowerData.consumerFinance.unpaidBalance || 0,
        payment: borrowerData.consumerFinance.payment || 0,
        rate: borrowerData.consumerFinance.rate || null
    } : null;

    // Separate mortgages from other debts
    const mortgages = accounts.filter(acc => {
        const type = (acc.accountType || '').toLowerCase();
        return type.includes('mortgage') || type.includes('heloc');
    });

    const nonMortgageDebts = accounts.filter(acc => {
        const type = (acc.accountType || '').toLowerCase();
        return !type.includes('mortgage') && !type.includes('heloc');
    });

    // Current mortgage (first mortgage found)
    const primaryMortgage = mortgages[0];
    const currentMortgage = primaryMortgage ? {
        creditor: primaryMortgage.creditor || 'Unknown',
        balance: parseAmount(primaryMortgage.balance),
        rate: parseRate(primaryMortgage.interestRate || primaryMortgage.rate),
        payment: parseAmount(primaryMortgage.payment || primaryMortgage.monthlyPayment),
        term: 30
    } : null;

    // Second mortgage if exists
    const secondMortgage = mortgages[1] ? {
        creditor: mortgages[1].creditor || 'Unknown',
        balance: parseAmount(mortgages[1].balance),
        rate: parseRate(mortgages[1].interestRate || mortgages[1].rate),
        payment: parseAmount(mortgages[1].payment || mortgages[1].monthlyPayment)
    } : null;

    // ALL debts (for full context)
    const allDebts = nonMortgageDebts.map(acc => {
        const accountType = acc.accountType || acc.type || 'Unknown';
        let rate = parseRate(acc.interestRate || acc.rate);
        let rateAssumed = false;
        
        if (!rate) {
            rate = estimateRateByType(accountType);
            rateAssumed = !!rate;
        }
        
        return {
            creditor: acc.creditor || acc.name || 'Unknown',
            accountType,
            balance: parseAmount(acc.balance),
            payment: parseAmount(acc.payment || acc.monthlyPayment),
            rate,
            rateAssumed,
            willPay: !!acc.willPay
        };
    });

    // Debts being paid off (selected debts)
    const debtsBeingPaidOff = allDebts.filter(d => d.willPay);

    // Use advantage data if provided (from GoodLeap Advantage pricing)
    let proposedLoan = null;
    let comparison = null;

    if (advantageData) {
        proposedLoan = {
            amount: advantageData.loanAmount || 0,
            rate: advantageData.rate || 0,
            payment: advantageData.proposedPI || 0,
            term: advantageData.term || 30,
            ltv: advantageData.ltv || 0,
            cashout: advantageData.cashout || 0,
            closingCosts: advantageData.closingCosts || 0
        };

        comparison = {
            currentTotal: advantageData.currentTotal || 0,
            proposedTotal: advantageData.proposedTotal || 0,
            monthlySavings: advantageData.monthlySavings || 0,
            annualSavings: advantageData.annualSavings || 0,
            breakEvenMonths: advantageData.breakEvenMonths || null
        };
    } else {
        // No pricing data available yet - show what we know
        const totalDebtsBalance = debtsBeingPaidOff.reduce((sum, d) => sum + d.balance, 0);
        const totalDebtsPayment = debtsBeingPaidOff.reduce((sum, d) => sum + d.payment, 0);

        // Estimate loan amount (for context only)
        const estimatedLoanAmount = (currentMortgage?.balance || 0) + totalDebtsBalance;
        
        // Mark proposed loan as not yet priced
        proposedLoan = {
            amount: estimatedLoanAmount,
            rate: null, // Not yet priced
            payment: null, // Not yet calculated
            term: 30,
            ltv: property.value > 0 ? Math.round((estimatedLoanAmount / property.value) * 100) : null,
            cashout: null,
            closingCosts: null,
            notYetPriced: true // Flag to indicate pricing needed
        };

        // Comparison without proposed totals
        comparison = {
            currentTotal: (currentMortgage?.payment || 0) + totalDebtsPayment,
            proposedTotal: null, // Not yet calculated
            monthlySavings: null, // Cannot calculate without pricing
            annualSavings: null,
            breakEvenMonths: null,
            notYetPriced: true, // Flag to indicate pricing needed
            debtsPaymentToEliminate: totalDebtsPayment // What we DO know
        };
    }

    return {
        borrower,
        property,
        creditUtilization,
        goodLeapLoan,
        currentMortgage,
        secondMortgage,
        allDebts,
        debtsBeingPaidOff,
        proposedLoan,
        comparison
    };
}

/**
 * Send a message to the Sales Coach API
 * @param {Array} messages - Array of { role: 'user'|'assistant', content: string }
 * @param {Object} loanScenario - Pre-built loan scenario from buildLoanScenario()
 * @returns {Promise<{ message: string, usage?: object }>}
 */
export async function sendMessage(messages, loanScenario) {
    console.log('══════════════════════════════════════════════');
    console.log('💬 SALES COACH - SENDING MESSAGE');
    console.log('══════════════════════════════════════════════');

    try {
        const startTime = Date.now();

        const response = await fetch(`${API_BASE}/sales-coach`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                messages,
                loanScenario
            })
        });

        console.log(`⏱️ Response in ${Date.now() - startTime}ms`);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `Server error: ${response.status}`);
        }

        const data = await response.json();
        console.log('✅ Sales Coach response received');
        
        return data;

    } catch (error) {
        console.error('════════════════════════════════════════════════');
        console.error('❌ SALES COACH ERROR');
        console.error('Message:', error.message);
        console.error('════════════════════════════════════════════════');
        throw error;
    }
}

// Conversation starters - these explicitly ask to use the client's loaded data
export const CONVERSATION_STARTERS = {
    objections: [
        {
            id: 'analyze-client',
            label: 'What do you see?',
            prompt: 'Look at this client\'s debts and give me 3-4 talking points. Use their numbers but present everything as ESTIMATES (rates and interest costs are approximations). Round numbers for readability. Plain English only, no formulas.'
        },
        {
            id: 'rate-too-high',
            label: 'Rate too high objection',
            prompt: 'My client says the mortgage rate is too high. Explain blended rate using their debts. Present all interest calculations as ESTIMATES - use words like "roughly", "approximately". Round to readable numbers. No LaTeX.'
        },
        {
            id: 'closing-costs',
            label: 'Closing costs concern',
            prompt: 'Client doesn\'t want closing costs. Estimate break-even timeline based on their approximate payment savings. Use "roughly X months" - don\'t state exact numbers as facts. Keep it simple.'
        },
        {
            id: 'wait-for-rates',
            label: 'Wants to wait',
            prompt: 'Client wants to wait for rates. Estimate how much they\'re losing to interest monthly on high-rate debts. Use "approximately" and "roughly" - these are estimates, not exact. No LaTeX formulas.'
        }
    ],
    benefits: [
        {
            id: 'blended-rate',
            label: 'Calculate blended rate',
            prompt: 'Estimate their blended rate across all debts. Use "approximately" and round numbers. Example: "~$10,000 at roughly 25% plus ~$18,000 at about 7%..." All calculations are estimates.'
        },
        {
            id: 'cash-flow',
            label: 'Monthly cash flow',
            prompt: 'List their monthly debt payments and add up the total. These payment amounts are from their credit report. Show which debts have the biggest payments. Plain bullets only.'
        },
        {
            id: 'credit-score',
            label: 'Credit score impact',
            prompt: 'Look at their credit utilization. If they have revolving debt, explain how paying it off could improve utilization. Only discuss account types that exist in their data.'
        },
        {
            id: 'interest-cost',
            label: 'Interest savings',
            prompt: 'Estimate annual interest on their high-rate debts. Use "roughly" and "approximately" - these are estimates based on reported/assumed rates. Round to readable numbers like "$2,500/year" not "$2,549.80".'
        }
    ]
};

