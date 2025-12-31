import React, { useState } from 'react';
import { cn } from '../../lib/utils';
import { AlertCircle, Check, Pencil } from 'lucide-react';

export function QuickQuote() {
    const [selectedProgram, setSelectedProgram] = useState('Conventional');
    const [selectedTerm, setSelectedTerm] = useState(30);
    const [ltv, setLtv] = useState(82);
    const [productCategory, setProductCategory] = useState('Refinance');

    const programs = ['Conventional', 'FHA', 'VA', 'FHA Streamline', 'VA IRRRL'];
    const terms = [30, 20, 15, 10];

    return (
        <div className="p-4 bg-neutral-l5 min-h-full">
            <h2 className="text-lg font-bold text-neutral-d3 mb-4">Calculators</h2>
            
            {/* Warning Banner */}
            <div className="bg-warning-l5 border border-warning-l3 rounded-lg p-3 mb-4">
                <div className="flex items-start gap-2">
                    <AlertCircle size={18} className="text-warning-d2 mt-0.5 flex-shrink-0" />
                    <div className="text-xs text-neutral-d2">
                        <p className="font-semibold text-warning-d2 mb-1">Important: These are estimates only, not guaranteed rates or pricing.</p>
                        <p>Estimates are based on consumer finance profile data and may not reflect current market conditions or complete borrower information. A formal mortgage application with credit pull is required for accurate pricing.</p>
                    </div>
                </div>
            </div>

            {/* Three Column Comparison */}
            <div className="grid grid-cols-3 gap-3 mb-4">
                {/* Present Mortgage */}
                <div className="bg-white rounded-lg border border-neutral-l3 p-3">
                    <h3 className="text-xs font-semibold text-neutral-d2 mb-3 uppercase tracking-wide">Present Mortgage</h3>
                    <div className="space-y-2 text-xs">
                        <ComparisonRow label="Mortgage" value="$1,710" />
                        <ComparisonRow label="Taxes" value="$1,015" />
                        <ComparisonRow label="Insurance" value="$0" />
                        <ComparisonRow label="Discount" value="$0" />
                        <ComparisonRow label="Mortgage Insurance" value="$0" />
                        <div className="border-t border-neutral-l3 pt-2 mt-2">
                            <ComparisonRow label="Current Payment" value="$4,206" bold />
                        </div>
                    </div>
                </div>

                {/* Proposed Mortgage */}
                <div className="bg-white rounded-lg border border-neutral-l3 p-3">
                    <h3 className="text-xs font-semibold text-neutral-d2 mb-3 uppercase tracking-wide">Proposed Mortgage</h3>
                    <div className="space-y-2 text-xs">
                        <ComparisonRow label="Mortgage" value="$0" />
                        <ComparisonRow label="Debts" value="$525,314" />
                        <ComparisonRow label="Debt Payoff Total" value="$483,314" />
                        <ComparisonRow label="Remaining Debt" value="$42,000" />
                        <div className="border-t border-neutral-l3 pt-2 mt-2">
                            <ComparisonRow label="New Payment" value="$1,015" bold />
                        </div>
                    </div>
                </div>

                {/* Value Propositions */}
                <div className="bg-white rounded-lg border border-neutral-l3 p-3">
                    <h3 className="text-xs font-semibold text-neutral-d2 mb-3 uppercase tracking-wide">Value Propositions</h3>
                    <div className="space-y-2 text-xs">
                        <ComparisonRow label="Monthly Savings" value="$3,191" valueColor="text-success" />
                        <ComparisonRow label="Annual Savings" value="$38,292" valueColor="text-success" />
                        <ComparisonRow label="Extra Payment" value="$0" editable />
                        <ComparisonRow label="Years Saved" value="0" />
                        <ComparisonRow label="Interest Saved" value="$0" />
                        <ComparisonRow label="Est. Cash Back" value="$0" />
                    </div>
                </div>
            </div>

            {/* Configurations */}
            <div className="bg-white rounded-lg border border-neutral-l3 p-4 mb-4">
                <h3 className="text-sm font-semibold text-neutral-d2 mb-4">Configurations</h3>
                
                {/* Product Category */}
                <div className="flex justify-end mb-4">
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-neutral-l1">Product category</span>
                        <select 
                            value={productCategory}
                            onChange={(e) => setProductCategory(e.target.value)}
                            className="text-sm border border-neutral-l3 rounded px-2 py-1 bg-white"
                        >
                            <option value="Refinance">Refinance</option>
                            <option value="Purchase">Purchase</option>
                        </select>
                    </div>
                </div>

                {/* Program Selection */}
                <div className="mb-4">
                    <label className="text-xs font-medium text-neutral-d1 mb-2 block">Program</label>
                    <div className="flex flex-wrap gap-2">
                        {programs.map((program) => (
                            <button
                                key={program}
                                onClick={() => setSelectedProgram(program)}
                                className={cn(
                                    "px-3 py-1.5 text-xs font-medium rounded-full border transition-colors",
                                    selectedProgram === program
                                        ? "bg-information-l3 text-information-d2 border-information-l1"
                                        : "bg-white text-neutral-d2 border-neutral-l3 hover:border-neutral-l1"
                                )}
                            >
                                {selectedProgram === program && <Check size={12} className="inline mr-1" />}
                                {program}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Term Selection */}
                <div className="mb-4">
                    <label className="text-xs font-medium text-neutral-d1 mb-2 block">Term</label>
                    <div className="flex gap-2">
                        {terms.map((term) => (
                            <button
                                key={term}
                                onClick={() => setSelectedTerm(term)}
                                className={cn(
                                    "w-10 h-10 text-sm font-medium rounded-full border transition-colors",
                                    selectedTerm === term
                                        ? "bg-information-l3 text-information-d2 border-information-l1"
                                        : "bg-white text-neutral-d2 border-neutral-l3 hover:border-neutral-l1"
                                )}
                            >
                                {selectedTerm === term && <Check size={10} className="inline mr-0.5" />}
                                {term}
                            </button>
                        ))}
                    </div>
                </div>

                {/* LTV Slider */}
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                        <label className="text-xs font-medium text-neutral-d1">LTV</label>
                        <div className="flex items-center gap-1">
                            <Pencil size={12} className="text-neutral-l1" />
                            <span className="text-sm font-medium text-information">{ltv}%</span>
                        </div>
                    </div>
                    <div className="relative">
                        <input
                            type="range"
                            min="50"
                            max="100"
                            value={ltv}
                            onChange={(e) => setLtv(parseInt(e.target.value))}
                            className="w-full h-2 bg-gradient-to-r from-success via-warning to-danger rounded-lg appearance-none cursor-pointer slider-thumb"
                            style={{
                                background: `linear-gradient(to right, #22c55e 0%, #eab308 50%, #ef4444 100%)`
                            }}
                        />
                        <div className="flex justify-between text-xs text-neutral-l1 mt-1">
                            <span>50</span>
                            <span>65</span>
                            <span>80</span>
                            <span>75</span>
                            <span>80</span>
                            <span>85</span>
                            <span>90</span>
                            <span>95</span>
                            <span>100</span>
                        </div>
                    </div>
                </div>

                {/* Bottom Row: Loan Amount, Debts, Cashout, Interest Rate */}
                <div className="grid grid-cols-4 gap-3">
                    <div>
                        <label className="text-xs text-neutral-l1 mb-1 block">Loan amount</label>
                        <input 
                            type="text" 
                            value="483,314" 
                            readOnly
                            className="w-full text-sm font-medium text-neutral-d2 border border-neutral-l3 rounded px-2 py-1.5 bg-neutral-l5"
                        />
                    </div>
                    <div>
                        <label className="text-xs text-neutral-l1 mb-1 block">Debts</label>
                        <input 
                            type="text" 
                            value="483,314" 
                            readOnly
                            className="w-full text-sm font-medium text-neutral-l1 border border-neutral-l3 rounded px-2 py-1.5 bg-neutral-l5"
                        />
                    </div>
                    <div>
                        <label className="text-xs text-neutral-l1 mb-1 block">Cashout</label>
                        <input 
                            type="text" 
                            placeholder="none" 
                            className="w-full text-sm text-neutral-l1 border border-neutral-l3 rounded px-2 py-1.5 bg-white"
                        />
                    </div>
                    <div>
                        <label className="text-xs text-neutral-l1 mb-1 block">Interest Rate</label>
                        <select className="w-full text-sm text-neutral-l1 border border-neutral-l3 rounded px-2 py-1.5 bg-white">
                            <option value="">Search for rates first</option>
                            <option value="6.5">6.500%</option>
                            <option value="6.75">6.750%</option>
                            <option value="7.0">7.000%</option>
                        </select>
                    </div>
                </div>

                {/* Search Rates Button */}
                <div className="mt-4 flex justify-end">
                    <button className="bg-success hover:bg-success-d2 text-white font-medium px-4 py-2 rounded text-sm transition-colors">
                        Search Rates
                    </button>
                </div>
            </div>
        </div>
    );
}

function ComparisonRow({ label, value, bold, valueColor, editable }) {
    return (
        <div className="flex justify-between items-center">
            <span className={cn("text-neutral-d1", bold && "font-semibold")}>{label}</span>
            <div className="flex items-center gap-1">
                {editable && <Pencil size={10} className="text-neutral-l1" />}
                <span className={cn(bold ? "font-bold" : "font-medium", valueColor || "text-neutral-d2")}>{value}</span>
            </div>
        </div>
    );
}
