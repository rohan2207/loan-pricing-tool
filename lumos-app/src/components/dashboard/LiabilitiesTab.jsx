import React from 'react';
import { cn } from '../../lib/utils';
import { ChevronDown, ChevronRight, Home, ChevronUp } from 'lucide-react';

export function LiabilitiesTab({ accounts, onAccountToggle, onToggleAll }) {
    const allSelected = accounts.every(acc => acc.willPay);
    const someSelected = accounts.some(acc => acc.willPay);

    return (
        <div className="space-y-4">
            {/* Filters Section */}
            <div className="border border-neutral-l3 rounded px-6 py-4 bg-white">
                <div className="flex justify-between items-center flex-wrap mb-4">
                    <p className="text-default font-medium">Select Credit Bureau to View</p>
                    <p className="text-xs text-neutral-l1">(Bureau filtering unavailable in "All Applicants" view)</p>
                </div>
                <div className="flex items-center justify-between flex-wrap">
                    <BureauSelector />
                    <ApplicantSelector />
                </div>
            </div>

            {/* Header */}
            <div className="flex justify-between items-center px-6 mt-6">
                <h3 className="text-default font-medium">Merged Credit Report - All Bureaus</h3>
                <p className="text-sm font-normal text-neutral-l1">Select debts to pay off at closing</p>
            </div>

            {/* Utilization and Current Loan */}
            <div className="px-6 my-4">
                <UtilizationSummary />
            </div>

            <div className="px-6 mb-4">
                <CurrentGoodLeapLoan />
            </div>

            <div className="px-6 mt-4">
                <h3 className="text-default font-medium mb-2 flex items-center gap-2">
                    Open Accounts
                    <span className="bg-success-l2 text-success text-xs font-semibold px-2 py-0.5 rounded-full">{accounts.length} Accounts</span>
                </h3>
                <OpenAccountsTable 
                    accounts={accounts} 
                    onAccountToggle={onAccountToggle}
                    onToggleAll={onToggleAll}
                    allSelected={allSelected}
                    someSelected={someSelected}
                />
            </div>
        </div>
    );
}

function BureauSelector() {
    return (
        <div className="flex gap-2 bg-neutral-l4 rounded p-1">
            <button disabled className="px-4 py-1.5 text-sm font-normal bg-white text-neutral-d3 rounded shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">Merged</button>
            <div className="flex gap-2">
                <BureauButton color="danger" score="655" label="Equifax" disabled />
                <BureauButton color="success" score="645" label="Experian" disabled />
                <BureauButton color="information" score="655" label="Transunion" disabled />
            </div>
        </div>
    )
}

function BureauButton({ color, score, label, disabled }) {
    const colorClasses = {
        danger: "bg-danger",
        success: "bg-success",
        information: "bg-information"
    };

    return (
        <button disabled={disabled} className="flex items-center gap-2 px-4 py-1.5 text-sm bg-neutral-l4 text-neutral-d3 rounded disabled:opacity-50 disabled:cursor-not-allowed">
            <span className={cn("w-2 h-2 rounded-full", colorClasses[color])}></span>
            {label}
            <span className="bg-neutral-l3 text-neutral-d2 text-xs px-1.5 rounded ml-1">{score}</span>
        </button>
    )
}

function ApplicantSelector() {
    return (
        <div className="flex items-center gap-3">
            <p className="font-medium text-default">Applicant</p>
            <div className="relative min-w-[200px]">
                <button className="flex items-center justify-between w-full border border-neutral-l2 rounded px-2 py-1 bg-white text-neutral-d2 text-sm">
                    All Applicants
                    <ChevronDown size={16} />
                </button>
            </div>
        </div>
    )
}

