import React, { useState, useEffect } from 'react';
import { CircleAlert, Pencil, Check, ChevronDown, ChevronRight, X, Settings2, SlidersHorizontal, ExternalLink, Maximize2, ChevronLeft, ArrowRight, CreditCard, TrendingUp, DollarSign, Clock, BarChart3 } from 'lucide-react';

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

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-neutral-d1">Cost of Improvements</label>
                <input
                  type="text"
                  value={costOfImprovements}
                  onChange={(e) => setCostOfImprovements(e.target.value)}
                  placeholder="$"
                  className="w-full px-3 py-2 border border-neutral-l3 rounded text-sm"
                />
              </div>
              <div className="col-span-2 flex items-end">
                <button
                  onClick={() => setSubordinateFinancing(!subordinateFinancing)}
                  className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                    subordinateFinancing 
                      ? 'bg-[#c9a227] text-white' 
                      : 'bg-white border-2 border-[#c9a227] text-[#c9a227] hover:bg-[#fff4b3]'
                  }`}
                >
                  Subordinate Financing
                </button>
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

          {/* Borrower Information Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-[#c9a227] uppercase tracking-wide border-b-2 border-[#c9a227] pb-2">
              Borrower Information
            </h3>
            
            <div className="grid grid-cols-4 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-[#c9a227]">Loan Level FICO</label>
                <input
                  type="text"
                  value={fico}
                  onChange={(e) => setFico(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-l3 rounded text-sm"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-[#c9a227]">DTI Ratio</label>
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    value={dti}
                    onChange={(e) => setDti(e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-l3 rounded text-sm"
                  />
                  <span className="text-sm text-neutral-l1">%</span>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-neutral-d1">Properties Financed</label>
                <input
                  type="text"
                  value={propertiesFinanced}
                  onChange={(e) => setPropertiesFinanced(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-l3 rounded text-sm"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-neutral-d1">Cash-Out Amount</label>
                <input
                  type="text"
                  value={cashOutAmount}
                  onChange={(e) => setCashOutAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-l3 rounded text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-neutral-d1">Reserve Months</label>
                <input
                  type="text"
                  value={reserveMonths}
                  onChange={(e) => setReserveMonths(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-l3 rounded text-sm"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-neutral-d1">Citizenship</label>
                <select 
                  value={citizenship}
                  onChange={(e) => setCitizenship(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-l3 rounded text-sm bg-white"
                >
                  <option>U.S. Citizen</option>
                  <option>Permanent Resident</option>
                  <option>Non-Permanent Resident</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-neutral-d1">Monthly Qualifying Income</label>
                <input
                  type="text"
                  value={monthlyQualifyingIncome}
                  onChange={(e) => setMonthlyQualifyingIncome(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-l3 rounded text-sm"
                />
              </div>
            </div>
          </div>

          {/* Property Information Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-[#2563eb] uppercase tracking-wide border-b-2 border-[#2563eb] pb-2">
              Property Information
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-[#2563eb]">Occupancy</label>
                <select 
                  value={occupancy}
                  onChange={(e) => setOccupancy(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-l3 rounded text-sm bg-white"
                >
                  <option>Primary Residence</option>
                  <option>Second Home</option>
                  <option>Investment Property</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-[#2563eb]">Property Type</label>
                <select 
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-l3 rounded text-sm bg-neutral-l5"
                >
                  <option>Single Family</option>
                  <option>Condo</option>
                  <option>Townhouse</option>
                  <option>Multi-Family</option>
                  <option>Manufactured</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-[#2563eb]">Number of Units</label>
                <select 
                  value={numberOfUnits}
                  onChange={(e) => setNumberOfUnits(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-l3 rounded text-sm bg-white"
                >
                  <option>1 Unit</option>
                  <option>2 Units</option>
                  <option>3 Units</option>
                  <option>4 Units</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-neutral-d1">Number of Stories</label>
                <input
                  type="text"
                  value={numberOfStories}
                  onChange={(e) => setNumberOfStories(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-l3 rounded text-sm bg-neutral-l5"
                  readOnly
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-neutral-d1">Property Address</label>
                <input
                  type="text"
                  value={propertyAddress}
                  onChange={(e) => setPropertyAddress(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-l3 rounded text-sm"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-neutral-d1">Property City</label>
                <input
                  type="text"
                  value={propertyCity}
                  onChange={(e) => setPropertyCity(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-l3 rounded text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-neutral-d1">Property Zip</label>
                <input
                  type="text"
                  value={propertyZip}
                  onChange={(e) => setPropertyZip(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-l3 rounded text-sm"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-neutral-d1">State</label>
                <select 
                  value={propertyState}
                  onChange={(e) => setPropertyState(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-l3 rounded text-sm bg-white"
                >
                  <option>North Carolina (NC)</option>
                  <option>California (CA)</option>
                  <option>Texas (TX)</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-neutral-d1">County</label>
                <select 
                  value={propertyCounty}
                  onChange={(e) => setPropertyCounty(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-l3 rounded text-sm bg-white"
                >
                  <option>Forsyth</option>
                </select>
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

      {/* Funding Fee Modal */}
      {showFundingFeeModal && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-[60]"
            onClick={() => setShowFundingFeeModal(false)}
          />
          <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] bg-white rounded-lg shadow-2xl z-[70] p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-[#0f172b]">Total Loan Amount</h3>
              <button 
                onClick={() => setShowFundingFeeModal(false)}
                className="p-1 hover:bg-neutral-l4 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={subsequentUse}
                    onChange={(e) => setSubsequentUse(e.target.checked)}
                    className="w-4 h-4"
                  />
                  Subsequent Use
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={exemptFromFundingFee}
                    onChange={(e) => setExemptFromFundingFee(e.target.checked)}
                    className="w-4 h-4"
                  />
                  Exempt from Funding Fee
                </label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-neutral-d1">Funding Fee</label>
                  <div className="flex items-center gap-1">
                    <input
                      type="text"
                      value={fundingFeePercent}
                      onChange={(e) => setFundingFeePercent(e.target.value)}
                      className="w-full px-3 py-2 border border-neutral-l3 rounded text-sm"
                    />
                    <span className="text-sm">%</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-neutral-d1">Funding Fee Amount</label>
                  <input
                    type="text"
                    value={fundingFeeAmount}
                    className="w-full px-3 py-2 border border-neutral-l3 rounded text-sm bg-neutral-l5"
                    readOnly
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={financeEntireFundingFee}
                  onChange={(e) => setFinanceEntireFundingFee(e.target.checked)}
                  className="w-4 h-4 accent-[#432c9e]"
                />
                Finance Entire Funding Fee
              </label>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-neutral-d1">Fee Paid in Cash</label>
                  <input
                    type="text"
                    value={feePaidInCash}
                    className="w-full px-3 py-2 border border-neutral-l3 rounded text-sm bg-neutral-l5"
                    readOnly
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-neutral-d1">Fee Financed</label>
                  <input
                    type="text"
                    value={feeFinanced}
                    className="w-full px-3 py-2 border border-neutral-l3 rounded text-sm bg-neutral-l5"
                    readOnly
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-neutral-l3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-neutral-d1">Base Loan Amount</label>
                  <input
                    type="text"
                    value={`$${baseLoanAmount}`}
                    className="w-full px-3 py-2 border border-neutral-l3 rounded text-sm bg-neutral-l5"
                    readOnly
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-neutral-d1">Total Loan Amount</label>
                  <input
                    type="text"
                    value={`$${totalLoanAmount}`}
                    className="w-full px-3 py-2 border border-neutral-l3 rounded text-sm bg-neutral-l5 font-bold"
                    readOnly
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => setShowFundingFeeModal(false)}
                  className="px-4 py-2 text-sm font-medium text-neutral-d1 bg-white border border-neutral-l3 rounded hover:bg-neutral-l4"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowFundingFeeModal(false)}
                  className="px-4 py-2 text-sm font-medium text-white bg-[#432c9e] rounded hover:bg-[#362480]"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

// Advanced Options Collapsible Section
function AdvancedOptionsSection({ title, children, defaultOpen = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <div className="border border-neutral-l3 rounded overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between bg-neutral-l5 hover:bg-neutral-l4 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Settings2 className="w-4 h-4 text-[#432c9e]" />
          <span className="text-sm font-semibold text-[#0f172b]">{title}</span>
        </div>
        <ChevronDown className={`w-5 h-5 text-neutral-d1 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="p-4 bg-white border-t border-neutral-l3">
          {children}
        </div>
      )}
    </div>
  );
}

