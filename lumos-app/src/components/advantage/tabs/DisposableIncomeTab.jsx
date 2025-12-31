import React from 'react';
import { Wallet, TrendingUp, ArrowRight, DollarSign } from 'lucide-react';
import { cn } from '../../../lib/utils';

export function DisposableIncomeTab({ data, onChange, analysisData }) {
    const handleChange = (field, value) => {
        onChange({
            ...data,
            [field]: value
        });
    };

    // Use analysis data if available, otherwise use defaults from data prop
    const grossMonthlyIncome = data?.monthlyIncome || 12000;
    const taxRate = 0.25; // Assume 25% effective tax rate
    const incomeAfterTaxes = data?.incomeAfterTaxes || Math.round(grossMonthlyIncome * (1 - taxRate));
    
    // Current payments (before refinance)
    const currentMortgage = analysisData?.currentPayment || data?.mortgagePayment || 1710;
    const currentOtherPayments = analysisData?.debtsMonthlyPayment || data?.otherPayments || 4156;
    const currentTotalPayments = currentMortgage + currentOtherPayments;
    
    // Proposed payments (after refinance - debts rolled in)
    const proposedMortgage = analysisData?.proposedPayment || 3200;
    const proposedOtherPayments = 0; // Debts are consolidated into mortgage
    const proposedTotalPayments = proposedMortgage + proposedOtherPayments;
    
    // Calculate disposable income
    const currentDisposable = incomeAfterTaxes - currentTotalPayments;
    const proposedDisposable = incomeAfterTaxes - proposedTotalPayments;
    const disposableIncrease = proposedDisposable - currentDisposable;
    
    const currentDisposablePercent = incomeAfterTaxes > 0 ? ((currentDisposable / incomeAfterTaxes) * 100).toFixed(1) : 0;
    const proposedDisposablePercent = incomeAfterTaxes > 0 ? ((proposedDisposable / incomeAfterTaxes) * 100).toFixed(1) : 0;

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="bg-success-l3 border border-success-l2 rounded-lg p-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-success flex items-center justify-center">
                        <Wallet size={20} className="text-white" />
                    </div>
                    <div>
                        <h3 className="font-medium text-success-d2">Estimated Disposable Income</h3>
                        <p className="text-sm text-neutral-d1">How much money you have left after all payments</p>
                    </div>
                </div>
            </div>

            {/* Input Section */}
            <div className="bg-white rounded-lg border border-neutral-l3 p-4">
                <h4 className="text-sm font-medium text-neutral-d2 mb-3">Your Income</h4>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs text-neutral-l1 uppercase tracking-wide mb-1 block">Gross Monthly Income</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-l1">$</span>
                            <input 
                                type="text" 
                                value={grossMonthlyIncome.toLocaleString()} 
                                onChange={(e) => handleChange('monthlyIncome', parseInt(e.target.value.replace(/,/g, '')) || 0)}
                                className="w-full py-2 pl-7 pr-3 border border-neutral-l3 rounded text-sm focus:border-alternativePrimary outline-none"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="text-xs text-neutral-l1 uppercase tracking-wide mb-1 block">After Taxes (~75%)</label>
                        <div className="py-2 px-3 bg-neutral-l5 border border-neutral-l3 rounded text-sm text-neutral-d3 font-medium">
                            ${incomeAfterTaxes.toLocaleString()}
                        </div>
                    </div>
                </div>
            </div>

            {/* Comparison Table */}
            <div className="bg-white rounded-lg border border-neutral-l3 overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-neutral-l4">
                            <th className="px-4 py-3 text-left font-medium text-neutral-d2"></th>
                            <th className="px-4 py-3 text-right font-medium text-neutral-d2">Current</th>
                            <th className="px-4 py-3 text-right font-medium text-success-d2 bg-success-l3">After Refi</th>
                        </tr>
                    </thead>
                    <tbody>
                        <ComparisonRow 
                            label="Income After Taxes"
                            current={`$${incomeAfterTaxes.toLocaleString()}`}
                            proposed={`$${incomeAfterTaxes.toLocaleString()}`}
                        />
                        <ComparisonRow 
                            label="Mortgage/Rent Payment"
                            current={`-$${currentMortgage.toLocaleString()}`}
                            proposed={`-$${proposedMortgage.toLocaleString()}`}
                            currentBad
                        />
                        <ComparisonRow 
                            label="Other Debt Payments"
                            current={`-$${currentOtherPayments.toLocaleString()}`}
                            proposed={`$0`}
                            highlight
                            proposedGood
                        />
                        <tr className="border-t-2 border-neutral-l3 bg-neutral-l5">
                            <td className="px-4 py-3 font-medium text-neutral-d2">Total Monthly Payments</td>
                            <td className="px-4 py-3 text-right font-medium text-danger">
                                -${currentTotalPayments.toLocaleString()}
                            </td>
                            <td className="px-4 py-3 text-right font-medium text-neutral-d2 bg-success-l3/50">
                                -${proposedTotalPayments.toLocaleString()}
                            </td>
                        </tr>
                        <tr className="bg-success-l4">
                            <td className="px-4 py-4 font-bold text-neutral-d3">DISPOSABLE INCOME</td>
                            <td className={cn(
                                "px-4 py-4 text-right font-bold text-xl",
                                currentDisposable < 0 ? "text-danger" : "text-neutral-d2"
                            )}>
                                ${currentDisposable.toLocaleString()}
                            </td>
                            <td className="px-4 py-4 text-right font-bold text-xl text-success-d2 bg-success-l3">
                                ${proposedDisposable.toLocaleString()}
                            </td>
                        </tr>
                    </tbody>
                </table>

                {/* Increase Row */}
                <div className="bg-success text-white px-4 py-3 flex justify-between items-center">
                    <span className="font-medium flex items-center gap-2">
                        <TrendingUp size={18} />
                        Monthly Increase in Disposable Income
                    </span>
                    <span className="font-bold text-xl">+${disposableIncrease.toLocaleString()}</span>
                </div>
            </div>

            {/* Visual Comparison */}
            <div className="bg-white rounded-lg border border-neutral-l3 p-6">
                <h4 className="font-medium text-neutral-d2 mb-4 text-center">Where Your Money Goes</h4>
                
                <div className="grid grid-cols-2 gap-6">
                    {/* Current */}
                    <div>
                        <p className="text-xs text-neutral-l1 uppercase tracking-wide mb-3 text-center">Current Situation</p>
                        <div className="space-y-2">
                            <BarItem label="Housing" amount={currentMortgage} total={incomeAfterTaxes} color="bg-orange" />
                            <BarItem label="Other Debts" amount={currentOtherPayments} total={incomeAfterTaxes} color="bg-danger" />
                            <BarItem label="Disposable" amount={Math.max(0, currentDisposable)} total={incomeAfterTaxes} color="bg-success" />
                        </div>
                    </div>

                    {/* Proposed */}
                    <div>
                        <p className="text-xs text-success uppercase tracking-wide mb-3 text-center font-medium">After Refinance</p>
                        <div className="space-y-2">
                            <BarItem label="New Mortgage" amount={proposedMortgage} total={incomeAfterTaxes} color="bg-alternativePrimary" />
                            <BarItem label="Other Debts" amount={0} total={incomeAfterTaxes} color="bg-neutral-l3" />
                            <BarItem label="Disposable" amount={proposedDisposable} total={incomeAfterTaxes} color="bg-success" highlight />
                        </div>
                    </div>
                </div>
            </div>

            {/* Annual Impact */}
            <div className="bg-gradient-to-r from-success-l3 to-success-l4 rounded-lg p-6 text-center border border-success-l2">
                <DollarSign size={32} className="text-success mx-auto mb-2" />
                <p className="text-sm text-success-d1">Annual Additional Disposable Income</p>
                <p className="text-4xl font-bold text-success-d2 mt-1">
                    ${(disposableIncrease * 12).toLocaleString()}
                </p>
                <p className="text-xs text-neutral-d1 mt-2">
                    That's ${disposableIncrease.toLocaleString()} more per month to save, invest, or spend
                </p>
            </div>
        </div>
    );
}

