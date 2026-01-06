import { z } from 'zod';

// Borrower Snapshot
export const BorrowerSnapshotSchema = z.object({
    property_value: z.number(),
    total_liens: z.number(),
    estimated_equity: z.number(),
    consolidation_budget: z.number(),
    total_monthly_non_mortgage: z.number()
});

// Debt included for payoff
export const DebtIncludedSchema = z.object({
    creditor: z.string(),
    balance: z.number(),
    rate: z.string(),
    rate_assumed: z.boolean().optional(),
    monthly_payment: z.number(),
    priority: z.enum(['High Priority', 'Medium Priority', 'Low Priority'])
});

// Debt excluded from payoff
export const DebtExcludedSchema = z.object({
    creditor: z.string(),
    reason: z.string()
});

// Payoff Assessment
export const PayoffAssessmentSchema = z.object({
    can_pay_all: z.boolean(),
    plan_type: z.string(),
    debts_included: z.array(DebtIncludedSchema),
    debts_excluded: z.array(DebtExcludedSchema).optional(),
    total_balance_to_payoff: z.number(),
    monthly_payments_eliminated: z.number(),
    budget_remaining: z.number()
});

// Credit Score Impact (Task 3: Updated to safer structure)
export const CreditScoreImpactSchema = z.object({
    direction: z.enum(['Likely positive', 'Neutral', 'Unclear']),
    drivers: z.array(z.string()),
    note: z.string()
});

// Main AI response schema
export const LiabilityAIResponseSchema = z.object({
    borrower_snapshot: BorrowerSnapshotSchema,
    key_observations: z.array(z.string()),
    payoff_assessment: PayoffAssessmentSchema,
    refinance_benefits: z.array(z.string()),
    assumptions_used: z.array(z.string()),
    credit_score_impact: CreditScoreImpactSchema.optional(),
    recommended_next_step: z.string(),
    conversation_opener: z.string()
});

// Input schema for the component
export const LiabilityAIInputSchema = z.object({
    accounts: z.array(z.object({
        creditor: z.string(),
        accountType: z.string(),
        balance: z.number(),
        payment: z.number(),
        interestRate: z.number().optional(),
        utilization: z.number().optional(),
        creditLimit: z.number().optional()
    })),
    propertyValue: z.number(),
    proposedMortgageRate: z.number().optional()
});
