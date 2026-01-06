import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { 
    Home, 
    TrendingUp, 
    Building2,
    BarChart3,
    CheckCircle,
    AlertCircle,
    AlertTriangle,
    RefreshCw,
    Copy,
    Check,
    Shield,
    FileCheck,
    Info,
    ChevronDown,
    ChevronUp,
    ShieldAlert,
    HelpCircle,
    Lock,
    Sparkles,
    MapPin
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { getPropertyValuations } from '../../services/avmWebSearch';
import '../../styles/bento.css';

// Format helpers
const fmt = (n) => n ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n) : 'N/A';
const fmtK = (n) => n ? `$${(n / 1000).toFixed(0)}K` : 'N/A';

export function GoodLeapAVM({ borrowerData, onClose, onValueChange, embedded = false }) {
    const [copied, setCopied] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [avmData, setAvmData] = useState(null);
    const [error, setError] = useState(null);
    const [selectedOption, setSelectedOption] = useState('recommended');
    const [showWhy, setShowWhy] = useState(false);
    const [hasChangedFromDefault, setHasChangedFromDefault] = useState(false);
    
    const property = borrowerData?.property || {};

    const handleRefresh = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await getPropertyValuations(property);
            setAvmData(result);
            setSelectedOption('recommended');
            setHasChangedFromDefault(false);
        } catch (err) {
            console.error('AVM fetch failed:', err);
            setError(err.message || 'Failed to fetch valuations');
        } finally {
            setIsLoading(false);
        }
    }, [property]);

    useEffect(() => {
        handleRefresh();
    }, []);

    const handleOptionChange = (option) => {
        setSelectedOption(option);
        setHasChangedFromDefault(option !== 'recommended');
        
        if (onValueChange && avmData) {
            const value = option === 'recommended' 
                ? avmData.aus_recommended?.value
                : option === 'conservative'
                    ? avmData.value_options?.conservative?.value
                    : option === 'blended'
                        ? avmData.value_options?.blended?.value
                        : avmData.value_options?.aggressive?.value;
            onValueChange(value);
        }
    };

    const selectedValue = useMemo(() => {
        if (!avmData) return null;
        switch (selectedOption) {
            case 'recommended': return avmData.aus_recommended?.value;
            case 'conservative': return avmData.value_options?.conservative?.value;
            case 'blended': return avmData.value_options?.blended?.value;
            case 'aggressive': return avmData.value_options?.aggressive?.value;
            default: return avmData.aus_recommended?.value;
        }
    }, [avmData, selectedOption]);

    const handleCopy = () => {
        if (!avmData) return;
        const text = `AUS WORKING VALUE: ${fmt(selectedValue)}\nConfidence: ${avmData.aus_recommended?.confidence}\nReason: ${avmData.aus_recommended?.reason}\n\nSources:\n- Internal AVM: ${fmt(avmData.source_comparison?.internal_avm?.value)}\n- Zillow: ${fmt(avmData.source_comparison?.zillow?.value)}\n- Redfin: ${fmt(avmData.source_comparison?.redfin?.value)}\n- Variance: ${avmData.source_comparison?.variance_percent}%`;
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="h-full flex flex-col bg-[#f5f5f7]">
            {/* Header - hidden when embedded */}
            {!embedded && (
                <div className="px-6 py-5 bg-white border-b border-black/5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="bento-icon bento-icon-blue">
                                <Home size={22} className="text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-[#1d1d1f] tracking-tight">Working Value for AUS</h1>
                                <p className="text-sm text-[#86868b]">Property Valuation Analysis</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button onClick={handleRefresh} disabled={isLoading} className="bento-btn bento-btn-secondary">
                                <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
                            </button>
                            <button onClick={handleCopy} disabled={!avmData} className="bento-btn bento-btn-secondary">
                                {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* AI Notice */}
            <div className={cn("bg-amber-50 border-b border-amber-100 flex items-center justify-between", embedded ? "px-4 py-2" : "px-6 py-2")}>
                <p className="text-xs text-amber-700">
                    <span className="font-semibold">AI-Generated</span> — Verify with appraisal
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
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mb-4 animate-pulse">
                            <Sparkles size={28} className="text-white" />
                        </div>
                        <p className="text-lg font-semibold text-[#1d1d1f]">Analyzing Property Values...</p>
                        <p className="text-sm text-[#86868b] mt-1">Comparing AVM sources</p>
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-16 h-16 rounded-2xl bg-red-100 flex items-center justify-center mb-4">
                            <AlertCircle size={28} className="text-red-500" />
                        </div>
                        <p className="text-lg font-semibold text-red-600 mb-2">Failed to load valuations</p>
                        <p className="text-sm text-[#86868b] mb-4">{error}</p>
                        <button onClick={handleRefresh} className="bento-btn bento-btn-primary">
                            <RefreshCw size={16} /> Retry
                        </button>
                    </div>
                ) : avmData && (
                    <div className="space-y-4 max-w-2xl mx-auto">
                        {/* Property Card */}
                        <div className="bento-card p-4 flex items-center gap-4 bento-animate">
                            <div className="bento-icon bento-icon-blue">
                                <MapPin size={20} className="text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-base font-semibold text-[#1d1d1f] truncate">{property.address || '2116 Shrewsbury Dr'}</p>
                                <p className="text-sm text-[#86868b]">{property.city || 'McKinney'}, {property.state || 'TX'} • {property.bedrooms || 5}bd {property.bathrooms || 4.5}ba • {(property.livingArea || 3850).toLocaleString()} sqft</p>
                            </div>
                        </div>

                        {/* AUS Recommended Hero */}
                        <div className={cn(
                            "bento-card overflow-hidden bento-animate bento-animate-delay-1 transition-all",
                            selectedOption === 'recommended' && "ring-2 ring-green-500"
                        )}>
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <Lock size={16} className="text-green-600" />
                                        <span className="text-xs font-bold text-green-700 uppercase tracking-wide">AUS Recommended</span>
                                    </div>
                                    <span className={cn(
                                        "bento-pill",
                                        avmData.aus_recommended?.confidence === 'High' ? 'bento-pill-green' :
                                        avmData.aus_recommended?.confidence === 'Medium' ? 'bento-pill-orange' : 'bento-pill-red'
                                    )}>
                                        {avmData.aus_recommended?.confidence}
                                    </span>
                                </div>
                                
                                <p className="text-5xl font-bold text-[#1d1d1f] mb-4">
                                    {fmt(avmData.aus_recommended?.value)}
                                </p>
                                
                                <div className="flex items-center gap-2 p-3 rounded-xl bg-green-50 border border-green-100 mb-4">
                                    <CheckCircle size={20} className="text-green-500" />
                                    <span className="text-sm text-green-700">Supported by multiple sources with low variance</span>
                                </div>
                                
                                <p className="text-sm text-[#86868b]">{avmData.aus_recommended?.reason}</p>
                                
                                {selectedOption === 'recommended' && (
                                    <div className="mt-4 pt-4 border-t border-black/5 text-center">
                                        <span className="text-sm text-green-600 font-semibold">✓ Currently selected for AUS</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Alternative Options */}
                        <div className="bento-card overflow-hidden bento-animate bento-animate-delay-2">
                            <div className="p-4 border-b border-black/5">
                                <span className="text-xs font-bold text-[#1d1d1f] uppercase tracking-wide">Alternative Options</span>
                            </div>
                            
                            {/* Conservative */}
                            <button
                                onClick={() => handleOptionChange('conservative')}
                                className={cn(
                                    "w-full p-4 flex items-center justify-between hover:bg-black/[0.02] transition-colors text-left border-b border-black/5",
                                    selectedOption === 'conservative' && "bg-blue-50"
                                )}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={cn(
                                        "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                                        selectedOption === 'conservative' ? "border-blue-500 bg-blue-500" : "border-black/20"
                                    )}>
                                        {selectedOption === 'conservative' && <div className="w-2 h-2 rounded-full bg-white" />}
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-[#1d1d1f]">{avmData.value_options?.conservative?.label}</p>
                                        <p className="text-xs text-[#86868b]">{avmData.value_options?.conservative?.description}</p>
                                    </div>
                                </div>
                                <span className="text-lg font-bold text-[#1d1d1f]">{fmtK(avmData.value_options?.conservative?.value)}</span>
                            </button>

                            {/* Blended */}
                            <button
                                onClick={() => handleOptionChange('blended')}
                                className={cn(
                                    "w-full p-4 flex items-center justify-between hover:bg-black/[0.02] transition-colors text-left border-b border-black/5",
                                    selectedOption === 'blended' && "bg-blue-50"
                                )}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={cn(
                                        "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                                        selectedOption === 'blended' ? "border-blue-500 bg-blue-500" : "border-black/20"
                                    )}>
                                        {selectedOption === 'blended' && <div className="w-2 h-2 rounded-full bg-white" />}
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-[#1d1d1f]">{avmData.value_options?.blended?.label}</p>
                                        <p className="text-xs text-[#86868b]">{avmData.value_options?.blended?.description}</p>
                                    </div>
                                </div>
                                <span className="text-lg font-bold text-[#1d1d1f]">{fmtK(avmData.value_options?.blended?.value)}</span>
                            </button>

                            {/* Aggressive */}
                            <button
                                onClick={() => handleOptionChange('aggressive')}
                                className={cn(
                                    "w-full p-4 flex items-center justify-between hover:bg-black/[0.02] transition-colors text-left",
                                    selectedOption === 'aggressive' && "bg-amber-50"
                                )}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={cn(
                                        "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                                        selectedOption === 'aggressive' ? "border-amber-500 bg-amber-500" : "border-black/20"
                                    )}>
                                        {selectedOption === 'aggressive' && <div className="w-2 h-2 rounded-full bg-white" />}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div>
                                            <p className="text-sm font-semibold text-[#1d1d1f]">{avmData.value_options?.aggressive?.label}</p>
                                            <p className="text-xs text-[#86868b]">{avmData.value_options?.aggressive?.description}</p>
                                        </div>
                                        <AlertTriangle size={14} className="text-amber-500" />
                                    </div>
                                </div>
                                <span className="text-lg font-bold text-[#1d1d1f]">{fmtK(avmData.value_options?.aggressive?.value)}</span>
                            </button>

                            {hasChangedFromDefault && selectedOption !== 'recommended' && (
                                <div className="p-3 bg-amber-50 border-t border-amber-100 flex items-center gap-2">
                                    <AlertTriangle size={14} className="text-amber-600" />
                                    <p className="text-xs text-amber-700">
                                        {selectedOption === 'aggressive' 
                                            ? "Using a higher value may increase appraisal risk"
                                            : "Deviating from recommended value may affect equity calculations"}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Source Comparison */}
                        <div className="bento-card overflow-hidden bento-animate bento-animate-delay-3">
                            <div className="p-4 border-b border-black/5 flex items-center justify-between">
                                <span className="text-xs font-bold text-[#1d1d1f] uppercase tracking-wide">Source Comparison</span>
                                <span className={cn(
                                    "bento-pill",
                                    avmData.source_comparison?.variance_percent <= 5 ? "bento-pill-green" : "bento-pill-orange"
                                )}>
                                    {avmData.source_comparison?.variance_percent}% variance
                                </span>
                            </div>
                            
                            <div className="p-5">
                                <div className="bento-grid-4 mb-4">
                                    <div className="text-center p-3 rounded-xl bg-purple-50 border border-purple-100">
                                        <p className="text-[10px] text-purple-700 font-semibold uppercase">Internal</p>
                                        <p className="text-base font-bold text-purple-700 mt-1">{fmtK(avmData.source_comparison?.internal_avm?.value)}</p>
                                    </div>
                                    <div className="text-center p-3 rounded-xl bg-blue-50 border border-blue-100">
                                        <p className="text-[10px] text-blue-700 font-semibold uppercase">Zillow</p>
                                        <p className="text-base font-bold text-blue-700 mt-1">{fmtK(avmData.source_comparison?.zillow?.value)}</p>
                                    </div>
                                    <div className="text-center p-3 rounded-xl bg-red-50 border border-red-100">
                                        <p className="text-[10px] text-red-700 font-semibold uppercase">Redfin</p>
                                        <p className="text-base font-bold text-red-700 mt-1">{fmtK(avmData.source_comparison?.redfin?.value)}</p>
                                    </div>
                                    <div className="text-center p-3 rounded-xl bg-slate-50 border border-slate-100">
                                        <p className="text-[10px] text-slate-700 font-semibold uppercase">Realtor</p>
                                        <p className="text-base font-bold text-slate-700 mt-1">{fmtK(avmData.source_comparison?.realtor?.value)}</p>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="bento-progress">
                                        <div 
                                            className="bento-progress-bar bg-gradient-to-r from-green-500 to-emerald-500"
                                            style={{ width: `${Math.max(0, 100 - avmData.source_comparison?.variance_percent * 5)}%` }}
                                        />
                                    </div>
                                    <p className="text-xs text-[#86868b] text-center">
                                        Values within 5% variance are typically considered stable across AVMs
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Why This Value */}
                        <div className="bento-card overflow-hidden">
                            <button
                                onClick={() => setShowWhy(!showWhy)}
                                className="w-full p-4 flex items-center justify-between hover:bg-black/[0.02] transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <HelpCircle size={18} className="text-blue-500" />
                                    <span className="text-sm font-semibold text-[#1d1d1f]">Why This Value?</span>
                                </div>
                                <ChevronDown size={18} className={cn("text-[#86868b] transition-transform", showWhy && "rotate-180")} />
                            </button>
                            
                            {showWhy && (
                                <div className="px-4 pb-4 space-y-2">
                                    <div className="flex justify-between p-3 rounded-lg bg-slate-50">
                                        <span className="text-sm text-[#86868b]">Source count</span>
                                        <span className="text-sm font-semibold text-[#1d1d1f]">4 sources</span>
                                    </div>
                                    <div className="flex justify-between p-3 rounded-lg bg-slate-50">
                                        <span className="text-sm text-[#86868b]">Variance</span>
                                        <span className="text-sm font-semibold text-[#1d1d1f]">{avmData.source_comparison?.variance_percent}%</span>
                                    </div>
                                    <div className="flex justify-between p-3 rounded-lg bg-slate-50">
                                        <span className="text-sm text-[#86868b]">Internal alignment</span>
                                        <span className={cn("text-sm font-semibold", avmData.underwriting_readiness?.internal_alignment ? "text-green-600" : "text-amber-600")}>
                                            {avmData.underwriting_readiness?.internal_alignment ? 'Aligned' : 'Divergent'}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Underwriting Readiness */}
                        <div className="bento-card overflow-hidden">
                            <div className="p-4 border-b border-black/5 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <FileCheck size={18} className="text-blue-500" />
                                    <span className="text-xs font-bold text-[#1d1d1f] uppercase tracking-wide">Underwriting Readiness</span>
                                </div>
                                <span className={cn(
                                    "bento-pill",
                                    avmData.underwriting_readiness?.suitable_for_aus === 'Yes' ? "bento-pill-green" : "bento-pill-orange"
                                )}>
                                    {avmData.underwriting_readiness?.suitable_for_aus}
                                </span>
                            </div>
                            <div className="p-4 space-y-1">
                                <div className="flex items-center justify-between py-2 border-b border-black/5">
                                    <div className="flex items-center gap-2">
                                        {avmData.underwriting_readiness?.multiple_sources ? (
                                            <CheckCircle size={16} className="text-green-500" />
                                        ) : (
                                            <AlertCircle size={16} className="text-amber-500" />
                                        )}
                                        <span className="text-sm text-[#1d1d1f]">Multiple sources present</span>
                                    </div>
                                    <span className={cn("text-sm font-semibold", avmData.underwriting_readiness?.multiple_sources ? "text-green-600" : "text-amber-600")}>
                                        {avmData.underwriting_readiness?.multiple_sources ? 'Yes' : 'No'}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between py-2 border-b border-black/5">
                                    <div className="flex items-center gap-2">
                                        {avmData.underwriting_readiness?.variance_within_tolerance ? (
                                            <CheckCircle size={16} className="text-green-500" />
                                        ) : (
                                            <AlertCircle size={16} className="text-amber-500" />
                                        )}
                                        <span className="text-sm text-[#1d1d1f]">Variance within tolerance</span>
                                    </div>
                                    <span className={cn("text-sm font-semibold", avmData.underwriting_readiness?.variance_within_tolerance ? "text-green-600" : "text-amber-600")}>
                                        {avmData.source_comparison?.variance_percent}%
                                    </span>
                                </div>
                                <div className="flex items-center justify-between py-2">
                                    <div className="flex items-center gap-2">
                                        {avmData.underwriting_readiness?.internal_alignment ? (
                                            <CheckCircle size={16} className="text-green-500" />
                                        ) : (
                                            <AlertCircle size={16} className="text-amber-500" />
                                        )}
                                        <span className="text-sm text-[#1d1d1f]">Internal model alignment</span>
                                    </div>
                                    <span className={cn("text-sm font-semibold", avmData.underwriting_readiness?.internal_alignment ? "text-green-600" : "text-amber-600")}>
                                        {avmData.underwriting_readiness?.internal_alignment ? 'Yes' : 'No'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Important Notes */}
                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                            <p className="text-xs text-[#86868b]">
                                {avmData.important_notes?.join(' ')}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