export function PricingCalculator({ accounts = [], borrowerData = {}, onSelectChart }) {
  // State for form values
  const [escrowsEnabled, setEscrowsEnabled] = useState(true);
  const [selectedProgram, setSelectedProgram] = useState('Conventional');
  const [selectedTerm, setSelectedTerm] = useState(30);
  const [ltv, setLtv] = useState(9);
  const [loanAmount, setLoanAmount] = useState('71,494');
  const [cashout, setCashout] = useState('');
  const [taxes, setTaxes] = useState(0);
  const [insurance, setInsurance] = useState(66);
  const [extraPayment, setExtraPayment] = useState(0);
  
  // Slide-out panel state
  const [showLoanDetails, setShowLoanDetails] = useState(false);
  
  // Design option for Present vs Proposed comparison (A, B, C, D)
  const [comparisonDesign, setComparisonDesign] = useState('B');
  
  // Selected scenario for presentation
  const [selectedScenario, setSelectedScenario] = useState(1);
  
  // Carousel position for Option D
  const [carouselIndex, setCarouselIndex] = useState(0);

  // Listen for messages from popout window
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data?.type === 'LOAN_DETAILS_UPDATE') {
        console.log('Received loan details update from popout:', event.data.data);
        // Here you could update the local state with the popout data
        // For now, we'll show a notification
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Calculate totals from accounts
  const totalDebts = accounts
    .filter(a => a.willPay)
    .reduce((sum, a) => sum + (parseFloat(String(a.balance).replace(/[$,]/g, '')) || 0), 0);
  
  const totalMonthlyPayments = accounts
    .filter(a => a.willPay)
    .reduce((sum, a) => sum + (parseFloat(String(a.payment).replace(/[$,]/g, '')) || 0), 0);

  // Present mortgage values
  const presentMortgage = 123;
  const currentPayment = 4130;

  // Proposed mortgage values
  const proposedMortgage = 0;
  const discount = 0;
  const mortgageInsurance = 0;
  const newPayment = proposedMortgage + taxes + insurance + mortgageInsurance;

  // Value propositions
  const monthlySavings = currentPayment - newPayment;
  const annualSavings = monthlySavings * 12;
  const yearsSaved = 0;
  const interestSaved = 0;
  const estCashBack = 0;

  const programs = ['Conventional', 'FHA', 'VA'];
  const terms = [30, 20, 15, 10];
  
  // Mock scenario data for comparison
  const scenarios = [
    {
      id: 0,
      name: 'Current',
      label: 'Present',
      payment: currentPayment,
      pi: 1710,
      taxes: 450,
      insurance: 120,
      mi: 0,
      debts: totalMonthlyPayments,
      rate: 3.75,
      term: 30,
      savings: 0,
      isPresent: true
    },
    {
      id: 1,
      name: 'Best Rate',
      label: 'Scenario 1',
      payment: 4171,
      pi: 3447,
      taxes: 450,
      insurance: 120,
      mi: 154,
      debts: 0,
      rate: 6.875,
      term: 30,
      savings: currentPayment - 4171,
      cashout: 15000
    },
    {
      id: 2,
      name: 'Lower Payment',
      label: 'Scenario 2',
      payment: 3890,
      pi: 3150,
      taxes: 450,
      insurance: 120,
      mi: 170,
      debts: 0,
      rate: 7.25,
      term: 30,
      savings: currentPayment - 3890,
      cashout: 0
    },
    {
      id: 3,
      name: 'Max Cash Out',
      label: 'Scenario 3',
      payment: 4450,
      pi: 3726,
      taxes: 450,
      insurance: 120,
      mi: 154,
      debts: 0,
      rate: 7.0,
      term: 30,
      savings: currentPayment - 4450,
      cashout: 45000
    }
  ];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="px-6 py-6">
      <div className="flex flex-col gap-4 p-5 bg-white rounded-3xl">
        {/* Header with Loan Details Buttons */}
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-[#0f172b] rounded px-2 py-1">Calculators</h2>
          <div className="flex items-center gap-2">
            {/* Pop Out to New Window Button */}
            <button
              onClick={() => {
                const popoutWindow = window.open(
                  window.location.origin + '?view=loan-details-popout',
                  'LoanDetails',
                  'width=700,height=800,scrollbars=yes,resizable=yes'
                );
                if (popoutWindow) {
                  popoutWindow.focus();
                }
              }}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-[#432c9e] bg-white border-2 border-[#432c9e] hover:bg-[#edeffe] rounded-lg transition-colors"
              title="Open in new window"
            >
              <Maximize2 className="w-4 h-4" />
              <span>Pop Out</span>
            </button>
            {/* Slide Panel Button */}
            <button
              onClick={() => setShowLoanDetails(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#432c9e] hover:bg-[#362480] rounded-lg transition-colors shadow-sm"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Loan Details</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-70" />
            </button>
          </div>
        </div>

        {/* Important Disclaimer Banner - Compact */}
        <div className="flex gap-2 px-3 py-2 bg-[#fff4e5] border border-[#ff8401] rounded text-xs">
          <CircleAlert className="w-4 h-4 text-[#ff8300] flex-shrink-0 mt-0.5" />
          <p className="text-[#ff8401]">
            <span className="font-bold">Important:</span> Estimates only, not guaranteed rates. A formal mortgage application with credit pull is required for accurate pricing.
          </p>
        </div>

        {/* Quick Chart Actions */}
        <div className="bg-gradient-to-r from-stone-50 to-stone-100 border border-stone-200 rounded-lg px-3 py-2">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <BarChart3 className="w-3.5 h-3.5 text-stone-500" />
              <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wide">Charts</span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onSelectChart?.('debt-worksheet')}
                className="flex items-center gap-1 px-2 py-1 bg-white border border-stone-200 rounded text-[11px] font-medium text-stone-600 hover:bg-purple-50 hover:border-purple-300 hover:text-purple-700 transition-all"
              >
                <CreditCard className="w-3 h-3" />
                Debt
              </button>
              <button
                onClick={() => onSelectChart?.('payment-savings')}
                className="flex items-center gap-1 px-2 py-1 bg-white border border-stone-200 rounded text-[11px] font-medium text-stone-600 hover:bg-teal-50 hover:border-teal-300 hover:text-teal-700 transition-all"
              >
                <TrendingUp className="w-3 h-3" />
                Savings
              </button>
              <button
                onClick={() => onSelectChart?.('cash-back')}
                className="flex items-center gap-1 px-2 py-1 bg-white border border-stone-200 rounded text-[11px] font-medium text-stone-600 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700 transition-all"
              >
                <DollarSign className="w-3 h-3" />
                Cash
              </button>
              <button
                onClick={() => onSelectChart?.('accelerated-payoff')}
                className="flex items-center gap-1 px-2 py-1 bg-white border border-stone-200 rounded text-[11px] font-medium text-stone-600 hover:bg-purple-50 hover:border-purple-300 hover:text-purple-700 transition-all"
              >
                <Clock className="w-3 h-3" />
                Payoff
              </button>
            </div>
          </div>
        </div>

        {/* LTV/CLTV Display - Prominent */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-gradient-to-br from-[#432c9e] to-[#6b5ce7] rounded-xl p-4 text-white text-center">
            <p className="text-xs text-white/70 uppercase tracking-wide mb-1">LTV</p>
            <p className="text-3xl font-bold">{ltv}%</p>
          </div>
          <div className="bg-gradient-to-br from-[#432c9e] to-[#6b5ce7] rounded-xl p-4 text-white text-center">
            <p className="text-xs text-white/70 uppercase tracking-wide mb-1">CLTV</p>
            <p className="text-3xl font-bold">{ltv}%</p>
          </div>
          <div className="bg-gradient-to-br from-[#432c9e] to-[#6b5ce7] rounded-xl p-4 text-white text-center">
            <p className="text-xs text-white/70 uppercase tracking-wide mb-1">HCLTV</p>
            <p className="text-3xl font-bold">{ltv}%</p>
          </div>
        </div>

        {/* Present vs Proposed Comparison - Option C Only */}
        <div className="bg-white border border-neutral-l3 rounded-lg overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-2 bg-gradient-to-r from-[#432c9e] to-[#6b5ce7] text-white">
            <h3 className="font-bold text-sm">Present vs Proposed Comparison</h3>
            {/* Chart Buttons */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => onSelectChart?.('debt-worksheet')}
                className="flex items-center gap-1 px-2 py-1 bg-white/20 hover:bg-white/30 rounded text-[10px] font-medium transition-all"
              >
                <CreditCard className="w-3 h-3" />
                Debt
              </button>
              <button
                onClick={() => onSelectChart?.('payment-savings')}
                className="flex items-center gap-1 px-2 py-1 bg-white/20 hover:bg-white/30 rounded text-[10px] font-medium transition-all"
              >
                <TrendingUp className="w-3 h-3" />
                Savings
              </button>
              <button
                onClick={() => onSelectChart?.('cash-back')}
                className="flex items-center gap-1 px-2 py-1 bg-white/20 hover:bg-white/30 rounded text-[10px] font-medium transition-all"
              >
                <DollarSign className="w-3 h-3" />
                Cash
              </button>
              <button
                onClick={() => onSelectChart?.('accelerated-payoff')}
                className="flex items-center gap-1 px-2 py-1 bg-white/20 hover:bg-white/30 rounded text-[10px] font-medium transition-all"
              >
                <Clock className="w-3 h-3" />
                Payoff
              </button>
            </div>
          </div>

          <div className="p-4">
            {/* Aligned Comparison Table */}
            <div className="border border-neutral-l3 rounded-lg overflow-hidden">
              {/* Table Header */}
              <div className="grid grid-cols-[1fr_140px_140px] bg-neutral-l5">
                <div className="px-4 py-2 text-sm font-bold text-neutral-d2"></div>
                <div className="px-4 py-2 text-sm font-bold text-center bg-[#fff8f2] border-l border-neutral-l3">
                  PRESENT
                </div>
                <div className="px-4 py-2 text-sm font-bold text-center bg-[#edeffe] border-l border-neutral-l3 text-[#432c9e]">
                  PROPOSED
                </div>
              </div>
              
              {/* P&I Row */}
              <div className="grid grid-cols-[1fr_140px_140px] border-t border-neutral-l3">
                <div className="px-4 py-2 text-sm text-neutral-d1">Principal & Interest</div>
                <div className="px-4 py-2 text-sm text-right font-medium bg-[#fff8f2]/50 border-l border-neutral-l3">
                  {formatCurrency(scenarios[0].pi)}
                </div>
                <div className="px-4 py-2 text-sm text-right font-medium bg-[#edeffe]/50 border-l border-neutral-l3 text-[#432c9e]">
                  {formatCurrency(scenarios[selectedScenario]?.pi || 0)}
                </div>
              </div>
              
              {/* Taxes Row */}
              <div className="grid grid-cols-[1fr_140px_140px] border-t border-neutral-l3">
                <div className="px-4 py-2 text-sm text-neutral-d1">Taxes</div>
                <div className="px-4 py-2 text-sm text-right font-medium bg-[#fff8f2]/50 border-l border-neutral-l3">
                  {formatCurrency(scenarios[0].taxes)}
                </div>
                <div className="px-4 py-2 text-sm text-right font-medium bg-[#edeffe]/50 border-l border-neutral-l3">
                  {formatCurrency(scenarios[selectedScenario]?.taxes || 0)}
                </div>
              </div>
              
              {/* Insurance Row */}
              <div className="grid grid-cols-[1fr_140px_140px] border-t border-neutral-l3">
                <div className="px-4 py-2 text-sm text-neutral-d1">Insurance</div>
                <div className="px-4 py-2 text-sm text-right font-medium bg-[#fff8f2]/50 border-l border-neutral-l3">
                  {formatCurrency(scenarios[0].insurance)}
                </div>
                <div className="px-4 py-2 text-sm text-right font-medium bg-[#edeffe]/50 border-l border-neutral-l3">
                  {formatCurrency(scenarios[selectedScenario]?.insurance || 0)}
                </div>
              </div>
              
              {/* MI/MIP Row */}
              <div className="grid grid-cols-[1fr_140px_140px] border-t border-neutral-l3">
                <div className="px-4 py-2 text-sm text-neutral-d1">MI/MIP</div>
                <div className="px-4 py-2 text-sm text-right font-medium bg-[#fff8f2]/50 border-l border-neutral-l3">
                  {formatCurrency(scenarios[0].mi)}
                </div>
                <div className="px-4 py-2 text-sm text-right font-medium bg-[#edeffe]/50 border-l border-neutral-l3">
                  {formatCurrency(scenarios[selectedScenario]?.mi || 0)}
                </div>
              </div>
              
              {/* Mortgage Total Subtotal */}
              <div className="grid grid-cols-[1fr_140px_140px] border-t-2 border-neutral-l2 bg-neutral-l5/50">
                <div className="px-4 py-2 text-sm font-semibold text-neutral-d2">Total Mortgage Payment</div>
                <div className="px-4 py-2 text-sm text-right font-bold bg-[#fff8f2]/70 border-l border-neutral-l3">
                  {formatCurrency(scenarios[0].pi + scenarios[0].taxes + scenarios[0].insurance + scenarios[0].mi)}
                </div>
                <div className="px-4 py-2 text-sm text-right font-bold bg-[#edeffe]/70 border-l border-neutral-l3 text-[#432c9e]">
                  {formatCurrency((scenarios[selectedScenario]?.pi || 0) + (scenarios[selectedScenario]?.taxes || 0) + (scenarios[selectedScenario]?.insurance || 0) + (scenarios[selectedScenario]?.mi || 0))}
                </div>
              </div>
              
              {/* Debts Being Paid Off Row */}
              <div className="grid grid-cols-[1fr_140px_140px] border-t border-neutral-l3">
                <div className="px-4 py-2 text-sm text-neutral-d1">Debts Being Paid Off</div>
                <div className="px-4 py-2 text-sm text-right font-medium bg-[#fff8f2]/50 border-l border-neutral-l3 text-rose-600">
                  {formatCurrency(scenarios[0].debts)}
                </div>
                <div className="px-4 py-2 text-sm text-right font-medium bg-[#edeffe]/50 border-l border-neutral-l3 text-green-600">
                  $0 (Paid Off) ✓
                </div>
              </div>
              
              {/* Cash Out Row (if applicable) */}
              {scenarios[selectedScenario]?.cashout > 0 && (
                <div className="grid grid-cols-[1fr_140px_140px] border-t border-neutral-l3">
                  <div className="px-4 py-2 text-sm text-neutral-d1">Cash Out at Closing</div>
                  <div className="px-4 py-2 text-sm text-right font-medium bg-[#fff8f2]/50 border-l border-neutral-l3 text-neutral-l1">
                    —
                  </div>
                  <div className="px-4 py-2 text-sm text-right font-bold bg-[#edeffe]/50 border-l border-neutral-l3 text-[#432c9e]">
                    {formatCurrency(scenarios[selectedScenario].cashout)}
                  </div>
                </div>
              )}
              
              {/* TOTAL Row */}
              <div className="grid grid-cols-[1fr_140px_140px] border-t-2 border-[#432c9e]">
                <div className="px-4 py-2.5 text-sm font-bold text-neutral-d3 bg-neutral-l4">TOTAL MONTHLY</div>
                <div className="px-4 py-2.5 text-right font-bold text-lg bg-[#fff8f2] border-l border-neutral-l3">
                  {formatCurrency(scenarios[0].payment)}
                </div>
                <div className="px-4 py-2.5 text-right font-bold text-lg bg-[#edeffe] border-l border-neutral-l3 text-[#432c9e]">
                  {formatCurrency(scenarios[selectedScenario]?.payment || 0)}
                </div>
              </div>
              
              {/* Savings/Increase Row */}
              {scenarios[selectedScenario]?.savings !== 0 && (
                <div className={`grid grid-cols-[1fr_140px_140px] border-t border-neutral-l3 ${scenarios[selectedScenario]?.savings > 0 ? 'bg-green-50' : 'bg-rose-50'}`}>
                  <div className="px-4 py-2.5 text-sm font-bold text-neutral-d2">
                    {scenarios[selectedScenario]?.savings > 0 ? '💰 Monthly Savings' : '⚠️ Monthly Increase'}
                  </div>
                  <div className="px-4 py-2.5 border-l border-neutral-l3"></div>
                  <div className={`px-4 py-2.5 text-right font-bold text-lg border-l border-neutral-l3 ${scenarios[selectedScenario]?.savings > 0 ? 'text-green-600' : 'text-rose-600'}`}>
                    {scenarios[selectedScenario]?.savings > 0 ? '' : '+'}{formatCurrency(Math.abs(scenarios[selectedScenario]?.savings || 0))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Debts NOT Being Paid Section */}
            {accounts.filter(a => !a.willPay).length > 0 && (
              <div className="mt-4">
                <div className="text-xs font-semibold text-stone-500 uppercase mb-2">Debts NOT Being Paid Off (Remaining)</div>
                <div className="border border-amber-200 rounded-lg overflow-hidden bg-amber-50">
                  <div className="grid grid-cols-[1fr_100px_100px] bg-amber-100 text-xs font-semibold text-amber-800">
                    <div className="px-3 py-2">Creditor</div>
                    <div className="px-3 py-2 text-right">Payment</div>
                    <div className="px-3 py-2 text-right">Balance</div>
                  </div>
                  {accounts.filter(a => !a.willPay).map((debt, i) => (
                    <div key={i} className="grid grid-cols-[1fr_100px_100px] border-t border-amber-200 text-sm">
                      <div className="px-3 py-1.5 text-stone-700">{debt.creditor}</div>
                      <div className="px-3 py-1.5 text-right text-stone-600">${(parseFloat(String(debt.payment).replace(/[$,]/g, '')) || 0).toLocaleString()}</div>
                      <div className="px-3 py-1.5 text-right text-stone-600">${(parseFloat(String(debt.balance).replace(/[$,]/g, '')) || 0).toLocaleString()}</div>
                    </div>
                  ))}
                  <div className="grid grid-cols-[1fr_100px_100px] border-t border-amber-300 bg-amber-100 text-sm font-bold">
                    <div className="px-3 py-2 text-amber-800">Total Remaining</div>
                    <div className="px-3 py-2 text-right text-amber-800">
                      ${accounts.filter(a => !a.willPay).reduce((s, d) => s + (parseFloat(String(d.payment).replace(/[$,]/g, '')) || 0), 0).toLocaleString()}
                    </div>
                    <div className="px-3 py-2 text-right text-amber-800">
                      ${accounts.filter(a => !a.willPay).reduce((s, d) => s + (parseFloat(String(d.balance).replace(/[$,]/g, '')) || 0), 0).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Present Button */}
            <div className="mt-4 flex justify-end">
              <button className="px-6 py-2 bg-[#432c9e] text-white font-bold rounded-lg hover:bg-[#362480] transition-colors">
                ✓ Present This Comparison
              </button>
            </div>
          </div>
        </div>

        {/* Compact Configurations */}
        <div className="bg-white border border-neutral-l3 rounded-lg p-4">
          {/* Program & Term in one row */}
          <div className="flex items-center gap-6 mb-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-[#200f51] uppercase">Program</span>
              <div className="flex gap-1">
                {programs.map((program) => (
                  <button
                    key={program}
                    onClick={() => setSelectedProgram(program)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold transition-colors ${
                      selectedProgram === program
                        ? 'bg-[#432c9e] text-white'
                        : 'bg-[#edeffe] text-[#432c9e] hover:bg-[#dbdbfc]'
                    }`}
                  >
                    {selectedProgram === program && <Check className="w-3 h-3" />}
                    {program}
                  </button>
                ))}
              </div>
            </div>
            <div className="w-px h-6 bg-neutral-l3"></div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-[#200f51] uppercase">Term</span>
              <div className="flex gap-1">
                {terms.map((term) => (
                  <button
                    key={term}
                    onClick={() => setSelectedTerm(term)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold transition-colors ${
                      selectedTerm === term
                        ? 'bg-[#432c9e] text-white'
                        : 'bg-[#edeffe] text-[#432c9e] hover:bg-[#dbdbfc]'
                    }`}
                  >
                    {selectedTerm === term && <Check className="w-3 h-3" />}
                    {term}
                  </button>
                ))}
              </div>
            </div>
            <div className="w-px h-6 bg-neutral-l3"></div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#200f51] uppercase">Category</span>
              <span className="px-2 py-1 bg-neutral-l5 rounded text-xs text-neutral-d1">Refinance</span>
            </div>
          </div>

          {/* LTV Slider - Compact */}
          <div className="mb-4">
            <div className="flex items-center gap-4">
              <span className="text-xs font-semibold text-[#200f51] uppercase w-8">LTV</span>
              <div className="flex-1 relative h-6">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={ltv}
                  onChange={(e) => setLtv(parseInt(e.target.value))}
                  className="w-full h-2 bg-neutral-l3 rounded-full appearance-none cursor-pointer accent-[#432c9e]"
                  style={{
                    background: `linear-gradient(to right, #432c9e ${ltv}%, #e5e5e5 ${ltv}%)`
                  }}
                />
              </div>
              <span className="text-sm font-bold text-[#432c9e] w-12 text-right">{ltv}%</span>
            </div>
          </div>

          {/* Input Fields - 6 column grid */}
          <div className="grid grid-cols-6 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-medium text-neutral-d1 uppercase">Loan Amt</label>
              <input
                type="text"
                value={loanAmount}
                onChange={(e) => setLoanAmount(e.target.value)}
                className="w-full px-2 py-1.5 border border-neutral-l3 rounded text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-medium text-neutral-d1 uppercase">Debts</label>
              <input
                type="text"
                disabled
                value={totalDebts.toLocaleString()}
                className="w-full px-2 py-1.5 border border-neutral-l3 rounded text-sm bg-neutral-l5"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-medium text-neutral-d1 uppercase">Cashout</label>
              <input
                type="text"
                value={cashout}
                onChange={(e) => setCashout(e.target.value)}
                className="w-full px-2 py-1.5 border border-neutral-l3 rounded text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-medium text-neutral-d1 uppercase">DTI</label>
              <input
                type="text"
                defaultValue="23.10%"
                className="w-full px-2 py-1.5 border border-neutral-l3 rounded text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-medium text-neutral-d1 uppercase">FICO</label>
              <input
                type="text"
                defaultValue="692"
                className="w-full px-2 py-1.5 border border-neutral-l3 rounded text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-medium text-neutral-d1 uppercase">Reserves</label>
              <input
                type="text"
                defaultValue="0"
                className="w-full px-2 py-1.5 border border-neutral-l3 rounded text-sm"
              />
            </div>
          </div>

          {/* Second row of inputs */}
          <div className="grid grid-cols-4 gap-3 mt-3">
            <div className="space-y-1">
              <label className="text-[10px] font-medium text-neutral-d1 uppercase">Occupancy</label>
              <select className="w-full px-2 py-1.5 border border-neutral-l3 rounded text-sm bg-white">
                <option>Primary Residence</option>
                <option>Second Home</option>
                <option>Investment</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-medium text-neutral-d1 uppercase">Property Type</label>
              <select className="w-full px-2 py-1.5 border border-neutral-l3 rounded text-sm bg-white">
                <option>Single Family</option>
                <option>Condo</option>
                <option>Townhouse</option>
                <option>Multi-Family</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-medium text-neutral-d1 uppercase">Units</label>
              <select className="w-full px-2 py-1.5 border border-neutral-l3 rounded text-sm bg-white">
                <option>1 Unit</option>
                <option>2 Units</option>
                <option>3 Units</option>
                <option>4 Units</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-medium text-neutral-d1 uppercase">Interest Rate</label>
              <button
                type="button"
                disabled
                className="w-full px-2 py-1.5 border border-neutral-l3 rounded text-sm bg-neutral-l5 text-neutral-l1 text-left"
              >
                Search rates first
              </button>
            </div>
          </div>
        </div>

          {/* Search Rates Button */}
          <div className="flex justify-end mt-2">
            <button
              type="button"
              className="font-sans not-italic font-normal text-sm py-1.5 px-4 min-w-fit w-fit h-fit flex items-center rounded-[4px] text-white bg-[#ff8300] hover:bg-[#e67600] border-none transition-colors"
            >
              Search Rates
            </button>
          </div>
        </div>
      </div>

      {/* Loan Details Slide-out Panel */}
      <LoanDetailsPanel isOpen={showLoanDetails} onClose={() => setShowLoanDetails(false)} />
    </div>
  );
}
