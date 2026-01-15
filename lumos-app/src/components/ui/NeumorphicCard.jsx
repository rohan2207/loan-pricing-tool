import React from 'react';
import { cn } from '../../lib/utils';

// Base neumorphic card
export function NeuCard({ children, className, variant = 'raised', onClick, ...props }) {
    const variants = {
        raised: 'shadow-[6px_6px_12px_#c8d0dc,-6px_-6px_12px_#ffffff]',
        subtle: 'shadow-[4px_4px_8px_#c8d0dc,-4px_-4px_8px_#ffffff]',
        inset: 'shadow-[inset_4px_4px_8px_#c8d0dc,inset_-4px_-4px_8px_#ffffff]',
        flat: 'shadow-none'
    };

    return (
        <div
            className={cn(
                'bg-[#e0e5ec] rounded-2xl transition-all duration-200',
                variants[variant],
                onClick && 'cursor-pointer hover:shadow-[4px_4px_8px_#c8d0dc,-4px_-4px_8px_#ffffff]',
                className
            )}
            onClick={onClick}
            {...props}
        >
            {children}
        </div>
    );
}

// Neumorphic button
export function NeuButton({ 
    children, 
    className, 
    variant = 'default', 
    size = 'md',
    disabled,
    onClick,
    ...props 
}) {
    const variants = {
        default: 'bg-[#e0e5ec] text-neutral-700 shadow-[5px_5px_10px_#c8d0dc,-5px_-5px_10px_#ffffff] hover:shadow-[3px_3px_6px_#c8d0dc,-3px_-3px_6px_#ffffff] active:shadow-[inset_3px_3px_6px_#c8d0dc,inset_-3px_-3px_6px_#ffffff]',
        primary: 'bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-[5px_5px_10px_#c8d0dc,-5px_-5px_10px_#ffffff] hover:from-indigo-600 hover:to-indigo-700',
        success: 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-[5px_5px_10px_#c8d0dc,-5px_-5px_10px_#ffffff] hover:from-emerald-600 hover:to-emerald-700',
        warning: 'bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-[5px_5px_10px_#c8d0dc,-5px_-5px_10px_#ffffff]',
        danger: 'bg-gradient-to-br from-rose-500 to-rose-600 text-white shadow-[5px_5px_10px_#c8d0dc,-5px_-5px_10px_#ffffff]',
        ghost: 'bg-transparent text-neutral-600 hover:bg-[#e0e5ec]/50'
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-xs rounded-lg',
        md: 'px-4 py-2 text-sm rounded-xl',
        lg: 'px-6 py-3 text-base rounded-xl'
    };

    return (
        <button
            className={cn(
                'font-semibold transition-all duration-150 flex items-center justify-center gap-2',
                variants[variant],
                sizes[size],
                disabled && 'opacity-50 cursor-not-allowed',
                className
            )}
            disabled={disabled}
            onClick={onClick}
            {...props}
        >
            {children}
        </button>
    );
}

// Neumorphic stat card
export function NeuStat({ label, value, subvalue, icon, trend, className }) {
    return (
        <NeuCard className={cn('p-4 text-center', className)}>
            {icon && (
                <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-gradient-to-br from-indigo-100 to-indigo-50 shadow-[inset_2px_2px_4px_#c8d0dc,inset_-2px_-2px_4px_#ffffff] flex items-center justify-center text-indigo-600">
                    {icon}
                </div>
            )}
            <p className="text-2xl font-bold text-neutral-800">{value}</p>
            {subvalue && <p className="text-xs text-neutral-500 mt-0.5">{subvalue}</p>}
            <p className="text-[10px] uppercase tracking-wide text-neutral-400 mt-1">{label}</p>
            {trend && (
                <div className={cn(
                    'mt-2 text-xs font-medium',
                    trend > 0 ? 'text-emerald-600' : trend < 0 ? 'text-rose-600' : 'text-neutral-500'
                )}>
                    {trend > 0 ? '↑' : trend < 0 ? '↓' : '→'} {Math.abs(trend)}%
                </div>
            )}
        </NeuCard>
    );
}

// Neumorphic badge
export function NeuBadge({ children, variant = 'default', className }) {
    const variants = {
        default: 'bg-[#e0e5ec] text-neutral-600',
        success: 'bg-gradient-to-r from-emerald-100 to-emerald-50 text-emerald-700',
        warning: 'bg-gradient-to-r from-amber-100 to-amber-50 text-amber-700',
        danger: 'bg-gradient-to-r from-rose-100 to-rose-50 text-rose-700',
        info: 'bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700',
        purple: 'bg-gradient-to-r from-purple-100 to-purple-50 text-purple-700'
    };

    return (
        <span className={cn(
            'inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wide',
            'shadow-[2px_2px_4px_#c8d0dc,-2px_-2px_4px_#ffffff]',
            variants[variant],
            className
        )}>
            {children}
        </span>
    );
}

// Neumorphic progress bar
export function NeuProgress({ value, max = 100, showLabel = true, variant = 'default', className }) {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100));
    
    const gradients = {
        default: 'from-indigo-500 to-purple-500',
        success: 'from-emerald-500 to-teal-500',
        warning: 'from-amber-500 to-orange-500',
        danger: 'from-rose-500 to-pink-500'
    };

    return (
        <div className={cn('space-y-1', className)}>
            <div className="h-3 rounded-full bg-[#e0e5ec] shadow-[inset_2px_2px_4px_#c8d0dc,inset_-2px_-2px_4px_#ffffff] overflow-hidden">
                <div 
                    className={cn(
                        'h-full rounded-full bg-gradient-to-r transition-all duration-500 ease-out',
                        gradients[variant]
                    )}
                    style={{ width: `${percentage}%` }}
                />
            </div>
            {showLabel && (
                <div className="flex justify-between text-[10px] text-neutral-500">
                    <span>{value.toLocaleString()}</span>
                    <span>{percentage.toFixed(0)}%</span>
                </div>
            )}
        </div>
    );
}

