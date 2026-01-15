import React, { useEffect, useState } from 'react';
import { ArrowRight, TrendingUp, TrendingDown, Sparkles, DollarSign, CreditCard, Home, CheckCircle } from 'lucide-react';
import { cn } from '../../lib/utils';
import { NeuCard, NeuBadge } from './NeumorphicCard';

// Animated number component
function AnimatedNumber({ value, prefix = '', suffix = '', duration = 1000 }) {
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        const startTime = Date.now();
        const startValue = displayValue;
        const diff = value - startValue;

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function
            const eased = 1 - Math.pow(1 - progress, 3);
            
            setDisplayValue(Math.round(startValue + diff * eased));

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }, [value]);

    const formatted = displayValue.toLocaleString();
    return <span>{prefix}{formatted}{suffix}</span>;
}

// Comparison row
function ComparisonRow({ label, before, after, improved, icon: Icon }) {
    return (
        <div className="flex items-center justify-between py-3 border-b border-[#d1d9e6] last:border-0">
            <div className="flex items-center gap-2 text-neutral-600">
                {Icon && <Icon size={14} className="text-neutral-400" />}
                <span className="text-sm">{label}</span>
            </div>
            <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-neutral-500 line-through decoration-neutral-400">
                    {before}
                </span>
                <ArrowRight size={14} className="text-emerald-500 neu-arrow-animate" />
                <span className={cn(
                    "text-sm font-bold",
                    improved ? "text-emerald-600" : "text-neutral-700"
                )}>
                    {after}
                </span>
            </div>
        </div>
    );
}

// Main comparison panel
export function ComparisonPanel({ 
    beforeData,
    afterData,
    title = "TODAY vs AFTER REFINANCE",
    className 
}) {
    const savings = beforeData.monthlyPayment - afterData.monthlyPayment;
    const annualSavings = savings * 12;
    const creditImprovement = afterData.creditScore - beforeData.creditScore;

    return (
        <NeuCard className={cn('overflow-hidden', className)}>
            {/* Header */}
            <div className="px-4 py-3 bg-gradient-to-r from-indigo-500/10 to-purple-500/10">
                <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wide text-indigo-700">{title}</h3>
                    <NeuBadge variant="purple">
                        <Sparkles size={10} className="mr-1" />
                        AI Analysis
                    </NeuBadge>
                </div>
            </div>

            {/* Comparison Grid */}
            <div className="p-4">
                <div className="grid grid-cols-2 gap-4 mb-4">
                    {/* Before Column */}
                    <div className="text-center">
                        <p className="text-[10px] uppercase tracking-wide text-neutral-400 mb-2">Today</p>
                        <div className="space-y-3">
                            <div className="p-3 rounded-xl bg-[#e0e5ec] shadow-[inset_2px_2px_4px_#c8d0dc,inset_-2px_-2px_4px_#ffffff]">
                                <p className="text-2xl font-bold text-neutral-700">{beforeData.debtCount}</p>
                                <p className="text-[10px] text-neutral-500">debt accounts</p>
                            </div>
                            <div className="p-3 rounded-xl bg-[#e0e5ec] shadow-[inset_2px_2px_4px_#c8d0dc,inset_-2px_-2px_4px_#ffffff]">
                                <p className="text-lg font-bold text-rose-600">${beforeData.monthlyPayment.toLocaleString()}</p>
                                <p className="text-[10px] text-neutral-500">per month</p>
                            </div>
                        </div>
                    </div>

                    {/* After Column */}
                    <div className="text-center">
                        <p className="text-[10px] uppercase tracking-wide text-emerald-600 mb-2">After Refinance</p>
                        <div className="space-y-3">
                            <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 shadow-[3px_3px_6px_#c8d0dc,-3px_-3px_6px_#ffffff]">
                                <p className="text-2xl font-bold text-emerald-600">{afterData.debtCount}</p>
                                <p className="text-[10px] text-emerald-700">payment{afterData.debtCount !== 1 ? 's' : ''}</p>
                            </div>
                            <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 shadow-[3px_3px_6px_#c8d0dc,-3px_-3px_6px_#ffffff]">
                                <p className="text-lg font-bold text-emerald-600">${afterData.monthlyPayment.toLocaleString()}</p>
                                <p className="text-[10px] text-emerald-700">per month</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Additional Comparisons */}
                <div className="mt-4 p-3 rounded-xl bg-[#e0e5ec] shadow-[inset_2px_2px_4px_#c8d0dc,inset_-2px_-2px_4px_#ffffff]">
                    <ComparisonRow 
                        icon={TrendingDown}
                        label="Avg Interest Rate"
                        before={`${beforeData.avgRate}%`}
                        after={`${afterData.avgRate}%`}
                        improved={afterData.avgRate < beforeData.avgRate}
                    />
                    <ComparisonRow 
                        icon={CreditCard}
                        label="Credit Score"
                        before={beforeData.creditScore}
                        after={`${afterData.creditScore}+`}
                        improved={true}
                    />
                </div>
            </div>

            {/* Savings Spotlight */}
            <div className="px-4 py-4 bg-gradient-to-r from-emerald-500 to-teal-500">
                <div className="flex items-center justify-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                        <DollarSign size={20} className="text-white" />
                    </div>
                    <div className="text-center">
                        <p className="text-white/80 text-xs uppercase tracking-wide">Monthly Savings</p>
                        <p className="text-2xl font-bold text-white">
                            <AnimatedNumber value={savings} prefix="$" suffix="/mo" />
                        </p>
                    </div>
                    <div className="text-center border-l border-white/30 pl-3">
                        <p className="text-white/80 text-xs uppercase tracking-wide">Annual</p>
                        <p className="text-lg font-bold text-white">
                            ${annualSavings.toLocaleString()}/yr
                        </p>
                    </div>
                </div>
            </div>

            {/* Benefits List */}
            <div className="p-4 bg-[#e0e5ec]">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-neutral-600">
                        <CheckCircle size={14} className="text-emerald-500" />
                        <span>Simplify {beforeData.debtCount} payments into 1</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-neutral-600">
                        <CheckCircle size={14} className="text-emerald-500" />
                        <span>Reduce interest from {beforeData.avgRate}% to {afterData.avgRate}%</span>
                    </div>
                    {creditImprovement > 0 && (
                        <div className="flex items-center gap-2 text-sm text-neutral-600">
                            <CheckCircle size={14} className="text-emerald-500" />
                            <span>Est. credit score increase of {creditImprovement}+ points</span>
                        </div>
                    )}
                </div>
            </div>
        </NeuCard>
    );
}

// Compact comparison for headers
export function CompactComparison({ before, after, label, className }) {
    const improved = after < before;
    const diff = before - after;

    return (
        <div className={cn('flex items-center gap-2', className)}>
            <span className="text-sm text-neutral-500">{label}:</span>
            <span className="text-sm text-neutral-400 line-through">${before.toLocaleString()}</span>
            <ArrowRight size={12} className="text-emerald-500" />
            <span className={cn(
                "text-sm font-bold",
                improved ? "text-emerald-600" : "text-neutral-700"
            )}>
                ${after.toLocaleString()}
            </span>
            {improved && (
                <span className="text-xs text-emerald-600 font-medium">
                    (-${diff.toLocaleString()})
                </span>
            )}
        </div>
    );
}





