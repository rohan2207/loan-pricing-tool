import React from 'react';

export function PaymentSavingsChart({ data }) {
    // Mock data for visualization
    const currentTotal = 1889;
    const currentMortgage = 1250;
    const currentSolar = 0;
    const currentOther = 639;
    
    const newPayment = 1142;
    const monthlySavings = 747;
    const annualSavings = 8959;

    const maxValue = Math.max(currentTotal, newPayment) * 1.1;

    return (
        <div className="p-6">
            <h3 className="text-lg font-bold text-neutral-d3 text-center mb-6">CURRENT VS. NEW PAYMENTS</h3>
            
            {/* Legend */}
            <div className="flex justify-end gap-4 mb-4 text-xs">
                <div className="flex items-center gap-1">
                    <span className="w-3 h-3 bg-neutral-d2 rounded"></span>
                    <span>Other Debts</span>
                </div>
                <div className="flex items-center gap-1">
                    <span className="w-3 h-3 bg-warning rounded"></span>
                    <span>Solar Loan Payment</span>
                </div>
                <div className="flex items-center gap-1">
                    <span className="w-3 h-3 bg-information rounded"></span>
                    <span>Current Mortgage Payment</span>
                </div>
            </div>

            {/* Chart */}
            <div className="flex items-end justify-center gap-16 h-64">
                {/* Current Payment Bar */}
                <div className="flex flex-col items-center">
                    <p className="text-lg font-bold text-neutral-d3 mb-2">${currentTotal.toLocaleString()} Total</p>
                    <div 
                        className="w-32 flex flex-col-reverse rounded-t overflow-hidden"
                        style={{ height: `${(currentTotal / maxValue) * 200}px` }}
                    >
                        <div 
                            className="bg-information w-full"
                            style={{ height: `${(currentMortgage / currentTotal) * 100}%` }}
                        />
                        <div 
                            className="bg-warning w-full"
                            style={{ height: `${(currentSolar / currentTotal) * 100}%` }}
                        />
                        <div 
                            className="bg-neutral-d2 w-full"
                            style={{ height: `${(currentOther / currentTotal) * 100}%` }}
                        />
                    </div>
                    <div className="mt-2 text-center">
                        <p className="text-sm text-information font-medium">${currentMortgage.toLocaleString()}</p>
                        <p className="text-xs text-neutral-l1">Current</p>
                        <p className="text-xs text-neutral-l1">Mortgage Payment</p>
                    </div>
                </div>

                {/* New Payment Bar */}
                <div className="flex flex-col items-center">
                    <div 
                        className="w-32 bg-orange rounded-t"
                        style={{ height: `${(newPayment / maxValue) * 200}px` }}
                    />
                    <div className="mt-2 text-center">
                        <p className="text-sm text-orange font-medium">${newPayment.toLocaleString()}</p>
                        <p className="text-xs text-neutral-l1">Your New</p>
                        <p className="text-xs text-neutral-l1">Payment</p>
                    </div>
                </div>

                {/* Savings Indicators */}
                <div className="flex flex-col items-center justify-center gap-4">
                    <div className="w-24 h-24 rounded-full border-4 border-success flex items-center justify-center bg-success-l3/30">
                        <div className="text-center">
                            <p className="text-lg font-bold text-success-d2">${annualSavings.toLocaleString()}</p>
                            <p className="text-[10px] text-success uppercase font-medium">Annual Savings</p>
                        </div>
                    </div>
                    <div className="w-20 h-20 rounded-full border-4 border-neutral-l2 flex items-center justify-center">
                        <div className="text-center">
                            <p className="text-md font-bold text-neutral-d2">${monthlySavings}</p>
                            <p className="text-[10px] text-neutral-l1 uppercase">Monthly Savings</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}





