# JIRA User Stories - Pricing Scenarios

## Epic: Pricing Scenarios Tool

---

## Story 1: Loan Configuration Panel

**As a** loan officer  
**I want to** configure all loan parameters in a single panel  
**So that** I can quickly model different pricing scenarios for my borrower

**Acceptance Criteria:**
- [ ] Program selection (Conventional, FHA, VA) with pill-style buttons
- [ ] Term selection (30, 20, 15, 10 years) with pill-style buttons
- [ ] Property Value - editable input field
- [ ] Occupancy selection (Primary, Second Home, Investment)
- [ ] Property Type selection (Single Family, Condo, Townhouse, Multi-Family)
- [ ] Number of Units selection (1-4)
- [ ] LTV slider (0-100%) with large percentage display
- [ ] Loan Amount - editable input field
- [ ] Debts to Pay Off - editable input field
- [ ] Cashout - editable input field
- [ ] "Calculate Value Propositions" button
- [ ] Rate Selection Cards showing all available rates, defaulting to par rate. Each card displays: Rate, Payment, Cost in BPS, Cost in Dollars
- [ ] Product Category dropdown (Refinance/Purchase)

---

## Story 2: Value Propositions Panel

**As a** loan officer  
**I want to** see a side-by-side comparison of current vs proposed payments with cash flow summary  
**So that** I can clearly present the financial benefits to my borrower

**Acceptance Criteria:**
- [ ] "Value Propositions" header with Escrows toggle
- [ ] **Current Finances column** (orange-tinted):
  - Principal & Interest, Subordinate Lien, Taxes, Insurance, Mortgage Insurance
  - Mortgage Total row
  - Monthly Debts (Paid Off), Monthly Debts (NOT Paid)
  - Total Monthly row
- [ ] **GoodLeap Opportunity column** (purple-tinted):
  - Same line items as Current Finances
  - Subordinate Lien shows "$0 ✓" 
  - Monthly Debts (Paid Off) shows "$0 ✓"
- [ ] Taxes, Insurance, Mortgage Insurance indented for visual hierarchy
- [ ] **Monthly Savings Banner** - green when positive, red when negative
- [ ] **Cash From/To Borrower section**:
  - Cashout Amount
  - Plus: Lender Credit (when applicable)
  - Less: Discount Points (when applicable)
  - Estimated Loan Fees - EDITABLE input
  - Estimated Escrows - EDITABLE input (only when escrows enabled)
  - Final Cash TO/FROM Borrower calculation
- [ ] Escrows toggle removes Taxes & Insurance from comparison and Escrows from cash calculation when OFF

---

## Story 3: Chart Highlights

**As a** loan officer  
**I want to** access visual charts from the pricing screen and left navigation  
**So that** I can present compelling data visualizations to my borrower

**Acceptance Criteria:**
- [ ] **Chart Highlights section** with 2x2 grid of cards:
  - Debt Consolidation (shows Total Paid Off value)
  - Payment Savings (shows Monthly savings value)
  - Cash Back (shows At Closing value)
  - Accelerated Payoff (shows Years Saved value)
- [ ] Clicking any card opens full chart view
- [ ] **Charts in Left Navigation** sidebar under "Charts" section
- [ ] **Accelerated Payoff chart** includes:
  - Editable extra payment input
  - Quick-select percentage buttons (25%, 50%, 75%, 100%)
  - Comparison table: "Proposed Loan" vs "Accelerated"
  - Years saved and Interest saved calculations
- [ ] "TEMPLATED DATA - FOR TESTING ONLY" banner when using test data

---

## Story Point Estimates

| Story | Points |
|-------|--------|
| Story 1: Loan Configuration Panel | 13 |
| Story 2: Value Propositions Panel | 13 |
| Story 3: Chart Highlights | 8 |
| **TOTAL** | **34** |
