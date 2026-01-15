import React, { useState, useMemo, useEffect } from 'react';
import { cn } from '../../lib/utils';
import { 
    ChevronDown, 
    ChevronRight,
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
    Play,
    ExternalLink,
    AlertCircle,
    CheckCircle2,
    Lock,
    Zap,
    Download,
    Calculator,
    ArrowUpDown,
    Edit3,
    DollarSign,
    Home,
    Shield,
    CreditCard,
    Percent,
    Calendar
} from 'lucide-react';

// Screen states
const SCREEN_STATE = {
    PRE_PRICING: 'pre-pricing',
    PRICING_COMPLETE: 'pricing-complete',
    PROPOSAL_READY: 'proposal-ready'
};

export function GoodLeapAdvantageV3({ accounts, onOpenFlyover }) {
    // Screen state
    const [screenState, setScreenState] = useState(SCREEN_STATE.PRE_PRICING);
    const [isRunningPricing, setIsRunningPricing] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    
    // Liabilities
    const [selectedDebts, setSelectedDebts] = useState(
        accounts.filter(a => a.willPay).map(a => a.id)
    );
    const [liabilitiesCollapsed, setLiabilitiesCollapsed] = useState(false);
    
    // Loan configuration
    const [program, setProgram] = useState('Conventional');
    const [term, setTerm] = useState(30);
    const [ltv, setLtv] = useState(80);
    const [loanAmount, setLoanAmount] = useState(350000);
    const [interestRate, setInterestRate] = useState(6.5);
    
    // Get primary mortgage from accounts (first mortgage account)
    const primaryMortgage = useMemo(() => {
        const mortgage = accounts.find(a => a.accountType === 'Mortgage');
        if (mortgage) {
            return {
                payment: parseFloat(mortgage.payment?.replace(/[$,]/g, '')) || 1710,
                balance: parseFloat(mortgage.balance?.replace(/[$,]/g, '')) || 247500,
                rate: parseFloat(mortgage.rate?.replace('%', '')) || 3.75,
            };
        }
        return { payment: 1710, balance: 247500, rate: 3.75 };
    }, [accounts]);

    // CURRENT LOAN - editable inputs (defaults from liabilities)
    const [currentMortgagePI, setCurrentMortgagePI] = useState(primaryMortgage.payment);
    const [currentTaxes, setCurrentTaxes] = useState(450);
    const [currentInsurance, setCurrentInsurance] = useState(120);
    const [currentRate, setCurrentRate] = useState(primaryMortgage.rate);
    const [currentLoanBalance, setCurrentLoanBalance] = useState(primaryMortgage.balance);
    const [currentLoanTerm, setCurrentLoanTerm] = useState(30);
    const [yearsRemaining, setYearsRemaining] = useState(22);
    const [homeValue, setHomeValue] = useState(950000);
    const [includeEscrow, setIncludeEscrow] = useState(true);
    
    // PROPOSED LOAN - editable inputs
    const [proposedTaxes, setProposedTaxes] = useState(450);
    const [proposedInsurance, setProposedInsurance] = useState(120);
    const [proposedMI, setProposedMI] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [cashout, setCashout] = useState(0);
    
    // Analysis module selections
    const [expandedModule, setExpandedModule] = useState('');
    const [moduleSelections, setModuleSelections] = useState({
        'debt-consolidation': false,
        'payment-delta': false,
        'break-even': false,
        'reinvestment': false,
        'disposable-income': false,
        'cash-flow': false,
    });

    // Calculator inputs
    const [calculatorInputs, setCalculatorInputs] = useState({
        reinvestment: { monthlyInvestment: 500, annualReturn: 7, years: 30 },
        disposableIncome: { grossMonthlyIncome: 12000 },
        cashFlow: { daysUntilFirstPayment: 60 },
        breakEven: { closingCosts: 8057 }
    });
    
    // Derived calculations
    const debtTotals = useMemo(() => {
        const selected = accounts.filter(a => selectedDebts.includes(a.id));
        const totalBalance = selected.reduce((sum, a) => sum + (parseFloat(a.balance.replace(/[$,]/g, '')) || 0), 0);
        const totalPayment = selected.reduce((sum, a) => sum + (parseFloat(a.payment.replace(/[$,]/g, '')) || 0), 0);
        return { totalBalance, totalPayment, count: selected.length };
    }, [accounts, selectedDebts]);

    // Calculate new loan amount
    const calculatedLoanAmount = useMemo(() => {
        return debtTotals.totalBalance + cashout;
    }, [debtTotals.totalBalance, cashout]);

    // Proposed P&I calculation
    const proposedPI = useMemo(() => {
        const principal = calculatedLoanAmount;
        const monthlyRate = interestRate / 100 / 12;
        const numPayments = term * 12;
        if (monthlyRate === 0) return Math.round(principal / numPayments);
        return Math.round((principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -numPayments)));
    }, [calculatedLoanAmount, interestRate, term]);
    
    // Current total payment
    const currentEscrow = includeEscrow ? (currentTaxes + currentInsurance) : 0;
    const currentTotal = debtTotals.totalPayment + currentEscrow;
    
    // Proposed total payment
    const proposedEscrow = includeEscrow ? (proposedTaxes + proposedInsurance) : 0;
    const proposedTotal = proposedPI + proposedEscrow + proposedMI - discount;
    
    // Payment delta
    const paymentDelta = currentTotal - proposedTotal;
    
    // Calculate LTV
    const calculatedLTV = homeValue > 0 ? Math.round((calculatedLoanAmount / homeValue) * 100) : 0;
    
    // Calculate minimum loan amount
    const minLoanAmount = debtTotals.totalBalance;
    const minLTV = homeValue > 0 ? Math.round((minLoanAmount / homeValue) * 100) : 0;
    
    // Extra Cashout Available
    const maxLoanAt80LTV = Math.round(homeValue * 0.80);
    const extraCashoutAvailable = Math.max(0, maxLoanAt80LTV - calculatedLoanAmount);

    const selectedCount = Object.values(moduleSelections).filter(Boolean).length;
    const isPricingComplete = screenState !== SCREEN_STATE.PRE_PRICING;
    const isProposalReady = screenState === SCREEN_STATE.PROPOSAL_READY;

    // Get list of selected modules
    const selectedModuleNames = useMemo(() => {
        const names = {
            'debt-consolidation': 'Debt Consolidation',
            'payment-delta': 'Payment Delta',
            'break-even': 'Break-Even',
            'reinvestment': 'Reinvestment',
            'disposable-income': 'Disposable Income',
            'cash-flow': 'Cash Flow Window'
        };
        return Object.entries(moduleSelections)
            .filter(([_, selected]) => selected)
            .map(([key]) => names[key]);
    }, [moduleSelections]);

    // Update screen state based on selections
    useEffect(() => {
        if (isPricingComplete && selectedCount > 0) {
            setScreenState(SCREEN_STATE.PROPOSAL_READY);
        } else if (isPricingComplete && selectedCount === 0) {
            setScreenState(SCREEN_STATE.PRICING_COMPLETE);
        }
    }, [selectedCount, isPricingComplete]);

    // Update calculator inputs with actual savings
    useEffect(() => {
        if (paymentDelta > 0) {
            setCalculatorInputs(prev => ({
                ...prev,
                reinvestment: {
                    ...prev.reinvestment,
                    monthlyInvestment: paymentDelta
                }
            }));
        }
    }, [paymentDelta]);

    // Price loan handler
    const handlePriceLoan = () => {
        setIsRunningPricing(true);
        setTimeout(() => {
            setIsRunningPricing(false);
            setScreenState(SCREEN_STATE.PRICING_COMPLETE);
            setIsEditMode(false);
            setHasUnsavedChanges(false);
            setLiabilitiesCollapsed(true);
            if (screenState === SCREEN_STATE.PRE_PRICING) {
                setModuleSelections(prev => ({
                    ...prev,
                    'debt-consolidation': true,
                    'payment-delta': true,
                }));
            }
        }, 1200);
    };

    const toggleDebt = (id) => {
        setSelectedDebts(prev => prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]);
        if (isPricingComplete) setHasUnsavedChanges(true);
    };
    const toggleModuleSelection = (id) => setModuleSelections(prev => ({ ...prev, [id]: !prev[id] }));
    const updateCalculatorInput = (calc, field, value) => setCalculatorInputs(prev => ({ ...prev, [calc]: { ...prev[calc], [field]: value } }));
    
    const updateConfig = (setter, value) => {
        setter(value);
        if (isPricingComplete) setHasUnsavedChanges(true);
    };

    const handleEnterEditMode = () => {
        setIsEditMode(true);
        setLiabilitiesCollapsed(false);
    };

    const handleCancelEdit = () => {
        setIsEditMode(false);
        setHasUnsavedChanges(false);
        setLiabilitiesCollapsed(true);
    };

    // Analysis data for flyovers
    const analysisData = useMemo(() => ({
        monthlySavings: paymentDelta,
        annualSavings: paymentDelta * 12,
        currentPayment: currentTotal,
        currentMortgagePI: currentMortgagePI,
        currentTaxes: currentTaxes,
        currentInsurance: currentInsurance,
        currentRate: currentRate,
        currentLoanBalance: currentLoanBalance,
        proposedPayment: proposedTotal,
        proposedPI: proposedPI,
        proposedTaxes: proposedTaxes,
        proposedInsurance: proposedInsurance,
        proposedMI: proposedMI,
        newLoanAmount: calculatedLoanAmount,
        interestRate: interestRate,
        term: term,
        ltv: calculatedLTV,
        debtsPayoff: debtTotals.totalBalance,
        debtsMonthlyPayment: debtTotals.totalPayment,
        debtsCount: debtTotals.count,
        cashout: cashout,
        extraCashoutAvailable: extraCashoutAvailable,
        homeValue: homeValue,
        closingCosts: calculatorInputs.breakEven.closingCosts,
        breakEvenMonths: paymentDelta > 0 ? Math.ceil(calculatorInputs.breakEven.closingCosts / paymentDelta) : 0,
        reinvestmentMonthly: paymentDelta > 0 ? paymentDelta : calculatorInputs.reinvestment.monthlyInvestment,
        reinvestmentReturn: calculatorInputs.reinvestment.annualReturn,
        reinvestmentYears: calculatorInputs.reinvestment.years,
        grossMonthlyIncome: calculatorInputs.disposableIncome.grossMonthlyIncome,
        proposedMortgagePayment: proposedTotal,
    }), [
        paymentDelta, currentTotal, proposedTotal, proposedPI, calculatedLoanAmount,
        debtTotals, cashout, extraCashoutAvailable, homeValue, calculatedLTV,
        currentMortgagePI, currentTaxes, currentInsurance, currentRate, currentLoanBalance,
        proposedTaxes, proposedInsurance, proposedMI, interestRate, term,
        calculatorInputs
    ]);

    const handleViewAnalysis = (chartType) => {
        onOpenFlyover?.(`ChartPreview:${chartType}`, analysisData);
    };
    const handleExportProposal = () => onOpenFlyover?.('ProposalPreview', analysisData);

    const programs = ['Conventional', 'FHA', 'VA', 'FHA Streamline', 'VA IRRRL'];
    const terms = [30, 20, 15, 10];

    return (
        <div className="h-full flex flex-col bg-[#f5f6f8]">
            {/* Top Bar */}
            <div className={cn(
                "border-b px-4 py-2 flex items-center justify-between flex-shrink-0 transition-colors",
                isPricingComplete ? "bg-white border-neutral-l3" : "bg-neutral-l5 border-neutral-l3"
            )}>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                        <Calculator className={cn(isPricingComplete ? "text-alternativePrimary" : "text-neutral-l1")} size={18} />
                        <span className="font-semibold text-neutral-d3 text-sm">Loan Pricing</span>
                    </div>
                    
                    <div className="flex items-center gap-1.5 ml-2">
                        <StatePill label="Setup" active={!isPricingComplete} complete={isPricingComplete} />
                        <ChevronRight size={12} className="text-neutral-l2" />
                        <StatePill label="Priced" active={isPricingComplete && !isProposalReady} complete={isProposalReady} />
                        <ChevronRight size={12} className="text-neutral-l2" />
                        <StatePill label="Generate" active={isProposalReady} />
                    </div>
                </div>
                
                <div className="flex items-center gap-2">
                    {hasUnsavedChanges && (
                        <div className="flex items-center gap-1.5 text-warning-d2 bg-warning-l5 px-2 py-1 rounded text-xs">
                            <AlertCircle size={12} />
                            <span className="font-medium">Re-price required</span>
                        </div>
                    )}
                    
                    {isPricingComplete && !isEditMode && !hasUnsavedChanges && (
                        <button 
                            onClick={handleEnterEditMode}
                            className="px-3 py-1.5 text-xs font-medium text-neutral-d2 bg-white border border-neutral-l3 rounded hover:bg-neutral-l5 transition-colors"
                        >
                            Edit
                        </button>
                    )}
                    
                    {(isEditMode || hasUnsavedChanges) && (
                        <button 
                            onClick={handleCancelEdit}
                            className="px-2 py-1 text-xs text-neutral-d1 hover:text-neutral-d3 transition-colors"
                        >
                            Cancel
                        </button>
                    )}
                    
                    {hasUnsavedChanges && (
                        <button
                            onClick={handlePriceLoan}
                            disabled={isRunningPricing}
                            className="px-3 py-1.5 text-xs font-medium text-white bg-success rounded hover:bg-success-d2 transition-colors flex items-center gap-1.5"
                        >
                            {isRunningPricing ? (
                                <><RefreshCw size={12} className="animate-spin" /> Pricing...</>
                            ) : (
                                <><RefreshCw size={12} /> Re-price</>
                            )}
                        </button>
                    )}
                    
                    {!hasUnsavedChanges && (
                        <button 
                            onClick={handleExportProposal}
                            disabled={!isProposalReady}
                            className={cn(
                                "px-3 py-1.5 text-xs font-medium rounded transition-all flex items-center gap-1.5",
                                isProposalReady 
                                    ? "bg-alternativePrimary text-white hover:bg-alternativePrimary-d2" 
                                    : "bg-neutral-l4 text-neutral-l1 cursor-not-allowed"
                            )}
                        >
                            <Download size={12} />
                            Generate
                            {isProposalReady && <span className="bg-white/20 px-1 py-0.5 rounded text-[10px]">{selectedCount}</span>}
                        </button>
                    )}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 px-4 pb-4 pt-3 flex gap-3 overflow-hidden">
                
                {/* LEFT: Liabilities */}
                <div className={cn(
                    "flex-shrink-0 bg-white rounded-lg shadow-sm border border-neutral-l3 flex flex-col transition-all",
                    liabilitiesCollapsed ? "w-12" : "w-64"
                )}>
                    <div 
                        className="p-3 border-b border-neutral-l3 flex items-center justify-between cursor-pointer"
                        onClick={() => setLiabilitiesCollapsed(!liabilitiesCollapsed)}
                    >
                        {!liabilitiesCollapsed && (
                            <div>
                                <h3 className="font-medium text-neutral-d3 text-xs uppercase tracking-wide">Payoffs</h3>
                                <p className="text-[10px] text-neutral-l1 mt-0.5">{selectedDebts.length} | ${debtTotals.totalBalance.toLocaleString()}</p>
                            </div>
                        )}
                        <ChevronRight size={14} className={cn("text-neutral-l1 transition-transform", !liabilitiesCollapsed && "rotate-180")} />
                    </div>
                    
                    {!liabilitiesCollapsed && (
                        <>
                            <div className={cn("flex-1 overflow-y-auto p-2", isPricingComplete && !isEditMode && !hasUnsavedChanges && "opacity-60")}>
                                <div className="space-y-1">
                                    {accounts.slice(0, 6).map((account) => (
                                        <DebtItem
                                            key={account.id}
                                            name={account.creditor}
                                            balance={account.balance}
                                            payment={account.payment}
                                            selected={selectedDebts.includes(account.id)}
                                            onToggle={() => toggleDebt(account.id)}
                                            disabled={isPricingComplete && !isEditMode && !hasUnsavedChanges}
                                        />
                                    ))}
                                </div>
                            </div>
                            
                            <div className="p-2 border-t border-neutral-l3 bg-neutral-l5">
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-neutral-d1">Payoff Total</span>
                                    <span className="font-semibold text-neutral-d3">${debtTotals.totalBalance.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs mt-1">
                                    <span className="text-neutral-d1">Pmt Eliminated</span>
                                    <span className="font-semibold text-success">-${debtTotals.totalPayment.toLocaleString()}</span>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* CENTER: Side-by-side Panels */}
                <div className="flex-1 flex flex-col gap-3 overflow-y-auto">
                    
                    <div className="grid grid-cols-2 gap-3 flex-1">
                        
                        {/* PRESENT MORTGAGE */}
                        <div className="bg-white rounded-lg shadow-sm border border-neutral-l3 p-4 flex flex-col">
                            <div className="flex items-center justify-between mb-3 pb-2 border-b border-neutral-l3">
                                <h4 className="text-xs font-semibold text-neutral-d3 uppercase tracking-wide flex items-center gap-1.5">
                                    <Home size={14} className="text-neutral-l1" />
                                    Present Mortgage
                                </h4>
                                </div>
                            
                            <div className="space-y-3 flex-1">
                                <div className="grid grid-cols-2 gap-2">
                                    <LabeledInput 
                                        label="Mortgage P&I" 
                                        prefix="$" 
                                        value={currentMortgagePI} 
                                        onChange={(v) => updateConfig(setCurrentMortgagePI, v)} 
                                        disabled={isPricingComplete && !isEditMode && !hasUnsavedChanges}
                                    />
                                    <LabeledInput 
                                        label="Rate" 
                                        suffix="%" 
                                        value={currentRate} 
                                        onChange={(v) => updateConfig(setCurrentRate, v)} 
                                        disabled={isPricingComplete && !isEditMode && !hasUnsavedChanges}
                                        isFloat
                                    />
                            </div>
                            
                                <div className="grid grid-cols-2 gap-2">
                                    <LabeledInput 
                                        label="Balance" 
                                        prefix="$" 
                                        value={currentLoanBalance} 
                                        onChange={(v) => updateConfig(setCurrentLoanBalance, v)} 
                                        disabled={isPricingComplete && !isEditMode && !hasUnsavedChanges}
                                    />
                                    <LabeledInput 
                                        label="Yrs Remaining" 
                                        value={yearsRemaining} 
                                        onChange={(v) => updateConfig(setYearsRemaining, v)} 
                                        disabled={isPricingComplete && !isEditMode && !hasUnsavedChanges}
                                    />
                                </div>
                                
                                <div className="flex items-center justify-between py-2 px-3 bg-neutral-l5 rounded">
                                    <span className="text-xs text-neutral-d2 flex items-center gap-1.5">
                                        <Shield size={12} />
                                        Include Escrow?
                                    </span>
                                <button
                                        onClick={() => updateConfig(setIncludeEscrow, !includeEscrow)}
                                        disabled={isPricingComplete && !isEditMode && !hasUnsavedChanges}
                                    className={cn(
                                            "w-10 h-5 rounded-full transition-colors relative",
                                            includeEscrow ? "bg-alternativePrimary" : "bg-neutral-l3"
                                        )}
                                    >
                                        <div className={cn(
                                            "w-4 h-4 bg-white rounded-full absolute top-0.5 transition-transform shadow",
                                            includeEscrow ? "translate-x-5" : "translate-x-0.5"
                                        )} />
                                </button>
                                </div>
                                
                                {includeEscrow && (
                                    <div className="grid grid-cols-2 gap-2">
                                        <LabeledInput 
                                            label="Taxes/mo" 
                                            prefix="$" 
                                            value={currentTaxes} 
                                            onChange={(v) => updateConfig(setCurrentTaxes, v)} 
                                            disabled={isPricingComplete && !isEditMode && !hasUnsavedChanges}
                                        />
                                        <LabeledInput 
                                            label="Insurance/mo" 
                                            prefix="$" 
                                            value={currentInsurance} 
                                            onChange={(v) => updateConfig(setCurrentInsurance, v)} 
                                            disabled={isPricingComplete && !isEditMode && !hasUnsavedChanges}
                                        />
                                    </div>
                                )}
                                
                                <div className="pt-2 border-t border-neutral-l4">
                                    <div className="flex justify-between text-xs text-neutral-d1 mb-1">
                                        <span>Other Debts ({debtTotals.count})</span>
                                        <span className="text-danger font-medium">${(debtTotals.totalPayment - currentMortgagePI).toLocaleString()}/mo</span>
                                    </div>
                                </div>
                        </div>
                        
                            <div className="border-t border-neutral-l3 pt-3 mt-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-semibold text-neutral-d2">Current Payment</span>
                                    <span className="text-xl font-bold text-neutral-d3">${currentTotal.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        {/* PROPOSED MORTGAGE */}
                        <div className={cn(
                            "bg-white rounded-lg shadow-sm border p-4 flex flex-col",
                            isPricingComplete && !hasUnsavedChanges ? "border-alternativePrimary" : "border-neutral-l3"
                        )}>
                            <div className="flex items-center justify-between mb-3 pb-2 border-b border-neutral-l3">
                                <h4 className={cn(
                                    "text-xs font-semibold uppercase tracking-wide flex items-center gap-1.5",
                                    isPricingComplete && !hasUnsavedChanges ? "text-alternativePrimary" : "text-neutral-d3"
                                )}>
                                    <Zap size={14} className={isPricingComplete && !hasUnsavedChanges ? "text-alternativePrimary" : "text-neutral-l1"} />
                                    Proposed Mortgage
                                </h4>
                                {hasUnsavedChanges && (
                                    <span className="text-[10px] text-warning-d2 bg-warning-l4 px-1.5 py-0.5 rounded">Stale</span>
                                )}
                            </div>
                            
                            <div className="space-y-3 flex-1">
                                <div className="flex flex-wrap gap-1">
                                            {programs.map((p) => (
                                                <PillButton 
                                                    key={p} 
                                                    label={p} 
                                                    active={program === p} 
                                                    onClick={() => updateConfig(setProgram, p)} 
                                                    disabled={isPricingComplete && !isEditMode && !hasUnsavedChanges} 
                                                />
                                            ))}
                                        </div>
                                
                                <div className="flex gap-1.5">
                                            {terms.map((t) => (
                                                <PillButton 
                                                    key={t} 
                                                    label={`${t}yr`} 
                                                    active={term === t} 
                                                    onClick={() => updateConfig(setTerm, t)} 
                                                    compact 
                                            disabled={isPricingComplete && !isEditMode && !hasUnsavedChanges} 
                                                />
                                            ))}
                                        </div>
                                
                                <div className="grid grid-cols-2 gap-2">
                                    <LabeledInput 
                                        label="Property Value" 
                                        prefix="$" 
                                        value={homeValue} 
                                        onChange={(v) => updateConfig(setHomeValue, v)} 
                                        disabled={isPricingComplete && !isEditMode && !hasUnsavedChanges}
                                    />
                                    <LabeledInput 
                                        label="Rate" 
                                        suffix="%" 
                                        value={interestRate} 
                                        onChange={(v) => updateConfig(setInterestRate, v)} 
                                        disabled={isPricingComplete && !isEditMode && !hasUnsavedChanges}
                                        isFloat
                                    />
                                </div>
                                
                                {/* LTV Slider */}
                                <div className="bg-neutral-l5 rounded-lg p-3">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-[10px] font-medium text-neutral-l1 uppercase tracking-wide">LTV</span>
                                        <span className={cn(
                                            "text-lg font-bold",
                                            calculatedLTV > 95 ? "text-danger" : calculatedLTV > 80 ? "text-warning-d2" : "text-success"
                                        )}>
                                            {calculatedLTV}%
                                        </span>
                                        </div>
                                    
                                    <div className="relative h-3 rounded-full overflow-hidden mb-1">
                                        <div className="absolute inset-0 bg-gradient-to-r from-success via-warning to-danger" />
                                        {minLTV > 50 && (
                                            <div 
                                                className="absolute top-0 bottom-0 w-0.5 bg-neutral-d3 z-5"
                                                style={{ left: `${Math.min(100, Math.max(0, ((minLTV - 50) / 50) * 100))}%` }}
                                            />
                                        )}
                                        <input
                                            type="range"
                                            min={Math.max(50, minLTV)}
                                            max="100"
                                            value={Math.min(100, Math.max(minLTV, calculatedLTV))}
                                            onChange={(e) => {
                                                const targetLTV = parseInt(e.target.value);
                                                const targetLoanAmount = Math.round((targetLTV / 100) * homeValue);
                                                const newCashout = Math.max(0, targetLoanAmount - debtTotals.totalBalance);
                                                updateConfig(setCashout, newCashout);
                                            }}
                                            disabled={isPricingComplete && !isEditMode && !hasUnsavedChanges}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                                        />
                                        <div 
                                            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-alternativePrimary border-2 border-white rounded-full shadow-md z-10 pointer-events-none"
                                            style={{ left: `${Math.min(100, Math.max(0, ((calculatedLTV - 50) / 50) * 100))}%`, marginLeft: '-8px' }}
                                        />
                                    </div>
                                    
                                    <div className="flex justify-between text-[9px] text-neutral-l1 mt-1">
                                        <span>50</span>
                                        <span>65</span>
                                        <span>80</span>
                                        <span>90</span>
                                        <span>100</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-2 text-xs">
                                    <div className="bg-neutral-l5 rounded p-2">
                                        <span className="text-[9px] text-neutral-l1 uppercase">Loan</span>
                                        <p className="font-bold text-neutral-d3">${calculatedLoanAmount.toLocaleString()}</p>
                                        </div>
                                    <div className="bg-neutral-l5 rounded p-2">
                                        <span className="text-[9px] text-neutral-l1 uppercase">Debts</span>
                                        <p className="font-bold text-neutral-d3">${debtTotals.totalBalance.toLocaleString()}</p>
                                    </div>
                                    <div className="bg-neutral-l5 rounded p-2">
                                        <span className="text-[9px] text-neutral-l1 uppercase">Cashout</span>
                                        <p className="font-bold text-alternativePrimary">${cashout.toLocaleString()}</p>
                                        </div>
                                    </div>
                                
                                {extraCashoutAvailable > 0 && (
                                    <div className="bg-success-l4 border border-success-l2 rounded p-2 flex justify-between items-center">
                                        <span className="text-[10px] text-success-d2">Extra Cashout @ 80%</span>
                                        <span className="text-sm font-bold text-success">${extraCashoutAvailable.toLocaleString()}</span>
                            </div>
                        )}
                                
                                {includeEscrow ? (
                                    <div className="grid grid-cols-2 gap-2">
                                        <LabeledInput 
                                            label="Taxes/mo" 
                                            prefix="$" 
                                            value={proposedTaxes} 
                                            onChange={(v) => updateConfig(setProposedTaxes, v)} 
                                        />
                                        <LabeledInput 
                                            label="Insurance/mo" 
                                            prefix="$" 
                                            value={proposedInsurance} 
                                            onChange={(v) => updateConfig(setProposedInsurance, v)} 
                                        />
                                </div>
                                ) : (
                                    <div className="py-2 px-3 bg-neutral-l5 border border-neutral-l3 rounded text-[10px] text-neutral-l1">
                                        Escrow excluded (toggle in Present)
                                </div>
                                )}
                                
                                <div className="pt-2 border-t border-neutral-l4">
                                    <div className="flex justify-between text-xs">
                                        <span className="text-neutral-d1">New P&I</span>
                                        <span className={cn("font-bold", isPricingComplete ? "text-alternativePrimary" : "text-neutral-l1")}>
                                            {isPricingComplete ? `$${proposedPI.toLocaleString()}` : '—'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="border-t border-neutral-l3 pt-3 mt-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-semibold text-neutral-d2">New Payment</span>
                                    <span className={cn(
                                        "text-xl font-bold",
                                        isPricingComplete ? "text-alternativePrimary" : "text-neutral-l1"
                                    )}>
                                        {isPricingComplete ? `$${proposedTotal.toLocaleString()}` : '—'}
                                    </span>
                                </div>
                                
                                {isPricingComplete && (
                                    <div className={cn(
                                        "mt-3 p-2 rounded flex items-center justify-between",
                                        paymentDelta >= 0 ? "bg-success-l4" : "bg-danger-l4"
                                    )}>
                                        <span className="text-xs font-medium text-neutral-d2">Monthly Savings</span>
                                        <span className={cn(
                                            "text-sm font-bold",
                                            paymentDelta >= 0 ? "text-success-d2" : "text-danger-d2"
                                        )}>
                                            ${Math.abs(paymentDelta).toLocaleString()}/mo
                                        </span>
                        </div>
                    )}

                    {!isPricingComplete && (
                                    <button
                                        onClick={handlePriceLoan}
                                        disabled={isRunningPricing}
                                        className={cn(
                                            "w-full mt-3 flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium text-sm transition-all",
                                            isRunningPricing 
                                                ? "bg-neutral-l3 text-neutral-d1"
                                                : "bg-success text-white hover:bg-success-d2"
                                        )}
                                    >
                                        {isRunningPricing ? (
                                            <><RefreshCw size={16} className="animate-spin" /> Pricing...</>
                                        ) : (
                                            <><Play size={16} /> Price Loan</>
                                        )}
                                    </button>
                                )}
                                </div>
                            </div>
                        </div>
                    
                    <div className="text-[10px] text-neutral-l1 text-center py-1">
                        Estimates only. Final terms subject to underwriting approval.
                    </div>
                </div>

                {/* RIGHT: Charts & Calculators */}
                <div className={cn(
                    "w-72 flex-shrink-0 bg-white rounded-lg shadow-sm border flex flex-col transition-all",
                    isPricingComplete ? "border-neutral-l3" : "border-neutral-l3 opacity-50"
                )}>
                    <div className="p-3 border-b border-neutral-l3">
                        <div className="flex items-center justify-between">
                            <h3 className="font-medium text-neutral-d3 text-xs uppercase tracking-wide flex items-center gap-1.5">
                                {!isPricingComplete && <Lock size={12} className="text-neutral-l1" />}
                                Charts & Calculators
                            </h3>
                            {isPricingComplete && selectedCount > 0 && (
                                <span className="text-[10px] bg-neutral-d3 text-white px-1.5 py-0.5 rounded font-medium">
                                    {selectedCount}
                                </span>
                            )}
                        </div>
                        <p className="text-[10px] text-neutral-l1 mt-0.5">
                            {isPricingComplete ? "Select for output" : "Price loan to unlock"}
                        </p>
                    </div>
                    
                    <div className={cn("flex-1 overflow-y-auto", !isPricingComplete && "pointer-events-none")}>
                        <AnalysisModuleItem
                            icon={<Plus size={14} />}
                            title="Debt Consolidation"
                            metric={`${selectedDebts.length} accts | -$${debtTotals.totalPayment.toLocaleString()}/mo`}
                            expanded={expandedModule === 'debt-consolidation'}
                            onToggle={() => setExpandedModule(expandedModule === 'debt-consolidation' ? '' : 'debt-consolidation')}
                            selected={moduleSelections['debt-consolidation']}
                            onSelect={() => toggleModuleSelection('debt-consolidation')}
                            onViewAnalysis={() => handleViewAnalysis('debt-consolidation')}
                            disabled={!isPricingComplete}
                            recommended={debtTotals.totalPayment > 500}
                        />
                        
                        <AnalysisModuleItem
                            icon={<FileCheck size={14} />}
                            title="Payment Delta"
                            metric={`${paymentDelta >= 0 ? '-' : '+'}$${Math.abs(paymentDelta).toLocaleString()}/mo`}
                            expanded={expandedModule === 'payment-delta'}
                            onToggle={() => setExpandedModule(expandedModule === 'payment-delta' ? '' : 'payment-delta')}
                            selected={moduleSelections['payment-delta']}
                            onSelect={() => toggleModuleSelection('payment-delta')}
                            onViewAnalysis={() => handleViewAnalysis('payment-savings')}
                            disabled={!isPricingComplete}
                            recommended={paymentDelta > 200}
                        />
                        
                        <AnalysisModuleItem
                            icon={<Clock size={14} />}
                            title="Break-Even"
                            metric={`${paymentDelta > 0 ? Math.ceil(calculatorInputs.breakEven.closingCosts / paymentDelta) : '—'} mo`}
                            expanded={expandedModule === 'break-even'}
                            onToggle={() => setExpandedModule(expandedModule === 'break-even' ? '' : 'break-even')}
                            selected={moduleSelections['break-even']}
                            onSelect={() => toggleModuleSelection('break-even')}
                            onViewAnalysis={() => handleViewAnalysis('recoup-costs')}
                            disabled={!isPricingComplete}
                            recommended={paymentDelta > 0 && Math.ceil(calculatorInputs.breakEven.closingCosts / paymentDelta) <= 36}
                        >
                            <ModuleInput label="Closing Costs" prefix="$" value={calculatorInputs.breakEven.closingCosts} onChange={(v) => updateCalculatorInput('breakEven', 'closingCosts', v)} />
                        </AnalysisModuleItem>
                        
                        <AnalysisModuleItem
                            icon={<TrendingUp size={14} />}
                            title="Reinvestment"
                            metric={`$${paymentDelta > 0 ? paymentDelta.toLocaleString() : calculatorInputs.reinvestment.monthlyInvestment}/mo @ ${calculatorInputs.reinvestment.annualReturn}%`}
                            expanded={expandedModule === 'reinvestment'}
                            onToggle={() => setExpandedModule(expandedModule === 'reinvestment' ? '' : 'reinvestment')}
                            selected={moduleSelections['reinvestment']}
                            onSelect={() => toggleModuleSelection('reinvestment')}
                            onViewAnalysis={() => handleViewAnalysis('reinvestment')}
                            disabled={!isPricingComplete}
                            recommended={paymentDelta > 300}
                        >
                            <div className="space-y-1.5">
                                <ModuleInput label="Monthly" prefix="$" value={paymentDelta > 0 ? paymentDelta : calculatorInputs.reinvestment.monthlyInvestment} onChange={(v) => updateCalculatorInput('reinvestment', 'monthlyInvestment', v)} />
                                <div className="grid grid-cols-2 gap-1.5">
                                    <ModuleInput label="Return" value={calculatorInputs.reinvestment.annualReturn} suffix="%" onChange={(v) => updateCalculatorInput('reinvestment', 'annualReturn', v)} />
                                    <ModuleInput label="Years" value={calculatorInputs.reinvestment.years} onChange={(v) => updateCalculatorInput('reinvestment', 'years', v)} />
                                </div>
                            </div>
                        </AnalysisModuleItem>
                        
                        <AnalysisModuleItem
                            icon={<Wallet size={14} />}
                            title="Disposable Income"
                            metric={`+$${paymentDelta > 0 ? paymentDelta.toLocaleString() : 0}/mo`}
                            expanded={expandedModule === 'disposable-income'}
                            onToggle={() => setExpandedModule(expandedModule === 'disposable-income' ? '' : 'disposable-income')}
                            selected={moduleSelections['disposable-income']}
                            onSelect={() => toggleModuleSelection('disposable-income')}
                            onViewAnalysis={() => handleViewAnalysis('disposable-income')}
                            disabled={!isPricingComplete}
                            recommended={paymentDelta > 200}
                        >
                            <ModuleInput label="Gross Income" prefix="$" value={calculatorInputs.disposableIncome.grossMonthlyIncome} onChange={(v) => updateCalculatorInput('disposableIncome', 'grossMonthlyIncome', v)} />
                        </AnalysisModuleItem>
                        
                        <AnalysisModuleItem
                            icon={<Sun size={14} />}
                            title="Cash Flow Window"
                            metric={`${calculatorInputs.cashFlow.daysUntilFirstPayment} days`}
                            expanded={expandedModule === 'cash-flow'}
                            onToggle={() => setExpandedModule(expandedModule === 'cash-flow' ? '' : 'cash-flow')}
                            selected={moduleSelections['cash-flow']}
                            onSelect={() => toggleModuleSelection('cash-flow')}
                            onViewAnalysis={() => handleViewAnalysis('cash-flow')}
                            disabled={!isPricingComplete}
                        >
                            <ModuleInput label="Days to First Pmt" value={calculatorInputs.cashFlow.daysUntilFirstPayment} onChange={(v) => updateCalculatorInput('cashFlow', 'daysUntilFirstPayment', v)} />
                        </AnalysisModuleItem>
                    </div>

                    {isPricingComplete && (
                        <div className="p-3 border-t border-neutral-l3 bg-neutral-l5">
                            {isProposalReady ? (
                                <>
                                    <div className="text-[10px] text-neutral-l1 mb-2">
                                        Output: {selectedModuleNames.join(', ')}
                                    </div>
                                <button
                                        onClick={handleExportProposal}
                                        className="w-full py-2 bg-alternativePrimary text-white rounded text-xs font-medium hover:bg-alternativePrimary-d2 transition-colors flex items-center justify-center gap-1.5"
                                >
                                        <Download size={12} />
                                    Generate Proposal
                                </button>
                                </>
                            ) : (
                                <p className="text-[10px] text-neutral-l1 text-center">
                                    Select module(s) to enable export
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// Helper Components
function StatePill({ label, active, complete }) {
    return (
        <span className={cn(
            "px-2 py-0.5 rounded text-[10px] font-medium transition-colors flex items-center gap-0.5",
            complete && "bg-success-l3 text-success-d2",
            active && !complete && "bg-alternativePrimary-l4 text-alternativePrimary",
            !active && !complete && "bg-neutral-l4 text-neutral-l1"
        )}>
            {complete && <Check size={8} />}
            {label}
        </span>
    );
}

function DebtItem({ name, balance, payment, selected, onToggle, disabled }) {
    const paymentNum = parseFloat(payment.replace(/[$,]/g, '')) || 0;
    const balanceNum = parseFloat(balance.replace(/[$,]/g, '')) || 0;
    
    return (
        <label className={cn(
            "flex items-center gap-2 p-2 rounded transition-all border text-xs",
            selected ? "bg-alternativePrimary-l4/50 border-alternativePrimary-l1" : "hover:bg-neutral-l5 border-transparent",
            disabled && "cursor-default"
        )}>
            <input type="checkbox" checked={selected} onChange={onToggle} disabled={disabled} className="h-3 w-3 rounded border-neutral-l2 text-alternativePrimary" />
            <div className="flex-1 min-w-0">
                <p className="font-medium text-neutral-d3 truncate">{name}</p>
            </div>
            <div className="text-right">
                <p className="font-semibold text-neutral-d3">${paymentNum.toLocaleString()}</p>
                <p className="text-[10px] text-neutral-l1">${balanceNum.toLocaleString()}</p>
            </div>
        </label>
    );
}

function PillButton({ label, active, onClick, compact, disabled }) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={cn(
                "px-2 py-1 text-xs font-medium rounded border transition-all",
                compact && "px-1.5",
                active ? "bg-alternativePrimary text-white border-alternativePrimary" : "bg-white text-neutral-d2 border-neutral-l3",
                !disabled && !active && "hover:border-alternativePrimary hover:text-alternativePrimary",
                disabled && !active && "opacity-50 cursor-default"
            )}
        >
            {label}
        </button>
    );
}

function LabeledInput({ label, prefix, suffix, value, onChange, disabled, isFloat }) {
    const handleChange = (e) => {
        const raw = e.target.value.replace(/[^0-9.]/g, '');
        onChange(isFloat ? parseFloat(raw) || 0 : parseInt(raw) || 0);
    };
    
    return (
        <div>
            <label className="text-[10px] font-medium text-neutral-l1 uppercase tracking-wide mb-1 block">{label}</label>
            <div className="relative">
                {prefix && <span className="absolute left-2 top-1/2 -translate-y-1/2 text-neutral-l1 text-[10px]">{prefix}</span>}
                <input
                    type="text"
                    value={typeof value === 'number' ? (isFloat ? value : value.toLocaleString()) : value}
                    onChange={handleChange}
                    disabled={disabled}
                    className={cn(
                        "w-full py-2 border border-neutral-l3 rounded text-neutral-d3 font-medium text-xs focus:border-alternativePrimary outline-none transition-colors",
                        prefix ? "pl-5 pr-2" : suffix ? "pl-2 pr-5" : "px-2",
                        disabled ? "bg-neutral-l5 cursor-default" : "bg-white hover:border-neutral-l2"
                    )}
                />
                {suffix && <span className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-l1 text-[10px]">{suffix}</span>}
            </div>
        </div>
    );
}

function AnalysisModuleItem({ icon, title, metric, expanded, onToggle, selected, onSelect, onViewAnalysis, disabled, recommended, children }) {
    return (
        <div className={cn("border-b border-neutral-l3", disabled && "opacity-40")}>
            <div className="flex items-center gap-1.5 p-2">
                <button
                    onClick={onSelect}
                    disabled={disabled}
                    className={cn(
                        "w-4 h-4 rounded border-2 flex items-center justify-center transition-all flex-shrink-0",
                        selected ? "bg-alternativePrimary border-alternativePrimary" : "border-neutral-l2 hover:border-alternativePrimary"
                    )}
                >
                    {selected && <Check size={10} className="text-white" />}
                </button>
                
                <button onClick={onToggle} disabled={disabled} className="flex-1 flex items-center gap-1.5 text-left min-w-0">
                    <span className={cn("text-neutral-l1 flex-shrink-0", selected && "text-alternativePrimary")}>{icon}</span>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                            <span className={cn("font-medium text-xs", selected ? "text-alternativePrimary" : "text-neutral-d2")}>{title}</span>
                            {recommended && !disabled && (
                                <span className="text-[8px] bg-success-l3 text-success-d2 px-1.5 py-0.5 rounded font-medium">Recommended</span>
                            )}
                        </div>
                        <span className="text-[10px] text-neutral-l1 truncate block">{metric}</span>
                    </div>
                    <ChevronDown size={12} className={cn("text-neutral-l2 transition-transform flex-shrink-0", expanded && "rotate-180")} />
                </button>
            </div>
            
            {expanded && !disabled && (
                <div className="px-2 pb-2">
                    <div className="p-2 bg-neutral-l5 rounded space-y-2">
                        {children}
                        <button
                            onClick={onViewAnalysis}
                            className="w-full py-1.5 bg-neutral-d3 text-white rounded text-[10px] font-medium hover:bg-neutral-d2 transition-colors flex items-center justify-center gap-1"
                        >
                            <ExternalLink size={10} />
                            View Analysis
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

function ModuleInput({ label, prefix, suffix, value, onChange }) {
    return (
        <div>
            <label className="text-[10px] text-neutral-l1 block mb-0.5">{label}</label>
            <div className="relative">
                {prefix && <span className="absolute left-2 top-1/2 -translate-y-1/2 text-neutral-l1 text-[10px]">{prefix}</span>}
                <input
                    type="text"
                    value={typeof value === 'number' ? value.toLocaleString() : value}
                    onChange={(e) => onChange(parseInt(e.target.value.replace(/,/g, '')) || 0)}
                    className={cn(
                        "w-full py-1 text-[10px] border border-neutral-l3 rounded focus:border-alternativePrimary outline-none",
                        prefix ? "pl-5 pr-1.5" : suffix ? "pl-1.5 pr-5" : "px-1.5"
                    )}
                />
                {suffix && <span className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-l1 text-[10px]">{suffix}</span>}
            </div>
        </div>
    );
}





