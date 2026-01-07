import React, { useMemo } from 'react';
import { TrendingUp, DollarSign, Percent, Calendar } from 'lucide-react';

export function CompoundInterestTab({ data, onChange }) {
    const handleChange = (field, value) => {
        onChange({
            ...data,
            [field]: value
        });
    };

    // Calculate compound interest
    const results = useMemo(() => {
        const { initialInvestment, monthlyInvestment, rateOfReturn, yearsInvested } = data;
        const monthlyRate = rateOfReturn / 100 / 12;
        const totalMonths = yearsInvested * 12;
        
        let futureValue = initialInvestment;
        
        // Compound the initial investment
        futureValue *= Math.pow(1 + monthlyRate, totalMonths);
        
        // Add monthly contributions with compound interest
        if (monthlyRate > 0) {
            futureValue += monthlyInvestment * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate);
        } else {
            futureValue += monthlyInvestment * totalMonths;
        }
        
        const totalContributions = initialInvestment + (monthlyInvestment * totalMonths);
        const interestEarned = futureValue - totalContributions;
        
        return {
            totalInvested: totalContributions,
            interestEarned: Math.max(0, interestEarned),
            futureValue: Math.max(0, futureValue)
        };
    }, [data]);

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="bg-alternativePrimary-l4 border border-alternativePrimary-l1 rounded-lg p-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-alternativePrimary-l1 flex items-center justify-center">
                        <TrendingUp size={20} className="text-white" />
                    </div>
                    <div>
                        <h3 className="font-medium text-alternativePrimary-d2">Compound Interest Forecaster</h3>
                        <p className="text-sm text-neutral-d1">Project investment growth from your monthly savings</p>
                    </div>
                </div>
            </div>

            {/* Input Section */}
            <div className="bg-white rounded-lg border border-neutral-l3 overflow-hidden">
                <div className="bg-neutral-l4 px-4 py-3 border-b border-neutral-l3">
                    <span className="font-medium text-neutral-d2">Investment Inputs</span>
                </div>
                <div className="p-4 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        {/* Initial Investment */}
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <input 
                                    type="checkbox" 
                                    checked={data.initialInvestment > 0}
                                    className="h-4 w-4 accent-alternativePrimary"
                                />
                                <label className="text-xs font-medium text-neutral-l1">Initial Investment</label>
                            </div>
                            <div className="relative">
                                <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-l1" />
                                <input 
                                    type="text" 
                                    value={data.initialInvestment.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                    onChange={(e) => handleChange('initialInvestment', parseFloat(e.target.value.replace(/,/g, '')) || 0)}
                                    className="w-full border border-neutral-l3 rounded pl-8 pr-3 py-2 text-sm text-right"
                                />
                            </div>
                        </div>

                        {/* Monthly Investment */}
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <input 
                                    type="checkbox" 
                                    checked={data.monthlyInvestment > 0}
                                    className="h-4 w-4 accent-alternativePrimary"
                                />
                                <label className="text-xs font-medium text-neutral-l1">Additional Monthly Investment</label>
                            </div>
                            <div className="relative">
                                <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-l1" />
                                <input 
                                    type="text" 
                                    value={data.monthlyInvestment.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                    onChange={(e) => handleChange('monthlyInvestment', parseFloat(e.target.value.replace(/,/g, '')) || 0)}
                                    className="w-full border border-neutral-l3 rounded pl-8 pr-3 py-2 text-sm text-right"
                                />
                            </div>
                        </div>

                        {/* Rate of Return */}
                        <div>
                            <label className="text-xs font-medium text-neutral-l1 mb-1 block">Customer's Chosen Rate of Return</label>
                            <div className="relative">
                                <input 
                                    type="text" 
                                    value={data.rateOfReturn}
                                    onChange={(e) => handleChange('rateOfReturn', parseFloat(e.target.value) || 0)}
                                    className="w-full border border-neutral-l3 rounded px-3 py-2 text-sm text-right pr-8"
                                />
                                <Percent size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-l1" />
                            </div>
                        </div>

                        {/* Years Invested */}
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <input 
                                    type="checkbox" 
                                    checked={data.yearsInvested > 0}
                                    className="h-4 w-4 accent-alternativePrimary"
                                />
                                <label className="text-xs font-medium text-neutral-l1">Number of Years Invested</label>
                            </div>
                            <div className="relative">
                                <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-l1" />
                                <input 
                                    type="number" 
                                    value={data.yearsInvested}
                                    onChange={(e) => handleChange('yearsInvested', parseInt(e.target.value) || 0)}
                                    className="w-full border border-neutral-l3 rounded pl-8 pr-3 py-2 text-sm text-right"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Results Section */}
            <div className="bg-white rounded-lg border border-neutral-l3 overflow-hidden">
                <div className="bg-neutral-l4 px-4 py-3 border-b border-neutral-l3">
                    <span className="font-medium text-neutral-d2">Investment Projection</span>
                </div>
                <div className="p-4">
                    <div className="space-y-3">
                        <ResultRow 
                            label="Total Amount Invested" 
                            value={`($${results.totalInvested.toLocaleString('en-US', { minimumFractionDigits: 2 })})`}
                        />
                        <ResultRow 
                            label="Total Interest Earned" 
                            value={`$${results.interestEarned.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
                            highlight={results.interestEarned > 0}
                        />
                        <div className="pt-3 border-t border-neutral-l3">
                            <ResultRow 
                                label="Value of Investment" 
                                value={`($${results.futureValue.toLocaleString('en-US', { minimumFractionDigits: 2 })})`}
                                bold
                            />
                        </div>
                    </div>

                    {/* Visual Breakdown */}
                    <div className="mt-6 p-4 bg-alternativePrimary-l4/50 rounded-lg">
                        <h4 className="font-medium text-alternativePrimary-d2 mb-3">Growth Breakdown</h4>
                        <div className="h-8 rounded-full overflow-hidden flex bg-neutral-l3">
                            <div 
                                className="bg-alternativePrimary h-full transition-all"
                                style={{ width: `${(results.totalInvested / results.futureValue) * 100}%` }}
                            />
                            <div 
                                className="bg-success h-full transition-all"
                                style={{ width: `${(results.interestEarned / results.futureValue) * 100}%` }}
                            />
                        </div>
                        <div className="flex justify-between mt-2 text-xs">
                            <span className="flex items-center gap-1">
                                <span className="w-3 h-3 rounded bg-alternativePrimary"></span>
                                Principal: ${results.totalInvested.toLocaleString()}
                            </span>
                            <span className="flex items-center gap-1">
                                <span className="w-3 h-3 rounded bg-success"></span>
                                Interest: ${results.interestEarned.toLocaleString()}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ResultRow({ label, value, highlight, bold }) {
    return (
        <div className="flex justify-between items-center">
            <span className={`text-sm ${bold ? 'font-medium text-neutral-d2' : 'text-neutral-d1'}`}>{label}</span>
            <span className={`text-sm ${bold ? 'font-bold text-alternativePrimary-d2' : ''} ${highlight ? 'text-success font-medium' : 'text-neutral-d2'}`}>
                {value}
            </span>
        </div>
    );
}





