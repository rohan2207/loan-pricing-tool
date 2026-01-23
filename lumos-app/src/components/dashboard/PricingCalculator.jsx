import React, { useState, useEffect } from 'react';
import { CircleAlert, Pencil, Check, ChevronDown, ChevronRight, X, Settings2, SlidersHorizontal, ExternalLink, Maximize2, ChevronLeft, ArrowRight } from 'lucide-react';

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

export function PricingCalculator({ accounts = [], borrowerData = {} }) {
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

        {/* Important Disclaimer Banner */}
        <div className="flex gap-3 p-4 bg-[#fff4e5] border border-[#ff8401] rounded">
          <div className="flex-shrink-0">
            <CircleAlert className="w-6 h-6 text-[#ff8300]" />
          </div>
          <div className="flex-1">
            <p className="font-bold text-sm text-[#ff8401]">
              Important: These are estimates only, not guaranteed rates or pricing.
            </p>
            <p className="text-sm text-[#ff8401] mt-1">
              Estimates are based on consumer finance profile data and may not reflect current market conditions or complete borrower information. A formal mortgage application with credit pull is required for accurate pricing.
            </p>
          </div>
        </div>

        {/* Multi-Scenario Comparison Section */}
        <div className="bg-white border border-neutral-l3 rounded-lg overflow-hidden">
          {/* Design Option Toggle */}
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-[#432c9e] to-[#6b5ce7] text-white">
            <h3 className="font-bold text-sm">Present vs Proposed Comparison</h3>
            <div className="flex items-center gap-1 bg-white/20 rounded-lg p-1">
              {['A', 'B', 'C', 'D'].map((opt) => (
                <button
                  key={opt}
                  onClick={() => setComparisonDesign(opt)}
                  className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                    comparisonDesign === opt
                      ? 'bg-white text-[#432c9e] shadow-sm'
                      : 'text-white/80 hover:bg-white/10'
                  }`}
                >
                  Option {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Option A: Horizontal Tabs */}
          {comparisonDesign === 'A' && (
            <div className="p-4">
              {/* Tab Headers */}
              <div className="flex border-b border-neutral-l3 mb-4">
                {scenarios.map((s, i) => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedScenario(i)}
                    className={`flex-1 py-3 px-4 text-sm font-medium transition-all border-b-2 ${
                      selectedScenario === i
                        ? 'border-[#432c9e] text-[#432c9e] bg-[#f8f7fc]'
                        : 'border-transparent text-neutral-d1 hover:text-[#432c9e] hover:bg-neutral-l5'
                    }`}
                  >
                    <div className="text-center">
                      <div className="font-bold">{s.isPresent ? 'CURRENT' : s.label}</div>
                      <div className="text-lg font-bold mt-1">{formatCurrency(s.payment)}/mo</div>
                      {!s.isPresent && s.savings > 0 && (
                        <div className="text-xs text-green-600 mt-0.5">Save {formatCurrency(s.savings)}</div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
              
              {/* Selected Scenario Details */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-bold text-sm text-neutral-d2 border-b pb-2">Payment Breakdown</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-d1">P&I</span>
                      <span className="font-medium">{formatCurrency(scenarios[selectedScenario].pi)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-d1">Taxes</span>
                      <span className="font-medium">{formatCurrency(scenarios[selectedScenario].taxes)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-d1">Insurance</span>
                      <span className="font-medium">{formatCurrency(scenarios[selectedScenario].insurance)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-d1">MI/MIP</span>
                      <span className="font-medium">{formatCurrency(scenarios[selectedScenario].mi)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-d1">Debts</span>
                      <span className={`font-medium ${scenarios[selectedScenario].debts === 0 ? 'text-green-600' : ''}`}>
                        {scenarios[selectedScenario].debts === 0 ? '$0 (Paid Off)' : formatCurrency(scenarios[selectedScenario].debts)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm font-bold pt-2 border-t">
                      <span>Total Payment</span>
                      <span>{formatCurrency(scenarios[selectedScenario].payment)}</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="font-bold text-sm text-neutral-d2 border-b pb-2">Loan Details</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-d1">Rate</span>
                      <span className="font-medium">{scenarios[selectedScenario].rate}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-d1">Term</span>
                      <span className="font-medium">{scenarios[selectedScenario].term} years</span>
                    </div>
                    {scenarios[selectedScenario].cashout !== undefined && (
                      <div className="flex justify-between text-sm">
                        <span className="text-neutral-d1">Cash Out</span>
                        <span className="font-medium text-[#432c9e]">{formatCurrency(scenarios[selectedScenario].cashout)}</span>
                      </div>
                    )}
                  </div>
                  {!scenarios[selectedScenario].isPresent && (
                    <button className="w-full mt-4 py-2 px-4 bg-[#432c9e] text-white text-sm font-bold rounded-lg hover:bg-[#362480] transition-colors">
                      ✓ Present This Scenario
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Option B: Side-by-Side Cards */}
          {comparisonDesign === 'B' && (
            <div className="p-4">
              <div className="grid grid-cols-4 gap-3">
                {scenarios.map((s) => (
                  <div 
                    key={s.id}
                    className={`rounded-lg border-2 overflow-hidden transition-all cursor-pointer ${
                      selectedScenario === s.id 
                        ? 'border-[#432c9e] shadow-lg' 
                        : 'border-neutral-l3 hover:border-[#432c9e]/50'
                    }`}
                    onClick={() => setSelectedScenario(s.id)}
                  >
                    {/* Card Header */}
                    <div className={`px-3 py-2 text-center ${
                      s.isPresent ? 'bg-[#fff8f2]' : 'bg-[#f8f7fc]'
                    }`}>
                      <div className="text-xs font-bold text-neutral-d1 uppercase">
                        {s.isPresent ? 'Current' : s.name}
                      </div>
                      {!s.isPresent && (
                        <div className="text-[10px] text-neutral-l1">{s.label}</div>
                      )}
                    </div>
                    
                    {/* Payment */}
                    <div className="px-3 py-3 text-center border-b border-neutral-l3">
                      <div className="text-xl font-bold text-[#0f172b]">{formatCurrency(s.payment)}</div>
                      <div className="text-xs text-neutral-l1">/month</div>
                      {!s.isPresent && s.savings > 0 && (
                        <div className="text-xs font-bold text-green-600 mt-1">
                          Save {formatCurrency(s.savings)}/mo
                        </div>
                      )}
                      {!s.isPresent && s.savings < 0 && (
                        <div className="text-xs font-bold text-rose-500 mt-1">
                          +{formatCurrency(Math.abs(s.savings))}/mo
                        </div>
                      )}
                    </div>
                    
                    {/* Breakdown */}
                    <div className="px-3 py-2 text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="text-neutral-l1">P&I</span>
                        <span className="font-medium">{formatCurrency(s.pi)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-l1">Escrow</span>
                        <span className="font-medium">{formatCurrency(s.taxes + s.insurance)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-l1">Debts</span>
                        <span className={`font-medium ${s.debts === 0 && !s.isPresent ? 'text-green-600' : ''}`}>
                          {s.debts === 0 && !s.isPresent ? '$0 ✓' : formatCurrency(s.debts)}
                        </span>
                      </div>
                      {s.cashout !== undefined && s.cashout > 0 && (
                        <div className="flex justify-between pt-1 border-t border-neutral-l3">
                          <span className="text-[#432c9e]">Cash Out</span>
                          <span className="font-bold text-[#432c9e]">{formatCurrency(s.cashout)}</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Present Button */}
                    {!s.isPresent && (
                      <div className="px-3 pb-3">
                        <button 
                          onClick={(e) => { e.stopPropagation(); setSelectedScenario(s.id); }}
                          className={`w-full py-1.5 text-xs font-bold rounded-md transition-all ${
                            selectedScenario === s.id
                              ? 'bg-[#432c9e] text-white'
                              : 'bg-neutral-l4 text-neutral-d1 hover:bg-[#edeffe] hover:text-[#432c9e]'
                          }`}
                        >
                          {selectedScenario === s.id ? '✓ Selected' : 'Present'}
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Option C: Aligned Table Comparison */}
          {comparisonDesign === 'C' && (
            <div className="p-4">
              {/* Aligned Comparison Table */}
              <div className="border border-neutral-l3 rounded-lg overflow-hidden">
                {/* Table Header */}
                <div className="grid grid-cols-[1fr_140px_140px] bg-neutral-l5">
                  <div className="px-4 py-3 text-sm font-bold text-neutral-d2"></div>
                  <div className="px-4 py-3 text-sm font-bold text-center bg-[#fff8f2] border-l border-neutral-l3">
                    PRESENT
                  </div>
                  <div className="px-4 py-3 text-sm font-bold text-center bg-[#edeffe] border-l border-neutral-l3 text-[#432c9e]">
                    PROPOSED
                  </div>
                </div>
                
                {/* P&I Row */}
                <div className="grid grid-cols-[1fr_140px_140px] border-t border-neutral-l3">
                  <div className="px-4 py-2.5 text-sm text-neutral-d1">Principal & Interest</div>
                  <div className="px-4 py-2.5 text-sm text-right font-medium bg-[#fff8f2]/50 border-l border-neutral-l3">
                    {formatCurrency(scenarios[0].pi)}
                  </div>
                  <div className="px-4 py-2.5 text-sm text-right font-medium bg-[#edeffe]/50 border-l border-neutral-l3 text-[#432c9e]">
                    {formatCurrency(scenarios[selectedScenario]?.pi || 0)}
                  </div>
                </div>
                
                {/* Taxes Row */}
                <div className="grid grid-cols-[1fr_140px_140px] border-t border-neutral-l3">
                  <div className="px-4 py-2.5 text-sm text-neutral-d1">Taxes</div>
                  <div className="px-4 py-2.5 text-sm text-right font-medium bg-[#fff8f2]/50 border-l border-neutral-l3">
                    {formatCurrency(scenarios[0].taxes)}
                  </div>
                  <div className="px-4 py-2.5 text-sm text-right font-medium bg-[#edeffe]/50 border-l border-neutral-l3">
                    {formatCurrency(scenarios[selectedScenario]?.taxes || 0)}
                  </div>
                </div>
                
                {/* Insurance Row */}
                <div className="grid grid-cols-[1fr_140px_140px] border-t border-neutral-l3">
                  <div className="px-4 py-2.5 text-sm text-neutral-d1">Insurance</div>
                  <div className="px-4 py-2.5 text-sm text-right font-medium bg-[#fff8f2]/50 border-l border-neutral-l3">
                    {formatCurrency(scenarios[0].insurance)}
                  </div>
                  <div className="px-4 py-2.5 text-sm text-right font-medium bg-[#edeffe]/50 border-l border-neutral-l3">
                    {formatCurrency(scenarios[selectedScenario]?.insurance || 0)}
                  </div>
                </div>
                
                {/* MI/MIP Row */}
                <div className="grid grid-cols-[1fr_140px_140px] border-t border-neutral-l3">
                  <div className="px-4 py-2.5 text-sm text-neutral-d1">MI/MIP</div>
                  <div className="px-4 py-2.5 text-sm text-right font-medium bg-[#fff8f2]/50 border-l border-neutral-l3">
                    {formatCurrency(scenarios[0].mi)}
                  </div>
                  <div className="px-4 py-2.5 text-sm text-right font-medium bg-[#edeffe]/50 border-l border-neutral-l3">
                    {formatCurrency(scenarios[selectedScenario]?.mi || 0)}
                  </div>
                </div>
                
                {/* Mortgage Total Subtotal */}
                <div className="grid grid-cols-[1fr_140px_140px] border-t-2 border-neutral-l2 bg-neutral-l5/50">
                  <div className="px-4 py-2.5 text-sm font-semibold text-neutral-d2">Total Mortgage Payment</div>
                  <div className="px-4 py-2.5 text-sm text-right font-bold bg-[#fff8f2]/70 border-l border-neutral-l3">
                    {formatCurrency(scenarios[0].pi + scenarios[0].taxes + scenarios[0].insurance + scenarios[0].mi)}
                  </div>
                  <div className="px-4 py-2.5 text-sm text-right font-bold bg-[#edeffe]/70 border-l border-neutral-l3 text-[#432c9e]">
                    {formatCurrency((scenarios[selectedScenario]?.pi || 0) + (scenarios[selectedScenario]?.taxes || 0) + (scenarios[selectedScenario]?.insurance || 0) + (scenarios[selectedScenario]?.mi || 0))}
                  </div>
                </div>
                
                {/* Debts Being Paid Off Row */}
                <div className="grid grid-cols-[1fr_140px_140px] border-t border-neutral-l3">
                  <div className="px-4 py-2.5 text-sm text-neutral-d1">Debts Being Paid Off</div>
                  <div className="px-4 py-2.5 text-sm text-right font-medium bg-[#fff8f2]/50 border-l border-neutral-l3 text-rose-600">
                    {formatCurrency(scenarios[0].debts)}
                  </div>
                  <div className="px-4 py-2.5 text-sm text-right font-medium bg-[#edeffe]/50 border-l border-neutral-l3 text-green-600">
                    $0 (Paid Off) ✓
                  </div>
                </div>
                
                {/* Cash Out Row (if applicable) */}
                {scenarios[selectedScenario]?.cashout > 0 && (
                  <div className="grid grid-cols-[1fr_140px_140px] border-t border-neutral-l3">
                    <div className="px-4 py-2.5 text-sm text-neutral-d1">Cash Out at Closing</div>
                    <div className="px-4 py-2.5 text-sm text-right font-medium bg-[#fff8f2]/50 border-l border-neutral-l3 text-neutral-l1">
                      —
                    </div>
                    <div className="px-4 py-2.5 text-sm text-right font-bold bg-[#edeffe]/50 border-l border-neutral-l3 text-[#432c9e]">
                      {formatCurrency(scenarios[selectedScenario].cashout)}
                    </div>
                  </div>
                )}
                
                {/* TOTAL Row */}
                <div className="grid grid-cols-[1fr_140px_140px] border-t-2 border-[#432c9e]">
                  <div className="px-4 py-3 text-sm font-bold text-neutral-d3 bg-neutral-l4">TOTAL MONTHLY</div>
                  <div className="px-4 py-3 text-right font-bold text-lg bg-[#fff8f2] border-l border-neutral-l3">
                    {formatCurrency(scenarios[0].payment)}
                  </div>
                  <div className="px-4 py-3 text-right font-bold text-lg bg-[#edeffe] border-l border-neutral-l3 text-[#432c9e]">
                    {formatCurrency(scenarios[selectedScenario]?.payment || 0)}
                  </div>
                </div>
                
                {/* Savings Row */}
                {scenarios[selectedScenario]?.savings !== 0 && (
                  <div className={`grid grid-cols-[1fr_140px_140px] border-t border-neutral-l3 ${scenarios[selectedScenario]?.savings > 0 ? 'bg-green-50' : 'bg-rose-50'}`}>
                    <div className="px-4 py-3 text-sm font-bold text-neutral-d2">
                      {scenarios[selectedScenario]?.savings > 0 ? '💰 Monthly Savings' : '⚠️ Monthly Increase'}
                    </div>
                    <div className="px-4 py-3 border-l border-neutral-l3"></div>
                    <div className={`px-4 py-3 text-right font-bold text-lg border-l border-neutral-l3 ${scenarios[selectedScenario]?.savings > 0 ? 'text-green-600' : 'text-rose-600'}`}>
                      {scenarios[selectedScenario]?.savings > 0 ? '' : '+'}{formatCurrency(Math.abs(scenarios[selectedScenario]?.savings || 0))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Present Button */}
              <div className="mt-4 flex justify-end">
                <button className="px-6 py-2.5 bg-[#432c9e] text-white font-bold rounded-lg hover:bg-[#362480] transition-colors">
                  ✓ Present This Comparison
                </button>
              </div>
            </div>
          )}

          {/* Option D: Carousel/Slider */}
          {comparisonDesign === 'D' && (
            <div className="p-4">
              {/* Carousel Navigation */}
              <div className="flex items-center justify-between mb-4">
                <button 
                  onClick={() => setCarouselIndex(Math.max(0, carouselIndex - 1))}
                  disabled={carouselIndex === 0}
                  className="p-2 rounded-full bg-neutral-l4 hover:bg-neutral-l3 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="text-center">
                  <div className="text-sm text-neutral-l1">
                    Scenario {carouselIndex + 1} of {scenarios.length}
                  </div>
                  <div className="text-lg font-bold text-[#432c9e]">
                    {scenarios[carouselIndex].isPresent ? 'Current Situation' : scenarios[carouselIndex].name}
                  </div>
                </div>
                <button 
                  onClick={() => setCarouselIndex(Math.min(scenarios.length - 1, carouselIndex + 1))}
                  disabled={carouselIndex === scenarios.length - 1}
                  className="p-2 rounded-full bg-neutral-l4 hover:bg-neutral-l3 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
              
              {/* Current Slide */}
              <div className={`rounded-xl p-6 ${scenarios[carouselIndex].isPresent ? 'bg-[#fff8f2] border border-[#f2d4ba]' : 'bg-[#f8f7fc] border-2 border-[#432c9e]'}`}>
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-[#0f172b]">{formatCurrency(scenarios[carouselIndex].payment)}</div>
                  <div className="text-sm text-neutral-l1">/month total payment</div>
                  {!scenarios[carouselIndex].isPresent && scenarios[carouselIndex].savings > 0 && (
                    <div className="inline-block mt-2 px-4 py-1 bg-green-100 text-green-700 text-sm font-bold rounded-full">
                      Save {formatCurrency(scenarios[carouselIndex].savings)}/month
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-white rounded-lg p-3">
                    <div className="text-xs text-neutral-l1 uppercase mb-1">Rate</div>
                    <div className="text-lg font-bold">{scenarios[carouselIndex].rate}%</div>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <div className="text-xs text-neutral-l1 uppercase mb-1">P&I</div>
                    <div className="text-lg font-bold">{formatCurrency(scenarios[carouselIndex].pi)}</div>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <div className="text-xs text-neutral-l1 uppercase mb-1">Debts</div>
                    <div className={`text-lg font-bold ${scenarios[carouselIndex].debts === 0 && !scenarios[carouselIndex].isPresent ? 'text-green-600' : ''}`}>
                      {scenarios[carouselIndex].debts === 0 && !scenarios[carouselIndex].isPresent ? '$0 ✓' : formatCurrency(scenarios[carouselIndex].debts)}
                    </div>
                  </div>
                </div>
                
                {scenarios[carouselIndex].cashout > 0 && (
                  <div className="mt-4 p-3 bg-[#edeffe] rounded-lg text-center">
                    <div className="text-xs text-[#432c9e] uppercase mb-1">Cash Out Available</div>
                    <div className="text-xl font-bold text-[#432c9e]">{formatCurrency(scenarios[carouselIndex].cashout)}</div>
                  </div>
                )}
                
                {!scenarios[carouselIndex].isPresent && (
                  <button className="w-full mt-4 py-3 bg-[#432c9e] text-white font-bold rounded-lg hover:bg-[#362480] transition-colors">
                    ✓ Present This Scenario
                  </button>
                )}
              </div>
              
              {/* Dot indicators */}
              <div className="flex justify-center gap-2 mt-4">
                {scenarios.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCarouselIndex(i)}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      carouselIndex === i ? 'bg-[#432c9e] w-6' : 'bg-neutral-l3 hover:bg-neutral-l2'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Configurations Section */}
        <div className="flex justify-between items-end">
          <h2 className="text-sm font-bold text-[#0f172b] rounded px-2 py-1">Configurations</h2>
          <div className="flex flex-col gap-1 rounded p-2">
            <label className="text-xs text-[#45556c]">Product category</label>
            <button 
              type="button" 
              disabled
              className="flex h-10 w-40 items-center justify-between rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span>Refinance</span>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </button>
          </div>
        </div>

        {/* Configuration Cards */}
        <div className="flex flex-col gap-3">
          {/* Program Selection */}
          <div className="p-4 bg-white border border-neutral-l3 rounded-t rounded">
            <div className="flex flex-col gap-3">
              <span className="text-sm font-medium text-[#200f51]">Program</span>
              <div className="flex flex-wrap gap-2">
                {programs.map((program) => (
                  <button
                    key={program}
                    onClick={() => setSelectedProgram(program)}
                    className={`flex items-center gap-1 px-3 py-2 rounded-full text-sm font-bold transition-colors cursor-pointer ${
                      selectedProgram === program
                        ? 'bg-[#edeffe] border-2 border-[#432c9e] text-[#432c9e]'
                        : 'bg-[#edeffe] border-0 text-[#432c9e] hover:bg-[#dbdbfc]'
                    }`}
                  >
                    {selectedProgram === program && <Check className="w-5 h-5" />}
                    <span>{program}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Term Selection */}
          <div className="p-4 bg-white border border-neutral-l3 rounded">
            <div className="flex flex-col gap-3">
              <span className="text-sm font-medium text-[#200f51]">Term</span>
              <div className="flex flex-wrap gap-2">
                {terms.map((term) => (
                  <button
                    key={term}
                    onClick={() => setSelectedTerm(term)}
                    className={`flex items-center gap-1 px-3 py-2 rounded-full text-sm font-bold transition-colors cursor-pointer ${
                      selectedTerm === term
                        ? 'bg-[#edeffe] border-2 border-[#432c9e] text-[#432c9e]'
                        : 'bg-[#edeffe] border-0 text-[#432c9e] hover:bg-[#dbdbfc]'
                    }`}
                  >
                    {selectedTerm === term && <Check className="w-5 h-5" />}
                    <span>{term}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* LTV Slider */}
          <div className="p-4 bg-white border border-neutral-l3 rounded">
            <div className="flex flex-col gap-2 p-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-[#200f51]">LTV</span>
                <div className="flex items-center gap-2">
                  <button aria-label="Edit LTV" className="text-[#432c9e] hover:text-[#200f51] disabled:opacity-50">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <span className="text-sm font-bold text-[#432c9e]">{ltv}%</span>
                </div>
              </div>
              
              {/* Custom Slider */}
              <div className="relative h-[42px] cursor-pointer">
                {/* Track background */}
                <div 
                  className="absolute left-0 right-0 h-[6px] rounded-full"
                  style={{ background: 'rgb(223, 223, 223)', top: '5px' }}
                ></div>
                {/* Active track */}
                <div 
                  className="absolute left-0 h-[6px] rounded-full"
                  style={{ background: 'rgb(67, 44, 158)', width: `${ltv}%`, top: '5px' }}
                ></div>
                {/* Thumb */}
                <div 
                  className="absolute"
                  style={{ left: `${ltv}%`, transform: 'translateX(-50%)', top: '0px', zIndex: 10 }}
                >
                  <div 
                    style={{
                      width: '16px',
                      height: '16px',
                      borderRadius: '9999px',
                      background: 'rgb(255, 255, 255)',
                      border: '3px solid rgb(67, 44, 158)',
                      boxShadow: 'rgb(67, 44, 158) 0px 0px 0px 2px',
                      cursor: 'grab'
                    }}
                  ></div>
                </div>
                
                {/* Tick marks */}
                {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((tick) => (
                  <div 
                    key={tick}
                    className="absolute flex flex-col items-center"
                    style={{ left: `${tick}%`, transform: 'translateX(-50%)', top: '0px' }}
                  >
                    <div 
                      style={{
                        width: '8px',
                        height: '8px',
                        marginTop: '4px',
                        borderRadius: '9999px',
                        background: tick <= ltv ? 'rgb(67, 44, 158)' : 'rgb(223, 223, 223)',
                        cursor: 'pointer'
                      }}
                      onClick={() => setLtv(tick)}
                    ></div>
                    <span 
                      className="text-center mt-2"
                      style={{ fontSize: '12px', fontWeight: 500, lineHeight: '18px', color: 'rgb(69, 85, 108)', minWidth: tick === 100 ? '22px' : '16px' }}
                    >
                      {tick}
                    </span>
                  </div>
                ))}

                {/* Invisible input for slider interaction */}
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={ltv}
                  onChange={(e) => setLtv(parseInt(e.target.value))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            </div>

            {/* Input Fields Grid */}
            <div className="mt-4 grid grid-cols-4 gap-4">
              <div className="flex flex-col gap-1 flex-1">
                <label className="text-sm font-medium text-[#200f51]">Loan amount</label>
                <input
                  type="text"
                  placeholder="Enter amount"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-[#e3e0f0] rounded text-sm text-[#0f172b] placeholder:text-neutral-l2 disabled:opacity-50 disabled:bg-neutral-l5"
                />
              </div>
              <div className="flex flex-col gap-1 flex-1">
                <label className="text-sm font-medium text-[#200f51]">Debts</label>
                <input
                  type="text"
                  placeholder="Value"
                  disabled
                  value={totalDebts.toLocaleString()}
                  className="w-full px-3 py-2 border border-[#e3e0f0] rounded text-sm text-[#0f172b] placeholder:text-neutral-l2 disabled:opacity-50 disabled:bg-neutral-l5"
                />
              </div>
              <div className="flex flex-col gap-1 flex-1">
                <label className="text-sm font-medium text-[#200f51]">Cashout</label>
                <input
                  type="text"
                  placeholder="Enter amount"
                  value={cashout}
                  onChange={(e) => setCashout(e.target.value)}
                  className="w-full px-3 py-2 border border-[#e3e0f0] rounded text-sm text-[#0f172b] placeholder:text-neutral-l2 disabled:opacity-50 disabled:bg-neutral-l5"
                />
              </div>
              <div className="flex flex-col gap-1 flex-1">
                <label className="text-sm font-medium text-[#200f51]">Interest Rate</label>
                <button
                  type="button"
                  disabled
                  className="flex h-10 w-full items-center justify-between rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <span className="text-neutral-400">Search for rates first</span>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </button>
                <div className="text-xs text-neutral-l1 mt-1"></div>
              </div>
            </div>
          </div>

          {/* Advanced Options Section */}
          <AdvancedOptionsSection title="Advanced Options">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-neutral-d1">DTI Ratio</label>
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    defaultValue="23.10"
                    className="w-full px-3 py-2 border border-neutral-l3 rounded text-sm"
                  />
                  <span className="text-sm text-neutral-l1">%</span>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-neutral-d1">FICO Score</label>
                <input
                  type="text"
                  defaultValue="692"
                  className="w-full px-3 py-2 border border-neutral-l3 rounded text-sm"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-neutral-d1">Reserve Months</label>
                <input
                  type="text"
                  defaultValue="0"
                  className="w-full px-3 py-2 border border-neutral-l3 rounded text-sm"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-neutral-d1">Occupancy</label>
                <select className="w-full px-3 py-2 border border-neutral-l3 rounded text-sm bg-white">
                  <option>Primary Residence</option>
                  <option>Second Home</option>
                  <option>Investment</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-neutral-d1">Property Type</label>
                <select className="w-full px-3 py-2 border border-neutral-l3 rounded text-sm bg-white">
                  <option>Single Family</option>
                  <option>Condo</option>
                  <option>Townhouse</option>
                  <option>Multi-Family</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-neutral-d1">Number of Units</label>
                <select className="w-full px-3 py-2 border border-neutral-l3 rounded text-sm bg-white">
                  <option>1 Unit</option>
                  <option>2 Units</option>
                  <option>3 Units</option>
                  <option>4 Units</option>
                </select>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-neutral-l3">
              <p className="text-xs text-neutral-l1">
                For more detailed loan configurations including VA funding fee options, subordinate financing, and property details, click the <strong>"Loan Details"</strong> button above.
              </p>
            </div>
          </AdvancedOptionsSection>

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
