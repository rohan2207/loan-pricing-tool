import React, { useState, useEffect } from 'react';
import { PaymentSavingsChart } from './charts/PaymentSavingsChart';
import { BlendedRateChart } from './charts/BlendedRateChart';
import { DisposableIncomeChart } from './charts/DisposableIncomeChart';
import { CompoundGrowthChart } from './charts/CompoundGrowthChart';
import { CashFlowChart } from './charts/CashFlowChart';
import { BarChart3, TrendingUp, DollarSign, Clock, PiggyBank, CreditCard, BadgeCheck, Shield, Percent, Gift, Check, GraduationCap, Home, Plane, Wallet, Receipt, Umbrella, Banknote, ArrowRight, Calendar, Target, Zap, Settings, Sliders } from 'lucide-react';

const chartTitles = {
    'blended-rate': 'Blended Rate on Debt Comparison',
    'cash-back': 'Cash Back Analysis',
    'cash-flow': 'Estimated Cash Flow Prior to First Payment',
    'disposable-income': 'Estimated Disposable Income',
    'interest-savings': 'Interest Savings Comparison',
    'payment-savings': 'Payment Savings Comparison',
    'reinvestment': 'Payment Savings Re-Investment',
    'solar-partial-pay': 'SOLAR: Dynamic Partial Pay',
    'solar-itc': 'SOLAR: ITC Target Balance',
    'recoup-costs': 'Time to Recoup Closing Costs',
    'debt-consolidation': 'Debt Consolidation Worksheet',
};

