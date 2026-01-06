import React from 'react';
import { Phone, Mail, Download, Printer, Check, TrendingUp, Calendar, DollarSign, Home, Clock, CreditCard } from 'lucide-react';

export function ProposalPreview({ data }) {
    const selectedCharts = data?.selectedCharts || [];
    const chartData = data?.chartData || {};
    
    const fmt = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n || 0);
    
    // Extract loan data from chartData
    const currentPI = chartData.currentMortgagePI || 1710;
    const currentEscrow = chartData.currentEscrow || 570;
    const currentTotal = chartData.currentTotal || 4572;
    const proposedPI = chartData.proposedPI || 3447;
    const proposedEscrow = chartData.proposedEscrow || 570;
    const proposedMI = chartData.proposedMI || 0;
    const proposedTotal = chartData.proposedTotal || 4171;
    const rate = chartData.rate || 6.875;
    const savings = chartData.monthlySavings || 401;
    const annualSavings = chartData.annualSavings || 4812;
    
    const chartTitles = {
        'payment-savings': 'Current vs. New Payments',
        'debt-consolidation': 'Debt Consolidation Summary',
        'cash-back': 'Cash Back at Closing',
        'cash-flow-window': 'Cash Flow Window',
        'break-even': 'Break-Even Analysis',
        'accelerated-payoff': 'Accelerated Payoff',
        'compound-growth': 'Investment Growth Potential',
        'disposable-income': 'Estimated Disposable Income'
    };

    return (
        <div className="h-full flex flex-col bg-stone-100">
            {/* Header with Actions */}
            <div className="bg-white border-b border-stone-200 px-4 py-3 flex-shrink-0 flex items-center justify-between">
                <h2 className="font-semibold text-stone-800">Loan Proposal Preview</h2>
                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-stone-100 hover:bg-stone-200 rounded-lg text-stone-600 transition-colors">
                        <Printer size={14} /> Print
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-amber-500 hover:bg-amber-600 rounded-lg text-white transition-colors">
                        <Download size={14} /> Download PDF
                    </button>
                </div>
            </div>

            {/* Proposal Document */}
            <div className="flex-1 overflow-y-auto p-6">
                <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
                    
                    {/* GoodLeap Header */}
                    <div className="bg-white p-6 border-b border-stone-100">
                        <div className="flex items-center justify-center">
                            <span className="text-3xl font-bold tracking-tight">
                                g<span className="text-orange-500">oo</span>dleap
                            </span>
                        </div>
                    </div>

                    {/* Borrower & LO Info */}
                    <div className="grid grid-cols-2 gap-6 p-5 bg-stone-50 text-sm">
                        <div>
                            <p className="font-bold text-orange-500 uppercase text-xs tracking-wide mb-2">Loan Proposal For</p>
                            <p className="font-semibold text-stone-800">Ken Customer</p>
                            <p className="text-stone-600">1111 Test St</p>
                            <p className="text-stone-600">North Las Vegas, NV</p>
                            <p className="text-stone-600">89033</p>
                        </div>
                        <div className="text-right">
                            <p className="font-bold text-orange-500 uppercase text-xs tracking-wide mb-2">Provided By</p>
                            <p className="font-semibold text-stone-800">Test QA LO</p>
                            <p className="text-stone-600">Mortgage Specialist</p>
                            <p className="text-stone-600 flex items-center justify-end gap-1">
                                <Phone size={12} /> 949-555-5555
                            </p>
                            <p className="text-stone-600 flex items-center justify-end gap-1">
                                <Mail size={12} /> qa@goodleap.com
                            </p>
                            <p className="text-stone-500 text-xs">NMLS# 123456</p>
                        </div>
                    </div>

                    {/* Loan Proposal Table */}
                    <div className="p-5">
                        <div className="bg-stone-700 text-white text-center py-2.5 font-bold text-sm tracking-wide rounded-t-lg">
                            LOAN PROPOSAL
                        </div>
                        <table className="w-full text-sm border border-stone-200">
                            <thead>
                                <tr className="bg-stone-100">
                                    <th className="border-b border-stone-200 p-2.5 text-left text-stone-600"></th>
                                    <th className="border-b border-stone-200 p-2.5 text-center text-stone-600 font-semibold">Current</th>
                                    <th className="border-b border-stone-200 p-2.5 text-center text-orange-500 font-semibold">Proposed Loan</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="border-b border-stone-100 p-2.5 text-stone-600">Loan Program/Term</td>
                                    <td className="border-b border-stone-100 p-2.5 text-center text-stone-800">30 Year Fixed</td>
                                    <td className="border-b border-stone-100 p-2.5 text-center text-stone-800 font-medium">30 Year Fixed</td>
                                </tr>
                                <tr className="bg-stone-50">
                                    <td className="border-b border-stone-100 p-2.5 text-stone-600">Interest Rate</td>
                                    <td className="border-b border-stone-100 p-2.5 text-center text-stone-800">3.75%</td>
                                    <td className="border-b border-stone-100 p-2.5 text-center text-stone-800 font-medium">{rate.toFixed(3)}%</td>
                                </tr>
                                <tr>
                                    <td className="border-b border-stone-100 p-2.5 text-stone-600">APR</td>
                                    <td className="border-b border-stone-100 p-2.5 text-center text-stone-800">—</td>
                                    <td className="border-b border-stone-100 p-2.5 text-center text-stone-800 font-medium">{(rate + 0.25).toFixed(3)}%</td>
                                </tr>
                                <tr className="bg-stone-50">
                                    <td className="border-b border-stone-100 p-2.5 text-stone-600">Principal & Interest</td>
                                    <td className="border-b border-stone-100 p-2.5 text-center text-stone-800">{fmt(currentPI)}</td>
                                    <td className="border-b border-stone-100 p-2.5 text-center text-stone-800 font-medium">{fmt(proposedPI)}</td>
                                </tr>
                                <tr>
                                    <td className="border-b border-stone-100 p-2.5 text-stone-600">Mortgage Insurance</td>
                                    <td className="border-b border-stone-100 p-2.5 text-center text-stone-800">$0</td>
                                    <td className="border-b border-stone-100 p-2.5 text-center text-stone-800 font-medium">{fmt(proposedMI)}</td>
                                </tr>
                                <tr className="bg-stone-100">
                                    <td className="p-2.5 text-stone-700 font-medium">Total Payment w/ Taxes & Insurance</td>
                                    <td className="p-2.5 text-center text-stone-800 font-semibold">{fmt(currentTotal)}</td>
                                    <td className="p-2.5 text-center text-orange-600 font-bold">{fmt(proposedTotal)}</td>
                                </tr>
                            </tbody>
                        </table>
                        <p className="text-[10px] text-stone-400 mt-2 italic">
                            Your actual rate, payment, and costs could be higher. Get an official Loan Estimate before choosing a loan.
                        </p>
                    </div>

                    {/* Your Benefits Section */}
                    <div className="p-5">
                        <h2 className="text-2xl font-bold text-orange-500 text-center mb-4">Your Benefits</h2>
                        
                        <div className="bg-orange-500 text-white text-center py-2 font-bold text-sm tracking-wide rounded-t-lg">
                            PROPOSED LOAN
                        </div>
                        
                        {/* Two Charts Side by Side */}
                        <div className="grid grid-cols-2 gap-4 p-4 bg-orange-50 border border-orange-200 border-t-0 rounded-b-lg">
                            {selectedCharts.length === 0 ? (
                                <div className="col-span-2 text-center py-8 text-stone-400">
                                    <p>No charts selected</p>
                                    <p className="text-sm">Select up to 2 charts from Value Propositions</p>
                                </div>
                            ) : (
                                selectedCharts.slice(0, 2).map((chartId) => (
                                    <div key={chartId} className="bg-white rounded-lg border border-stone-200 overflow-hidden">
                                        <div className="bg-stone-100 px-3 py-2 border-b border-stone-200">
                                            <h3 className="font-bold text-xs text-orange-600 uppercase tracking-wide">
                                                {chartTitles[chartId] || chartId}
                                            </h3>
                                        </div>
                                        <div className="p-3">
                                            <MiniChart chartId={chartId} data={chartData} />
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="p-4 bg-stone-50 border-t border-stone-200 flex justify-between items-center text-[10px] text-stone-400">
                        <p>GoodLeap, LLC. 8781 Sierra College Blvd, Roseville CA 95661 NMLS# 30336 goodleap.com</p>
                        <span>Confidential</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Mini chart renderer
function MiniChart({ chartId, data }) {
    const fmt = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n || 0);
    
    switch (chartId) {
        case 'payment-savings':
            return <PaymentSavingsMini data={data} fmt={fmt} />;
        case 'debt-consolidation':
            return <DebtConsolidationMini data={data} fmt={fmt} />;
        case 'cash-back':
            return <CashBackMini data={data} fmt={fmt} />;
        case 'cash-flow-window':
            return <CashFlowMini data={data} fmt={fmt} />;
        case 'break-even':
            return <BreakEvenMini data={data} fmt={fmt} />;
        case 'accelerated-payoff':
            return <AcceleratedPayoffMini data={data} fmt={fmt} />;
        case 'compound-growth':
            return <CompoundGrowthMini data={data} fmt={fmt} />;
        default:
            return <div className="text-center text-stone-400 py-4">Chart: {chartId}</div>;
    }
}

function PaymentSavingsMini({ data, fmt }) {
    const currentTotal = data.currentTotal || 4572;
    const proposedTotal = data.proposedTotal || 4171;
    const savings = data.monthlySavings || 401;
    const annualSavings = (data.annualSavings || savings * 12);
    
    const maxVal = Math.max(currentTotal, proposedTotal);
    const currentHeight = (currentTotal / maxVal) * 80;
    const proposedHeight = (proposedTotal / maxVal) * 80;
    
    return (
        <div className="flex items-end justify-around gap-2">
            <div className="flex flex-col items-center">
                <div className="text-[10px] text-stone-500 mb-1">{fmt(currentTotal)}</div>
                <div className="w-12 bg-stone-600 rounded-t" style={{ height: `${currentHeight}px` }}></div>
                <div className="text-[10px] text-stone-500 mt-1">Current</div>
            </div>
            <div className="flex flex-col items-center">
                <div className="text-[10px] text-orange-600 font-medium mb-1">{fmt(proposedTotal)}</div>
                <div className="w-12 bg-orange-500 rounded-t" style={{ height: `${proposedHeight}px` }}></div>
                <div className="text-[10px] text-stone-500 mt-1">Proposed</div>
            </div>
            <div className="flex flex-col items-center gap-1">
                <div className="w-14 h-14 rounded-full bg-orange-500 flex flex-col items-center justify-center text-white">
                    <span className="text-xs font-bold">{fmt(annualSavings)}</span>
                    <span className="text-[7px] uppercase">Annual</span>
                </div>
                <div className="w-10 h-10 rounded-full border-2 border-stone-300 flex flex-col items-center justify-center">
                    <span className="text-[10px] font-bold text-stone-700">{fmt(savings)}</span>
                    <span className="text-[6px] text-stone-500 uppercase">Monthly</span>
                </div>
            </div>
        </div>
    );
}

function DebtConsolidationMini({ data, fmt }) {
    const accounts = data.accounts || [];
    const totalPayment = accounts.reduce((sum, a) => sum + (parseFloat(String(a.payment).replace(/[$,]/g, '')) || 0), 0);
    const totalBalance = accounts.reduce((sum, a) => sum + (parseFloat(String(a.balance).replace(/[$,]/g, '')) || 0), 0);
    
    return (
        <div className="text-[10px]">
            <div className="space-y-1 mb-2 max-h-20 overflow-y-auto">
                {accounts.slice(0, 4).map((acc, i) => (
                    <div key={i} className="flex justify-between items-center">
                        <span className="text-stone-600 truncate flex-1">{acc.creditor}</span>
                        <Check size={10} className="text-green-500 mx-1" />
                        <span className="text-stone-800 font-medium">{fmt(parseFloat(String(acc.payment).replace(/[$,]/g, '')) || 0)}</span>
                    </div>
                ))}
                {accounts.length > 4 && <div className="text-stone-400 text-center">+{accounts.length - 4} more</div>}
            </div>
            <div className="bg-teal-500 text-white p-2 rounded text-center">
                <span className="font-medium">Eliminated: </span>
                <span className="font-bold">{fmt(totalPayment)}/mo</span>
            </div>
        </div>
    );
}

function CashBackMini({ data, fmt }) {
    const cashout = data.cashout || 0;
    return (
        <div className="text-center py-2">
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow">
                <div className="text-white">
                    <p className="text-lg font-bold">{fmt(cashout)}</p>
                </div>
            </div>
            <p className="text-[10px] text-stone-500 mt-2">Cash at closing</p>
        </div>
    );
}

function CashFlowMini({ data, fmt }) {
    const currentTotal = data.currentTotal || 4156;
    const cashInPocket = currentTotal * 2;
    return (
        <div className="text-center py-2">
            <div className="w-16 h-16 mx-auto rounded-full bg-teal-500 flex items-center justify-center">
                <div className="text-white">
                    <p className="text-lg font-bold">{fmt(cashInPocket)}</p>
                </div>
            </div>
            <p className="text-[10px] text-stone-500 mt-2">60 days payment-free</p>
        </div>
    );
}

function BreakEvenMini({ data, fmt }) {
    const months = data.breakEvenMonths || 18;
    const costs = data.closingCosts || 8500;
    return (
        <div className="text-center py-2">
            <div className="w-16 h-16 mx-auto rounded-full border-3 border-amber-500 flex items-center justify-center">
                <div>
                    <p className="text-2xl font-bold text-amber-600">{months}</p>
                    <p className="text-[8px] text-stone-500">months</p>
                </div>
            </div>
            <p className="text-[10px] text-stone-500 mt-2">To recoup {fmt(costs)}</p>
        </div>
    );
}

function AcceleratedPayoffMini({ data, fmt }) {
    const savings = data.monthlySavings || 401;
    const yearsSaved = Math.max(1, Math.floor(savings / 50));
    return (
        <div className="text-center py-2">
            <div className="w-16 h-16 mx-auto rounded-full bg-purple-500 flex items-center justify-center">
                <div className="text-white">
                    <p className="text-xl font-bold">{yearsSaved}+</p>
                    <p className="text-[8px]">years saved</p>
                </div>
            </div>
            <p className="text-[10px] text-stone-500 mt-2">{fmt(savings)}/mo extra principal</p>
        </div>
    );
}

function CompoundGrowthMini({ data, fmt }) {
    const savings = data.monthlySavings || 401;
    const rate = 0.07;
    const fv10 = savings * ((Math.pow(1 + rate/12, 120) - 1) / (rate/12));
    const fv30 = savings * ((Math.pow(1 + rate/12, 360) - 1) / (rate/12));
    
    return (
        <div className="text-center py-2">
            <div className="flex justify-center gap-2">
                <div className="bg-teal-50 rounded p-2">
                    <p className="text-[10px] text-stone-500">10 Years</p>
                    <p className="text-sm font-bold text-teal-700">{fmt(fv10)}</p>
                </div>
                <div className="bg-teal-100 rounded p-2">
                    <p className="text-[10px] text-stone-500">30 Years</p>
                    <p className="text-sm font-bold text-teal-700">{fmt(fv30)}</p>
                </div>
            </div>
            <p className="text-[10px] text-stone-500 mt-2">{fmt(savings)}/mo @ 7%</p>
        </div>
    );
}

export default ProposalPreview;
