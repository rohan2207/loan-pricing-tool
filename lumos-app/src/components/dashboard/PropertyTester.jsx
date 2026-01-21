import React, { useState } from 'react';
import { 
    Home, 
    Search, 
    RefreshCw, 
    MapPin,
    DollarSign,
    Building2,
    Calendar,
    Ruler,
    BedDouble,
    Bath,
    AlertCircle,
    CheckCircle,
    ChevronDown,
    ChevronUp
} from 'lucide-react';
import { cn } from '../../lib/utils';

const fmt = (n) => n ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n) : 'N/A';

export function PropertyTester() {
    const [formData, setFormData] = useState({
        address: '2116 Shrewsbury Dr',
        city: 'McKinney',
        state: 'TX',
        zip: '75071',
        sqft: 3850,
        bedrooms: 5,
        bathrooms: 4.5,
        yearBuilt: 2017,
        internalValue: 750000
    });
    
    const [isLoading, setIsLoading] = useState(false);
    const [results, setResults] = useState(null);
    const [error, setError] = useState(null);
    const [showRawResponse, setShowRawResponse] = useState(false);
    const [rawResponse, setRawResponse] = useState(null);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleTest = async () => {
        setIsLoading(true);
        setError(null);
        setResults(null);
        setRawResponse(null);
        
        try {
            const response = await fetch('/api/ai/avm', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    address: formData.address,
                    city: formData.city,
                    state: formData.state,
                    zip: formData.zip,
                    livingArea: parseInt(formData.sqft),
                    bedrooms: parseInt(formData.bedrooms),
                    bathrooms: parseFloat(formData.bathrooms),
                    yearBuilt: parseInt(formData.yearBuilt),
                    internalValue: parseInt(formData.internalValue) || 0
                })
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'API request failed');
            }
            
            setResults(data);
            setRawResponse(JSON.stringify(data, null, 2));
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f5f5f7] p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                            <Search size={24} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-[#1d1d1f]">Property AVM Tester</h1>
                            <p className="text-sm text-[#86868b]">Test property valuations with different inputs</p>
                        </div>
                    </div>
                </div>

                {/* Input Form */}
                <div className="bg-white rounded-2xl shadow-sm border border-black/5 p-6 mb-6">
                    <h2 className="text-sm font-bold text-[#1d1d1f] uppercase tracking-wide mb-4">Property Details</h2>
                    
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        {/* Address */}
                        <div className="col-span-2">
                            <label className="flex items-center gap-2 text-xs font-semibold text-[#86868b] mb-1">
                                <MapPin size={14} /> Street Address
                            </label>
                            <input
                                type="text"
                                value={formData.address}
                                onChange={(e) => handleInputChange('address', e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-black/10 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                                placeholder="123 Main St"
                            />
                        </div>
                        
                        {/* City */}
                        <div>
                            <label className="flex items-center gap-2 text-xs font-semibold text-[#86868b] mb-1">
                                <Building2 size={14} /> City
                            </label>
                            <input
                                type="text"
                                value={formData.city}
                                onChange={(e) => handleInputChange('city', e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-black/10 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                                placeholder="McKinney"
                            />
                        </div>
                        
                        {/* State */}
                        <div>
                            <label className="text-xs font-semibold text-[#86868b] mb-1 block">State</label>
                            <input
                                type="text"
                                value={formData.state}
                                onChange={(e) => handleInputChange('state', e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-black/10 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                                placeholder="TX"
                            />
                        </div>
                        
                        {/* Zip */}
                        <div>
                            <label className="text-xs font-semibold text-[#86868b] mb-1 block">ZIP Code</label>
                            <input
                                type="text"
                                value={formData.zip}
                                onChange={(e) => handleInputChange('zip', e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-black/10 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                                placeholder="75071"
                            />
                        </div>
                        
                        {/* Square Feet */}
                        <div>
                            <label className="flex items-center gap-2 text-xs font-semibold text-[#86868b] mb-1">
                                <Ruler size={14} /> Square Feet
                            </label>
                            <input
                                type="number"
                                value={formData.sqft}
                                onChange={(e) => handleInputChange('sqft', e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-black/10 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                                placeholder="2500"
                            />
                        </div>
                        
                        {/* Bedrooms */}
                        <div>
                            <label className="flex items-center gap-2 text-xs font-semibold text-[#86868b] mb-1">
                                <BedDouble size={14} /> Bedrooms
                            </label>
                            <input
                                type="number"
                                value={formData.bedrooms}
                                onChange={(e) => handleInputChange('bedrooms', e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-black/10 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                                placeholder="4"
                            />
                        </div>
                        
                        {/* Bathrooms */}
                        <div>
                            <label className="flex items-center gap-2 text-xs font-semibold text-[#86868b] mb-1">
                                <Bath size={14} /> Bathrooms
                            </label>
                            <input
                                type="number"
                                step="0.5"
                                value={formData.bathrooms}
                                onChange={(e) => handleInputChange('bathrooms', e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-black/10 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                                placeholder="3"
                            />
                        </div>
                        
                        {/* Year Built */}
                        <div>
                            <label className="flex items-center gap-2 text-xs font-semibold text-[#86868b] mb-1">
                                <Calendar size={14} /> Year Built
                            </label>
                            <input
                                type="number"
                                value={formData.yearBuilt}
                                onChange={(e) => handleInputChange('yearBuilt', e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-black/10 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                                placeholder="2010"
                            />
                        </div>
                        
                        {/* Internal AVM */}
                        <div className="col-span-2">
                            <label className="flex items-center gap-2 text-xs font-semibold text-[#86868b] mb-1">
                                <DollarSign size={14} /> Internal AVM Value (optional)
                            </label>
                            <input
                                type="number"
                                value={formData.internalValue}
                                onChange={(e) => handleInputChange('internalValue', e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-black/10 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                                placeholder="750000"
                            />
                            <p className="text-xs text-[#86868b] mt-1">Leave empty or 0 to exclude internal AVM from results</p>
                        </div>
                    </div>
                    
                    {/* Test Button */}
                    <button
                        onClick={handleTest}
                        disabled={isLoading}
                        className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                        {isLoading ? (
                            <>
                                <RefreshCw size={20} className="animate-spin" />
                                Testing...
                            </>
                        ) : (
                            <>
                                <Search size={20} />
                                Test Property Valuation
                            </>
                        )}
                    </button>
                </div>

                {/* Error Display */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6">
                        <div className="flex items-center gap-2 text-red-600">
                            <AlertCircle size={20} />
                            <span className="font-semibold">Error</span>
                        </div>
                        <p className="text-sm text-red-700 mt-1">{error}</p>
                    </div>
                )}

                {/* Results */}
                {results && (
                    <div className="space-y-4">
                        {/* Summary Card */}
                        <div className="bg-white rounded-2xl shadow-sm border border-black/5 p-6">
                            <h2 className="text-sm font-bold text-[#1d1d1f] uppercase tracking-wide mb-4">Valuation Summary</h2>
                            
                            <div className="grid grid-cols-3 gap-4 mb-4">
                                <div className="p-4 rounded-xl bg-green-50 border border-green-200">
                                    <p className="text-xs font-semibold text-green-700 mb-1">Conservative</p>
                                    <p className="text-2xl font-bold text-green-600">{fmt(results.value_options?.conservative?.value)}</p>
                                </div>
                                <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
                                    <p className="text-xs font-semibold text-blue-700 mb-1">Average</p>
                                    <p className="text-2xl font-bold text-blue-600">{fmt(results.aus_recommended?.value)}</p>
                                </div>
                                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
                                    <p className="text-xs font-semibold text-amber-700 mb-1">Highest</p>
                                    <p className="text-2xl font-bold text-amber-600">{fmt(results.value_options?.aggressive?.value)}</p>
                                </div>
                            </div>
                            
                            <div className="p-3 rounded-lg bg-slate-50 text-sm text-[#86868b]">
                                <strong>Variance:</strong> {results.source_comparison?.variance_percent}% | 
                                <strong> Sources:</strong> {results.source_comparison?.total_sources}
                            </div>
                        </div>

                        {/* All Sources */}
                        <div className="bg-white rounded-2xl shadow-sm border border-black/5 p-6">
                            <h2 className="text-sm font-bold text-[#1d1d1f] uppercase tracking-wide mb-4">
                                All Sources ({results.source_comparison?.all_sources?.length || 0})
                            </h2>
                            
                            <div className="space-y-3">
                                {results.source_comparison?.all_sources?.map((source, idx) => (
                                    <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <span className={cn(
                                                    "px-2 py-0.5 rounded text-xs font-semibold",
                                                    source.type === 'internal' ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                                                )}>
                                                    {source.type === 'internal' ? 'Internal' : 'External'}
                                                </span>
                                                <span className="font-semibold text-[#1d1d1f]">{source.name}</span>
                                            </div>
                                            <span className="text-xl font-bold text-[#1d1d1f]">{fmt(source.value)}</span>
                                        </div>
                                        {source.reasoning && (
                                            <p className="text-xs text-[#86868b]">{source.reasoning}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* PIW Calculations */}
                        <div className="bg-white rounded-2xl shadow-sm border border-black/5 p-6">
                            <h2 className="text-sm font-bold text-[#1d1d1f] uppercase tracking-wide mb-4">PIW Calculations</h2>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
                                    <p className="text-xs font-semibold text-blue-700 mb-1">Rate & Term Max (90%)</p>
                                    <p className="text-xl font-bold text-blue-600">{fmt(results.piw_calculations?.rate_term_max)}</p>
                                </div>
                                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                                    <p className="text-xs font-semibold text-emerald-700 mb-1">Cash-Out Max (80%)</p>
                                    <p className="text-xl font-bold text-emerald-600">{fmt(results.piw_calculations?.cash_out_max)}</p>
                                </div>
                            </div>
                            
                            <div className="mt-4 p-3 rounded-lg bg-slate-50 flex items-center gap-2">
                                {results.piw_calculations?.piw_eligible ? (
                                    <>
                                        <CheckCircle size={16} className="text-green-500" />
                                        <span className="text-sm text-green-700 font-medium">PIW Eligible</span>
                                    </>
                                ) : (
                                    <>
                                        <AlertCircle size={16} className="text-amber-500" />
                                        <span className="text-sm text-amber-700 font-medium">PIW Review Required</span>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Methodology & Disclaimer */}
                        {(results.methodology || results.disclaimer) && (
                            <div className="bg-white rounded-2xl shadow-sm border border-black/5 p-6">
                                {results.methodology && (
                                    <div className="mb-4">
                                        <h3 className="text-xs font-bold text-[#1d1d1f] uppercase mb-2">Methodology</h3>
                                        <p className="text-sm text-[#86868b]">{results.methodology}</p>
                                    </div>
                                )}
                                {results.disclaimer && (
                                    <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
                                        <p className="text-xs text-amber-700">{results.disclaimer}</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Raw Response Toggle */}
                        <div className="bg-white rounded-2xl shadow-sm border border-black/5 overflow-hidden">
                            <button
                                onClick={() => setShowRawResponse(!showRawResponse)}
                                className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
                            >
                                <span className="text-sm font-semibold text-[#1d1d1f]">Raw API Response</span>
                                {showRawResponse ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                            </button>
                            
                            {showRawResponse && rawResponse && (
                                <div className="p-4 border-t border-black/5 bg-slate-900">
                                    <pre className="text-xs text-green-400 overflow-auto max-h-96">
                                        {rawResponse}
                                    </pre>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default PropertyTester;
