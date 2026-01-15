import React from 'react';
import { cn } from '../../../lib/utils';
import { AlertTriangle } from 'lucide-react';

export function DebtConsolidationTab({ accounts }) {
    // Filter to debts marked for payoff
    const debtsToPayOff = accounts.filter(acc => acc.willPay);
    
    // Calculate totals
    const totalBalance = debtsToPayOff.reduce((sum, acc) => {
        const balance = parseFloat(acc.balance.replace(/[$,]/g, '')) || 0;
        return sum + balance;
    }, 0);
    
    const totalPayment = debtsToPayOff.reduce((sum, acc) => {
        const payment = parseFloat(acc.payment.replace(/[$,]/g, '')) || 0;
        return sum + payment;
    }, 0);

    return (
        <div className="space-y-4">
            {/* Debts Table */}
            <div className="bg-white rounded-lg border border-neutral-l3 overflow-hidden">
                <div className="bg-neutral-l4 px-4 py-3 border-b border-neutral-l3">
                    <span className="font-medium text-neutral-d2">Debts to Be Paid</span>
                </div>
                <table className="w-full text-sm">
                    <thead className="bg-neutral-l5">
                        <tr>
                            <th className="px-4 py-2 text-left font-medium text-neutral-d1">Type of Debt</th>
                            <th className="px-4 py-2 text-left font-medium text-neutral-d1">Creditor Name</th>
                            <th className="px-4 py-2 text-right font-medium text-neutral-d1">Balance</th>
                            <th className="px-4 py-2 text-right font-medium text-neutral-d1">Payments</th>
                            <th className="px-4 py-2 text-center font-medium text-neutral-d1">Paid Off</th>
                            <th className="px-4 py-2 text-right font-medium text-neutral-d1">Interest Rates</th>
                        </tr>
                    </thead>
                    <tbody>
                        {debtsToPayOff.map((debt, index) => (
                            <tr key={debt.id} className={cn(
                                "border-b border-neutral-l3",
                                index % 2 === 0 ? "bg-white" : "bg-neutral-l5/50"
                            )}>
                                <td className="px-4 py-2 text-neutral-d2">{debt.accountType}</td>
                                <td className="px-4 py-2 text-neutral-d2 font-medium">{debt.creditor}</td>
                                <td className="px-4 py-2 text-right">
                                    <input 
                                        type="text" 
                                        value={debt.balance}
                                        readOnly
                                        className="w-24 text-right bg-transparent border border-neutral-l3 rounded px-2 py-1"
                                    />
                                </td>
                                <td className="px-4 py-2 text-right">
                                    <input 
                                        type="text" 
                                        value={debt.payment}
                                        readOnly
                                        className="w-20 text-right bg-transparent border border-neutral-l3 rounded px-2 py-1"
                                    />
                                </td>
                                <td className="px-4 py-2 text-center">
                                    <input 
                                        type="checkbox" 
                                        checked={debt.willPay}
                                        readOnly
                                        className="h-4 w-4 accent-success"
                                    />
                                </td>
                                <td className="px-4 py-2 text-right">
                                    <input 
                                        type="text" 
                                        value={debt.rate || '-'}
                                        readOnly
                                        className="w-20 text-right bg-transparent border border-neutral-l3 rounded px-2 py-1"
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Summary Rows */}
                <div className="border-t border-neutral-l3">
                    <table className="w-full text-sm">
                        <tbody>
                            <tr className="bg-neutral-l5">
                                <td className="px-4 py-2 font-medium text-neutral-d2" colSpan={2}>Total Outstanding Debt</td>
                                <td className="px-4 py-2 text-right font-medium text-neutral-d2">
                                    ${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                </td>
                                <td className="px-4 py-2 text-right font-medium text-neutral-d2">
                                    ${totalPayment.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                </td>
                                <td className="px-4 py-2"></td>
                                <td className="px-4 py-2 text-right text-neutral-l1">-</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-2 text-neutral-d1" colSpan={2}>Debt being paid through Refinance *</td>
                                <td className="px-4 py-2 text-right text-neutral-d2">
                                    ${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                </td>
                                <td className="px-4 py-2 text-right text-neutral-d2">
                                    ${totalPayment.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                </td>
                                <td className="px-4 py-2"></td>
                                <td className="px-4 py-2 text-right text-neutral-l1">-</td>
                            </tr>
                            <tr className="bg-success-l3/30">
                                <td className="px-4 py-2 font-medium text-success-d2" colSpan={2}>Total Debt leftover after Refinance</td>
                                <td className="px-4 py-2 text-right font-medium text-success-d2">$0.00</td>
                                <td className="px-4 py-2 text-right font-medium text-success-d2">$0.00</td>
                                <td className="px-4 py-2"></td>
                                <td className="px-4 py-2 text-right text-success-d2">0.000%</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Important Notices */}
            <div className="bg-danger-l3/30 border border-danger-l1 rounded-lg p-4">
                <div className="flex items-start gap-2">
                    <AlertTriangle size={18} className="text-danger mt-0.5 flex-shrink-0" />
                    <div>
                        <h4 className="font-medium text-danger-d2 mb-2">Important Notices</h4>
                        <ul className="text-sm text-danger-d2 space-y-1">
                            <li>* Amounts and rates should be provided by or confirmed as accurate by customer.</li>
                            <li>* Accuracy of proposals and related savings benefits depends upon the accuracy of this information.</li>
                            <li>* Extending the term of debt through a refinancing may increase the total of interest paid over the term.</li>
                            <li>* Paid Off values under Debts to Be Paid are purely for calculation purposes only. Checking or Unchecking will not update existing Liabilities in SmartApp.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}







