import React from 'react';

// Property Reference Panel Component
function PropertyReferencePanel() {
  return (
    <div className="sticky top-20 bg-white border border-neutral-l3 rounded shadow-sm">
      <div className="p-4 border-b border-neutral-l3 bg-information-l3">
        <h3 className="text-h5 font-semibold text-neutral-d3">Address & Location</h3>
      </div>
      <div className="p-4 space-y-4">
        {/* Street Address */}
        <div className="flex items-start gap-3">
          <span className="text-sm text-information-d2 font-medium min-w-[100px]">Street Address:</span>
          <span className="text-sm font-semibold text-neutral-d3">2933 AVON RD</span>
        </div>
        <div className="flex items-start gap-3">
          <span className="text-sm text-information-d2 font-medium min-w-[100px]">Unit/Apt:</span>
          <span className="text-sm text-neutral-l1">—</span>
        </div>

        {/* City, State, Zip */}
        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-neutral-l4">
          <div>
            <span className="text-sm text-information-d2 font-medium block">City:</span>
            <span className="text-sm font-semibold text-neutral-d3">ROCKLIN</span>
          </div>
          <div>
            <span className="text-sm text-information-d2 font-medium block">State:</span>
            <span className="text-sm font-semibold text-neutral-d3">CA</span>
          </div>
        </div>
        <div>
          <span className="text-sm text-information-d2 font-medium block">ZIP Code:</span>
          <span className="text-sm font-semibold text-neutral-d3">95765-4939</span>
        </div>

        {/* County & APN */}
        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-neutral-l4">
          <div>
            <span className="text-sm text-information-d2 font-medium block">County:</span>
            <span className="text-sm font-semibold text-neutral-d3">PLACER</span>
          </div>
          <div>
            <span className="text-sm text-information-d2 font-medium block">APN:</span>
            <span className="text-sm font-semibold text-neutral-d3">366-050-028-000</span>
          </div>
        </div>

        {/* Owners */}
        <div className="pt-2 border-t border-neutral-l4">
          <span className="text-sm text-information-d2 font-medium block">Owners:</span>
          <span className="text-sm font-semibold text-neutral-d3">BRENNER RAFAEL M & MICHAL R TR</span>
        </div>

        {/* Ownership Rights */}
        <div>
          <span className="text-sm text-information-d2 font-medium block">Ownership Rights:</span>
          <span className="text-sm text-neutral-l1">—</span>
        </div>
      </div>
    </div>
  );
}

