import React, { useState } from 'react';

export function Short1003View({ borrowerData }) {
  const [maritalStatus, setMaritalStatus] = useState('unmarried');
  const [housingStatus, setHousingStatus] = useState('own');
  const [occupancy, setOccupancy] = useState('primary');

  return (
    <div className="max-w-6xl">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-neutral-l3 px-4 py-3 mb-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold">Loan Application</h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              className="font-sans text-default py-1.5 px-4 flex items-center rounded-[4px] bg-secondary text-white border-none hover:bg-secondary-d1"
              type="submit"
            >
              Save to Encompass
            </button>
            <button
              className="font-sans text-default py-1.5 px-4 flex items-center rounded-[4px] bg-neutral-l1 text-white border-none hover:bg-neutral"
              type="button"
            >
              Order Credit
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 space-y-6">
        {/* Borrower Information Section */}
        <div className="p-6 border border-neutral-l3 rounded bg-white">
          <div className="mb-6 flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold">Borrower Information</h3>
              <p className="text-sm text-neutral-l1">Primary borrower details and contact information</p>
            </div>
            <button
              type="button"
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-neutral-d2 bg-neutral-l4 hover:bg-neutral-l3 border border-neutral-l2 rounded transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <line x1="19" x2="19" y1="8" y2="14"></line>
                <line x1="22" x2="16" y1="11" y2="11"></line>
              </svg>
              Add Co-Borrower
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <div className="pb-2 mb-4 border-b border-neutral-l3">
                <span className="text-small font-semibold uppercase tracking-wide text-neutral-d1">Borrower</span>
              </div>

              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none">
                    First Name<span className="text-danger ml-0.5">*</span>
                  </label>
                  <input
                    type="text"
                    className="flex h-10 w-full rounded-md border border-neutral-l3 bg-white px-3 py-2 text-default focus:outline-none focus:ring-2 focus:ring-primary"
                    defaultValue="Ken"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none">Middle Name</label>
                  <input
                    type="text"
                    className="flex h-10 w-full rounded-md border border-neutral-l3 bg-white px-3 py-2 text-default focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Optional"
                    defaultValue="tonyTestMiddle"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none">
                    Last Name<span className="text-danger ml-0.5">*</span>
                  </label>
                  <input
                    type="text"
                    className="flex h-10 w-full rounded-md border border-neutral-l3 bg-white px-3 py-2 text-default focus:outline-none focus:ring-2 focus:ring-primary"
                    defaultValue="Customer"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none">
                    Date of Birth<span className="text-danger ml-0.5">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      className="flex h-10 w-full rounded-md border border-neutral-l3 bg-white px-3 py-2 pr-10 text-default focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="MM/DD/YYYY"
                      defaultValue="01/01/1980"
                    />
                    <button type="button" className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-neutral-l4">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-l1">
                        <path d="M8 2v4"></path>
                        <path d="M16 2v4"></path>
                        <rect width="18" height="18" x="3" y="4" rx="2"></rect>
                        <path d="M3 10h18"></path>
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none">
                    SSN<span className="text-danger ml-0.5">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      className="flex h-10 w-full rounded-md border border-neutral-l3 bg-white px-3 py-2 pr-10 text-default focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="###-##-####"
                      defaultValue="•••-••-7000"
                    />
                    <button type="button" className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-neutral-l4">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-l1">
                        <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Contact Fields */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none">Email</label>
                  <input
                    type="email"
                    className="flex h-10 w-full rounded-md border border-neutral-l3 bg-white px-3 py-2 text-default focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="email@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none">Home Phone</label>
                  <input
                    type="tel"
                    className="flex h-10 w-full rounded-md border border-neutral-l3 bg-white px-3 py-2 text-default focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="(###) ###-####"
                    defaultValue="555-555-5555"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none">Cell Phone</label>
                  <input
                    type="tel"
                    className="flex h-10 w-full rounded-md border border-neutral-l3 bg-white px-3 py-2 text-default focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="(###) ###-####"
                  />
                </div>
              </div>

              {/* Marital Status */}
              <div className="mt-4 space-y-2">
                <label className="text-sm font-medium leading-none">Marital Status</label>
                <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                  <button
                    type="button"
                    onClick={() => setMaritalStatus('married')}
                    className={`py-2 px-4 text-sm font-medium rounded border transition-colors ${
                      maritalStatus === 'married'
                        ? 'bg-secondary text-white border-secondary'
                        : 'bg-white text-neutral-d1 border-neutral-l3 hover:bg-neutral-l4'
                    }`}
                  >
                    Married
                  </button>
                  <button
                    type="button"
                    onClick={() => setMaritalStatus('unmarried')}
                    className={`py-2 px-4 text-sm font-medium rounded border transition-colors ${
                      maritalStatus === 'unmarried'
                        ? 'bg-secondary text-white border-secondary'
                        : 'bg-white text-neutral-d1 border-neutral-l3 hover:bg-neutral-l4'
                    }`}
                  >
                    Unmarried
                  </button>
                  <button
                    type="button"
                    onClick={() => setMaritalStatus('separated')}
                    className={`py-2 px-4 text-sm font-medium rounded border transition-colors ${
                      maritalStatus === 'separated'
                        ? 'bg-secondary text-white border-secondary'
                        : 'bg-white text-neutral-d1 border-neutral-l3 hover:bg-neutral-l4'
                    }`}
                  >
                    Separated
                  </button>
                </div>
              </div>

              <button type="button" className="mt-4 text-sm text-secondary flex items-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m6 9 6 6 6-6"></path>
                </svg>
                Show additional fields
              </button>
            </div>
          </div>
        </div>

        {/* Current Address Section */}
        <div className="p-6 border border-neutral-l3 rounded bg-white">
          <div className="mb-6 flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold">Current Address</h3>
              <p className="text-sm text-neutral-l1">Present residence information</p>
            </div>
            <button
              type="button"
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-neutral-d2 bg-neutral-l4 hover:bg-neutral-l3 border border-neutral-l2 rounded transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
                <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
              </svg>
              Same as Subject Property
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div>
              <div className="pb-2 mb-4 border-b border-neutral-l3">
                <span className="text-small font-semibold uppercase tracking-wide text-neutral-d1">Borrower Address</span>
              </div>

              <div className="mb-4 space-y-2">
                <label className="text-sm font-medium leading-none">
                  Street Address<span className="text-danger ml-0.5">*</span>
                </label>
                <input
                  type="text"
                  className="flex h-10 w-full rounded-md border border-neutral-l3 bg-white px-3 py-2 text-default focus:outline-none focus:ring-2 focus:ring-primary"
                  defaultValue="10655 Birch Streeting"
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none">Unit/Apt #</label>
                  <input
                    type="text"
                    className="flex h-10 w-full rounded-md border border-neutral-l3 bg-white px-3 py-2 text-default focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Optional"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none">
                    City<span className="text-danger ml-0.5">*</span>
                  </label>
                  <input
                    type="text"
                    className="flex h-10 w-full rounded-md border border-neutral-l3 bg-white px-3 py-2 text-default focus:outline-none focus:ring-2 focus:ring-primary"
                    defaultValue="Burbank"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none">
                    State<span className="text-danger ml-0.5">*</span>
                  </label>
                  <input
                    type="text"
                    className="flex h-10 w-full rounded-md border border-neutral-l3 bg-white px-3 py-2 text-default focus:outline-none focus:ring-2 focus:ring-primary"
                    defaultValue="CA"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none">
                    Zip Code<span className="text-danger ml-0.5">*</span>
                  </label>
                  <input
                    type="text"
                    className="flex h-10 w-full rounded-md border border-neutral-l3 bg-white px-3 py-2 text-default focus:outline-none focus:ring-2 focus:ring-primary"
                    defaultValue="91502"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none">Years</label>
                  <input
                    type="number"
                    className="flex h-10 w-full rounded-md border border-neutral-l3 bg-white px-3 py-2 text-default focus:outline-none focus:ring-2 focus:ring-primary"
                    defaultValue="10"
                  />
                </div>
              </div>

              {/* Housing Status */}
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">Housing Status</label>
                <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                  <button
                    type="button"
                    onClick={() => setHousingStatus('own')}
                    className={`py-2 px-4 text-sm font-medium rounded border transition-colors ${
                      housingStatus === 'own'
                        ? 'bg-secondary text-white border-secondary'
                        : 'bg-white text-neutral-d1 border-neutral-l3 hover:bg-neutral-l4'
                    }`}
                  >
                    Own
                  </button>
                  <button
                    type="button"
                    onClick={() => setHousingStatus('rent')}
                    className={`py-2 px-4 text-sm font-medium rounded border transition-colors ${
                      housingStatus === 'rent'
                        ? 'bg-secondary text-white border-secondary'
                        : 'bg-white text-neutral-d1 border-neutral-l3 hover:bg-neutral-l4'
                    }`}
                  >
                    Rent
                  </button>
                  <button
                    type="button"
                    onClick={() => setHousingStatus('rentfree')}
                    className={`py-2 px-4 text-sm font-medium rounded border transition-colors ${
                      housingStatus === 'rentfree'
                        ? 'bg-secondary text-white border-secondary'
                        : 'bg-white text-neutral-d1 border-neutral-l3 hover:bg-neutral-l4'
                    }`}
                  >
                    Living Rent Free
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Subject Property Section */}
        <div className="p-6 border border-neutral-l3 rounded bg-white">
          <div className="mb-6">
            <h3 className="text-lg font-semibold">Subject Property</h3>
            <p className="text-sm text-neutral-l1">Property address and details</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-medium leading-none">
                Street Address<span className="text-danger ml-0.5">*</span>
              </label>
              <input
                type="text"
                className="flex h-10 w-full rounded-md border border-neutral-l3 bg-white px-3 py-2 text-default focus:outline-none focus:ring-2 focus:ring-primary"
                defaultValue="2933 AVON RD"
              />
            </div>

            <div className="grid grid-cols-3 gap-4 md:col-span-2">
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">
                  City<span className="text-danger ml-0.5">*</span>
                </label>
                <input
                  type="text"
                  className="flex h-10 w-full rounded-md border border-neutral-l3 bg-white px-3 py-2 text-default focus:outline-none focus:ring-2 focus:ring-primary"
                  defaultValue="ROCKLIN"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">
                  State<span className="text-danger ml-0.5">*</span>
                </label>
                <input
                  type="text"
                  className="flex h-10 w-full rounded-md border border-neutral-l3 bg-white px-3 py-2 text-default focus:outline-none focus:ring-2 focus:ring-primary"
                  defaultValue="CA"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">
                  Zip Code<span className="text-danger ml-0.5">*</span>
                </label>
                <input
                  type="text"
                  className="flex h-10 w-full rounded-md border border-neutral-l3 bg-white px-3 py-2 text-default focus:outline-none focus:ring-2 focus:ring-primary"
                  defaultValue="95765"
                />
              </div>
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-medium leading-none">
                Property Type<span className="text-danger ml-0.5">*</span>
              </label>
              <select className="flex h-10 w-full rounded-md border border-neutral-l3 bg-white px-3 py-2 text-default focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="sfr1-attached">SFR 1 Unit - Attached</option>
                <option value="sfr1-detached" selected>SFR 1 Unit - Detached</option>
                <option value="2-attached">2 Units - Attached</option>
                <option value="2-detached">2 Units - Detached</option>
                <option value="3-attached">3 Units - Attached</option>
                <option value="3-detached">3 Units - Detached</option>
                <option value="4-attached">4 Units - Attached</option>
                <option value="4-detached">4 Units - Detached</option>
                <option value="pud-1-attached">PUD - 1 Unit - Attached</option>
                <option value="pud-1-detached">PUD - 1 Unit - Detached</option>
                <option value="condo-attached">Condominium - Attached</option>
                <option value="condo-detached">Condominium - Detached</option>
                <option value="manufactured">Manufactured</option>
              </select>
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-medium leading-none">
                Occupancy<span className="text-danger ml-0.5">*</span>
              </label>
              <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                <button
                  type="button"
                  onClick={() => setOccupancy('primary')}
                  className={`py-2 px-4 text-sm font-medium rounded border transition-colors ${
                    occupancy === 'primary'
                      ? 'bg-secondary text-white border-secondary'
                      : 'bg-white text-neutral-d1 border-neutral-l3 hover:bg-neutral-l4'
                  }`}
                >
                  Primary
                </button>
                <button
                  type="button"
                  onClick={() => setOccupancy('secondary')}
                  className={`py-2 px-4 text-sm font-medium rounded border transition-colors ${
                    occupancy === 'secondary'
                      ? 'bg-secondary text-white border-secondary'
                      : 'bg-white text-neutral-d1 border-neutral-l3 hover:bg-neutral-l4'
                  }`}
                >
                  Secondary
                </button>
                <button
                  type="button"
                  onClick={() => setOccupancy('investment')}
                  className={`py-2 px-4 text-sm font-medium rounded border transition-colors ${
                    occupancy === 'investment'
                      ? 'bg-secondary text-white border-secondary'
                      : 'bg-white text-neutral-d1 border-neutral-l3 hover:bg-neutral-l4'
                  }`}
                >
                  Investment
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">
                Appraised Value<span className="text-danger ml-0.5">*</span>
              </label>
              <input
                type="text"
                className="flex h-10 w-full rounded-md border border-neutral-l3 bg-white px-3 py-2 text-default focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="$0"
                defaultValue="300000"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
