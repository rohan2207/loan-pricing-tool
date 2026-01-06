import React, { useState, useMemo, useEffect } from 'react';
import { 
    Calculator,
    X,
    Play,
    RefreshCw,
    Check,
    TrendingUp,
    Wallet,
    Clock,
    ExternalLink,
    Edit3
} from 'lucide-react';
import { cn } from '../../lib/utils';

// Format helpers
const fmt = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n || 0);

// Program configurations with default rates
const PROGRAMS = [
    { id: 'conventional', label: 'Conv', fullLabel: 'Conventional', rate: 7.0, maxLTV: 80, color: 'indigo' },
    { id: 'fha', label: 'FHA', fullLabel: 'FHA', rate: 6.5, maxLTV: 96.5, hasMI: true, color: 'blue' },
    { id: 'va', label: 'VA', fullLabel: 'VA', rate: 6.25, maxLTV: 100, color: 'emerald' },
    { id: 'fha-streamline', label: 'FHA-SL', fullLabel: 'FHA Streamline', rate: 6.25, maxLTV: 97.75, hasMI: true, color: 'blue' },
    { id: 'va-irrrl', label: 'VA-IRRRL', fullLabel: 'VA IRRRL', rate: 6.0, maxLTV: 100, color: 'emerald' },
];

const TERMS = [30, 20, 15, 10];

const LTV_PRESETS = [
    { value: 60, label: '60%' },
    { value: 70, label: '70%' },
    { value: 75, label: '75%' },
    { value: 80, label: '80%' },
];

