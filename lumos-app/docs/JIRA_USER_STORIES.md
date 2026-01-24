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
- [ ] Estimated Credit Score - editable input field (next to Property Value)
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

### Header Section
- [ ] "Value Propositions" header with prominent styling
- [ ] **Escrows toggle** - switch to include/exclude escrows from calculations
- [ ] When escrows OFF: removes Taxes & Insurance from comparison AND Escrows from Cash at Closing

### Monthly Payment Comparison Table
- [ ] **Current Finances column** (orange-tinted header `#fef6f0`):
  - Principal & Interest (calculated from total payment minus escrows if enabled)
  - Subordinate Lien (e.g., HELOC, 2nd mortgage)
  - Taxes - **EDITABLE** input field (updates both columns)
  - Insurance - **EDITABLE** input field (updates both columns)
  - Mortgage Insurance
  - **Mortgage Total** row (highlighted)
  - Monthly Debts (Paid Off) - shown in red
  - Monthly Debts (NOT Paid)
  - **Total Monthly** row (bold, highlighted)

- [ ] **GoodLeap Opportunity column** (purple-tinted header `#f5f3ff`):
  - Same line items as Current Finances
  - Subordinate Lien shows "$0 ✓" (green, paid off)
  - Monthly Debts (Paid Off) shows "$0 ✓" (green, paid off)
  - Taxes/Insurance mirror values from Current (property-based)

- [ ] Taxes, Insurance, Mortgage Insurance rows **indented** for visual hierarchy
- [ ] All rows aligned with consistent `min-h-[48px]` and `items-center`

### Monthly Savings Banner
- [ ] Positioned below comparison table
- [ ] **Green** background with TrendingDown icon when savings > 0
- [ ] **Red** background with AlertTriangle icon when savings < 0
- [ ] Large font for savings amount

### Cash at Closing Section
- [ ] "Cash From/To Borrower" sub-header (green-tinted `#f0fdf4`)
- [ ] **Line items:**
  - Cashout Amount (from configuration)
  - Plus: Lender Credit (when credit selected, green text)
  - Less: Discount Points (when buy-down selected, red text)
  - **Estimated Loan Fees** - EDITABLE input field
  - **Estimated Escrows** - EDITABLE input field with note "(6 months prepaids)"
- [ ] Escrows row only visible when escrows toggle is ON
- [ ] **Final Cash TO/FROM Borrower** - calculated total (green if positive, red if negative)

### Inline Cash Goal Hint
- [ ] Below Cashout field in Configuration panel
- [ ] Shows: "To receive $X, loan needed: $Y"
- [ ] Calculates required loan = Cashout + Fees + Escrows + Discount Points

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
| Story 2: Value Propositions Panel | 21 |
| Story 3: Chart Highlights | 8 |
| **TOTAL** | **42** |
