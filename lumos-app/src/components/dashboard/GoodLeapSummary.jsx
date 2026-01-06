import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { 
    RefreshCw, 
    Copy, 
    Check,
    ChevronDown,
    ChevronUp,
    Sparkles,
    Sun,
    Cloud,
    CloudRain,
    TrendingUp,
    Home,
    MessageCircle,
    CheckCircle,
    Target,
    HelpCircle,
    Newspaper,
    Zap,
    ShieldAlert,
    DollarSign,
    ArrowRight,
    Lightbulb,
    Phone,
    MapPin,
    Trophy,
    Thermometer,
    Building,
    CreditCard,
    PiggyBank
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { generateCallPrepBrief } from '../../services/goodleapSummaryLLM';
import { getAllLocalContext } from '../../services/localContextAPI';
import '../../styles/bento.css';

// Format helpers
const fmt = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n || 0);
const fmtK = (n) => n ? `$${(n / 1000).toFixed(0)}K` : '$0';

// Weather icon component
function WeatherIcon({ condition, size = 20 }) {
    const cond = (condition || '').toLowerCase();
    if (cond.includes('rain') || cond.includes('shower')) return <CloudRain size={size} className="text-blue-500" />;
    if (cond.includes('cloud') || cond.includes('overcast')) return <Cloud size={size} className="text-slate-400" />;
    return <Sun size={size} className="text-amber-500" />;
}

// Build input from accounts and borrowerData
function buildInput(accounts, borrowerData) {
    const property = borrowerData?.property || {};
    const creditScores = borrowerData?.creditScores || {};
    const consumerFinance = borrowerData?.consumerFinance || {};

    const parseAmount = (val) => {
        if (typeof val === 'number') return val;
        if (typeof val === 'string') return parseFloat(val.replace(/[$,]/g, '')) || 0;
        return 0;
    };

    const liabilities = accounts.map(acc => ({
        creditor: acc.creditor,
        type: acc.accountType,
        balance: parseAmount(acc.balance),
        payment: parseAmount(acc.payment)
    }));

    const totals = liabilities.reduce((acc, l) => {
        acc.totalBalance += l.balance;
        acc.totalPayment += l.payment;
        return acc;
    }, { totalBalance: 0, totalPayment: 0 });

    let yearsSinceOrigination = null;
    if (consumerFinance.originationDate) {
        yearsSinceOrigination = Math.floor((Date.now() - new Date(consumerFinance.originationDate).getTime()) / (365.25 * 24 * 60 * 60 * 1000));
    }

    const creditTier = creditScores.borrower >= 670 ? 'Prime' : creditScores.borrower >= 580 ? 'Near Prime' : 'Subprime';

    return {
        totalDebt: totals.totalBalance,
        monthlyObligations: totals.totalPayment,
        estimatedEquity: property.currentEquity || 0,
        creditTier,
        creditScores,
        goodLeapLoan: {
            hasLoan: !!consumerFinance.loanNumber,
            status: consumerFinance.status || null,
            loanId: consumerFinance.loanNumber || null,
            purpose: consumerFinance.product || null,
            balance: consumerFinance.unpaidBalance || null,
            apr: consumerFinance.rate || null,
            yearsSinceOrigination
        },
        property: {
            address: property.address || '',
            city: property.city || 'McKinney',
            state: property.state || 'TX',
            zip: property.zip || ''
        },
        valuation: {
            avmValue: property.avmValue || null
        },
        liabilities
    };
}

