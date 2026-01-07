import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
    Calculator, X, Play, RefreshCw, Check, TrendingUp, ChevronRight, ExternalLink,
    FileText, Clock, Plus, Download, Lock, Sparkles, Home, DollarSign, Calendar,
    ChevronDown, ChevronUp, ListChecks, Wallet
} from 'lucide-react';
import { cn } from '../../lib/utils';

const fmt = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n || 0);
const PROGRAMS = ['Conventional', 'FHA', 'VA', 'FHA Streamline', 'VA IRRRL'];

// Max LTV by program
const MAX_LTV = {
    'Conventional': 80,
    'FHA': 97,
    'VA': 100,
    'FHA Streamline': 97,
    'VA IRRRL': 100
};

// Rate options returned after pricing (simulated)
const RATE_OPTIONS = [
    { rate: 6.625, points: 1.0, cost: 5250, label: '1 Point', type: 'points' },
    { rate: 6.875, points: 0.5, cost: 2625, label: '0.5 Points', type: 'points' },
    { rate: 7.0, points: 0, cost: 0, label: 'Par Rate', type: 'par' },
    { rate: 7.125, points: -0.5, cost: -2625, label: '$2,625 Credit', type: 'credit' },
    { rate: 7.375, points: -1.0, cost: -5250, label: '$5,250 Credit', type: 'credit' },
];

