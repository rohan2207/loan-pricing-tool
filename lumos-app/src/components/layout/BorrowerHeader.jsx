import React from 'react';
import { User, Home, CreditCard, Sun, Building, Percent } from 'lucide-react';
import { cn } from '../../lib/utils';

export function BorrowerHeader() {
    return (
        <div className="flex-shrink-0">
            {/* Borrower Info Bar */}
            <header className="bg-gradient-to-r from-alternativePrimary-l1 to-alternativePrimary-d2 text-white px-6 py-4 shadow-lg">
                <div className="flex justify-between items-center">
                    <div className="flex items-center">
                        <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-4">
                            <User size={24} className="text-white" />
                        </div>
                        <div>
                            <p className="text-xl font-bold">John Smith</p>
                            <p className="text-sm text-white/70 mt-0.5">Loan: MOCK-LOAN-001 • $425,000 • Austin, TX</p>
                        </div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
                        <p className="text-xs font-medium text-white/70">Loan Status</p>
                        <p className="text-base font-semibold flex items-center mt-0.5">
                            <span className="w-2 h-2 bg-success rounded-full mr-2 animate-pulse"></span>
                            Initial Call
                        </p>
                    </div>
                </div>
            </header>

            {/* Summary Cards */}
            <div className="bg-neutral-l5 px-6 py-4 border-b border-neutral-l3">
                <div className="grid grid-cols-5 gap-4">
                    {/* Current Liens */}
                    <SummaryCard
                        title="Current Liens"
                        titleColor="text-information"
                        borderColor="border-information"
                        bgColor="bg-information-l3/30"
                    >
                        <p className="text-2xl font-bold text-information">$427,500</p>
                        <div className="mt-2 space-y-0.5 text-xs">
                            <p className="text-information font-medium">First: REGIONS BANK - $247,500</p>
                            <p className="text-information font-medium">Second: PENFED - $180,000</p>
                        </div>
                    </SummaryCard>

                    {/* Credit Score */}
                    <SummaryCard
                        title="Credit Score"
                        titleColor="text-warning"
                        borderColor="border-warning"
                        bgColor="bg-warning-l5"
                    >
                        <div className="flex gap-6 mt-2">
                            <div>
                                <p className="text-xs text-warning font-medium">Borrower</p>
                                <p className="text-2xl font-bold text-warning">608</p>
                            </div>
                            <div>
                                <p className="text-xs text-warning font-medium">Co-Borrower</p>
                                <p className="text-2xl font-bold text-warning">650</p>
                            </div>
                        </div>
                        <p className="text-xs text-neutral-l1 mt-2">Report Date: 2025-01-14</p>
                    </SummaryCard>

                    {/* Consumer Finance */}
                    <SummaryCard
                        title="Consumer Finance"
                        titleColor="text-information"
                        borderColor="border-information"
                        bgColor="bg-gradient-to-br from-information-l3/30 to-warning-l5/30"
                        badge="LOAN"
                    >
                        <p className="text-lg font-bold text-information">Solar Installation</p>
                        <div className="mt-2 space-y-1 text-xs">
                            <div className="flex justify-between">
                                <span className="text-information">Unpaid Principal Balance:</span>
                                <span className="font-medium text-information">$42,000.00</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-information">Payment:</span>
                                <span className="font-medium text-information">$0.00</span>
                            </div>
                        </div>
                    </SummaryCard>

                    {/* Available Equity */}
                    <SummaryCard
                        title="Available Equity"
                        titleColor="text-neutral-d2"
                        borderColor="border-neutral-l2"
                        bgColor="bg-neutral-l5"
                    >
                        <div className="mt-2 space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-neutral-d1">Cash-Out (80%):</span>
                                <span className="text-lg font-bold text-neutral-d2">$0</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-alternativePrimary">HELOC (95%):</span>
                                <span className="text-lg font-bold text-alternativePrimary">$77,188</span>
                            </div>
                        </div>
                    </SummaryCard>

                    {/* Credit Utilization */}
                    <SummaryCard
                        title="Credit Utilization"
                        titleColor="text-danger"
                        borderColor="border-danger-l1"
                        bgColor="bg-danger-l3/20"
                    >
                        <p className="text-3xl font-bold text-warning">44.29%</p>
                        <div className="mt-2 text-xs text-neutral-l1">
                            <p>Delinquencies: 0</p>
                            <p className="flex gap-2 mt-1">
                                <span>CO:0</span>
                                <span>90:0</span>
                                <span>60:0</span>
                                <span>30:0</span>
                            </p>
                        </div>
                    </SummaryCard>
                </div>
            </div>
        </div>
    );
}

function SummaryCard({ title, titleColor, borderColor, bgColor, badge, children }) {
    return (
        <div className={cn(
            "rounded-lg border p-4 transition-shadow hover:shadow-md",
            borderColor,
            bgColor || "bg-white"
        )}>
            <div className="flex items-center justify-between mb-1">
                <p className={cn("text-xs font-medium uppercase tracking-wide", titleColor)}>{title}</p>
                {badge && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-information-l3 text-information-d2 border border-information-l1">
                        {badge}
                    </span>
                )}
            </div>
            {children}
        </div>
    );
}