export function FigureView({ borrowerData }) {
  return (
    <div className="flex gap-6">
      {/* Main Form */}
      <form id="urla-form" className="flex-1 max-w-4xl">
        {/* Sticky Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-neutral-l3 px-4 py-3 mb-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-semibold">Loan Application</h2>
            </div>
            <div className="flex items-center gap-3">
              <button
                className="font-sans not-italic font-normal text-default py-1.5 px-4 min-w-fit w-fit h-fit flex items-center rounded-[4px] disabled:cursor-not-allowed text-white bg-secondary border border-secondary hover:bg-secondary-d1 hover:border-secondary-d1 active:bg-secondary-d2 active:border-secondary-d2 disabled:bg-neutral-l3 disabled:text-neutral-l1 disabled:border-neutral-l3 button-disabled"
                data-testid="send-to-figure-btn"
                disabled
                type="submit"
                style={{ minHeight: 'fit-content', minWidth: 'fit-content' }}
              >
                Submit to Figure
              </button>
            </div>
          </div>
        </div>

        <div className="px-4 space-y-6">
        {/* Borrower Information Section */}
        <div className="p-6 border border-neutral-l3 rounded bg-white" data-testid="borrower-info-section">
          <div className="mb-6 flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold">Borrower Information</h3>
              <p className="text-sm text-neutral-l1">Primary borrower details and contact information</p>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div data-testid="borrower-column">
              <div className="pb-2 mb-4 border-b border-neutral-l3">
                <span className="text-small font-semibold uppercase tracking-wide text-neutral-d1">Borrower</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2" data-testid="borrower-first-name-field">
                  <label className="text-sm font-medium leading-none" htmlFor="urla-form-borrowerFirstName">
                    First Name<span className="text-danger ml-0.5">*</span>
                  </label>
                  <div className="flex items-center w-full">
                    <div className="relative w-full">
                      <input
                        type="text"
                        className="flex h-10 w-full rounded-md border border-neutral-l3 bg-white px-3 py-2 text-default ring-offset-white placeholder:text-neutral-l1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-neutral-l3"
                        data-testid="borrower-first-name"
                        id="urla-form-borrowerFirstName"
                        name="borrowerFirstName"
                        form="urla-form"
                        defaultValue="Ken"
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-2" data-testid="borrower-middle-name-field">
                  <label className="text-sm font-medium leading-none" htmlFor="urla-form-borrowerMiddleName">
                    Middle Name
                  </label>
                  <div className="flex items-center w-full">
                    <div className="relative w-full">
                      <input
                        type="text"
                        className="flex h-10 w-full rounded-md border border-neutral-l3 bg-white px-3 py-2 text-default ring-offset-white placeholder:text-neutral-l1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-neutral-l3"
                        data-testid="borrower-middle-name"
                        id="urla-form-borrowerMiddleName"
                        name="borrowerMiddleName"
                        form="urla-form"
                        placeholder="Optional"
                        defaultValue=""
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-2" data-testid="borrower-last-name-field">
                  <label className="text-sm font-medium leading-none" htmlFor="urla-form-borrowerLastName">
                    Last Name<span className="text-danger ml-0.5">*</span>
                  </label>
                  <div className="flex items-center w-full">
                    <div className="relative w-full">
                      <input
                        type="text"
                        className="flex h-10 w-full rounded-md border border-neutral-l3 bg-white px-3 py-2 text-default ring-offset-white placeholder:text-neutral-l1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-neutral-l3"
                        data-testid="borrower-last-name"
                        id="urla-form-borrowerLastName"
                        name="borrowerLastName"
                        form="urla-form"
                        defaultValue="Customer"
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-2" data-testid="borrower-dob-field">
                  <label className="text-sm font-medium leading-none" htmlFor="urla-form-borrowerDateOfBirth">
                    Date of Birth<span className="text-danger ml-0.5">*</span>
                  </label>
                  <div className="relative">
                    <div className="flex items-center">
                      <div className="flex items-center w-full">
                        <div className="relative w-full">
                          <input
                            type="text"
                            className="flex h-10 w-full rounded-md border border-neutral-l3 bg-white px-3 py-2 text-default ring-offset-white placeholder:text-neutral-l1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-neutral-l3 pr-10"
                            placeholder="MM/DD/YYYY"
                            data-testid="borrower-dob"
                            maxLength="10"
                            defaultValue="01/01/1980"
                          />
                        </div>
                      </div>
                      <button
                        type="button"
                        className="absolute right-2 p-1 rounded hover:bg-neutral-l4"
                        data-testid="borrower-dob-calendar-btn"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-l1">
                          <path d="M8 2v4"></path>
                          <path d="M16 2v4"></path>
                          <rect width="18" height="18" x="3" y="4" rx="2"></rect>
                          <path d="M3 10h18"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="space-y-2" data-testid="borrower-ssn-field">
                  <label className="text-sm font-medium leading-none" htmlFor="urla-form-borrowerSsn">
                    SSN
                  </label>
                  <div className="relative">
                    <div className="flex items-center w-full">
                      <div className="relative w-full">
                        <input
                          type="text"
                          className="flex h-10 w-full rounded-md border border-neutral-l3 bg-white px-3 py-2 text-default ring-offset-white placeholder:text-neutral-l1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-neutral-l3 pr-10"
                          id="urla-form-borrowerSsn"
                          data-testid="borrower-ssn"
                          placeholder="###-##-####"
                          maxLength="11"
                          defaultValue="•••-••-7000"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-neutral-l4"
                      data-testid="borrower-ssn-toggle"
                      aria-label="Show value"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-l1">
                        <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="space-y-2" data-testid="borrower-email-field">
                  <label className="text-sm font-medium leading-none" htmlFor="urla-form-borrowerEmail">
                    Email<span className="text-danger ml-0.5">*</span>
                  </label>
                  <div className="relative">
                    <div className="flex items-center w-full">
                      <div className="relative w-full">
                        <input
                          type="email"
                          className="flex h-10 w-full rounded-md border border-neutral-l3 bg-white px-3 py-2 text-default ring-offset-white placeholder:text-neutral-l1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-neutral-l3"
                          id="urla-form-borrowerEmail"
                          data-testid="borrower-email"
                          placeholder="email@example.com"
                          defaultValue=""
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-2" data-testid="borrower-home-phone-field">
                  <label className="text-sm font-medium leading-none" htmlFor="urla-form-borrowerHomePhone">
                    Home Phone
                  </label>
                  <div className="relative">
                    <div className="flex items-center w-full">
                      <div className="relative w-full">
                        <input
                          type="tel"
                          className="flex h-10 w-full rounded-md border border-neutral-l3 bg-white px-3 py-2 text-default ring-offset-white placeholder:text-neutral-l1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-neutral-l3"
                          id="urla-form-borrowerHomePhone"
                          data-testid="borrower-home-phone"
                          placeholder="(###) ###-####"
                          maxLength="14"
                          defaultValue="555-555-5555"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-2" data-testid="borrower-cell-phone-field">
                  <label className="text-sm font-medium leading-none" htmlFor="urla-form-borrowerCellPhone">
                    Cell Phone<span className="text-danger ml-0.5">*</span>
                  </label>
                  <div className="relative">
                    <div className="flex items-center w-full">
                      <div className="relative w-full">
                        <input
                          type="tel"
                          className="flex h-10 w-full rounded-md border border-neutral-l3 bg-white px-3 py-2 text-default ring-offset-white placeholder:text-neutral-l1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-neutral-l3"
                          id="urla-form-borrowerCellPhone"
                          data-testid="borrower-cell-phone"
                          placeholder="(###) ###-####"
                          maxLength="14"
                          defaultValue=""
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Loan Details Section */}
        <div className="p-6 border border-neutral-l3 rounded bg-white" data-testid="loan-details-section">
          <div className="mb-6">
            <h3 className="text-lg font-semibold">Loan Details</h3>
            <p className="text-sm text-neutral-l1">Loan purpose and amount information</p>
          </div>
          <div className="space-y-4">
            <div className="space-y-2" data-testid="loan-amount-requested-field">
              <label className="text-sm font-medium leading-none" htmlFor="urla-form-loanAmountRequested">
                Loan Amount Requested<span className="text-danger ml-0.5">*</span>
              </label>
              <div className="relative">
                <div className="flex items-center w-full">
                  <div className="relative w-full">
                    <input
                      type="text"
                      className="flex h-10 w-full rounded-md border border-neutral-l3 bg-white px-3 py-2 text-default ring-offset-white placeholder:text-neutral-l1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-neutral-l3"
                      id="urla-form-loanAmountRequested"
                      data-testid="loan-amount-requested"
                      placeholder="$0"
                      defaultValue="222001"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Current Address Section */}
        <div className="p-6 border border-neutral-l3 rounded bg-white" data-testid="current-address-section">
          <div className="mb-6 flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold">Current Address</h3>
              <p className="text-sm text-neutral-l1">Present residence information</p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6">
            <div data-testid="borrower-address-column">
              <div className="pb-2 mb-4 border-b border-neutral-l3">
                <span className="text-small font-semibold uppercase tracking-wide text-neutral-d1">Borrower Address</span>
              </div>
              <div className="mb-4">
                <div className="space-y-2" data-testid="borrower-street-address-field">
                  <label className="text-sm font-medium leading-none" htmlFor="urla-form-borrowerStreetAddress">
                    Street Address<span className="text-danger ml-0.5">*</span>
                  </label>
                  <div className="flex items-center w-full">
                    <div className="relative w-full">
                      <input
                        type="text"
                        className="flex h-10 w-full rounded-md border border-neutral-l3 bg-white px-3 py-2 text-default ring-offset-white placeholder:text-neutral-l1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-neutral-l3"
                        data-testid="borrower-street-address"
                        id="urla-form-borrowerStreetAddress"
                        name="borrowerStreetAddress"
                        form="urla-form"
                        defaultValue="10655 Birch Streeting"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                <div className="space-y-2" data-testid="borrower-unit-field">
                  <label className="text-sm font-medium leading-none" htmlFor="urla-form-borrowerUnit">
                    Unit/Apt #
                  </label>
                  <div className="flex items-center w-full">
                    <div className="relative w-full">
                      <input
                        type="text"
                        className="flex h-10 w-full rounded-md border border-neutral-l3 bg-white px-3 py-2 text-default ring-offset-white placeholder:text-neutral-l1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-neutral-l3"
                        data-testid="borrower-unit"
                        id="urla-form-borrowerUnit"
                        name="borrowerUnit"
                        form="urla-form"
                        placeholder="Optional"
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-2" data-testid="borrower-city-field">
                  <label className="text-sm font-medium leading-none" htmlFor="urla-form-borrowerCity">
                    City<span className="text-danger ml-0.5">*</span>
                  </label>
                  <div className="flex items-center w-full">
                    <div className="relative w-full">
                      <input
                        type="text"
                        className="flex h-10 w-full rounded-md border border-neutral-l3 bg-white px-3 py-2 text-default ring-offset-white placeholder:text-neutral-l1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-neutral-l3"
                        data-testid="borrower-city"
                        id="urla-form-borrowerCity"
                        name="borrowerCity"
                        form="urla-form"
                        defaultValue="Burbank"
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-2" data-testid="borrower-state-field">
                  <label className="text-sm font-medium leading-none" htmlFor="urla-form-borrowerState">
                    State<span className="text-danger ml-0.5">*</span>
                  </label>
                  <div className="flex items-center w-full">
                    <div className="relative w-full">
                      <input
                        type="text"
                        className="flex h-10 w-full rounded-md border border-neutral-l3 bg-white px-3 py-2 text-default ring-offset-white placeholder:text-neutral-l1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-neutral-l3"
                        data-testid="borrower-state"
                        id="urla-form-borrowerState"
                        name="borrowerState"
                        form="urla-form"
                        defaultValue="CA"
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-2" data-testid="borrower-zip-code-field">
                  <label className="text-sm font-medium leading-none" htmlFor="urla-form-borrowerZipCode">
                    Zip Code<span className="text-danger ml-0.5">*</span>
                  </label>
                  <div className="flex items-center w-full">
                    <div className="relative w-full">
                      <input
                        type="text"
                        className="flex h-10 w-full rounded-md border border-neutral-l3 bg-white px-3 py-2 text-default ring-offset-white placeholder:text-neutral-l1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-neutral-l3"
                        data-testid="borrower-zip-code"
                        id="urla-form-borrowerZipCode"
                        name="borrowerZipCode"
                        form="urla-form"
                        defaultValue="91502"
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-2" data-testid="borrower-years-at-address-field">
                  <label className="text-sm font-medium leading-none" htmlFor="urla-form-borrowerYearsAtAddress">
                    Years
                  </label>
                  <div className="flex items-center w-full">
                    <div className="relative w-full">
                      <input
                        type="number"
                        className="flex h-10 w-full rounded-md border border-neutral-l3 bg-white px-3 py-2 text-default ring-offset-white placeholder:text-neutral-l1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-neutral-l3"
                        data-testid="borrower-years-at-address"
                        id="urla-form-borrowerYearsAtAddress"
                        name="borrowerYearsAtAddress"
                        form="urla-form"
                        defaultValue="10"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Employment & Income Section */}
        <div className="p-6 border border-neutral-l3 rounded bg-white" data-testid="employment-section">
          <div className="mb-6">
            <h3 className="text-lg font-semibold">Employment &amp; Income</h3>
            <p className="text-sm text-neutral-l1">Current employment and income details</p>
          </div>
          <div className="grid grid-cols-1 gap-6">
            <div data-testid="borrower-employment-column">
              <div className="pb-2 mb-4 border-b border-neutral-l3">
                <span className="text-small font-semibold uppercase tracking-wide text-neutral-d1">Borrower Employment</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="space-y-2" data-testid="borrower-employer-name-field">
                  <label className="text-sm font-medium leading-none" htmlFor="urla-form-borrowerEmployerName">
                    Employer
                  </label>
                  <div className="flex items-center w-full">
                    <div className="relative w-full">
                      <input
                        type="text"
                        className="flex h-10 w-full rounded-md border border-neutral-l3 bg-white px-3 py-2 text-default ring-offset-white placeholder:text-neutral-l1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-neutral-l3"
                        data-testid="borrower-employer-name"
                        id="urla-form-borrowerEmployerName"
                        name="borrowerEmployerName"
                        form="urla-form"
                        defaultValue="TESTCO"
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-2" data-testid="borrower-position-field">
                  <label className="text-sm font-medium leading-none" htmlFor="urla-form-borrowerPositionDescription">
                    Job Title
                  </label>
                  <div className="flex items-center w-full">
                    <div className="relative w-full">
                      <input
                        type="text"
                        className="flex h-10 w-full rounded-md border border-neutral-l3 bg-white px-3 py-2 text-default ring-offset-white placeholder:text-neutral-l1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-neutral-l3"
                        data-testid="borrower-position"
                        id="urla-form-borrowerPositionDescription"
                        name="borrowerPositionDescription"
                        form="urla-form"
                        defaultValue="QA Engineer"
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-2" data-testid="borrower-time-on-job-field">
                  <label className="text-sm font-medium leading-none" htmlFor="urla-form-borrowerTimeOnJobYears">
                    Years
                  </label>
                  <div className="flex items-center w-full">
                    <div className="relative w-full">
                      <input
                        type="number"
                        className="flex h-10 w-full rounded-md border border-neutral-l3 bg-white px-3 py-2 text-default ring-offset-white placeholder:text-neutral-l1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-neutral-l3"
                        data-testid="borrower-time-on-job"
                        id="urla-form-borrowerTimeOnJobYears"
                        name="borrowerTimeOnJobYears"
                        form="urla-form"
                        defaultValue="10"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="mb-4">
                <div className="space-y-2" data-testid="borrower-employment-type-field">
                  <label className="text-sm font-medium leading-none" htmlFor="urla-form-borrowerEmploymentType">
                    Employment Type<span className="text-danger ml-0.5">*</span>
                  </label>
                  <div>
                    <div className="grid gap-2" data-testid="borrower-employment-type" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
                      <button
                        type="button"
                        data-testid="borrower-employment-type-self_employed"
                        className="py-2 px-4 text-sm font-medium rounded border transition-colors bg-white text-neutral-d1 border-neutral-l3 hover:bg-neutral-l4"
                      >
                        Self Employed
                      </button>
                      <button
                        type="button"
                        data-testid="borrower-employment-type-full_time"
                        className="py-2 px-4 text-sm font-medium rounded border transition-colors bg-white text-neutral-d1 border-neutral-l3 hover:bg-neutral-l4"
                      >
                        Full Time
                      </button>
                      <button
                        type="button"
                        data-testid="borrower-employment-type-part_time"
                        className="py-2 px-4 text-sm font-medium rounded border transition-colors bg-white text-neutral-d1 border-neutral-l3 hover:bg-neutral-l4"
                      >
                        Part Time
                      </button>
                      <button
                        type="button"
                        data-testid="borrower-employment-type-other"
                        className="py-2 px-4 text-sm font-medium rounded border transition-colors bg-white text-neutral-d1 border-neutral-l3 hover:bg-neutral-l4"
                      >
                        Other
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2" data-testid="borrower-annual-income-field">
                  <label className="text-sm font-medium leading-none" htmlFor="urla-form-borrowerAnnualIncome">
                    Annual Income<span className="text-danger ml-0.5">*</span>
                  </label>
                  <div className="relative">
                    <div className="flex items-center w-full">
                      <div className="relative w-full">
                        <input
                          type="text"
                          className="flex h-10 w-full rounded-md border border-neutral-l3 bg-white px-3 py-2 text-default ring-offset-white placeholder:text-neutral-l1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-neutral-l3"
                          id="urla-form-borrowerAnnualIncome"
                          data-testid="borrower-annual-income"
                          placeholder="$0.00"
                          defaultValue="180000"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Subject Property Section */}
        <div className="p-6 border border-neutral-l3 rounded bg-white" data-testid="subject-property-section">
          <div className="mb-6">
            <h3 className="text-lg font-semibold">Subject Property</h3>
            <p className="text-sm text-neutral-l1">Property address and details</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <div className="space-y-2" data-testid="property-street-address-field">
                <label className="text-sm font-medium leading-none" htmlFor="urla-form-propertyStreetAddress">
                  Street Address<span className="text-danger ml-0.5">*</span>
                </label>
                <div className="flex items-center w-full">
                  <div className="relative w-full">
                    <input
                      type="text"
                      className="flex h-10 w-full rounded-md border border-neutral-l3 bg-white px-3 py-2 text-default ring-offset-white placeholder:text-neutral-l1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-neutral-l3"
                      data-testid="property-street-address"
                      id="urla-form-propertyStreetAddress"
                      name="propertyStreetAddress"
                      form="urla-form"
                      defaultValue="2933 AVON RD"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 md:col-span-2">
              <div className="space-y-2" data-testid="property-city-field">
                <label className="text-sm font-medium leading-none" htmlFor="urla-form-propertyCity">
                  City<span className="text-danger ml-0.5">*</span>
                </label>
                <div className="flex items-center w-full">
                  <div className="relative w-full">
                    <input
                      type="text"
                      className="flex h-10 w-full rounded-md border border-neutral-l3 bg-white px-3 py-2 text-default ring-offset-white placeholder:text-neutral-l1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-neutral-l3"
                      data-testid="property-city"
                      id="urla-form-propertyCity"
                      name="propertyCity"
                      form="urla-form"
                      defaultValue="ROCKLIN"
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-2" data-testid="property-state-field">
                <label className="text-sm font-medium leading-none" htmlFor="urla-form-propertyState">
                  State<span className="text-danger ml-0.5">*</span>
                </label>
                <div className="flex items-center w-full">
                  <div className="relative w-full">
                    <input
                      type="text"
                      className="flex h-10 w-full rounded-md border border-neutral-l3 bg-white px-3 py-2 text-default ring-offset-white placeholder:text-neutral-l1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-neutral-l3"
                      data-testid="property-state"
                      id="urla-form-propertyState"
                      name="propertyState"
                      form="urla-form"
                      defaultValue="CA"
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-2" data-testid="property-zip-field">
                <label className="text-sm font-medium leading-none" htmlFor="urla-form-propertyZip">
                  Zip Code<span className="text-danger ml-0.5">*</span>
                </label>
                <div className="flex items-center w-full">
                  <div className="relative w-full">
                    <input
                      type="text"
                      className="flex h-10 w-full rounded-md border border-neutral-l3 bg-white px-3 py-2 text-default ring-offset-white placeholder:text-neutral-l1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-neutral-l3"
                      data-testid="property-zip"
                      id="urla-form-propertyZip"
                      name="propertyZip"
                      form="urla-form"
                      defaultValue="95765"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="md:col-span-2">
              <div className="space-y-2" data-testid="property-occupancy-field">
                <label className="text-sm font-medium leading-none" htmlFor="urla-form-propertyOccupancy">
                  Occupancy<span className="text-danger ml-0.5">*</span>
                </label>
                <div>
                  <div className="grid gap-2" data-testid="property-occupancy" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                    <button
                      type="button"
                      data-testid="property-occupancy-primaryresidence"
                      className="py-2 px-4 text-sm font-medium rounded border transition-colors bg-secondary text-white border-secondary"
                    >
                      Primary
                    </button>
                    <button
                      type="button"
                      data-testid="property-occupancy-secondhome"
                      className="py-2 px-4 text-sm font-medium rounded border transition-colors bg-white text-neutral-d1 border-neutral-l3 hover:bg-neutral-l4"
                    >
                      Secondary
                    </button>
                    <button
                      type="button"
                      data-testid="property-occupancy-investor"
                      className="py-2 px-4 text-sm font-medium rounded border transition-colors bg-white text-neutral-d1 border-neutral-l3 hover:bg-neutral-l4"
                    >
                      Investment
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-2" data-testid="borrower-estimated-value-field">
              <label className="text-sm font-medium leading-none" htmlFor="urla-form-borrowerEstimatedValue">
                Property Value (AVM)
              </label>
              <div className="relative">
                <div className="flex items-center w-full">
                  <div className="relative w-full">
                    <input
                      type="text"
                      className="flex h-10 w-full rounded-md border border-neutral-l3 bg-white px-3 py-2 text-default ring-offset-white placeholder:text-neutral-l1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-neutral-l3"
                      id="urla-form-borrowerEstimatedValue"
                      data-testid="borrower-estimated-value"
                      placeholder="$0"
                      defaultValue="840000"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Existing Liens Section */}
        <div className="p-6 border border-neutral-l3 rounded bg-white" data-testid="existing-liens-section">
          <div className="mb-6">
            <h3 className="text-lg font-semibold">Existing Liens</h3>
            <p className="text-sm text-neutral-l1">Information about existing liens on the property</p>
          </div>
          <div className="grid grid-cols-5 gap-4">
            <div className="space-y-2" data-testid="lien-lender-name-field">
              <label className="text-sm font-medium leading-none" htmlFor="urla-form-lienLenderName">
                Lender Name
              </label>
              <div className="flex items-center w-full">
                <div className="relative w-full">
                  <input
                    type="text"
                    className="flex h-10 w-full rounded-md border border-neutral-l3 bg-white px-3 py-2 text-default ring-offset-white placeholder:text-neutral-l1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-neutral-l3"
                    data-testid="lien-lender-name"
                    id="urla-form-lienLenderName"
                    name="lienLenderName"
                    form="urla-form"
                    defaultValue="AMERICAN PACIFIC MORTGAGE CORP"
                  />
                </div>
              </div>
            </div>
            <div className="space-y-2" data-testid="lien-origination-date-field">
              <label className="text-sm font-medium leading-none" htmlFor="urla-form-lienOriginationDate">
                Origination Date<span className="text-danger ml-0.5">*</span>
              </label>
              <div className="relative">
                <div className="flex items-center">
                  <div className="flex items-center w-full">
                    <div className="relative w-full">
                      <input
                        type="text"
                        className="flex h-10 w-full rounded-md border border-neutral-l3 bg-white px-3 py-2 text-default ring-offset-white placeholder:text-neutral-l1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-neutral-l3 pr-10"
                        placeholder="MM/DD/YYYY"
                        data-testid="lien-origination-date"
                        maxLength="10"
                        defaultValue="02/08/2021"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    className="absolute right-2 p-1 rounded hover:bg-neutral-l4"
                    data-testid="lien-origination-date-calendar-btn"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-l1">
                      <path d="M8 2v4"></path>
                      <path d="M16 2v4"></path>
                      <rect width="18" height="18" x="3" y="4" rx="2"></rect>
                      <path d="M3 10h18"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            <div className="space-y-2" data-testid="lien-original-balance-field">
              <label className="text-sm font-medium leading-none" htmlFor="urla-form-lienOriginalBalance">
                Original Balance<span className="text-danger ml-0.5">*</span>
              </label>
              <div className="relative">
                <div className="flex items-center w-full">
                  <div className="relative w-full">
                    <input
                      type="text"
                      className="flex h-10 w-full rounded-md border border-neutral-l3 bg-white px-3 py-2 text-default ring-offset-white placeholder:text-neutral-l1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-neutral-l3"
                      id="urla-form-lienOriginalBalance"
                      data-testid="lien-original-balance"
                      placeholder="$0.00"
                      defaultValue="165000"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-2" data-testid="lien-current-balance-field">
              <label className="text-sm font-medium leading-none" htmlFor="urla-form-lienCurrentBalance">
                Current Balance
              </label>
              <div className="relative">
                <div className="flex items-center w-full">
                  <div className="relative w-full">
                    <input
                      type="text"
                      className="flex h-10 w-full rounded-md border border-neutral-l3 bg-white px-3 py-2 text-default ring-offset-white placeholder:text-neutral-l1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-neutral-l3"
                      id="urla-form-lienCurrentBalance"
                      data-testid="lien-current-balance"
                      placeholder="$0.00"
                      defaultValue=""
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-2" data-testid="lien-monthly-payment-field">
              <label className="text-sm font-medium leading-none" htmlFor="urla-form-lienMonthlyPayment">
                Monthly Payment
              </label>
              <div className="relative">
                <div className="flex items-center w-full">
                  <div className="relative w-full">
                    <input
                      type="text"
                      className="flex h-10 w-full rounded-md border border-neutral-l3 bg-white px-3 py-2 text-default ring-offset-white placeholder:text-neutral-l1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-neutral-l3"
                      id="urla-form-lienMonthlyPayment"
                      data-testid="lien-monthly-payment"
                      placeholder="$0.00"
                      defaultValue=""
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>

      {/* Property Reference Panel - Right Side */}
      <div className="w-80 flex-shrink-0">
        <PropertyReferencePanel />
      </div>
    </div>
  );
}