// Neumorphic list item
export function NeuListItem({ children, className, active, onClick }) {
    return (
        <div
            className={cn(
                'p-3 rounded-xl bg-[#e0e5ec] transition-all duration-200 cursor-pointer',
                active 
                    ? 'shadow-[inset_3px_3px_6px_#c8d0dc,inset_-3px_-3px_6px_#ffffff]'
                    : 'shadow-[3px_3px_6px_#c8d0dc,-3px_-3px_6px_#ffffff] hover:shadow-[4px_4px_8px_#c8d0dc,-4px_-4px_8px_#ffffff] hover:-translate-y-0.5',
                className
            )}
            onClick={onClick}
        >
            {children}
        </div>
    );
}

// Neumorphic icon button
export function NeuIconButton({ icon, className, active, onClick, size = 'md', ...props }) {
    const sizes = {
        sm: 'w-8 h-8',
        md: 'w-10 h-10',
        lg: 'w-12 h-12'
    };

    return (
        <button
            className={cn(
                'rounded-xl bg-[#e0e5ec] flex items-center justify-center transition-all duration-150',
                active
                    ? 'shadow-[inset_2px_2px_4px_#c8d0dc,inset_-2px_-2px_4px_#ffffff]'
                    : 'shadow-[4px_4px_8px_#c8d0dc,-4px_-4px_8px_#ffffff] hover:shadow-[2px_2px_4px_#c8d0dc,-2px_-2px_4px_#ffffff] active:shadow-[inset_2px_2px_4px_#c8d0dc,inset_-2px_-2px_4px_#ffffff]',
                sizes[size],
                className
            )}
            onClick={onClick}
            {...props}
        >
            {icon}
        </button>
    );
}

// Neumorphic input
export function NeuInput({ className, ...props }) {
    return (
        <input
            className={cn(
                'w-full px-4 py-3 rounded-xl bg-[#e0e5ec] text-neutral-700',
                'shadow-[inset_3px_3px_6px_#c8d0dc,inset_-3px_-3px_6px_#ffffff]',
                'focus:shadow-[inset_2px_2px_4px_#c8d0dc,inset_-2px_-2px_4px_#ffffff,0_0_0_3px_rgba(99,102,241,0.2)]',
                'outline-none transition-all duration-200',
                'placeholder:text-neutral-400',
                className
            )}
            {...props}
        />
    );
}

// Neumorphic divider
export function NeuDivider({ className }) {
    return (
        <div className={cn(
            'h-0.5 my-4 bg-gradient-to-r from-transparent via-[#c8d0dc] to-transparent',
            className
        )} />
    );
}





