import React, { useState, useEffect } from 'react';
import { CircleAlert, Pencil, Check, ChevronDown, ChevronRight, X, Settings2, SlidersHorizontal, ExternalLink, Maximize2 } from 'lucide-react';

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

  const programs = ['Conventional', 'FHA', 'VA', 'FHA Streamline', 'VA IRRRL'];
  const terms = [30, 20, 15, 10];

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

        {/* Three Column Grid - Present, Proposed, Value Props */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Present Mortgage Card */}
          <div className="flex flex-col p-4 bg-[#fff8f2] border border-[#f2d4ba] rounded">
            <h3 className="font-bold text-sm text-[#0f172b] mb-3">Present Mortgage</h3>
            <div className="flex flex-col flex-1">
              <div className="flex justify-between items-center py-1">
                <span className="text-sm text-[#45556c]">Mortgage</span>
                <span className="text-sm text-[#45556c]">${presentMortgage}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-sm text-[#45556c]">Escrows?</span>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setEscrowsEnabled(!escrowsEnabled)}
                    className={`relative w-8 h-5 rounded-full transition-colors ${escrowsEnabled ? 'bg-[#432c9e]' : 'bg-gray-300'}`}
                  >
                    <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${escrowsEnabled ? 'left-3.5' : 'left-0.5'}`}></span>
                  </button>
                  <span className="text-sm text-[#323232]">{escrowsEnabled ? 'Yes' : 'No'}</span>
                </div>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-sm text-[#45556c]">Debts</span>
                <span className="text-sm text-[#45556c]">{formatCurrency(totalDebts)}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-sm text-[#45556c]">Debt Payoff Total</span>
                <span className="text-sm text-[#45556c]">{formatCurrency(totalDebts)}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-sm text-[#45556c]">Remaining Debt</span>
                <span className="text-sm text-[#45556c]">$0</span>
              </div>
            </div>
            <div className="border-t border-[#f2d4ba] pt-2 mt-2">
              <div className="flex justify-between items-center py-1">
                <span className="text-sm text-[#45556c]">Current Payment</span>
                <span className="text-sm text-[#45556c] font-semibold">{formatCurrency(currentPayment)}</span>
              </div>
            </div>
          </div>

          {/* Proposed Mortgage Card */}
          <div className="flex flex-col p-4 bg-[#ededfe] border border-[#dbdbfc] rounded">
            <h3 className="font-bold text-sm text-[#0f172b] mb-3">Proposed Mortgage</h3>
            <div className="flex flex-col flex-1">
              <div className="flex justify-between items-center py-1">
                <span className="text-sm text-[#45556c]">Mortgage</span>
                <span className="text-sm text-[#45556c]">${proposedMortgage}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-sm text-[#45556c]">Taxes</span>
                <div className="flex items-center gap-1.5">
                  <button className="text-[#432c9e] hover:text-[#200f51] p-0.5" aria-label="Edit Taxes">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-sm text-[#45556c] min-w-12 text-right">${taxes}</span>
                </div>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-sm text-[#45556c]">Insurance</span>
                <div className="flex items-center gap-1.5">
                  <button className="text-[#432c9e] hover:text-[#200f51] p-0.5" aria-label="Edit Insurance">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-sm text-[#45556c] min-w-12 text-right">${insurance}</span>
                </div>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-sm text-[#45556c]">Discount</span>
                <span className="text-sm text-[#45556c]">${discount}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-sm text-[#45556c]">Mortgage Insurance</span>
                <span className="text-sm text-[#45556c]">${mortgageInsurance}</span>
              </div>
            </div>
            <div className="border-t border-[#dbdbfc] pt-2 mt-2">
              <div className="flex justify-between items-center py-1">
                <span className="text-sm text-[#45556c]">New Payment</span>
                <span className="text-sm text-[#45556c] font-semibold">${newPayment}</span>
              </div>
            </div>
          </div>

          {/* Value Propositions Card */}
          <div className="flex flex-col p-4 bg-[#edf6f2] border border-[#cfe7db] rounded">
            <h3 className="font-bold text-sm text-[#0f172b] mb-3">Value Propositions</h3>
            <div className="flex flex-col flex-1">
              <div className="flex justify-between items-center py-1">
                <span className="text-sm text-[#45556c]">Monthly Savings</span>
                <span className="text-sm text-[#45556c] font-semibold">{formatCurrency(monthlySavings)}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-sm text-[#45556c]">Annual Savings</span>
                <span className="text-sm text-[#45556c] font-semibold">{formatCurrency(annualSavings)}</span>
              </div>
              <div className="my-2"></div>
              <div className="flex justify-between items-center py-1">
                <span className="text-sm font-semibold text-[#45556c]">Extra Payment</span>
                <div className="flex items-center gap-1.5">
                  <button className="text-[#2e7d32] hover:text-[#1b5e20] p-0.5" aria-label="Edit Extra Payment">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-sm font-semibold text-[#45556c] min-w-12 text-right">${extraPayment}</span>
                </div>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-sm text-[#45556c]">Years Saved</span>
                <span className="text-sm text-[#45556c] font-semibold">{yearsSaved}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-sm text-[#45556c]">Interest Saved</span>
                <span className="text-sm text-[#45556c] font-semibold">${interestSaved}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-sm text-[#45556c]">Est. Cash Back</span>
                <span className="text-sm text-[#45556c] font-semibold">${estCashBack}</span>
              </div>
            </div>
          </div>
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