function UtilizationSummary() {
    return (
        <div className="rounded bg-white border border-neutral-l3 p-6">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-default font-medium">Overall Revolving Credit Utilization</h3>
                <span className="bg-neutral-l4 text-neutral-d2 text-xs font-semibold px-2 py-0.5 rounded">5 accounts</span>
            </div>
            <div className="grid grid-cols-4 gap-6 mb-3">
                <UtilizationStat label="Limit" value="$31,500" valueColor="text-neutral-d2" />
                <UtilizationStat label="Balance" value="$13,950" valueColor="text-danger" />
                <UtilizationStat label="Available" value="$17,550" valueColor="text-success" />
                <UtilizationStat label="Utilization" value="44.3%" valueColor="text-warning" />
            </div>
            <div className="relative pt-1">
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-neutral-l3">
                    <div style={{ width: "44.3%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-success to-warning"></div>
                </div>
                <div className="relative h-4 text-xs font-semibold text-neutral-l2">
                    <span className="absolute left-0">0%</span>
                    <span className="absolute left-[30%] -translate-x-1/2">30%</span>
                    <span className="absolute right-0">100%</span>
                </div>
            </div>
        </div>
    )
}

function UtilizationStat({ label, value, valueColor }) {
    return (
        <div className="text-center">
            <p className="text-neutral-l1 text-sm mb-1">{label}</p>
            <p className={cn("text-lg font-bold", valueColor)}>{value}</p>
        </div>
    )
}

function CurrentGoodLeapLoan() {
    return (
        <div className="border border-information-l2 rounded overflow-hidden bg-white">
            <div className="flex items-center gap-2 px-4 py-2 bg-information-l2 border-b border-information-l1 text-information-d2">
                <Home size={16} className="text-information-d1" />
                <p className="font-medium text-sm">Current GoodLeap Loan</p>
            </div>
            <table className="w-full text-sm">
                <thead className="bg-information-l3 text-neutral-d1 uppercase text-xs font-medium">
                    <tr>
                        <th className="px-4 py-2 text-left">Account</th>
                        <th className="px-4 py-2 text-right">Balance</th>
                        <th className="px-4 py-2 text-right">Payment</th>
                        <th className="px-4 py-2 text-right">Interest Rate</th>
                        <th className="px-4 py-2 text-center">Will Pay</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="px-4 py-3">
                            <p className="font-medium text-default">CF-1234567</p>
                            <p className="text-xs text-neutral-l1">GOODLEAP</p>
                        </td>
                        <td className="px-4 py-3 text-right font-medium">$42,000.00</td>
                        <td className="px-4 py-3 text-right font-medium">$0.00</td>
                        <td className="px-4 py-3 text-right font-medium">6.750%</td>
                        <td className="px-4 py-3 text-center">
                            <input type="checkbox" className="h-4 w-4 text-information rounded cursor-pointer accent-information" />
                        </td>
                    </tr>
                </tbody>
            </table>
            <div className="px-4 py-2 bg-information-l2 border-t border-information-l1 text-xs text-neutral-l1">
                💡 This is your current GoodLeap loan. Check "Will Pay" to include it in your debt consolidation calculations.
            </div>
        </div>
    )
}

function OpenAccountsTable({ accounts, onAccountToggle, onToggleAll, allSelected, someSelected }) {
    return (
        <div className="overflow-visible rounded bg-white shadow-sm border border-l3">
            <table className="w-full border-separate border-spacing-0 table-fixed text-sm">
                <thead className="bg-neutral-l5 text-neutral-l1">
                    <tr>
                        <th className="w-9 px-4 py-3 border-b border-neutral-l3"></th>
                        <SortHeader label="ECOA" />
                        <SortHeader label="Account" />
                        <SortHeader label="Creditor" />
                        <SortHeader label="Type" />
                        <SortHeader label="Reported By" />
                        <SortHeader label="Credit Limit" />
                        <SortHeader label="Start Date" />
                        <SortHeader label="Balance" active />
                        <SortHeader label="Payment" />
                        <SortHeader label="Utilization" />
                        <SortHeader label="Interest Rate" />
                        <th className="px-4 py-3 border-b border-neutral-l3 min-w-[100px]">
                            <div className="flex items-center gap-1 font-medium text-neutral-d1">
                                Will Pay
                                <input 
                                    type="checkbox" 
                                    checked={allSelected}
                                    ref={el => {
                                        if (el) el.indeterminate = someSelected && !allSelected;
                                    }}
                                    onChange={(e) => onToggleAll(e.target.checked)}
                                    className="ml-2 h-4 w-4 rounded cursor-pointer accent-information" 
                                />
                            </div>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {accounts.map((acc, i) => (
                        <tr 
                            key={acc.id} 
                            className={cn(
                                "hover:bg-neutral-l5 group border-b border-neutral-l3 last:border-0",
                                acc.willPay ? "bg-success-l3/30" : "bg-white"
                            )}
                        >
                            <td className="px-4 py-3 border-b border-neutral-l4">
                                <button className="text-neutral-d2"><ChevronRight size={16} /></button>
                            </td>
                            <td className="px-4 py-3 border-b border-neutral-l4"><Badge>{acc.type}</Badge></td>
                            <td className="px-4 py-3 border-b border-neutral-l4 font-medium truncate">{acc.account}</td>
                            <td className="px-4 py-3 border-b border-neutral-l4 font-medium truncate">{acc.creditor}</td>
                            <td className="px-4 py-3 border-b border-neutral-l4"><Badge type="secondary">{acc.accountType}</Badge></td>
                            <td className="px-4 py-3 border-b border-neutral-l4">
                                <div className="flex gap-1">
                                    {acc.reported.map(r => (
                                        <Badge key={r} type={r}>{r}</Badge>
                                    ))}
                                </div>
                            </td>
                            <td className="px-4 py-3 border-b border-neutral-l4 font-medium">{acc.limit}</td>
                            <td className="px-4 py-3 border-b border-neutral-l4 font-medium">{acc.startDate}</td>
                            <td className="px-4 py-3 border-b border-neutral-l4 font-medium">{acc.balance}</td>
                            <td className="px-4 py-3 border-b border-neutral-l4 font-medium">{acc.payment}</td>
                            <td className="px-4 py-3 border-b border-neutral-l4 font-medium">{acc.util}</td>
                            <td className="px-4 py-3 border-b border-neutral-l4 font-medium">{acc.rate}</td>
                            <td className="px-4 py-3 border-b border-neutral-l4 text-center">
                                <input 
                                    type="checkbox" 
                                    checked={acc.willPay}
                                    onChange={() => onAccountToggle(acc.id)}
                                    className="h-4 w-4 text-information rounded cursor-pointer accent-information" 
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

function SortHeader({ label, active }) {
    return (
        <th className="px-4 py-3 border-b border-neutral-l3 cursor-pointer hover:bg-neutral-l4 min-w-[100px] text-left">
            <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-neutral-d1">{label}</span>
                {active ? <ChevronDown size={14} className="text-information" /> : <ChevronUp size={14} className="text-neutral-l2 opacity-50" />}
            </div>
        </th>
    )
}

function Badge({ children, type }) {
    let classes = "bg-information-l3 text-information-d2 border-information-l1";
    if (type === 'Borrower') classes = "bg-information-l3 text-information-d2 border-information-l1";
    if (type === 'Co-Borrower') classes = "bg-information-l3 text-information-d2 border-information-l1";
    if (type === 'secondary') classes = "bg-neutral-l4 text-neutral-d2 border-neutral-l1";

    // Credit bureaus
    if (type === 'EQ') classes = "bg-danger-l3 text-danger-d2 border-danger-l1";
    if (type === 'EX') classes = "bg-success-l3 text-success-d2 border-success-l1";
    if (type === 'TU') classes = "bg-information-l3 text-information-d2 border-information-l1";

    return (
        <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full border flex items-center w-fit", classes)}>
            {children}
        </span>
    )
}
