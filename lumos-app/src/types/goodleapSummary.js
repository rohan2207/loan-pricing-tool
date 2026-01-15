import { z } from 'zod';

/**
 * Schema for LLM response validation
 */
export const LLMResponseSchema = z.object({
    conversation_posture: z.enum(['Optimization', 'Cash flow relief', 'Check-in', 'Exploration']),
    best_opening_angle: z.string(),
    confidence_framing: z.string(),
    primary_exploration_path: z.string(),
    avoid_leading_with: z.string(),
    valuation_note: z.string().nullable(),
    conversation_starters: z.array(z.string()).length(3)
});

/**
 * @typedef {Object} GoodLeapLoanDetails
 * @property {boolean} hasLoan
 * @property {'Active' | 'Paid Off' | null} status
 * @property {string | null} loanId
 * @property {string | null} purpose
 * @property {number | null} balance
 * @property {number | null} apr
 * @property {number | null} yearsSinceOrigination
 */

/**
 * @typedef {Object} LiabilitySummary
 * @property {number} totalAccounts
 * @property {number} mortgageCount
 * @property {number} installmentCount
 * @property {number} revolvingCount
 * @property {number} totalBalance
 * @property {number} totalMonthlyPayment
 * @property {number} revolvingUtilization
 * @property {'Low' | 'Moderate' | 'High'} utilizationBucket
 * @property {{ creditor: string, amount: number } | null} topObligation
 * @property {Array<{ creditor: string, type: string, balance: number, payment: number, selected: boolean }>} accounts
 */

/**
 * @typedef {Object} PropertyDetails
 * @property {string} address
 * @property {string} city
 * @property {string} state
 * @property {string} zip
 * @property {number | null} yearsOwned
 * @property {number | null} appreciation
 */

/**
 * @typedef {Object} ValuationFacts
 * @property {number | null} avmValue
 * @property {number | null} avmLow
 * @property {number | null} avmHigh
 * @property {number | null} confidence
 * @property {number | null} pricePerSqFt
 * @property {number | null} lastSoldPrice
 * @property {string | null} lastSoldDate
 */

/**
 * @typedef {Object} WeatherSummary
 * @property {number} temp
 * @property {string} condition
 */

/**
 * @typedef {Object} MarketSummary
 * @property {string} title
 * @property {string} summary
 */

/**
 * @typedef {Object} NewsHeadline
 * @property {string} title
 * @property {string} source
 * @property {string} recency
 */

/**
 * @typedef {Object} GoodLeapSummaryInput
 * @property {number} totalDebt
 * @property {number} monthlyObligations
 * @property {number} estimatedEquity
 * @property {'Low' | 'Moderate' | 'High'} equityBucket
 * @property {'Low' | 'Moderate' | 'High'} monthlyPressureBucket
 * @property {'Prime' | 'Near Prime' | 'Subprime'} creditTier
 * @property {GoodLeapLoanDetails} goodLeapLoan
 * @property {LiabilitySummary} liabilities
 * @property {PropertyDetails} property
 * @property {ValuationFacts} valuation
 * @property {WeatherSummary | null} weather
 * @property {MarketSummary | null} market
 * @property {NewsHeadline[]} news
 */

/**
 * @typedef {Object} LLMGuidance
 * @property {string} conversationPosture
 * @property {string} bestOpeningAngle
 * @property {string} confidenceFraming
 * @property {string} primaryExplorationPath
 * @property {string} avoidLeadingWith
 * @property {string | null} valuationNote
 * @property {string[]} conversationStarters
 */

/**
 * @typedef {Object} GoodLeapSummaryViewModel
 * @property {number} totalDebt
 * @property {number} monthlyObligations
 * @property {number} estimatedEquity
 * @property {GoodLeapLoanDetails} goodLeapLoan
 * @property {LiabilitySummary} liabilities
 * @property {PropertyDetails} property
 * @property {ValuationFacts} valuation
 * @property {WeatherSummary | null} weather
 * @property {MarketSummary | null} market
 * @property {NewsHeadline[]} news
 * @property {LLMGuidance | null} guidance
 * @property {boolean} isLoading
 * @property {string | null} error
 * @property {Date | null} lastRefreshed
 */

/**
 * Fallback guidance when LLM fails
 */
export const FALLBACK_GUIDANCE = {
    conversationPosture: 'Check-in',
    bestOpeningAngle: 'Start with a friendly check-in about their current situation.',
    confidenceFraming: 'This is a routine check-in to understand their current needs.',
    primaryExplorationPath: 'Ask about any changes in their financial situation or goals.',
    avoidLeadingWith: 'Specific product recommendations before understanding their needs.',
    valuationNote: null,
    conversationStarters: [
        "How have things been going since we last connected?",
        "Have there been any changes to your financial goals recently?",
        "Is there anything specific you'd like to discuss today?"
    ]
};

/**
 * Determine equity bucket based on estimated equity
 */
export function getEquityBucket(equity) {
    if (equity >= 200000) return 'High';
    if (equity >= 50000) return 'Moderate';
    return 'Low';
}

/**
 * Determine monthly pressure bucket based on DTI-like ratio
 */
export function getMonthlyPressureBucket(monthlyObligations, estimatedIncome = 15000) {
    const ratio = monthlyObligations / estimatedIncome;
    if (ratio >= 0.43) return 'High';
    if (ratio >= 0.28) return 'Moderate';
    return 'Low';
}

/**
 * Determine credit tier based on FICO score
 */
export function getCreditTier(ficoScore) {
    if (ficoScore >= 670) return 'Prime';
    if (ficoScore >= 580) return 'Near Prime';
    return 'Subprime';
}

/**
 * Get utilization bucket
 */
export function getUtilizationBucket(utilization) {
    if (utilization >= 50) return 'High';
    if (utilization >= 30) return 'Moderate';
    return 'Low';
}





