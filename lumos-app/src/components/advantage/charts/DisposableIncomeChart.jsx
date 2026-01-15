import React from 'react';

export function DisposableIncomeChart({ data }) {
    // Mock data
    const current = {
        monthlyIncome: 4500,
        incomeAfterTaxes: 3825,
        mortgagePayment: 1250,
        otherPayments: 1089,
    };

    const proposed = {
        mortgagePayment: 1829,
        otherPayments: 90,
    };

    const currentDisposable = current.incomeAfterTaxes - current.mortgagePayment - current.otherPayments;
    const proposedDisposable = current.incomeAfterTaxes - proposed.mortgagePayment - proposed.otherPayments;
    
    const currentPercent = ((currentDisposable / current.incomeAfterTaxes) * 100).toFixed(1);
    const proposedPercent = ((proposedDisposable / current.incomeAfterTaxes) * 100).toFixed(1);
    const increase = (proposedPercent - currentPercent).toFixed(1);

    return (
        <div className="p-6">
            <h3 className="text-lg font-bold text-neutral-d3 text-center mb-6">ESTIMATED DISPOSABLE INCOME</h3>

            {/* Comparison Table */}
            <div className="overflow-hidden rounded-lg border border-neutral-l3 mb-6">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-neutral-l4">
                            <th className="px-4 py-2 text-left font-medium text-neutral-d2"></th>
                            <th className="px-4 py-2 text-right font-medium text-neutral-d2">Current</th>
                            <th className="px-4 py-2 text-right font-medium text-white bg-orange">Proposed</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-b border-neutral-l3">
                            <td className="px-4 py-2 text-neutral-d1">Monthly Income</td>
                            <td className="px-4 py-2 text-right">${current.monthlyIncome.toLocaleString()}</td>
                            <td className="px-4 py-2 text-right bg-orange-l3/20">${current.monthlyIncome.toLocaleString()}</td>
                        </tr>
                        <tr className="border-b border-neutral-l3">
                            <td className="px-4 py-2 text-neutral-d1">Income After Taxes</td>
                            <td className="px-4 py-2 text-right">${current.incomeAfterTaxes.toLocaleString()}</td>
                            <td className="px-4 py-2 text-right bg-orange-l3/20">${current.incomeAfterTaxes.toLocaleString()}</td>
                        </tr>
                        <tr className="border-b border-neutral-l3">
                            <td className="px-4 py-2 text-neutral-d1">Mortgage Payment</td>
                            <td className="px-4 py-2 text-right">${current.mortgagePayment.toLocaleString()}</td>
                            <td className="px-4 py-2 text-right bg-orange-l3/20">${proposed.mortgagePayment.toLocaleString()}</td>
                        </tr>
                        <tr className="border-b border-neutral-l3">
                            <td className="px-4 py-2 text-neutral-d1">Other Monthly Payments</td>
                            <td className="px-4 py-2 text-right">${current.otherPayments.toLocaleString()}</td>
                            <td className="px-4 py-2 text-right bg-orange-l3/20 text-success font-medium">${proposed.otherPayments.toLocaleString()}</td>
                        </tr>
                        <tr className="border-b border-neutral-l3 bg-neutral-l5">
                            <td className="px-4 py-2 font-medium text-neutral-d2">Disposable Income ($)</td>
                            <td className="px-4 py-2 text-right font-medium">${currentDisposable.toLocaleString()}</td>
                            <td className="px-4 py-2 text-right font-bold text-success bg-success-l3/30">${proposedDisposable.toLocaleString()}</td>
                        </tr>
                        <tr className="border-b border-neutral-l3">
                            <td className="px-4 py-2 text-neutral-d1">Disposable Income (%)</td>
                            <td className="px-4 py-2 text-right">{currentPercent}%</td>
                            <td className="px-4 py-2 text-right bg-orange-l3/20">{proposedPercent}%</td>
                        </tr>
                    </tbody>
                </table>
                <div className="bg-success text-white px-4 py-2 flex justify-between items-center">
                    <span className="font-medium">Increase in Disposable Income</span>
                    <span className="font-bold text-lg">{increase}%</span>
                </div>
            </div>

            {/* Visual */}
            <div className="flex justify-center gap-8">
                <div className="text-center">
                    <div className="w-20 h-20 rounded-full border-4 border-neutral-l2 flex items-center justify-center mx-auto">
                        <span className="text-lg font-bold text-neutral-d2">{currentPercent}%</span>
                    </div>
                    <p className="text-xs text-neutral-l1 mt-2">Current</p>
                </div>
                <div className="text-center">
                    <div className="w-20 h-20 rounded-full border-4 border-success bg-success-l3/30 flex items-center justify-center mx-auto">
                        <span className="text-lg font-bold text-success-d2">{proposedPercent}%</span>
                    </div>
                    <p className="text-xs text-success mt-2 font-medium">Proposed</p>
                </div>
            </div>
        </div>
    );
}







