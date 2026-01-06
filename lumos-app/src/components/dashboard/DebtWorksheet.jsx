import React from 'react';
import { DollarSign, Check } from 'lucide-react';

export function DebtWorksheet({ selectedDebts = [] }) {
    // Filter to only show selected debts
    const debtsToShow = selectedDebts.filter(debt => debt.willPay);
    
    // Calculate totals
    const totalPayment = debtsToShow.reduce((sum, debt) => sum + parseFloat(debt.payment.replace(/[$,]/g, '') || 0), 0);
    const totalPayoff = debtsToShow.reduce((sum, debt) => sum + parseFloat(debt.balance.replace(/[$,]/g, '') || 0), 0);

    return (
        <div className="p-4 bg-white">
            <div className="mb-6 border border-neutral-l3 rounded-lg overflow-hidden">
                <p className="not-italic text-lg font-bold text-center text-white bg-neutral-d1 p-3">
                    DEBT CONSOLIDATION WORKSHEET
                </p>
                <div className="w-full">
                    <table className="w-full border-collapse text-xs">
                        <thead>
                            <tr>
                                <WorksheetHeader>Creditor</WorksheetHeader>
                                <WorksheetHeader>Type</WorksheetHeader>
                                <WorksheetHeader>Monthly Payment</WorksheetHeader>
                                <WorksheetHeader>Payoff Amount</WorksheetHeader>
                                <WorksheetHeader>Paid Off</WorksheetHeader>
                            </tr>
                        </thead>
                        <tbody>
                            {debtsToShow.length > 0 ? (
                                <>
                                    {debtsToShow.map((debt, index) => (
                            <WorksheetRow
                                            key={debt.id || index}
                                            creditor={debt.creditor}
                                            type={debt.accountType}
                                            payment={debt.payment}
                                            payoff={debt.balance}
                                paidOff="Yes"
                                            isEven={index % 2 === 0}
                                        />
                                    ))}
                                    <tr className="bg-orange-l2">
                                <td className="border border-neutral-l3 p-2 text-right font-bold" colSpan={2}>Total</td>
                                        <td className="border border-neutral-l3 p-2 text-center font-bold">${totalPayment.toLocaleString()}</td>
                                        <td className="border border-neutral-l3 p-2 text-center font-bold">${totalPayoff.toLocaleString()}</td>
                                <td className="border border-neutral-l3 p-2"></td>
                            </tr>
                                </>
                            ) : (
                                <tr>
                                    <td colSpan={5} className="p-4 text-center text-neutral-l1">
                                        No debts selected. Check "Will Pay" on accounts to add them.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    <div className="bg-white p-2 text-xs">
                        <p className="not-italic text-xs font-normal text-neutral-l1">
                            * Mortgage Payoff(s) are estimated and will change with actual payoff amount from lender(s)
                        </p>
                    </div>
                </div>
            </div>

            <p className="not-italic text-lg font-bold bg-orange text-white p-3 text-center mb-0">
                OUR PROMISE
            </p>

            <div className="p-6 bg-neutral-l5">
                <div className="text-center mb-6">
                    <div className="text-orange flex items-center justify-center">
                        <span className="inline-block w-16 h-0.5 bg-orange"></span>
                        <span className="not-italic text-sm font-normal mx-2 uppercase tracking-widest">peace-of-mind</span>
                        <span className="inline-block w-16 h-0.5 bg-orange"></span>
                    </div>
                    <p className="not-italic text-xl font-bold text-orange uppercase tracking-widest mt-1">promise</p>
                </div>

                <PromiseItem
                    icon={<DollarSign size={24} className="text-orange" />}
                    title="No Lender Fees"
                    description="No Lender Fees. Nope, we don't charge them."
                />

                <PromiseItem
                    icon={<span className="text-2xl font-medium text-orange">%</span>}
                    title="Better Rate Guarantee"
                    description="We're confident in our incredible rates. If you find a lower rate, we'll match it or pay you $1,000."
                />

                <PromiseItem
                    icon={<Check size={24} className="text-orange" />}
                    title="Lifetime Rewards Guarantee"
                    description="We hook our friends up. Returning customers are eligible for exclusive rate discounts and pay NO out-of-pocket expenses on a refinance."
                />
            </div>
        </div>
    );
}

function WorksheetHeader({ children }) {
    return (
        <th className="bg-orange text-white p-2 font-bold border-b border-neutral-l3 text-left">
            {children}
        </th>
    )
}

function WorksheetRow({ creditor, type, payment, payoff, paidOff, isEven }) {
    return (
        <tr className={isEven ? "bg-neutral-l4" : "bg-white"}>
            <td className="border border-neutral-l3 p-2 font-bold text-center">{creditor}</td>
            <td className="border border-neutral-l3 p-2 text-center">{type}</td>
            <td className="border border-neutral-l3 p-2 text-center">{payment}</td>
            <td className="border border-neutral-l3 p-2 text-center">{payoff}</td>
            <td className="border border-neutral-l3 p-2 text-center">{paidOff}</td>
        </tr>
    )
}

function PromiseItem({ icon, title, description }) {
    return (
        <div className="flex items-center mb-4 last:mb-0">
            <div className="w-12 h-12 rounded-full border-2 border-orange flex items-center justify-center mr-4 flex-shrink-0">
                {icon}
            </div>
            <div>
                <p className="not-italic text-default font-bold text-orange">{title}</p>
                <p className="not-italic text-xs font-normal text-neutral-d2 leading-tight mt-0.5">{description}</p>
            </div>
        </div>
    )
}
