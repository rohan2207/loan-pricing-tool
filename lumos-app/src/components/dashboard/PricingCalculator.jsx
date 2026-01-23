import React, { useState } from 'react';
import { Check, Pencil, RefreshCw, ArrowRight } from 'lucide-react';

export function PricingCalculator({ accounts = [], borrowerData = {}, onSelectChart }) {
  // Configuration state
  const [productCategory, setProductCategory] = useState('Refinance');
  const [selectedProgram, setSelectedProgram] = useState('Conventional');
  const [selectedTerm, setSelectedTerm] = useState(30);
  const [ltv, setLtv] = useState(55);
  
  // Input state
  const [loanAmount, setLoanAmount] = useState(200000);
  const [debts, setDebts] = useState(150000);
  const [cashout, setCashout] = useState(50000);
  const [occupancy, setOccupancy] = useState('Primary');
  const [propertyType, setPropertyType] = useState('Single Family');
  const [units, setUnits] = useState(1);
  
  // Rate selection state (appears after calculate)
  const [calculated, setCalculated] = useState(false);
  const [selectedRateIndex, setSelectedRateIndex] = useState(2); // Par rate default

  // Options
  const programs = ['Conventional', 'FHA', 'VA'];
  const terms = [30, 20, 15];
  const occupancyOptions = ['Primary', 'Second Home', 'Investment'];
  const propertyTypes = ['Single Family', 'Condo', 'Townhouse', 'Multi-Family'];
  const unitOptions = [1, 2, 3, 4];
  const ltvMarks = [0, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100];

  // Rate options (5 total: 2 buy-down, 1 par, 2 credit)
  const rateOptions = [
    { payment: 3368, rate: 6.625, points: '-1 Pts', credit: '-$5,250' },
    { payment: 3456, rate: 6.875, points: '-0.5 Pts', credit: '-$2,625' },
    { payment: 3500, rate: 7.000, points: 'Par Rate', credit: '', isPar: true },
    { payment: 3544, rate: 7.125, points: '0.5 Pts Credit', credit: '+$2,625' },
    { payment: 3633, rate: 7.375, points: '1 Pts Credit', credit: '+$5,250' },
  ];

  const selectedRate = rateOptions[selectedRateIndex];

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
    { key: 'P&I', value: selectedRate?.payment || 3500 },
    { key: 'Taxes', value: 450 },
    { key: 'Insurance', value: 120 },
    { key: 'MI/MIP', value: 154 },
    { key: 'Debts Paid', value: 0 },
    { key: 'Total', value: (selectedRate?.payment || 3500) + 450 + 120 + 154 },
  ];

  const monthlySavings = currentFinances[5].value - goodleapOpportunity[5].value;
  
  // Cash calculations
  const feesPercent = 1.5;
  const escrows = 6 * (450 + 120); // 6 months of taxes + insurance
  const fees = (feesPercent / 100) * loanAmount;
  const cashFromBorrower = cashout - fees - escrows;

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
        <h1 className="text-2xl font-bold text-[#1e1b4b]">Scenarios</h1>
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

          {/* Occupancy, Property Type, Units - Combined Row */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            {/* Occupancy */}
            <div className="border border-[#e5e7eb] rounded-xl p-4">
              <label className="text-sm font-semibold text-[#1e1b4b] block mb-3">Occupancy</label>
              <div className="flex flex-col gap-2">
                {occupancyOptions.map((occ) => (
                  <PillButton
                    key={occ}
                    selected={occupancy === occ}
                    onClick={() => setOccupancy(occ)}
                  >
                    {occ}
                  </PillButton>
                ))}
              </div>
            </div>

            {/* Property Type */}
            <div className="border border-[#e5e7eb] rounded-xl p-4">
              <label className="text-sm font-semibold text-[#1e1b4b] block mb-3">Property Type</label>
              <div className="flex flex-col gap-2">
                {propertyTypes.map((type) => (
                  <PillButton
                    key={type}
                    selected={propertyType === type}
                    onClick={() => setPropertyType(type)}
                  >
                    {type}
                  </PillButton>
                ))}
              </div>
            </div>

            {/* Number of Units */}
            <div className="border border-[#e5e7eb] rounded-xl p-4">
              <label className="text-sm font-semibold text-[#1e1b4b] block mb-3">Number of Units</label>
              <div className="flex flex-col gap-2">
                {unitOptions.map((unit) => (
                  <PillButton
                    key={unit}
                    selected={units === unit}
                    onClick={() => setUnits(unit)}
                  >
                    {unit} {unit === 1 ? 'Unit' : 'Units'}
                  </PillButton>
                ))}
              </div>
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
          <div className="grid grid-cols-3 gap-3 mb-6">
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

          {/* Rate Selection - Shows after Calculate */}
          {calculated && (
            <div className="mt-6 pt-6 border-t border-[#e5e7eb]">
              <div className="flex items-center justify-between mb-4">
                <label className="text-sm font-semibold text-[#1e1b4b]">Select Your Rate</label>
                <span className="text-xs text-[#6b7280]">Step 2 of 3</span>
              </div>
              
              <div className="flex gap-2">
                {rateOptions.map((rate, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedRateIndex(index)}
                    className={`flex-1 p-3 rounded-xl border-2 transition-all text-center ${
                      selectedRateIndex === index
                        ? 'border-[#ff8300] bg-[#fff8f0]'
                        : 'border-[#e5e7eb] bg-white hover:border-[#432c9e]/30'
                    }`}
                  >
                    <div className={`text-lg font-bold ${selectedRateIndex === index ? 'text-[#ff8300]' : 'text-[#1e1b4b]'}`}>
                      {formatCurrency(rate.payment)}
                    </div>
                    <div className={`text-sm font-semibold ${selectedRateIndex === index ? 'text-[#ff8300]' : 'text-[#432c9e]'}`}>
                      {rate.rate.toFixed(3)}%
                    </div>
                    <div className="text-[10px] text-[#6b7280] mt-1">{rate.points}</div>
                    {rate.credit && (
                      <div className={`text-[10px] font-medium ${rate.credit.startsWith('+') ? 'text-green-600' : 'text-rose-500'}`}>
                        {rate.credit}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ==================== RIGHT SIDE: Value Propositions ==================== */}
        <div className="bg-white border border-[#e5e7eb] rounded-2xl p-6">
          <h2 className="text-xl font-bold text-[#1e1b4b] mb-6">Value Propositions</h2>

          {/* Compare Spread Section */}
          <div className="mb-4">
            <h3 className="text-xs font-bold text-[#6b7280] uppercase tracking-wider mb-4">Compare Spread</h3>
            
            <div className="grid grid-cols-2 gap-4">
              {/* Current Finances - Light warm tint */}
              <div className="border border-[#e5e7eb] rounded-xl overflow-hidden">
                <div className="px-4 py-3 bg-[#fef6f0] border-b border-[#f5e6d8]">
                  <h4 className="text-sm font-semibold text-[#92400e]">Current Finances</h4>
                </div>
                <div className="divide-y divide-[#e5e7eb]">
                  {currentFinances.map((item, index) => (
                    <div key={index} className={`flex justify-between px-4 py-2.5 ${index === currentFinances.length - 1 ? 'bg-[#fef6f0] font-semibold' : ''}`}>
                      <span className="text-sm text-[#1e1b4b]">{item.key}</span>
                      <span className="text-sm text-[#1e1b4b]">{formatCurrency(item.value)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Goodleap Opportunity - Light purple tint */}
              <div className="border border-[#e5e7eb] rounded-xl overflow-hidden">
                <div className="px-4 py-3 bg-[#f5f3ff] border-b border-[#e9e5ff]">
                  <h4 className="text-sm font-semibold text-[#432c9e]">Goodleap Opportunity</h4>
                </div>
                <div className="divide-y divide-[#e5e7eb]">
                  {goodleapOpportunity.map((item, index) => (
                    <div key={index} className={`flex justify-between px-4 py-2.5 ${index === goodleapOpportunity.length - 1 ? 'bg-[#f5f3ff] font-semibold' : ''}`}>
                      <span className="text-sm text-[#1e1b4b]">{item.key}</span>
                      <span className={`text-sm ${item.key === 'Debts Paid' ? 'text-green-600 font-medium' : 'text-[#1e1b4b]'}`}>
                        {item.key === 'Debts Paid' ? '$0 ✓' : formatCurrency(item.value)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Cash From/To Borrower Section */}
          <div className="mb-6">
            <div className="border border-[#e5e7eb] rounded-xl overflow-hidden">
              <div className="px-4 py-3 bg-[#f0fdf4] border-b border-[#dcfce7]">
                <h4 className="text-sm font-semibold text-[#166534]">Cash at Closing</h4>
              </div>
              <div className="p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[#6b7280]">Cashout Amount</span>
                  <span className="text-[#1e1b4b]">{formatCurrency(cashout)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#6b7280]">Less: Fees ({feesPercent}%)</span>
                  <span className="text-rose-600">-{formatCurrency(fees)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#6b7280]">Less: Escrows (6 mo T&I)</span>
                  <span className="text-rose-600">-{formatCurrency(escrows)}</span>
                </div>
                <div className="flex justify-between text-sm pt-2 border-t border-[#e5e7eb] font-semibold">
                  <span className="text-[#1e1b4b]">{cashFromBorrower >= 0 ? 'Cash to Borrower' : 'Cash from Borrower'}</span>
                  <span className={cashFromBorrower >= 0 ? 'text-green-600' : 'text-rose-600'}>
                    {formatCurrency(Math.abs(cashFromBorrower))}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Chart Highlights Section */}
          <div>
            <h3 className="text-xs font-bold text-[#6b7280] uppercase tracking-wider mb-4">Chart Highlights</h3>
            
            <div className="space-y-3">
              {/* Debt Consolidation */}
              <div className="border border-[#e5e7eb] rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-bold text-[#1e1b4b]">Debt Consolidation</h4>
                </div>
                <div className="flex justify-between items-center bg-[#fafafa] rounded-lg px-4 py-2.5">
                  <span className="text-sm text-[#6b7280]">Total Debts Paid Off</span>
                  <span className="text-sm font-semibold text-[#1e1b4b]">{formatCurrency(debts)}</span>
                </div>
              </div>

              {/* Payment Savings */}
              <div className="border border-[#e5e7eb] rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-bold text-[#1e1b4b]">Payment Savings</h4>
                  <button 
                    onClick={() => onSelectChart?.('payment-savings')}
                    className="flex items-center gap-1 px-3 py-1.5 border border-[#432c9e] text-[#432c9e] text-xs font-semibold rounded-full hover:bg-[#f5f3ff] transition-colors"
                  >
                    Details
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
                <div className="flex justify-between items-center bg-[#fafafa] rounded-lg px-4 py-2.5">
                  <span className="text-sm text-[#6b7280]">Monthly Savings</span>
                  <span className="text-sm font-semibold text-green-600">{formatCurrency(monthlySavings)}</span>
                </div>
              </div>

              {/* Cash Back */}
              <div className="border border-[#e5e7eb] rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-bold text-[#1e1b4b]">Cash Back</h4>
                  <button 
                    onClick={() => onSelectChart?.('cash-back')}
                    className="flex items-center gap-1 px-3 py-1.5 border border-[#432c9e] text-[#432c9e] text-xs font-semibold rounded-full hover:bg-[#f5f3ff] transition-colors"
                  >
                    Details
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
                <div className="flex justify-between items-center bg-[#fafafa] rounded-lg px-4 py-2.5">
                  <span className="text-sm text-[#6b7280]">Cash at Closing</span>
                  <span className="text-sm font-semibold text-[#1e1b4b]">{formatCurrency(Math.abs(cashFromBorrower))}</span>
                </div>
              </div>

              {/* Accelerated Payoff */}
              <div className="border border-[#e5e7eb] rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-bold text-[#1e1b4b]">Accelerated Payoff</h4>
                  <button 
                    onClick={() => onSelectChart?.('accelerated-payoff')}
                    className="flex items-center gap-1 px-3 py-1.5 border border-[#432c9e] text-[#432c9e] text-xs font-semibold rounded-full hover:bg-[#f5f3ff] transition-colors"
                  >
                    Details
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
                <div className="flex justify-between items-center bg-[#fafafa] rounded-lg px-4 py-2.5">
                  <span className="text-sm text-[#6b7280]">Years Saved</span>
                  <span className="text-sm font-semibold text-[#432c9e]">7 years</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
