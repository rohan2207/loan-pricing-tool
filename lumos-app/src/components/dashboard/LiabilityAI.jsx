import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { 
    RefreshCw, 
    Copy, 
    Check,
    TrendingUp,
    TrendingDown,
    AlertCircle,
    DollarSign,
    Target,
    MessageCircle,
    CreditCard,
    Sparkles,
    ChevronDown,
    ChevronUp,
    Zap,
    Star,
    Info,
    ShieldAlert,
    Home,
    CheckCircle,
    XCircle,
    ArrowRight,
    Lightbulb,
    BarChart3,
    PiggyBank,
    Building
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { analyzeLiabilities, getPriorityTier } from '../../services/liabilityAILLM';
import '../../styles/bento.css';

// Format helpers
const fmt = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n || 0);
const fmtK = (n) => n ? `$${(n / 1000).toFixed(0)}K` : '$0';

export function LiabilityAI({ accounts = [], borrowerData, onClose, embedded = false }) {
    const [isLoading, setIsLoading] = useState(false);
    const [analysis, setAnalysis] = useState(null);
    const [error, setError] = useState(null);
    const [copied, setCopied] = useState(false);
    const [showAccounts, setShowAccounts] = useState(false);

    const propertyValue = borrowerData?.property?.avmValue || 785000;

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

    const formattedAccounts = useMemo(() => {
        return accounts.map(acc => {
            const priority = getPriorityTier(acc.accountType);
            return {
                creditor: acc.creditor || acc.name || 'Unknown',
                accountType: acc.accountType || acc.type || 'Unknown',
                balance: parseAmount(acc.balance),
                payment: parseAmount(acc.payment || acc.monthlyPayment),
                interestRate: parseRate(acc.interestRate || acc.rate),
                priority: priority.label,
                priorityTier: priority.tier
            };
        });
    }, [accounts]);

    const equityCalc = useMemo(() => {
        const liens = formattedAccounts.filter(acc => {
            const type = (acc.accountType || '').toLowerCase();
            return type.includes('mortgage') || type.includes('heloc');
        });
        const totalLiens = liens.reduce((sum, acc) => sum + acc.balance, 0);
        const estimatedEquity = propertyValue - totalLiens;
        const consolidationBudget = Math.max(0, propertyValue * 0.8 - totalLiens);
        
        const nonMortgage = formattedAccounts.filter(acc => {
            const type = (acc.accountType || '').toLowerCase();
            return !type.includes('mortgage') && !type.includes('heloc');
        });
        const totalNonMortgageBalance = nonMortgage.reduce((sum, acc) => sum + acc.balance, 0);
        const totalNonMortgagePayment = nonMortgage.reduce((sum, acc) => sum + acc.payment, 0);
        
        return {
            propertyValue,
            totalLiens,
            estimatedEquity,
            consolidationBudget,
            totalNonMortgageBalance,
            totalNonMortgagePayment,
            nonMortgageCount: nonMortgage.length,
            canPayAll: consolidationBudget >= totalNonMortgageBalance
        };
    }, [formattedAccounts, propertyValue]);

    const handleRefresh = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        setAnalysis(null);
        
        try {
            const result = await analyzeLiabilities(formattedAccounts, propertyValue, 7.0);
            setAnalysis(result);
        } catch (err) {
            console.error('Failed:', err);
            setError(err.message || 'Failed to analyze liabilities');
        } finally {
            setIsLoading(false);
        }
    }, [formattedAccounts, propertyValue]);

    useEffect(() => {
        handleRefresh();
    }, []);

    const handleCopy = useCallback(() => {
        if (!analysis) return;
        const text = `LIABILITY ANALYSIS\n\nProperty: ${fmt(equityCalc.propertyValue)}\nEquity: ${fmt(equityCalc.estimatedEquity)}\nBudget: ${fmt(equityCalc.consolidationBudget)}\n\nPayoff Plan: ${analysis.payoff_assessment?.plan_type}\nPayments Eliminated: ${fmt(analysis.payoff_assessment?.monthly_payments_eliminated)}/mo\n\nNext Step: ${analysis.recommended_next_step}`;
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }, [analysis, equityCalc]);

    const savings = analysis?.payoff_assessment?.monthly_payments_eliminated || 0;

    return (
        <div className="h-full flex flex-col bg-[#f5f5f7]">
            {/* Header - hidden when embedded */}
            {!embedded && (
                <div className="px-6 py-5 bg-white border-b border-black/5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="bento-icon bento-icon-purple">
                                <CreditCard size={22} className="text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-[#1d1d1f] tracking-tight">Liability AI</h1>
                                <p className="text-sm text-[#86868b]">Equity-Based Consolidation Analysis</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button onClick={handleRefresh} disabled={isLoading} className="bento-btn bento-btn-secondary">
                                <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
                            </button>
                            <button onClick={handleCopy} disabled={!analysis} className="bento-btn bento-btn-secondary">
                                {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* AI Notice */}
            <div className={cn("bg-amber-50 border-b border-amber-100 flex items-center justify-between", embedded ? "px-4 py-2" : "px-6 py-2")}>
                <p className="text-xs text-amber-700">
                    <span className="font-semibold">AI-Generated</span> — Estimates only. Verify before decisions.
                </p>
                {embedded && (
                    <button onClick={handleRefresh} disabled={isLoading} className="p-1.5 hover:bg-amber-100 rounded-lg transition-colors">
                        <RefreshCw size={14} className={cn("text-amber-700", isLoading && 'animate-spin')} />
                    </button>
                )}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center mb-4 animate-pulse">
                            <Sparkles size={28} className="text-white" />
                        </div>
                        <p className="text-lg font-semibold text-[#1d1d1f]">Analyzing Liabilities...</p>
                        <p className="text-sm text-[#86868b] mt-1">Calculating consolidation opportunities</p>
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-16 h-16 rounded-2xl bg-red-100 flex items-center justify-center mb-4">
                            <AlertCircle size={28} className="text-red-500" />
                        </div>
                        <p className="text-lg font-semibold text-red-600 mb-2">Analysis Failed</p>
                        <p className="text-sm text-[#86868b] mb-4">{error}</p>
                        <button onClick={handleRefresh} className="bento-btn bento-btn-primary">
                            <RefreshCw size={16} /> Retry
                        </button>
                    </div>
                ) : analysis && (
                    <div className="space-y-4 max-w-2xl mx-auto">
                        {/* Equity Snapshot - Bento Grid */}
                        <div className="bento-grid-4 bento-animate">
                            <div className="bento-card p-4">
                                <div className="bento-icon-sm bento-icon-blue mb-2">
                                    <Home size={14} className="text-white" />
                                </div>
                                <p className="bento-value-sm">{fmtK(equityCalc.propertyValue)}</p>
                                <p className="bento-label mt-1">Property</p>
                            </div>
                            <div className="bento-card p-4">
                                <div className="bento-icon-sm bg-slate-500 mb-2">
                                    <Building size={14} className="text-white" />
                                </div>
                                <p className="bento-value-sm">{fmtK(equityCalc.totalLiens)}</p>
                                <p className="bento-label mt-1">Liens</p>
                            </div>
                            <div className="bento-card p-4 bento-tint-green">
                                <div className="bento-icon-sm bento-icon-green mb-2">
                                    <TrendingUp size={14} className="text-white" />
                                </div>
                                <p className="bento-value-sm text-green-600">{fmtK(equityCalc.estimatedEquity)}</p>
                                <p className="bento-label mt-1 text-green-700">Equity</p>
                            </div>
                            <div className="bento-card p-4 bento-tint-purple">
                                <div className="bento-icon-sm bento-icon-purple mb-2">
                                    <PiggyBank size={14} className="text-white" />
                                </div>
                                <p className="bento-value-sm text-purple-600">{fmtK(equityCalc.consolidationBudget)}</p>
                                <p className="bento-label mt-1 text-purple-700">Budget</p>
                            </div>
                        </div>

                        {/* Budget Progress */}
                        <div className="bento-card p-5 bento-animate bento-animate-delay-1">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-sm font-medium text-[#1d1d1f]">Consolidation Budget</span>
                                <span className="text-sm text-[#86868b]">{fmtK(analysis.payoff_assessment?.total_balance_to_payoff || 0)} of {fmtK(equityCalc.consolidationBudget)}</span>
                            </div>
                            <div className="bento-progress">
                                <div 
                                    className="bento-progress-bar bg-gradient-to-r from-purple-500 to-indigo-500"
                                    style={{ width: `${Math.min(100, ((analysis.payoff_assessment?.total_balance_to_payoff || 0) / equityCalc.consolidationBudget) * 100)}%` }}
                                />
                            </div>
                        </div>

                        {/* Today vs After - Side by Side */}
                        <div className="bento-grid-2 bento-animate bento-animate-delay-2">
                            <div className="bento-card p-5">
                                <p className="bento-label mb-4">Today</p>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-[#86868b]">Non-mortgage debts</span>
                                        <span className="text-lg font-bold text-[#1d1d1f]">{equityCalc.nonMortgageCount}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-[#86868b]">Monthly payments</span>
                                        <span className="text-lg font-bold text-red-500">{fmt(equityCalc.totalNonMortgagePayment)}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="bento-card p-5 bento-tint-green">
                                <p className="bento-label text-green-600 mb-4">After Refinance</p>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-green-700">Remaining debts</span>
                                        <span className="text-lg font-bold text-green-600">{analysis.payoff_assessment?.debts_excluded?.length || 0}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-green-700">Payment reduction</span>
                                        <span className="text-lg font-bold text-green-600">-{fmt(savings)}/mo</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Consolidation Summary - Task 4: No hallucinated savings */}
                        <div className="bento-card overflow-hidden bento-animate bento-animate-delay-3">
                            <div className="p-6 bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
                                <div className="grid grid-cols-2 gap-6 text-center">
                                    <div>
                                        <p className="text-sm opacity-80 mb-1">Monthly Payments Eliminated</p>
                                        <p className="text-3xl font-bold">{fmt(savings)}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm opacity-80 mb-1">Debts Consolidated</p>
                                        <p className="text-3xl font-bold">{analysis.payoff_assessment?.debts_included?.length || 0}</p>
                                    </div>
                                </div>
                                <p className="text-xs text-center mt-4 opacity-70">
                                    Note: New mortgage payment depends on final rate and term. This shows only payments eliminated, not net change.
                                </p>
                            </div>
                        </div>

                        {/* Key Observations */}
                        <div className="bento-card p-5">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="bento-icon-sm bg-gradient-to-br from-amber-400 to-orange-500">
                                    <Lightbulb size={16} className="text-white" />
                                </div>
                                <h3 className="font-semibold text-[#1d1d1f]">Key Observations</h3>
                            </div>
                            <div className="space-y-2">
                                {analysis.key_observations?.map((obs, idx) => (
                                    <div key={idx} className="flex items-start gap-3">
                                        <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-600 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{idx + 1}</span>
                                        <p className="text-sm text-[#1d1d1f]">{obs}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Payoff Plan */}
                        <div className="bento-card overflow-hidden">
                            <div className="p-5 flex items-center justify-between border-b border-black/5">
                                <div className="flex items-center gap-3">
                                    <div className="bento-icon-sm bento-icon-purple">
                                        <Target size={16} className="text-white" />
                                    </div>
                                    <h3 className="font-semibold text-[#1d1d1f]">Payoff Plan</h3>
                                </div>
                                <span className={cn("bento-pill", analysis.payoff_assessment?.can_pay_all ? "bento-pill-green" : "bento-pill-orange")}>
                                    {analysis.payoff_assessment?.plan_type}
                                </span>
                            </div>
                            
                            <div className="p-5 space-y-3">
                                <p className="bento-label">Debts to Pay Off ({analysis.payoff_assessment?.debts_included?.length || 0})</p>
                                {analysis.payoff_assessment?.debts_included?.map((debt, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-green-50 border border-green-100">
                                        <div className="flex items-center gap-3">
                                            <CheckCircle size={18} className="text-green-500" />
                                            <div>
                                                <p className="text-sm font-medium text-[#1d1d1f]">{debt.creditor}</p>
                                                <p className="text-xs text-[#86868b]">{debt.rate} {debt.rate_assumed && <span className="text-amber-600">(assumed)</span>}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-bold text-[#1d1d1f]">{fmt(debt.balance)}</p>
                                            <p className="text-xs text-green-600">-{fmt(debt.monthly_payment)}/mo</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {analysis.payoff_assessment?.debts_excluded?.length > 0 && (
                                <div className="px-5 pb-5">
                                    <p className="bento-label mb-2">Excluded</p>
                                    {analysis.payoff_assessment.debts_excluded.map((debt, idx) => (
                                        <div key={idx} className="flex items-center gap-2 text-sm text-[#86868b] py-1">
                                            <XCircle size={14} />
                                            <span className="font-medium">{debt.creditor}:</span>
                                            <span>{debt.reason}</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="p-5 bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm opacity-80">Total to Consolidate</span>
                                    <span className="text-2xl font-bold">{fmt(analysis.payoff_assessment?.total_balance_to_payoff)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Credit Score Impact - Task 3: Safer direction/drivers structure */}
                        {analysis.credit_score_impact && (
                            <div className="bento-card p-5">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className={cn(
                                        "bento-icon-sm",
                                        analysis.credit_score_impact.direction === 'Likely positive' ? "bento-icon-green" :
                                        analysis.credit_score_impact.direction === 'Neutral' ? "bg-slate-500" : "bento-icon-orange"
                                    )}>
                                        {analysis.credit_score_impact.direction === 'Likely positive' ? 
                                            <TrendingUp size={16} className="text-white" /> :
                                            analysis.credit_score_impact.direction === 'Neutral' ?
                                            <TrendingDown size={16} className="text-white" /> :
                                            <AlertCircle size={16} className="text-white" />
                                        }
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-[#1d1d1f]">Potential Credit Impact</h3>
                                        <span className={cn(
                                            "bento-pill text-xs",
                                            analysis.credit_score_impact.direction === 'Likely positive' ? "bento-pill-green" :
                                            analysis.credit_score_impact.direction === 'Neutral' ? "bento-pill-gray" : "bento-pill-orange"
                                        )}>
                                            {analysis.credit_score_impact.direction}
                                        </span>
                                    </div>
                                </div>
                                
                                {analysis.credit_score_impact.drivers?.length > 0 && (
                                    <div className="mb-3">
                                        <p className="bento-label mb-2">Key Drivers</p>
                                        <div className="flex flex-wrap gap-2">
                                            {analysis.credit_score_impact.drivers.map((driver, idx) => (
                                                <span key={idx} className="bento-pill bento-pill-blue text-[10px]">{driver}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                
                                <p className="text-xs text-[#86868b] italic">{analysis.credit_score_impact.note}</p>
                            </div>
                        )}

                        {/* Benefits */}
                        <div className="bento-card p-5">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="bento-icon-sm bento-icon-green">
                                    <TrendingUp size={16} className="text-white" />
                                </div>
                                <h3 className="font-semibold text-[#1d1d1f]">Refinance Benefits</h3>
                            </div>
                            <div className="space-y-2">
                                {analysis.refinance_benefits?.map((benefit, idx) => (
                                    <div key={idx} className="flex items-start gap-3">
                                        <CheckCircle size={16} className="text-green-500 mt-0.5" />
                                        <p className="text-sm text-[#1d1d1f]">{benefit}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Next Step */}
                        <div className="bento-card overflow-hidden">
                            <div className="p-5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                                <div className="flex items-center gap-2 mb-2">
                                    <ArrowRight size={16} />
                                    <span className="text-xs uppercase tracking-wide opacity-80">Recommended Next Step</span>
                                </div>
                                <p className="text-sm">{analysis.recommended_next_step}</p>
                            </div>
                        </div>

                        {/* Conversation Opener */}
                        <div className="bento-card p-5">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="bento-icon-sm bento-icon-orange">
                                    <MessageCircle size={16} className="text-white" />
                                </div>
                                <span className="text-xs text-[#86868b] uppercase tracking-wide">Conversation Opener</span>
                            </div>
                            <p className="text-sm text-[#1d1d1f] italic">"{analysis.conversation_opener}"</p>
                        </div>

                        {/* Assumptions */}
                        {analysis.assumptions_used?.length > 0 && (
                            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                                <p className="bento-label mb-2 flex items-center gap-2"><Info size={12} /> Assumptions Used</p>
                                <div className="space-y-1">
                                    {analysis.assumptions_used.map((a, idx) => (
                                        <p key={idx} className="text-xs text-[#86868b]">• {a}</p>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* All Accounts Footer */}
            <div className="border-t border-black/5 bg-white">
                <button
                    onClick={() => setShowAccounts(!showAccounts)}
                    className="w-full p-4 flex items-center justify-between hover:bg-black/[0.02] transition-colors"
                >
                    <span className="text-sm font-medium text-[#1d1d1f]">All Accounts ({formattedAccounts.length})</span>
                    <ChevronDown size={18} className={cn("text-[#86868b] transition-transform", showAccounts && "rotate-180")} />
                </button>
                {showAccounts && (
                    <div className="px-4 pb-4 max-h-48 overflow-y-auto">
                        {formattedAccounts.map((acc, idx) => (
                            <div key={idx} className="flex items-center justify-between py-2 border-b border-black/5 last:border-0">
                                <div className="flex items-center gap-3">
                                    <span className={cn("bento-pill text-[10px]", 
                                        acc.priority === 'High Priority' ? 'bento-pill-red' : 
                                        acc.priority === 'Medium Priority' ? 'bento-pill-orange' : 'bento-pill-gray'
                                    )}>
                                        {acc.priority?.replace(' Priority', '')}
                                    </span>
                                    <div>
                                        <span className="text-sm font-medium text-[#1d1d1f]">{acc.creditor}</span>
                                        <span className="text-xs text-[#86868b] ml-2">{acc.accountType}</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="text-sm font-bold text-[#1d1d1f]">{fmt(acc.balance)}</span>
                                    <span className="text-xs text-[#86868b] ml-2">{fmt(acc.payment)}/mo</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
