import React, { useState, useMemo } from 'react';
import { Clock, TrendingUp } from 'lucide-react';

export function RecoupCostsTab() {
    const [data, setData] = useState({
        totalClosingCosts: 8057.65,
        monthlySavings: 746.60,
        additionalCashOut: 0,
    });

    const monthsToRecoup = useMemo(() => {
        if (data.monthlySavings <= 0) return Infinity;
        return Math.ceil((data.totalClosingCosts + data.additionalCashOut) / data.monthlySavings);
    }, [data]);

    const yearsToRecoup = (monthsToRecoup / 12).toFixed(1);

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="bg-information-l3 border border-information-l1 rounded-lg p-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-information-l2 flex items-center justify-center">
                        <Clock size={20} className="text-information-d2" />
                    </div>
                    <div>
                        <h3 className="font-medium text-information-d2">Time to Recoup Closing Costs</h3>
                        <p className="text-sm text-neutral-d1">Calculate how long until your monthly savings cover the closing costs</p>
                    </div>
                </div>
            </div>

            {/* Inputs */}
            <div className="bg-white rounded-lg border border-neutral-l3 overflow-hidden">
                <div className="bg-neutral-l4 px-4 py-3 border-b border-neutral-l3">
                    <span className="font-medium text-neutral-d2">Cost & Savings Inputs</span>
                </div>
                <div className="p-4 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-neutral-l1 mb-1">Total Closing Costs</label>
                            <input 
                                type="text" 
                                value={`$${data.totalClosingCosts.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
                                onChange={(e) => setData({ ...data, totalClosingCosts: parseFloat(e.target.value.replace(/[$,]/g, '')) || 0 })}
                                className="w-full border border-neutral-l3 rounded px-3 py-2 text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-neutral-l1 mb-1">Monthly Payment Savings</label>
                            <input 
                                type="text" 
                                value={`$${data.monthlySavings.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
                                onChange={(e) => setData({ ...data, monthlySavings: parseFloat(e.target.value.replace(/[$,]/g, '')) || 0 })}
                                className="w-full border border-neutral-l3 rounded px-3 py-2 text-sm"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-neutral-l1 mb-1">Additional Cash Out (if any)</label>
                        <input 
                            type="text" 
                            value={`$${data.additionalCashOut.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
                            onChange={(e) => setData({ ...data, additionalCashOut: parseFloat(e.target.value.replace(/[$,]/g, '')) || 0 })}
                            className="w-full border border-neutral-l3 rounded px-3 py-2 text-sm"
                        />
                    </div>
                </div>
            </div>

            {/* Results */}
            <div className="bg-white rounded-lg border border-neutral-l3 overflow-hidden">
                <div className="bg-neutral-l4 px-4 py-3 border-b border-neutral-l3">
                    <span className="font-medium text-neutral-d2">Break-Even Analysis</span>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-2 gap-6">
                        {/* Months to Recoup */}
                        <div className="text-center p-6 bg-success-l3/30 rounded-lg border border-success-l2">
                            <TrendingUp size={32} className="text-success mx-auto mb-2" />
                            <p className="text-4xl font-bold text-success-d2">{monthsToRecoup}</p>
                            <p className="text-sm font-medium text-success-d2 mt-1">Months to Break Even</p>
                        </div>
                        
                        {/* Years to Recoup */}
                        <div className="text-center p-6 bg-information-l3/30 rounded-lg border border-information-l2">
                            <Clock size={32} className="text-information mx-auto mb-2" />
                            <p className="text-4xl font-bold text-information-d2">{yearsToRecoup}</p>
                            <p className="text-sm font-medium text-information-d2 mt-1">Years to Break Even</p>
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="mt-6 p-4 bg-neutral-l5 rounded-lg">
                        <h4 className="font-medium text-neutral-d2 mb-2">Summary</h4>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-neutral-d1">Total Costs to Recover:</span>
                                <span className="font-medium text-neutral-d2">
                                    ${(data.totalClosingCosts + data.additionalCashOut).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-neutral-d1">Monthly Savings:</span>
                                <span className="font-medium text-success-d2">
                                    ${data.monthlySavings.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-neutral-d1">Annual Savings:</span>
                                <span className="font-medium text-success-d2">
                                    ${(data.monthlySavings * 12).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                </span>
                            </div>
                            <div className="flex justify-between pt-2 border-t border-neutral-l3">
                                <span className="text-neutral-d2 font-medium">Savings After 5 Years:</span>
                                <span className="font-bold text-success">
                                    ${((data.monthlySavings * 60) - data.totalClosingCosts - data.additionalCashOut).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