export function ChartPreview({ chartType, data }) {
    // Get config from data if available (set from main UI), otherwise use defaults
    const chartConfig = data?.chartConfig || {};
    
    // Configurable chart parameters - use props from main UI if available
    const [compoundRate, setCompoundRate] = useState(chartConfig.compoundRate || 7);
    const [acceleratedPaymentPercent, setAcceleratedPaymentPercent] = useState(chartConfig.acceleratedPercent || 100);
    const [extraPaymentAmount, setExtraPaymentAmount] = useState(null); // Direct dollar amount override
    const [cashFlowMonths, setCashFlowMonths] = useState(chartConfig.cashFlowMonths || 2);
    const [taxRate, setTaxRate] = useState(chartConfig.taxRate || 25);
    const [grossMonthlyIncome, setGrossMonthlyIncome] = useState(chartConfig.grossIncome || 12000);
    
    // Sync local state with chartConfig when it changes from main UI
    useEffect(() => {
        if (chartConfig.compoundRate !== undefined) setCompoundRate(chartConfig.compoundRate);
        if (chartConfig.acceleratedPercent !== undefined) setAcceleratedPaymentPercent(chartConfig.acceleratedPercent);
        if (chartConfig.cashFlowMonths !== undefined) setCashFlowMonths(chartConfig.cashFlowMonths);
        if (chartConfig.taxRate !== undefined) setTaxRate(chartConfig.taxRate);
        if (chartConfig.grossIncome !== undefined) setGrossMonthlyIncome(chartConfig.grossIncome);
    }, [chartConfig.compoundRate, chartConfig.acceleratedPercent, chartConfig.cashFlowMonths, chartConfig.taxRate, chartConfig.grossIncome]);
    
    // Use passed data or fallback defaults
    const analysisData = data || {
        monthlySavings: 950,
        annualSavings: 11400,
        currentPayment: 3500,
        proposedPayment: 2550,
        debtsPayoff: 483314,
        debtsMonthlyPayment: 4156,
        debtsCount: 9,
        breakEvenMonths: 11,
        closingCosts: 8057,
        cashout: 42000,
        ltv: 80,
        newLoanAmount: 525314,
        homeValue: 700000,
        grossMonthlyIncome: 12000,
        reinvestmentMonthly: 500,
        reinvestmentReturn: 7,
        reinvestmentYears: 30,
    };

    const renderChart = () => {
        switch (chartType) {
            case 'payment-savings':
                // Extract payment breakdown from analysisData
                const currentMortgagePI = analysisData.currentMortgagePI || 1710;
                const currentEscrow = analysisData.currentEscrow || 570;
                const currentMI = analysisData.currentMI || 0;
                const debtsPaidOff = analysisData.debtsPaidOff || 0;
                const debtsRemaining = analysisData.debtsRemaining || 0;
                
                const proposedPI = analysisData.proposedPI || 3499;
                const proposedEscrow = analysisData.proposedEscrow || 570;
                const proposedMI = analysisData.proposedMI || 0;
                
                // Remaining debts appear on BOTH sides (they pay them now AND after refinance)
                const currentTotalPayment = currentMortgagePI + currentEscrow + currentMI + debtsPaidOff + debtsRemaining;
                const proposedTotalPayment = proposedPI + proposedEscrow + proposedMI + debtsRemaining;
                const savingsAmount = currentTotalPayment - proposedTotalPayment;
                const annualSavingsAmount = savingsAmount * 12;
                
                // Calculate bar heights (max height = 200px)
                const maxPayment = Math.max(currentTotalPayment, proposedTotalPayment);
                const scale = 200 / maxPayment;
                
                // Current stack heights
                const currentMortgageHeight = currentMortgagePI * scale;
                const currentEscrowHeight = currentEscrow * scale;
                const currentMIHeight = currentMI * scale;
                const debtsHeight = debtsPaidOff * scale;
                const currentRemainingDebtsHeight = debtsRemaining * scale;
                
                // Proposed stack heights
                const proposedPIHeight = proposedPI * scale;
                const proposedEscrowHeight = proposedEscrow * scale;
                const proposedMIHeight = proposedMI * scale;
                const remainingDebtsHeight = debtsRemaining * scale;
                
                return (
                    <div className="h-full flex flex-col">
                        {/* Header */}
                        <div className="bg-stone-800 text-white px-4 py-3">
                            <h2 className="font-bold text-lg">PAYMENT SAVINGS COMPARISON</h2>
                        </div>
                        
                        <div className="flex-1 p-6 overflow-auto">
                            {/* Stacked Bar Chart */}
                            <div className="flex items-end justify-center gap-12 mb-8">
                                {/* Current Payment Bar */}
                                <div className="flex flex-col items-center">
                                    <div className="flex flex-col-reverse w-24 rounded-t-lg overflow-hidden shadow-md">
                                        {/* Mortgage P&I - Bottom */}
                                        <div 
                                            className="bg-stone-600 flex items-center justify-center text-white text-xs font-medium"
                                            style={{ height: `${currentMortgageHeight}px` }}
                                        >
                                            {currentMortgagePI > 0 && `$${currentMortgagePI.toLocaleString()}`}
                                        </div>
                                        {/* Escrow */}
                                        {currentEscrow > 0 && (
                                            <div 
                                                className="bg-teal-500 flex items-center justify-center text-white text-xs font-medium"
                                                style={{ height: `${currentEscrowHeight}px` }}
                                            >
                                                {currentEscrowHeight > 20 && `$${currentEscrow.toLocaleString()}`}
                                            </div>
                                        )}
                                        {/* MI */}
                                        {currentMI > 0 && (
                                            <div 
                                                className="bg-purple-400 flex items-center justify-center text-white text-xs font-medium"
                                                style={{ height: `${currentMIHeight}px` }}
                                            >
                                                {currentMIHeight > 20 && `$${currentMI.toLocaleString()}`}
                                            </div>
                                        )}
                                        {/* Debts Being Paid Off */}
                                        {debtsPaidOff > 0 && (
                                            <div 
                                                className="bg-amber-500 flex items-center justify-center text-white text-xs font-medium"
                                                style={{ height: `${debtsHeight}px` }}
                                            >
                                                {debtsHeight > 20 && `$${debtsPaidOff.toLocaleString()}`}
                                            </div>
                                        )}
                                        {/* Remaining Debts - Top (also on current side) */}
                                        {debtsRemaining > 0 && (
                                            <div 
                                                className="bg-stone-400 flex items-center justify-center text-white text-xs font-medium"
                                                style={{ height: `${currentRemainingDebtsHeight}px` }}
                                            >
                                                {currentRemainingDebtsHeight > 20 && `$${debtsRemaining.toLocaleString()}`}
                                            </div>
                                        )}
                                    </div>
                                    <div className="mt-3 text-center">
                                        <p className="text-2xl font-bold text-stone-800">${currentTotalPayment.toLocaleString()}</p>
                                        <p className="text-sm text-stone-500">Current</p>
                                    </div>
                                </div>
                                
                                {/* Proposed Payment Bar */}
                                <div className="flex flex-col items-center">
                                    <div className="flex flex-col-reverse w-24 rounded-t-lg overflow-hidden shadow-md">
                                        {/* New Mortgage P&I - Bottom */}
                                        <div 
                                            className="bg-stone-600 flex items-center justify-center text-white text-xs font-medium"
                                            style={{ height: `${proposedPIHeight}px` }}
                                        >
                                            {proposedPI > 0 && `$${proposedPI.toLocaleString()}`}
                                        </div>
                                        {/* Escrow */}
                                        {proposedEscrow > 0 && (
                                            <div 
                                                className="bg-teal-500 flex items-center justify-center text-white text-xs font-medium"
                                                style={{ height: `${proposedEscrowHeight}px` }}
                                            >
                                                {proposedEscrowHeight > 20 && `$${proposedEscrow.toLocaleString()}`}
                                            </div>
                                        )}
                                        {/* MI */}
                                        {proposedMI > 0 && (
                                            <div 
                                                className="bg-purple-400 flex items-center justify-center text-white text-xs font-medium"
                                                style={{ height: `${proposedMIHeight}px` }}
                                            >
                                                {proposedMIHeight > 20 && `$${proposedMI.toLocaleString()}`}
                                            </div>
                                        )}
                                        {/* Remaining Debts - Top */}
                                        {debtsRemaining > 0 && (
                                            <div 
                                                className="bg-stone-400 flex items-center justify-center text-white text-xs font-medium"
                                                style={{ height: `${remainingDebtsHeight}px` }}
                                            >
                                                {remainingDebtsHeight > 20 && `$${debtsRemaining.toLocaleString()}`}
                                            </div>
                                        )}
                                    </div>
                                    <div className="mt-3 text-center">
                                        <p className="text-2xl font-bold text-amber-600">${proposedTotalPayment.toLocaleString()}</p>
                                        <p className="text-sm text-stone-500">Proposed</p>
                                    </div>
                                </div>
                                
                                {/* Savings Callouts */}
                                <div className="flex flex-col gap-4">
                                    <div className="w-28 h-28 rounded-full border-4 border-teal-500 flex flex-col items-center justify-center bg-white shadow-lg">
                                        <TrendingUp size={20} className="text-teal-500 mb-1" />
                                        <p className="text-xl font-bold text-teal-600">${annualSavingsAmount.toLocaleString()}</p>
                                        <p className="text-[10px] text-teal-600 uppercase tracking-wide">Annual Savings</p>
                                    </div>
                                    <div className="w-24 h-24 rounded-full border-4 border-stone-300 flex flex-col items-center justify-center bg-white shadow mx-auto">
                                        <p className="text-lg font-bold text-stone-700">${savingsAmount.toLocaleString()}</p>
                                        <p className="text-[10px] text-stone-500 uppercase tracking-wide">Monthly</p>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Legend */}
                            <div className="flex flex-wrap justify-center gap-4 mt-6 pt-4 border-t border-stone-200">
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-stone-600 rounded"></div>
                                    <span className="text-xs text-stone-600">Mortgage P&I</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-teal-500 rounded"></div>
                                    <span className="text-xs text-stone-600">Escrow (Taxes & Insurance)</span>
                                </div>
                                {(currentMI > 0 || proposedMI > 0) && (
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 bg-purple-400 rounded"></div>
                                        <span className="text-xs text-stone-600">MI/MIP</span>
                                    </div>
                                )}
                                {debtsPaidOff > 0 && (
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 bg-amber-500 rounded"></div>
                                        <span className="text-xs text-stone-600">Debts Being Paid Off</span>
                                    </div>
                                )}
                                {debtsRemaining > 0 && (
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 bg-stone-400 rounded"></div>
                                        <span className="text-xs text-stone-600">Remaining Debts</span>
                                    </div>
                                )}
                            </div>
                            
                            {/* Breakdown Table */}
                            <div className="mt-6 bg-stone-50 rounded-xl p-4">
                                <h3 className="text-sm font-semibold text-stone-700 mb-3">Payment Breakdown</h3>
                                <div className="grid grid-cols-3 gap-2 text-sm">
                                    <div className="font-medium text-stone-500"></div>
                                    <div className="font-medium text-stone-600 text-right">Current</div>
                                    <div className="font-medium text-amber-600 text-right">Proposed</div>
                                    
                                    <div className="text-stone-600">Mortgage P&I</div>
                                    <div className="text-right text-stone-700">${currentMortgagePI.toLocaleString()}</div>
                                    <div className="text-right text-amber-600">${proposedPI.toLocaleString()}</div>
                                    
                                    <div className="text-stone-600">Escrow</div>
                                    <div className="text-right text-stone-700">${currentEscrow.toLocaleString()}</div>
                                    <div className="text-right text-amber-600">${proposedEscrow.toLocaleString()}</div>
                                    
                                    {(currentMI > 0 || proposedMI > 0) && (
                                        <>
                                            <div className="text-stone-600">MI/MIP</div>
                                            <div className="text-right text-stone-700">${currentMI.toLocaleString()}</div>
                                            <div className="text-right text-amber-600">${proposedMI.toLocaleString()}</div>
                                        </>
                                    )}
                                    
                                    {debtsPaidOff > 0 && (
                                        <>
                                            <div className="text-stone-600">Other Debts</div>
                                            <div className="text-right text-stone-700">${debtsPaidOff.toLocaleString()}</div>
                                            <div className="text-right text-teal-600">$0 (Paid Off)</div>
                                        </>
                                    )}
                                    
                                    {debtsRemaining > 0 && (
                                        <>
                                            <div className="text-stone-600">Remaining Debts</div>
                                            <div className="text-right text-stone-700">${debtsRemaining.toLocaleString()}</div>
                                            <div className="text-right text-stone-500">${debtsRemaining.toLocaleString()}</div>
                                        </>
                                    )}
                                    
                                    <div className="col-span-3 border-t border-stone-200 mt-2 pt-2"></div>
                                    
                                    <div className="font-bold text-stone-800">TOTAL</div>
                                    <div className="text-right font-bold text-stone-800">${currentTotalPayment.toLocaleString()}</div>
                                    <div className="text-right font-bold text-amber-600">${proposedTotalPayment.toLocaleString()}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'blended-rate':
                return <BlendedRateChart />;
            case 'disposable-income':
                // Calculate disposable income with configurable inputs
                const incomeAfterTaxes = Math.round(grossMonthlyIncome * (1 - taxRate / 100));
                
                // Current payments
                const currentMortgagePmt = analysisData.currentMortgagePI || 1710;
                const currentOtherDebtPmt = analysisData.debtsPaidOff || 2446;
                const currentTotalDebt = currentMortgagePmt + currentOtherDebtPmt;
                const currentDisposable = incomeAfterTaxes - currentTotalDebt;
                const currentDisposablePct = Math.round((currentDisposable / incomeAfterTaxes) * 100);
                
                // Proposed payments (debts paid off, only new mortgage)
                const proposedMortgagePmt = analysisData.proposedPI || 3499;
                const proposedOtherDebtPmt = analysisData.debtsRemaining || 0; // Only remaining debts
                const proposedTotalDebt = proposedMortgagePmt + proposedOtherDebtPmt;
                const proposedDisposable = incomeAfterTaxes - proposedTotalDebt;
                const proposedDisposablePct = Math.round((proposedDisposable / incomeAfterTaxes) * 100);
                
                const disposableIncrease = proposedDisposable - currentDisposable;
                const disposableIncreasePct = proposedDisposablePct - currentDisposablePct;
                
                return (
                    <div className="h-full flex flex-col">
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4">
                            <h2 className="font-bold text-xl tracking-wide">ESTIMATED DISPOSABLE INCOME</h2>
                            <p className="text-blue-100 text-sm">Compare your take-home income before and after</p>
                        </div>
                        
                        <div className="flex-1 overflow-auto p-6">
                            {/* Income Summary */}
                            <div className="bg-blue-50 rounded-xl p-4 mb-6">
                                <div className="grid grid-cols-3 gap-4 text-center">
                                    <div>
                                        <p className="text-xs text-blue-600 mb-1">Gross Income</p>
                                        <p className="text-lg font-bold text-blue-700">${grossMonthlyIncome.toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-blue-600 mb-1">Tax Rate</p>
                                        <p className="text-lg font-bold text-blue-700">{taxRate}%</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-blue-600 mb-1">After Taxes</p>
                                        <p className="text-lg font-bold text-blue-700">${incomeAfterTaxes.toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Comparison Table */}
                            <div className="bg-white rounded-xl border border-stone-200 overflow-hidden mb-6">
                                <div className="grid grid-cols-3 bg-stone-800 text-white text-sm font-semibold">
                                    <div className="px-4 py-3"></div>
                                    <div className="px-4 py-3 text-center">Current</div>
                                    <div className="px-4 py-3 text-center text-amber-300">Proposed</div>
                                </div>
                                
                                <div className="divide-y divide-stone-100">
                                    <div className="grid grid-cols-3 items-center">
                                        <div className="px-4 py-3 text-sm text-stone-600">Monthly Income</div>
                                        <div className="px-4 py-3 text-center font-medium text-stone-800">${grossMonthlyIncome.toLocaleString()}</div>
                                        <div className="px-4 py-3 text-center font-medium text-stone-800">${grossMonthlyIncome.toLocaleString()}</div>
                                    </div>
                                    <div className="grid grid-cols-3 items-center bg-stone-50">
                                        <div className="px-4 py-3 text-sm text-stone-600">Income After Taxes</div>
                                        <div className="px-4 py-3 text-center font-medium text-stone-800">${incomeAfterTaxes.toLocaleString()}</div>
                                        <div className="px-4 py-3 text-center font-medium text-stone-800">${incomeAfterTaxes.toLocaleString()}</div>
                                    </div>
                                    <div className="grid grid-cols-3 items-center">
                                        <div className="px-4 py-3 text-sm text-stone-600">Mortgage Payment</div>
                                        <div className="px-4 py-3 text-center font-medium text-stone-800">${currentMortgagePmt.toLocaleString()}</div>
                                        <div className="px-4 py-3 text-center font-medium text-amber-600">${proposedMortgagePmt.toLocaleString()}</div>
                                    </div>
                                    <div className="grid grid-cols-3 items-center bg-stone-50">
                                        <div className="px-4 py-3 text-sm text-stone-600">Other Monthly Payments</div>
                                        <div className="px-4 py-3 text-center font-medium text-rose-600">${currentOtherDebtPmt.toLocaleString()}</div>
                                        <div className="px-4 py-3 text-center font-medium text-teal-600">${proposedOtherDebtPmt.toLocaleString()}</div>
                                    </div>
                                    <div className="grid grid-cols-3 items-center border-t-2 border-stone-200 bg-blue-50">
                                        <div className="px-4 py-3 text-sm font-semibold text-stone-800">Disposable Income ($)</div>
                                        <div className="px-4 py-3 text-center text-xl font-bold text-stone-800">${currentDisposable.toLocaleString()}</div>
                                        <div className="px-4 py-3 text-center text-xl font-bold text-blue-600">${proposedDisposable.toLocaleString()}</div>
                                    </div>
                                    <div className="grid grid-cols-3 items-center bg-blue-50">
                                        <div className="px-4 py-3 text-sm font-semibold text-stone-800">Disposable Income (%)</div>
                                        <div className="px-4 py-3 text-center text-lg font-bold text-stone-800">{currentDisposablePct}%</div>
                                        <div className="px-4 py-3 text-center text-lg font-bold text-blue-600">{proposedDisposablePct}%</div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Increase in Disposable Income */}
                            <div className={`rounded-xl p-6 text-center border-2 ${disposableIncrease >= 0 ? 'bg-teal-50 border-teal-200' : 'bg-rose-50 border-rose-200'}`}>
                                <p className="text-sm text-stone-600 mb-2">Increase in Disposable Income</p>
                                <div className="flex items-center justify-center gap-4">
                                    <div>
                                        <p className={`text-4xl font-bold ${disposableIncrease >= 0 ? 'text-teal-600' : 'text-rose-600'}`}>
                                            {disposableIncrease >= 0 ? '+' : ''}{disposableIncreasePct.toFixed(1)}%
                                        </p>
                                        <p className="text-xs text-stone-500 mt-1">Percentage Increase</p>
                                    </div>
                                    <div className="w-px h-12 bg-stone-200"></div>
                                    <div>
                                        <p className={`text-3xl font-bold ${disposableIncrease >= 0 ? 'text-teal-600' : 'text-rose-600'}`}>
                                            {disposableIncrease >= 0 ? '+' : ''}${Math.abs(disposableIncrease).toLocaleString()}
                                        </p>
                                        <p className="text-xs text-stone-500 mt-1">Monthly Increase</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'reinvestment':
                return (
                    <div className="p-6">
                        <div className="grid grid-cols-3 gap-3 mb-6">
                            <div className="bg-neutral-l5 rounded-lg p-3 text-center">
                                <p className="text-[10px] text-neutral-l1 uppercase">Monthly</p>
                                <p className="text-lg font-bold text-neutral-d3">${analysisData.reinvestmentMonthly}</p>
                            </div>
                            <div className="bg-neutral-l5 rounded-lg p-3 text-center">
                                <p className="text-[10px] text-neutral-l1 uppercase">Return</p>
                                <p className="text-lg font-bold text-neutral-d3">{analysisData.reinvestmentReturn}%</p>
                            </div>
                            <div className="bg-neutral-l5 rounded-lg p-3 text-center">
                                <p className="text-[10px] text-neutral-l1 uppercase">Years</p>
                                <p className="text-lg font-bold text-neutral-d3">{analysisData.reinvestmentYears}</p>
                            </div>
                        </div>
                        <CompoundGrowthChart 
                            monthlyInvestment={analysisData.reinvestmentMonthly}
                            annualReturn={analysisData.reinvestmentReturn}
                            years={analysisData.reinvestmentYears}
                        />
                    </div>
                );
            case 'cash-flow':
                return <CashFlowChart data={analysisData} />;
            case 'recoup-costs':
                return (
                    <div className="p-6 text-center">
                        <div className="w-16 h-16 bg-information-l3 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Clock size={32} className="text-information" />
                        </div>
                        <h3 className="text-lg font-medium text-neutral-d2 mb-2">Time to Recoup Closing Costs</h3>
                        <p className="text-sm text-neutral-l1">This chart shows how many months until your monthly savings cover the closing costs.</p>
                        
                        <div className="mt-6 grid grid-cols-2 gap-4">
                            <div className="p-4 bg-neutral-l5 rounded-lg">
                                <p className="text-xs text-neutral-l1 uppercase">Closing Costs</p>
                                <p className="text-xl font-bold text-neutral-d3">${analysisData.closingCosts?.toLocaleString()}</p>
                            </div>
                            <div className="p-4 bg-neutral-l5 rounded-lg">
                                <p className="text-xs text-neutral-l1 uppercase">Monthly Savings</p>
                                <p className="text-xl font-bold text-success">${analysisData.monthlySavings?.toLocaleString()}</p>
                            </div>
                        </div>
                        
                        <div className="mt-6 p-4 bg-success-l3/30 rounded-lg">
                            <p className="text-3xl font-bold text-success-d2">{analysisData.breakEvenMonths} Months</p>
                            <p className="text-sm text-success">to break even</p>
                        </div>
                    </div>
                );
            case 'debt-consolidation':
                // Use passed accounts or empty array
                const debts = analysisData.accounts || [];
                const paidDebts = debts.filter(d => d.willPay !== false); // Include all if willPay not specified
                const totalPayment = paidDebts.reduce((s, d) => s + (parseFloat(String(d.payment).replace(/[$,]/g, '')) || 0), 0);
                const totalBalance = paidDebts.reduce((s, d) => s + (parseFloat(String(d.balance).replace(/[$,]/g, '')) || 0), 0);
                
                return (
                    <div className="h-full flex flex-col">
                        {/* Worksheet Header */}
                        <div className="bg-stone-800 text-white px-4 py-3">
                            <h2 className="font-bold text-lg tracking-wide">DEBT CONSOLIDATION WORKSHEET</h2>
                        </div>
                        
                        {/* Debts Table */}
                        <div className="flex-1 overflow-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-stone-700 text-white sticky top-0">
                                    <tr>
                                        <th className="px-3 py-2 text-left font-medium">Creditor</th>
                                        <th className="px-3 py-2 text-left font-medium">Type</th>
                                        <th className="px-3 py-2 text-right font-medium">Monthly Payment</th>
                                        <th className="px-3 py-2 text-right font-medium">Payoff Amount</th>
                                        <th className="px-3 py-2 text-center font-medium">Paid Off</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paidDebts.map((debt, i) => (
                                        <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-stone-50'}>
                                            <td className="px-3 py-2 font-medium text-stone-800">{debt.creditor}</td>
                                            <td className="px-3 py-2 text-stone-600">{debt.type || debt.accountType}</td>
                                            <td className="px-3 py-2 text-right text-stone-700">
                                                ${(parseFloat(String(debt.payment).replace(/[$,]/g, '')) || 0).toLocaleString()}
                                            </td>
                                            <td className="px-3 py-2 text-right text-stone-700">
                                                ${(parseFloat(String(debt.balance).replace(/[$,]/g, '')) || 0).toLocaleString()}
                                            </td>
                                            <td className="px-3 py-2 text-center text-teal-600 font-medium">Yes</td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot className="bg-amber-100 font-bold">
                                    <tr>
                                        <td className="px-3 py-2 text-stone-800" colSpan={2}>Total</td>
                                        <td className="px-3 py-2 text-right text-stone-800">${totalPayment.toLocaleString()}</td>
                                        <td className="px-3 py-2 text-right text-stone-800">${totalBalance.toLocaleString()}</td>
                                        <td className="px-3 py-2"></td>
                                    </tr>
                                </tfoot>
                            </table>
                            
                            {/* Mortgage Disclaimer */}
                            <p className="px-3 py-2 text-xs text-stone-500 italic">
                                * Mortgage Payoff(s) are estimated and will change with actual payoff amount from lender(s)
                            </p>
                            
                            {/* Our Promise Section */}
                            <div className="p-4">
                                <div className="bg-gradient-to-b from-rose-500 to-rose-600 rounded-xl overflow-hidden">
                                    <div className="text-center py-3">
                                        <p className="text-rose-200 text-xs tracking-widest">— PEACE-OF-MIND —</p>
                                        <p className="text-white text-xl font-bold tracking-wide">PROMISE</p>
                                    </div>
                                    
                                    <div className="bg-white px-4 py-4 space-y-4">
                                        <div className="flex items-start gap-3">
                                            <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                <BadgeCheck size={18} className="text-amber-600" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-rose-600">No Lender Fees</p>
                                                <p className="text-xs text-stone-500">No Lender Fees. Nope, we don't charge them.</p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-start gap-3">
                                            <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                <Percent size={18} className="text-amber-600" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-rose-600">Better Rate Guarantee</p>
                                                <p className="text-xs text-stone-500">We're confident in our incredible rates. If you find a lower rate, we'll match it or pay you $1,000.</p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-start gap-3">
                                            <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                <Gift size={18} className="text-amber-600" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-rose-600">Lifetime Rewards Guarantee</p>
                                                <p className="text-xs text-stone-500">We hook our friends up. Returning customers are eligible for exclusive rate discounts and pay NO out-of-pocket expenses on a refinance.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'accelerated-payoff':
                // Calculate how much faster they can pay off the loan with configurable extra payment
                const maxExtraPayment = analysisData.monthlySavings || 657;
                // Use direct amount if set, otherwise calculate from percentage
                const extraPayment = extraPaymentAmount !== null 
                    ? extraPaymentAmount 
                    : Math.round((acceleratedPaymentPercent / 100) * maxExtraPayment);
                const loanAmt = analysisData.newLoanAmount || 628000;
                const loanRate = (analysisData.rate || 7.0) / 100 / 12;
                const originalTerm = 30; // years
                const originalPayments = originalTerm * 12;
                
                // Calculate original monthly P&I (without extra payment)
                const originalPI = loanAmt * (loanRate * Math.pow(1 + loanRate, originalPayments)) / (Math.pow(1 + loanRate, originalPayments) - 1);
                
                // Calculate new payoff with extra payments
                const newMonthlyPayment = originalPI + extraPayment;
                let balance = loanAmt;
                let months = 0;
                let totalInterestWithExtra = 0;
                while (balance > 0 && months < originalPayments) {
                    const interest = balance * loanRate;
                    const principal = Math.min(newMonthlyPayment - interest, balance);
                    balance -= principal;
                    totalInterestWithExtra += interest;
                    months++;
                }
                const newTermYears = Math.ceil(months / 12);
                const yearsSaved = originalTerm - newTermYears;
                
                // Calculate original total interest
                const originalTotalInterest = (originalPI * originalPayments) - loanAmt;
                const interestSaved = originalTotalInterest - totalInterestWithExtra;
                
                // Handler for updating extra payment from direct input
                const handleExtraPaymentChange = (newValue) => {
                    const numValue = Math.max(0, parseInt(newValue) || 0);
                    setExtraPaymentAmount(numValue);
                };
                
                // Handler for percentage buttons - resets to percentage mode
                const handlePercentClick = (pct) => {
                    setExtraPaymentAmount(null); // Clear direct amount
                    setAcceleratedPaymentPercent(pct);
                };
                
                // Calculate current percentage for display
                const currentPercent = Math.round((extraPayment / maxExtraPayment) * 100);
                
                return (
                    <div className="h-full flex flex-col">
                        <div className="bg-gradient-to-r from-purple-600 to-purple-500 text-white px-6 py-4">
                            <h2 className="font-bold text-xl tracking-wide">ACCELERATED PAYOFF</h2>
                            <p className="text-purple-100 text-sm">Put your savings back into your mortgage</p>
                        </div>
                        
                        <div className="flex-1 overflow-auto p-6">
                            {/* Extra Payment Amount - Editable */}
                            <div className="bg-purple-50 rounded-xl p-4 mb-6 text-center">
                                <p className="text-sm text-purple-600 mb-1">Extra Monthly Payment Applied</p>
                                <div className="flex items-center justify-center gap-1">
                                    <span className="text-3xl font-bold text-purple-700">$</span>
                                    <input
                                        type="number"
                                        value={extraPayment}
                                        onChange={(e) => handleExtraPaymentChange(e.target.value)}
                                        className="text-3xl font-bold text-purple-700 bg-transparent border-b-2 border-purple-300 focus:border-purple-500 outline-none w-28 text-center appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                                        min="0"
                                    />
                                </div>
                                <p className="text-xs text-purple-500 mt-2">{currentPercent}% of your ${maxExtraPayment.toLocaleString()} savings</p>
                                
                                {/* Quick adjustment buttons */}
                                <div className="flex items-center justify-center gap-2 mt-3">
                                    {[25, 50, 75, 100].map(pct => (
                                        <button
                                            key={pct}
                                            onClick={() => handlePercentClick(pct)}
                                            className={`px-3 py-1 text-xs font-medium rounded-full transition-all ${
                                                extraPaymentAmount === null && acceleratedPaymentPercent === pct 
                                                    ? 'bg-purple-600 text-white' 
                                                    : 'bg-white text-purple-600 border border-purple-300 hover:bg-purple-100'
                                            }`}
                                        >
                                            {pct}%
                                        </button>
                                    ))}
                                </div>
                            </div>
                            
                            {/* Visual Timeline Comparison */}
                            <div className="mb-6">
                                <h3 className="text-sm font-semibold text-stone-700 mb-4">Payoff Timeline</h3>
                                
                                {/* Original Term */}
                                <div className="mb-4">
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-stone-500">Without extra payments</span>
                                        <span className="font-medium text-stone-700">{originalTerm} years</span>
                                    </div>
                                    <div className="h-8 bg-stone-200 rounded-full relative overflow-hidden">
                                        <div className="absolute inset-0 bg-stone-400 rounded-full"></div>
                                        <div className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-medium text-white">
                                            {originalTerm} yrs
                                        </div>
                                    </div>
                                </div>
                                
                                {/* New Term */}
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-stone-500">With ${extraPayment.toLocaleString()}/mo extra</span>
                                        <span className="font-bold text-purple-600">{newTermYears} years</span>
                                    </div>
                                    <div className="h-8 bg-stone-200 rounded-full relative overflow-hidden">
                                        <div 
                                            className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-500 to-purple-400 rounded-full"
                                            style={{ width: `${(newTermYears / originalTerm) * 100}%` }}
                                        ></div>
                                        <div className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-medium text-stone-500">
                                            {newTermYears} yrs
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Savings Highlights */}
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-center text-white">
                                    <Calendar size={24} className="mx-auto mb-2 opacity-80" />
                                    <p className="text-3xl font-bold">{yearsSaved}</p>
                                    <p className="text-sm text-purple-100">Years Saved</p>
                                </div>
                                <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl p-4 text-center text-white">
                                    <DollarSign size={24} className="mx-auto mb-2 opacity-80" />
                                    <p className="text-3xl font-bold">${Math.round(interestSaved / 1000)}K</p>
                                    <p className="text-sm text-teal-100">Interest Saved</p>
                                </div>
                            </div>
                            
                            {/* Breakdown */}
                            <div className="bg-white rounded-xl border border-stone-200 p-4">
                                <h3 className="text-sm font-semibold text-stone-700 mb-3">Comparison</h3>
                                <div className="space-y-2 text-sm">
                                    <div className="grid grid-cols-3 gap-2 text-stone-500 font-medium pb-2 border-b border-stone-100">
                                        <span></span>
                                        <span className="text-right">Original</span>
                                        <span className="text-right text-purple-600">Accelerated</span>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2 py-1">
                                        <span className="text-stone-600">Loan Term</span>
                                        <span className="text-right text-stone-700">{originalTerm} years</span>
                                        <span className="text-right font-medium text-purple-600">{newTermYears} years</span>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2 py-1">
                                        <span className="text-stone-600">Total Interest</span>
                                        <span className="text-right text-stone-700">${Math.round(originalTotalInterest).toLocaleString()}</span>
                                        <span className="text-right font-medium text-purple-600">${Math.round(totalInterestWithExtra).toLocaleString()}</span>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2 py-1 border-t border-stone-100 pt-2">
                                        <span className="font-medium text-stone-800">You Save</span>
                                        <span></span>
                                        <span className="text-right font-bold text-teal-600">${Math.round(interestSaved).toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            
            case 'compound-growth':
                // Calculate compound growth at different intervals with configurable rate
                // Use absolute value to ensure positive display, fallback to 657
                const monthlyInvestment = Math.max(0, analysisData.monthlySavings) || 657;
                const annualReturnRate = compoundRate / 100;
                const monthlyReturnRate = annualReturnRate / 12;
                
                const calculateFutureValue = (years) => {
                    const n = years * 12;
                    // Future value of annuity formula
                    return monthlyInvestment * ((Math.pow(1 + monthlyReturnRate, n) - 1) / monthlyReturnRate);
                };
                
                const growthData = [
                    { years: 5, value: calculateFutureValue(5) },
                    { years: 10, value: calculateFutureValue(10) },
                    { years: 15, value: calculateFutureValue(15) },
                    { years: 20, value: calculateFutureValue(20) },
                    { years: 25, value: calculateFutureValue(25) },
                    { years: 30, value: calculateFutureValue(30) },
                ];
                
                const maxValue = growthData[growthData.length - 1].value;
                const totalContributed = monthlyInvestment * 12 * 30;
                const totalEarnings = maxValue - totalContributed;
                
                return (
                    <div className="h-full flex flex-col">
                        <div className="bg-gradient-to-r from-teal-600 to-teal-500 text-white px-6 py-4">
                            <h2 className="font-bold text-xl tracking-wide">COMPOUND GROWTH</h2>
                            <p className="text-teal-100 text-sm">Invest your savings @ {compoundRate}% annual return</p>
                        </div>
                        
                        <div className="flex-1 overflow-auto p-6">
                            {/* Monthly Investment */}
                            <div className="bg-teal-50 rounded-xl p-4 mb-6 text-center">
                                <p className="text-sm text-teal-600 mb-1">Monthly Investment</p>
                                <p className="text-3xl font-bold text-teal-700">${monthlyInvestment.toLocaleString()}</p>
                            </div>
                            
                            {/* Growth Chart - Bar visualization */}
                            <div className="mb-6">
                                <h3 className="text-sm font-semibold text-stone-700 mb-4">Growth Over Time @ {compoundRate}%</h3>
                                <div className="space-y-3">
                                    {growthData.map((item, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <span className="w-12 text-sm font-medium text-stone-600">{item.years} yrs</span>
                                            <div className="flex-1 h-8 bg-stone-100 rounded-full overflow-hidden relative">
                                                <div 
                                                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-teal-500 to-teal-400 rounded-full transition-all"
                                                    style={{ width: `${(item.value / maxValue) * 100}%` }}
                                                ></div>
                                            </div>
                                            <span className="w-24 text-right text-sm font-bold text-teal-600">
                                                ${Math.round(item.value).toLocaleString()}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            {/* 30-Year Highlight */}
                            <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl p-6 text-center text-white mb-6">
                                <Target size={32} className="mx-auto mb-2 opacity-80" />
                                <p className="text-sm text-teal-100 mb-1">After 30 Years</p>
                                <p className="text-4xl font-bold">${Math.round(maxValue).toLocaleString()}</p>
                                <div className="flex justify-center gap-6 mt-4 pt-4 border-t border-teal-400/30">
                                    <div>
                                        <p className="text-2xl font-bold">${Math.round(totalContributed).toLocaleString()}</p>
                                        <p className="text-xs text-teal-200">You Contributed</p>
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold">${Math.round(totalEarnings).toLocaleString()}</p>
                                        <p className="text-xs text-teal-200">Earnings</p>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Table breakdown */}
                            <div className="bg-white rounded-xl border border-stone-200 p-4">
                                <h3 className="text-sm font-semibold text-stone-700 mb-3">Year-by-Year</h3>
                                <div className="grid grid-cols-3 gap-2 text-sm">
                                    <span className="font-medium text-stone-500">Years</span>
                                    <span className="font-medium text-stone-500 text-right">Contributed</span>
                                    <span className="font-medium text-teal-600 text-right">Total Value</span>
                                    
                                    {growthData.map((item, i) => (
                                        <React.Fragment key={i}>
                                            <span className="text-stone-600 py-1">{item.years} years</span>
                                            <span className="text-stone-700 text-right py-1">
                                                ${(monthlyInvestment * 12 * item.years).toLocaleString()}
                                            </span>
                                            <span className="font-medium text-teal-600 text-right py-1">
                                                ${Math.round(item.value).toLocaleString()}
                                            </span>
                                        </React.Fragment>
                                    ))}
                                </div>
                            </div>
                            
                            <p className="text-xs text-stone-400 text-center mt-4">
                                * Assumes 7% average annual return, compounded monthly. Actual returns may vary.
                            </p>
                        </div>
                    </div>
                );
            
            case 'cash-flow-window':
                // Cash Flow Window - money kept during transition with configurable months
                const monthsPaymentFree = cashFlowMonths;
                
                // Current total monthly payment (what they pay NOW on all debts being consolidated)
                const currentMonthlyTotal = analysisData.currentTotal || analysisData.debtsMonthlyPayment || 4156;
                const cashInPocket = currentMonthlyTotal * monthsPaymentFree;
                
                // New proposed total monthly payment (what they'll pay starting after payment-free period)
                const newProposedPayment = analysisData.proposedTotal || analysisData.proposedPI || 3625;
                
                return (
                    <div className="h-full flex flex-col">
                        <div className="bg-gradient-to-r from-emerald-600 to-teal-500 text-white px-6 py-4">
                            <h2 className="font-bold text-xl tracking-wide">CASH FLOW WINDOW</h2>
                            <p className="text-emerald-100 text-sm">{monthsPaymentFree} month{monthsPaymentFree !== 1 ? 's' : ''} payment-free period</p>
                        </div>
                        
                        <div className="flex-1 overflow-auto p-6">
                            {/* Main Cash Amount */}
                            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-8 text-center mb-6 border border-emerald-200">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-lg mb-4">
                                    <Wallet size={32} className="text-emerald-600" />
                                </div>
                                <p className="text-5xl font-bold text-emerald-600 mb-2">
                                    ${cashInPocket.toLocaleString()}
                                </p>
                                <p className="text-emerald-700 font-medium">Cash In Your Pocket</p>
                                <p className="text-stone-500 text-sm mt-2">
                                    {monthsPaymentFree} month{monthsPaymentFree !== 1 ? 's' : ''} × ${currentMonthlyTotal.toLocaleString()}/mo = ${cashInPocket.toLocaleString()}
                                </p>
                            </div>
                            
                            {/* How It Works */}
                            <div className="bg-white rounded-xl border border-stone-200 p-5 mb-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <Clock size={18} className="text-stone-500" />
                                    <h3 className="font-semibold text-stone-700">How It Works ({monthsPaymentFree} Month Window)</h3>
                                </div>
                                
                                <div className="space-y-4">
                                    <div className="flex gap-4">
                                        <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">1</div>
                                        <div>
                                            <p className="font-medium text-stone-800">Your loan closes</p>
                                            <p className="text-sm text-stone-500">All existing payments stop immediately</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex gap-4">
                                        <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">2</div>
                                        <div>
                                            <p className="font-medium text-stone-800">Month 1 & 2: No payments due</p>
                                            <p className="text-sm text-stone-500">
                                                You keep ${currentMonthlyTotal.toLocaleString()} × 2 = <span className="font-bold text-emerald-600">${cashInPocket.toLocaleString()}</span>
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex gap-4">
                                        <div className="w-8 h-8 rounded-full bg-teal-500 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">3</div>
                                        <div>
                                            <p className="font-medium text-stone-800">Month 3: First new payment due</p>
                                            <p className="text-sm text-stone-500">Your new consolidated payment begins</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Payment Timeline Visual */}
                            <div className="mb-6">
                                <h3 className="text-sm font-semibold text-stone-700 mb-3">Payment Timeline</h3>
                                <div className="grid grid-cols-3 gap-2">
                                    <div className="bg-emerald-500 rounded-xl p-4 text-center text-white">
                                        <p className="text-xs text-emerald-100 mb-1">Month 1</p>
                                        <p className="text-2xl font-bold">$0</p>
                                    </div>
                                    <div className="bg-emerald-500 rounded-xl p-4 text-center text-white">
                                        <p className="text-xs text-emerald-100 mb-1">Month 2</p>
                                        <p className="text-2xl font-bold">$0</p>
                                    </div>
                                    <div className="bg-white border-2 border-teal-500 rounded-xl p-4 text-center">
                                        <p className="text-xs text-stone-500 mb-1">Month 3</p>
                                        <p className="text-2xl font-bold text-teal-600">${newProposedPayment.toLocaleString()}</p>
                                        <p className="text-[10px] text-stone-400">First payment</p>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Summary Banner */}
                            <div className="bg-emerald-100 border border-emerald-200 rounded-xl p-4 text-center">
                                <p className="text-emerald-800">
                                    <span className="font-bold text-emerald-700">${cashInPocket.toLocaleString()}</span> stays in your pocket during the transition
                                </p>
                            </div>
                            
                            {/* Disclaimer */}
                            <p className="text-xs text-stone-400 text-center mt-4">
                                * First payment typically due 30-60 days after closing. Actual timing may vary.
                            </p>
                        </div>
                    </div>
                );
            
            case 'cash-back':
                const cashBackAmount = analysisData.cashout || 0;
                const loanAmount = analysisData.newLoanAmount || analysisData.amt || 0;
                const debtsTotal = analysisData.debtsPayoff || 0;
                
                // Potential uses for cash back
                const cashBackUses = [
                    { icon: GraduationCap, label: 'College Savings', color: 'bg-blue-500' },
                    { icon: Home, label: 'Home Improvements', color: 'bg-teal-500' },
                    { icon: Plane, label: 'Vacation', color: 'bg-purple-500' },
                    { icon: PiggyBank, label: 'Savings & Investments', color: 'bg-amber-500' },
                    { icon: Receipt, label: 'Pay Off Other Bills', color: 'bg-rose-500' },
                    { icon: Umbrella, label: 'Emergency Fund', color: 'bg-stone-500' },
                ];
                
                return (
                    <div className="h-full flex flex-col">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-teal-600 to-teal-500 text-white px-6 py-4">
                            <h2 className="font-bold text-xl tracking-wide">CASH BACK</h2>
                            <p className="text-teal-100 text-sm">Money in your pocket at closing</p>
                        </div>
                        
                        <div className="flex-1 overflow-auto p-6">
                            {/* Main Cash Back Display */}
                            <div className="bg-gradient-to-br from-teal-50 to-amber-50 rounded-2xl p-8 text-center mb-6 border border-teal-100">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-lg mb-4">
                                    <Banknote size={32} className="text-teal-600" />
                                </div>
                                <p className="text-5xl font-bold text-teal-700 mb-2">
                                    ${cashBackAmount.toLocaleString()}
                                </p>
                                <p className="text-teal-600 font-medium">In Your Pocket</p>
                                <div className="flex items-center justify-center gap-2 mt-3 text-sm text-stone-500">
                                    <span>After paying off debts</span>
                                    <ArrowRight size={14} />
                                    <span>Cash to you</span>
                                </div>
                            </div>
                            
                            {/* Calculation Breakdown */}
                            <div className="bg-white rounded-xl border border-stone-200 p-4 mb-6">
                                <h3 className="text-sm font-semibold text-stone-700 mb-3">How It's Calculated</h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between py-2 border-b border-stone-100">
                                        <span className="text-stone-600">Loan Amount</span>
                                        <span className="font-medium text-stone-800">${loanAmount.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b border-stone-100">
                                        <span className="text-stone-600">Less: Debts Paid Off</span>
                                        <span className="font-medium text-rose-600">-${debtsTotal.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b border-stone-100">
                                        <span className="text-stone-600">Less: Closing Costs (est.)</span>
                                        <span className="font-medium text-rose-600">-${(analysisData.closingCosts || 8057).toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between py-2 pt-3">
                                        <span className="font-bold text-stone-800">Cash Back at Closing</span>
                                        <span className="font-bold text-teal-600">${cashBackAmount.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                            
                            {/* What You Could Do With It */}
                            <div className="mb-4">
                                <h3 className="text-sm font-semibold text-stone-700 mb-4">What You Could Do With It</h3>
                                <div className="grid grid-cols-3 gap-3">
                                    {cashBackUses.map((use, i) => (
                                        <div key={i} className="bg-white rounded-xl border border-stone-200 p-4 text-center hover:shadow-md transition-shadow cursor-pointer group">
                                            <div className={`inline-flex items-center justify-center w-12 h-12 ${use.color} rounded-xl mb-2 group-hover:scale-110 transition-transform`}>
                                                <use.icon size={24} className="text-white" />
                                            </div>
                                            <p className="text-xs font-medium text-stone-700 leading-tight">{use.label}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            {/* Note */}
                            <p className="text-xs text-stone-400 text-center mt-4">
                                * Final cash back amount may vary based on actual closing costs and payoff amounts
                            </p>
                        </div>
                    </div>
                );
            default:
                return (
                    <div className="p-6 text-center">
                        <div className="w-16 h-16 bg-neutral-l4 rounded-full flex items-center justify-center mx-auto mb-4">
                            <BarChart3 size={32} className="text-neutral-l1" />
                        </div>
                        <h3 className="text-lg font-medium text-neutral-d2 mb-2">{chartTitles[chartType] || 'Chart Preview'}</h3>
                        <p className="text-sm text-neutral-l1">Chart visualization will appear here.</p>
                    </div>
                );
        }
    };

    // Testing banner for templated data
    const TestingBanner = () => data?.isTemplated ? (
        <div className="bg-amber-100 border-b border-amber-200 px-4 py-2 flex items-center gap-2 flex-shrink-0">
            <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
            <span className="text-amber-700 text-sm font-medium">
                TEMPLATED DATA - FOR TESTING ONLY
            </span>
        </div>
    ) : null;

    // Charts with their own full-height layout (no wrapper header)
    if (['debt-consolidation', 'payment-savings', 'cash-back', 'accelerated-payoff', 'compound-growth', 'cash-flow-window', 'disposable-income'].includes(chartType)) {
        return (
            <div className="h-full flex flex-col bg-white">
                <TestingBanner />
                {renderChart()}
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col">
            <TestingBanner />
            {/* Header */}
            <div className="bg-stone-800 text-white px-4 py-3 flex-shrink-0">
                <h2 className="font-medium">{chartTitles[chartType] || 'Chart Preview'}</h2>
            </div>

            {/* Chart Content */}
            <div className="flex-1 overflow-y-auto bg-white">
                {renderChart()}
            </div>

            {/* Footer */}
            <div className="p-3 bg-stone-100 border-t border-stone-200 flex-shrink-0">
                <p className="text-xs text-stone-500 text-center">
                    This is a preview. Select this chart in your proposal to include it.
                </p>
            </div>
        </div>
    );
}