export function GoodLeapAdvantageTabs({ accounts = [], borrowerData, onExit, onViewChart, onGenerateProposal, onAccountToggle, onToggleAll, onAccountUpdate, onUpdateFlyoverData, openChartType }) {
    const [isPriced, setIsPriced] = useState(false);
    const [isRunningPricing, setIsRunningPricing] = useState(false);
    const [program, setProgram] = useState('Conventional');
    const [selectedRateOption, setSelectedRateOption] = useState(2);
    const [selectedLTV, setSelectedLTV] = useState(null); // null = use calculated minimum
    const [manualCashout, setManualCashout] = useState(null); // null = use calculated cashout
    const [goodLeapSelected, setGoodLeapSelected] = useState(true);
    const [includeEscrow, setIncludeEscrow] = useState(true);
    const [currentMIP, setCurrentMIP] = useState(0);
    const [currentPI, setCurrentPI] = useState(1710);
    const [currentTaxes, setCurrentTaxes] = useState(450);
    const [currentInsurance, setCurrentInsurance] = useState(120);
    const [currentBalance, setCurrentBalance] = useState(247500);
    const [currentRate, setCurrentRate] = useState(3.75);
    const [currentTerm, setCurrentTerm] = useState(30); // 15, 20, or 30 years
    const [propertyValue, setPropertyValue] = useState(borrowerData?.property?.avmValue || 950000);
    
    // GoodLeap loan fields (editable)
    const [glBalance, setGlBalance] = useState(42000);
    const [glPayment, setGlPayment] = useState(350);
    const [glRate, setGlRate] = useState(6.75);
    
    const [moduleSelections, setModuleSelections] = useState({
        'debt-consolidation': false, 'payment-savings': false, 'cash-back': false, 'break-even': false, 'accelerated-payoff': false, 'compound-growth': false, 'cash-flow-window': false, 'disposable-income': false,
    });
    
    // Chart configurable parameters - inline adjustable
    const [compoundRate, setCompoundRate] = useState(7);
    const [acceleratedPercent, setAcceleratedPercent] = useState(100);
    const [cashFlowMonths, setCashFlowMonths] = useState(2); // 1, 2, or 3 months
    const [grossIncome, setGrossIncome] = useState(12000);
    const [taxRate, setTaxRate] = useState(25);
    
    // Debts section collapsed state - collapses when pricing is complete
    const [isDebtsCollapsed, setIsDebtsCollapsed] = useState(false);
    
    // Track if initial render to avoid resetting on mount
    const isInitialMount = useRef(true);
    const prevAccountsRef = useRef(accounts);
    
    // Reset pricing when configuration changes
    const resetPricing = () => {
        if (isPriced) {
            setIsPriced(false);
            setIsDebtsCollapsed(false); // Expand debts when pricing is reset
            setModuleSelections({
                'debt-consolidation': false, 'payment-savings': false, 'cash-back': false, 
                'break-even': false, 'accelerated-payoff': false, 'compound-growth': false, 'cash-flow-window': false, 'disposable-income': false,
            });
        }
    };
    
    // Auto-collapse debts section when pricing completes
    useEffect(() => {
        if (isPriced) {
            setIsDebtsCollapsed(true);
        }
    }, [isPriced]);
    
    // Detect account selection changes (willPay changes from parent)
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            prevAccountsRef.current = accounts;
            return;
        }
        
        // Check if any willPay values changed
        const prevAccounts = prevAccountsRef.current;
        const hasChanged = accounts.some((acc, i) => {
            const prev = prevAccounts.find(p => p.id === acc.id);
            return prev && prev.willPay !== acc.willPay;
        });
        
        if (hasChanged) {
            resetPricing();
        }
        
        prevAccountsRef.current = accounts;
    }, [accounts]);
    
    // Wrapper functions that reset pricing when called
    const updateProgram = (newProgram) => {
        setProgram(newProgram);
        setSelectedLTV(null);
        resetPricing();
    };
    
    const updateLTV = (newLTV) => {
        setSelectedLTV(newLTV);
        resetPricing();
    };
    
    const updateGoodLeapSelected = (selected) => {
        setGoodLeapSelected(selected);
        resetPricing();
    };
    
    const updateEscrow = (include) => {
        setIncludeEscrow(include);
        resetPricing();
    };
    
    const updateManualCashout = (cashout) => {
        setManualCashout(cashout);
        resetPricing();
    };

    const closingCosts = 8057;
    const maxLTV = MAX_LTV[program] || 80;
    
    const calculatePIFromBalance = (balance, rate, termYears = 30) => {
        const r = rate / 100 / 12;
        const n = termYears * 12;
        return Math.round(balance * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
    };
    
    // Reverse calculation: given P&I, calculate Balance
    const calculateBalanceFromPI = (pi, rate, termYears = 30) => {
        const r = rate / 100 / 12;
        const n = termYears * 12;
        // Balance = P&I × ((1+r)^n - 1) / (r × (1+r)^n)
        return Math.round(pi * (Math.pow(1 + r, n) - 1) / (r * Math.pow(1 + r, n)));
    };
    const goodLeapLoan = { product: 'Solar Installation', loanNumber: 'CF-1234567', balance: glBalance, payment: glPayment, rate: glRate };
    
    const parseAmount = (val) => typeof val === 'number' ? val : parseFloat(String(val).replace(/[$,]/g, '')) || 0;

    const calc = useMemo(() => {
        const sel = accounts.filter(a => a.willPay);
        let totalBal = sel.reduce((s, a) => s + parseAmount(a.balance), 0);
        let totalPmt = sel.reduce((s, a) => s + parseAmount(a.payment), 0);
        if (goodLeapSelected) { totalBal += goodLeapLoan.balance; totalPmt += goodLeapLoan.payment; }
        
        // "Other debts" = ALL selected payments MINUS the primary mortgage P&I
        // This includes secondary mortgages, HELOCs, and all other debts being paid off
        // The primary mortgage P&I is shown separately in the comparison table
        const other = totalPmt - currentPI;
        
        const currentEscrow = includeEscrow ? currentTaxes + currentInsurance : 0;
        const proposedEscrow = includeEscrow ? currentTaxes + currentInsurance : 0;
        return { 
            count: sel.length + (goodLeapSelected ? 1 : 0), 
            totalBal, 
            totalPmt, 
            other, 
            escrow: proposedEscrow, 
            currentEscrow, 
            currentTotal: currentPI + currentEscrow + currentMIP + other, 
            currentPI,
            currentTaxes,
            currentInsurance
        };
    }, [accounts, goodLeapSelected, includeEscrow, currentMIP, currentPI, currentTaxes, currentInsurance, glBalance, glPayment]);

    const selectedRateData = RATE_OPTIONS[selectedRateOption];
    const minLTV = Math.max(50, Math.ceil((calc.totalBal / propertyValue) * 100));
    
    // LTV presets - 65%, 75%, 80%, Max (program-specific)
    const ltvPresets = [65, 75, 80, maxLTV].filter(ltv => ltv >= minLTV);
    const activeLTV = selectedLTV || minLTV;
    
    const loan = useMemo(() => {
        let baseLoanAmt, cashout, ltv;
        
        if (manualCashout !== null) {
            // User manually set cashout - calculate loan from debts + cashout
            cashout = manualCashout;
            baseLoanAmt = calc.totalBal + cashout;
            // Calculate effective LTV from the manual loan amount
            ltv = Math.round((baseLoanAmt / propertyValue) * 100);
        } else {
            // Use LTV-based calculation
            ltv = activeLTV;
            baseLoanAmt = Math.round((ltv / 100) * propertyValue);
            cashout = Math.max(0, baseLoanAmt - calc.totalBal);
        }
        
        const isFHA = program === 'FHA' || program === 'FHA Streamline';
        const ufmip = isFHA ? Math.round(baseLoanAmt * 0.0175) : 0;
        const amt = baseLoanAmt + ufmip;
        const rate = isPriced ? selectedRateData.rate : 7.0;
        const r = rate / 100 / 12, n = 360;
        const pi = Math.round(amt * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
        
        let monthlyMI = 0;
        let miLabel = '';
        
        if (isFHA) {
            monthlyMI = Math.round((amt * 0.0055) / 12);
            miLabel = 'MIP';
        } else if (program === 'Conventional' && ltv > 80) {
            const pmiRate = ltv > 95 ? 0.01 : ltv > 90 ? 0.008 : 0.005;
            monthlyMI = Math.round((baseLoanAmt * pmiRate) / 12);
            miLabel = 'PMI';
        }
        
        const proposed = pi + calc.escrow + monthlyMI;
        const savings = calc.currentTotal - proposed;
        const pointsCost = isPriced ? selectedRateData.cost : 0;
        
        return { 
            amt, 
            baseLoanAmt,
            cashout,
            ufmip,
            ltv, 
            pi, 
            proposed, 
            savings, 
            breakEven: savings > 0 ? Math.ceil((closingCosts + Math.max(0, pointsCost)) / savings) : 0, 
            rate, 
            monthlyMI, 
            miLabel,
            pointsCost 
        };
    }, [calc, activeLTV, propertyValue, isPriced, selectedRateData, program, manualCashout]);

    const handlePrice = () => { 
        setIsRunningPricing(true); 
        setTimeout(() => { 
            setIsRunningPricing(false); 
            setIsPriced(true); 
            setModuleSelections(p => ({ ...p, 'debt-consolidation': true, 'payment-savings': loan.savings > 0 })); 
        }, 800); 
    };
    const MAX_CHARTS = 2;
    const toggle = (id) => setModuleSelections(p => {
        const isCurrentlySelected = p[id];
        const currentCount = Object.values(p).filter(Boolean).length;
        // If trying to select and already at max, don't allow
        if (!isCurrentlySelected && currentCount >= MAX_CHARTS) {
            return p; // Don't change - already at max
        }
        return { ...p, [id]: !p[id] };
    });
    const selCount = Object.values(moduleSelections).filter(Boolean).length;
    const selectedChartIds = Object.entries(moduleSelections).filter(([_, v]) => v).map(([k]) => k);
    const allSel = accounts.every(a => a.willPay);
    const someSel = accounts.some(a => a.willPay);
    
    // Calculate debts NOT being paid off
    const debtsNotPaid = accounts.filter(a => !a.willPay);
    const debtsNotPaidPayment = debtsNotPaid.reduce((s, a) => s + parseAmount(a.payment), 0);
    
    // Build comprehensive chart data for all charts
    // Current payments: Mortgage P&I + Escrow + MI + Other Debts = Total current monthly
    // Other Debts = all selected debt payments EXCEPT the primary mortgage (calc.other)
    const buildChartData = () => ({
        // Accounts data
        accounts: [...accounts.filter(a => a.willPay), ...(goodLeapSelected ? [{ ...goodLeapLoan, creditor: goodLeapLoan.loanNumber, accountType: goodLeapLoan.product, willPay: true }] : [])],
        accountsNotPaid: debtsNotPaid,
        
        // Current breakdown - what borrower pays TODAY
        currentMortgagePI: currentPI,                    // Primary mortgage P&I only (e.g., $1,710)
        currentEscrow: calc.currentEscrow,               // Taxes + Insurance (e.g., $570)
        currentMI: currentMIP,                           // Current MIP/PMI if any
        debtsPaidOff: calc.other,                        // Other debts being paid off (e.g., $2,446) = totalPmt - currentPI
        debtsRemaining: debtsNotPaidPayment,             // Debts NOT selected for payoff
        
        // Current loan info
        currentRate: currentRate,
        currentTerm: currentTerm,                        // 10, 15, 20, or 30 years
        
        // Proposed breakdown
        proposedPI: loan.pi,
        proposedEscrow: calc.escrow,
        proposedMI: loan.monthlyMI,
        
        // Totals
        currentTotal: calc.currentTotal,
        proposedTotal: loan.proposed + debtsNotPaidPayment, // Include remaining debts in proposed
        monthlySavings: loan.savings,  // Direct savings (currentTotal - proposed) for compound growth
        annualSavings: loan.savings * 12,
        
        // Loan details
        newLoanAmount: loan.amt,
        ltv: loan.ltv,
        cashout: loan.cashout,
        rate: loan.rate,
        term: 30,                                        // Proposed term (30 years)
        breakEvenMonths: loan.breakEven,
        closingCosts: closingCosts + Math.max(0, loan.pointsCost),
        
        // Counts
        debtsCount: calc.count,
        debtsPayoff: calc.totalBal,
        debtsMonthlyPayment: calc.totalPmt,
        
        // Chart configuration - inline adjustable values
        chartConfig: {
            compoundRate,
            acceleratedPercent,
            cashFlowMonths,
            grossIncome,
            taxRate,
        }
    });
    
    const handleViewChart = (chartType) => {
        onViewChart?.(chartType, buildChartData());
    };
    
    // Real-time sync: update flyover data when inline controls change
    useEffect(() => {
        if (openChartType && onUpdateFlyoverData && isPriced) {
            // Only sync if the open chart has inline controls that changed
            const chartsWithConfig = ['accelerated-payoff', 'compound-growth', 'cash-flow-window', 'disposable-income'];
            if (chartsWithConfig.includes(openChartType)) {
                onUpdateFlyoverData(buildChartData());
            }
        }
    }, [openChartType, acceleratedPercent, compoundRate, cashFlowMonths, grossIncome, taxRate, isPriced]);

    return (
        <div className="h-full flex flex-col bg-stone-50">
            {/* Header - Clean */}
            <div className="px-6 py-3 border-b border-stone-200 flex items-center justify-between bg-white">
                <h3 className="text-stone-800 font-semibold">GoodLeap Advantage</h3>
                <div className="flex items-center gap-3">
                    <button disabled={selCount === 0} onClick={() => onGenerateProposal?.(selectedChartIds, buildChartData())} className={cn("flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl transition-all", selCount > 0 ? "bg-amber-500 hover:bg-amber-600 text-white shadow-sm" : "bg-stone-100 text-stone-400")}>
                        <Download size={16} /> Generate {selCount > 0 && `(${selCount})`}
                    </button>
                    <button onClick={onExit} className="p-2 hover:bg-stone-100 rounded-lg text-stone-500"><X size={18} /></button>
                </div>
            </div>
            
            {/* Progress Steps - Prominent guidance bar */}
            <div className="px-6 py-3 bg-gradient-to-r from-stone-100 to-stone-50 border-b border-stone-200">
                <div className="flex items-center justify-center gap-3">
                    <StepPill num={1} label="Select Debts" done={calc.count > 0} active={!isPriced && calc.count === 0} />
                    <div className={cn("w-12 h-0.5 rounded-full transition-colors", isPriced ? "bg-teal-400" : "bg-stone-300")} />
                    <StepPill num={2} label="Price Loan" done={isPriced} active={!isPriced && calc.count > 0} />
                    <div className={cn("w-12 h-0.5 rounded-full transition-colors", selCount > 0 ? "bg-teal-400" : "bg-stone-300")} />
                    <StepPill num={3} label="Generate Proposal" done={false} active={selCount > 0} />
                </div>
            </div>

            {/* 3-Column Layout */}
            <div className="flex-1 flex overflow-hidden">
                {/* LEFT: Debts Table - Collapsible */}
                <div className={cn(
                    "border-r border-stone-200 bg-white overflow-auto transition-all duration-300",
                    isDebtsCollapsed ? "w-[200px] flex-shrink-0" : "flex-1"
                )}>
                    <div className="p-4">
                        {/* Header with collapse toggle */}
                        <div className="flex items-center justify-between mb-3">
                            <button 
                                onClick={() => setIsDebtsCollapsed(!isDebtsCollapsed)}
                                className="flex items-center gap-2 hover:bg-stone-100 rounded-lg px-2 py-1 -ml-2 transition-colors"
                            >
                                {isDebtsCollapsed ? <ChevronDown size={16} className="text-stone-500" /> : <ChevronUp size={16} className="text-stone-500" />}
                                <h4 className="text-stone-800 font-medium">Debts to Pay Off</h4>
                            </button>
                            <span className="bg-amber-100 text-amber-700 text-xs font-semibold px-2.5 py-1 rounded-full">{calc.count} Selected</span>
                        </div>

                        {/* Collapsed View - Summary Only */}
                        {isDebtsCollapsed ? (
                            <div className="space-y-3">
                                {/* Mini Summary */}
                                <div className="p-3 bg-stone-100 rounded-xl">
                                    <div className="flex items-center gap-2 mb-2">
                                        <ListChecks size={14} className="text-stone-500" />
                                        <span className="text-xs text-stone-500 font-medium">Selected Debts</span>
                                    </div>
                                    <p className="text-lg font-bold text-stone-800">{fmt(calc.totalBal)}</p>
                                    <p className="text-sm text-teal-600 font-medium">-{fmt(calc.totalPmt)}/mo</p>
                                </div>
                                
                                {/* Expand Button */}
                                <button 
                                    onClick={() => setIsDebtsCollapsed(false)}
                                    className="w-full py-2 text-xs font-medium text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors flex items-center justify-center gap-1"
                                >
                                    <ChevronDown size={14} />
                                    View All Debts
                                </button>
                            </div>
                        ) : (
                            <>
                                {/* GoodLeap Loan - Editable */}
                                <div className="border border-sky-200 rounded-xl overflow-hidden bg-white mb-3">
                                    <div className="flex items-center gap-2 px-3 py-2 bg-sky-50 text-sky-700">
                                        <Home size={14} />
                                        <p className="font-medium text-sm">GoodLeap Loan</p>
                                    </div>
                                    <div className={cn("px-3 py-2.5 text-sm transition-colors", goodLeapSelected && "bg-amber-50/50")}>
                                        <div className="flex items-center justify-between mb-2">
                                            <div>
                                                <p className="font-medium text-stone-800">{goodLeapLoan.loanNumber}</p>
                                                <p className="text-xs text-stone-500">{goodLeapLoan.product}</p>
                                            </div>
                                            <input type="checkbox" checked={goodLeapSelected} onChange={() => updateGoodLeapSelected(!goodLeapSelected)} className="h-4 w-4 rounded cursor-pointer accent-amber-500" />
                                        </div>
                                        <div className="grid grid-cols-3 gap-2 text-xs">
                                            <div>
                                                <label className="text-stone-400 block mb-0.5">Balance</label>
                                                <div className="flex items-center">
                                                    <span className="text-stone-400 mr-0.5">$</span>
                                                    <input 
                                                        type="text" 
                                                        value={glBalance.toLocaleString()}
                                                        onChange={(e) => { setGlBalance(parseInt(e.target.value.replace(/,/g, '')) || 0); resetPricing(); }}
                                                        className="w-full px-1.5 py-1 border border-stone-200 rounded text-right text-xs font-medium focus:border-amber-400 focus:outline-none"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-stone-400 block mb-0.5">Payment</label>
                                                <div className="flex items-center">
                                                    <span className="text-stone-400 mr-0.5">$</span>
                                                    <input 
                                                        type="text" 
                                                        value={glPayment.toLocaleString()}
                                                        onChange={(e) => { setGlPayment(parseInt(e.target.value.replace(/,/g, '')) || 0); resetPricing(); }}
                                                        className="w-full px-1.5 py-1 border border-stone-200 rounded text-right text-xs font-medium focus:border-amber-400 focus:outline-none"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-stone-400 block mb-0.5">Rate</label>
                                                <div className="flex items-center">
                                                    <input 
                                                        type="text" 
                                                        value={glRate}
                                                        onChange={(e) => { setGlRate(parseFloat(e.target.value) || 0); resetPricing(); }}
                                                        className="w-full px-1.5 py-1 border border-stone-200 rounded text-right text-xs font-medium focus:border-amber-400 focus:outline-none"
                                                    />
                                                    <span className="text-stone-400 ml-0.5">%</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Accounts Table */}
                                <div className="rounded-xl bg-white border border-stone-200 overflow-hidden">
                                    <table className="w-full text-sm">
                                        <thead className="bg-stone-50">
                                            <tr>
                                                <th className="px-3 py-2.5 text-left text-sm font-medium text-stone-600">Creditor</th>
                                                <th className="px-2 py-2.5 text-right text-sm font-medium text-stone-600">Balance</th>
                                                <th className="px-2 py-2.5 text-right text-sm font-medium text-stone-600">Payment</th>
                                                <th className="px-2 py-2.5 text-right text-sm font-medium text-stone-600">Rate</th>
                                                <th className="px-2 py-2.5 text-center text-sm font-medium text-stone-600">
                                                    <div className="flex items-center justify-center gap-1">
                                                        Pay
                                                        <input type="checkbox" checked={allSel} ref={el => { if (el) el.indeterminate = someSel && !allSel; }} onChange={(e) => onToggleAll(e.target.checked)} className="h-4 w-4 rounded cursor-pointer accent-amber-500" />
                                                    </div>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {accounts.map((acc) => (
                                                <tr key={acc.id} className={cn("border-t border-stone-100 hover:bg-stone-50 transition-colors", acc.willPay && "bg-amber-50/50")}>
                                                    <td className="px-3 py-2.5 cursor-pointer" onClick={() => onAccountToggle(acc.id)}>
                                                        <p className="font-medium text-stone-800">{acc.creditor}</p>
                                                        <p className="text-xs text-stone-500">{acc.accountType}</p>
                                                    </td>
                                                    <td className="px-1 py-1.5 text-right" onClick={e => e.stopPropagation()}>
                                                        <input 
                                                            type="text"
                                                            value={acc.balance}
                                                            onChange={(e) => onAccountUpdate?.(acc.id, 'balance', e.target.value)}
                                                            className="w-20 px-1.5 py-1 text-right text-sm font-medium text-stone-700 bg-white border border-stone-200 rounded focus:border-amber-400 focus:outline-none hover:border-stone-300"
                                                        />
                                                    </td>
                                                    <td className="px-1 py-1.5 text-right" onClick={e => e.stopPropagation()}>
                                                        <input 
                                                            type="text"
                                                            value={acc.payment}
                                                            onChange={(e) => onAccountUpdate?.(acc.id, 'payment', e.target.value)}
                                                            className="w-16 px-1.5 py-1 text-right text-sm font-medium text-stone-700 bg-white border border-stone-200 rounded focus:border-amber-400 focus:outline-none hover:border-stone-300"
                                                        />
                                                    </td>
                                                    <td className="px-1 py-1.5 text-right" onClick={e => e.stopPropagation()}>
                                                        <input 
                                                            type="text"
                                                            value={acc.rate || ''}
                                                            placeholder="—"
                                                            onChange={(e) => onAccountUpdate?.(acc.id, 'rate', e.target.value)}
                                                            className="w-14 px-1.5 py-1 text-right text-sm text-stone-500 bg-white border border-stone-200 rounded focus:border-amber-400 focus:outline-none hover:border-stone-300"
                                                        />
                                                    </td>
                                                    <td className="px-2 py-2.5 text-center" onClick={e => e.stopPropagation()}>
                                                        <input type="checkbox" checked={acc.willPay} onChange={() => onAccountToggle(acc.id)} className="h-4 w-4 rounded cursor-pointer accent-amber-500" />
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Summary */}
                                <div className="mt-3 p-3 bg-stone-100 rounded-xl flex items-center justify-between">
                                    <div>
                                        <p className="text-xs text-stone-500">Total Payoff</p>
                                        <p className="text-lg font-bold text-stone-800">{fmt(calc.totalBal)}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-stone-500">Eliminated</p>
                                        <p className="text-lg font-bold text-teal-600">-{fmt(calc.totalPmt)}/mo</p>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* CENTER: Loan Configuration */}
                <div className="flex-1 border-r border-stone-200 bg-stone-50 overflow-auto min-w-0">
                    <div className="p-4 space-y-3">
                        {/* Config Card */}
                        <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-sm">
                            <div className="flex items-center gap-2 mb-3">
                                <Calculator size={16} className="text-stone-500" />
                                <span className="font-medium text-stone-800">Loan Configuration</span>
                            </div>
                            
                            {/* Property Value - Editable */}
                            <div className="mb-3 p-2.5 bg-stone-50 rounded-lg border border-stone-200">
                                <div className="flex items-center justify-between">
                                    <label className="text-xs text-stone-500 font-medium">Property Value (AVM)</label>
                                    <div className="flex items-center gap-1">
                                        <span className="text-stone-400 text-sm">$</span>
                                        <input 
                                            type="text"
                                            value={propertyValue.toLocaleString()}
                                            onChange={(e) => {
                                                const val = parseInt(e.target.value.replace(/,/g, '')) || 0;
                                                setPropertyValue(val);
                                                resetPricing();
                                            }}
                                            className="w-28 px-2 py-1 text-right text-sm font-bold text-stone-800 border border-stone-200 rounded-lg focus:border-amber-400 focus:outline-none"
                                        />
                                    </div>
                                </div>
                            </div>
                            
                            {/* Programs - Warm pill style */}
                            <div className="flex flex-wrap gap-1.5 mb-3">
                                {PROGRAMS.map(p => (
                                    <button key={p} onClick={() => updateProgram(p)} className={cn("px-3 py-1.5 text-xs font-medium rounded-full transition-all", program === p ? "bg-stone-800 text-white" : "bg-stone-100 text-stone-600 hover:bg-stone-200")}>{p}</button>
                                ))}
                            </div>
                            
                            {/* Term & Rate */}
                            <div className="grid grid-cols-2 gap-3 mb-3">
                                <div>
                                    <label className="text-xs text-stone-500 font-medium">Term</label>
                                    <div className="flex gap-1 mt-1">
                                        {[30, 20, 15, 10].map(t => (
                                            <button key={t} className={cn("flex-1 py-1.5 text-xs font-medium rounded-lg transition-all", t === 30 ? "bg-stone-800 text-white" : "bg-stone-100 text-stone-600 hover:bg-stone-200")}>{t}</button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs text-stone-500 font-medium">Rate</label>
                                    {isPriced ? (
                                        <p className="mt-1 py-1.5 text-lg font-bold text-amber-600">{selectedRateData.rate.toFixed(3)}%</p>
                                    ) : (
                                        <div className="mt-1 py-1.5 px-3 bg-stone-100 rounded-lg text-sm text-stone-400 flex items-center gap-2">
                                            <Lock size={12} /> Price to see rates
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Rate Options - After pricing - Clear UI */}
                            {isPriced && (
                                <div className="mt-3 -mx-4 -mb-4 p-4 bg-gradient-to-r from-amber-50 to-orange-50 border-t-2 border-amber-300 rounded-b-xl">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                                            <label className="text-sm font-semibold text-amber-800">Select Your Rate</label>
                                        </div>
                                        <span className="text-xs bg-amber-200 text-amber-800 px-2 py-0.5 rounded-full">Step 2 of 3</span>
                                    </div>
                                    <div className="grid grid-cols-5 gap-1.5">
                                        {RATE_OPTIONS.map((opt, i) => {
                                            // Calculate P&I payment for this rate option
                                            const r = opt.rate / 100 / 12;
                                            const n = 360;
                                            const payment = Math.round(loan.amt * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
                                            
                                            return (
                                                <button
                                                    key={i}
                                                    onClick={() => setSelectedRateOption(i)}
                                                    className={cn(
                                                        "p-2 rounded-lg border-2 text-center transition-all",
                                                        selectedRateOption === i 
                                                            ? "border-amber-500 bg-white ring-2 ring-amber-200 shadow-md" 
                                                            : "border-transparent bg-white/80 hover:bg-white hover:border-amber-200"
                                                    )}
                                                >
                                                    {/* Payment - Most important, shown first */}
                                                    <p className={cn(
                                                        "text-base font-bold mb-0.5",
                                                        selectedRateOption === i ? "text-amber-700" : "text-stone-800"
                                                    )}>
                                                        ${payment.toLocaleString()}
                                                    </p>
                                                    {/* Rate */}
                                                    <p className={cn(
                                                        "text-sm font-semibold",
                                                        selectedRateOption === i ? "text-amber-600" : "text-stone-600"
                                                    )}>
                                                        {opt.rate.toFixed(3)}%
                                                    </p>
                                                    {/* Points/Credit - Both % and $ */}
                                                    <div className="mt-1 pt-1 border-t border-stone-200/50">
                                                        <p className={cn(
                                                            "text-[10px] font-medium leading-tight",
                                                            opt.type === 'credit' ? "text-teal-600" : opt.type === 'points' ? "text-rose-500" : "text-stone-400"
                                                        )}>
                                                            {opt.type === 'points' && `${opt.points} Pts`}
                                                            {opt.type === 'credit' && `${Math.abs(opt.points)} Pts Credit`}
                                                            {opt.type === 'par' && 'Par Rate'}
                                                        </p>
                                                        {opt.type !== 'par' && (
                                                            <p className={cn(
                                                                "text-[9px] font-medium",
                                                                opt.type === 'credit' ? "text-teal-500" : "text-rose-400"
                                                            )}>
                                                                {opt.type === 'credit' ? '+' : '-'}${Math.abs(opt.cost).toLocaleString()}
                                                            </p>
                                                        )}
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                            
                            {/* LTV Preset Buttons - More granular options */}
                            <div className="border-t border-stone-100 pt-3">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm text-stone-600">Select LTV</span>
                                    <span className="text-lg font-bold text-amber-600">{loan.ltv}%</span>
                                </div>
                                
                                <div className="grid grid-cols-8 gap-1 mb-3">
                                    {[50, 55, 60, 65, 70, 75, 80].map(ltv => (
                                        <button
                                            key={ltv}
                                            onClick={() => { updateLTV(ltv >= minLTV ? ltv : minLTV); setManualCashout(null); }}
                                            disabled={ltv < minLTV}
                                            className={cn(
                                                "py-2 rounded-lg text-xs font-semibold transition-all",
                                                activeLTV === ltv && manualCashout === null
                                                    ? "bg-amber-500 text-white shadow-sm" 
                                                    : ltv < minLTV
                                                        ? "bg-stone-100 text-stone-300 cursor-not-allowed"
                                                        : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                                            )}
                                        >
                                            {ltv}%
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => { updateLTV(maxLTV); setManualCashout(null); }}
                                        className={cn(
                                            "py-2 rounded-lg text-xs font-semibold transition-all",
                                            activeLTV === maxLTV && manualCashout === null
                                                ? "bg-amber-500 text-white shadow-sm" 
                                                : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                                        )}
                                    >
                                        Max
                                    </button>
                                </div>

                                {/* Loan breakdown - Editable */}
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm text-stone-600">Loan Amount</span>
                                    <div className="flex items-center gap-1">
                                        <span className="text-lg font-bold text-stone-800">{fmt(loan.amt)}</span>
                                        {loan.ufmip > 0 && <span className="text-[10px] text-sky-600">(+{fmt(loan.ufmip)} UFMIP)</span>}
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-3 gap-2">
                                    {/* Loan - Editable (updates cashout) */}
                                    <div className="bg-stone-50 rounded-lg p-2">
                                        <p className="text-[10px] text-stone-500 uppercase mb-1">Loan</p>
                                        <div className="flex items-center">
                                            <span className="text-stone-400 text-sm">$</span>
                                            <input 
                                                type="text"
                                                value={loan.baseLoanAmt.toLocaleString()}
                                                onChange={(e) => {
                                                    const val = parseInt(e.target.value.replace(/,/g, '')) || 0;
                                                    const newCashout = Math.max(0, val - calc.totalBal);
                                                    updateManualCashout(newCashout);
                                                }}
                                                className="w-full font-bold text-stone-800 bg-transparent border-none focus:outline-none text-sm"
                                            />
                                        </div>
                                    </div>
                                    {/* Debts - Read only (from selection) */}
                                    <div className="bg-stone-100 rounded-lg p-2">
                                        <p className="text-[10px] text-stone-500 uppercase mb-1">Debts</p>
                                        <p className="font-bold text-stone-800 text-sm">{fmt(calc.totalBal)}</p>
                                        <p className="text-[8px] text-stone-400">From selection</p>
                                    </div>
                                    {/* Cashout - Editable (updates loan) */}
                                    <div className="bg-amber-50 rounded-lg p-2 border border-amber-200">
                                        <p className="text-[10px] text-amber-600 uppercase mb-1">Cashout</p>
                                        <div className="flex items-center">
                                            <span className="text-amber-500 text-sm">$</span>
                                            <input 
                                                type="text"
                                                value={loan.cashout.toLocaleString()}
                                                onChange={(e) => {
                                                    const val = parseInt(e.target.value.replace(/,/g, '')) || 0;
                                                    updateManualCashout(val);
                                                }}
                                                className="w-full font-bold text-amber-600 bg-transparent border-none focus:outline-none text-sm"
                                            />
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Reset to LTV-based calculation */}
                                {manualCashout !== null && (
                                    <button 
                                        onClick={() => setManualCashout(null)}
                                        className="mt-2 text-xs text-stone-500 hover:text-stone-700 underline"
                                    >
                                        Reset to LTV-based calculation
                                    </button>
                                )}
                                
                                {/* Extra Cashout @ 80% */}
                                {(() => {
                                    const maxLoanAt80 = Math.round(propertyValue * 0.80);
                                    const extraCashout = Math.max(0, maxLoanAt80 - loan.baseLoanAmt);
                                    return extraCashout > 0 && activeLTV < 80 ? (
                                        <div className="mt-2 p-2.5 bg-teal-50 border border-teal-200 rounded-lg flex items-center justify-between">
                                            <span className="text-sm text-teal-700">Extra Cashout @ 80%</span>
                                            <span className="text-lg font-bold text-teal-600">{fmt(extraCashout)}</span>
                                        </div>
                                    ) : null;
                                })()}
                            </div>
                        </div>

                        {/* Present vs Proposed */}
                        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-sm">
                            <div className="grid grid-cols-3 text-xs font-medium uppercase px-4 py-2.5 bg-stone-50 border-b border-stone-200">
                                <span className="text-stone-600">Present</span>
                                <span></span>
                                <span className="text-right text-amber-600">Proposed</span>
                            </div>
                            
                            {/* Calculate from Balance */}
                            <div className="px-4 py-2 bg-stone-50/50 border-b border-stone-100">
                                <div className="flex items-center gap-2 text-xs flex-wrap">
                                    <span className="text-stone-500">Calculate P&I from:</span>
                                    <div className="flex items-center gap-1">
                                        <span className="text-stone-400">$</span>
                                        <input 
                                            type="number" 
                                            value={currentBalance} 
                                            onChange={(e) => setCurrentBalance(parseInt(e.target.value) || 0)}
                                            className="w-20 px-1.5 py-1 border border-stone-200 rounded-lg text-xs text-right focus:border-amber-400 focus:outline-none"
                                        />
                                    </div>
                                    <span className="text-stone-400">@</span>
                                    <div className="flex items-center gap-1">
                                        <input 
                                            type="number" 
                                            step="0.125"
                                            value={currentRate} 
                                            onChange={(e) => setCurrentRate(parseFloat(e.target.value) || 0)}
                                            className="w-14 px-1.5 py-1 border border-stone-200 rounded-lg text-xs text-right focus:border-amber-400 focus:outline-none"
                                        />
                                        <span className="text-stone-400">%</span>
                                    </div>
                                    <span className="text-stone-400">for</span>
                                    <select 
                                        value={currentTerm}
                                        onChange={(e) => setCurrentTerm(parseInt(e.target.value))}
                                        className="px-1.5 py-1 border border-stone-200 rounded-lg text-xs bg-white focus:border-amber-400 focus:outline-none"
                                    >
                                        <option value={10}>10 yr</option>
                                        <option value={15}>15 yr</option>
                                        <option value={20}>20 yr</option>
                                        <option value={30}>30 yr</option>
                                    </select>
                                    <button 
                                        onClick={() => setCurrentPI(calculatePIFromBalance(currentBalance, currentRate, currentTerm))}
                                        className="px-2.5 py-1 bg-stone-800 text-white rounded-lg text-xs hover:bg-stone-700 transition-colors"
                                    >
                                        Calc
                                    </button>
                                </div>
                            </div>
                            
                            <div className="text-sm">
                                {/* P&I Row */}
                                <div className="grid grid-cols-3 items-center px-4 py-2.5 border-b border-stone-100">
                                    <div className="relative">
                                        <span className="absolute left-0 top-1/2 -translate-y-1/2 text-stone-500 text-sm">$</span>
                                        <input 
                                            type="number" 
                                            value={currentPI} 
                                            onChange={(e) => {
                                                const newPI = parseInt(e.target.value) || 0;
                                                setCurrentPI(newPI);
                                                // Reverse calculate balance from P&I at current rate/term
                                                if (newPI > 0 && currentRate > 0) {
                                                    setCurrentBalance(calculateBalanceFromPI(newPI, currentRate, currentTerm));
                                                }
                                            }}
                                            className="w-20 pl-3 pr-1 py-1 border border-stone-200 rounded-lg text-sm font-medium text-right focus:border-amber-400 focus:outline-none"
                                        />
                                    </div>
                                    <span className="text-center text-xs text-stone-500">P&I</span>
                                    <span className={cn("text-right font-medium", isPriced ? "text-amber-600" : "text-stone-300")}>
                                        {isPriced ? fmt(loan.pi) : '—'}
                                    </span>
                                </div>
                                
                                {/* Escrow Toggle */}
                                <div className="px-4 py-2.5 border-b border-stone-100 bg-stone-50/50">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <span className="text-stone-700 text-xs font-medium">Include Escrow</span>
                                            {!includeEscrow && (
                                                <p className="text-[10px] text-stone-400 mt-0.5">Paid separately</p>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => updateEscrow(!includeEscrow)}
                                            className={cn("w-10 h-5 rounded-full transition-colors relative", includeEscrow ? "bg-amber-500" : "bg-stone-300")}
                                        >
                                            <div className={cn("w-4 h-4 bg-white rounded-full absolute top-0.5 transition-transform shadow", includeEscrow ? "translate-x-5" : "translate-x-0.5")} />
                                        </button>
                                    </div>
                                </div>
                                
                                {includeEscrow && (
                                    <>
                                        <div className="grid grid-cols-3 items-center px-4 py-2.5 border-b border-stone-100">
                                            <div className="relative">
                                                <span className="absolute left-0 top-1/2 -translate-y-1/2 text-stone-500 text-sm">$</span>
                                                <input 
                                                    type="number" 
                                                    value={currentTaxes} 
                                                    onChange={(e) => setCurrentTaxes(parseInt(e.target.value) || 0)}
                                                    className="w-16 pl-3 pr-1 py-1 border border-stone-200 rounded-lg text-sm font-medium text-right focus:border-amber-400 focus:outline-none"
                                                />
                                            </div>
                                            <span className="text-center text-xs text-stone-500">Taxes</span>
                                            <span className="text-right font-medium text-amber-600">{fmt(currentTaxes)}</span>
                                        </div>
                                        <div className="grid grid-cols-3 items-center px-4 py-2.5 border-b border-stone-100">
                                            <div className="relative">
                                                <span className="absolute left-0 top-1/2 -translate-y-1/2 text-stone-500 text-sm">$</span>
                                                <input 
                                                    type="number" 
                                                    value={currentInsurance} 
                                                    onChange={(e) => setCurrentInsurance(parseInt(e.target.value) || 0)}
                                                    className="w-16 pl-3 pr-1 py-1 border border-stone-200 rounded-lg text-sm font-medium text-right focus:border-amber-400 focus:outline-none"
                                                />
                                            </div>
                                            <span className="text-center text-xs text-stone-500">Insurance</span>
                                            <span className="text-right font-medium text-amber-600">{fmt(currentInsurance)}</span>
                                        </div>
                                    </>
                                )}
                                
                                {/* MI Row */}
                                <div className="grid grid-cols-3 items-center px-4 py-2.5 border-b border-stone-100">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-stone-400">Current:</span>
                                        <div className="relative">
                                            <span className="absolute left-1.5 top-1/2 -translate-y-1/2 text-stone-400 text-xs">$</span>
                                            <input 
                                                type="number" 
                                                value={currentMIP || ''} 
                                                onChange={(e) => setCurrentMIP(parseInt(e.target.value) || 0)}
                                                placeholder="0"
                                                className="w-14 pl-4 pr-1 py-1 border border-stone-200 rounded-lg text-xs text-right focus:border-amber-400 focus:outline-none"
                                            />
                                        </div>
                                    </div>
                                    <span className="text-center text-xs text-stone-500">{loan.miLabel || 'MI/MIP'}</span>
                                    <span className={cn("text-right font-medium", loan.monthlyMI > 0 ? "text-orange-500" : "text-stone-300")}>
                                        {loan.monthlyMI > 0 ? fmt(loan.monthlyMI) : '—'}
                                    </span>
                                </div>
                                
                                {loan.ufmip > 0 && (
                                    <div className="px-4 py-2 bg-sky-50 border-b border-stone-100">
                                        <p className="text-xs text-sky-600">ℹ️ UFMIP ({fmt(loan.ufmip)}) financed into loan</p>
                                    </div>
                                )}
                                
                                {isPriced && loan.pointsCost !== 0 && (
                                    <div className="grid grid-cols-3 items-center px-4 py-2.5 border-b border-stone-100">
                                        <span className="text-stone-300">—</span>
                                        <span className="text-center text-xs text-stone-500">
                                            {loan.pointsCost > 0 ? 'Points' : 'Lender Credit'}
                                        </span>
                                        <span className={cn("text-right font-medium", loan.pointsCost > 0 ? "text-rose-500" : "text-teal-600")}>
                                            {loan.pointsCost > 0 ? fmt(loan.pointsCost) : `(${fmt(Math.abs(loan.pointsCost))})`}
                                        </span>
                                    </div>
                                )}
                                
                                {/* Debts Being Paid Off - Present shows payment, Proposed shows $0 */}
                                <Row 
                                    l={fmt(calc.other)} 
                                    c="Debts Being Paid Off" 
                                    r={isPriced ? "$0" : "—"} 
                                    lc="text-stone-700" 
                                    rc={isPriced ? "text-teal-600" : "text-stone-300"} 
                                />
                                
                                {/* Other Debts (Not Paid) - Same on both sides */}
                                {debtsNotPaidPayment > 0 && (
                                    <Row 
                                        l={fmt(debtsNotPaidPayment)} 
                                        c="Other Debts (Not Paid)" 
                                        r={fmt(debtsNotPaidPayment)} 
                                        lc="text-stone-500" 
                                        rc="text-stone-500" 
                                    />
                                )}
                            </div>
                            
                            <div className="grid grid-cols-3 items-center px-4 py-3 bg-stone-50 border-t border-stone-200">
                                <div><p className="text-xs text-stone-500">CURRENT</p><p className="text-xl font-bold text-stone-800">{fmt(calc.currentTotal + debtsNotPaidPayment)}</p></div>
                                <p className="text-xs text-stone-500 text-center">TOTAL/MO</p>
                                <div className="text-right"><p className="text-xs text-amber-600">PROPOSED</p><p className={cn("text-xl font-bold", isPriced ? "text-amber-600" : "text-stone-300")}>{isPriced ? fmt(loan.proposed + debtsNotPaidPayment) : '—'}</p></div>
                            </div>
                        </div>

                        {/* Savings or Price Button */}
                        {isPriced ? (
                            (() => {
                                // Calculate actual savings including debts not paid off (same on both sides, so they cancel out)
                                const actualSavings = (calc.currentTotal + debtsNotPaidPayment) - (loan.proposed + debtsNotPaidPayment);
                                return (
                                    <div className={cn("rounded-xl p-4 flex items-center justify-center gap-6", actualSavings >= 0 ? "bg-gradient-to-r from-teal-50 to-amber-50 border border-teal-200" : "bg-rose-50 border border-rose-200")}>
                                        <div className="text-center">
                                            <p className="text-sm text-stone-600">Monthly Savings</p>
                                            <p className={cn("text-3xl font-bold", actualSavings >= 0 ? "text-teal-600" : "text-rose-600")}>{actualSavings >= 0 ? '+' : ''}{fmt(actualSavings)}</p>
                                        </div>
                                        <div className="w-px h-12 bg-stone-200" />
                                        <div className="text-center">
                                            <p className="text-sm text-stone-600">Annual</p>
                                            <p className={cn("text-xl font-bold", actualSavings >= 0 ? "text-teal-600" : "text-rose-600")}>{fmt(actualSavings * 12)}</p>
                                        </div>
                                    </div>
                                );
                            })()
                        ) : (
                            <button onClick={handlePrice} disabled={isRunningPricing} className="w-full py-3.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 shadow-sm transition-all">
                                {isRunningPricing ? <><RefreshCw size={16} className="animate-spin" /> Pricing...</> : <><Play size={16} /> Price Loan</>}
                            </button>
                        )}
                    </div>
                </div>

                {/* RIGHT: Value Propositions */}
                <div className={cn("flex-1 overflow-auto min-w-0 transition-all", isPriced ? "bg-white" : "bg-stone-100")}>
                    <div className="p-4 h-full">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <Lock size={16} className={cn(isPriced ? "hidden" : "text-stone-400")} />
                                <Sparkles size={16} className={isPriced ? "text-amber-500" : "text-stone-400"} />
                                <span className={cn("font-medium", isPriced ? "text-stone-800" : "text-stone-400")}>Value Propositions</span>
                            </div>
                            {isPriced && selCount > 0 && <span className="text-xs bg-amber-500 text-white px-2 py-0.5 rounded-full">{selCount}</span>}
                            {!isPriced && <span className="text-xs bg-stone-200 text-stone-500 px-2 py-0.5 rounded-full">Locked</span>}
                        </div>
                        
                        {isPriced ? (
                            <div className="space-y-3">
                                {/* Recommendation Engine - grouped by value */}
                                {(() => {
                                    // Calculate values based on configurable parameters
                                    // cashFlowValue uses adjustable months, but IMPACT always uses 2 months (fixed for ranking)
                                    const cashFlowValue = calc.currentTotal * cashFlowMonths;
                                    const cashFlowImpact = calc.currentTotal * 2; // Fixed at 2 months for consistent ranking
                                    const acceleratedPayment = Math.round((acceleratedPercent / 100) * loan.savings);
                                    const incomeAfterTax = Math.round(grossIncome * (1 - taxRate / 100));
                                    const currentDebtPmts = calc.other; // debts being paid off
                                    const currentDisposable = incomeAfterTax - currentPI - currentDebtPmts;
                                    const proposedDisposable = incomeAfterTax - loan.pi;
                                    const disposableIncrease = proposedDisposable - currentDisposable;
                                    
                                    const cards = [
                                        { id: 'debt-consolidation', icon: <Plus size={16} />, title: 'Debt Consolidation', value: `-${fmt(calc.totalPmt)}`, sub: `${calc.count} accounts paid off`, impact: calc.totalPmt, providesValue: calc.count > 0 && calc.totalPmt > 0, chart: 'debt-consolidation' },
                                        { id: 'payment-savings', icon: <FileText size={16} />, title: 'Payment Savings', value: `${loan.savings >= 0 ? '' : '-'}${fmt(Math.abs(loan.savings))}/mo`, sub: `${fmt(loan.savings * 12)} annually`, impact: Math.abs(loan.savings * 12), providesValue: loan.savings > 0, chart: 'payment-savings', negative: loan.savings < 0 },
                                        { id: 'cash-back', icon: <DollarSign size={16} />, title: 'Cash Back', value: fmt(loan.cashout), sub: 'In your pocket at closing', impact: loan.cashout, providesValue: loan.cashout > 0, chart: 'cash-back' },
                                        { 
                                            id: 'cash-flow-window', 
                                            icon: <Calendar size={16} />, 
                                            title: 'Cash Flow Window', 
                                            value: fmt(cashFlowValue), 
                                            impact: cashFlowImpact, // Fixed at 2 months for consistent ranking
                                            providesValue: calc.currentTotal > 0, 
                                            chart: 'cash-flow-window',
                                            config: { type: 'months', value: cashFlowMonths, setValue: setCashFlowMonths, min: 1, max: 3, step: 1, label: 'months' }
                                        },
                                        { id: 'break-even', icon: <Clock size={16} />, title: 'Break-Even', value: loan.savings > 0 ? `${loan.breakEven} mo` : '—', sub: loan.savings > 0 ? (loan.breakEven <= 24 ? '✓ Under 2 years' : `${fmt(closingCosts + Math.max(0, loan.pointsCost))} to recoup`) : 'No savings to recoup', impact: loan.savings > 0 ? Math.max(0, 60 - loan.breakEven) : 0, providesValue: loan.savings > 0 && loan.breakEven <= 36, chart: 'recoup-costs', warning: loan.savings > 0 && loan.breakEven > 24 },
                                        { 
                                            id: 'accelerated-payoff', 
                                            icon: <Home size={16} />, 
                                            title: 'Accelerated Payoff', 
                                            value: loan.savings > 0 ? fmt(acceleratedPayment) : '$0', 
                                            sub: loan.savings > 0 ? 'extra to principal' : 'No savings to apply',
                                            // Impact uses ORIGINAL savings (not adjusted) so ranking stays fixed
                                            impact: loan.savings > 0 ? loan.savings * 60 : 0, 
                                            providesValue: loan.savings > 0, 
                                            chart: 'accelerated-payoff',
                                            config: loan.savings > 0 ? { type: 'percent', value: acceleratedPercent, setValue: setAcceleratedPercent, min: 0, max: 100, step: 10, label: '%', maxLabel: fmt(loan.savings) } : null
                                        },
                                        { 
                                            id: 'compound-growth', 
                                            icon: <TrendingUp size={16} />, 
                                            title: 'Compound Growth', 
                                            value: loan.savings > 0 ? `${fmt(loan.savings)}/mo` : '$0/mo', 
                                            impact: loan.savings > 0 ? loan.savings * 84 : 0, 
                                            providesValue: loan.savings > 0, 
                                            chart: 'compound-growth',
                                            config: loan.savings > 0 ? { type: 'rate', value: compoundRate, setValue: setCompoundRate, min: 3, max: 12, step: 0.5, label: '% return' } : null
                                        },
                                        { 
                                            id: 'disposable-income', 
                                            icon: <Wallet size={16} />, 
                                            title: 'Disposable Income', 
                                            value: isPriced && disposableIncrease > 0 ? `+${fmt(disposableIncrease)}/mo` : '$0/mo', 
                                            impact: disposableIncrease > 0 ? disposableIncrease * 48 : 0, 
                                            providesValue: true, 
                                            chart: 'disposable-income',
                                            config: { type: 'income', grossIncome, setGrossIncome, taxRate, setTaxRate }
                                        },
                                    ];
                                    
                                    const valueCards = cards.filter(c => c.providesValue);
                                    const noValueCards = cards.filter(c => !c.providesValue);
                                    
                                    // Sort value cards by impact
                                    const sortedValue = [...valueCards].sort((a, b) => b.impact - a.impact);
                                    const topBenefit = sortedValue[0]?.id;
                                    const recommended = sortedValue.slice(0, 3).map(c => c.id);
                                    
                                    const renderCard = (card, isValueSection) => (
                                        <Card 
                                            key={card.id}
                                            icon={card.icon} 
                                            title={card.title} 
                                            value={card.value} 
                                            sub={card.sub} 
                                            sel={moduleSelections[card.id]} 
                                            onToggle={(e) => { e.stopPropagation(); toggle(card.id); }} 
                                            onView={() => handleViewChart(card.chart)} 
                                            rec={isValueSection && recommended.includes(card.id)}
                                            top={isValueSection && topBenefit === card.id}
                                            c={card.negative ? "rose" : card.warning ? "amber" : !card.providesValue ? "gray" : "teal"}
                                            disabled={false}
                                            warning={card.warning}
                                            config={card.config}
                                        />
                                    );
                                    
                                    return (
                                        <>
                                            {/* Value Section */}
                                            {valueCards.length > 0 && (
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <div className="w-2 h-2 rounded-full bg-teal-500"></div>
                                                        <span className="text-xs font-semibold text-teal-700 uppercase tracking-wide">Providing Value ({valueCards.length})</span>
                                                    </div>
                                                    {sortedValue.map(card => renderCard(card, true))}
                                                </div>
                                            )}
                                            
                                            {/* No Value Section */}
                                            {noValueCards.length > 0 && (
                                                <div className="space-y-2 mt-4">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <div className="w-2 h-2 rounded-full bg-stone-400"></div>
                                                        <span className="text-xs font-semibold text-stone-500 uppercase tracking-wide">Review / Adjust ({noValueCards.length})</span>
                                                    </div>
                                                    <p className="text-[10px] text-stone-400 -mt-1 mb-2">These may improve with different loan settings</p>
                                                    {noValueCards.map(card => renderCard(card, false))}
                                                </div>
                                            )}
                                        </>
                                    );
                                })()}
                                
                                {/* Selection limit indicator */}
                                <div className="text-center text-xs text-stone-500 mt-3">
                                    {selCount === 0 && "Select up to 2 charts for your proposal"}
                                    {selCount === 1 && "1 chart selected • Select 1 more or generate"}
                                    {selCount === 2 && "✓ 2 charts selected (maximum)"}
                                </div>
                                
                                <button 
                                    onClick={() => onGenerateProposal?.(selectedChartIds, buildChartData())} 
                                    disabled={selCount === 0} 
                                    className={cn(
                                        "w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 mt-2 transition-all",
                                        selCount > 0 ? "bg-amber-500 text-white hover:bg-amber-600 shadow-sm" : "bg-stone-100 text-stone-400"
                                    )}
                                >
                                    <Download size={16} /> Generate Proposal {selCount > 0 && `(${selCount} chart${selCount > 1 ? 's' : ''})`}
                                </button>
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-center opacity-60">
                                <div className="w-16 h-16 rounded-full bg-stone-200 flex items-center justify-center mb-4">
                                    <Lock size={28} className="text-stone-400" />
                                </div>
                                <p className="text-stone-600 font-medium mb-1">Value Propositions Locked</p>
                                <p className="text-stone-400 text-sm">Click "Price Loan" to unlock<br/>and see available benefits</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function StepPill({ num, label, active, done }) {
    return (
        <div className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-xl transition-all",
            done && "bg-teal-100",
            active && !done && "bg-amber-100 shadow-sm ring-2 ring-amber-300",
            !active && !done && "bg-stone-100"
        )}>
            <div className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                done && "bg-teal-500 text-white",
                active && !done && "bg-amber-500 text-white",
                !active && !done && "bg-stone-300 text-white"
            )}>
                {done ? <Check size={12} /> : num}
            </div>
            <span className={cn(
                "text-sm font-medium",
                done && "text-teal-700",
                active && !done && "text-amber-700",
                !active && !done && "text-stone-400"
            )}>
                {label}
            </span>
        </div>
    );
}

function Row({ l, c, r, lc = "text-stone-700", rc = "text-amber-600" }) {
    return <div className="grid grid-cols-3 items-center px-4 py-2.5 border-b border-stone-100 last:border-0"><span className={cn("font-medium", lc)}>{l}</span><span className="text-center text-xs text-stone-500">{c}</span><span className={cn("text-right font-medium", rc)}>{r}</span></div>;
}

// Card - Now fully clickable for chart, checkbox toggles selection
function Card({ icon, title, value, sub, sel, onToggle, onView, rec, top, c = "amber", disabled, warning, config }) {
    const colors = { 
        teal: { b: "border-teal-200", bg: "bg-teal-50", t: "text-teal-700", ch: "bg-teal-500", hover: "hover:border-teal-300 hover:shadow-md" }, 
        amber: { b: "border-amber-200", bg: "bg-amber-50", t: "text-amber-700", ch: "bg-amber-500", hover: "hover:border-amber-300 hover:shadow-md" }, 
        purple: { b: "border-purple-200", bg: "bg-purple-50", t: "text-purple-700", ch: "bg-purple-500", hover: "hover:border-purple-300 hover:shadow-md" }, 
        rose: { b: "border-rose-200", bg: "bg-rose-50", t: "text-rose-700", ch: "bg-rose-500", hover: "hover:border-rose-300 hover:shadow-md" },
        gray: { b: "border-stone-200", bg: "bg-stone-100", t: "text-stone-500", ch: "bg-stone-400", hover: "hover:border-stone-300 hover:shadow-sm" }
    };
    const s = colors[c] || colors.gray;
    const isGray = c === 'gray';
    
    // Render inline control based on config type
    const renderInlineControl = () => {
        if (!config) return sub ? <p className={cn("text-xs", isGray ? "text-stone-400" : "text-stone-400")}>{sub}</p> : null;
        
        if (config.type === 'rate') {
            return (
                <div className="flex items-center gap-2 mt-1" onClick={(e) => e.stopPropagation()}>
                    <span className="text-xs text-stone-400">@</span>
                    <input 
                        type="range" 
                        min={0} 
                        max={20} 
                        step={1}
                        value={config.value}
                        onChange={(e) => config.setValue(parseInt(e.target.value))}
                        className="w-20 h-1.5 bg-stone-200 rounded-full appearance-none cursor-pointer accent-purple-500"
                    />
                    <span className="text-xs font-bold text-purple-600 w-8">{config.value}%</span>
                    <span className="text-xs text-stone-400">return</span>
                </div>
            );
        }
        
        if (config.type === 'percent') {
            return (
                <div className="flex items-center gap-2 mt-1" onClick={(e) => e.stopPropagation()}>
                    <input 
                        type="range" 
                        min={config.min} 
                        max={config.max} 
                        step={config.step}
                        value={config.value}
                        onChange={(e) => config.setValue(parseInt(e.target.value))}
                        className="w-16 h-1.5 bg-stone-200 rounded-full appearance-none cursor-pointer accent-teal-500"
                    />
                    <span className="text-xs font-semibold text-stone-600 w-8">{config.value}%</span>
                    <span className="text-xs text-stone-400">of {config.maxLabel}</span>
                </div>
            );
        }
        
        if (config.type === 'months') {
            return (
                <div className="flex items-center gap-1.5 mt-1" onClick={(e) => e.stopPropagation()}>
                    {[1, 2, 3].map(m => (
                        <button
                            key={m}
                            onClick={() => config.setValue(m)}
                            className={cn(
                                "px-2 py-0.5 text-xs font-semibold rounded-md transition-all",
                                config.value === m 
                                    ? "bg-teal-500 text-white" 
                                    : "bg-stone-100 text-stone-500 hover:bg-stone-200"
                            )}
                        >
                            {m}
                        </button>
                    ))}
                    <span className="text-xs text-stone-400 ml-1">month{config.value !== 1 ? 's' : ''} payment-free</span>
                </div>
            );
        }
        
        if (config.type === 'income') {
            const taxPresets = [20, 25, 30, 35];
            return (
                <div className="flex flex-col gap-1.5 mt-1" onClick={(e) => e.stopPropagation()}>
                    {/* Income input - easy to type */}
                    <div className="flex items-center gap-1.5">
                        <div className="flex items-center bg-white border border-stone-300 rounded-lg px-2 py-1 focus-within:border-indigo-400 focus-within:ring-1 focus-within:ring-indigo-200">
                            <span className="text-xs text-stone-400">$</span>
                            <input 
                                type="text" 
                                inputMode="numeric"
                                value={config.grossIncome.toLocaleString()}
                                onChange={(e) => {
                                    const val = parseInt(e.target.value.replace(/,/g, '')) || 0;
                                    config.setGrossIncome(Math.min(50000, Math.max(0, val)));
                                }}
                                className="w-16 text-xs font-semibold text-right text-indigo-600 bg-transparent outline-none"
                                placeholder="12,000"
                            />
                        </div>
                        <span className="text-xs text-stone-400">/mo</span>
                    </div>
                    {/* Tax rate preset buttons */}
                    <div className="flex items-center gap-1">
                        <span className="text-[10px] text-stone-400 mr-0.5">Tax:</span>
                        {taxPresets.map(rate => (
                            <button
                                key={rate}
                                onClick={() => config.setTaxRate(rate)}
                                className={cn(
                                    "px-1.5 py-0.5 text-[10px] font-semibold rounded transition-all",
                                    config.taxRate === rate 
                                        ? "bg-indigo-500 text-white" 
                                        : "bg-stone-100 text-stone-500 hover:bg-stone-200"
                                )}
                            >
                                {rate}%
                            </button>
                        ))}
                    </div>
                </div>
            );
        }
        
        return sub ? <p className={cn("text-xs", isGray ? "text-stone-400" : "text-stone-400")}>{sub}</p> : null;
    };
    
    return (
        <div 
            onClick={onView} 
            className={cn(
                "relative rounded-xl border p-3.5 transition-all group cursor-pointer",
                isGray ? "bg-stone-50 border-stone-200 hover:border-stone-300" :
                sel ? `${s.b} ${s.bg}` : `border-stone-200 bg-white ${s.hover}`
            )}
        >
            {/* Top Benefit Badge */}
            {top && !isGray && <span className="absolute -top-2 -left-1 text-[10px] bg-gradient-to-r from-amber-500 to-orange-500 text-white px-2 py-0.5 rounded-full font-bold shadow-sm">Top Benefit</span>}
            {/* Recommended Badge (only show if not top) */}
            {rec && !top && !isGray && <span className="absolute -top-2 -left-1 text-[10px] bg-teal-500 text-white px-2 py-0.5 rounded-full font-medium shadow-sm">Recommended</span>}
            {/* Warning Badge */}
            {warning && <span className="absolute -top-2 -left-1 text-[10px] bg-amber-500 text-white px-2 py-0.5 rounded-full font-medium shadow-sm">Review</span>}
            {/* No Value indicator */}
            {isGray && !warning && <span className="absolute -top-2 -left-1 text-[10px] bg-stone-400 text-white px-2 py-0.5 rounded-full font-medium">No Value</span>}
            
            {/* Checkbox */}
            <div 
                onClick={onToggle}
                className={cn(
                    "absolute top-3 right-3 w-5 h-5 rounded-md border-2 flex items-center justify-center cursor-pointer transition-all",
                    sel ? `${s.ch} border-transparent` : "border-stone-300 hover:border-stone-400"
                )}
            >
                {sel && <Check size={12} className="text-white" />}
            </div>
            
            {/* External link icon on hover */}
            <ExternalLink size={12} className="absolute bottom-3 right-3 text-stone-300 opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="flex items-start gap-3 mt-1">
                <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors",
                    isGray ? "bg-stone-200" :
                    sel ? s.bg : "bg-stone-100 group-hover:bg-stone-50"
                )}>
                    <span className={isGray ? "text-stone-400" : sel ? s.t : "text-stone-500"}>{icon}</span>
                </div>
                <div className="flex-1 min-w-0 pr-6">
                    <p className={cn("text-xs font-medium", isGray ? "text-stone-400" : "text-stone-500")}>{title}</p>
                    <p className={cn("text-xl font-bold", isGray ? "text-stone-500" : sel ? s.t : "text-stone-800")}>{value}</p>
                    {renderInlineControl()}
                </div>
            </div>
        </div>
    );
}
