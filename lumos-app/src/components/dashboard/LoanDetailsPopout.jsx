import React, { useState } from 'react';
import { Pencil, X, Save } from 'lucide-react';

export function LoanDetailsPopout() {
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

  const handleApplyToMain = () => {
    // Send data back to main window
    if (window.opener) {
      window.opener.postMessage({
        type: 'LOAN_DETAILS_UPDATE',
        data: {
          loanType,
          baseLoanAmount,
          totalLoanAmount,
          loanPurpose,
          appraisedValue,
          fico,
          dti,
          occupancy,
          propertyType,
          numberOfUnits
        }
      }, '*');
    }
    alert('Changes applied to main window!');
  };

  return (
    <div className="min-h-screen bg-neutral-l5">
      {/* Header */}
      <div className="sticky top-0 bg-[#432c9e] text-white px-6 py-4 shadow-lg z-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Loan Details</h1>
            <p className="text-sm text-white/80">Complete loan configuration panel</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleApplyToMain}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-white text-[#432c9e] rounded-lg hover:bg-neutral-l4 transition-colors"
            >
              <Save className="w-4 h-4" />
              Apply to Main
            </button>
            <button
              onClick={() => window.close()}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
            >
              <X className="w-4 h-4" />
              Close
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6 max-w-4xl mx-auto">
        {/* Loan Information Section */}
        <div className="bg-white rounded-lg shadow-sm border border-neutral-l3 overflow-hidden">
          <div className="bg-[#c9a227] px-4 py-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wide">
              Loan Information
            </h3>
          </div>
          <div className="p-4 space-y-4">
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
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-neutral-l3">
              <div className="text-center p-3 bg-neutral-l5 rounded">
                <div className="text-xs text-neutral-l1 uppercase">LTV</div>
                <div className="text-2xl font-bold text-[#0f172b]">33.75%</div>
              </div>
              <div className="text-center p-3 bg-neutral-l5 rounded">
                <div className="text-xs text-neutral-l1 uppercase">CLTV</div>
                <div className="text-2xl font-bold text-[#0f172b]">33.75%</div>
              </div>
              <div className="text-center p-3 bg-neutral-l5 rounded">
                <div className="text-xs text-neutral-l1 uppercase">HCLTV</div>
                <div className="text-2xl font-bold text-[#0f172b]">33.75%</div>
              </div>
            </div>
          </div>
        </div>

        {/* Borrower Information Section */}
        <div className="bg-white rounded-lg shadow-sm border border-neutral-l3 overflow-hidden">
          <div className="bg-[#c9a227] px-4 py-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wide">
              Borrower Information
            </h3>
          </div>
          <div className="p-4 space-y-4">
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
        </div>

        {/* Property Information Section */}
        <div className="bg-white rounded-lg shadow-sm border border-neutral-l3 overflow-hidden">
          <div className="bg-[#2563eb] px-4 py-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wide">
              Property Information
            </h3>
          </div>
          <div className="p-4 space-y-4">
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
                  className="w-full px-3 py-2 border border-neutral-l3 rounded text-sm bg-white"
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
                  className="w-full px-3 py-2 border border-neutral-l3 rounded text-sm"
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

        {/* Product Filters Section */}
        <div className="bg-white rounded-lg shadow-sm border border-neutral-l3 overflow-hidden">
          <div className="bg-neutral-d1 px-4 py-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wide">
              Product Filters
            </h3>
          </div>
          <div className="p-4">
            <p className="text-sm text-neutral-l1">Additional product filtering options can be configured here.</p>
          </div>
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
    </div>
  );
}
