import React from 'react';
import { PaymentSavingsChart } from './charts/PaymentSavingsChart';
import { BlendedRateChart } from './charts/BlendedRateChart';
import { DisposableIncomeChart } from './charts/DisposableIncomeChart';
import { CompoundGrowthChart } from './charts/CompoundGrowthChart';
import { CashFlowChart } from './charts/CashFlowChart';
import { BarChart3, TrendingUp, DollarSign, Clock, PiggyBank, CreditCard } from 'lucide-react';

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
    'debt-consolidation': 'Debt Consolidation Summary',
};

export function ChartPreview({ chartType, data }) {
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
                return (
                    <div className="p-6">
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="bg-neutral-l5 rounded-lg p-4 text-center">
                                <p className="text-xs text-neutral-l1 uppercase tracking-wide mb-1">Current Payment</p>
                                <p className="text-2xl font-bold text-neutral-d3">${analysisData.currentPayment?.toLocaleString()}</p>
                            </div>
                            <div className="bg-alternativePrimary-l4 rounded-lg p-4 text-center">
                                <p className="text-xs text-alternativePrimary uppercase tracking-wide mb-1">Proposed Payment</p>
                                <p className="text-2xl font-bold text-alternativePrimary">${analysisData.proposedPayment?.toLocaleString()}</p>
                            </div>
                        </div>
                        
                        <div className="bg-success-l4 rounded-xl p-6 text-center mb-6">
                            <TrendingUp size={32} className="text-success mx-auto mb-2" />
                            <p className="text-4xl font-bold text-success-d2">${analysisData.monthlySavings?.toLocaleString()}</p>
                            <p className="text-sm text-success">Monthly Savings</p>
                            <p className="text-xs text-success-d1 mt-2">${analysisData.annualSavings?.toLocaleString()} per year</p>
                        </div>
                        
                        <PaymentSavingsChart 
                            currentPayment={analysisData.currentPayment}
                            proposedPayment={analysisData.proposedPayment}
                        />
                    </div>
                );
            case 'blended-rate':
                return <BlendedRateChart />;
            case 'disposable-income':
                return (
                    <div className="p-6">
                        <div className="bg-neutral-l5 rounded-lg p-4 mb-4">
                            <p className="text-xs text-neutral-l1 uppercase tracking-wide mb-1">Gross Monthly Income</p>
                            <p className="text-xl font-bold text-neutral-d3">${analysisData.grossMonthlyIncome?.toLocaleString()}</p>
                        </div>
                        <DisposableIncomeChart 
                            grossIncome={analysisData.grossMonthlyIncome}
                            mortgagePayment={analysisData.proposedPayment}
                            savings={analysisData.monthlySavings}
                        />
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
                return (
                    <div className="p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-orange-l3 rounded-full flex items-center justify-center">
                                <CreditCard size={24} className="text-orange" />
                            </div>
                            <div>
                                <h3 className="text-lg font-medium text-neutral-d2">Debt Consolidation Summary</h3>
                                <p className="text-sm text-neutral-l1">Overview of debts being consolidated</p>
                            </div>
                        </div>
                        
                        <div className="space-y-3">
                            <div className="flex justify-between p-3 bg-neutral-l5 rounded-lg">
                                <span className="text-sm text-neutral-d1">Total Debts Being Paid Off</span>
                                <span className="font-bold text-neutral-d2">${analysisData.debtsPayoff?.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between p-3 bg-success-l4 rounded-lg">
                                <span className="text-sm text-success-d2">Monthly Payments Eliminated</span>
                                <span className="font-bold text-success">${analysisData.debtsMonthlyPayment?.toLocaleString()}/mo</span>
                            </div>
                            <div className="flex justify-between p-3 bg-neutral-l5 rounded-lg">
                                <span className="text-sm text-neutral-d1">Accounts Consolidated</span>
                                <span className="font-bold text-neutral-d2">{analysisData.debtsCount}</span>
                            </div>
                            <div className="flex justify-between p-3 bg-alternativePrimary-l4 rounded-lg">
                                <span className="text-sm text-alternativePrimary">New Loan Amount</span>
                                <span className="font-bold text-alternativePrimary">${analysisData.newLoanAmount?.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between p-3 bg-neutral-l5 rounded-lg">
                                <span className="text-sm text-neutral-d1">Cashout to Borrower</span>
                                <span className="font-bold text-neutral-d2">${analysisData.cashout?.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between p-3 bg-neutral-l5 rounded-lg">
                                <span className="text-sm text-neutral-d1">LTV</span>
                                <span className={`font-bold ${analysisData.ltv > 80 ? 'text-warning-d2' : 'text-success'}`}>
                                    {analysisData.ltv}%
                                </span>
                            </div>
                        </div>
                        
                        <div className="mt-6 p-4 bg-gradient-to-r from-success-l4 to-success-l3 rounded-xl text-center">
                            <p className="text-xs text-success-d1 uppercase mb-1">Annual Savings</p>
                            <p className="text-3xl font-bold text-success-d2">${(analysisData.debtsMonthlyPayment * 12)?.toLocaleString()}</p>
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

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="bg-orange text-white px-4 py-3 flex-shrink-0">
                <h2 className="font-medium">Chart Preview</h2>
                <p className="text-xs text-orange-l2">{chartTitles[chartType] || 'Select a chart to preview'}</p>
            </div>

            {/* Chart Content */}
            <div className="flex-1 overflow-y-auto bg-white">
                {renderChart()}
            </div>

            {/* Footer */}
            <div className="p-3 bg-neutral-l5 border-t border-neutral-l3 flex-shrink-0">
                <p className="text-xs text-neutral-l1 text-center">
                    This is a preview. Select this chart in your proposal to include it.
                </p>
            </div>
        </div>
    );
}
