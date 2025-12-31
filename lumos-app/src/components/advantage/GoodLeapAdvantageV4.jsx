import React, { useState, useMemo } from 'react';
import { cn } from '../../lib/utils';
import { ProposalBuilder } from './ProposalBuilder';
import { CalculatorTabs } from './CalculatorTabs';
import { 
    ChevronDown, 
    Plus, 
    TrendingUp, 
    CreditCard,
    RefreshCw,
    Check,
    Play,
    AlertCircle,
    CheckCircle2,
    DollarSign,
    Shield,
    PiggyBank,
    BarChart3
} from 'lucide-react';

export function GoodLeapAdvantageV4({ accounts, onOpenFlyover }) {
    // Screen state
    const [isPriced, setIsPriced] = useState(false);
    const [isRunningPricing, setIsRunningPricing] = useState(false);
    const [configCollapsed, setConfigCollapsed] = useState(false);
    
    // Debt selections
    const [selectedDebts, setSelectedDebts] = useState(
        accounts.filter(a => a.willPay).map(a => a.id)
    );
    
    // Loan configuration
    const [loanType, setLoanType] = useState('Refinance');
    const [program, setProgram] = useState('Conventional');
    const [term, setTerm] = useState(30);
    const [cashToBorrower, setCashToBorrower] = useState(10000);
    
    // Current loan inputs
    const [currentPI, setCurrentPI] = useState(1247);
    const [currentTaxes, setCurrentTaxes] = useState(350);
    const [currentInsurance, setCurrentInsurance] = useState(125);
    const [currentMI, setCurrentMI] = useState(89);
    const [creditScore, setCreditScore] = useState(680);
    const [currentRate, setCurrentRate] = useState(3.75);
    
    // Proposed loan inputs
    const [proposedRate, setProposedRate] = useState(7.125);
    const [proposedTaxes, setProposedTaxes] = useState(350);
    const [proposedInsurance, setProposedInsurance] = useState(125);
    const [proposedMI, setProposedMI] = useState(0);
    const [propertyValue, setPropertyValue] = useState(425000);
    const [currentBalance, setCurrentBalance] = useState(250000);
    
    // Proposal configuration (for ProposalBuilder)
    const [chart1, setChart1] = useState('');
    const [chart2, setChart2] = useState('');
    const [includeOption2, setIncludeOption2] = useState(false);
    const [includeDebtWorksheet, setIncludeDebtWorksheet] = useState(true);
    const [spanishVersion, setSpanishVersion] = useState(false);
    
    // Calculator data state (for CalculatorTabs)
    const [calculatorData, setCalculatorData] = useState({
        loanProposal: {
            current: {
                program: 'Fixed',
                loanType: 'Conventional',
                loanAmount: 250000,
                term: 30,
                paymentDate: '01/01/2012',
                yearsRemaining: 19.34,
                rate: 3.75,
                apr: 7.453,
                ltv: 70,
                dti: 19.701,
            },
            option1: {
                program: 'FNMA CONF 30YR I',
                loanType: 'Conventional',
                loanAmount: 210000,
                term: 30,
                paymentDate: '11/01/2024',
                yearsRemaining: 30,
                rate: 7.125,
                apr: 7.453,
                ltv: 70,
                dti: 0,
            },
            option2: {
                program: '',
                loanType: '',
                loanAmount: 210000,
                term: 30,
                paymentDate: '11/01/2024',
                yearsRemaining: 30,
                rate: 7.125,
                apr: 7.453,
                ltv: 70,
                dti: 0,
            },
        },
        compoundInterest: {
            initialInvestment: 12481.59,
            monthlyInvestment: 414.81,
            rateOfReturn: 0,
            yearsInvested: 30,
        },
        disposableIncome: {
            monthlyIncome: 4500,
            incomeAfterTaxes: 3825,
            mortgagePayment: 1250,
            otherPayments: 1089,
        }
    });

    // Derived calculations
    const debtTotals = useMemo(() => {
        const selected = accounts.filter(a => selectedDebts.includes(a.id));
        const totalBalance = selected.reduce((sum, a) => sum + (parseFloat(a.balance.replace(/[$,]/g, '')) || 0), 0);
        const totalPayment = selected.reduce((sum, a) => sum + (parseFloat(a.payment.replace(/[$,]/g, '')) || 0), 0);
        return { totalBalance, totalPayment, count: selected.length };
    }, [accounts, selectedDebts]);

    // Calculate new loan amount
    const newLoanAmount = currentBalance + debtTotals.totalBalance + cashToBorrower;
    
    // Calculate LTV
    const ltv = propertyValue > 0 ? Math.round((newLoanAmount / propertyValue) * 100) : 0;
    
    // Calculate proposed P&I
    const proposedPI = useMemo(() => {
        const monthlyRate = proposedRate / 100 / 12;
        const numPayments = term * 12;
        if (monthlyRate === 0) return Math.round(newLoanAmount / numPayments);
        return Math.round((newLoanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -numPayments)));
    }, [newLoanAmount, proposedRate, term]);

    // Current totals
    const currentMonthlyDebt = currentPI + currentTaxes + currentInsurance + currentMI + debtTotals.totalPayment;
    
    // Proposed totals
    const proposedMonthlyDebt = proposedPI + proposedTaxes + proposedInsurance + proposedMI;
    
    // Savings
    const monthlySavings = currentMonthlyDebt - proposedMonthlyDebt;
    const annualSavings = monthlySavings * 12;
    
    // Value breakdown estimates
    const creditCardSavings = Math.round(debtTotals.totalPayment * 0.3);
    const mortgageSavings = Math.round((currentPI - proposedPI) * 0.8);
    const debtConsolSavings = Math.round(debtTotals.totalPayment * 0.5);
    const pmiSavings = currentMI - proposedMI;
    const creditScoreBoost = selectedDebts.length > 2 ? 45 : selectedDebts.length > 0 ? 25 : 0;

    const handlePriceLoan = () => {
        setIsRunningPricing(true);
        setTimeout(() => {
            setIsRunningPricing(false);
            setIsPriced(true);
            setConfigCollapsed(true);
            
            // Update calculator data with new values
            setCalculatorData(prev => ({
                ...prev,
                loanProposal: {
                    ...prev.loanProposal,
                    current: {
                        ...prev.loanProposal.current,
                        loanAmount: currentBalance,
                        rate: currentRate,
                    },
                    option1: {
                        ...prev.loanProposal.option1,
                        loanAmount: newLoanAmount,
                        rate: proposedRate,
                        term: term,
                        ltv: ltv,
                    },
                },
            }));
        }, 1200);
    };

    const toggleDebt = (id) => {
        setSelectedDebts(prev => prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]);
    };

    // Handlers for ProposalBuilder
    const handlePreviewChart = (chartType) => {
        onOpenFlyover?.(`ChartPreview:${chartType}`);
    };

    const handleGenerateProposal = () => {
        onOpenFlyover?.('ProposalPreview');
    };

    const loanTypes = ['Refinance', 'HELOC', 'Purchase'];
    const programs = ['Conventional', 'FHA', 'VA', 'FHA Streamline', 'VA IRRRL'];
    const terms = [30, 20, 15, 10];

    return (
        <div className="h-full flex flex-col bg-[#fafbfc]">
            {/* Disclaimer Banner */}
            <div className="bg-warning-l4 border-b border-warning-l2 px-6 py-2">
                <div className="flex items-start gap-2">
                    <AlertCircle size={16} className="text-warning-d2 mt-0.5 flex-shrink-0" />
                    <div>
                        <p className="text-xs font-medium text-warning-d2">Important: These are estimates only, not guaranteed rates or pricing.</p>
                        <p className="text-[10px] text-warning-d1">Estimates are based on consumer finance profile data and may not reflect current market conditions.</p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-4 overflow-y-auto">
                
                {/* Loan Configuration - Collapsible */}
                <div className={cn(
                    "bg-white rounded-xl border shadow-sm mb-4 transition-all",
                    isPriced ? "border-neutral-l3" : "border-alternativePrimary"
                )}>
                    <div 
                        className="px-4 py-3 flex items-center justify-between cursor-pointer"
                        onClick={() => isPriced && setConfigCollapsed(!configCollapsed)}
                    >
                        <div className="flex items-center gap-2">
                            {isPriced ? (
                                <CheckCircle2 size={16} className="text-success" />
                            ) : (
                                <BarChart3 size={16} className="text-alternativePrimary" />
                            )}
                            <h3 className="font-semibold text-neutral-d3 text-sm">Loan Configuration</h3>
                            {isPriced && configCollapsed && (
                                <span className="text-[10px] text-neutral-l1 ml-2">
                                    {program} | {term}yr | {proposedRate}% | ${newLoanAmount.toLocaleString()}
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            {!isPriced && (
                                <button
                                    onClick={(e) => { e.stopPropagation(); handlePriceLoan(); }}
                                    disabled={isRunningPricing}
                                    className={cn(
                                        "flex items-center gap-2 px-4 py-1.5 rounded-lg font-medium text-xs transition-all",
                                        isRunningPricing 
                                            ? "bg-neutral-l3 text-neutral-d1"
                                            : "bg-success text-white hover:bg-success-d2"
                                    )}
                                >
                                    {isRunningPricing ? (
                                        <><RefreshCw size={14} className="animate-spin" /> Pricing...</>
                                    ) : (
                                        <><Play size={14} /> Price Loan</>
                                    )}
                                </button>
                            )}
                            {isPriced && (
                                <ChevronDown size={16} className={cn("text-neutral-l1 transition-transform", configCollapsed && "-rotate-180")} />
                            )}
                        </div>
                    </div>
                    
                    {!configCollapsed && (
                        <div className="px-4 pb-4 border-t border-neutral-l3 pt-3">
                            <div className="grid grid-cols-5 gap-3">
                                <div>
                                    <label className="text-[10px] text-neutral-l1 uppercase tracking-wide mb-1 block">Loan Type</label>
                                    <div className="flex flex-wrap gap-1">
                                        {loanTypes.map(t => (
                                            <PillButton key={t} label={t} active={loanType === t} onClick={() => setLoanType(t)} compact />
                                        ))}
                                    </div>
                                </div>
                                <div className="col-span-2">
                                    <label className="text-[10px] text-neutral-l1 uppercase tracking-wide mb-1 block">Program</label>
                                    <div className="flex flex-wrap gap-1">
                                        {programs.map(p => (
                                            <PillButton key={p} label={p} active={program === p} onClick={() => setProgram(p)} compact />
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] text-neutral-l1 uppercase tracking-wide mb-1 block">Term</label>
                                    <div className="flex gap-1">
                                        {terms.map(t => (
                                            <PillButton key={t} label={`${t}`} active={term === t} onClick={() => setTerm(t)} compact />
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] text-neutral-l1 uppercase tracking-wide mb-1 block">Cash to Borrower</label>
                                    <InputField prefix="$" value={cashToBorrower} onChange={setCashToBorrower} />
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-5 gap-3 mt-3 pt-3 border-t border-neutral-l3">
                                <InputField label="Property Value" prefix="$" value={propertyValue} onChange={setPropertyValue} />
                                <InputField label="Current Balance" prefix="$" value={currentBalance} onChange={setCurrentBalance} />
                                <InputField label="Interest Rate" suffix="%" value={proposedRate} onChange={setProposedRate} isFloat />
                                <div>
                                    <label className="text-[10px] text-neutral-l1 uppercase tracking-wide mb-1 block">New Loan Amt</label>
                                    <div className="py-1.5 px-2 bg-alternativePrimary-l4 border border-alternativePrimary-l2 rounded text-xs font-medium text-alternativePrimary">
                                        ${newLoanAmount.toLocaleString()}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] text-neutral-l1 uppercase tracking-wide mb-1 block">LTV</label>
                                    <div className={cn(
                                        "py-1.5 px-2 rounded text-xs font-medium",
                                        ltv > 80 ? "bg-warning-l4 text-warning-d2" : "bg-success-l4 text-success-d2"
                                    )}>
                                        {ltv}%
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Comparison Cards Row */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                    {/* Current State */}
                    <div className="bg-white rounded-xl border border-neutral-l3 shadow-sm p-4">
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold text-neutral-d3 text-xs uppercase tracking-wide">Current State</h4>
                            <span className="text-[9px] bg-neutral-l4 text-neutral-d1 px-1.5 py-0.5 rounded-full">Existing</span>
                        </div>
                        <div className="space-y-2 text-xs">
                            <DataRow label="Mortgage P&I" value={`$${currentPI.toLocaleString()}`} editable onEdit={setCurrentPI} />
                            <DataRow label="Taxes" value={`$${currentTaxes.toLocaleString()}`} editable onEdit={setCurrentTaxes} />
                            <DataRow label="Insurance" value={`$${currentInsurance.toLocaleString()}`} editable onEdit={setCurrentInsurance} />
                            <DataRow label="MI" value={`$${currentMI.toLocaleString()}`} editable onEdit={setCurrentMI} />
                            <DataRow label="Debt Payments" value={`$${debtTotals.totalPayment.toLocaleString()}`} muted />
                        </div>
                        <div className="bg-neutral-l5 rounded-lg p-2 mt-3">
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] text-neutral-d2">Total Monthly</span>
                                <span className="text-lg font-bold text-neutral-d3">${currentMonthlyDebt.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    {/* New Proposed */}
                    <div className={cn(
                        "bg-white rounded-xl border shadow-sm p-4",
                        isPriced ? "border-alternativePrimary" : "border-neutral-l3"
                    )}>
                        <div className="flex items-center justify-between mb-3">
                            <h4 className={cn("font-semibold text-xs uppercase tracking-wide", isPriced ? "text-alternativePrimary" : "text-neutral-d3")}>
                                Proposed Loan
                            </h4>
                            <span className={cn("text-[9px] px-1.5 py-0.5 rounded-full", isPriced ? "bg-alternativePrimary text-white" : "bg-neutral-l4 text-neutral-d1")}>
                                Option 1
                            </span>
                        </div>
                        <div className="space-y-2 text-xs">
                            <DataRow label="New P&I" value={isPriced ? `$${proposedPI.toLocaleString()}` : '—'} highlight={isPriced} />
                            <DataRow label="Taxes" value={`$${proposedTaxes.toLocaleString()}`} editable onEdit={setProposedTaxes} />
                            <DataRow label="Insurance" value={`$${proposedInsurance.toLocaleString()}`} editable onEdit={setProposedInsurance} />
                            <DataRow label="MI" value={`$${proposedMI.toLocaleString()}`} muted editable onEdit={setProposedMI} />
                            <DataRow label="Debts Paid Off" value={`$${debtTotals.totalPayment.toLocaleString()}`} success />
                        </div>
                        <div className={cn("rounded-lg p-2 mt-3", isPriced ? "bg-alternativePrimary-l4" : "bg-neutral-l5")}>
                            <div className="flex justify-between items-center">
                                <span className={cn("text-[10px]", isPriced ? "text-alternativePrimary" : "text-neutral-d2")}>New Monthly</span>
                                <span className={cn("text-lg font-bold", isPriced ? "text-alternativePrimary" : "text-neutral-l1")}>
                                    {isPriced ? `$${proposedMonthlyDebt.toLocaleString()}` : '—'}
                                </span>
                            </div>
                        </div>
                        {isPriced && (
                            <div className="flex items-center justify-between py-1.5 px-2 bg-success-l4 rounded-lg mt-2">
                                <span className="text-[10px] text-success-d2 flex items-center gap-1">
                                    <TrendingUp size={12} /> Savings
                                </span>
                                <span className="font-bold text-success-d2 text-sm">${monthlySavings.toLocaleString()}/mo</span>
                            </div>
                        )}
                    </div>

                    {/* Value of Refinancing */}
                    <div className="bg-white rounded-xl border border-neutral-l3 shadow-sm p-4">
                        <h4 className="font-semibold text-neutral-d3 text-xs uppercase tracking-wide mb-3">Value of Refinancing</h4>
                        <div className="space-y-1.5">
                            <ValueRow icon={<CreditCard size={12} />} label="Credit Card Savings" value={`$${creditCardSavings}/mo`} />
                            <ValueRow icon={<DollarSign size={12} />} label="Mortgage Savings" value={`$${Math.abs(mortgageSavings)}/mo`} />
                            <ValueRow icon={<Plus size={12} />} label="Debt Consolidation" value={`$${debtConsolSavings}/mo`} />
                            <ValueRow icon={<Shield size={12} />} label="PMI Removal" value={pmiSavings > 0 ? `$${pmiSavings}/mo` : '$0'} muted={pmiSavings === 0} />
                            <div className="flex justify-between text-xs pt-1">
                                <span className="text-neutral-d2">Credit Score Boost</span>
                                <span className="font-medium text-success">+{creditScoreBoost} pts</span>
                            </div>
                        </div>
                        <div className="bg-gradient-to-r from-success-l4 to-success-l3 rounded-lg p-2 mt-3">
                            <div className="flex justify-between items-center">
                                <div>
                                    <span className="text-[10px] text-success-d2 block">Net Monthly Savings</span>
                                    <span className="text-[9px] text-success">Annual: ${annualSavings.toLocaleString()}</span>
                                </div>
                                <span className="text-xl font-bold text-success-d2">${monthlySavings.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Customer Facing Proposal Section - Uses existing components */}
                {isPriced && (
                    <div className="bg-white rounded-xl border border-neutral-l3 shadow-sm overflow-hidden">
                        <div className="flex h-[500px]">
                            {/* Left Panel - Proposal Builder */}
                            <div className="w-[320px] flex-shrink-0 border-r border-neutral-l3 overflow-y-auto">
                                <ProposalBuilder
                                    chart1={chart1}
                                    chart2={chart2}
                                    onChart1Change={setChart1}
                                    onChart2Change={setChart2}
                                    includeOption2={includeOption2}
                                    includeDebtWorksheet={includeDebtWorksheet}
                                    spanishVersion={spanishVersion}
                                    onIncludeOption2Change={setIncludeOption2}
                                    onIncludeDebtWorksheetChange={setIncludeDebtWorksheet}
                                    onSpanishVersionChange={setSpanishVersion}
                                    onPreviewChart={handlePreviewChart}
                                    onGenerateProposal={handleGenerateProposal}
                                />
                            </div>

                            {/* Right Panel - Calculator Tabs */}
                            <div className="flex-1 overflow-hidden bg-neutral-l5">
                                <CalculatorTabs
                                    accounts={accounts}
                                    calculatorData={calculatorData}
                                    onCalculatorDataChange={setCalculatorData}
                                    includeOption2={includeOption2}
                                    onOpenFlyover={onOpenFlyover}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Current Debts - Show before pricing */}
                {!isPriced && (
                    <div className="bg-white rounded-xl border border-neutral-l3 shadow-sm overflow-hidden">
                        <div className="px-4 py-3 border-b border-neutral-l3 flex items-center justify-between">
                            <h3 className="font-semibold text-neutral-d3 text-sm">Current Debts</h3>
                            <span className="text-[10px] text-neutral-l1">{selectedDebts.length} of {accounts.length} selected</span>
                        </div>
                        <table className="w-full text-xs">
                            <thead className="bg-neutral-l5">
                                <tr>
                                    <th className="text-left py-2 px-4 font-medium text-neutral-l1">Creditor</th>
                                    <th className="text-right py-2 px-4 font-medium text-neutral-l1">Balance</th>
                                    <th className="text-right py-2 px-4 font-medium text-neutral-l1">Payment</th>
                                    <th className="text-right py-2 px-4 font-medium text-neutral-l1">Rate</th>
                                    <th className="text-center py-2 px-4 font-medium text-neutral-l1">Pay Off?</th>
                                </tr>
                            </thead>
                            <tbody>
                                {accounts.slice(0, 6).map((account) => (
                                    <tr key={account.id} className="border-b border-neutral-l4 hover:bg-neutral-l5/50">
                                        <td className="py-2 px-4 text-neutral-d3">{account.creditor}</td>
                                        <td className="py-2 px-4 text-right text-neutral-d2">{account.balance}</td>
                                        <td className="py-2 px-4 text-right text-neutral-d2">{account.payment}</td>
                                        <td className="py-2 px-4 text-right text-neutral-l1">{account.rate || '—'}</td>
                                        <td className="py-2 px-4 text-center">
                                            <input 
                                                type="checkbox" 
                                                checked={selectedDebts.includes(account.id)}
                                                onChange={() => toggleDebt(account.id)}
                                                className="h-4 w-4 rounded border-neutral-l2 text-alternativePrimary"
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="px-4 py-2 bg-neutral-l5 flex justify-between text-xs">
                            <span className="text-neutral-d2">Total Selected: <span className="font-semibold">${debtTotals.totalBalance.toLocaleString()}</span></span>
                            <span className="text-success font-semibold">Payment Eliminated: ${debtTotals.totalPayment.toLocaleString()}/mo</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// Data Row Component
function DataRow({ label, value, editable, onEdit, highlight, muted, success }) {
    const [isEditing, setIsEditing] = useState(false);
    const [tempValue, setTempValue] = useState(value);
    
    const handleSave = () => {
        setIsEditing(false);
        if (onEdit) {
            const num = parseInt(String(tempValue).replace(/[$,]/g, '')) || 0;
            onEdit(num);
        }
    };
    
    return (
        <div className="flex justify-between items-center text-xs">
            <span className={cn(muted ? "text-neutral-l1" : "text-neutral-d2")}>{label}</span>
            {isEditing ? (
                <input
                    type="text"
                    value={tempValue}
                    onChange={(e) => setTempValue(e.target.value)}
                    onBlur={handleSave}
                    onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                    autoFocus
                    className="w-20 text-right text-xs py-0.5 px-1 border border-alternativePrimary rounded outline-none"
                />
            ) : (
                <span 
                    onClick={() => editable && setIsEditing(true)}
                    className={cn(
                        "font-medium",
                        highlight ? "text-alternativePrimary" : success ? "text-success-d2" : muted ? "text-neutral-l1" : "text-neutral-d3",
                        editable && "cursor-pointer hover:text-alternativePrimary"
                    )}
                >
                    {value}
                </span>
            )}
        </div>
    );
}

// Value Row Component
function ValueRow({ icon, label, value, muted }) {
    return (
        <div className={cn("flex items-center justify-between py-1", muted && "opacity-50")}>
            <div className="flex items-center gap-1.5">
                <span className="text-neutral-l1">{icon}</span>
                <span className="text-[10px] text-neutral-d2">{label}</span>
            </div>
            <span className="text-[10px] font-medium text-success">{value}</span>
        </div>
    );
}

// Pill Button Component
function PillButton({ label, active, onClick, compact }) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "font-medium rounded border transition-all",
                compact ? "px-2 py-1 text-[10px]" : "px-3 py-1.5 text-xs",
                active 
                    ? "bg-alternativePrimary text-white border-alternativePrimary" 
                    : "bg-white text-neutral-d2 border-neutral-l3 hover:border-alternativePrimary"
            )}
        >
            {label}
        </button>
    );
}

// Input Field Component
function InputField({ label, prefix, suffix, value, onChange, isFloat }) {
    const handleChange = (e) => {
        const raw = e.target.value.replace(/[^0-9.]/g, '');
        if (isFloat) {
            onChange(parseFloat(raw) || 0);
        } else {
            onChange(parseInt(raw) || 0);
        }
    };
    
    return (
        <div>
            {label && <label className="text-[10px] text-neutral-l1 uppercase tracking-wide mb-1 block">{label}</label>}
            <div className="relative">
                {prefix && <span className="absolute left-2 top-1/2 -translate-y-1/2 text-neutral-l1 text-xs">{prefix}</span>}
                <input 
                    type="text" 
                    value={isFloat ? value : value.toLocaleString()} 
                    onChange={handleChange}
                    className={cn(
                        "w-full py-1.5 border border-neutral-l3 rounded text-xs focus:border-alternativePrimary outline-none",
                        prefix ? "pl-5 pr-2" : suffix ? "pl-2 pr-5" : "px-2"
                    )}
                />
                {suffix && <span className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-l1 text-xs">{suffix}</span>}
            </div>
        </div>
    );
}
