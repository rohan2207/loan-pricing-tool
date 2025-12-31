import React, { useState } from 'react';
import { ProposalBuilder } from './ProposalBuilder';
import { CalculatorTabs } from './CalculatorTabs';

export function GoodLeapAdvantage({ accounts, onOpenFlyover, onStateChange }) {
    // Chart selections for proposal
    const [chart1, setChart1] = useState('');
    const [chart2, setChart2] = useState('');
    
    // Scenario options
    const [includeOption2, setIncludeOption2] = useState(false);
    const [includeDebtWorksheet, setIncludeDebtWorksheet] = useState(true);
    const [spanishVersion, setSpanishVersion] = useState(false);

    // Update parent state when chart selections change
    React.useEffect(() => {
        if (onStateChange) {
            onStateChange({
                chart1,
                chart2,
                includeDebtWorksheet,
            });
        }
    }, [chart1, chart2, includeDebtWorksheet, onStateChange]);
    
    // Calculator data state
    const [calculatorData, setCalculatorData] = useState({
        loanProposal: {
            current: {
                program: 'Fixed',
                loanType: 'Conventional',
                loanAmount: 250000,
                term: 30,
                paymentDate: '01/01/2012',
                yearsRemaining: 19.34,
                rate: 3.75,
                apr: 7.453,
                ltv: 70,
                dti: 19.701,
            },
            option1: {
                program: 'FNMA CONF 30YR I',
                loanType: 'Conventional',
                loanAmount: 210000,
                term: 30,
                paymentDate: '11/01/2022',
                yearsRemaining: 30,
                rate: 7.125,
                apr: 7.453,
                ltv: 70,
                dti: 0,
            },
            option2: {
                program: '',
                loanType: '',
                loanAmount: 210000,
                term: 30,
                paymentDate: '11/01/2022',
                yearsRemaining: 30,
                rate: 7.125,
                apr: 7.453,
                ltv: 70,
                dti: 0,
            },
        },
        compoundInterest: {
            initialInvestment: 12481.59,
            monthlyInvestment: 414.81,
            rateOfReturn: 0,
            yearsInvested: 30,
        },
        disposableIncome: {
            monthlyIncome: 4500,
            incomeAfterTaxes: 3825,
            mortgagePayment: 1250,
            otherPayments: 1089,
        }
    });

    // Handle preview - opens flyover
    const handlePreviewChart = (chartType) => {
        onOpenFlyover(`ChartPreview:${chartType}`);
    };

    // Handle generate proposal
    const handleGenerateProposal = () => {
        onOpenFlyover('ProposalPreview');
    };

    return (
        <div className="h-full flex flex-col">
            {/* Action Bar */}
            <div className="bg-white border-b border-neutral-l3 px-6 py-3 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange to-orange-d1 flex items-center justify-center">
                        <span className="text-white text-sm font-bold">G</span>
                    </div>
                    <span className="font-semibold text-neutral-d3">GoodLeap Advantage</span>
                    <span className="text-xs text-neutral-l1">Loan Benefits Calculator & Proposal Builder</span>
                </div>
            </div>

            {/* Main Split Panel */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left Panel - Proposal Builder (30%) */}
                <div className="w-[320px] flex-shrink-0 border-r border-neutral-l3 bg-white overflow-y-auto">
                    <ProposalBuilder
                        chart1={chart1}
                        chart2={chart2}
                        onChart1Change={setChart1}
                        onChart2Change={setChart2}
                        includeOption2={includeOption2}
                        includeDebtWorksheet={includeDebtWorksheet}
                        spanishVersion={spanishVersion}
                        onIncludeOption2Change={setIncludeOption2}
                        onIncludeDebtWorksheetChange={setIncludeDebtWorksheet}
                        onSpanishVersionChange={setSpanishVersion}
                        onPreviewChart={handlePreviewChart}
                        onGenerateProposal={handleGenerateProposal}
                    />
                </div>

                {/* Right Panel - Calculator Tabs (70%) */}
                <div className="flex-1 overflow-y-auto bg-neutral-l5">
                    <CalculatorTabs
                        accounts={accounts}
                        calculatorData={calculatorData}
                        onCalculatorDataChange={setCalculatorData}
                        includeOption2={includeOption2}
                        onOpenFlyover={onOpenFlyover}
                    />
                </div>
            </div>
        </div>
    );
}