export function PricingSummaryPanel({ 
    accounts = [], 
    borrowerData,
    onPriceLoan,
    onExit,
    onViewChart
}) {
    const [isPriced, setIsPriced] = useState(false);
    const [isRunningPricing, setIsRunningPricing] = useState(false);
    
    // Loan configuration
    const [selectedProgram, setSelectedProgram] = useState('conventional');
    const [selectedTerm, setSelectedTerm] = useState(30);
    const [targetLTV, setTargetLTV] = useState(75);
    const [customRate, setCustomRate] = useState(null);
    
    // Value propositions
    const [selectedBenefits, setSelectedBenefits] = useState({
        'debt-consolidation': true,
        'payment-savings': true,
        'break-even': false,
        'reinvestment': false,
    });

    const propertyValue = borrowerData?.property?.avmValue || 785000;
    const closingCosts = 8057;

    const program = PROGRAMS.find(p => p.id === selectedProgram) || PROGRAMS[0];
    const proposedRate = customRate !== null ? customRate : program.rate;

    // Parse amounts
    const parseAmount = (val) => {
        if (typeof val === 'number') return val;
        if (typeof val === 'string') return parseFloat(val.replace(/[$,]/g, '')) || 0;
        return 0;
    };

    // Calculate totals from selected accounts
    const calculations = useMemo(() => {
        const selectedAccounts = accounts.filter(acc => acc.willPay);
        
        const mortgages = selectedAccounts.filter(acc => {
            const type = (acc.accountType || '').toLowerCase();
            return type.includes('mortgage') || type.includes('heloc');
        });
        const nonMortgage = selectedAccounts.filter(acc => {
            const type = (acc.accountType || '').toLowerCase();
            return !type.includes('mortgage') && !type.includes('heloc');
        });

        const primaryMortgage = accounts.find(a => (a.accountType || '').toLowerCase().includes('mortgage'));
        const currentMortgagePI = primaryMortgage ? parseAmount(primaryMortgage.payment) : 1710;
        const currentRate = primaryMortgage ? parseFloat((primaryMortgage.rate || '').replace('%', '')) || 3.75 : 3.75;

        const totalMortgageBalance = mortgages.reduce((sum, acc) => sum + parseAmount(acc.balance), 0);
        const totalNonMortgageBalance = nonMortgage.reduce((sum, acc) => sum + parseAmount(acc.balance), 0);
        const totalNonMortgagePayment = nonMortgage.reduce((sum, acc) => sum + parseAmount(acc.payment), 0);

        const totalPayoff = totalMortgageBalance + totalNonMortgageBalance;

        const taxes = 450;
        const insurance = 120;
        const escrow = taxes + insurance;

        const currentTotal = currentMortgagePI + escrow + totalNonMortgagePayment;

        return {
            debtsSelected: selectedAccounts.length,
            nonMortgageCount: nonMortgage.length,
            totalMortgageBalance,
            totalNonMortgageBalance,
            totalNonMortgagePayment,
            totalPayoff,
            currentMortgagePI,
            currentRate,
            currentTotal,
            taxes,
            insurance,
            escrow,
            propertyValue
        };
    }, [accounts, propertyValue]);

    const minLTV = Math.max(20, Math.ceil(((calculations.totalMortgageBalance + calculations.totalNonMortgageBalance) / calculations.propertyValue) * 100));
    const maxLTV = program.maxLTV;
    
    const loanDetails = useMemo(() => {
        const effectiveLTV = Math.min(Math.max(targetLTV, minLTV), maxLTV);
        const loanAmount = Math.round((effectiveLTV / 100) * calculations.propertyValue);
        const cashout = Math.max(0, loanAmount - calculations.totalMortgageBalance - calculations.totalNonMortgageBalance);

        const monthlyRate = proposedRate / 100 / 12;
        const numPayments = selectedTerm * 12;
        const newPI = Math.round(loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1));

        const monthlyMI = program.hasMI ? Math.round(loanAmount * 0.0085 / 12) : 0;

        const proposedTotal = newPI + calculations.escrow + monthlyMI;
        const monthlySavings = calculations.currentTotal - proposedTotal;
        const breakEvenMonths = monthlySavings > 0 ? Math.ceil(closingCosts / monthlySavings) : 0;

        return {
            loanAmount,
            cashout,
            newPI,
            monthlyMI,
            proposedTotal,
            monthlySavings,
            breakEvenMonths,
            ltv: effectiveLTV
        };
    }, [targetLTV, minLTV, maxLTV, calculations, proposedRate, selectedTerm, program]);

    useEffect(() => {
        setCustomRate(null);
    }, [selectedProgram]);

    const handlePriceLoan = () => {
        setIsRunningPricing(true);
        setTimeout(() => {
            setIsRunningPricing(false);
            setIsPriced(true);
            onPriceLoan?.(loanDetails);
        }, 800);
    };

    const handleReprice = () => {
        setIsPriced(false);
    };

    const toggleBenefit = (id) => {
        setSelectedBenefits(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const selectedCount = Object.values(selectedBenefits).filter(Boolean).length;

    return (
        <div className="h-full flex flex-col bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="px-4 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Calculator size={16} className="text-indigo-200" />
                    <span className="font-medium text-sm">Loan Pricing</span>
                    {isPriced && (
                        <span className="text-xs bg-emerald-500 text-white px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Check size={10} /> Priced
                        </span>
                    )}
                </div>
                <button onClick={onExit} className="p-1 hover:bg-white/10 rounded">
                    <X size={16} />
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
                {!isPriced ? (
                    // PRE-PRICING VIEW
                    <div className="p-4 space-y-4">
                        {/* Program Selection */}
                        <div>
                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">Program</p>
                            <div className="flex flex-wrap gap-1.5">
                                {PROGRAMS.map(p => (
                                    <button
                                        key={p.id}
                                        onClick={() => setSelectedProgram(p.id)}
                                        className={cn(
                                            "px-3 py-1.5 text-xs font-medium rounded-lg border transition-all",
                                            selectedProgram === p.id 
                                                ? "bg-indigo-600 text-white border-indigo-600 shadow-sm" 
                                                : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600"
                                        )}
                                    >
                                        {p.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Term Selection */}
                        <div>
                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">Term</p>
                            <div className="flex gap-1.5">
                                {TERMS.map(t => (
                                    <button
                                        key={t}
                                        onClick={() => setSelectedTerm(t)}
                                        className={cn(
                                            "px-3 py-1.5 text-xs font-medium rounded-lg border transition-all",
                                            selectedTerm === t 
                                                ? "bg-indigo-600 text-white border-indigo-600 shadow-sm" 
                                                : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600"
                                        )}
                                    >
                                        {t}yr
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Rate */}
                        <div>
                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">Rate</p>
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    step="0.125"
                                    value={customRate !== null ? customRate : program.rate}
                                    onChange={(e) => setCustomRate(parseFloat(e.target.value) || program.rate)}
                                    className="w-20 px-2 py-1.5 text-sm font-medium border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100"
                                />
                                <span className="text-sm text-slate-500">%</span>
                                {customRate !== null && (
                                    <button 
                                        onClick={() => setCustomRate(null)}
                                        className="text-xs text-indigo-500 hover:text-indigo-700"
                                    >
                                        Reset to {program.rate}%
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* LTV Selection */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">LTV</p>
                                <span className="text-sm font-bold text-indigo-600">{loanDetails.ltv}%</span>
                            </div>
                            
                            {/* LTV Preset Buttons */}
                            <div className="flex gap-1.5 mb-3">
                                {LTV_PRESETS.filter(p => p.value <= maxLTV && p.value >= minLTV).map(preset => (
                                    <button
                                        key={preset.value}
                                        onClick={() => setTargetLTV(preset.value)}
                                        className={cn(
                                            "flex-1 py-1.5 text-xs font-medium rounded-lg border transition-all",
                                            targetLTV === preset.value 
                                                ? "bg-indigo-600 text-white border-indigo-600 shadow-sm" 
                                                : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300"
                                        )}
                                    >
                                        {preset.label}
                                    </button>
                                ))}
                            </div>
                            
                            {/* LTV Slider */}
                            <input
                                type="range"
                                min={20}
                                max={maxLTV}
                                value={targetLTV}
                                onChange={(e) => setTargetLTV(Number(e.target.value))}
                                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                            />
                            <div className="flex justify-between text-xs text-slate-400 mt-1">
                                <span>20%</span>
                                <span>{maxLTV}%</span>
                            </div>
                            
                            {targetLTV < minLTV && (
                                <p className="text-xs text-amber-600 mt-2">
                                    ⚠️ Min {minLTV}% needed to pay off selected debts
                                </p>
                            )}
                        </div>

                        {/* Loan Summary */}
                        <div className="p-3 bg-gradient-to-br from-slate-50 to-indigo-50/30 rounded-lg border border-slate-100 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Loan Amount</span>
                                <span className="font-semibold text-slate-800">{fmt(loanDetails.loanAmount)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Debts Paid Off</span>
                                <span className="font-medium text-slate-700">{fmt(calculations.totalNonMortgageBalance)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Extra Cashout</span>
                                <span className="font-medium text-indigo-600">{fmt(loanDetails.cashout)}</span>
                            </div>
                        </div>

                        {/* Price Button */}
                        <button
                            onClick={handlePriceLoan}
                            disabled={isRunningPricing || targetLTV < minLTV}
                            className={cn(
                                "w-full py-3 font-medium rounded-lg transition-all flex items-center justify-center gap-2",
                                targetLTV < minLTV 
                                    ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                                    : "bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white shadow-md hover:shadow-lg"
                            )}
                        >
                            {isRunningPricing ? (
                                <><RefreshCw size={16} className="animate-spin" /> Pricing...</>
                            ) : (
                                <><Play size={16} /> Price Loan</>
                            )}
                        </button>
                    </div>
                ) : (
                    // POST-PRICING VIEW
                    <div className="p-4 space-y-4">
                        {/* Loan Summary Header */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs font-medium rounded">
                                    {program.fullLabel}
                                </span>
                                <span className="text-sm text-slate-600">{selectedTerm}yr · {proposedRate}%</span>
                            </div>
                            <button 
                                onClick={handleReprice}
                                className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                            >
                                <Edit3 size={12} /> Edit
                            </button>
                        </div>

                        {/* Present vs Proposed Comparison */}
                        <div className="border border-slate-200 rounded-lg overflow-hidden">
                            {/* Header */}
                            <div className="grid grid-cols-3 bg-slate-100 text-xs font-medium uppercase tracking-wide">
                                <div className="p-2 text-right text-slate-500">Present</div>
                                <div className="p-2 text-center text-slate-400"></div>
                                <div className="p-2 text-left text-indigo-600">Proposed</div>
                            </div>
                            
                            {/* P&I Row */}
                            <div className="grid grid-cols-3 border-t border-slate-100 text-sm">
                                <div className="p-2 text-right font-medium text-slate-700">{fmt(calculations.currentMortgagePI)}</div>
                                <div className="p-2 text-center text-xs text-slate-400">P&I</div>
                                <div className="p-2 text-left font-medium text-indigo-700">{fmt(loanDetails.newPI)}</div>
                            </div>
                            
                            {/* Taxes Row */}
                            <div className="grid grid-cols-3 border-t border-slate-100 text-sm">
                                <div className="p-2 text-right font-medium text-slate-600">{fmt(calculations.taxes)}</div>
                                <div className="p-2 text-center text-xs text-slate-400">Taxes</div>
                                <div className="p-2 text-left font-medium text-slate-600">{fmt(calculations.taxes)}</div>
                            </div>
                            
                            {/* Insurance Row */}
                            <div className="grid grid-cols-3 border-t border-slate-100 text-sm">
                                <div className="p-2 text-right font-medium text-slate-600">{fmt(calculations.insurance)}</div>
                                <div className="p-2 text-center text-xs text-slate-400">Insurance</div>
                                <div className="p-2 text-left font-medium text-slate-600">{fmt(calculations.insurance)}</div>
                            </div>
                            
                            {/* MI Row (if applicable) */}
                            {loanDetails.monthlyMI > 0 && (
                                <div className="grid grid-cols-3 border-t border-slate-100 text-sm">
                                    <div className="p-2 text-right text-slate-400">—</div>
                                    <div className="p-2 text-center text-xs text-slate-400">MI</div>
                                    <div className="p-2 text-left font-medium text-amber-600">{fmt(loanDetails.monthlyMI)}</div>
                                </div>
                            )}
                            
                            {/* Other Debts Row */}
                            <div className="grid grid-cols-3 border-t border-slate-100 text-sm">
                                <div className="p-2 text-right font-medium text-red-500">{fmt(calculations.totalNonMortgagePayment)}</div>
                                <div className="p-2 text-center text-xs text-slate-400">Other Debts</div>
                                <div className="p-2 text-left font-medium text-emerald-600">$0</div>
                            </div>
                            
                            {/* Total Row */}
                            <div className="grid grid-cols-3 border-t-2 border-slate-200 bg-gradient-to-r from-slate-50 to-indigo-50/50">
                                <div className="p-3 text-right">
                                    <p className="text-[10px] text-slate-500 uppercase">Current</p>
                                    <p className="text-lg font-bold text-slate-800">{fmt(calculations.currentTotal)}</p>
                                </div>
                                <div className="p-3 text-center flex items-center justify-center">
                                    <span className="text-xs text-slate-400 uppercase">Total/mo</span>
                                </div>
                                <div className="p-3 text-left">
                                    <p className="text-[10px] text-indigo-600 uppercase">Proposed</p>
                                    <p className="text-lg font-bold text-indigo-700">{fmt(loanDetails.proposedTotal)}</p>
                                </div>
                            </div>
                        </div>

                        {/* Savings Highlight */}
                        <div className={cn(
                            "p-4 rounded-lg text-center border",
                            loanDetails.monthlySavings > 0 
                                ? "bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200" 
                                : "bg-gradient-to-br from-red-50 to-orange-50 border-red-200"
                        )}>
                            <p className="text-xs text-slate-600 mb-1">
                                {loanDetails.monthlySavings > 0 ? 'Monthly Savings' : 'Monthly Increase'}
                            </p>
                            <p className={cn(
                                "text-3xl font-bold",
                                loanDetails.monthlySavings > 0 ? "text-emerald-600" : "text-red-600"
                            )}>
                                {loanDetails.monthlySavings > 0 ? '+' : ''}{fmt(loanDetails.monthlySavings)}
                            </p>
                            <p className="text-xs text-slate-500 mt-1">{fmt(Math.abs(loanDetails.monthlySavings) * 12)}/year</p>
                        </div>

                        {/* Value Propositions */}
                        <div>
                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">Value Propositions</p>
                            <div className="space-y-2">
                                <BenefitRow
                                    icon={<TrendingUp size={14} />}
                                    title="Debt Consolidation"
                                    value={`${calculations.nonMortgageCount} debts · ${fmt(calculations.totalNonMortgageBalance)}`}
                                    selected={selectedBenefits['debt-consolidation']}
                                    onToggle={() => toggleBenefit('debt-consolidation')}
                                    onView={() => onViewChart?.('debt-consolidation')}
                                    color="indigo"
                                />
                                <BenefitRow
                                    icon={<Wallet size={14} />}
                                    title="Payment Savings"
                                    value={`${fmt(loanDetails.monthlySavings)}/mo · ${fmt(loanDetails.monthlySavings * 12)}/yr`}
                                    selected={selectedBenefits['payment-savings']}
                                    onToggle={() => toggleBenefit('payment-savings')}
                                    onView={() => onViewChart?.('payment-savings')}
                                    color="emerald"
                                    highlight={loanDetails.monthlySavings > 200}
                                />
                                <BenefitRow
                                    icon={<Clock size={14} />}
                                    title="Break-Even"
                                    value={`${loanDetails.breakEvenMonths} months to recoup costs`}
                                    selected={selectedBenefits['break-even']}
                                    onToggle={() => toggleBenefit('break-even')}
                                    onView={() => onViewChart?.('recoup-costs')}
                                    color="amber"
                                />
                                <BenefitRow
                                    icon={<TrendingUp size={14} />}
                                    title="Reinvestment"
                                    value={`Invest ${fmt(loanDetails.monthlySavings)}/mo @ 7%`}
                                    selected={selectedBenefits['reinvestment']}
                                    onToggle={() => toggleBenefit('reinvestment')}
                                    onView={() => onViewChart?.('reinvestment')}
                                    color="purple"
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-200 bg-slate-50">
                {isPriced ? (
                    <button
                        onClick={() => {}}
                        disabled={selectedCount === 0}
                        className={cn(
                            "w-full py-2.5 font-medium rounded-lg transition-all flex items-center justify-center gap-2 text-sm",
                            selectedCount > 0 
                                ? "bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white shadow-md" 
                                : "bg-slate-200 text-slate-400 cursor-not-allowed"
                        )}
                    >
                        Generate Proposal ({selectedCount})
                    </button>
                ) : (
                    <button
                        onClick={onExit}
                        className="w-full py-2 text-slate-500 hover:text-slate-700 text-sm font-medium"
                    >
                        Exit
                    </button>
                )}
            </div>
        </div>
    );
}

// Benefit Row Component with color support
function BenefitRow({ icon, title, value, selected, onToggle, onView, color = "indigo", highlight }) {
    const colorStyles = {
        indigo: {
            selected: "bg-indigo-50 border-indigo-200",
            checkbox: "bg-indigo-600 border-indigo-600",
            icon: "text-indigo-500"
        },
        emerald: {
            selected: "bg-emerald-50 border-emerald-200",
            checkbox: "bg-emerald-600 border-emerald-600",
            icon: "text-emerald-500"
        },
        amber: {
            selected: "bg-amber-50 border-amber-200",
            checkbox: "bg-amber-600 border-amber-600",
            icon: "text-amber-500"
        },
        purple: {
            selected: "bg-purple-50 border-purple-200",
            checkbox: "bg-purple-600 border-purple-600",
            icon: "text-purple-500"
        }
    };

    const styles = colorStyles[color];

    return (
        <div className={cn(
            "flex items-center gap-3 p-2.5 rounded-lg border transition-all",
            selected ? styles.selected : "bg-white border-slate-200 hover:border-slate-300"
        )}>
            <button
                onClick={onToggle}
                className={cn(
                    "w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all",
                    selected ? styles.checkbox : "border-slate-300 hover:border-slate-400"
                )}
            >
                {selected && <Check size={12} className="text-white" />}
            </button>
            <span className={cn("flex-shrink-0", selected ? styles.icon : "text-slate-400")}>{icon}</span>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-700">{title}</p>
                <p className="text-xs text-slate-500 truncate">{value}</p>
            </div>
            <button
                onClick={onView}
                className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
            >
                <ExternalLink size={14} />
            </button>
        </div>
    );
}
