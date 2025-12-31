import React, { useState } from 'react';
import { cn } from '../../lib/utils';
import { LoanProposalTab } from './tabs/LoanProposalTab';
import { SolarLoanPaydownTab } from './tabs/SolarLoanPaydownTab';
import { DebtConsolidationTab } from './tabs/DebtConsolidationTab';
import { RecoupCostsTab } from './tabs/RecoupCostsTab';
import { CompoundInterestTab } from './tabs/CompoundInterestTab';
import { DisposableIncomeTab } from './tabs/DisposableIncomeTab';
import { RefreshCw, Maximize2, ExternalLink } from 'lucide-react';

const tabs = [
    { id: 'loan-proposal', label: 'Loan Proposal', chartType: 'loan-proposal' },
    { id: 'solar-paydown', label: 'Solar Loan Paydown', chartType: 'solar-partial-pay' },
    { id: 'debt-consolidation', label: 'Debt Consolidation', chartType: 'debt-consolidation' },
    { id: 'recoup-costs', label: 'Time to Recoup Closing Costs', chartType: 'recoup-costs' },
    { id: 'compound-interest', label: 'Compound Interest Forecaster', chartType: 'reinvestment' },
    { id: 'disposable-income', label: 'Estimated Disposable Income', chartType: 'disposable-income' },
];

export function CalculatorTabs({ accounts, calculatorData, onCalculatorDataChange, includeOption2, onOpenFlyover }) {
    const [activeTab, setActiveTab] = useState('loan-proposal');

    const handleRefresh = () => {
        // Refresh calculations
        console.log('Refreshing calculations...');
    };

    const handleViewChart = () => {
        const currentTab = tabs.find(t => t.id === activeTab);
        if (currentTab && onOpenFlyover) {
            onOpenFlyover(`ChartPreview:${currentTab.chartType}`);
        }
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'loan-proposal':
                return (
                    <LoanProposalTab 
                        data={calculatorData.loanProposal}
                        onChange={(data) => onCalculatorDataChange({
                            ...calculatorData,
                            loanProposal: data
                        })}
                        includeOption2={includeOption2}
                    />
                );
            case 'solar-paydown':
                return <SolarLoanPaydownTab />;
            case 'debt-consolidation':
                return (
                    <DebtConsolidationTab 
                        accounts={accounts}
                    />
                );
            case 'recoup-costs':
                return <RecoupCostsTab />;
            case 'compound-interest':
                return (
                    <CompoundInterestTab 
                        data={calculatorData.compoundInterest}
                        onChange={(data) => onCalculatorDataChange({
                            ...calculatorData,
                            compoundInterest: data
                        })}
                    />
                );
            case 'disposable-income':
                return (
                    <DisposableIncomeTab 
                        data={calculatorData.disposableIncome}
                        onChange={(data) => onCalculatorDataChange({
                            ...calculatorData,
                            disposableIncome: data
                        })}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="h-full flex flex-col">
            {/* Action Bar */}
            <div className="flex justify-between items-center p-3 border-b border-neutral-l3 bg-white">
                <span className="text-xs text-neutral-l1">
                    {tabs.find(t => t.id === activeTab)?.label}
                </span>
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleViewChart}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-orange hover:bg-orange-d1 text-white rounded font-medium text-xs transition-colors"
                        title="View chart in flyover"
                    >
                        <ExternalLink size={14} />
                        View Chart
                    </button>
                    <button
                        onClick={handleRefresh}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-l4 hover:bg-neutral-l3 text-neutral-d2 rounded font-medium text-xs transition-colors"
                    >
                        <RefreshCw size={14} />
                        Refresh
                    </button>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="bg-white border-b border-neutral-l3">
                <div className="flex overflow-x-auto">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors",
                                activeTab === tab.id
                                    ? "border-orange text-orange bg-orange-l3/20"
                                    : "border-transparent text-neutral-d1 hover:text-neutral-d3 hover:bg-neutral-l5"
                            )}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-4">
                {renderTabContent()}
            </div>
        </div>
    );
}
