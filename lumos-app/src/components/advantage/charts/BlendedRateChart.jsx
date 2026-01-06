import React from 'react';

export function BlendedRateChart({ data }) {
    // Mock data - in real implementation, calculate from debts
    const debts = [
        { name: 'Mortgage 1', balance: 247500, rate: 3.75 },
        { name: 'Mortgage 2', balance: 180000, rate: 4.25 },
        { name: 'Auto Loan', balance: 18000, rate: 6.9 },
        { name: 'Credit Cards', balance: 13950, rate: 22.99 },
    ];

    const totalBalance = debts.reduce((sum, d) => sum + d.balance, 0);
    const weightedRate = debts.reduce((sum, d) => sum + (d.balance * d.rate), 0) / totalBalance;
    const newRate = 7.125;

    const maxRate = Math.max(...debts.map(d => d.rate), newRate) * 1.1;

    return (
        <div className="p-6">
            <h3 className="text-lg font-bold text-neutral-d3 text-center mb-6">BLENDED RATE ON DEBT COMPARISON</h3>
            
            {/* Summary */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-3 bg-neutral-l5 rounded-lg">
                    <p className="text-2xl font-bold text-neutral-d2">{weightedRate.toFixed(2)}%</p>
                    <p className="text-xs text-neutral-l1">Current Blended Rate</p>
                </div>
                <div className="text-center p-3 bg-orange-l3 rounded-lg">
                    <p className="text-2xl font-bold text-orange-d2">{newRate}%</p>
                    <p className="text-xs text-orange-d1">New Loan Rate</p>
                </div>
                <div className="text-center p-3 bg-success-l3 rounded-lg">
                    <p className="text-2xl font-bold text-success-d2">
                        {weightedRate > newRate ? '-' : '+'}{Math.abs(weightedRate - newRate).toFixed(2)}%
                    </p>
                    <p className="text-xs text-success">Difference</p>
                </div>
            </div>

            {/* Rate Bars */}
            <div className="space-y-3">
                {debts.map((debt, i) => (
                    <div key={i} className="flex items-center gap-3">
                        <div className="w-24 text-xs text-neutral-d1 truncate">{debt.name}</div>
                        <div className="flex-1 h-6 bg-neutral-l4 rounded overflow-hidden">
                            <div 
                                className="h-full bg-gradient-to-r from-information to-information-d1 rounded flex items-center justify-end pr-2"
                                style={{ width: `${(debt.rate / maxRate) * 100}%` }}
                            >
                                <span className="text-xs text-white font-medium">{debt.rate}%</span>
                            </div>
                        </div>
                        <div className="w-20 text-xs text-right text-neutral-d2">
                            ${debt.balance.toLocaleString()}
                        </div>
                    </div>
                ))}
                
                {/* Blended Rate Line */}
                <div className="flex items-center gap-3 pt-2 border-t border-neutral-l3">
                    <div className="w-24 text-xs text-neutral-d2 font-medium">Blended Rate</div>
                    <div className="flex-1 h-6 bg-neutral-l4 rounded overflow-hidden">
                        <div 
                            className="h-full bg-gradient-to-r from-warning to-warning-d2 rounded flex items-center justify-end pr-2"
                            style={{ width: `${(weightedRate / maxRate) * 100}%` }}
                        >
                            <span className="text-xs text-white font-medium">{weightedRate.toFixed(2)}%</span>
                        </div>
                    </div>
                    <div className="w-20 text-xs text-right text-neutral-d2 font-medium">
                        ${totalBalance.toLocaleString()}
                    </div>
                </div>

                {/* New Rate Line */}
                <div className="flex items-center gap-3">
                    <div className="w-24 text-xs text-orange-d2 font-bold">New Rate</div>
                    <div className="flex-1 h-6 bg-neutral-l4 rounded overflow-hidden">
                        <div 
                            className="h-full bg-gradient-to-r from-orange to-orange-d1 rounded flex items-center justify-end pr-2"
                            style={{ width: `${(newRate / maxRate) * 100}%` }}
                        >
                            <span className="text-xs text-white font-medium">{newRate}%</span>
                        </div>
                    </div>
                    <div className="w-20"></div>
                </div>
            </div>

            {/* Note */}
            <p className="text-xs text-neutral-l1 mt-4 text-center italic">
                Consolidating multiple debts at different rates into a single loan can simplify payments and potentially reduce overall interest.
            </p>
        </div>
    );
}



