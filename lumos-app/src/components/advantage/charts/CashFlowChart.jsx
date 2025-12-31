import React from 'react';
import { DollarSign, Calendar, Wallet, Clock } from 'lucide-react';

export function CashFlowChart({ data }) {
    // Current total monthly payments (all liabilities) - this is what gets skipped
    const currentMonthlyPayments = data?.debtsMonthlyPayment || data?.currentPayment || 4156;
    
    // Skip period (typically 2 months before first new payment is due)
    const skipMonths = 2;
    
    // Cash in pocket during skip period
    const cashFlowBenefit = currentMonthlyPayments * skipMonths;

    return (
        <div className="p-6">
            <h3 className="text-lg font-bold text-neutral-d3 text-center mb-2">CASH FLOW WINDOW</h3>
            <p className="text-sm text-neutral-l1 text-center mb-6">Money freed up when you refinance</p>

            {/* Big Number - The Main Point */}
            <div className="bg-gradient-to-br from-success-l3 to-success-l4 border border-success-l2 rounded-xl p-8 text-center mb-6">
                <Wallet size={40} className="text-success mx-auto mb-3" />
                <p className="text-5xl font-bold text-success-d2">${cashFlowBenefit.toLocaleString()}</p>
                <p className="text-lg text-success font-medium mt-2">Cash In Your Pocket</p>
                <p className="text-sm text-neutral-d1 mt-3">
                    {skipMonths} months × ${currentMonthlyPayments.toLocaleString()}/mo = ${cashFlowBenefit.toLocaleString()}
                </p>
            </div>

            {/* Simple Explanation */}
            <div className="bg-white border border-neutral-l3 rounded-lg p-5 mb-6">
                <h4 className="text-sm font-medium text-neutral-d2 mb-4 flex items-center gap-2">
                    <Clock size={16} />
                    How It Works
                </h4>
                
                <div className="space-y-4">
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-success text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                            1
                        </div>
                        <div>
                            <p className="font-medium text-neutral-d2">Your loan closes</p>
                            <p className="text-sm text-neutral-l1">All existing payments stop immediately</p>
                        </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-success text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                            2
                        </div>
                        <div>
                            <p className="font-medium text-neutral-d2">Month 1 & 2: No payments due</p>
                            <p className="text-sm text-neutral-l1">You keep ${currentMonthlyPayments.toLocaleString()} × 2 = <span className="font-bold text-success">${cashFlowBenefit.toLocaleString()}</span></p>
                        </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-alternativePrimary text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                            3
                        </div>
                        <div>
                            <p className="font-medium text-neutral-d2">Month 3: First new payment due</p>
                            <p className="text-sm text-neutral-l1">Your new consolidated payment begins</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Visual Timeline */}
            <div className="bg-neutral-l5 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-neutral-d2">Payment Timeline</span>
                </div>
                
                <div className="flex gap-2">
                    {/* Month 1 */}
                    <div className="flex-1 bg-success rounded-lg p-3 text-center">
                        <p className="text-xs text-success-d2 font-medium">Month 1</p>
                        <p className="text-lg font-bold text-success-d2">$0</p>
                        <p className="text-[10px] text-success">No payment</p>
                    </div>
                    
                    {/* Month 2 */}
                    <div className="flex-1 bg-success rounded-lg p-3 text-center">
                        <p className="text-xs text-success-d2 font-medium">Month 2</p>
                        <p className="text-lg font-bold text-success-d2">$0</p>
                        <p className="text-[10px] text-success">No payment</p>
                    </div>
                    
                    {/* Month 3 */}
                    <div className="flex-1 bg-alternativePrimary-l4 border border-alternativePrimary rounded-lg p-3 text-center">
                        <p className="text-xs text-alternativePrimary font-medium">Month 3</p>
                        <p className="text-lg font-bold text-alternativePrimary">${(data?.proposedPayment || 3200).toLocaleString()}</p>
                        <p className="text-[10px] text-alternativePrimary">First payment</p>
                    </div>
                </div>
                
                {/* Total Saved */}
                <div className="mt-4 p-3 bg-success-l3 rounded-lg text-center">
                    <p className="text-sm text-success-d2">
                        <span className="font-bold">${cashFlowBenefit.toLocaleString()}</span> stays in your pocket during the transition
                    </p>
                </div>
            </div>
        </div>
    );
}
