import { z } from 'zod';

// ============================================================
// INTEREST RATE ASSUMPTIONS (for UI display)
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

export const LiabilityAIResponseSchema = z.object({
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
// API BASE URL (Vite proxies /api/ai to server in dev)
// ============================================================
const API_BASE = '/api/ai';

// ============================================================
// HELPER FUNCTIONS (exported for UI use)
// ============================================================
export function estimateRateByType(accountType) {
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

export function getPriorityTier(accountType) {
    const type = (accountType || '').toLowerCase();
    if (type.includes('revolving') || type.includes('credit')) return { tier: 1, label: 'High Priority' };
    if (type.includes('installment') || type.includes('personal')) return { tier: 2, label: 'Medium Priority' };
    if (type.includes('auto') || type.includes('car')) return { tier: 3, label: 'Medium Priority' };
    if (type.includes('student')) return { tier: 4, label: 'Low Priority' };
    return { tier: 5, label: 'Low Priority' };
}

// ============================================================
// MAIN FUNCTION - Calls server API
// ============================================================
export async function analyzeLiabilities(accounts, propertyValue = 785000, proposedRate = 7.0) {
    console.log('══════════════════════════════════════════════');
    console.log('🔍 LIABILITY AI - CALLING SERVER API');
    console.log('══════════════════════════════════════════════');
    console.log('📊 Accounts:', accounts.length);
    console.log('🏠 Property Value:', propertyValue);
    
    try {
        const startTime = Date.now();
        
        const response = await fetch(`${API_BASE}/liability`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                accounts,
                propertyValue,
                proposedRate
            })
        });

        console.log(`⏱️ Response in ${Date.now() - startTime}ms`);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            
            if (response.status === 422) {
                console.error('❌ Validation error:', errorData);
                throw new Error(`AI response validation failed: ${errorData.error || 'Unknown error'}`);
            }
            
            throw new Error(errorData.error || `Server error: ${response.status}`);
        }

        const data = await response.json();
        
        // Validate on client side as well for type safety
        const validated = LiabilityAIResponseSchema.safeParse(data);
        
        if (!validated.success) {
            console.warn('⚠️ Client-side validation issues:', validated.error.errors);
            // Return data anyway since server already validated
            return data;
        }
        
        console.log('✅ Liability analysis received successfully');
        console.log('💰 Budget:', validated.data.borrower_snapshot?.consolidation_budget);
        console.log('📋 Debts to payoff:', validated.data.payoff_assessment?.debts_included?.length);
        
        return validated.data;
        
    } catch (error) {
        console.error('════════════════════════════════════════════════');
        console.error('❌ LIABILITY AI ERROR');
        console.error('Message:', error.message);
        console.error('════════════════════════════════════════════════');
        throw error;
    }
}
OKay n