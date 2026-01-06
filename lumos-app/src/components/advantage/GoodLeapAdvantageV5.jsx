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

export function GoodLeapAdvantageV5({ accounts, onOpenFlyover }) {
    // Screen state
    const [screenState, setScreenState] = useState(SCREEN_STATE.PRE_PRICING);
    const [isRunningPricing, setIsRunningPricing] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    
    // Credit report snapshot - captures accounts at pricing time
    const [pricingSnapshot, setPricingSnapshot] = useState(null);
    const [showSnapshotDetails, setShowSnapshotDetails] = useState(false);
    
    // Liabilities
    const [selectedDebts, setSelectedDebts] = useState(
        accounts.filter(a => a.willPay).map(a => a.id)
    );
    const [liabilitiesCollapsed, setLiabilitiesCollapsed] = useState(false);
    const [configCollapsed, setConfigCollapsed] = useState(false);
    
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
    const [proposedMI, setProposedMI] = useState(0); // Mortgage Insurance
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
    
    // Derived calculations - immediate recalculation
    const debtTotals = useMemo(() => {
        const selected = accounts.filter(a => selectedDebts.includes(a.id));
        const totalBalance = selected.reduce((sum, a) => sum + (parseFloat(a.balance.replace(/[$,]/g, '')) || 0), 0);
        const totalPayment = selected.reduce((sum, a) => sum + (parseFloat(a.payment.replace(/[$,]/g, '')) || 0), 0);
        return { totalBalance, totalPayment, count: selected.length };
    }, [accounts, selectedDebts]);

    // Calculate new loan amount based on payoffs + cashout
    // Note: Debts already includes all mortgages/loans being paid off
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
    // Note: debtTotals.totalPayment already includes mortgage payments from liabilities
    const currentEscrow = includeEscrow ? (currentTaxes + currentInsurance) : 0;
    const currentTotal = debtTotals.totalPayment + currentEscrow;
    
    // Proposed total payment (escrow toggle affects both current and proposed for fair comparison)
    const proposedEscrow = includeEscrow ? (proposedTaxes + proposedInsurance) : 0;
    const proposedTotal = proposedPI + proposedEscrow + proposedMI - discount; // MI always included
    
    // Payment delta
    const paymentDelta = currentTotal - proposedTotal;
    
    // Calculate LTV
    const calculatedLTV = homeValue > 0 ? Math.round((calculatedLoanAmount / homeValue) * 100) : 0;
    
    // Calculate minimum loan amount (debts being paid off - can't go lower)
    const minLoanAmount = debtTotals.totalBalance;
    const minLTV = homeValue > 0 ? Math.round((minLoanAmount / homeValue) * 100) : 0;
    
    // Calculate Extra Cashout Available (based on 80% LTV max)
    const maxLoanAt80LTV = Math.round(homeValue * 0.80);
    const extraCashoutAvailable = Math.max(0, maxLoanAt80LTV - calculatedLoanAmount);

    const selectedCount = Object.values(moduleSelections).filter(Boolean).length;
    const isPricingComplete = screenState !== SCREEN_STATE.PRE_PRICING;
    const isProposalReady = screenState === SCREEN_STATE.PROPOSAL_READY;

    // Detect changes between pricing snapshot and current accounts
    const snapshotChanges = useMemo(() => {
        if (!pricingSnapshot) return null;
        
        const snapshotAccounts = pricingSnapshot.accounts || [];
        const currentAccounts = accounts || [];
        
        // Create lookup maps
        const snapshotMap = new Map(snapshotAccounts.map(a => [a.id, a]));
        const currentMap = new Map(currentAccounts.map(a => [a.id, a]));
        
        // Find new accounts (in current but not in snapshot)
        const newAccounts = currentAccounts.filter(a => !snapshotMap.has(a.id));
        
        // Find removed accounts (in snapshot but not in current)
        const removedAccounts = snapshotAccounts.filter(a => !currentMap.has(a.id));
        
        // Find balance changes
        let totalBalanceChange = 0;
        let totalPaymentChange = 0;
        let changedAccounts = [];
        
        currentAccounts.forEach(current => {
            const snapshot = snapshotMap.get(current.id);
            if (snapshot) {
                const currentBalance = parseFloat(current.balance?.replace(/[$,]/g, '')) || 0;
                const snapshotBalance = parseFloat(snapshot.balance?.replace(/[$,]/g, '')) || 0;
                const currentPayment = parseFloat(current.payment?.replace(/[$,]/g, '')) || 0;
                const snapshotPayment = parseFloat(snapshot.payment?.replace(/[$,]/g, '')) || 0;
                
                const balanceDiff = currentBalance - snapshotBalance;
                const paymentDiff = currentPayment - snapshotPayment;
                
                if (balanceDiff !== 0 || paymentDiff !== 0) {
                    totalBalanceChange += balanceDiff;
                    totalPaymentChange += paymentDiff;
                    changedAccounts.push({
                        ...current,
                        balanceDiff,
                        paymentDiff,
                        prevBalance: snapshotBalance,
                        prevPayment: snapshotPayment
                    });
                }
            }
        });
        
        const hasChanges = newAccounts.length > 0 || removedAccounts.length > 0 || changedAccounts.length > 0;
        
        return {
            hasChanges,
            newAccounts,
            removedAccounts,
            changedAccounts,
            totalBalanceChange,
            totalPaymentChange,
            snapshotTimestamp: pricingSnapshot.timestamp
        };
    }, [pricingSnapshot, accounts]);

    // Get list of selected modules for output summary
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

    // Update calculator inputs with actual savings when values change
    useEffect(() => {
        if (paymentDelta > 0) {
            setCalculatorInputs(prev => ({
                ...prev,
                reinvestment: {
                    ...prev.reinvestment,
                    monthlyInvestment: paymentDelta // Use actual monthly savings
                }
            }));
        }
    }, [paymentDelta]);

    // Price loan - system pre-selects modules silently and captures snapshot
    const handlePriceLoan = () => {
        setIsRunningPricing(true);
        
        // Capture credit report snapshot at pricing time
        setPricingSnapshot({
            accounts: JSON.parse(JSON.stringify(accounts)), // Deep copy
            timestamp: new Date().toISOString(),
            selectedDebts: [...selectedDebts]
        });
        
        setTimeout(() => {
            setIsRunningPricing(false);
            setScreenState(SCREEN_STATE.PRICING_COMPLETE);
            setIsEditMode(false);
            setHasUnsavedChanges(false);
            setLiabilitiesCollapsed(true);
            // System pre-selects modules (silently, no marketing flair)
            if (screenState === SCREEN_STATE.PRE_PRICING) {
                setModuleSelections(prev => ({
                    ...prev,
                    'debt-consolidation': true,
                    'payment-delta': true,
                }));
            }
        }, 1200);
    };
    
    // Re-price to update snapshot with latest accounts
    const handleReprice = () => {
        setScreenState(SCREEN_STATE.PRE_PRICING);
        setPricingSnapshot(null);
        setHasUnsavedChanges(false);
        setShowSnapshotDetails(false);
    };

    const toggleDebt = (id) => {
        setSelectedDebts(prev => prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]);
        if (isPricingComplete) setHasUnsavedChanges(true);
    };
    const toggleModuleSelection = (id) => setModuleSelections(prev => ({ ...prev, [id]: !prev[id] }));
    const updateCalculatorInput = (calc, field, value) => setCalculatorInputs(prev => ({ ...prev, [calc]: { ...prev[calc], [field]: value } }));
    
    // Track changes to pricing config
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

    // Calculated data to pass to flyovers/charts
    const analysisData = useMemo(() => ({
        // Savings
        monthlySavings: paymentDelta,
        annualSavings: paymentDelta * 12,
        
        // Current loan
        currentPayment: currentTotal,
        currentMortgagePI: currentMortgagePI,
        currentTaxes: currentTaxes,
        currentInsurance: currentInsurance,
        currentRate: currentRate,
        currentLoanBalance: currentLoanBalance,
        
        // Proposed loan
        proposedPayment: proposedTotal,
        proposedPI: proposedPI,
        proposedTaxes: proposedTaxes,
        proposedInsurance: proposedInsurance,
        proposedMI: proposedMI,
        newLoanAmount: calculatedLoanAmount,
        interestRate: interestRate,
        term: term,
        ltv: calculatedLTV,
        
        // Debts
        debtsPayoff: debtTotals.totalBalance,
        debtsMonthlyPayment: debtTotals.totalPayment,
        debtsCount: debtTotals.count,
        
        // Cashout
        cashout: cashout,
        extraCashoutAvailable: extraCashoutAvailable,
        
        // Property
        homeValue: homeValue,
        
        // Break-even
        closingCosts: calculatorInputs.breakEven.closingCosts,
        breakEvenMonths: paymentDelta > 0 ? Math.ceil(calculatorInputs.breakEven.closingCosts / paymentDelta) : 0,
        
        // Reinvestment - use actual savings as default monthly investment
        reinvestmentMonthly: paymentDelta > 0 ? paymentDelta : calculatorInputs.reinvestment.monthlyInvestment,
        reinvestmentReturn: calculatorInputs.reinvestment.annualReturn,
        reinvestmentYears: calculatorInputs.reinvestment.years,
        
        // Disposable income
        grossMonthlyIncome: calculatorInputs.disposableIncome.grossMonthlyIncome,
        proposedMortgagePayment: proposedTotal, // For disposable income chart
    }), [
        paymentDelta, currentTotal, proposedTotal, proposedPI, calculatedLoanAmount,
        debtTotals, cashout, extraCashoutAvailable, homeValue, calculatedLTV,
        currentMortgagePI, currentTaxes, currentInsurance, currentRate, currentLoanBalance,
        proposedTaxes, proposedInsurance, proposedMI, interestRate, term,
        calculatorInputs
    ]);

    const handleViewAnalysis = (chartType) => {
        // Pass analysis data along with the chart type
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
                    
                    {/* State Pills - compact */}
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

            {/* Credit Data Change Banner */}
            {isPricingComplete && snapshotChanges?.hasChanges && (
                <div className="mx-4 mt-2">
                    <div className="bg-warning-l5 border border-warning-l2 rounded-lg p-3">
                        <div className="flex items-start justify-between">
                            <div className="flex items-start gap-2">
                                <History size={16} className="text-warning-d2 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="text-xs font-medium text-warning-d2">
                                        Credit data has changed since pricing
                                    </p>
                                    <p className="text-[11px] text-warning-d1 mt-0.5">
                                        {snapshotChanges.newAccounts.length > 0 && (
                                            <span>+{snapshotChanges.newAccounts.length} new account{snapshotChanges.newAccounts.length > 1 ? 's' : ''}</span>
                                        )}
                                        {snapshotChanges.removedAccounts.length > 0 && (
                                            <span>{snapshotChanges.newAccounts.length > 0 ? ', ' : ''}-{snapshotChanges.removedAccounts.length} removed</span>
                                        )}
                                        {snapshotChanges.totalBalanceChange !== 0 && (
                                            <span>
                                                {(snapshotChanges.newAccounts.length > 0 || snapshotChanges.removedAccounts.length > 0) ? ', ' : ''}
                                                {snapshotChanges.totalBalanceChange > 0 ? '+' : ''}${snapshotChanges.totalBalanceChange.toLocaleString()} balance
                                            </span>
                                        )}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setShowSnapshotDetails(!showSnapshotDetails)}
                                    className="text-[10px] text-warning-d2 hover:underline"
                                >
                                    {showSnapshotDetails ? 'Hide' : 'Details'}
                                </button>
                                <button
                                    onClick={handleReprice}
                                    className="px-2 py-1 text-xs font-medium text-white bg-warning-d1 rounded hover:bg-warning-d2 transition-colors"
                                >
                                    Re-price
                                </button>
                            </div>
                        </div>
                        
                        {/* Expanded Details */}
                        {showSnapshotDetails && (
                            <div className="mt-3 pt-3 border-t border-warning-l2 space-y-2">
                                <p className="text-[10px] text-warning-d1">
                                    Priced on: {new Date(snapshotChanges.snapshotTimestamp).toLocaleString()}
                                </p>
                                
                                {snapshotChanges.newAccounts.length > 0 && (
                                    <div>
                                        <p className="text-[10px] font-medium text-warning-d2 mb-1">New Accounts:</p>
                                        {snapshotChanges.newAccounts.map(acc => (
                                            <div key={acc.id} className="text-[10px] text-warning-d1 ml-2">
                                                • {acc.creditor}: ${parseFloat(acc.balance?.replace(/[$,]/g, '') || 0).toLocaleString()}
                                            </div>
                                        ))}
                                    </div>
                                )}
                                
                                {snapshotChanges.removedAccounts.length > 0 && (
                                    <div>
                                        <p className="text-[10px] font-medium text-warning-d2 mb-1">Removed Accounts:</p>
                                        {snapshotChanges.removedAccounts.map(acc => (
                                            <div key={acc.id} className="text-[10px] text-warning-d1 ml-2">
                                                • {acc.creditor}: ${parseFloat(acc.balance?.replace(/[$,]/g, '') || 0).toLocaleString()}
                                            </div>
                                        ))}
                                    </div>
                                )}
                                
                                {snapshotChanges.changedAccounts.length > 0 && (
                                    <div>
                                        <p className="text-[10px] font-medium text-warning-d2 mb-1">Changed Balances:</p>
                                        {snapshotChanges.changedAccounts.map(acc => (
                                            <div key={acc.id} className="text-[10px] text-warning-d1 ml-2">
                                                • {acc.creditor}: ${acc.prevBalance.toLocaleString()} → ${parseFloat(acc.balance?.replace(/[$,]/g, '') || 0).toLocaleString()}
                                                <span className={acc.balanceDiff > 0 ? "text-danger" : "text-success"}>
                                                    {' '}({acc.balanceDiff > 0 ? '+' : ''}${acc.balanceDiff.toLocaleString()})
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className="flex-1 px-4 pb-4 pt-3 flex gap-3 overflow-hidden">
                
                {/* LEFT: Liabilities */}
                <div className={cn(
                    "flex-shrink-0 bg-white rounded-lg shadow-sm border border-neutral-l3 flex flex-col transition-all",
                    liabilitiesCollapsed ? "w-12" : "w-56"
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

                {/* CENTER: Two-Column Layout (50/50 after pricing) */}
                <div className="flex-1 flex gap-3 overflow-hidden">
                    
                    {/* LEFT COLUMN: Loan Configuration */}
                    <div className={cn(
                        "flex flex-col gap-3 transition-all overflow-y-auto",
                        isPricingComplete ? "w-1/2" : "flex-1"
                    )}>
                            
                            {/* Loan Builder Section */}
                            <div className="bg-white rounded-lg shadow-sm border border-neutral-l3 p-4">
                                        <div className="flex items-center justify-between mb-3">
                                <h3 className="text-sm font-semibold text-neutral-d3 flex items-center gap-2">
                                    <Calculator size={16} className="text-neutral-l1" />
                                    Loan Configuration
                                </h3>
                                            {hasUnsavedChanges && (
                                    <span className="text-[10px] text-warning-d2 bg-warning-l4 px-1.5 py-0.5 rounded">Re-price needed</span>
                                            )}
                                        </div>
                            
                            {/* Program Selection */}
                            <div className="flex flex-wrap gap-1 mb-3">
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
                            
                            {/* Key Inputs */}
                            <div className="grid grid-cols-3 gap-3 mb-3">
                                                <LabeledInput 
                                                    label="Property Value" 
                                                    prefix="$" 
                                                    value={homeValue} 
                                                    onChange={(v) => updateConfig(setHomeValue, v)} 
                                                    disabled={isPricingComplete && !isEditMode && !hasUnsavedChanges}
                                                />
                                                <LabeledInput 
                                    label="Current P&I" 
                                    prefix="$" 
                                    value={currentMortgagePI} 
                                    onChange={(v) => updateConfig(setCurrentMortgagePI, v)} 
                                    disabled={isPricingComplete && !isEditMode && !hasUnsavedChanges}
                                />
                                <LabeledInput 
                                    label="New Rate" 
                                                    suffix="%" 
                                                    value={interestRate} 
                                                    onChange={(v) => updateConfig(setInterestRate, v)} 
                                                    disabled={isPricingComplete && !isEditMode && !hasUnsavedChanges}
                                                    isFloat
                                                />
                                            </div>
                            
                            {/* Escrow Toggle */}
                            <div className="flex items-center justify-between py-2 px-3 bg-neutral-l5 rounded mb-3">
                                <span className="text-xs text-neutral-d2 flex items-center gap-1.5">
                                    <Shield size={12} />
                                    Include Escrow?
                                </span>
                                <button
                                    onClick={() => updateConfig(setIncludeEscrow, !includeEscrow)}
                                    disabled={isPricingComplete && !isEditMode && !hasUnsavedChanges}
                                    className={cn("w-10 h-5 rounded-full transition-colors relative", includeEscrow ? "bg-alternativePrimary" : "bg-neutral-l3")}
                                >
                                    <div className={cn("w-4 h-4 bg-white rounded-full absolute top-0.5 transition-transform shadow", includeEscrow ? "translate-x-5" : "translate-x-0.5")} />
                                </button>
                                </div>
                                
                            {/* LTV Slider */}
                            <div className="border-t border-neutral-l3 pt-3">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-medium text-neutral-d2">Build Loan Amount</span>
                                    <span className="text-xs font-bold text-alternativePrimary">${calculatedLoanAmount.toLocaleString()}</span>
                                    </div>
                                    
                                <div className="flex items-center gap-3">
                                        <div className="flex-1 relative">
                                            <div className="h-3 rounded-full overflow-hidden bg-gradient-to-r from-success via-warning to-danger">
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
                                                <span>50%</span>
                                                <span>80%</span>
                                                <span>100%</span>
                                            </div>
                                        </div>
                                        <div className={cn(
                                        "w-14 py-1.5 px-2 border rounded font-bold text-sm text-center",
                                        calculatedLTV > 80 ? "bg-warning-l4 border-warning-l2 text-warning-d2" : "bg-success-l4 border-success-l2 text-success"
                                        )}>
                                            {calculatedLTV}%
                                        </div>
                                    </div>
                                    
                                <div className="flex gap-2 mt-2 text-[10px]">
                                    <div className="flex-1 bg-neutral-l5 rounded p-1.5">
                                        <span className="text-neutral-l1">Debts</span>
                                        <p className="font-semibold text-neutral-d3">${debtTotals.totalBalance.toLocaleString()}</p>
                                        </div>
                                    <div className="flex-1 bg-neutral-l5 rounded p-1.5">
                                        <span className="text-neutral-l1">Cashout</span>
                                        <p className="font-semibold text-alternativePrimary">${cashout.toLocaleString()}</p>
                                    </div>
                                </div>
                                </div>
                            </div>
                            
                        {/* Present vs Proposed Breakdown */}
                            <div className="bg-white rounded-lg shadow-sm border border-neutral-l3 flex-1">
                            <div className="px-3 py-2 border-b border-neutral-l3 bg-neutral-l5">
                                <div className="grid grid-cols-3 text-[10px] font-semibold uppercase tracking-wide">
                                    <span className="text-neutral-d2">Present</span>
                                    <span className="text-center text-neutral-l1"></span>
                                    <span className="text-right text-alternativePrimary">Proposed</span>
                                </div>
                            </div>
                            
                            <div className="divide-y divide-neutral-l4">
                                {/* P&I */}
                                <div className="px-3 py-2 grid grid-cols-3 items-center text-sm">
                                    <span className="font-medium text-neutral-d3">${currentMortgagePI.toLocaleString()}</span>
                                    <span className="text-center text-xs text-neutral-l1">P&I</span>
                                    <span className={cn("text-right font-medium", isPricingComplete ? "text-alternativePrimary" : "text-neutral-l1")}>
                                        {isPricingComplete ? `$${proposedPI.toLocaleString()}` : '—'}
                                    </span>
                                </div>
                                
                                {/* Taxes */}
                                {includeEscrow && (
                                    <div className="px-3 py-2 grid grid-cols-3 items-center text-sm">
                                        <span className="font-medium text-neutral-d3">${currentTaxes.toLocaleString()}</span>
                                        <span className="text-center text-xs text-neutral-l1">Taxes</span>
                                        <span className="text-right font-medium text-alternativePrimary">${proposedTaxes.toLocaleString()}</span>
                                    </div>
                                )}
                                
                                {/* Insurance */}
                                {includeEscrow && (
                                    <div className="px-3 py-2 grid grid-cols-3 items-center text-sm">
                                        <span className="font-medium text-neutral-d3">${currentInsurance.toLocaleString()}</span>
                                        <span className="text-center text-xs text-neutral-l1">Insurance</span>
                                        <span className="text-right font-medium text-alternativePrimary">${proposedInsurance.toLocaleString()}</span>
                                    </div>
                                )}
                                
                                {/* MI */}
                                {proposedMI > 0 && (
                                    <div className="px-3 py-2 grid grid-cols-3 items-center text-sm">
                                        <span className="text-neutral-l1">—</span>
                                        <span className="text-center text-xs text-neutral-l1">MI</span>
                                        <span className="text-right font-medium text-alternativePrimary">${proposedMI.toLocaleString()}</span>
                                    </div>
                                )}
                                
                                {/* Other Debts */}
                                <div className="px-3 py-2 grid grid-cols-3 items-center text-sm">
                                    <span className="font-medium text-danger">${(debtTotals.totalPayment - currentMortgagePI).toLocaleString()}</span>
                                    <span className="text-center text-xs text-neutral-l1">Other Debts</span>
                                    <span className="text-right font-medium text-success">$0</span>
                                </div>
                            </div>
                            
                            {/* Total Row */}
                            <div className="px-3 py-3 border-t-2 border-neutral-l3 bg-neutral-l5 grid grid-cols-3 items-center">
                                <div>
                                    <p className="text-[10px] text-neutral-l1 uppercase">Current</p>
                                                <p className="text-lg font-bold text-neutral-d3">${currentTotal.toLocaleString()}</p>
                                </div>
                                <div className="text-center">
                                                <span className="text-[10px] font-semibold text-neutral-d2 uppercase">Total/mo</span>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] text-alternativePrimary uppercase">Proposed</p>
                                    <p className={cn("text-lg font-bold", isPricingComplete ? "text-alternativePrimary" : "text-neutral-l1")}>
                                                    {isPricingComplete ? `$${proposedTotal.toLocaleString()}` : '—'}
                                                </p>
                                </div>
                            </div>
                                
                            {/* Savings or Price Button */}
                                <div className="p-3 border-t border-neutral-l3">
                                    {isPricingComplete ? (
                                        <div className={cn(
                                        "p-3 rounded-lg flex items-center justify-center gap-4",
                                            paymentDelta >= 0 ? "bg-success-l4" : "bg-danger-l4"
                                        )}>
                                            <div className="text-center">
                                            <p className="text-xs text-neutral-d2">Monthly Savings</p>
                                            <p className={cn("text-2xl font-bold", paymentDelta >= 0 ? "text-success-d2" : "text-danger-d2")}>
                                                    ${Math.abs(paymentDelta).toLocaleString()}
                                                </p>
                                            </div>
                                        <div className="h-8 w-px bg-neutral-l3" />
                                            <div className="text-center">
                                            <p className="text-xs text-neutral-d2">Annual</p>
                                            <p className={cn("text-lg font-bold", paymentDelta >= 0 ? "text-success-d2" : "text-danger-d2")}>
                                                    ${Math.abs(paymentDelta * 12).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={handlePriceLoan}
                                            disabled={isRunningPricing}
                                            className={cn(
                                                "w-full flex items-center justify-center gap-2 py-3 rounded-lg font-medium text-sm transition-all",
                                            isRunningPricing ? "bg-neutral-l3 text-neutral-d1" : "bg-success text-white hover:bg-success-d2"
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
                        
                    {/* RIGHT COLUMN: Charts & Calculators (50% after pricing) */}
                        <div className={cn(
                        "bg-white rounded-lg shadow-sm border flex flex-col transition-all overflow-hidden",
                        isPricingComplete ? "w-1/2 border-alternativePrimary" : "w-72 border-neutral-l3 opacity-50"
                        )}>
                        <div className="p-3 border-b border-neutral-l3 bg-gradient-to-r from-alternativePrimary-l4 to-white">
                                <div className="flex items-center justify-between">
                                <h3 className={cn(
                                    "font-semibold text-sm flex items-center gap-2",
                                    isPricingComplete ? "text-alternativePrimary" : "text-neutral-d3"
                                )}>
                                    {!isPricingComplete && <Lock size={14} className="text-neutral-l1" />}
                                    <Sparkles size={16} className={isPricingComplete ? "text-alternativePrimary" : "text-neutral-l1"} />
                                    Value Propositions
                                    </h3>
                                    {isPricingComplete && selectedCount > 0 && (
                                    <span className="text-xs bg-alternativePrimary text-white px-2 py-0.5 rounded-full font-medium">
                                        {selectedCount} selected
                                        </span>
                                    )}
                                </div>
                                <p className="text-[10px] text-neutral-l1 mt-0.5">
                                {isPricingComplete ? "Select benefits to include in proposal" : "Price loan to unlock"}
                                </p>
                            </div>
                            
                        <div className={cn("flex-1 overflow-y-auto p-3", !isPricingComplete && "pointer-events-none")}>
                            {isPricingComplete ? (
                                <div className="grid grid-cols-2 gap-3">
                                    {/* Debt Consolidation Card */}
                                    <BenefitCard
                                        icon={<Plus size={18} />}
                                    title="Debt Consolidation"
                                        value={`-$${debtTotals.totalPayment.toLocaleString()}`}
                                        sublabel={`${selectedDebts.length} accounts paid off`}
                                    selected={moduleSelections['debt-consolidation']}
                                    onSelect={() => toggleModuleSelection('debt-consolidation')}
                                        onViewChart={() => handleViewAnalysis('debt-consolidation')}
                                    recommended={debtTotals.totalPayment > 500}
                                        color="success"
                                />
                                
                                    {/* Payment Savings Card */}
                                    <BenefitCard
                                        icon={<FileCheck size={18} />}
                                        title="Payment Savings"
                                        value={`$${Math.abs(paymentDelta).toLocaleString()}/mo`}
                                        sublabel={`$${Math.abs(paymentDelta * 12).toLocaleString()} annually`}
                                    selected={moduleSelections['payment-delta']}
                                    onSelect={() => toggleModuleSelection('payment-delta')}
                                        onViewChart={() => handleViewAnalysis('payment-savings')}
                                    recommended={paymentDelta > 200}
                                        color={paymentDelta >= 0 ? "success" : "danger"}
                                />
                                
                                    {/* Break-Even Card */}
                                    <BenefitCard
                                        icon={<Clock size={18} />}
                                    title="Break-Even"
                                        value={`${paymentDelta > 0 ? Math.ceil(calculatorInputs.breakEven.closingCosts / paymentDelta) : '—'} months`}
                                        sublabel={`$${calculatorInputs.breakEven.closingCosts.toLocaleString()} closing costs`}
                                    selected={moduleSelections['break-even']}
                                    onSelect={() => toggleModuleSelection('break-even')}
                                        onViewChart={() => handleViewAnalysis('recoup-costs')}
                                    recommended={paymentDelta > 0 && Math.ceil(calculatorInputs.breakEven.closingCosts / paymentDelta) <= 36}
                                        color="primary"
                                    />
                                
                                    {/* Reinvestment Card */}
                                    <BenefitCard
                                        icon={<TrendingUp size={18} />}
                                    title="Reinvestment"
                                        value={`$${paymentDelta > 0 ? paymentDelta.toLocaleString() : 0}/mo`}
                                        sublabel={`@ ${calculatorInputs.reinvestment.annualReturn}% return`}
                                    selected={moduleSelections['reinvestment']}
                                    onSelect={() => toggleModuleSelection('reinvestment')}
                                        onViewChart={() => handleViewAnalysis('reinvestment')}
                                    recommended={paymentDelta > 300}
                                        color="primary"
                                    />
                                    
                                    {/* Disposable Income Card */}
                                    <BenefitCard
                                        icon={<Wallet size={18} />}
                                    title="Disposable Income"
                                        value={`+$${paymentDelta > 0 ? paymentDelta.toLocaleString() : 0}`}
                                        sublabel="Monthly cash flow"
                                    selected={moduleSelections['disposable-income']}
                                    onSelect={() => toggleModuleSelection('disposable-income')}
                                        onViewChart={() => handleViewAnalysis('disposable-income')}
                                    recommended={paymentDelta > 200}
                                        color="success"
                                    />
                                    
                                    {/* Cash Flow Window Card */}
                                    <BenefitCard
                                        icon={<Sun size={18} />}
                                    title="Cash Flow Window"
                                        value={`$${(currentTotal * 2).toLocaleString()}`}
                                        sublabel={`${calculatorInputs.cashFlow.daysUntilFirstPayment} days deferred`}
                                    selected={moduleSelections['cash-flow']}
                                    onSelect={() => toggleModuleSelection('cash-flow')}
                                        onViewChart={() => handleViewAnalysis('cash-flow')}
                                        color="warning"
                                    />
                                </div>
                            ) : (
                                <div className="flex items-center justify-center h-full">
                                    <div className="text-center py-8">
                                        <Lock size={32} className="text-neutral-l2 mx-auto mb-3" />
                                        <p className="text-neutral-l1 text-sm">Price the loan to see benefits</p>
                                    </div>
                                </div>
                            )}
                            </div>

                        {/* Generate Proposal */}
                            {isPricingComplete && (
                                <div className="p-3 border-t border-neutral-l3 bg-neutral-l5">
                                    {isProposalReady ? (
                                            <button
                                                onClick={handleExportProposal}
                                        className="w-full py-2.5 bg-alternativePrimary text-white rounded-lg text-sm font-medium hover:bg-alternativePrimary-d2 transition-colors flex items-center justify-center gap-2"
                                            >
                                        <Download size={16} />
                                        Generate Proposal ({selectedCount})
                                            </button>
                                    ) : (
                                    <p className="text-xs text-neutral-l1 text-center py-2">
                                        Select benefits to generate proposal
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                    
                    {/* Compliance disclaimer */}
                <div className="text-[10px] text-neutral-l1 text-center absolute bottom-1 left-1/2 -translate-x-1/2">
                        Estimates only. Final terms subject to underwriting approval.
                </div>
            </div>
        </div>
    );
}

// State Pill - compact
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

// Debt Item - compact
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

// Pill Button - compact
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

// Compact Input Field
function CompactInput({ label, prefix, suffix, value, onChange, disabled }) {
    return (
        <div>
            <label className="text-[10px] font-medium text-neutral-l1 uppercase tracking-wide mb-1 block">{label}</label>
            <div className="relative">
                {prefix && <span className="absolute left-2 top-1/2 -translate-y-1/2 text-neutral-l1 text-[10px]">{prefix}</span>}
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    disabled={disabled}
                    className={cn(
                        "w-full py-1.5 border border-neutral-l3 rounded text-neutral-d3 font-medium text-xs focus:border-alternativePrimary outline-none",
                        prefix ? "pl-5 pr-2" : suffix ? "pl-2 pr-5" : "px-2",
                        disabled && "bg-neutral-l5 cursor-default"
                    )}
                />
                {suffix && <span className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-l1 text-[10px]">{suffix}</span>}
            </div>
        </div>
    );
}

// Labeled Input with icon - for the comparison panels
function LabeledInput({ label, icon, prefix, suffix, value, onChange, disabled, isFloat }) {
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
            <label className="text-[10px] font-medium text-neutral-l1 uppercase tracking-wide mb-1 flex items-center gap-1">
                {icon && <span className="text-neutral-l2">{icon}</span>}
                {label}
            </label>
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

// Data Row for comparison panels
function DataRow({ label, value, highlight, muted, small }) {
    return (
        <div className="flex justify-between items-center">
            <span className={cn("text-xs", muted ? "text-neutral-l1" : "text-neutral-d2")}>{label}</span>
            <span className={cn(
                "font-medium",
                small ? "text-[10px]" : "text-xs",
                highlight ? "text-alternativePrimary" : muted ? "text-neutral-l1" : "text-neutral-d3"
            )}>{value}</span>
        </div>
    );
}

// Editable Data Row for proposed panel
function EditableDataRow({ label, value, onChange }) {
    const [isEditing, setIsEditing] = useState(false);
    const [tempValue, setTempValue] = useState(value);
    
    const handleBlur = () => {
        setIsEditing(false);
        onChange(parseInt(tempValue) || 0);
    };
    
    return (
        <div className="flex justify-between items-center">
            <span className="text-xs text-neutral-d2">{label}</span>
            {isEditing ? (
                <input
                    type="text"
                    value={tempValue}
                    onChange={(e) => setTempValue(e.target.value.replace(/[^0-9]/g, ''))}
                    onBlur={handleBlur}
                    onKeyDown={(e) => e.key === 'Enter' && handleBlur()}
                    autoFocus
                    className="w-16 text-xs font-medium text-right py-0.5 px-1 border border-alternativePrimary rounded outline-none"
                />
            ) : (
                <button
                    onClick={() => { setTempValue(value); setIsEditing(true); }}
                    className="text-xs font-medium text-alternativePrimary hover:underline"
                >
                    ${value.toLocaleString()}
                </button>
            )}
        </div>
    );
}

// Analysis Module Item - replaces ValuePropItem
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

// Module Input - compact calculator input
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

// Comparison Table Row - aligned row in unified table
function ComparisonTableRow({ 
    label, 
    presentValue, 
    proposedValue, 
    sublabel,
    presentEditable, 
    presentEditValue, 
    onPresentEdit,
    proposedEditable, 
    proposedEditValue, 
    onProposedEdit,
    disabled,
    isFloat,
    suffix,
    muted,
    presentHighlight,
    proposedHighlight
}) {
    const [editingPresent, setEditingPresent] = useState(false);
    const [editingProposed, setEditingProposed] = useState(false);
    const [tempPresentValue, setTempPresentValue] = useState(presentEditValue);
    const [tempProposedValue, setTempProposedValue] = useState(proposedEditValue);
    
    const handlePresentBlur = () => {
        setEditingPresent(false);
        if (onPresentEdit) {
            onPresentEdit(isFloat ? parseFloat(tempPresentValue) || 0 : parseInt(tempPresentValue) || 0);
        }
    };
    
    const handleProposedBlur = () => {
        setEditingProposed(false);
        if (onProposedEdit) {
            onProposedEdit(isFloat ? parseFloat(tempProposedValue) || 0 : parseInt(tempProposedValue) || 0);
        }
    };
    
    const highlightStyles = {
        primary: "text-alternativePrimary font-semibold",
        success: "text-success font-semibold",
        danger: "text-danger font-semibold",
    };
    
    return (
        <tr className="border-b border-neutral-l4 hover:bg-neutral-l5/30">
            {/* Present Value */}
            <td className="py-2 px-3 text-right">
                {editingPresent ? (
                    <div className="flex items-center justify-end gap-1">
                        <input
                            type="text"
                            value={tempPresentValue}
                            onChange={(e) => setTempPresentValue(e.target.value.replace(/[^0-9.]/g, ''))}
                            onBlur={handlePresentBlur}
                            onKeyDown={(e) => e.key === 'Enter' && handlePresentBlur()}
                            autoFocus
                            className="w-16 text-xs font-medium text-right py-0.5 px-1 border border-alternativePrimary rounded outline-none"
                        />
                        {suffix && <span className="text-[10px] text-neutral-l1">{suffix}</span>}
                    </div>
                ) : (
                    <span 
                        className={cn(
                            "text-sm",
                            presentHighlight ? highlightStyles[presentHighlight] : muted ? "text-neutral-l1" : "text-neutral-d3 font-medium",
                            presentEditable && !disabled && "cursor-pointer hover:text-alternativePrimary"
                        )}
                        onClick={() => {
                            if (presentEditable && !disabled) {
                                setTempPresentValue(presentEditValue);
                                setEditingPresent(true);
                            }
                        }}
                    >
                        {presentValue}
                        {presentEditable && !disabled && <Edit3 size={10} className="inline ml-1 opacity-30" />}
                    </span>
                )}
            </td>
            
            {/* Label */}
            <td className="py-2 px-3 text-center">
                <span className={cn("text-xs font-medium", muted ? "text-neutral-l1" : "text-neutral-d2")}>{label}</span>
                {sublabel && <span className="text-[9px] text-neutral-l1 block">{sublabel}</span>}
            </td>
            
            {/* Proposed Value */}
            <td className="py-2 px-3 text-left">
                {editingProposed ? (
                    <div className="flex items-center gap-1">
                        <input
                            type="text"
                            value={tempProposedValue}
                            onChange={(e) => setTempProposedValue(e.target.value.replace(/[^0-9.]/g, ''))}
                            onBlur={handleProposedBlur}
                            onKeyDown={(e) => e.key === 'Enter' && handleProposedBlur()}
                            autoFocus
                            className="w-16 text-xs font-medium py-0.5 px-1 border border-alternativePrimary rounded outline-none"
                        />
                        {suffix && <span className="text-[10px] text-neutral-l1">{suffix}</span>}
                    </div>
                ) : (
                    <span 
                        className={cn(
                            "text-sm",
                            proposedHighlight ? highlightStyles[proposedHighlight] : muted ? "text-neutral-l1" : "text-alternativePrimary font-medium",
                            proposedEditable && !disabled && "cursor-pointer hover:text-alternativePrimary-d2"
                        )}
                        onClick={() => {
                            if (proposedEditable && !disabled) {
                                setTempProposedValue(proposedEditValue);
                                setEditingProposed(true);
                            }
                        }}
                    >
                        {proposedValue}
                        {proposedEditable && !disabled && <Edit3 size={10} className="inline ml-1 opacity-30" />}
                    </span>
                )}
            </td>
        </tr>
    );
}

// Compact Debt Item for horizontal layout
function DebtItemCompact({ name, balance, payment, selected, onToggle, disabled }) {
    const paymentNum = parseFloat(payment.replace(/[$,]/g, '')) || 0;
    const balanceNum = parseFloat(balance.replace(/[$,]/g, '')) || 0;
    
    return (
        <label className={cn(
            "flex items-center gap-2 p-1.5 rounded transition-all text-[11px]",
            selected ? "bg-alternativePrimary-l4/50" : "hover:bg-neutral-l5",
            disabled && "cursor-default opacity-60"
        )}>
            <input type="checkbox" checked={selected} onChange={onToggle} disabled={disabled} className="h-3 w-3 rounded border-neutral-l2 text-alternativePrimary" />
            <span className="flex-1 truncate text-neutral-d2">{name}</span>
            <span className="font-medium text-neutral-d3">${paymentNum.toLocaleString()}</span>
        </label>
    );
}

// Benefit Card - prominent value proposition display
function BenefitCard({ icon, title, value, sublabel, selected, onSelect, onViewChart, recommended, color = "primary" }) {
    const colorStyles = {
        success: { border: "border-success", bg: "bg-success-l4", text: "text-success-d2" },
        danger: { border: "border-danger", bg: "bg-danger-l4", text: "text-danger-d2" },
        warning: { border: "border-warning", bg: "bg-warning-l4", text: "text-warning-d2" },
        primary: { border: "border-alternativePrimary", bg: "bg-alternativePrimary-l4", text: "text-alternativePrimary" },
    };
    
    const styles = colorStyles[color];
    
    return (
        <div 
            className={cn(
                "relative rounded-lg border-2 p-3 transition-all cursor-pointer",
                selected ? `${styles.border} ${styles.bg}` : "border-neutral-l3 bg-white hover:border-neutral-l2 hover:shadow-sm"
            )} 
            onClick={onSelect}
        >
            {/* Selection checkbox */}
            <div className={cn(
                "absolute top-2 right-2 w-4 h-4 rounded border-2 flex items-center justify-center transition-all",
                selected ? `${styles.border} ${styles.bg}` : "border-neutral-l2"
            )}>
                {selected && <Check size={10} className={styles.text} />}
            </div>
            
            {/* Recommended badge */}
            {recommended && (
                <span className="absolute top-2 left-2 text-[8px] bg-success text-white px-1.5 py-0.5 rounded font-medium">
                    Rec
                </span>
            )}
            
            {/* Content */}
            <div className="flex items-start gap-2 mt-1">
                <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0", selected ? styles.bg : "bg-neutral-l4")}>
                    <span className={selected ? styles.text : "text-neutral-l1"}>{icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-neutral-d3 text-xs leading-tight">{title}</h4>
                    <p className={cn("text-lg font-bold leading-tight", selected ? styles.text : "text-neutral-d3")}>{value}</p>
                    <p className="text-[10px] text-neutral-l1 truncate">{sublabel}</p>
                </div>
            </div>
            
            {/* View Chart Button */}
            <button
                onClick={(e) => { e.stopPropagation(); onViewChart(); }}
                className="mt-2 w-full py-1.5 bg-neutral-d3 text-white rounded text-[10px] font-medium hover:bg-neutral-d2 transition-colors flex items-center justify-center gap-1"
            >
                <ExternalLink size={10} />
                View Chart
            </button>
        </div>
    );
}
