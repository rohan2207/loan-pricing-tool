import React, { useState, useEffect } from 'react';
import { CircleAlert, Pencil, Check, ChevronDown, ChevronRight, X, Settings2, SlidersHorizontal, ExternalLink, Maximize2, ChevronLeft, ArrowRight, CreditCard, TrendingUp, DollarSign, Clock, BarChart3, ToggleLeft, ToggleRight } from 'lucide-react';

// Slide-out Panel Component for Loan Details
function LoanDetailsPanel({ isOpen, onClose }) {
  const [loanPosition, setLoanPosition] = useState('First Lien');
  const [loanType, setLoanType] = useState('VA');
  const [baseLoanAmount, setBaseLoanAmount] = useState('152,000');
  const [totalLoanAmount, setTotalLoanAmount] = useState('155,268');
  const [loanPurpose, setLoanPurpose] = useState('Refi Cashout');
  const [appraisedValue, setAppraisedValue] = useState('460,000');
  const [constructionLoanType, setConstructionLoanType] = useState('Not Applicable');
  const [lotValue, setLotValue] = useState('');
  const [costOfImprovements, setCostOfImprovements] = useState('');
  const [subordinateFinancing, setSubordinateFinancing] = useState(false);
  
  // Borrower Information
  const [fico, setFico] = useState('692');
  const [dti, setDti] = useState('23.10');
  const [propertiesFinanced, setPropertiesFinanced] = useState('1');
  const [cashOutAmount, setCashOutAmount] = useState('899.92');
  const [reserveMonths, setReserveMonths] = useState('0');
  const [citizenship, setCitizenship] = useState('U.S. Citizen');
  const [monthlyQualifyingIncome, setMonthlyQualifyingIncome] = useState('11,333');
  
  // Property Information
  const [occupancy, setOccupancy] = useState('Primary Residence');
  const [propertyType, setPropertyType] = useState('Single Family');
  const [numberOfUnits, setNumberOfUnits] = useState('1 Unit');
  const [numberOfStories, setNumberOfStories] = useState('1');
  const [propertyAddress, setPropertyAddress] = useState('6775 GREENBROOK DR');
  const [propertyCity, setPropertyCity] = useState('CLEMMONS');
  const [propertyZip, setPropertyZip] = useState('27012');
  const [propertyState, setPropertyState] = useState('North Carolina (NC)');
  const [propertyCounty, setPropertyCounty] = useState('Forsyth');

  // Funding Fee Modal
  const [showFundingFeeModal, setShowFundingFeeModal] = useState(false);
  const [subsequentUse, setSubsequentUse] = useState(false);
  const [exemptFromFundingFee, setExemptFromFundingFee] = useState(false);
  const [fundingFeePercent, setFundingFeePercent] = useState('2.150');
  const [fundingFeeAmount, setFundingFeeAmount] = useState('3,268.00');
  const [financeEntireFundingFee, setFinanceEntireFundingFee] = useState(true);
  const [feePaidInCash, setFeePaidInCash] = useState('0.00');
  const [feeFinanced, setFeeFinanced] = useState('3,268.00');

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/30 z-40 transition-opacity"
        onClick={onClose}
      />
      
      {/* Panel */}
      <div className="fixed right-0 top-0 h-full w-[600px] bg-white shadow-2xl z-50 overflow-y-auto transform transition-transform">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-neutral-l3 px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-lg font-bold text-[#0f172b]">Loan Information</h2>
            <p className="text-sm text-neutral-l1">Complete loan details and configurations</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-neutral-l4 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-neutral-d1" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Loan Information Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-[#c9a227] uppercase tracking-wide border-b-2 border-[#c9a227] pb-2">
              Loan Information
            </h3>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-[#c9a227]">Lien Position</label>
                <select 
                  value={loanPosition}
                  onChange={(e) => setLoanPosition(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-l3 rounded text-sm bg-white"
                >
                  <option>First Lien</option>
                  <option>Second Lien</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-[#c9a227]">Loan Type</label>
                <select 
                  value={loanType}
                  onChange={(e) => setLoanType(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-l3 rounded text-sm bg-white"
                >
                  <option>Conventional</option>
                  <option>FHA</option>
                  <option>VA</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-[#c9a227]">Base Loan Amount</label>
                <input
                  type="text"
                  value={baseLoanAmount}
                  onChange={(e) => setBaseLoanAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-l3 rounded text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-[#c9a227]">Total Loan Amount</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={totalLoanAmount}
                    onChange={(e) => setTotalLoanAmount(e.target.value)}
                    className="flex-1 px-3 py-2 border border-neutral-l3 rounded text-sm bg-neutral-l5"
                    readOnly
                  />
                  <button 
                    onClick={() => setShowFundingFeeModal(true)}
                    className="p-2 bg-[#fff4b3] hover:bg-[#ffe680] rounded transition-colors"
                    title="Edit Total Loan Amount"
                  >
                    <Pencil className="w-4 h-4 text-[#c9a227]" />
                  </button>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-[#c9a227]">Loan Purpose</label>
                <select 
                  value={loanPurpose}
                  onChange={(e) => setLoanPurpose(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-l3 rounded text-sm bg-white"
                >
                  <option>Purchase</option>
                  <option>Refi Cashout</option>
                  <option>Refi Rate-Term/Limited Cashout</option>
                  {loanType === 'VA' && <option>VA Rate Reduction</option>}
                  {loanType === 'FHA' && <option>FHA Streamline Refi</option>}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-neutral-d1">Estimated Property Value</label>
                <input
                  type="text"
                  value="$0"
                  disabled
                  className="w-full px-3 py-2 border border-neutral-l3 rounded text-sm bg-neutral-l5"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-[#c9a227]">Appraised Value</label>
                <input
                  type="text"
                  value={appraisedValue}
                  onChange={(e) => setAppraisedValue(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-l3 rounded text-sm"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-neutral-d1">Construction Loan Type</label>
                <select 
                  value={constructionLoanType}
                  onChange={(e) => setConstructionLoanType(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-l3 rounded text-sm bg-white"
                >
                  <option>Not Applicable</option>
                  <option>Construction Only</option>
                  <option>Construction to Permanent</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-neutral-d1">Lot Value</label>
                <input
                  type="text"
                  value={lotValue}
                  onChange={(e) => setLotValue(e.target.value)}
                  placeholder="$"
                  className="w-full px-3 py-2 border border-neutral-l3 rounded text-sm"
                />
              </div>
            </div>

            {/* LTV Display */}
            <div className="grid grid-cols-3 gap-4 pt-2">
              <div className="text-center">
                <div className="text-xs text-neutral-l1">LTV</div>
                <div className="text-lg font-bold text-[#0f172b]">33.75%</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-neutral-l1">CLTV</div>
                <div className="text-lg font-bold text-[#0f172b]">33.75%</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-neutral-l1">HCLTV</div>
                <div className="text-lg font-bold text-[#0f172b]">33.75%</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-neutral-l3 px-6 py-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-neutral-d1 bg-white border border-neutral-l3 rounded hover:bg-neutral-l4 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-white bg-[#432c9e] rounded hover:bg-[#362480] transition-colors"
          >
            Apply Changes
          </button>
        </div>
      </div>
    </>
  );
}

export function PricingCalculator({ accounts = [], borrowerData = {}, onSelectChart }) {
  // State for form values
  const [selectedProgram, setSelectedProgram] = useState('Conventional');
  const [selectedTerm, setSelectedTerm] = useState(30);
  const [loanAmount, setLoanAmount] = useState(350000);
  const [propertyValue, setPropertyValue] = useState(460000);
  const [cashoutAmount, setCashoutAmount] = useState(15000);
  const [fico, setFico] = useState(720);
  const [dti, setDti] = useState(32);
  const [occupancy, setOccupancy] = useState('Primary');
  const [propertyType, setPropertyType] = useState('Single Family');
  
  // Rate search state
  const [ratesLoaded, setRatesLoaded] = useState(false);
  const [selectedRateIndex, setSelectedRateIndex] = useState(2); // Par rate default (middle)
  
  // Cash Out section state
  const [feePercent, setFeePercent] = useState(1);
  const [escrowsEnabled, setEscrowsEnabled] = useState(true);
  
  // Slide-out panel state
  const [showLoanDetails, setShowLoanDetails] = useState(false);

  // Monthly taxes and insurance (for escrow calculation)
  const monthlyTaxes = 450;
  const monthlyInsurance = 120;
  
  // Calculate LTV
  const ltv = Math.round((loanAmount / propertyValue) * 100);

  // Programs and terms
  const programs = ['Conventional', 'FHA', 'VA', 'USDA'];
  const terms = [30, 20, 15, 10];
  
  // Rate options (5 total: 2 buy-down, 1 par, 2 credit)
  const rateOptions = [
    { payment: 3368, rate: 6.625, points: -1, label: '1 Pts', sublabel: '-$5,250', type: 'buydown' },
    { payment: 3456, rate: 6.875, points: -0.5, label: '0.5 Pts', sublabel: '-$2,625', type: 'buydown' },
    { payment: 3500, rate: 7.000, points: 0, label: 'Par Rate', sublabel: '', type: 'par' },
    { payment: 3544, rate: 7.125, points: 0.5, label: '0.5 Pts Credit', sublabel: '+$2,625', type: 'credit' },
    { payment: 3633, rate: 7.375, points: 1, label: '1 Pts Credit', sublabel: '+$5,250', type: 'credit' },
  ];

  // Present scenario (current situation)
  const presentScenario = {
    pi: 1710,
    taxes: monthlyTaxes,
    insurance: monthlyInsurance,
    mi: 0,
    debtsPaid: accounts.filter(a => a.willPay).reduce((sum, a) => sum + (parseFloat(String(a.payment).replace(/[$,]/g, '')) || 0), 0) || 4156,
    debtsNotPaid: accounts.filter(a => !a.willPay).reduce((sum, a) => sum + (parseFloat(String(a.payment).replace(/[$,]/g, '')) || 0), 0) || 523,
  };
  presentScenario.mortgageTotal = presentScenario.pi + presentScenario.taxes + presentScenario.insurance + presentScenario.mi;
  presentScenario.total = presentScenario.mortgageTotal + presentScenario.debtsPaid + presentScenario.debtsNotPaid;

  // Proposed scenario (based on selected rate)
  const selectedRate = rateOptions[selectedRateIndex];
  const proposedScenario = {
    pi: selectedRate?.payment || 3500,
    taxes: monthlyTaxes,
    insurance: monthlyInsurance,
    mi: ltv > 80 ? 154 : 0,
    debtsPaid: 0, // Paid off with refi
    debtsNotPaid: presentScenario.debtsNotPaid, // Same - not being paid
  };
  proposedScenario.mortgageTotal = proposedScenario.pi + proposedScenario.taxes + proposedScenario.insurance + proposedScenario.mi;
  proposedScenario.total = proposedScenario.mortgageTotal + proposedScenario.debtsPaid + proposedScenario.debtsNotPaid;

  // Monthly savings calculation
  const monthlySavings = presentScenario.total - proposedScenario.total;

  // Cash Out Calculations
  const pointsValue = (selectedRate?.points || 0) * loanAmount * 0.01;
  const feesAmount = (feePercent / 100) * loanAmount;
  const escrowAmount = escrowsEnabled ? 6 * (monthlyTaxes + monthlyInsurance) : 0;
  const startingCash = cashoutAmount + pointsValue;
  const cashToFromBorrower = startingCash - feesAmount - escrowAmount;

  // Debts data
  const debtsPaidList = accounts.filter(a => a.willPay);
  const debtsNotPaidList = accounts.filter(a => !a.willPay);
  
  // Default debts if none provided
  const defaultDebtsPaid = [
    { creditor: 'Chase Visa', payment: 450, balance: 12500 },
    { creditor: 'Bank of America', payment: 380, balance: 8900 },
    { creditor: 'Car Loan', payment: 520, balance: 18000 },
  ];
  const defaultDebtsNotPaid = [
    { creditor: 'Student Loan', payment: 350, balance: 45000 },
    { creditor: 'Personal Loan', payment: 173, balance: 5200 },
  ];

  const displayDebtsPaid = debtsPaidList.length > 0 ? debtsPaidList : defaultDebtsPaid;
  const displayDebtsNotPaid = debtsNotPaidList.length > 0 ? debtsNotPaidList : defaultDebtsNotPaid;

  const totalDebtsPaidPayment = displayDebtsPaid.reduce((s, d) => s + (parseFloat(String(d.payment).replace(/[$,]/g, '')) || 0), 0);
  const totalDebtsNotPaidPayment = displayDebtsNotPaid.reduce((s, d) => s + (parseFloat(String(d.payment).replace(/[$,]/g, '')) || 0), 0);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const handleSearchRates = () => {
    setRatesLoaded(true);
    setSelectedRateIndex(2); // Default to Par
  };

  return (
    <div className="px-6 py-4">
      <div className="flex flex-col gap-4 p-4 bg-white rounded-2xl">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-[#0f172b]">Loan Pricing Calculator</h2>
            <p className="text-xs text-neutral-l1">Configure loan parameters and compare scenarios</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowLoanDetails(true)}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-[#432c9e] bg-[#edeffe] border-2 border-[#432c9e] hover:bg-[#dbdbfc] rounded-full transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Loan Details</span>
            </button>
          </div>
        </div>

        {/* ==================== TOP SECTION: Configuration ==================== */}
        <div className="bg-gradient-to-br from-[#faf9f6] to-[#f5f3ef] border border-[#e8e4dc] rounded-xl p-4 space-y-4">
          
          {/* Program Selection - Pill Buttons */}
          <div className="flex items-center gap-4">
            <span className="text-xs font-bold text-[#432c9e] uppercase tracking-wider">Program</span>
            <div className="flex gap-2">
              {programs.map((program) => (
                <button
                  key={program}
                  onClick={() => setSelectedProgram(program)}
                  className={`flex items-center gap-1 px-3 py-2 rounded-full text-sm font-bold transition-colors ${
                    selectedProgram === program
                      ? 'bg-[#edeffe] border-2 border-[#432c9e] text-[#432c9e]'
                      : 'bg-white border-2 border-transparent text-neutral-d1 hover:border-neutral-l3'
                  }`}
                >
                  {selectedProgram === program && <Check className="w-4 h-4" />}
                  <span>{program}</span>
                </button>
              ))}
            </div>
            
            <div className="w-px h-8 bg-neutral-l3 mx-2"></div>
            
            <span className="text-xs font-bold text-[#432c9e] uppercase tracking-wider">Term</span>
            <div className="flex gap-2">
              {terms.map((term) => (
                <button
                  key={term}
                  onClick={() => setSelectedTerm(term)}
                  className={`flex items-center gap-1 px-3 py-2 rounded-full text-sm font-bold transition-colors ${
                    selectedTerm === term
                      ? 'bg-[#edeffe] border-2 border-[#432c9e] text-[#432c9e]'
                      : 'bg-white border-2 border-transparent text-neutral-d1 hover:border-neutral-l3'
                  }`}
                >
                  {selectedTerm === term && <Check className="w-4 h-4" />}
                  <span>{term}yr</span>
                </button>
              ))}
            </div>
          </div>

          {/* Input Fields Row */}
          <div className="grid grid-cols-8 gap-3">
            <div>
              <label className="text-[10px] font-semibold text-neutral-d1 uppercase">Loan Amount</label>
              <input 
                type="text" 
                value={loanAmount.toLocaleString()} 
                onChange={(e) => setLoanAmount(parseInt(e.target.value.replace(/,/g, '')) || 0)}
                className="w-full px-2 py-1.5 border border-neutral-l3 rounded text-sm mt-0.5 bg-white font-medium" 
              />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-neutral-d1 uppercase">Property Value</label>
              <input 
                type="text" 
                value={propertyValue.toLocaleString()} 
                onChange={(e) => setPropertyValue(parseInt(e.target.value.replace(/,/g, '')) || 0)}
                className="w-full px-2 py-1.5 border border-neutral-l3 rounded text-sm mt-0.5 bg-white font-medium" 
              />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-neutral-d1 uppercase">LTV</label>
              <div className="w-full px-2 py-1.5 border border-neutral-l3 rounded text-sm mt-0.5 bg-neutral-l5 font-bold text-[#432c9e]">
                {ltv}%
              </div>
            </div>
            <div>
              <label className="text-[10px] font-semibold text-neutral-d1 uppercase">Cash Out</label>
              <input 
                type="text" 
                value={cashoutAmount.toLocaleString()} 
                onChange={(e) => setCashoutAmount(parseInt(e.target.value.replace(/,/g, '')) || 0)}
                className="w-full px-2 py-1.5 border border-neutral-l3 rounded text-sm mt-0.5 bg-white font-medium" 
              />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-neutral-d1 uppercase">FICO</label>
              <input 
                type="text" 
                value={fico} 
                onChange={(e) => setFico(parseInt(e.target.value) || 0)}
                className="w-full px-2 py-1.5 border border-neutral-l3 rounded text-sm mt-0.5 bg-white font-medium" 
              />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-neutral-d1 uppercase">DTI %</label>
              <input 
                type="text" 
                value={dti} 
                onChange={(e) => setDti(parseInt(e.target.value) || 0)}
                className="w-full px-2 py-1.5 border border-neutral-l3 rounded text-sm mt-0.5 bg-white font-medium" 
              />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-neutral-d1 uppercase">Occupancy</label>
              <select 
                value={occupancy}
                onChange={(e) => setOccupancy(e.target.value)}
                className="w-full px-2 py-1.5 border border-neutral-l3 rounded text-sm bg-white mt-0.5"
              >
                <option>Primary</option>
                <option>Second Home</option>
                <option>Investment</option>
              </select>
            </div>
            <div className="flex items-end">
              <button 
                onClick={handleSearchRates}
                className="w-full px-4 py-2 bg-[#ff8300] hover:bg-[#e67600] text-white font-bold rounded-lg transition-colors shadow-md text-sm"
              >
                Search Rates
              </button>
            </div>
          </div>

          {/* Rate Selection Cards - Only show after search */}
          {ratesLoaded && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#ff8300] rounded-full animate-pulse"></div>
                  <span className="text-sm font-bold text-[#432c9e]">Select Your Rate</span>
                </div>
                <span className="text-xs text-neutral-l1">Step 2 of 3</span>
              </div>
              
              <div className="grid grid-cols-5 gap-3">
                {rateOptions.map((rate, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedRateIndex(index)}
                    className={`relative p-4 rounded-xl border-2 transition-all ${
                      selectedRateIndex === index
                        ? 'border-[#ff8300] bg-[#fff8f0] shadow-lg scale-105'
                        : 'border-neutral-l3 bg-white hover:border-[#432c9e]/30 hover:shadow'
                    }`}
                  >
                    {rate.type === 'par' && (
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-[#ff8300] text-white text-[10px] font-bold rounded-full">
                        PAR
                      </div>
                    )}
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${selectedRateIndex === index ? 'text-[#ff8300]' : 'text-[#0f172b]'}`}>
                        {formatCurrency(rate.payment)}
                      </div>
                      <div className={`text-lg font-semibold ${selectedRateIndex === index ? 'text-[#ff8300]' : 'text-[#432c9e]'}`}>
                        {rate.rate.toFixed(3)}%
                      </div>
                      <div className="text-xs text-neutral-l1 mt-1">{rate.label}</div>
                      {rate.sublabel && (
                        <div className={`text-xs font-medium mt-0.5 ${rate.type === 'buydown' ? 'text-rose-500' : 'text-green-600'}`}>
                          {rate.sublabel}
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ==================== BOTTOM SECTION: 50/50 Split ==================== */}
        <div className="grid grid-cols-2 gap-4">
          
          {/* LEFT 50%: Present vs Proposed Comparison */}
          <div className="space-y-4">
            {/* Comparison Table */}
            <div className="bg-white border border-neutral-l3 rounded-xl overflow-hidden shadow-sm">
              <div className="px-4 py-3 bg-gradient-to-r from-[#432c9e] to-[#6b5ce7] text-white">
                <h3 className="font-bold text-sm">Present vs Proposed Comparison</h3>
              </div>
              
              <table className="w-full text-sm">
                <thead className="bg-neutral-l5">
                  <tr>
                    <th className="px-4 py-2 text-left font-semibold text-neutral-d2"></th>
                    <th className="px-4 py-2 text-right font-semibold bg-[#fff8f2] w-28">Present</th>
                    <th className="px-4 py-2 text-right font-semibold bg-[#edeffe] text-[#432c9e] w-28">Proposed</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Mortgage Section */}
                  <tr className="border-t border-neutral-l3">
                    <td className="px-4 py-2 text-neutral-d1">P&I</td>
                    <td className="px-4 py-2 text-right bg-[#fff8f2]/50">{formatCurrency(presentScenario.pi)}</td>
                    <td className="px-4 py-2 text-right bg-[#edeffe]/50 font-medium text-[#432c9e]">{formatCurrency(proposedScenario.pi)}</td>
                  </tr>
                  <tr className="border-t border-neutral-l3">
                    <td className="px-4 py-2 text-neutral-d1">Taxes</td>
                    <td className="px-4 py-2 text-right bg-[#fff8f2]/50">{formatCurrency(presentScenario.taxes)}</td>
                    <td className="px-4 py-2 text-right bg-[#edeffe]/50">{formatCurrency(proposedScenario.taxes)}</td>
                  </tr>
                  <tr className="border-t border-neutral-l3">
                    <td className="px-4 py-2 text-neutral-d1">Insurance</td>
                    <td className="px-4 py-2 text-right bg-[#fff8f2]/50">{formatCurrency(presentScenario.insurance)}</td>
                    <td className="px-4 py-2 text-right bg-[#edeffe]/50">{formatCurrency(proposedScenario.insurance)}</td>
                  </tr>
                  <tr className="border-t border-neutral-l3">
                    <td className="px-4 py-2 text-neutral-d1">MI/MIP</td>
                    <td className="px-4 py-2 text-right bg-[#fff8f2]/50">{formatCurrency(presentScenario.mi)}</td>
                    <td className="px-4 py-2 text-right bg-[#edeffe]/50">{formatCurrency(proposedScenario.mi)}</td>
                  </tr>
                  <tr className="border-t-2 border-neutral-l2 bg-neutral-l5/70">
                    <td className="px-4 py-2 font-bold text-neutral-d2">Mortgage Total</td>
                    <td className="px-4 py-2 text-right font-bold bg-[#fff8f2]/70">{formatCurrency(presentScenario.mortgageTotal)}</td>
                    <td className="px-4 py-2 text-right font-bold bg-[#edeffe]/70 text-[#432c9e]">{formatCurrency(proposedScenario.mortgageTotal)}</td>
                  </tr>
                  
                  {/* Debts Being Paid Off */}
                  <tr className="border-t-2 border-green-200 bg-green-50/50">
                    <td className="px-4 py-2 font-semibold text-green-800">Debts Being Paid Off</td>
                    <td className="px-4 py-2 text-right font-bold text-rose-600 bg-[#fff8f2]/50">{formatCurrency(totalDebtsPaidPayment)}</td>
                    <td className="px-4 py-2 text-right font-bold text-green-600 bg-green-100">$0 ✓</td>
                  </tr>
                  
                  {/* Debts NOT Being Paid Off */}
                  <tr className="border-t border-amber-200 bg-amber-50/50">
                    <td className="px-4 py-2 font-semibold text-amber-800">Debts NOT Paid Off</td>
                    <td className="px-4 py-2 text-right font-medium text-amber-700 bg-[#fff8f2]/50">{formatCurrency(totalDebtsNotPaidPayment)}</td>
                    <td className="px-4 py-2 text-right font-medium text-amber-700 bg-amber-100">{formatCurrency(totalDebtsNotPaidPayment)}</td>
                  </tr>
                  
                  {/* TOTAL */}
                  <tr className="border-t-2 border-[#432c9e]">
                    <td className="px-4 py-3 font-bold text-lg bg-neutral-l4">TOTAL MONTHLY</td>
                    <td className="px-4 py-3 text-right font-bold text-xl bg-[#fff8f2]">{formatCurrency(presentScenario.total)}</td>
                    <td className="px-4 py-3 text-right font-bold text-xl bg-[#edeffe] text-[#432c9e]">{formatCurrency(proposedScenario.total)}</td>
                  </tr>
                  
                  {/* Savings Row */}
                  <tr className={monthlySavings > 0 ? 'bg-green-100' : 'bg-rose-100'}>
                    <td className="px-4 py-3 font-bold text-lg">
                      {monthlySavings > 0 ? '💰 Monthly Savings' : '⚠️ Monthly Increase'}
                    </td>
                    <td className="px-4 py-3"></td>
                    <td className={`px-4 py-3 text-right font-bold text-xl ${monthlySavings > 0 ? 'text-green-600' : 'text-rose-600'}`}>
                      {monthlySavings > 0 ? '' : '+'}{formatCurrency(Math.abs(monthlySavings))}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Cash Out Section */}
            <div className="bg-white border border-neutral-l3 rounded-xl overflow-hidden shadow-sm">
              <div className="px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-500 text-white flex items-center justify-between">
                <h3 className="font-bold text-sm">Cash Out at Closing</h3>
                <span className="text-xs bg-white/20 px-2 py-1 rounded">Based on {selectedRate?.label || 'Par Rate'}</span>
              </div>
              
              <div className="p-4 space-y-4">
                {/* Starting Cash */}
                <div className="flex justify-between items-center py-2 border-b border-neutral-l3">
                  <span className="text-sm font-medium text-neutral-d1">Starting Cash (from rate)</span>
                  <span className="text-lg font-bold text-[#432c9e]">{formatCurrency(startingCash)}</span>
                </div>
                
                {/* Discount Points */}
                <div className="flex justify-between items-center py-2 border-b border-neutral-l3">
                  <div>
                    <span className="text-sm font-medium text-neutral-d1">Discount Points</span>
                    <span className="text-xs text-neutral-l1 ml-2">({selectedRate?.points || 0} pts)</span>
                  </div>
                  <span className={`text-sm font-bold ${pointsValue >= 0 ? 'text-green-600' : 'text-rose-600'}`}>
                    {pointsValue >= 0 ? '+' : ''}{formatCurrency(pointsValue)}
                  </span>
                </div>
                
                {/* Fees */}
                <div className="py-2 border-b border-neutral-l3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-neutral-d1">Fees ({feePercent}%)</span>
                    <span className="text-sm font-bold text-rose-600">-{formatCurrency(feesAmount)}</span>
                  </div>
                  <input 
                    type="range" 
                    min="1" 
                    max="2" 
                    step="0.1"
                    value={feePercent}
                    onChange={(e) => setFeePercent(parseFloat(e.target.value))}
                    className="w-full h-2 bg-neutral-l3 rounded-full appearance-none cursor-pointer accent-[#432c9e]"
                  />
                  <div className="flex justify-between text-xs text-neutral-l1 mt-1">
                    <span>1%</span>
                    <span>2%</span>
                  </div>
                </div>
                
                {/* Escrows */}
                <div className="py-2 border-b border-neutral-l3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-neutral-d1">Escrows (6 mo T&I)</span>
                      <button
                        onClick={() => setEscrowsEnabled(!escrowsEnabled)}
                        className={`relative w-10 h-5 rounded-full transition-colors ${escrowsEnabled ? 'bg-[#432c9e]' : 'bg-neutral-l3'}`}
                      >
                        <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${escrowsEnabled ? 'translate-x-5' : 'translate-x-0.5'}`}></div>
                      </button>
                    </div>
                    <span className={`text-sm font-bold ${escrowsEnabled ? 'text-rose-600' : 'text-neutral-l1 line-through'}`}>
                      -{formatCurrency(escrowAmount)}
                    </span>
                  </div>
                  {escrowsEnabled && (
                    <p className="text-xs text-neutral-l1 mt-1">6 months × ({formatCurrency(monthlyTaxes)} taxes + {formatCurrency(monthlyInsurance)} ins)</p>
                  )}
                  {!escrowsEnabled && (
                    <p className="text-xs text-amber-600 mt-1">⚠️ Impounds not required</p>
                  )}
                </div>
                
                {/* Final Cash */}
                <div className="flex justify-between items-center pt-2">
                  <span className="text-base font-bold text-neutral-d2">
                    {cashToFromBorrower >= 0 ? 'Cash to Borrower' : 'Cash from Borrower'}
                  </span>
                  <span className={`text-2xl font-bold ${cashToFromBorrower >= 0 ? 'text-green-600' : 'text-rose-600'}`}>
                    {formatCurrency(Math.abs(cashToFromBorrower))}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT 50%: Charts */}
          <div className="space-y-4">
            {/* Chart Buttons */}
            <div className="bg-white border border-neutral-l3 rounded-xl overflow-hidden shadow-sm">
              <div className="px-4 py-3 bg-gradient-to-r from-stone-700 to-stone-600 text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                <h3 className="font-bold text-sm">Presentation Charts</h3>
              </div>
              
              <div className="p-4 grid grid-cols-2 gap-3">
                <button
                  onClick={() => onSelectChart?.('debt-worksheet')}
                  className="flex items-center gap-3 p-4 bg-purple-50 hover:bg-purple-100 border-2 border-purple-200 hover:border-purple-400 rounded-xl transition-all group"
                >
                  <div className="p-2 bg-purple-200 rounded-lg group-hover:bg-purple-300 transition-colors">
                    <CreditCard className="w-6 h-6 text-purple-700" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-bold text-purple-800">Debt Worksheet</div>
                    <div className="text-xs text-purple-600">Consolidation breakdown</div>
                  </div>
                </button>
                
                <button
                  onClick={() => onSelectChart?.('payment-savings')}
                  className="flex items-center gap-3 p-4 bg-teal-50 hover:bg-teal-100 border-2 border-teal-200 hover:border-teal-400 rounded-xl transition-all group"
                >
                  <div className="p-2 bg-teal-200 rounded-lg group-hover:bg-teal-300 transition-colors">
                    <TrendingUp className="w-6 h-6 text-teal-700" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-bold text-teal-800">Payment Savings</div>
                    <div className="text-xs text-teal-600">{formatCurrency(monthlySavings)}/mo saved</div>
                  </div>
                </button>
                
                <button
                  onClick={() => onSelectChart?.('cash-back')}
                  className="flex items-center gap-3 p-4 bg-emerald-50 hover:bg-emerald-100 border-2 border-emerald-200 hover:border-emerald-400 rounded-xl transition-all group"
                >
                  <div className="p-2 bg-emerald-200 rounded-lg group-hover:bg-emerald-300 transition-colors">
                    <DollarSign className="w-6 h-6 text-emerald-700" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-bold text-emerald-800">Cash Back</div>
                    <div className="text-xs text-emerald-600">{formatCurrency(Math.abs(cashToFromBorrower))} at closing</div>
                  </div>
                </button>
                
                <button
                  onClick={() => onSelectChart?.('accelerated-payoff')}
                  className="flex items-center gap-3 p-4 bg-violet-50 hover:bg-violet-100 border-2 border-violet-200 hover:border-violet-400 rounded-xl transition-all group"
                >
                  <div className="p-2 bg-violet-200 rounded-lg group-hover:bg-violet-300 transition-colors">
                    <Clock className="w-6 h-6 text-violet-700" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-bold text-violet-800">Accelerated Payoff</div>
                    <div className="text-xs text-violet-600">Apply {formatCurrency(monthlySavings)} extra</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Debts Being Paid Off Detail */}
            <div className="bg-white border border-green-200 rounded-xl overflow-hidden shadow-sm">
              <div className="px-4 py-2 bg-green-100 flex items-center justify-between">
                <h3 className="font-bold text-sm text-green-800">Debts Being Paid Off</h3>
                <span className="text-xs font-bold text-green-700">{formatCurrency(totalDebtsPaidPayment)}/mo</span>
              </div>
              <table className="w-full text-xs">
                <thead className="bg-green-50">
                  <tr>
                    <th className="px-3 py-1.5 text-left font-semibold text-green-700">Creditor</th>
                    <th className="px-3 py-1.5 text-right font-semibold text-green-700">Payment</th>
                    <th className="px-3 py-1.5 text-right font-semibold text-green-700">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {displayDebtsPaid.map((debt, i) => (
                    <tr key={i} className="border-t border-green-100">
                      <td className="px-3 py-1.5 text-stone-700">{debt.creditor}</td>
                      <td className="px-3 py-1.5 text-right text-stone-600">{formatCurrency(parseFloat(String(debt.payment).replace(/[$,]/g, '')) || 0)}</td>
                      <td className="px-3 py-1.5 text-right text-stone-600">{formatCurrency(parseFloat(String(debt.balance).replace(/[$,]/g, '')) || 0)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Debts NOT Being Paid Off */}
            <div className="bg-white border border-amber-200 rounded-xl overflow-hidden shadow-sm">
              <div className="px-4 py-2 bg-amber-100 flex items-center justify-between">
                <h3 className="font-bold text-sm text-amber-800">Debts NOT Being Paid Off</h3>
                <span className="text-xs font-bold text-amber-700">{formatCurrency(totalDebtsNotPaidPayment)}/mo</span>
              </div>
              <table className="w-full text-xs">
                <thead className="bg-amber-50">
                  <tr>
                    <th className="px-3 py-1.5 text-left font-semibold text-amber-700">Creditor</th>
                    <th className="px-3 py-1.5 text-right font-semibold text-amber-700">Payment</th>
                    <th className="px-3 py-1.5 text-right font-semibold text-amber-700">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {displayDebtsNotPaid.map((debt, i) => (
                    <tr key={i} className="border-t border-amber-100">
                      <td className="px-3 py-1.5 text-stone-700">{debt.creditor}</td>
                      <td className="px-3 py-1.5 text-right text-stone-600">{formatCurrency(parseFloat(String(debt.payment).replace(/[$,]/g, '')) || 0)}</td>
                      <td className="px-3 py-1.5 text-right text-stone-600">{formatCurrency(parseFloat(String(debt.balance).replace(/[$,]/g, '')) || 0)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Present Button */}
        <div className="flex justify-center pt-2">
          <button className="px-8 py-3 bg-gradient-to-r from-[#432c9e] to-[#6b5ce7] text-white font-bold rounded-xl hover:shadow-lg transition-all text-lg">
            ✓ Present This Comparison
          </button>
        </div>
      </div>

      {/* Loan Details Slide-out Panel */}
      <LoanDetailsPanel isOpen={showLoanDetails} onClose={() => setShowLoanDetails(false)} />
    </div>
  );
}
