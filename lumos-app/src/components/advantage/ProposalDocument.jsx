import React from 'react';
import { Check, X } from 'lucide-react';

/**
 * Loan Proposal Document Component
 * Generates a clean, printable proposal with:
 * - Header with branding
 * - Loan comparison table (Current vs Proposed)
 * - Your Benefits section with 2 selected charts
 */
export function ProposalDocument({ 
    borrowerData, 
    loanOfficerData,
    loanData,
    selectedCharts = [],
    chartData
}) {
    const fmt = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n);
    const fmtPct = (n) => `${n.toFixed(3)}%`;
    
    // Default data
    const borrower = borrowerData || {
        name: 'Ken Customer',
        address: '1111 Test St',
        city: 'North Las Vegas',
        state: 'NV',
        zip: '89033'
    };
    
    const loanOfficer = loanOfficerData || {
        name: 'Test QA LO',
        title: 'Mortgage Specialist',
        phone: '949-555-5555',
        cell: '310-699-2605',
        email: 'qa@goodleap.com',
        nmls: '123456'
    };
    
    const loan = loanData || {
        currentProgram: '30 Year Fixed',
        proposedProgram: '30 Year Fixed',
        currentRate: 3.0,
        proposedRate: 5.875,
        proposedAPR: 6.183,
        currentPI: 900,
        proposedPI: 1478.84,
        currentMI: 0,
        proposedMI: 0,
        currentTotal: 1250,
        proposedTotal: 1828.84,
        currentEscrow: 350,
        proposedEscrow: 350
    };
    
    const data = chartData || {};
    
    // Chart rendering based on type
    const renderMiniChart = (chartId, index) => {
        switch(chartId) {
            case 'payment-savings':
                return <PaymentComparisonMini data={data} />;
            case 'debt-consolidation':
                return <DebtConsolidationMini data={data} />;
            case 'cash-back':
                return <CashBackMini data={data} />;
            case 'cash-flow-window':
                return <CashFlowMini data={data} />;
            case 'break-even':
                return <BreakEvenMini data={data} />;
            case 'accelerated-payoff':
                return <AcceleratedPayoffMini data={data} />;
            case 'compound-growth':
                return <CompoundGrowthMini data={data} />;
            default:
                return <DisposableIncomeMini data={data} />;
        }
    };
    
    const chartTitles = {
        'payment-savings': 'Current vs. New Payments',
        'debt-consolidation': 'Debt Consolidation Summary',
        'cash-back': 'Cash Back at Closing',
        'cash-flow-window': 'Cash Flow Window',
        'break-even': 'Break-Even Analysis',
        'accelerated-payoff': 'Accelerated Payoff',
        'compound-growth': 'Investment Growth',
        'disposable-income': 'Estimated Disposable Income'
    };

    return (
        <div className="bg-white min-h-full" style={{ fontFamily: 'Arial, sans-serif' }}>
            {/* Page Container */}
            <div className="max-w-[8.5in] mx-auto p-8">
                
                {/* Header with Logo */}
                <div className="flex justify-center mb-6">
                    <div className="text-4xl font-bold tracking-tight">
                        <span className="text-gray-700">g</span>
                        <span className="text-orange-500">oo</span>
                        <span className="text-gray-700">dleap</span>
                    </div>
                </div>
                
                {/* Contact Info Row */}
                <div className="flex justify-between mb-6 text-sm">
                    <div>
                        <p className="text-orange-500 font-bold text-xs uppercase tracking-wide mb-1">Loan Proposal For</p>
                        <p className="font-semibold text-gray-800">{borrower.name}</p>
                        <p className="text-gray-600">{borrower.address}</p>
                        <p className="text-gray-600">{borrower.city}, {borrower.state}</p>
                        <p className="text-gray-600">{borrower.zip}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-orange-500 font-bold text-xs uppercase tracking-wide mb-1">Provided By</p>
                        <p className="font-semibold text-gray-800">{loanOfficer.name}</p>
                        <p className="text-gray-600">{loanOfficer.title}</p>
                        <p className="text-gray-600">Ph:{loanOfficer.phone} | C:{loanOfficer.cell}</p>
                        <p className="text-gray-600">{loanOfficer.email}</p>
                        <p className="text-gray-600">NMLS License #: {loanOfficer.nmls}</p>
                    </div>
                </div>
                
                {/* Loan Proposal Table */}
                <div className="mb-6">
                    <div className="bg-gray-700 text-white text-center py-2 font-bold text-sm tracking-wide">
                        LOAN PROPOSAL
                    </div>
                    <table className="w-full border-collapse text-sm">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border border-gray-300 p-2 text-left"></th>
                                <th className="border border-gray-300 p-2 text-center font-semibold text-gray-700">Current</th>
                                <th className="border border-gray-300 p-2 text-center font-semibold text-orange-500">Proposed Loan</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="border border-gray-300 p-2 text-gray-600">Loan Program/Term</td>
                                <td className="border border-gray-300 p-2 text-center">{loan.currentProgram}</td>
                                <td className="border border-gray-300 p-2 text-center font-medium">{loan.proposedProgram}</td>
                            </tr>
                            <tr className="bg-gray-50">
                                <td className="border border-gray-300 p-2 text-gray-600">Interest Rate</td>
                                <td className="border border-gray-300 p-2 text-center">{loan.currentRate.toFixed(1)}%</td>
                                <td className="border border-gray-300 p-2 text-center font-medium">{loan.proposedRate.toFixed(3)}%</td>
                            </tr>
                            <tr>
                                <td className="border border-gray-300 p-2 text-gray-600">APR</td>
                                <td className="border border-gray-300 p-2 text-center">-</td>
                                <td className="border border-gray-300 p-2 text-center font-medium">{loan.proposedAPR.toFixed(3)}%</td>
                            </tr>
                            <tr className="bg-gray-50">
                                <td className="border border-gray-300 p-2 text-gray-600">Principal & Interest Payment</td>
                                <td className="border border-gray-300 p-2 text-center">{fmt(loan.currentPI)}</td>
                                <td className="border border-gray-300 p-2 text-center font-medium">{fmt(loan.proposedPI)}</td>
                            </tr>
                            <tr>
                                <td className="border border-gray-300 p-2 text-gray-600">Mortgage Insurance</td>
                                <td className="border border-gray-300 p-2 text-center">{fmt(loan.currentMI)}</td>
                                <td className="border border-gray-300 p-2 text-center font-medium">{fmt(loan.proposedMI)}</td>
                            </tr>
                            <tr className="bg-gray-50">
                                <td className="border border-gray-300 p-2 text-gray-600 font-medium">Total Payment with Taxes & Insurance</td>
                                <td className="border border-gray-300 p-2 text-center font-semibold">{fmt(loan.currentTotal)}</td>
                                <td className="border border-gray-300 p-2 text-center font-bold text-orange-600">{fmt(loan.proposedTotal)}</td>
                            </tr>
                        </tbody>
                    </table>
                    <p className="text-[10px] text-gray-500 mt-2 italic">
                        Your actual rate, payment and costs could be higher. Get an official Loan Estimate before choosing a loan.
                    </p>
                </div>
                
                {/* Your Benefits Section */}
                <div>
                    <h2 className="text-3xl font-bold text-orange-500 text-center mb-4">Your Benefits</h2>
                    
                    {/* Proposed Loan Banner */}
                    <div className="bg-orange-500 text-white text-center py-2 font-bold text-sm tracking-wide mb-4">
                        PROPOSED LOAN
                    </div>
                    
                    {/* Two Charts Side by Side */}
                    <div className="grid grid-cols-2 gap-6">
                        {selectedCharts.slice(0, 2).map((chartId, index) => (
                            <div key={chartId} className="border border-gray-200 rounded-lg overflow-hidden">
                                <div className="bg-gray-100 px-3 py-2 border-b border-gray-200">
                                    <h3 className="font-bold text-sm text-orange-600 uppercase tracking-wide">
                                        {chartTitles[chartId] || chartId}
                                    </h3>
                                </div>
                                <div className="p-4">
                                    {renderMiniChart(chartId, index)}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                
                {/* Footer */}
                <div className="mt-8 pt-4 border-t border-gray-200 flex justify-between items-center text-[10px] text-gray-400">
                    <p>GoodLeap, LLC. 8781 Sierra College Blvd, Roseville CA 95661 NMLS# 30336 goodleap.com</p>
                    <div className="flex items-center gap-4">
                        <span>Confidential</span>
                        <span>Page 1</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Mini Chart Components for Proposal
function PaymentComparisonMini({ data }) {
    const fmt = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n);
    
    const currentMortgage = data.currentMortgagePI || 1250;
    const currentDebts = data.debtsPaidOff || 969;
    const currentOther = data.debtsRemaining || 30;
    const currentTotal = currentMortgage + currentDebts + currentOther;
    
    const proposedPayment = data.proposedPI || 1829;
    const proposedOther = data.debtsRemaining || 30;
    const proposedTotal = proposedPayment + proposedOther + (data.proposedEscrow || 0);
    
    const savings = currentTotal - proposedTotal;
    const annualSavings = savings * 12;
    
    const maxVal = Math.max(currentTotal, proposedTotal);
    const scale = 120 / maxVal;
    
    return (
        <div className="flex items-end justify-around gap-4">
            {/* Current Bar */}
            <div className="flex flex-col items-center">
                <div className="text-xs text-green-600 font-semibold mb-1">{fmt(currentTotal)} Total</div>
                <div className="flex flex-col-reverse w-16 rounded-t overflow-hidden">
                    <div className="bg-blue-600" style={{ height: `${currentMortgage * scale}px` }}>
                        <span className="text-[8px] text-white flex items-center justify-center h-full">{fmt(currentMortgage)}</span>
                    </div>
                    {currentDebts > 0 && (
                        <div className="bg-yellow-500" style={{ height: `${currentDebts * scale}px` }}>
                            <span className="text-[8px] text-white flex items-center justify-center h-full">{fmt(currentDebts)}</span>
                        </div>
                    )}
                    {currentOther > 0 && (
                        <div className="bg-gray-600" style={{ height: `${Math.max(currentOther * scale, 8)}px` }}>
                            <span className="text-[8px] text-white flex items-center justify-center h-full">{fmt(currentOther)}</span>
                        </div>
                    )}
                </div>
                <div className="text-[10px] text-gray-500 mt-1">Current<br/>Mortgage<br/>Payment</div>
            </div>
            
            {/* Proposed Bar */}
            <div className="flex flex-col items-center">
                <div className="text-xs text-orange-600 font-semibold mb-1">{fmt(proposedTotal)}</div>
                <div className="flex flex-col-reverse w-16 rounded-t overflow-hidden">
                    <div className="bg-orange-500" style={{ height: `${proposedPayment * scale}px` }}>
                        <span className="text-[8px] text-white flex items-center justify-center h-full">{fmt(proposedPayment)}</span>
                    </div>
                </div>
                <div className="text-[10px] text-gray-500 mt-1">Your New<br/>Payment</div>
            </div>
            
            {/* Savings Circles */}
            <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 rounded-full bg-orange-500 flex flex-col items-center justify-center text-white">
                    <span className="text-xs font-bold">{fmt(annualSavings)}</span>
                    <span className="text-[8px] uppercase">Annual<br/>Savings</span>
                </div>
                <div className="w-12 h-12 rounded-full border-2 border-gray-300 flex flex-col items-center justify-center">
                    <span className="text-xs font-bold text-gray-700">{fmt(savings)}</span>
                    <span className="text-[7px] text-gray-500 uppercase">Monthly<br/>Savings</span>
                </div>
            </div>
        </div>
    );
}

function DisposableIncomeMini({ data }) {
    const fmt = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n);
    
    const income = data.monthlyIncome || 4500;
    const taxRate = 0.15;
    const incomeAfterTax = income * (1 - taxRate);
    
    const currentMortgage = data.currentMortgagePI || 1250;
    const currentOther = (data.debtsPaidOff || 0) + (data.debtsRemaining || 0);
    const currentDisposable = incomeAfterTax - currentMortgage - currentOther;
    const currentDisposablePct = (currentDisposable / income * 100).toFixed(1);
    
    const proposedMortgage = data.proposedPI || 1829;
    const proposedOther = data.debtsRemaining || 90;
    const proposedDisposable = incomeAfterTax - proposedMortgage - proposedOther;
    const proposedDisposablePct = (proposedDisposable / income * 100).toFixed(1);
    
    const increase = ((proposedDisposable - currentDisposable) / currentDisposable * 100).toFixed(1);
    
    return (
        <div className="text-xs">
            <table className="w-full border-collapse">
                <thead>
                    <tr className="bg-orange-100">
                        <th className="border border-gray-200 p-1.5 text-left text-gray-700"></th>
                        <th className="border border-gray-200 p-1.5 text-center text-gray-600">Current</th>
                        <th className="border border-gray-200 p-1.5 text-center text-gray-600">Proposed</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="border border-gray-200 p-1.5">Monthly Income</td>
                        <td className="border border-gray-200 p-1.5 text-center">{fmt(income)}</td>
                        <td className="border border-gray-200 p-1.5 text-center">{fmt(income)}</td>
                    </tr>
                    <tr className="bg-gray-50">
                        <td className="border border-gray-200 p-1.5">Income After Taxes</td>
                        <td className="border border-gray-200 p-1.5 text-center">{fmt(incomeAfterTax)}</td>
                        <td className="border border-gray-200 p-1.5 text-center">{fmt(incomeAfterTax)}</td>
                    </tr>
                    <tr>
                        <td className="border border-gray-200 p-1.5">Mortgage Payment</td>
                        <td className="border border-gray-200 p-1.5 text-center">{fmt(currentMortgage)}</td>
                        <td className="border border-gray-200 p-1.5 text-center">{fmt(proposedMortgage)}</td>
                    </tr>
                    <tr className="bg-gray-50">
                        <td className="border border-gray-200 p-1.5">Other Monthly Payments</td>
                        <td className="border border-gray-200 p-1.5 text-center">{fmt(currentOther)}</td>
                        <td className="border border-gray-200 p-1.5 text-center">{fmt(proposedOther)}</td>
                    </tr>
                    <tr>
                        <td className="border border-gray-200 p-1.5 font-medium">Disposable Income ($)</td>
                        <td className="border border-gray-200 p-1.5 text-center font-medium">{fmt(currentDisposable)}</td>
                        <td className="border border-gray-200 p-1.5 text-center font-medium">{fmt(proposedDisposable)}</td>
                    </tr>
                    <tr className="bg-gray-50">
                        <td className="border border-gray-200 p-1.5">Disposable Income (%)</td>
                        <td className="border border-gray-200 p-1.5 text-center">{currentDisposablePct}%</td>
                        <td className="border border-gray-200 p-1.5 text-center">{proposedDisposablePct}%</td>
                    </tr>
                </tbody>
            </table>
            <div className="mt-2 bg-teal-500 text-white p-2 rounded flex justify-between items-center">
                <span className="font-medium">Increase in Disposable Income</span>
                <span className="font-bold text-lg">{increase}%</span>
            </div>
        </div>
    );
}

function DebtConsolidationMini({ data }) {
    const fmt = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n);
    
    const accounts = data.accounts || [
        { creditor: 'Chase Visa', balance: 12500, payment: 375 },
        { creditor: 'Capital One', balance: 8200, payment: 246 },
        { creditor: 'Auto Loan', balance: 18500, payment: 425 }
    ];
    
    const totalBalance = accounts.reduce((sum, a) => sum + (a.balance || 0), 0);
    const totalPayment = accounts.reduce((sum, a) => sum + (a.payment || 0), 0);
    
    return (
        <div className="text-xs">
            <table className="w-full border-collapse mb-3">
                <thead>
                    <tr className="bg-orange-100">
                        <th className="border border-gray-200 p-1.5 text-left">Creditor</th>
                        <th className="border border-gray-200 p-1.5 text-right">Balance</th>
                        <th className="border border-gray-200 p-1.5 text-right">Payment</th>
                        <th className="border border-gray-200 p-1.5 text-center">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {accounts.slice(0, 5).map((acc, i) => (
                        <tr key={i} className={i % 2 === 0 ? '' : 'bg-gray-50'}>
                            <td className="border border-gray-200 p-1.5">{acc.creditor}</td>
                            <td className="border border-gray-200 p-1.5 text-right">{fmt(acc.balance || 0)}</td>
                            <td className="border border-gray-200 p-1.5 text-right">{fmt(acc.payment || 0)}</td>
                            <td className="border border-gray-200 p-1.5 text-center">
                                <Check size={14} className="text-green-500 mx-auto" />
                            </td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr className="bg-gray-100 font-semibold">
                        <td className="border border-gray-200 p-1.5">Total</td>
                        <td className="border border-gray-200 p-1.5 text-right">{fmt(totalBalance)}</td>
                        <td className="border border-gray-200 p-1.5 text-right text-orange-600">{fmt(totalPayment)}/mo</td>
                        <td className="border border-gray-200 p-1.5 text-center text-green-600">Paid Off</td>
                    </tr>
                </tfoot>
            </table>
            <div className="bg-teal-50 border border-teal-200 rounded p-2 text-center">
                <p className="text-teal-700 font-medium">Monthly payments eliminated: <span className="font-bold">{fmt(totalPayment)}</span></p>
            </div>
        </div>
    );
}

function CashBackMini({ data }) {
    const fmt = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n);
    const cashout = data.cashout || 25000;
    
    return (
        <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-3 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
                <div className="text-white">
                    <p className="text-2xl font-bold">{fmt(cashout)}</p>
                    <p className="text-[10px] uppercase">Cash Back</p>
                </div>
            </div>
            <p className="text-sm text-gray-600 mb-2">Money in your pocket at closing</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-gray-50 rounded p-2">
                    <p className="text-gray-500">Home Improvements</p>
                    <p className="font-semibold text-gray-700">{fmt(cashout * 0.6)}</p>
                </div>
                <div className="bg-gray-50 rounded p-2">
                    <p className="text-gray-500">Emergency Fund</p>
                    <p className="font-semibold text-gray-700">{fmt(cashout * 0.4)}</p>
                </div>
            </div>
        </div>
    );
}

function CashFlowMini({ data }) {
    const fmt = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n);
    const currentTotal = data.currentTotal || 4156;
    const cashInPocket = currentTotal * 2;
    const newPayment = data.proposedPI || 3447;
    
    return (
        <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-teal-500 flex items-center justify-center">
                <div className="text-white">
                    <p className="text-xl font-bold">{fmt(cashInPocket)}</p>
                    <p className="text-[8px] uppercase">60 Days Free</p>
                </div>
            </div>
            <div className="flex justify-center gap-2 text-xs">
                <div className="bg-teal-50 rounded p-2 w-16 text-center">
                    <p className="text-[10px] text-gray-500">Month 1</p>
                    <p className="font-bold text-teal-600">{fmt(0)}</p>
                </div>
                <div className="bg-teal-50 rounded p-2 w-16 text-center">
                    <p className="text-[10px] text-gray-500">Month 2</p>
                    <p className="font-bold text-teal-600">{fmt(0)}</p>
                </div>
                <div className="bg-gray-100 rounded p-2 w-16 text-center">
                    <p className="text-[10px] text-gray-500">Month 3</p>
                    <p className="font-bold text-gray-700">{fmt(newPayment)}</p>
                </div>
            </div>
        </div>
    );
}

function BreakEvenMini({ data }) {
    const fmt = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n);
    const months = data.breakEvenMonths || 18;
    const costs = data.closingCosts || 8500;
    const savings = data.monthlySavings || 420;
    
    return (
        <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-3 rounded-full border-4 border-amber-500 flex items-center justify-center">
                <div>
                    <p className="text-3xl font-bold text-amber-600">{months}</p>
                    <p className="text-[10px] text-gray-500 uppercase">Months</p>
                </div>
            </div>
            <p className="text-sm font-medium text-gray-700 mb-2">Time to Recoup Costs</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-gray-50 rounded p-2">
                    <p className="text-gray-500">Total Costs</p>
                    <p className="font-semibold text-gray-700">{fmt(costs)}</p>
                </div>
                <div className="bg-gray-50 rounded p-2">
                    <p className="text-gray-500">Monthly Savings</p>
                    <p className="font-semibold text-teal-600">{fmt(savings)}</p>
                </div>
            </div>
        </div>
    );
}

function AcceleratedPayoffMini({ data }) {
    const savings = data.monthlySavings || 420;
    const yearsSaved = Math.floor(savings * 12 * 30 / 100000);
    const interestSaved = savings * 12 * 15;
    const fmt = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n);
    
    return (
        <div className="text-center">
            <div className="flex justify-center gap-4 mb-3">
                <div className="w-16 h-16 rounded-full bg-purple-500 flex items-center justify-center">
                    <div className="text-white text-center">
                        <p className="text-lg font-bold">{yearsSaved}+</p>
                        <p className="text-[8px] uppercase">Years<br/>Saved</p>
                    </div>
                </div>
                <div className="w-16 h-16 rounded-full border-2 border-purple-300 flex items-center justify-center">
                    <div className="text-center">
                        <p className="text-sm font-bold text-purple-600">{fmt(interestSaved)}</p>
                        <p className="text-[7px] text-gray-500 uppercase">Interest<br/>Saved</p>
                    </div>
                </div>
            </div>
            <p className="text-xs text-gray-600">
                Apply <span className="font-semibold text-purple-600">{fmt(savings)}/mo</span> extra to principal
            </p>
        </div>
    );
}

function CompoundGrowthMini({ data }) {
    const savings = data.monthlySavings || 420;
    const rate = 0.07;
    const years = [5, 10, 20, 30];
    const fmt = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n);
    
    const calculateFV = (pmt, r, n) => {
        const monthlyRate = r / 12;
        const months = n * 12;
        return pmt * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
    };
    
    return (
        <div>
            <p className="text-xs text-gray-600 text-center mb-2">
                Invest <span className="font-semibold text-teal-600">{fmt(savings)}/mo</span> at 7% return
            </p>
            <div className="grid grid-cols-4 gap-1 text-xs">
                {years.map(y => (
                    <div key={y} className="bg-gradient-to-b from-teal-50 to-teal-100 rounded p-2 text-center">
                        <p className="text-gray-500 text-[10px]">{y} Years</p>
                        <p className="font-bold text-teal-700">{fmt(calculateFV(savings, rate, y))}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ProposalDocument;

