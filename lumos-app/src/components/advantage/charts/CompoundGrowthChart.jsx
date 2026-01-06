import React from 'react';

export function CompoundGrowthChart({ data }) {
    // Calculate growth over time
    const years = [5, 10, 15, 20, 25, 30];
    const monthlyInvestment = 414.81;
    const initialInvestment = 12481.59;
    const rate = 7; // 7% annual return assumption

    const calculateFutureValue = (years) => {
        const monthlyRate = rate / 100 / 12;
        const totalMonths = years * 12;
        let fv = initialInvestment * Math.pow(1 + monthlyRate, totalMonths);
        fv += monthlyInvestment * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate);
        return fv;
    };

    const projections = years.map(y => ({
        year: y,
        value: calculateFutureValue(y),
        contributed: initialInvestment + (monthlyInvestment * y * 12)
    }));

    const maxValue = Math.max(...projections.map(p => p.value));

    return (
        <div className="p-6">
            <h3 className="text-lg font-bold text-neutral-d3 text-center mb-2">PAYMENT SAVINGS RE-INVESTMENT</h3>
            <p className="text-sm text-neutral-l1 text-center mb-6">Projected growth at {rate}% annual return</p>

            {/* Inputs Summary */}
            <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="p-3 bg-neutral-l5 rounded-lg text-center">
                    <p className="text-lg font-bold text-alternativePrimary">${initialInvestment.toLocaleString()}</p>
                    <p className="text-xs text-neutral-l1">Initial Investment</p>
                </div>
                <div className="p-3 bg-neutral-l5 rounded-lg text-center">
                    <p className="text-lg font-bold text-alternativePrimary">${monthlyInvestment.toLocaleString()}/mo</p>
                    <p className="text-xs text-neutral-l1">Monthly Contribution</p>
                </div>
            </div>

            {/* Bar Chart */}
            <div className="space-y-3">
                {projections.map((p, i) => (
                    <div key={i} className="flex items-center gap-3">
                        <div className="w-16 text-xs text-neutral-d1 font-medium">{p.year} Years</div>
                        <div className="flex-1 h-8 bg-neutral-l4 rounded overflow-hidden relative">
                            {/* Contributed portion */}
                            <div 
                                className="absolute left-0 top-0 h-full bg-alternativePrimary"
                                style={{ width: `${(p.contributed / maxValue) * 100}%` }}
                            />
                            {/* Interest portion */}
                            <div 
                                className="absolute top-0 h-full bg-success"
                                style={{ 
                                    left: `${(p.contributed / maxValue) * 100}%`,
                                    width: `${((p.value - p.contributed) / maxValue) * 100}%` 
                                }}
                            />
                        </div>
                        <div className="w-24 text-xs text-right">
                            <span className="font-bold text-neutral-d2">${Math.round(p.value).toLocaleString()}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Legend */}
            <div className="flex justify-center gap-6 mt-4 text-xs">
                <div className="flex items-center gap-1">
                    <span className="w-3 h-3 bg-alternativePrimary rounded"></span>
                    <span className="text-neutral-d1">Principal</span>
                </div>
                <div className="flex items-center gap-1">
                    <span className="w-3 h-3 bg-success rounded"></span>
                    <span className="text-neutral-d1">Interest Earned</span>
                </div>
            </div>

            {/* 30 Year Highlight */}
            <div className="mt-6 p-4 bg-success-l3/30 rounded-lg text-center border border-success-l2">
                <p className="text-sm text-neutral-d1">After 30 Years</p>
                <p className="text-3xl font-bold text-success-d2">${Math.round(projections[5].value).toLocaleString()}</p>
                <p className="text-xs text-success mt-1">
                    ${Math.round(projections[5].value - projections[5].contributed).toLocaleString()} in interest earned
                </p>
            </div>
        </div>
    );
}



