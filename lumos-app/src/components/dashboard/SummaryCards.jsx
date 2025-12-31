import React from 'react';
import { cn } from '../../lib/utils';
import { Home, CreditCard, DollarSign } from 'lucide-react';

export function SummaryCards() {
    return (
        <div className="grid grid-cols-5 gap-4 px-6 pt-4">
            <SummaryCard
                title="Current Liens"
                value="$427,500"
                borderColor="border-information-l1"
                titleColor="text-information"
                icon={<Home size={16} />}
            >
                <div className="mt-2 space-y-0.5">
                    <p className="text-xs font-semibold text-information">First: REGIONS BANK - $247,500</p>
                    <p className="text-xs font-semibold text-information">Second: PENFED - $180,000</p>
                </div>
            </SummaryCard>

            <SummaryCard
                title="Credit Score"
                borderColor="border-warning"
                titleColor="text-warning"
                icon={<CreditCard size={16} />}
            >
                <div className="flex items-baseline gap-6 mt-4">
                    <div>
                        <p className="text-xs font-medium text-warning">Borrower</p>
                        <p className="text-h3 font-bold text-lg text-warning">608</p>
                    </div>
                    <div>
                        <p className="text-xs font-medium text-warning">Co-Borrower</p>
                        <p className="text-h3 font-bold text-lg text-warning">650</p>
                    </div>
                </div>
                <p className="text-xs font-semibold text-neutral-l2 mt-2">Report Date: 2025-01-14</p>
            </SummaryCard>

            <SummaryCard
                title="Consumer Finance"
                borderColor="border-information-l1"
                titleColor="text-information"
                className="bg-gradient-to-r from-danger-l3/20 to-information/20"
                headerAction={<Badge color="blue">Loan</Badge>}
            >
                <p className="font-bold text-sm xl:text-base line-clamp-2 break-words leading-tight text-information">Solar Installation</p>
                <div className="mt-2 space-y-1 text-information">
                    <div className="flex justify-between items-center">
                        <p className="text-xs font-semibold">Unpaid Principal Balance:</p>
                        <p className="text-default font-medium md:text-sm sm:text-xs">$42,000.00</p>
                    </div>
                    <div className="flex justify-between items-center">
                        <p className="text-xs font-semibold">Payment:</p>
                        <p className="text-default font-medium">$0.00</p>
                    </div>
                </div>
            </SummaryCard>

            <SummaryCard
                title="Available Equity"
                borderColor="border-alternativePrimary-l1"
                titleColor="text-alternativePrimary"
                className="bg-alternativePrimary-l4"
            >
                <div className="space-y-1 mt-2">
                    <div className="flex justify-between items-center text-alternativePrimary">
                        <p className="text-xs font-semibold">Cash-Out (80%):</p>
                        <p className="text-default font-medium">$0</p>
                    </div>
                    <div className="flex justify-between items-center text-danger">
                        <p className="text-xs font-semibold">HELOC (95%):</p>
                        <p className="text-default font-medium">$77,188</p>
                    </div>
                </div>
            </SummaryCard>

            <SummaryCard
                title="Credit Utilization"
                borderColor="border-warning"
                titleColor="text-warning"
                value="44.29%"
            >
                <div className="mt-2 space-y-0.5 text-neutral-l2">
                    <p className="text-xs font-semibold">Delinquencies: 0</p>
                    <div className="flex gap-2 flex-wrap text-xs font-semibold">
                        <p>CO:0</p>
                        <p>90:0</p>
                        <p>60:0</p>
                        <p>30:0</p>
                    </div>
                </div>
            </SummaryCard>
        </div>
    );
}

function SummaryCard({ title, value, borderColor, titleColor, children, className, headerAction }) {
    return (
        <div className={cn("rounded bg-white border w-full px-4 py-4 shadow-sm hover:shadow-md transition-shadow", borderColor, className)}>
            <div className="flex justify-between items-center mb-1">
                <p className={cn("text-xs font-medium", titleColor)}>{title}</p>
                {headerAction}
            </div>
            {value && <p className={cn("text-lg font-bold", titleColor)}>{value}</p>}
            {children}
        </div>
    );
}

function Badge({ children, color }) {
    return (
        <span className="text-xs font-semibold flex items-center w-fit px-2 py-0.5 rounded bg-information-l3 text-information-d2 border border-information-l1 uppercase">
            {children}
        </span>
    )
}
