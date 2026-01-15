import React, { useState } from 'react';
import { Sun } from 'lucide-react';

export function SolarLoanPaydownTab() {
    const [solarData, setSolarData] = useState({
        originalBalance: 42000,
        currentBalance: 42000,
        interestRate: 6.75,
        monthlyPayment: 0,
        remainingTerm: 240,
        itcCredit: 0,
        additionalPayment: 0,
    });

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="bg-warning-l5 border border-warning-l3 rounded-lg p-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-warning-l3 flex items-center justify-center">
                        <Sun size={20} className="text-warning-d2" />
                    </div>
                    <div>
                        <h3 className="font-medium text-warning-d2">Solar Loan Paydown Calculator</h3>
                        <p className="text-sm text-neutral-d1">Calculate solar loan payoff scenarios and ITC credit application</p>
                    </div>
                </div>
            </div>

            {/* Solar Loan Details */}
            <div className="bg-white rounded-lg border border-neutral-l3 overflow-hidden">
                <div className="bg-neutral-l4 px-4 py-3 border-b border-neutral-l3">
                    <span className="font-medium text-neutral-d2">Current Solar Loan Details</span>
                </div>
                <div className="p-4 grid grid-cols-2 gap-4">
                    <FormField 
                        label="Original Loan Balance"
                        value={`$${solarData.originalBalance.toLocaleString()}`}
                    />
                    <FormField 
                        label="Current Balance"
                        value={`$${solarData.currentBalance.toLocaleString()}`}
                    />
                    <FormField 
                        label="Interest Rate"
                        value={`${solarData.interestRate}%`}
                    />
                    <FormField 
                        label="Monthly Payment"
                        value={`$${solarData.monthlyPayment.toFixed(2)}`}
                    />
                    <FormField 
                        label="Remaining Term (months)"
                        value={solarData.remainingTerm}
                    />
                </div>
            </div>

            {/* ITC Credit Section */}
            <div className="bg-white rounded-lg border border-neutral-l3 overflow-hidden">
                <div className="bg-neutral-l4 px-4 py-3 border-b border-neutral-l3">
                    <span className="font-medium text-neutral-d2">ITC (Investment Tax Credit)</span>
                </div>
                <div className="p-4 grid grid-cols-2 gap-4">
                    <FormField 
                        label="Expected ITC Credit"
                        value={`$${solarData.itcCredit.toLocaleString()}`}
                        editable
                    />
                    <FormField 
                        label="Apply to Principal"
                        value="Yes"
                        type="select"
                    />
                </div>
            </div>

            {/* Paydown Scenarios */}
            <div className="bg-white rounded-lg border border-neutral-l3 overflow-hidden">
                <div className="bg-neutral-l4 px-4 py-3 border-b border-neutral-l3">
                    <span className="font-medium text-neutral-d2">Paydown Scenarios</span>
                </div>
                <table className="w-full text-sm">
                    <thead className="bg-neutral-l5">
                        <tr>
                            <th className="px-4 py-2 text-left font-medium text-neutral-d1">Scenario</th>
                            <th className="px-4 py-2 text-right font-medium text-neutral-d1">New Balance</th>
                            <th className="px-4 py-2 text-right font-medium text-neutral-d1">New Payment</th>
                            <th className="px-4 py-2 text-right font-medium text-neutral-d1">Months Saved</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-b border-neutral-l3">
                            <td className="px-4 py-3 text-neutral-d2">Current (No Changes)</td>
                            <td className="px-4 py-3 text-right text-neutral-d2">$42,000.00</td>
                            <td className="px-4 py-3 text-right text-neutral-d2">$0.00</td>
                            <td className="px-4 py-3 text-right text-neutral-l1">-</td>
                        </tr>
                        <tr className="border-b border-neutral-l3 bg-success-l3/20">
                            <td className="px-4 py-3 text-success-d2 font-medium">With ITC Applied</td>
                            <td className="px-4 py-3 text-right text-success-d2">$42,000.00</td>
                            <td className="px-4 py-3 text-right text-success-d2">$0.00</td>
                            <td className="px-4 py-3 text-right text-success-d2">0</td>
                        </tr>
                        <tr className="border-b border-neutral-l3">
                            <td className="px-4 py-3 text-neutral-d2">Paid Through Refinance</td>
                            <td className="px-4 py-3 text-right text-neutral-d2">$0.00</td>
                            <td className="px-4 py-3 text-right text-neutral-d2">$0.00</td>
                            <td className="px-4 py-3 text-right text-success">240</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Note */}
            <p className="text-xs text-neutral-l1 italic">
                * Solar loan data is populated from Consumer Finance records. Verify accuracy with actual loan statements.
            </p>
        </div>
    );
}

function FormField({ label, value, editable, type = 'text' }) {
    return (
        <div>
            <label className="block text-xs font-medium text-neutral-l1 mb-1">{label}</label>
            {type === 'select' ? (
                <select className="w-full border border-neutral-l3 rounded px-3 py-2 text-sm bg-white">
                    <option>Yes</option>
                    <option>No</option>
                </select>
            ) : (
                <input 
                    type="text" 
                    value={value}
                    readOnly={!editable}
                    className="w-full border border-neutral-l3 rounded px-3 py-2 text-sm bg-neutral-l5"
                />
            )}
        </div>
    );
}







