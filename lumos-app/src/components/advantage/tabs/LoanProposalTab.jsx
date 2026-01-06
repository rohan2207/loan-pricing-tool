import React from 'react';
import { cn } from '../../../lib/utils';
import { Printer, FileDown } from 'lucide-react';

export function LoanProposalTab({ data, onChange, includeOption2 }) {
    const { current, option1, option2 } = data;

    const handleChange = (section, field, value) => {
        onChange({
            ...data,
            [section]: {
                ...data[section],
                [field]: value
            }
        });
    };

    return (
        <div className="space-y-4">
            {/* Header with actions */}
            <div className="flex justify-end gap-2">
                <button className="p-2 text-neutral-d1 hover:bg-neutral-l4 rounded transition-colors">
                    <Printer size={18} />
                </button>
                <button className="p-2 text-neutral-d1 hover:bg-neutral-l4 rounded transition-colors">
                    <FileDown size={18} />
                </button>
            </div>

            {/* Main Comparison Table */}
            <div className="bg-white rounded-lg border border-neutral-l3 overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-neutral-l4">
                            <th className="px-4 py-3 text-left font-medium text-neutral-d2 w-1/4"></th>
                            <th className="px-4 py-3 text-center font-medium text-neutral-d2">Current</th>
                            <th className="px-4 py-3 text-center font-medium text-neutral-d2 bg-orange-l3">Option 1</th>
                            {includeOption2 && (
                                <th className="px-4 py-3 text-center font-medium text-neutral-d2">Option 2</th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        <ComparisonRow 
                            label="Loan Program" 
                            current={current.program}
                            option1={option1.program}
                            option2={option2.program}
                            includeOption2={includeOption2}
                        />
                        <ComparisonRow 
                            label="Loan Type" 
                            current={current.loanType}
                            option1={option1.loanType}
                            option2={option2.loanType}
                            includeOption2={includeOption2}
                        />
                        <ComparisonRow 
                            label="Initial Loan Amount" 
                            current={`$${current.loanAmount.toLocaleString()}`}
                            option1={`$${option1.loanAmount.toLocaleString()}`}
                            option2={`$${option2.loanAmount.toLocaleString()}`}
                            includeOption2={includeOption2}
                            editable
                        />
                        <ComparisonRow 
                            label="Current Loan Term (yrs)" 
                            current={current.term}
                            option1={option1.term}
                            option2={option2.term}
                            includeOption2={includeOption2}
                        />
                        <ComparisonRow 
                            label="1st Payment Date" 
                            current={current.paymentDate}
                            option1={option1.paymentDate}
                            option2={option2.paymentDate}
                            includeOption2={includeOption2}
                        />
                        <ComparisonRow 
                            label="# of Years Remaining" 
                            current={current.yearsRemaining}
                            option1={option1.yearsRemaining}
                            option2={option2.yearsRemaining}
                            includeOption2={includeOption2}
                        />
                        <ComparisonRow 
                            label="Rate" 
                            current={`${current.rate}%`}
                            option1={`${option1.rate}%`}
                            option2={`${option2.rate}%`}
                            includeOption2={includeOption2}
                            highlight
                        />
                        <ComparisonRow 
                            label="APR" 
                            current={`${current.apr}%`}
                            option1={`${option1.apr}%`}
                            option2={`${option2.apr}%`}
                            includeOption2={includeOption2}
                            option1Highlight
                        />
                        <ComparisonRow 
                            label="LTV" 
                            current={`${current.ltv}%`}
                            option1={`${option1.ltv}%`}
                            option2={`${option2.ltv}%`}
                            includeOption2={includeOption2}
                        />
                        <ComparisonRow 
                            label="DTI" 
                            current={`${current.dti}%`}
                            option1={`${option1.dti}%`}
                            option2={`${option2.dti}%`}
                            includeOption2={includeOption2}
                        />
                    </tbody>
                </table>
            </div>

            {/* VOM Section */}
            <div className="bg-white rounded-lg border border-neutral-l3 overflow-hidden">
                <div className="bg-neutral-l4 px-4 py-2 border-b border-neutral-l3">
                    <span className="font-medium text-neutral-d2 text-sm">VOM</span>
                </div>
                <div className="p-4">
                    <p className="text-sm text-neutral-l1 text-center">Itemization</p>
                </div>
            </div>

            {/* Loan Amount Calculations */}
            <div className="bg-white rounded-lg border border-neutral-l3 overflow-hidden">
                <div className="bg-neutral-l4 px-4 py-2 border-b border-neutral-l3">
                    <span className="font-medium text-neutral-d2 text-sm">Loan Amount Calculations</span>
                </div>
                <table className="w-full text-sm">
                    <tbody>
                        <CalculationRow label="Mortgage Payoffs" value1="$0.00" value2="$0.00" />
                        <CalculationRow label="Other Debt Payoffs" value1="$0.00" value2="$0.00" />
                        <CalculationRow label="Lender Costs / Rate Discount" value1="$5,512.50" value2="" />
                        <CalculationRow label="Lender Credit / Closing Costs paid by Lender or Other" value1="$0.00" value2="" />
                        <CalculationRow label="Daily Prepaid Interest" value1="$614.90" value2="" />
                        <CalculationRow label="Prepaid Taxes/HOI/Etc" value1="$761.25" value2="" />
                        <CalculationRow label="3rd Party Fees / Gov't" value1="$1,169.00" value2="" />
                        <CalculationRow label="Upfront Mortgage Insurance" value1="$0.00" value2="" />
                        <tr className="bg-neutral-l5 font-medium">
                            <td className="px-4 py-2 text-neutral-d2">Totals</td>
                            <td className="px-4 py-2 text-right text-neutral-d2">$8,057.65</td>
                            <td className="px-4 py-2 text-right text-neutral-d2">$0.00</td>
                        </tr>
                        <tr className="font-medium">
                            <td className="px-4 py-2 text-neutral-d2">Loan Amount</td>
                            <td className="px-4 py-2 text-right text-neutral-d2">$210,000.00</td>
                            <td className="px-4 py-2 text-right text-neutral-d2">$210,000.00</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function ComparisonRow({ label, current, option1, option2, includeOption2, editable, highlight, option1Highlight }) {
    return (
        <tr className="border-b border-neutral-l3 last:border-0">
            <td className="px-4 py-2 text-neutral-d2 font-medium">{label}</td>
            <td className="px-4 py-2 text-center">
                {editable ? (
                    <input 
                        type="text" 
                        value={current} 
                        readOnly
                        className="w-full text-center bg-transparent border border-neutral-l3 rounded px-2 py-1"
                    />
                ) : (
                    <span className={cn(highlight && "font-medium")}>{current}</span>
                )}
            </td>
            <td className={cn("px-4 py-2 text-center bg-orange-l3/10", option1Highlight && "bg-warning-l3")}>
                {editable ? (
                    <input 
                        type="text" 
                        value={option1} 
                        readOnly
                        className="w-full text-center bg-transparent border border-neutral-l3 rounded px-2 py-1"
                    />
                ) : (
                    <span className={cn(highlight && "font-medium", option1Highlight && "text-warning-d2 font-bold")}>{option1}</span>
                )}
            </td>
            {includeOption2 && (
                <td className="px-4 py-2 text-center">
                    {editable ? (
                        <input 
                            type="text" 
                            value={option2} 
                            readOnly
                            className="w-full text-center bg-transparent border border-neutral-l3 rounded px-2 py-1"
                        />
                    ) : (
                        <span>{option2}</span>
                    )}
                </td>
            )}
        </tr>
    );
}

function CalculationRow({ label, value1, value2 }) {
    return (
        <tr className="border-b border-neutral-l3 last:border-0">
            <td className="px-4 py-2 text-neutral-d1">{label}</td>
            <td className="px-4 py-2 text-right text-neutral-d2">{value1}</td>
            <td className="px-4 py-2 text-right text-neutral-d2">{value2}</td>
        </tr>
    );
}



