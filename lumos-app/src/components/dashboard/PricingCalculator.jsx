import React, { useState } from 'react';
import { Check, Pencil, RefreshCw, ArrowRight } from 'lucide-react';

export function PricingCalculator({ accounts = [], borrowerData = {}, onSelectChart }) {
  // Configuration state
  const [productCategory, setProductCategory] = useState('Refinance');
  const [selectedProgram, setSelectedProgram] = useState('Conventional');
  const [selectedTerm, setSelectedTerm] = useState(30);
  const [selectedRate, setSelectedRate] = useState(7.5);
  const [ltv, setLtv] = useState(55);
  
  // Input state
  const [loanAmount, setLoanAmount] = useState(200000);
  const [debts, setDebts] = useState(150000);
  const [cashout, setCashout] = useState(50000);
  const [interestRate, setInterestRate] = useState('6.5%');
  
  // Calculated state
  const [calculated, setCalculated] = useState(false);

  // Options
  const programs = ['Conventional', 'FHA', 'VA', 'FHA Streamline', 'VA IRRRL'];
  const terms = [30, 20, 15, 'Non-standard'];
  const rateOptions = [7.5, 7.25, 7, 6.75];
  const ltvMarks = [0, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100];

  // Mock calculations for Value Propositions
  const currentFinances = [
    { key: 'P&I', value: 1710 },
    { key: 'Taxes', value: 450 },
    { key: 'Insurance', value: 120 },
    { key: 'MI/MIP', value: 0 },
    { key: 'Debts', value: 4156 },
    { key: 'Total', value: 6436 },
  ];

  const goodleapOpportunity = [
    { key: 'P&I', value: 3500 },
    { key: 'Taxes', value: 450 },
    { key: 'Insurance', value: 120 },
    { key: 'MI/MIP', value: 154 },
    { key: 'Debts Paid', value: 0 },
    { key: 'Total', value: 4224 },
  ];

  const monthlySavings = currentFinances[5].value - goodleapOpportunity[5].value;

  // Chart highlights data
  const chartHighlights = [
    { 
      title: 'Debt Consolidation', 
      key: 'Total Debts Paid Off', 
      value: debts,
      showDetails: false 
    },
    { 
      title: 'Payment Savings', 
      key: 'Monthly Savings', 
      value: monthlySavings,
      showDetails: true 
    },
    { 
      title: 'Cash Back', 
      key: 'Cash at Closing', 
      value: cashout,
      showDetails: true 
    },
    { 
      title: 'Accelerated Payoff', 
      key: 'Years Saved', 
      value: 7,
      showDetails: true,
      isYears: true
    },
  ];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const handleCalculate = () => {
    setCalculated(true);
  };

  // Pill button component
  const PillButton = ({ selected, onClick, children }) => (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all border-2 ${
        selected
          ? 'bg-[#432c9e] border-[#432c9e] text-white'
          : 'bg-white border-[#e5e7eb] text-[#1e1b4b] hover:border-[#432c9e]/50'
      }`}
    >
      {selected && <Check className="w-4 h-4" />}
      {children}
    </button>
  );

  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1e1b4b]">Price</h1>
        <p className="text-sm text-[#6b7280]">Interact below to build a quote</p>
      </div>

      {/* Main Content - Two Column Layout */}
      <div className="grid grid-cols-2 gap-6">
        
        {/* ==================== LEFT SIDE: Configurations ==================== */}
        <div className="bg-white border border-[#e5e7eb] rounded-2xl p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-[#1e1b4b]">Configurations</h2>
            <div>
              <label className="text-xs text-[#6b7280] block mb-1">Product category</label>
              <select 
                value={productCategory}
                onChange={(e) => setProductCategory(e.target.value)}
                className="px-4 py-2 border border-[#e5e7eb] rounded-lg text-sm text-[#1e1b4b] bg-white min-w-[140px]"
              >
                <option>Refinance</option>
                <option>Purchase</option>
              </select>
            </div>
          </div>

          {/* Program Section */}
          <div className="border border-[#e5e7eb] rounded-xl p-4 mb-4">
            <label className="text-sm font-semibold text-[#1e1b4b] block mb-3">Program</label>
            <div className="flex flex-wrap gap-2">
              {programs.map((program) => (
                <PillButton
                  key={program}
                  selected={selectedProgram === program}
                  onClick={() => setSelectedProgram(program)}
                >
                  {program}
                </PillButton>
              ))}
            </div>
          </div>

          {/* Term Section */}
          <div className="border border-[#e5e7eb] rounded-xl p-4 mb-4">
            <label className="text-sm font-semibold text-[#1e1b4b] block mb-3">Term</label>
            <div className="flex flex-wrap gap-2">
              {terms.map((term) => (
                <PillButton
                  key={term}
                  selected={selectedTerm === term}
                  onClick={() => setSelectedTerm(term)}
                >
                  {term}
                </PillButton>
              ))}
            </div>
          </div>

          {/* Rate Option Section */}
          <div className="border border-[#e5e7eb] rounded-xl p-4 mb-4">
            <label className="text-sm font-semibold text-[#1e1b4b] block mb-3">Rate Option</label>
            <div className="flex flex-wrap gap-2">
              {rateOptions.map((rate) => (
                <PillButton
                  key={rate}
                  selected={selectedRate === rate}
                  onClick={() => setSelectedRate(rate)}
                >
                  {rate}
                </PillButton>
              ))}
            </div>
          </div>

          {/* LTV Section */}
          <div className="border border-[#e5e7eb] rounded-xl p-4 mb-4">
            <div className="flex items-center justify-between mb-4">
              <label className="text-sm font-semibold text-[#1e1b4b]">LTV</label>
              <div className="flex items-center gap-2">
                <Pencil className="w-4 h-4 text-[#432c9e]" />
                <span className="text-lg font-bold text-[#432c9e]">{ltv}%</span>
              </div>
            </div>
            
            {/* Slider */}
            <div className="relative mb-2">
              <input
                type="range"
                min="0"
                max="100"
                value={ltv}
                onChange={(e) => setLtv(parseInt(e.target.value))}
                className="w-full h-1 bg-[#e5e7eb] rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #432c9e 0%, #432c9e ${ltv}%, #e5e7eb ${ltv}%, #e5e7eb 100%)`
                }}
              />
            </div>
            
            {/* Tick marks */}
            <div className="flex justify-between px-1">
              {ltvMarks.map((mark) => (
                <div key={mark} className="flex flex-col items-center">
                  <div className={`w-1.5 h-1.5 rounded-full mb-1 ${mark <= ltv ? 'bg-[#432c9e]' : 'bg-[#e5e7eb]'}`}></div>
                  <span className="text-[10px] text-[#6b7280]">{mark}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Input Fields */}
          <div className="grid grid-cols-4 gap-3 mb-6">
            <div>
              <label className="text-xs font-semibold text-[#1e1b4b] block mb-1.5">Loan amount</label>
              <input
                type="text"
                value={loanAmount.toLocaleString()}
                onChange={(e) => setLoanAmount(parseInt(e.target.value.replace(/,/g, '')) || 0)}
                className="w-full px-3 py-2.5 border border-[#e5e7eb] rounded-lg text-sm text-[#1e1b4b]"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#1e1b4b] block mb-1.5">Debts</label>
              <input
                type="text"
                value={debts.toLocaleString()}
                onChange={(e) => setDebts(parseInt(e.target.value.replace(/,/g, '')) || 0)}
                className="w-full px-3 py-2.5 border border-[#e5e7eb] rounded-lg text-sm text-[#1e1b4b]"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#1e1b4b] block mb-1.5">Cashout</label>
              <input
                type="text"
                value={cashout.toLocaleString()}
                onChange={(e) => setCashout(parseInt(e.target.value.replace(/,/g, '')) || 0)}
                className="w-full px-3 py-2.5 border border-[#e5e7eb] rounded-lg text-sm text-[#1e1b4b]"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#1e1b4b] block mb-1.5">Interest Rate</label>
              <input
                type="text"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                className="w-full px-3 py-2.5 border border-[#e5e7eb] rounded-lg text-sm text-[#1e1b4b]"
              />
            </div>
          </div>

          {/* Calculate Button */}
          <div className="flex justify-center">
            <button
              onClick={handleCalculate}
              className="flex items-center gap-2 px-6 py-3 bg-[#432c9e] text-white font-semibold rounded-xl hover:bg-[#362480] transition-colors"
            >
              Calculate Value Propositions
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ==================== RIGHT SIDE: Value Propositions ==================== */}
        <div className="bg-white border border-[#e5e7eb] rounded-2xl p-6">
          <h2 className="text-xl font-bold text-[#1e1b4b] mb-6">Value Propositions</h2>

          {/* Compare Spread Section */}
          <div className="mb-6">
            <h3 className="text-xs font-bold text-[#6b7280] uppercase tracking-wider mb-4">Compare Spread</h3>
            
            <div className="grid grid-cols-2 gap-4">
              {/* Current Finances */}
              <div className="border border-[#e5e7eb] rounded-xl overflow-hidden">
                <div className="px-4 py-3 bg-[#fafafa] border-b border-[#e5e7eb]">
                  <h4 className="text-sm font-semibold text-[#1e1b4b]">Current Finances</h4>
                </div>
                <div className="divide-y divide-[#e5e7eb]">
                  {currentFinances.map((item, index) => (
                    <div key={index} className={`flex justify-between px-4 py-2.5 ${index === currentFinances.length - 1 ? 'bg-[#fafafa] font-semibold' : ''}`}>
                      <span className="text-sm text-[#1e1b4b]">{item.key}</span>
                      <span className="text-sm text-[#1e1b4b]">{formatCurrency(item.value)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Goodleap Opportunity */}
              <div className="border border-[#e5e7eb] rounded-xl overflow-hidden">
                <div className="px-4 py-3 bg-[#fafafa] border-b border-[#e5e7eb]">
                  <h4 className="text-sm font-semibold text-[#1e1b4b]">Goodleap Opportunity</h4>
                </div>
                <div className="divide-y divide-[#e5e7eb]">
                  {goodleapOpportunity.map((item, index) => (
                    <div key={index} className={`flex justify-between px-4 py-2.5 ${index === goodleapOpportunity.length - 1 ? 'bg-[#fafafa] font-semibold' : ''}`}>
                      <span className="text-sm text-[#1e1b4b]">{item.key}</span>
                      <span className="text-sm text-[#1e1b4b]">{formatCurrency(item.value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Chart Highlights Section */}
          <div>
            <h3 className="text-xs font-bold text-[#6b7280] uppercase tracking-wider mb-4">Chart Highlights</h3>
            
            <div className="space-y-3">
              {chartHighlights.map((chart, index) => (
                <div key={index} className="border border-[#e5e7eb] rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-bold text-[#1e1b4b] uppercase">
                      {`{CHART PRIMARY ELEMENT: ${chart.title.toUpperCase()}}`}
                    </h4>
                    {chart.showDetails && (
                      <button 
                        onClick={() => onSelectChart?.(chart.title.toLowerCase().replace(/\s+/g, '-'))}
                        className="flex items-center gap-1 px-3 py-1.5 border border-[#432c9e] text-[#432c9e] text-xs font-semibold rounded-full hover:bg-[#edeffe] transition-colors"
                      >
                        Details
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                  <div className="flex justify-between items-center bg-[#fafafa] rounded-lg px-4 py-2.5">
                    <span className="text-sm text-[#1e1b4b]">{chart.key}</span>
                    <span className="text-sm font-semibold text-[#1e1b4b]">
                      {chart.isYears ? `${chart.value} years` : formatCurrency(chart.value)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
