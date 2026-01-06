import React from 'react';
import { Eye, FileText, AlertCircle } from 'lucide-react';

const chartOptions = [
    { value: '', label: 'Select a chart...' },
    { value: 'blended-rate', label: 'Blended Rate on Debt Comparison' },
    { value: 'cash-back', label: 'Cash Back' },
    { value: 'cash-flow', label: 'Estimated Cash Flow Prior to First Payment' },
    { value: 'disposable-income', label: 'Estimated Disposable Income' },
    { value: 'interest-savings', label: 'Interest Savings Comparison Graph' },
    { value: 'payment-savings', label: 'Payment Savings Comparison' },
    { value: 'reinvestment', label: 'Payment Savings Re-Investment Chart' },
    { value: 'solar-partial-pay', label: 'SOLAR: Dynamic Partial Pay Graph' },
    { value: 'solar-itc', label: 'SOLAR: ITC Target Balance Data' },
    { value: 'recoup-costs', label: 'Time to Re-coup the Closing Costs Chart' },
    { value: 'debt-consolidation', label: 'Debt Consolidation Summary' },
];

export function ProposalBuilder({
    chart1,
    chart2,
    onChart1Change,
    onChart2Change,
    includeOption2,
    includeDebtWorksheet,
    spanishVersion,
    onIncludeOption2Change,
    onIncludeDebtWorksheetChange,
    onSpanishVersionChange,
    onPreviewChart,
    onGenerateProposal,
}) {
    const canGenerate = chart1 && chart2;

    return (
        <div className="p-4 space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-lg font-bold text-neutral-d3">Customer Facing Proposal</h2>
                <p className="text-sm text-neutral-l1 mt-1">Configure and generate loan proposals</p>
            </div>

            {/* Chart Selection */}
            <div className="space-y-4">
                <h3 className="text-sm font-medium text-neutral-d2 uppercase tracking-wide">Chart Selection</h3>
                
                {/* Chart 1 */}
                <div>
                    <label className="block text-xs font-medium text-neutral-l1 mb-1">Loan Proposal Chart 1</label>
                    <div className="flex gap-2">
                        <select
                            value={chart1}
                            onChange={(e) => onChart1Change(e.target.value)}
                            className="flex-1 border border-neutral-l3 rounded px-3 py-2 text-sm bg-white focus:border-orange focus:ring-1 focus:ring-orange outline-none"
                        >
                            {chartOptions.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                        <button
                            onClick={() => chart1 && onPreviewChart(chart1)}
                            disabled={!chart1}
                            className="p-2 bg-neutral-l4 hover:bg-neutral-l3 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors"
                            title="Preview Chart"
                        >
                            <Eye size={18} className="text-neutral-d1" />
                        </button>
                    </div>
                </div>

                {/* Chart 2 */}
                <div>
                    <label className="block text-xs font-medium text-neutral-l1 mb-1">Loan Proposal Chart 2</label>
                    <div className="flex gap-2">
                        <select
                            value={chart2}
                            onChange={(e) => onChart2Change(e.target.value)}
                            className="flex-1 border border-neutral-l3 rounded px-3 py-2 text-sm bg-white focus:border-orange focus:ring-1 focus:ring-orange outline-none"
                        >
                            {chartOptions.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                        <button
                            onClick={() => chart2 && onPreviewChart(chart2)}
                            disabled={!chart2}
                            className="p-2 bg-neutral-l4 hover:bg-neutral-l3 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors"
                            title="Preview Chart"
                        >
                            <Eye size={18} className="text-neutral-d1" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Loan Scenario Selection */}
            <div className="space-y-3">
                <h3 className="text-sm font-medium text-neutral-d2 uppercase tracking-wide">Loan Scenario Selection</h3>
                
                <label className="flex items-center gap-3 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={includeOption2}
                        onChange={(e) => onIncludeOption2Change(e.target.checked)}
                        className="h-4 w-4 accent-orange rounded"
                    />
                    <span className="text-sm text-neutral-d1">Include Option 2 in Proposal</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={includeDebtWorksheet}
                        onChange={(e) => onIncludeDebtWorksheetChange(e.target.checked)}
                        className="h-4 w-4 accent-orange rounded"
                    />
                    <span className="text-sm text-neutral-d1">Include Debt Consolidation Worksheet</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={spanishVersion}
                        onChange={(e) => onSpanishVersionChange(e.target.checked)}
                        className="h-4 w-4 accent-orange rounded"
                    />
                    <span className="text-sm text-neutral-d1">Spanish Version</span>
                </label>
            </div>

            {/* Metadata */}
            <div className="space-y-3">
                <div>
                    <label className="block text-xs font-medium text-neutral-l1 mb-1">Date of Last Generated Proposal</label>
                    <input
                        type="text"
                        readOnly
                        value=""
                        placeholder="Not yet generated"
                        className="w-full border border-neutral-l3 rounded px-3 py-2 text-sm bg-neutral-l5 text-neutral-l1"
                    />
                </div>
                <div>
                    <label className="block text-xs font-medium text-neutral-l1 mb-1">Last Generated By</label>
                    <input
                        type="text"
                        readOnly
                        value=""
                        placeholder="—"
                        className="w-full border border-neutral-l3 rounded px-3 py-2 text-sm bg-neutral-l5 text-neutral-l1"
                    />
                </div>
            </div>

            {/* Generate Button */}
            <button
                onClick={onGenerateProposal}
                disabled={!canGenerate}
                className="w-full flex items-center justify-center gap-2 bg-orange hover:bg-orange-d1 disabled:bg-neutral-l3 disabled:text-neutral-l1 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
                <FileText size={18} />
                Generate Proposal
            </button>

            {/* Notice */}
            <div className="bg-neutral-l5 border border-neutral-l3 rounded-lg p-3">
                <h4 className="text-sm font-medium text-neutral-d2 mb-2">Notice</h4>
                <div className="min-h-[60px] text-sm text-neutral-l1">
                    {!canGenerate && (
                        <div className="flex items-start gap-2 text-warning-d2">
                            <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                            <span>Please select both charts to generate a Customer Facing Proposal.</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Info Text */}
            <p className="text-xs text-neutral-l1 text-center">
                You must pick 2 graphs/charts for a Loan Proposal to populate.
            </p>
        </div>
    );
}



