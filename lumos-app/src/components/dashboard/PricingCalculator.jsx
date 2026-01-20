import React, { useState } from 'react';
import { CircleAlert, Pencil, Check, ChevronDown } from 'lucide-react';

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
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-[#0f172b] rounded px-2 py-1">Calculators</h2>
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
    </div>
  );
}