export function GoodLeapSummary({ accounts = [], borrowerData, onClose, embedded = false, autoLoad = true, cachedData = null }) {
    const [isLoading, setIsLoading] = useState(false);
    const [brief, setBrief] = useState(cachedData?.brief || null);
    const [localContext, setLocalContext] = useState(cachedData?.localContext || null);
    const [error, setError] = useState(null);
    const [copied, setCopied] = useState(false);
    const [showTalkTrack, setShowTalkTrack] = useState(true);
    const [showLocal, setShowLocal] = useState(true);

    const input = useMemo(() => buildInput(accounts, borrowerData), [accounts, borrowerData]);

    const handleRefresh = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        setBrief(null);
        setLocalContext(null);
        
        try {
            const [contextResult, briefResult] = await Promise.all([
                getAllLocalContext(input.property.city, input.property.state, input.property.zip),
                generateCallPrepBrief(input)
            ]);
            
            setLocalContext(contextResult);
            setBrief(briefResult);
        } catch (err) {
            console.error('Failed:', err);
            setError(err.message || 'Failed to generate brief');
        } finally {
            setIsLoading(false);
        }
    }, [input]);

    useEffect(() => {
        // Only auto-load if enabled and no cached data
        if (autoLoad && !cachedData) {
            handleRefresh();
        }
    }, [autoLoad, cachedData]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'c' && !e.metaKey && !e.ctrlKey && brief?.one_line_summary) {
                if (document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
                    navigator.clipboard.writeText(brief.one_line_summary);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [brief]);

    return (
        <div className="h-full flex flex-col bg-[#f5f5f7]">
            {/* Header - hidden when embedded */}
            {!embedded && (
                <div className="px-6 py-5 bg-white border-b border-black/5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="bento-icon bento-icon-blue">
                                <Phone size={22} className="text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-[#1d1d1f] tracking-tight">Call Prep Brief</h1>
                                <p className="text-sm text-[#86868b]">Everything you need for the first 5 minutes</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button 
                                onClick={handleRefresh} 
                                disabled={isLoading}
                                className="bento-btn bento-btn-secondary"
                            >
                            <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
                        </button>
                    </div>
                </div>
            </div>
            )}

            {/* AI Notice */}
            <div className="px-4 py-2 bg-amber-50 border-b border-amber-100 flex items-center justify-between">
                <p className="text-xs text-amber-700">
                    <span className="font-semibold">AI-Generated</span> — Verify all facts
                </p>
                {embedded && (
                    <button 
                        onClick={handleRefresh} 
                        disabled={isLoading}
                        className="p-1.5 hover:bg-amber-100 rounded-lg transition-colors"
                    >
                        <RefreshCw size={14} className={cn("text-amber-700", isLoading && 'animate-spin')} />
                    </button>
                )}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-4 animate-pulse">
                            <Sparkles size={28} className="text-white" />
                        </div>
                        <p className="text-lg font-semibold text-[#1d1d1f]">Preparing your brief...</p>
                        <p className="text-sm text-[#86868b] mt-1">Analyzing customer data</p>
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-16 h-16 rounded-2xl bg-red-100 flex items-center justify-center mb-4">
                            <ShieldAlert size={28} className="text-red-500" />
                        </div>
                        <p className="text-lg font-semibold text-red-600 mb-2">Failed to generate brief</p>
                        <p className="text-sm text-[#86868b] mb-4">{error}</p>
                        <button onClick={handleRefresh} className="bento-btn bento-btn-primary">
                            <RefreshCw size={16} /> Retry
                        </button>
                    </div>
                ) : brief && (
                    <div className="space-y-4 max-w-2xl mx-auto">
                        {/* One-Liner Hero */}
                        <div className="bento-card p-6 bento-animate">
                            <div className="flex items-start justify-between gap-4">
                                <p className="text-lg font-medium text-[#1d1d1f] leading-relaxed">
                                    {brief.one_line_summary}
                                </p>
                                <button 
                                    onClick={() => {
                                        navigator.clipboard.writeText(brief.one_line_summary);
                                        setCopied(true);
                                        setTimeout(() => setCopied(false), 2000);
                                    }}
                                    className="p-2 rounded-lg hover:bg-black/5 transition-colors flex-shrink-0"
                                >
                                    {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} className="text-[#86868b]" />}
                                </button>
                            </div>
                            <p className="text-xs text-[#86868b] mt-3">Press <kbd className="px-1.5 py-0.5 bg-black/5 rounded text-[10px] font-mono">C</kbd> to copy</p>
                        </div>

                        {/* Key Numbers - Bento Grid */}
                        <div className="bento-grid-3 bento-animate bento-animate-delay-1">
                            <div className="bento-card p-4">
                                <div className="bento-icon-sm bento-icon-blue mb-3">
                                    <Home size={16} className="text-white" />
                                </div>
                                <p className="bento-value-sm">{fmtK(brief.key_numbers?.working_property_value)}</p>
                                <p className="bento-label mt-1">Property Value</p>
                            </div>
                            <div className="bento-card p-4">
                                <div className="bento-icon-sm bento-icon-purple mb-3">
                                    <Building size={16} className="text-white" />
                                </div>
                                <p className="bento-value-sm">{fmtK(brief.key_numbers?.total_liens)}</p>
                                <p className="bento-label mt-1">Total Liens</p>
                            </div>
                            <div className="bento-card p-4 bento-tint-green">
                                <div className="bento-icon-sm bento-icon-green mb-3">
                                    <TrendingUp size={16} className="text-white" />
                                </div>
                                <p className="bento-value-sm text-green-600">{fmtK(brief.key_numbers?.estimated_equity)}</p>
                                <p className="bento-label mt-1 text-green-700">Equity</p>
                            </div>
                        </div>

                        <div className="bento-grid-3 bento-animate bento-animate-delay-2">
                            <div className="bento-card p-4">
                                <div className="bento-icon-sm bento-icon-orange mb-3">
                                    <CreditCard size={16} className="text-white" />
                                </div>
                                <p className="bento-value-sm">{fmtK(brief.key_numbers?.total_non_mortgage_debt)}</p>
                                <p className="bento-label mt-1">Other Debt</p>
                            </div>
                            <div className="bento-card p-4">
                                <div className="bento-icon-sm bento-icon-red mb-3">
                                    <DollarSign size={16} className="text-white" />
                                </div>
                                <p className="bento-value-sm">{fmt(brief.key_numbers?.total_monthly_payments)}</p>
                                <p className="bento-label mt-1">Monthly</p>
                            </div>
                            <div className="bento-card p-4">
                                <div className="bento-icon-sm bg-gradient-to-br from-slate-600 to-slate-800 mb-3">
                                    <PiggyBank size={16} className="text-white" />
                                </div>
                                <p className="bento-value-sm">{brief.key_numbers?.credit_snapshot}</p>
                                <p className="bento-label mt-1">Credit</p>
                            </div>
                        </div>

                        {/* How We Can Help */}
                        <div className="bento-card overflow-hidden bento-animate bento-animate-delay-3">
                            <div className="p-5 bento-tint-purple">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="bento-icon-sm bento-icon-purple">
                                        <Zap size={16} className="text-white" />
                                    </div>
                                    <h3 className="font-semibold text-[#1d1d1f]">How We Can Help</h3>
                                </div>
                                <div className="space-y-3">
                                    {brief.how_we_can_help?.map((item, idx) => (
                                        <div key={idx} className="flex items-start gap-3">
                                            <CheckCircle size={18} className="text-purple-500 mt-0.5 flex-shrink-0" />
                                            <p className="text-sm text-[#1d1d1f]">{item}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="p-4 border-t border-black/5">
                                <button className="bento-btn bento-btn-primary w-full">
                                    <Target size={16} />
                                    View Recommended Payoff Plan
                                    <ArrowRight size={16} />
                                </button>
                            </div>
                        </div>

                        {/* Talk Track */}
                        <div className="bento-card overflow-hidden bento-animate bento-animate-delay-4">
                            <button 
                                onClick={() => setShowTalkTrack(!showTalkTrack)}
                                className="w-full p-5 flex items-center justify-between hover:bg-black/[0.02] transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="bento-icon-sm bento-icon-orange">
                                        <MessageCircle size={16} className="text-white" />
                                    </div>
                                    <h3 className="font-semibold text-[#1d1d1f]">Suggested Talk Track</h3>
                                </div>
                                <ChevronDown size={20} className={cn("text-[#86868b] transition-transform", showTalkTrack && "rotate-180")} />
                            </button>
                            
                            {showTalkTrack && (
                                <div className="px-5 pb-5 space-y-3">
                                    <div className="p-4 rounded-xl bg-orange-50 border border-orange-100">
                                        <p className="bento-label text-orange-600 mb-2">Opening Line</p>
                                        <p className="text-sm text-[#1d1d1f] italic">"{brief.suggested_talk_track?.opening_line}"</p>
                                    </div>
                                    
                                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                                        <p className="bento-label mb-2">Discovery Questions</p>
                                        <div className="space-y-2">
                                            {brief.suggested_talk_track?.discovery_questions?.map((q, idx) => (
                                                <p key={idx} className="text-sm text-[#1d1d1f]">• "{q}"</p>
                                            ))}
                                        </div>
                                    </div>
                                    
                                    <div className="p-4 rounded-xl bg-green-50 border border-green-100">
                                        <p className="bento-label text-green-600 mb-2">Value Statement</p>
                                        <p className="text-sm text-[#1d1d1f] italic">"{brief.suggested_talk_track?.value_statement}"</p>
                                    </div>
                                    
                                    <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
                                        <p className="bento-label text-blue-600 mb-2">Close for Next Step</p>
                                        <p className="text-sm text-[#1d1d1f] italic">"{brief.suggested_talk_track?.close_for_next_step}"</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* What We See */}
                        {brief.what_we_see?.length > 0 && (
                            <div className="bento-card p-5">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="bento-icon-sm bg-gradient-to-br from-amber-400 to-orange-500">
                                        <Lightbulb size={16} className="text-white" />
                                    </div>
                                    <h3 className="font-semibold text-[#1d1d1f]">What We See</h3>
                                    <span className="bento-pill bento-pill-gray text-[10px]">Credit Report</span>
                                </div>
                                <div className="space-y-2">
                                    {brief.what_we_see.map((item, idx) => (
                                        <div key={idx} className="flex items-start gap-3">
                                            <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-600 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{idx + 1}</span>
                                            <p className="text-sm text-[#1d1d1f]">{item}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Local Context */}
                        <div className="bento-card overflow-hidden">
                            <button 
                                onClick={() => setShowLocal(!showLocal)}
                                className="w-full p-5 flex items-center justify-between hover:bg-black/[0.02] transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="bento-icon-sm bg-gradient-to-br from-rose-400 to-pink-500">
                                        <MapPin size={16} className="text-white" />
                                    </div>
                                    <h3 className="font-semibold text-[#1d1d1f]">Local Context</h3>
                                    <span className="bento-pill bento-pill-gray text-[10px]">Conversation Only</span>
                                </div>
                                <ChevronDown size={20} className={cn("text-[#86868b] transition-transform", showLocal && "rotate-180")} />
                            </button>

                            {showLocal && localContext && (
                                <div className="px-5 pb-5 space-y-4">
                                    {/* Weather */}
                                    {localContext.weather && (
                                        <div className="p-4 rounded-xl bento-tint-blue">
                                            <div className="flex items-center gap-3 mb-3">
                                                <WeatherIcon condition={localContext.weather.current?.condition} size={28} />
                                                <div>
                                                    <p className="text-lg font-semibold text-[#1d1d1f]">{localContext.weather.current?.temp}°F</p>
                                                    <p className="text-sm text-[#86868b]">{localContext.weather.current?.condition} in {localContext.weather.location}</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                {localContext.weather.forecast?.slice(0, 5).map((day, idx) => (
                                                    <div key={idx} className="flex-1 text-center p-2 rounded-lg bg-white/60">
                                                        <p className="text-[10px] text-[#86868b]">{day.day}</p>
                                                        <WeatherIcon condition={day.condition} size={16} />
                                                        <p className="text-xs font-semibold text-[#1d1d1f]">{day.high}°</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Sports */}
                                    {localContext.sports?.length > 0 && (
                                        <div>
                                            <p className="bento-label mb-2 flex items-center gap-2">
                                                <Trophy size={12} className="text-amber-500" /> Local Sports
                                            </p>
                                            <div className="space-y-2">
                                                {localContext.sports.map((item, idx) => (
                                                    <div key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-slate-50">
                                                        <span className="bento-pill bento-pill-orange text-[10px]">{item.team}</span>
                                                        <p className="text-sm text-[#1d1d1f] flex-1 truncate">{item.headline}</p>
                                                        <span className="text-xs text-[#86868b]">{item.recency}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* News */}
                                    {localContext.news?.length > 0 && (
                                        <div>
                                            <p className="bento-label mb-2 flex items-center gap-2">
                                                <Newspaper size={12} /> Local News
                                            </p>
                                            <div className="space-y-2">
                                                {localContext.news.map((item, idx) => (
                                                    <div key={idx} className="p-3 rounded-lg bg-slate-50">
                                                        <p className="text-sm text-[#1d1d1f]">{item.title}</p>
                                                        <div className="flex items-center justify-between mt-1">
                                                            <span className="text-xs text-[#86868b]">{item.source}</span>
                                                            <span className="text-xs text-[#86868b]">{item.recency}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Market */}
                                    {localContext.market && (
                                        <div className="p-4 rounded-xl bento-tint-green">
                                            <p className="bento-label text-green-600 mb-2 flex items-center gap-2">
                                                <TrendingUp size={12} /> Local Market
                                            </p>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-[#1d1d1f]">Median: {fmt(localContext.market.medianPrice)}</span>
                                                <span className={cn("bento-pill text-[10px]", localContext.market.priceChange > 0 ? "bento-pill-green" : "bento-pill-orange")}>
                                                    {localContext.market.priceChange > 0 ? '+' : ''}{localContext.market.priceChange}% YoY
                                                </span>
                                            </div>
                                            <p className="text-xs text-[#86868b] mt-1">{localContext.market.trend} • {localContext.market.daysOnMarket} avg days</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Missing Info */}
                        {brief.missing_info_to_confirm?.length > 0 && (
                            <div className="bento-card p-5">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="bento-icon-sm bg-gradient-to-br from-blue-400 to-cyan-500">
                                        <HelpCircle size={16} className="text-white" />
                                    </div>
                                    <h3 className="font-semibold text-[#1d1d1f]">Confirm on Call</h3>
                                </div>
                                <div className="space-y-1">
                                    {brief.missing_info_to_confirm.map((item, idx) => (
                                        <p key={idx} className="text-sm text-[#86868b]">• {item}</p>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Footer Note */}
                        <p className="text-xs text-[#86868b] text-center py-2">
                            Some interest rates estimated based on debt type. Property values from internal AVM.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