function ComparisonRow({ label, current, proposed, highlight, currentBad, proposedGood }) {
    return (
        <tr className={cn("border-b border-neutral-l3", highlight && "bg-warning-l5")}>
            <td className="px-4 py-3 text-neutral-d1">{label}</td>
            <td className={cn("px-4 py-3 text-right", currentBad ? "text-danger" : "text-neutral-d2")}>{current}</td>
            <td className={cn(
                "px-4 py-3 text-right bg-success-l3/20",
                proposedGood ? "text-success-d2 font-medium" : "text-neutral-d2"
            )}>
                {proposed}
            </td>
        </tr>
    );
}

function BarItem({ label, amount, total, color, highlight }) {
    const percent = total > 0 ? Math.min(100, (amount / total) * 100) : 0;
    
    return (
        <div>
            <div className="flex justify-between text-xs mb-1">
                <span className={cn("text-neutral-d1", highlight && "text-success font-medium")}>{label}</span>
                <span className={cn("font-medium", highlight ? "text-success" : "text-neutral-d2")}>
                    ${amount.toLocaleString()}
                </span>
            </div>
            <div className="h-4 bg-neutral-l4 rounded-full overflow-hidden">
                <div 
                    className={cn("h-full rounded-full transition-all", color)}
                    style={{ width: `${percent}%` }}
                />
            </div>
        </div>
    );
}
