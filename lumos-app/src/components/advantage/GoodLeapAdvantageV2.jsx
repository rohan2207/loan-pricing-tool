import React, { useState, useMemo } from 'react';
import { cn } from '../../lib/utils';
import { 
    ChevronDown, 
    Plus, 
    FileText, 
    Clock, 
    TrendingUp, 
    Wallet, 
    Sun, 
    FileCheck,
    RefreshCw,
    Sparkles,
    Check,
    Search,
    ExternalLink
} from 'lucide-react';

export function GoodLeapAdvantageV2({ accounts, onOpenFlyover }) {
    // Pricing state
    const [ratesSearched, setRatesSearched] = useState(false);
    const [isSearching, setIsSearching] = useState(false);

    // Debt selection state
    const [selectedDebts, setSelectedDebts] = useState(
        accounts.filter(a => a.willPay).map(a => a.id)
    );
    
    // Pricing configuration
    const [program, setProgram] = useState('Conventional');
    const [term, setTerm] = useState(30);
    const [ltv, setLtv] = useState(80);
    const [loanAmount, setLoanAmount] = useState(525314);
    const [interestRate, setInterestRate] = useState(6.5);
    
    // Proposal selections
    const [proposalSelections, setProposalSelections] = useState({
        'debt-consolidation': true,
        'payment-savings': true,
        'recoup-costs': false,
        'compound-interest': false,
        'disposable-income': false,
        'cash-flow': false,
    });
    
    // Calculate totals from selected debts
    const debtTotals = useMemo(() => {
        const selected = accounts.filter(a => selectedDebts.includes(a.id));
        const totalBalance = selected.reduce((sum, a) => sum + (parseFloat(a.balance.replace(/[$,]/g, '')) || 0), 0);
        const totalPayment = selected.reduce((sum, a) => sum + (parseFloat(a.payment.replace(/[$,]/g, '')) || 0), 0);
        return { totalBalance, totalPayment, count: selected.length };
    }, [accounts, selectedDebts]);

    const toggleDebt = (id) => setSelectedDebts(prev => prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]);
    const toggleProposalSelection = (id) => setProposalSelections(prev => ({ ...prev, [id]: !prev[id] }));

    // Present mortgage values
    const presentMortgage = 1710;
    const presentTaxes = 1015;
    const presentInsurance = 0;
    const presentDiscount = 0;
    const presentMI = 0;
    const presentTotal = presentMortgage + presentTaxes + presentInsurance + presentDiscount + presentMI;

    // Proposed mortgage calculations
    const proposedMortgage = 0; // They're paying off the mortgage
    const proposedDebts = loanAmount;
    const debtPayoffTotal = debtTotals.totalBalance;
    const remainingDebt = loanAmount - debtTotals.totalBalance;
    const proposedPI = Math.round((loanAmount * (interestRate/100/12)) / (1 - Math.pow(1 + interestRate/100/12, -term*12)));
    const proposedTotal = presentTaxes; // Just taxes since mortgage is rolled into new loan

    const monthlySavings = presentTotal + debtTotals.totalPayment - proposedPI - presentTaxes;

    const programs = ['Conventional', 'FHA', 'VA', 'FHA Streamline', 'VA IRRRL'];
    const terms = [30, 20, 15, 10];

    const handleSearchRates = () => {
        setIsSearching(true);
        setTimeout(() => {
            setIsSearching(false);
            setRatesSearched(true);
        }, 1500);
    };

    const handleViewChart = (chartType) => onOpenFlyover?.(`ChartPreview:${chartType}`);
    const handleGenerateProposal = () => onOpenFlyover?.('ProposalPreview');

    const selectedCount = Object.values(proposalSelections).filter(Boolean).length;

    return (
        <div className="h-full flex flex-col bg-[#f8f9fb]">
            {/* Header */}
            <div className="bg-white border-b border-neutral-l3 px-6 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Sparkles className="text-alternativePrimary" size={20} />
                    <span className="font-semibold text-neutral-d3">GoodLeap Advantage V2</span>
                    {ratesSearched && <span className="text-xs bg-success-l3 text-success-d2 px-2 py-0.5 rounded-full">Rates Found</span>}
                </div>
                <button 
                    onClick={handleGenerateProposal}
                    disabled={!ratesSearched}
                    className={cn(
                        "px-5 py-2 text-sm font-medium rounded-lg transition-all",
                        ratesSearched 
                            ? "text-white bg-alternativePrimary hover:bg-alternativePrimary-d2" 
                            : "text-neutral-l1 bg-neutral-l4 cursor-not-allowed"
                    )}
                >
                    Generate Proposal ({selectedCount})
                </button>
            </div>

            {/* Main Content */}
            <div className="flex-1 px-6 pb-6 pt-4 flex gap-4 overflow-hidden">
                {/* Left: Liabilities */}
                <div className="w-72 flex-shrink-0 bg-white rounded-xl shadow-sm border border-neutral-l3 flex flex-col">
                    <div className="p-4 border-b border-neutral-l3">
                        <h3 className="font-semibold text-neutral-d3">Liabilities</h3>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4">
                        <div className="space-y-2">
                            {accounts.slice(0, 6).map((account) => (
                                <label key={account.id} className={cn(
                                    "flex items-center gap-3 p-2.5 rounded-lg cursor-pointer border text-sm",
                                    selectedDebts.includes(account.id) ? "bg-alternativePrimary-l4/50 border-alternativePrimary-l1" : "hover:bg-neutral-l5 border-transparent"
                                )}>
                                    <input type="checkbox" checked={selectedDebts.includes(account.id)} onChange={() => toggleDebt(account.id)} className="h-4 w-4 rounded text-alternativePrimary" />
                                    <span className="flex-1 truncate font-medium">{account.creditor}</span>
                                    <span className="font-semibold">${parseFloat(account.payment.replace(/[$,]/g, '')).toLocaleString()}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    <div className="p-4 border-t border-neutral-l3 bg-neutral-l5">
                        <div className="flex justify-between">
                            <span>Total</span>
                            <span className="font-bold">${debtTotals.totalPayment.toLocaleString()}/mo</span>
                        </div>
                    </div>
                </div>

                {/* Center: Config + Present/Proposed */}
                <div className="flex-1 flex flex-col gap-4 overflow-y-auto">
                    {/* Configuration */}
                    <div className="bg-white rounded-xl shadow-sm border border-neutral-l3 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-neutral-d3">Configuration</h3>
                            <button
                                onClick={handleSearchRates}
                                disabled={isSearching}
                                className={cn(
                                    "flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm transition-all",
                                    isSearching 
                                        ? "bg-neutral-l3 text-neutral-d1"
                                        : "bg-success text-white hover:bg-success-d2 shadow-md"
                                )}
                            >
                                {isSearching ? (
                                    <><RefreshCw size={16} className="animate-spin" /> Searching...</>
                                ) : (
                                    <><Search size={16} /> Search Rates</>
                                )}
                            </button>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs text-neutral-l1 uppercase mb-2 block">Program</label>
                                <div className="flex flex-wrap gap-2">
                                    {programs.map((p) => (
                                        <button key={p} onClick={() => setProgram(p)} className={cn(
                                            "px-3 py-1.5 text-sm rounded-lg border",
                                            program === p ? "bg-alternativePrimary text-white border-alternativePrimary" : "border-neutral-l3 hover:border-alternativePrimary"
                                        )}>{p}</button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="text-xs text-neutral-l1 uppercase mb-2 block">Term</label>
                                <div className="flex gap-2">
                                    {terms.map((t) => (
                                        <button key={t} onClick={() => setTerm(t)} className={cn(
                                            "px-3 py-1.5 text-sm rounded-lg border",
                                            term === t ? "bg-alternativePrimary text-white border-alternativePrimary" : "border-neutral-l3 hover:border-alternativePrimary"
                                        )}>{t}yr</button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* LTV Slider */}
                        <div className="mt-4">
                            <div className="flex items-center justify-between mb-2">
                                <label className="text-xs text-neutral-l1 uppercase">LTV</label>
                                <span className="text-lg font-bold text-alternativePrimary">✏️ {ltv}%</span>
                            </div>
                            <div className="relative">
                                <div className="h-2 rounded-full bg-gradient-to-r from-success via-warning to-danger" />
                                <input
                                    type="range"
                                    min="50"
                                    max="100"
                                    value={ltv}
                                    onChange={(e) => setLtv(parseInt(e.target.value))}
                                    className="absolute inset-0 w-full h-2 opacity-0 cursor-pointer"
                                />
                                <div 
                                    className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-alternativePrimary rounded-full border-2 border-white shadow-lg pointer-events-none"
                                    style={{ left: `${((ltv - 50) / 50) * 100}%`, transform: 'translate(-50%, -50%)' }}
                                />
                            </div>
                            <div className="flex justify-between text-xs text-neutral-l1 mt-1">
                                <span>50</span><span>65</span><span>80</span><span>80</span><span>85</span><span>90</span><span>95</span><span>100</span>
                            </div>
                        </div>

                        {/* Loan Breakdown */}
                        <div className="grid grid-cols-4 gap-4 mt-4">
                            <div>
                                <label className="text-xs text-neutral-l1 uppercase mb-1 block">Loan Amount</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-l1">$</span>
                                    <input type="text" value={loanAmount.toLocaleString()} onChange={(e) => setLoanAmount(parseInt(e.target.value.replace(/[$,]/g, '')) || 0)} className="w-full pl-7 pr-3 py-2 border border-neutral-l3 rounded-lg" />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs text-neutral-l1 uppercase mb-1 block">Debts</label>
                                <div className="py-2 px-3 bg-neutral-l5 border border-neutral-l3 rounded-lg text-neutral-d3 font-medium">
                                    ${debtTotals.totalBalance.toLocaleString()}
                                </div>
                            </div>
                            <div>
                                <label className="text-xs text-neutral-l1 uppercase mb-1 block">Cashout</label>
                                <div className="py-2 px-3 bg-neutral-l5 border border-neutral-l3 rounded-lg text-neutral-l1">
                                    {loanAmount > debtTotals.totalBalance ? `$${(loanAmount - debtTotals.totalBalance).toLocaleString()}` : 'none'}
                                </div>
                            </div>
                            <div>
                                <label className="text-xs text-neutral-l1 uppercase mb-1 block">Interest Rate</label>
                                <select 
                                    value={interestRate}
                                    onChange={(e) => setInterestRate(parseFloat(e.target.value))}
                                    className="w-full py-2 px-3 border border-neutral-l3 rounded-lg bg-white"
                                >
                                    <option value="">Search for...</option>
                                    <option value="6.25">6.250%</option>
                                    <option value="6.375">6.375%</option>
                                    <option value="6.5">6.500%</option>
                                    <option value="6.625">6.625%</option>
                                    <option value="6.75">6.750%</option>
                                    <option value="6.875">6.875%</option>
                                    <option value="7.0">7.000%</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Present vs Proposed Mortgage */}
                    <div className="grid grid-cols-2 gap-4 flex-1">
                        {/* Present Mortgage */}
                        <div className="bg-white rounded-xl shadow-sm border border-neutral-l3 p-5">
                            <h4 className="font-bold text-neutral-d3 uppercase tracking-wide mb-4">Present Mortgage</h4>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-neutral-d1">Mortgage</span>
                                    <span className="font-medium">${presentMortgage.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-neutral-d1">Taxes</span>
                                    <span className="font-medium">${presentTaxes.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-neutral-d1">Insurance</span>
                                    <span className="font-medium">${presentInsurance.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-neutral-d1">Discount</span>
                                    <span className="font-medium">${presentDiscount.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-neutral-d1">Mortgage Insurance</span>
                                    <span className="font-medium">${presentMI.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between pt-3 border-t border-neutral-l3">
                                    <span className="font-bold text-neutral-d3">Current Payment</span>
                                    <span className="font-bold text-neutral-d3">${presentTotal.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        {/* Proposed Mortgage */}
                        <div className={cn(
                            "rounded-xl shadow-sm p-5 transition-all",
                            ratesSearched 
                                ? "bg-white border-2 border-alternativePrimary" 
                                : "bg-neutral-l5 border border-neutral-l3"
                        )}>
                            <h4 className={cn(
                                "font-bold uppercase tracking-wide mb-4",
                                ratesSearched ? "text-alternativePrimary" : "text-neutral-l1"
                            )}>
                                Proposed Mortgage
                            </h4>
                            
                            {ratesSearched ? (
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-neutral-d1">Mortgage</span>
                                        <span className="font-medium">${proposedMortgage.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-neutral-d1">Debts</span>
                                        <span className="font-medium">${proposedDebts.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-neutral-d1">Debt Payoff Total</span>
                                        <span className="font-medium">${debtPayoffTotal.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-neutral-d1">Remaining Debt</span>
                                        <span className="font-medium">${remainingDebt > 0 ? remainingDebt.toLocaleString() : '0'}</span>
                                    </div>
                                    <div className="flex justify-between pt-3 border-t border-neutral-l3">
                                        <span className="font-bold text-neutral-d3">New Payment</span>
                                        <span className="font-bold text-alternativePrimary">${proposedPI.toLocaleString()}</span>
                                    </div>
                                    
                                    {monthlySavings > 0 && (
                                        <div className="mt-3 p-3 bg-success-l3 rounded-lg text-center">
                                            <p className="text-sm text-success-d2">Monthly Savings</p>
                                            <p className="text-2xl font-bold text-success-d2">${monthlySavings.toLocaleString()}</p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-48 text-center">
                                    <Search size={32} className="text-neutral-l2 mb-3" />
                                    <p className="text-neutral-l1 text-sm">Click "Search Rates" to see<br/>your proposed mortgage</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right: Value Propositions */}
                <div className={cn(
                    "w-80 flex-shrink-0 bg-white rounded-xl shadow-sm border flex flex-col transition-all",
                    ratesSearched ? "border-neutral-l3" : "border-neutral-l3 opacity-50"
                )}>
                    <div className="p-4 border-b border-neutral-l3">
                        <h3 className="font-semibold text-neutral-d3">Value Propositions</h3>
                        <p className="text-xs text-neutral-l1">
                            {ratesSearched ? "Select stories for your proposal" : "Search rates to unlock"}
                        </p>
                    </div>
                    <div className={cn("flex-1 overflow-y-auto", !ratesSearched && "pointer-events-none")}>
                        {[
                            { id: 'debt-consolidation', icon: <Plus size={16} />, title: 'Debt Consolidation', desc: `${selectedDebts.length} accounts` },
                            { id: 'payment-savings', icon: <FileCheck size={16} />, title: 'Payment Savings', desc: `$${monthlySavings > 0 ? monthlySavings.toLocaleString() : '—'}/mo` },
                            { id: 'recoup-costs', icon: <Clock size={16} />, title: 'Break-Even Analysis', desc: 'Time to recoup' },
                            { id: 'compound-interest', icon: <TrendingUp size={16} />, title: 'Investment Potential', desc: 'Reinvest savings' },
                            { id: 'disposable-income', icon: <Wallet size={16} />, title: 'Disposable Income', desc: 'Cash flow increase' },
                            { id: 'cash-flow', icon: <Sun size={16} />, title: 'Cash Flow Window', desc: 'Payment-free period' },
                        ].map((item) => (
                            <div key={item.id} className="border-b border-neutral-l3 flex items-center gap-2 p-3">
                                <button onClick={() => toggleProposalSelection(item.id)} className={cn(
                                    "w-5 h-5 rounded border-2 flex items-center justify-center",
                                    proposalSelections[item.id] ? "bg-alternativePrimary border-alternativePrimary" : "border-neutral-l2"
                                )}>
                                    {proposalSelections[item.id] && <Check size={12} className="text-white" />}
                                </button>
                                <div className="flex-1">
                                    <p className="font-medium text-sm">{item.title}</p>
                                    <p className="text-xs text-neutral-l1">{item.desc}</p>
                                </div>
                                <button onClick={() => handleViewChart(item.id)} disabled={!ratesSearched} className="p-1.5 text-alternativePrimary hover:bg-alternativePrimary-l4 rounded">
                                    <ExternalLink size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
