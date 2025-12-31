import React from 'react';
import { Phone } from 'lucide-react';

export function ProposalPreview({ chart1, chart2, includeDebtWorksheet, data }) {
    // Use passed data if available
    const monthlySavings = data?.monthlySavings || 747;
    const debtsPayoff = data?.debtsPayoff || 483314;
    const debtsMonthlyPayment = data?.debtsMonthlyPayment || 4156;

    return (
        <div className="h-full flex flex-col bg-neutral-l5">
            {/* Header */}
            <div className="bg-white border-b border-neutral-l3 px-4 py-3 flex-shrink-0">
                <h2 className="font-medium text-neutral-d2">Proposal Preview</h2>
            </div>

            {/* Proposal Content - Mobile Preview Style */}
            <div className="flex-1 overflow-y-auto p-4">
                <div className="max-w-sm mx-auto bg-white rounded-2xl shadow-lg overflow-hidden border border-neutral-l3">
                    {/* GoodLeap Header */}
                    <div className="bg-white p-4 border-b border-neutral-l3">
                        <div className="flex items-center justify-center gap-2">
                            <div className="w-8 h-8 bg-orange rounded-full flex items-center justify-center">
                                <span className="text-white font-bold text-sm">G</span>
                            </div>
                            <span className="text-xl font-bold">
                                g<span className="text-orange">oo</span>dleap
                            </span>
                        </div>
                    </div>

                    {/* Borrower & LO Info */}
                    <div className="grid grid-cols-2 gap-4 p-4 bg-neutral-l5 text-xs">
                        <div>
                            <p className="font-bold text-orange uppercase text-[10px] mb-1">Loan Proposal For</p>
                            <p className="font-medium text-neutral-d2">John Smith</p>
                            <p className="text-neutral-l1">123 Main Street</p>
                            <p className="text-neutral-l1">Austin, TX 78701</p>
                        </div>
                        <div className="text-right">
                            <p className="font-bold text-orange uppercase text-[10px] mb-1">Provided By</p>
                            <p className="font-medium text-neutral-d2">Jane Doe</p>
                            <p className="text-neutral-l1">Mortgage Specialist</p>
                            <p className="text-neutral-l1 flex items-center justify-end gap-1">
                                <Phone size={10} /> 555-123-4567
                            </p>
                        </div>
                    </div>

                    {/* Loan Proposal Section */}
                    <div className="p-4">
                        <h3 className="text-center font-bold text-neutral-d3 mb-3 text-sm uppercase tracking-wide">
                            Loan Proposal
                        </h3>
                        <table className="w-full text-xs">
                            <thead>
                                <tr className="border-b border-neutral-l3">
                                    <th className="py-2 text-left font-medium text-neutral-l1"></th>
                                    <th className="py-2 text-right font-medium text-neutral-l1">Current</th>
                                    <th className="py-2 text-right font-medium text-orange">Proposed Loan</th>
                                </tr>
                            </thead>
                            <tbody className="text-neutral-d2">
                                <tr className="border-b border-neutral-l3">
                                    <td className="py-1.5">Loan Program/Term</td>
                                    <td className="py-1.5 text-right">30 Year Fixed</td>
                                    <td className="py-1.5 text-right">30 Year Fixed</td>
                                </tr>
                                <tr className="border-b border-neutral-l3">
                                    <td className="py-1.5">Interest Rate</td>
                                    <td className="py-1.5 text-right">3.0%</td>
                                    <td className="py-1.5 text-right">5.875%</td>
                                </tr>
                                <tr className="border-b border-neutral-l3">
                                    <td className="py-1.5">APR</td>
                                    <td className="py-1.5 text-right">-</td>
                                    <td className="py-1.5 text-right">6.183%</td>
                                </tr>
                                <tr className="border-b border-neutral-l3">
                                    <td className="py-1.5">Principal & Interest Payment</td>
                                    <td className="py-1.5 text-right">$900.00</td>
                                    <td className="py-1.5 text-right">$1,478.84</td>
                                </tr>
                                <tr className="border-b border-neutral-l3">
                                    <td className="py-1.5">Mortgage Insurance</td>
                                    <td className="py-1.5 text-right">$0.00</td>
                                    <td className="py-1.5 text-right">$0.00</td>
                                </tr>
                                <tr className="bg-neutral-l5">
                                    <td className="py-1.5 font-medium">Total Payment w/ Taxes & Ins.</td>
                                    <td className="py-1.5 text-right font-medium">$1,250.00</td>
                                    <td className="py-1.5 text-right font-medium text-orange">$1,828.84</td>
                                </tr>
                            </tbody>
                        </table>
                        <p className="text-[10px] text-neutral-l1 mt-2 italic">
                            Your actual rate, payment, and costs could be higher. Get an official Loan Estimate before choosing a loan.
                        </p>
                    </div>

                    {/* Your Benefits Section */}
                    <div className="bg-orange p-3">
                        <h3 className="text-center font-bold text-white text-sm uppercase tracking-wide">
                            Your Benefits
                        </h3>
                    </div>

                    <div className="p-4 bg-orange-l3/20">
                        <p className="text-[10px] text-center text-orange-d2 font-medium uppercase tracking-wide mb-3">
                            Proposed Loan
                        </p>
                        
                        {/* Mini Chart Previews */}
                        <div className="grid grid-cols-2 gap-3">
                            {/* Chart 1 Preview */}
                            <div className="bg-white rounded-lg p-3 border border-neutral-l3">
                                <p className="text-[10px] font-medium text-neutral-d2 text-center mb-2">
                                    {chart1 === 'payment-savings' ? 'CURRENT VS. NEW PAYMENTS' : 'Chart 1'}
                                </p>
                                <div className="h-24 flex items-end justify-center gap-2">
                                    <div className="w-8 bg-information rounded-t" style={{ height: '80%' }}></div>
                                    <div className="w-8 bg-orange rounded-t" style={{ height: '50%' }}></div>
                                </div>
                                <div className="text-center mt-2">
                                    <p className="text-sm font-bold text-success">${monthlySavings.toLocaleString()}</p>
                                    <p className="text-[10px] text-neutral-l1">Monthly Savings</p>
                                </div>
                            </div>

                            {/* Chart 2 Preview */}
                            <div className="bg-white rounded-lg p-3 border border-neutral-l3">
                                <p className="text-[10px] font-medium text-neutral-d2 text-center mb-2">
                                    {chart2 === 'disposable-income' ? 'DISPOSABLE INCOME' : 'Chart 2'}
                                </p>
                                <div className="h-24 flex items-center justify-center">
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-success-d2">42.4%</p>
                                        <p className="text-[10px] text-neutral-l1">New Disposable</p>
                                    </div>
                                </div>
                                <div className="text-center mt-2">
                                    <p className="text-sm font-bold text-success">+9.4%</p>
                                    <p className="text-[10px] text-neutral-l1">Increase</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Debt Consolidation Summary (if included) */}
                    {includeDebtWorksheet && (
                        <div className="p-4 border-t border-neutral-l3">
                            <h4 className="text-xs font-bold text-neutral-d2 mb-2">Debt Consolidation Summary</h4>
                            <div className="text-xs space-y-1">
                                <div className="flex justify-between">
                                    <span className="text-neutral-l1">Total Debts Consolidated:</span>
                                    <span className="font-medium">${debtsPayoff.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-neutral-l1">Monthly Payments Eliminated:</span>
                                    <span className="font-medium text-success">${debtsMonthlyPayment.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Footer */}
                    <div className="p-3 bg-neutral-l5 border-t border-neutral-l3">
                        <p className="text-[8px] text-neutral-l1 text-center">
                            GoodLeap, LLC. 8781 Sierra College Blvd, Roseville CA 95661 NMLS# 30336 goodleap.com
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
