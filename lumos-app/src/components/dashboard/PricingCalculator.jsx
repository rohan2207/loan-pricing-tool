import React, { useState } from 'react';
import { Check, Pencil, RefreshCw, ArrowRight, ToggleLeft, ToggleRight } from 'lucide-react';

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
  
  // Escrows toggle
  const [escrowsEnabled, setEscrowsEnabled] = useState(true);
  
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

  // Monthly amounts
  const monthlyTaxes = 450;
  const monthlyInsurance = 120;
  const monthlyDebtsPaid = 4156; // Debts being paid off
  const monthlyDebtsNotPaid = 523; // Debts NOT being paid off

  // Rate options with discount points values
  const rateOptions = [
    { payment: 3368, rate: 6.625, points: -1, pointsLabel: '1 Pts', discountAmount: 5250 },
    { payment: 3456, rate: 6.875, points: -0.5, pointsLabel: '0.5 Pts', discountAmount: 2625 },
    { payment: 3500, rate: 7.000, points: 0, pointsLabel: 'Par Rate', discountAmount: 0, isPar: true },
    { payment: 3544, rate: 7.125, points: 0.5, pointsLabel: '0.5 Pts Credit', discountAmount: -2625 },
    { payment: 3633, rate: 7.375, points: 1, pointsLabel: '1 Pts Credit', discountAmount: -5250 },
  ];

  const selectedRate = rateOptions[selectedRateIndex];
  const discountPoints = selectedRate?.discountAmount || 0;

  // Current Finances calculations
  const currentPI = 1710;
  const currentMI = 0;
  const currentMortgageTotal = currentPI + (escrowsEnabled ? monthlyTaxes + monthlyInsurance : 0) + currentMI;
  const currentTotal = currentMortgageTotal + monthlyDebtsPaid + monthlyDebtsNotPaid;

  // Goodleap Opportunity calculations
  const proposedPI = selectedRate?.payment || 3500;
  const proposedMI = 154;
  const proposedMortgageTotal = proposedPI + (escrowsEnabled ? monthlyTaxes + monthlyInsurance : 0) + proposedMI;
  const proposedTotal = proposedMortgageTotal + 0 + monthlyDebtsNotPaid; // Debts paid = 0

  const monthlySavings = currentTotal - proposedTotal;
  
  // Cash calculations
  const feesPercent = 1.5;
  const fees = (feesPercent / 100) * loanAmount;
  const escrowAmount = escrowsEnabled ? 6 * (monthlyTaxes + monthlyInsurance) : 0;
  const cashFromToBorrower = cashout - discountPoints - fees - escrowAmount;

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
    <div className="p-6 bg-[#fafafa] min-h-screen">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1e1b4b]">Scenarios</h1>
        <p className="text-sm text-[#6b7280]">Interact below to build a quote</p>
      </div>

      {/* Main Content - Two Column Layout */}
      <div className="grid grid-cols-2 gap-6">
        
        {/* ==================== LEFT SIDE: Configurations ==================== */}
        <div className="bg-white border-2 border-[#e5e7eb] rounded-2xl p-6 shadow-sm">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-[#e5e7eb]">
            <h2 className="text-xl font-bold text-[#1e1b4b]">Configurations</h2>
            <div>
              <label className="text-xs text-[#6b7280] block mb-1">Product category</label>
              <select 
                value={productCategory}
                onChange={(e) => setProductCategory(e.target.value)}
                className="px-4 py-2 border-2 border-[#e5e7eb] rounded-lg text-sm text-[#1e1b4b] bg-white min-w-[140px]"
              >
                <option>Refinance</option>
                <option>Purchase</option>
              </select>
            </div>
          </div>

          {/* Program Section */}
          <div className="border-2 border-[#e5e7eb] rounded-xl p-4 mb-4">
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
          <div className="border-2 border-[#e5e7eb] rounded-xl p-4 mb-4">
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
            <div className="border-2 border-[#e5e7eb] rounded-xl p-4">
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
            <div className="border-2 border-[#e5e7eb] rounded-xl p-4">
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
            <div className="border-2 border-[#e5e7eb] rounded-xl p-4">
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
          <div className="border-2 border-[#e5e7eb] rounded-xl p-4 mb-4">
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
                className="w-full px-3 py-2.5 border-2 border-[#e5e7eb] rounded-lg text-sm text-[#1e1b4b]"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#1e1b4b] block mb-1.5">Debts to Pay Off</label>
              <input
                type="text"
                value={debts.toLocaleString()}
                onChange={(e) => setDebts(parseInt(e.target.value.replace(/,/g, '')) || 0)}
                className="w-full px-3 py-2.5 border-2 border-[#e5e7eb] rounded-lg text-sm text-[#1e1b4b]"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#1e1b4b] block mb-1.5">Cashout</label>
              <input
                type="text"
                value={cashout.toLocaleString()}
                onChange={(e) => setCashout(parseInt(e.target.value.replace(/,/g, '')) || 0)}
                className="w-full px-3 py-2.5 border-2 border-[#e5e7eb] rounded-lg text-sm text-[#1e1b4b]"
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
            <div className="mt-6 pt-6 border-t-2 border-[#e5e7eb]">
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
                    <div className="text-[10px] text-[#6b7280] mt-1">{rate.pointsLabel}</div>
                    {rate.discountAmount !== 0 && (
                      <div className={`text-[10px] font-medium ${rate.discountAmount > 0 ? 'text-rose-500' : 'text-green-600'}`}>
                        {rate.discountAmount > 0 ? `-${formatCurrency(rate.discountAmount)}` : `+${formatCurrency(Math.abs(rate.discountAmount))}`}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ==================== RIGHT SIDE: Value Propositions ==================== */}
        <div className="bg-white border-2 border-[#e5e7eb] rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-[#e5e7eb]">
            <h2 className="text-xl font-bold text-[#1e1b4b]">Value Propositions</h2>
            {/* Escrows Toggle */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-medium text-[#6b7280]">Include Escrows</span>
              <button
                onClick={() => setEscrowsEnabled(!escrowsEnabled)}
                className={`relative w-12 h-6 rounded-full transition-colors ${escrowsEnabled ? 'bg-[#432c9e]' : 'bg-[#d1d5db]'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${escrowsEnabled ? 'translate-x-7' : 'translate-x-1'}`}></div>
              </button>
            </div>
          </div>

          {/* Compare Spread Section */}
          <div className="mb-6">
            <h3 className="text-xs font-bold text-[#6b7280] uppercase tracking-wider mb-4">Monthly Payment Comparison</h3>
            
            <div className="grid grid-cols-2 gap-4">
              {/* Current Finances */}
              <div className="border-2 border-[#e5e7eb] rounded-xl overflow-hidden">
                <div className="px-4 py-3 bg-[#fef6f0] border-b-2 border-[#f5e6d8]">
                  <h4 className="text-sm font-bold text-[#92400e]">Current Finances</h4>
                  <p className="text-[10px] text-[#b45309]">What you're paying now</p>
                </div>
                <div className="divide-y divide-[#e5e7eb]">
                  <div className="flex justify-between px-4 py-2.5">
                    <span className="text-sm text-[#6b7280]">Principal & Interest</span>
                    <span className="text-sm font-medium text-[#1e1b4b]">{formatCurrency(currentPI)}</span>
                  </div>
                  {escrowsEnabled && (
                    <>
                      <div className="flex justify-between px-4 py-2.5">
                        <span className="text-sm text-[#6b7280]">Taxes</span>
                        <span className="text-sm font-medium text-[#1e1b4b]">{formatCurrency(monthlyTaxes)}</span>
                      </div>
                      <div className="flex justify-between px-4 py-2.5">
                        <span className="text-sm text-[#6b7280]">Insurance</span>
                        <span className="text-sm font-medium text-[#1e1b4b]">{formatCurrency(monthlyInsurance)}</span>
                      </div>
                    </>
                  )}
                  <div className="flex justify-between px-4 py-2.5">
                    <span className="text-sm text-[#6b7280]">Mortgage Insurance</span>
                    <span className="text-sm font-medium text-[#1e1b4b]">{formatCurrency(currentMI)}</span>
                  </div>
                  <div className="flex justify-between px-4 py-2.5 bg-[#fef6f0]">
                    <span className="text-sm font-semibold text-[#92400e]">Mortgage Total</span>
                    <span className="text-sm font-bold text-[#92400e]">{formatCurrency(currentMortgageTotal)}</span>
                  </div>
                  <div className="flex justify-between px-4 py-2.5">
                    <span className="text-sm text-[#6b7280]">Monthly Debts (Paid Off)</span>
                    <span className="text-sm font-medium text-rose-600">{formatCurrency(monthlyDebtsPaid)}</span>
                  </div>
                  <div className="flex justify-between px-4 py-2.5">
                    <span className="text-sm text-[#6b7280]">Monthly Debts (NOT Paid)</span>
                    <span className="text-sm font-medium text-[#1e1b4b]">{formatCurrency(monthlyDebtsNotPaid)}</span>
                  </div>
                  <div className="flex justify-between px-4 py-3 bg-[#fef6f0] border-t-2 border-[#f5e6d8]">
                    <span className="text-sm font-bold text-[#92400e]">Total Monthly</span>
                    <span className="text-lg font-bold text-[#92400e]">{formatCurrency(currentTotal)}</span>
                  </div>
                </div>
              </div>

              {/* Goodleap Opportunity */}
              <div className="border-2 border-[#e5e7eb] rounded-xl overflow-hidden">
                <div className="px-4 py-3 bg-[#f5f3ff] border-b-2 border-[#e9e5ff]">
                  <h4 className="text-sm font-bold text-[#432c9e]">GoodLeap Opportunity</h4>
                  <p className="text-[10px] text-[#6b5ce7]">Your new payment</p>
                </div>
                <div className="divide-y divide-[#e5e7eb]">
                  <div className="flex justify-between px-4 py-2.5">
                    <span className="text-sm text-[#6b7280]">Principal & Interest</span>
                    <span className="text-sm font-medium text-[#1e1b4b]">{formatCurrency(proposedPI)}</span>
                  </div>
                  {escrowsEnabled && (
                    <>
                      <div className="flex justify-between px-4 py-2.5">
                        <span className="text-sm text-[#6b7280]">Taxes</span>
                        <span className="text-sm font-medium text-[#1e1b4b]">{formatCurrency(monthlyTaxes)}</span>
                      </div>
                      <div className="flex justify-between px-4 py-2.5">
                        <span className="text-sm text-[#6b7280]">Insurance</span>
                        <span className="text-sm font-medium text-[#1e1b4b]">{formatCurrency(monthlyInsurance)}</span>
                      </div>
                    </>
                  )}
                  <div className="flex justify-between px-4 py-2.5">
                    <span className="text-sm text-[#6b7280]">Mortgage Insurance</span>
                    <span className="text-sm font-medium text-[#1e1b4b]">{formatCurrency(proposedMI)}</span>
                  </div>
                  <div className="flex justify-between px-4 py-2.5 bg-[#f5f3ff]">
                    <span className="text-sm font-semibold text-[#432c9e]">Mortgage Total</span>
                    <span className="text-sm font-bold text-[#432c9e]">{formatCurrency(proposedMortgageTotal)}</span>
                  </div>
                  <div className="flex justify-between px-4 py-2.5">
                    <span className="text-sm text-[#6b7280]">Monthly Debts (Paid Off)</span>
                    <span className="text-sm font-bold text-green-600">$0 ✓</span>
                  </div>
                  <div className="flex justify-between px-4 py-2.5">
                    <span className="text-sm text-[#6b7280]">Monthly Debts (NOT Paid)</span>
                    <span className="text-sm font-medium text-[#1e1b4b]">{formatCurrency(monthlyDebtsNotPaid)}</span>
                  </div>
                  <div className="flex justify-between px-4 py-3 bg-[#f5f3ff] border-t-2 border-[#e9e5ff]">
                    <span className="text-sm font-bold text-[#432c9e]">Total Monthly</span>
                    <span className="text-lg font-bold text-[#432c9e]">{formatCurrency(proposedTotal)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Savings Banner */}
            <div className={`mt-4 p-4 rounded-xl border-2 ${monthlySavings > 0 ? 'bg-green-50 border-green-200' : 'bg-rose-50 border-rose-200'}`}>
              <div className="flex justify-between items-center">
                <span className={`text-sm font-bold ${monthlySavings > 0 ? 'text-green-800' : 'text-rose-800'}`}>
                  {monthlySavings > 0 ? '💰 Monthly Savings' : '⚠️ Monthly Increase'}
                </span>
                <span className={`text-2xl font-bold ${monthlySavings > 0 ? 'text-green-600' : 'text-rose-600'}`}>
                  {formatCurrency(Math.abs(monthlySavings))}
                </span>
              </div>
            </div>
          </div>

          {/* Cash From/To Borrower Section */}
          <div className="mb-6">
            <h3 className="text-xs font-bold text-[#6b7280] uppercase tracking-wider mb-4">Cash at Closing</h3>
            
            <div className="border-2 border-[#e5e7eb] rounded-xl overflow-hidden">
              <div className="px-4 py-3 bg-[#f0fdf4] border-b-2 border-[#dcfce7]">
                <h4 className="text-sm font-bold text-[#166534]">Cash From/To Borrower</h4>
              </div>
              <div className="divide-y divide-[#e5e7eb]">
                <div className="flex justify-between px-4 py-3">
                  <span className="text-sm text-[#6b7280]">Cashout Amount</span>
                  <span className="text-sm font-medium text-[#1e1b4b]">{formatCurrency(cashout)}</span>
                </div>
                {discountPoints > 0 && (
                  <div className="flex justify-between px-4 py-3">
                    <span className="text-sm text-[#6b7280]">Less: Discount Points ({selectedRate?.pointsLabel})</span>
                    <span className="text-sm font-medium text-rose-600">-{formatCurrency(discountPoints)}</span>
                  </div>
                )}
                {discountPoints < 0 && (
                  <div className="flex justify-between px-4 py-3">
                    <span className="text-sm text-[#6b7280]">Plus: Lender Credit ({selectedRate?.pointsLabel})</span>
                    <span className="text-sm font-medium text-green-600">+{formatCurrency(Math.abs(discountPoints))}</span>
                  </div>
                )}
                <div className="flex justify-between px-4 py-3">
                  <span className="text-sm text-[#6b7280]">Less: Fees ({feesPercent}%)</span>
                  <span className="text-sm font-medium text-rose-600">-{formatCurrency(fees)}</span>
                </div>
                {escrowsEnabled && (
                  <div className="flex justify-between px-4 py-3">
                    <span className="text-sm text-[#6b7280]">Less: Escrows (6 mo Taxes & Insurance)</span>
                    <span className="text-sm font-medium text-rose-600">-{formatCurrency(escrowAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between px-4 py-4 bg-[#f0fdf4] border-t-2 border-[#dcfce7]">
                  <span className="text-sm font-bold text-[#166534]">
                    {cashFromToBorrower >= 0 ? 'Cash TO Borrower' : 'Cash FROM Borrower'}
                  </span>
                  <span className={`text-xl font-bold ${cashFromToBorrower >= 0 ? 'text-green-600' : 'text-rose-600'}`}>
                    {formatCurrency(Math.abs(cashFromToBorrower))}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Chart Highlights Section */}
          <div>
            <h3 className="text-xs font-bold text-[#6b7280] uppercase tracking-wider mb-4">Chart Highlights</h3>
            
            <div className="grid grid-cols-2 gap-3">
              {/* Debt Consolidation */}
              <div className="border-2 border-[#e5e7eb] rounded-xl p-4 hover:border-[#432c9e]/50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-bold text-[#1e1b4b]">Debt Consolidation</h4>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-[#6b7280]">Total Paid Off</span>
                  <span className="text-sm font-bold text-[#432c9e]">{formatCurrency(debts)}</span>
                </div>
              </div>

              {/* Payment Savings */}
              <div 
                onClick={() => onSelectChart?.('payment-savings')}
                className="border-2 border-[#e5e7eb] rounded-xl p-4 hover:border-[#432c9e]/50 transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-bold text-[#1e1b4b]">Payment Savings</h4>
                  <ArrowRight className="w-4 h-4 text-[#432c9e]" />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-[#6b7280]">Monthly</span>
                  <span className="text-sm font-bold text-green-600">{formatCurrency(monthlySavings)}</span>
                </div>
              </div>

              {/* Cash Back */}
              <div 
                onClick={() => onSelectChart?.('cash-back')}
                className="border-2 border-[#e5e7eb] rounded-xl p-4 hover:border-[#432c9e]/50 transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-bold text-[#1e1b4b]">Cash Back</h4>
                  <ArrowRight className="w-4 h-4 text-[#432c9e]" />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-[#6b7280]">At Closing</span>
                  <span className="text-sm font-bold text-[#432c9e]">{formatCurrency(Math.abs(cashFromToBorrower))}</span>
                </div>
              </div>

              {/* Accelerated Payoff */}
              <div 
                onClick={() => onSelectChart?.('accelerated-payoff')}
                className="border-2 border-[#e5e7eb] rounded-xl p-4 hover:border-[#432c9e]/50 transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-bold text-[#1e1b4b]">Accelerated Payoff</h4>
                  <ArrowRight className="w-4 h-4 text-[#432c9e]" />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-[#6b7280]">Years Saved</span>
                  <span className="text-sm font-bold text-[#432c9e]">7 years</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
