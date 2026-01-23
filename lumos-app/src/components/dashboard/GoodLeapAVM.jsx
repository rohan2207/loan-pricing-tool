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
    MapPin,
    Calculator,
    DollarSign
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { getPropertyValuations, AVM_ERROR_CODES, AVMError } from '../../services/avmWebSearch';
import '../../styles/bento.css';

// Format helpers
const fmt = (n) => n ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n) : 'N/A';
const fmtK = (n) => n ? `$${(n / 1000).toFixed(0)}K` : 'N/A';

export function GoodLeapAVM({ borrowerData, onClose, onValueChange, embedded = false, autoLoad = true, cachedData = null }) {
    const [copied, setCopied] = useState(false);
    const [isLoading, setIsLoading] = useState(!cachedData);
    const [avmData, setAvmData] = useState(cachedData);
    const [error, setError] = useState(null);
    const [errorDetails, setErrorDetails] = useState(null);
    const [selectedOption, setSelectedOption] = useState('recommended');
    const [showWhy, setShowWhy] = useState(false);
    const [hasChangedFromDefault, setHasChangedFromDefault] = useState(false);
    const [showErrorDetails, setShowErrorDetails] = useState(false);
    
    const property = borrowerData?.property || {};

    // Get user-friendly error message based on error code
    const getErrorHelp = (errorCode) => {
        switch (errorCode) {
            case AVM_ERROR_CODES.API_KEY_MISSING:
                return 'The server is not configured with an OpenAI API key. Contact your administrator.';
            case AVM_ERROR_CODES.INVALID_API_KEY:
                return 'The OpenAI API key is invalid. Please check the configuration.';
            case AVM_ERROR_CODES.QUOTA_EXCEEDED:
                return 'OpenAI API quota has been exceeded. Please check your billing or wait for quota reset.';
            case AVM_ERROR_CODES.RESPONSES_API_UNAVAILABLE:
                return 'The OpenAI Responses API with web search requires special access. Check if your API plan supports this feature.';
            case AVM_ERROR_CODES.RATE_LIMITED:
                return 'Too many requests. Please wait a few seconds and try again.';
            case AVM_ERROR_CODES.SERVICE_UNAVAILABLE:
                return 'OpenAI service is temporarily unavailable. Please try again in a few minutes.';
            case AVM_ERROR_CODES.EMPTY_RESPONSE:
                return 'The AI returned an empty response. This may be a temporary issue.';
            case AVM_ERROR_CODES.JSON_PARSE_FAILED:
                return 'The AI response was malformed. Try again or contact support if the issue persists.';
            case AVM_ERROR_CODES.SCHEMA_VALIDATION_FAILED:
                return 'The AI response did not match the expected format. This may require a prompt adjustment.';
            case AVM_ERROR_CODES.NETWORK_ERROR:
                return 'Could not connect to the server. Check your internet connection.';
            default:
                return 'An unexpected error occurred. Please try again.';
        }
    };

    const handleRefresh = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        setErrorDetails(null);
        setShowErrorDetails(false);
        try {
            const result = await getPropertyValuations(property);
            setAvmData(result);
            setSelectedOption('recommended');
            setHasChangedFromDefault(false);
        } catch (err) {
            console.error('AVM fetch failed:', err);
            
            if (err instanceof AVMError) {
                setError(err.message);
                setErrorDetails({
                    code: err.errorCode,
                    details: err.details,
                    rawData: err.rawData,
                    help: getErrorHelp(err.errorCode),
                    timestamp: err.timestamp
                });
            } else {
            setError(err.message || 'Failed to fetch valuations');
                setErrorDetails({
                    code: 'UNKNOWN_ERROR',
                    details: err.stack,
                    help: 'An unexpected error occurred. Please try again.'
                });
            }
        } finally {
            setIsLoading(false);
        }
    }, [property]);

    useEffect(() => {
        // Only auto-load if enabled and no cached data
        if (autoLoad && !cachedData) {
            handleRefresh();
        }
    }, [autoLoad, cachedData]);

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
        
        // Build source list
        const allSources = avmData.source_comparison?.all_sources || [];
        const actualSources = allSources.filter(s => s.found_actual);
        const calculatedSources = allSources.filter(s => !s.found_actual);
        
        let text = `AUS WORKING VALUE: ${fmt(selectedValue)}
Confidence: ${avmData.aus_recommended?.confidence}
Reason: ${avmData.aus_recommended?.reason}

`;
        
        if (actualSources.length > 0) {
            text += `ACTUAL VALUES FOUND (${actualSources.length}):\n`;
            text += actualSources.map(s => `  ✓ ${s.name}: ${fmt(s.value)}`).join('\n');
            text += '\n\n';
        }
        
        if (calculatedSources.length > 0) {
            text += `CALCULATED ESTIMATES (${calculatedSources.length}):\n`;
            text += calculatedSources.map(s => `  • ${s.name}: ${fmt(s.value)}`).join('\n');
            text += '\n\n';
        }
        
        text += `Variance: ${avmData.source_comparison?.variance_percent}%`;
        
        // Add PIW calculations if available
        if (avmData.piw_calculations) {
            text += `\n\nPIW Eligibility: ${avmData.piw_calculations.piw_eligible ? 'Yes' : 'Review Required'}`;
            text += `\n  - Rate & Term Max: ${fmt(avmData.piw_calculations.rate_term_max)}`;
            text += `\n  - Cash-Out Max: ${fmt(avmData.piw_calculations.cash_out_max)}`;
        }
        
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
                    <div className="flex flex-col items-center justify-center py-12 px-4">
                        <div className="w-16 h-16 rounded-2xl bg-red-100 flex items-center justify-center mb-4">
                            <AlertCircle size={28} className="text-red-500" />
                        </div>
                        <p className="text-lg font-semibold text-red-600 mb-2">Failed to load valuations</p>
                        <p className="text-sm text-[#86868b] mb-2 text-center max-w-md">{error}</p>
                        
                        {errorDetails && (
                            <div className="w-full max-w-lg mt-4">
                                {/* Error code badge */}
                                <div className="flex justify-center mb-3">
                                    <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-mono">
                                        {errorDetails.code}
                                    </span>
                                </div>
                                
                                {/* Help text */}
                                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 mb-4">
                                    <div className="flex items-start gap-2">
                                        <Info size={16} className="text-amber-600 mt-0.5 shrink-0" />
                                        <p className="text-sm text-amber-800">{errorDetails.help}</p>
                                    </div>
                                </div>
                                
                                {/* Technical details toggle */}
                                <button
                                    onClick={() => setShowErrorDetails(!showErrorDetails)}
                                    className="w-full flex items-center justify-between p-3 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors mb-2"
                                >
                                    <span className="text-sm font-medium text-slate-700">Technical Details</span>
                                    <ChevronDown size={16} className={cn("text-slate-500 transition-transform", showErrorDetails && "rotate-180")} />
                                </button>
                                
                                {showErrorDetails && (
                                    <div className="p-4 rounded-lg bg-slate-900 text-slate-100 font-mono text-xs overflow-auto max-h-64">
                                        <p className="mb-2"><span className="text-slate-400">Error Code:</span> {errorDetails.code}</p>
                                        {errorDetails.timestamp && (
                                            <p className="mb-2"><span className="text-slate-400">Timestamp:</span> {errorDetails.timestamp}</p>
                                        )}
                                        {errorDetails.details && (
                                            <div className="mb-2">
                                                <span className="text-slate-400">Details:</span>
                                                <pre className="mt-1 whitespace-pre-wrap text-amber-300">
                                                    {typeof errorDetails.details === 'string' 
                                                        ? errorDetails.details 
                                                        : JSON.stringify(errorDetails.details, null, 2)}
                                                </pre>
                                            </div>
                                        )}
                                        {errorDetails.rawData && (
                                            <div>
                                                <span className="text-slate-400">Raw Response:</span>
                                                <pre className="mt-1 whitespace-pre-wrap text-green-300">
                                                    {typeof errorDetails.rawData === 'string' 
                                                        ? errorDetails.rawData.substring(0, 1000) 
                                                        : JSON.stringify(errorDetails.rawData, null, 2).substring(0, 1000)}
                                                </pre>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                        
                        <button onClick={handleRefresh} className="bento-btn bento-btn-primary mt-4">
                            <RefreshCw size={16} /> Retry
                        </button>
                    </div>
                ) : avmData && avmData.mode === 'raw_snippets' ? (
                    /* RAW SNIPPETS VIEW */
                    <div className="space-y-4 max-w-2xl mx-auto">
                        {/* Property Card */}
                        <div className="bento-card p-4 flex items-center gap-4 bento-animate">
                            <div className="bento-icon bento-icon-blue">
                                <MapPin size={20} className="text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-base font-semibold text-[#1d1d1f] truncate">{avmData.property?.address}</p>
                                <p className="text-sm text-[#86868b]">{avmData.property?.sqft?.toLocaleString()} sqft • {avmData.property?.beds}bd/{avmData.property?.baths}ba</p>
                            </div>
                        </div>

                        {/* Search Query */}
                        <div className="bento-card p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-xs font-bold text-[#1d1d1f] uppercase">Search Query</span>
                            </div>
                            <p className="text-sm text-[#86868b] font-mono bg-slate-100 p-2 rounded">{avmData.search_query}</p>
                        </div>

                        {/* Raw Snippets */}
                        <div className="bento-card overflow-hidden">
                            <div className="p-4 border-b border-black/5 flex items-center justify-between">
                                <span className="text-xs font-bold text-[#1d1d1f] uppercase">Search Results ({avmData.snippet_count} found)</span>
                            </div>
                            <div className="divide-y divide-black/5">
                                {avmData.raw_snippets?.length > 0 ? (
                                    avmData.raw_snippets.map((snippet, idx) => (
                                        <div key={idx} className="p-4 hover:bg-slate-50">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-700 text-xs font-semibold">
                                                    {snippet.source || 'Unknown'}
                                                </span>
                                                <span className="text-xs text-[#86868b]">#{idx + 1}</span>
                                            </div>
                                            <p className="text-sm font-semibold text-[#1d1d1f] mb-1">{snippet.title}</p>
                                            <p className="text-xs text-[#86868b] mb-2 break-all">{snippet.url}</p>
                                            <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
                                                <p className="text-sm text-amber-900">{snippet.snippet}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-8 text-center">
                                        <AlertCircle size={32} className="mx-auto text-slate-400 mb-3" />
                                        <p className="text-sm text-[#86868b]">No search results found</p>
                                        <p className="text-xs text-[#86868b] mt-1">Try refreshing or check the address</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Note */}
                        <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
                            <p className="text-xs text-blue-700">
                                <strong>Debug Mode:</strong> Showing raw search snippets. Look for dollar values in the snippets above.
                            </p>
                        </div>
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
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-[#1d1d1f] uppercase tracking-wide">Value Sources</span>
                                    <span className="text-[10px] text-[#86868b]">
                                        ({avmData.source_comparison?.total_sources || 0} found)
                                    </span>
                                </div>
                                <span className={cn(
                                    "bento-pill",
                                    avmData.source_comparison?.variance_percent <= 5 ? "bento-pill-green" : 
                                    avmData.source_comparison?.variance_percent <= 15 ? "bento-pill-orange" : "bento-pill-red"
                                )}>
                                    {avmData.source_comparison?.variance_percent || 0}% variance
                                </span>
                            </div>
                            
                            <div className="p-5">
                                {/* Get all sources for display */}
                                {(() => {
                                    // Get up to 5 sources from source_comparison or all_sources
                                    let allSources = [
                                        avmData.source_comparison?.source1,
                                        avmData.source_comparison?.source2,
                                        avmData.source_comparison?.source3,
                                        avmData.source_comparison?.source4,
                                        avmData.source_comparison?.source5
                                    ].filter(s => s?.value);
                                    
                                    // If we have all_sources array, use that instead (more complete)
                                    if (avmData.source_comparison?.all_sources?.length > allSources.length) {
                                        allSources = avmData.source_comparison.all_sources
                                            .filter(s => s?.value)
                                            .slice(0, 5)
                                            .map(s => ({
                                                label: s.name || s.label,
                                                value: s.value,
                                                found_actual: s.found_actual,
                                                notes: s.notes
                                            }));
                                    }
                                    
                                    const actualSources = allSources.filter(s => s.found_actual);
                                    const calculatedSources = allSources.filter(s => !s.found_actual);
                                    
                                    return (
                                        <>
                                            {/* Actual Sources Section */}
                                            {actualSources.length > 0 && (
                                                <div className="mb-4">
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <CheckCircle size={14} className="text-green-500" />
                                                        <span className="text-xs font-semibold text-green-700 uppercase">
                                                            Actual Values ({actualSources.length})
                                                        </span>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        {actualSources.map((source, idx) => (
                                                            <div key={idx} className="p-3 rounded-xl bg-green-50 border border-green-200 relative">
                                                                <span className="absolute -top-1.5 -right-1.5 bg-green-500 text-white text-[7px] px-1.5 py-0.5 rounded-full font-semibold">
                                                                    ✓ ACTUAL
                                                                </span>
                                                                <p className="text-[10px] font-semibold text-green-800 uppercase truncate">
                                                                    {source.label}
                                                                </p>
                                                                <p className="text-lg font-bold text-green-700">
                                                                    {fmtK(source.value)}
                                                                </p>
                                                                {source.notes && (
                                                                    <p className="text-[9px] text-green-600 mt-1 truncate" title={source.notes}>
                                                                        {source.notes}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Calculated/Market Estimates Section */}
                                            {calculatedSources.length > 0 && (
                                                <div className="mb-4">
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <Calculator size={14} className="text-blue-500" />
                                                        <span className="text-xs font-semibold text-blue-700 uppercase">
                                                            Market Estimates ({calculatedSources.length})
                                                        </span>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        {calculatedSources.map((source, idx) => (
                                                            <div key={idx} className="p-3 rounded-xl bg-blue-50 border border-blue-200 relative">
                                                                <span className="absolute -top-1.5 -right-1.5 bg-blue-500 text-white text-[7px] px-1.5 py-0.5 rounded-full font-semibold">
                                                                    $/SQFT
                                                                </span>
                                                                <p className="text-[10px] font-semibold text-blue-800 uppercase truncate" title={source.label}>
                                                                    {source.label}
                                                                </p>
                                                                <p className="text-lg font-bold text-blue-700">
                                                                    {fmtK(source.value)}
                                                                </p>
                                                                {source.notes && (
                                                                    <p className="text-[9px] text-blue-600 mt-1 truncate" title={source.notes}>
                                                                        {source.notes}
                                                                    </p>
                                                                )}
                                    </div>
                                                        ))}
                                    </div>
                                    </div>
                                            )}

                                            {/* No sources found */}
                                            {allSources.length === 0 && (
                                                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
                                                    <p className="text-sm text-slate-600">No valuation sources found</p>
                                    </div>
                                            )}
                                        </>
                                    );
                                })()}

                                {/* Summary */}
                                <div className={cn(
                                    "p-3 rounded-lg text-center mb-4",
                                    avmData.source_comparison?.actual_sources_found > 0 ? "bg-green-50" : 
                                    avmData.source_comparison?.total_sources >= 2 ? "bg-blue-50" : "bg-amber-50"
                                )}>
                                    {avmData.source_comparison?.actual_sources_found > 0 ? (
                                        <p className="text-xs text-green-700 font-medium">
                                            ✓ {avmData.source_comparison.actual_sources_found} actual value(s) from verified sources
                                        </p>
                                    ) : avmData.source_comparison?.total_sources >= 2 ? (
                                        <p className="text-xs text-blue-700 font-medium">
                                            📊 {avmData.source_comparison.total_sources} market estimates from $/sqft data
                                        </p>
                                    ) : (
                                        <p className="text-xs text-amber-700 font-medium">
                                            ⚠️ Limited data — verify with appraisal
                                        </p>
                                    )}
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
                                {/* Actual Sources */}
                                <div className="flex items-center justify-between py-2 border-b border-black/5">
                                    <div className="flex items-center gap-2">
                                        {avmData.underwriting_readiness?.has_actual_sources ? (
                                            <CheckCircle size={16} className="text-green-500" />
                                        ) : (
                                            <AlertCircle size={16} className="text-amber-500" />
                                        )}
                                        <span className="text-sm text-[#1d1d1f]">Actual sources found</span>
                                    </div>
                                    <span className={cn("text-sm font-semibold", avmData.underwriting_readiness?.has_actual_sources ? "text-green-600" : "text-amber-600")}>
                                        {avmData.underwriting_readiness?.has_actual_sources ? 'Yes' : 'No'}
                                    </span>
                                </div>
                                {/* Multiple Sources */}
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
                                        {avmData.source_comparison?.total_sources || 0} sources
                                    </span>
                                </div>
                                {/* Variance */}
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
                                {/* Data Quality */}
                                <div className="flex items-center justify-between py-2">
                                    <div className="flex items-center gap-2">
                                        {avmData.underwriting_readiness?.has_actual_sources && avmData.underwriting_readiness?.variance_within_tolerance ? (
                                            <Shield size={16} className="text-green-500" />
                                        ) : (
                                            <ShieldAlert size={16} className="text-amber-500" />
                                        )}
                                        <span className="text-sm text-[#1d1d1f]">Data quality</span>
                                    </div>
                                    <span className={cn("text-sm font-semibold", 
                                        avmData.underwriting_readiness?.has_actual_sources ? "text-green-600" : "text-amber-600"
                                    )}>
                                        {avmData.underwriting_readiness?.has_actual_sources ? 'Verified' : 'Estimated'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* PIW Calculations - Only shown if available */}
                        {avmData.piw_calculations && (
                            <div className="bento-card overflow-hidden bento-animate">
                                <div className="p-4 border-b border-black/5 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Calculator size={18} className="text-indigo-500" />
                                        <span className="text-xs font-bold text-[#1d1d1f] uppercase tracking-wide">PIW Eligibility</span>
                                    </div>
                                    <span className={cn(
                                        "bento-pill",
                                        avmData.piw_calculations.piw_eligible ? "bento-pill-green" : "bento-pill-orange"
                                    )}>
                                        {avmData.piw_calculations.piw_eligible ? 'Eligible' : 'Review Required'}
                                    </span>
                                </div>
                                <div className="p-4">
                                    <div className="grid grid-cols-2 gap-3 mb-4">
                                        <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100">
                                            <div className="flex items-center gap-2 mb-2">
                                                <DollarSign size={14} className="text-blue-600" />
                                                <span className="text-[10px] font-bold text-blue-700 uppercase">Rate & Term Max</span>
                                            </div>
                                            <p className="text-xl font-bold text-blue-700">{fmt(avmData.piw_calculations.rate_term_max)}</p>
                                            <p className="text-[10px] text-blue-600 mt-1">90% of PIW value</p>
                                        </div>
                                        <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-100">
                                            <div className="flex items-center gap-2 mb-2">
                                                <DollarSign size={14} className="text-emerald-600" />
                                                <span className="text-[10px] font-bold text-emerald-700 uppercase">Cash-Out Max</span>
                                            </div>
                                            <p className="text-xl font-bold text-emerald-700">{fmt(avmData.piw_calculations.cash_out_max)}</p>
                                            <p className="text-[10px] text-emerald-600 mt-1">80% of PIW value</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                                        <span className="text-sm text-[#86868b]">Primary PIW Value</span>
                                        <span className="text-sm font-bold text-[#1d1d1f]">{fmt(avmData.piw_calculations.primary_value)}</span>
                                    </div>
                                    
                                    {avmData.piw_calculations.notes && (
                                        <div className="mt-3 p-3 rounded-lg bg-amber-50 border border-amber-100 flex items-start gap-2">
                                            <AlertTriangle size={14} className="text-amber-600 mt-0.5 shrink-0" />
                                            <p className="text-xs text-amber-700">{avmData.piw_calculations.notes}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

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
