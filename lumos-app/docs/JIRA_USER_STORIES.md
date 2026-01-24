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

### Chart Access Points
- [ ] **Chart Highlights section** on Pricing Scenarios page (2x2 grid of cards)
- [ ] **Charts in Left Navigation** sidebar under "Charts" section
- [ ] Clicking any card opens full chart view in right panel
- [ ] "TEMPLATED DATA - FOR TESTING ONLY" banner when using test data

### Chart Cards (Quick Preview)
| Card | Preview Value |
|------|---------------|
| Debt Consolidation | Total Paid Off |
| Payment Savings | Monthly Savings |
| Cash Back | At Closing Amount |
| Accelerated Payoff | Years Saved |

---

### Chart: Debt Consolidation Worksheet ✅ DONE
- [ ] Table listing all debts being paid off (Creditor, Type, Monthly Payment, Payoff Amount, Paid Off status)
- [ ] Totals row showing combined monthly payment and total balance
- [ ] "Peace-of-Mind Promise" section with guarantees

### Chart: Blended Rate ✅ DONE
- [ ] Comparison of blended rate across consolidated debts

---

### Chart: Payment Savings Comparison (PRIORITY)

**Header:** Dark header "PAYMENT SAVINGS COMPARISON"

**Stacked Bar Chart:**
- [ ] **Current bar** showing stacked segments:
  - Mortgage P&I (stone-600)
  - Subordinate Lien (indigo-500)
  - Escrow/Taxes & Insurance (teal-500)
  - MI/MIP (purple-400, if applicable)
  - Debts Being Paid Off (amber-500)
  - Remaining Debts (stone-400)
- [ ] **Proposed bar** showing stacked segments:
  - New Mortgage P&I
  - Escrow (same as current)
  - MI/MIP (if applicable)
  - Remaining Debts (same as current)
- [ ] Annual Savings circle callout (teal border)
- [ ] Monthly Savings circle callout

**Legend:**
- [ ] Color-coded legend for all bar segments
- [ ] Only show legend items that have values > 0

**Payment Breakdown Table:**
- [ ] 3-column table: Item | Current | Proposed
- [ ] All payment line items with values
- [ ] Subordinate Lien shows "$0 (Paid Off)" in proposed
- [ ] Other Debts shows "$0 (Paid Off)" in proposed
- [ ] **TOTAL** row with bold styling

---

### Chart: Cash Back Calculator (PRIORITY)

**Header:** Gradient header (teal) "CASH BACK"

**Main Display:**
- [ ] Large cash amount in center with money icon
- [ ] "In Your Pocket" label
- [ ] Subtitle: "After paying off debts → Cash to you"

**Calculation Breakdown:**
- [ ] Loan Amount (positive)
- [ ] Less: Debts Paid Off (red, negative)
- [ ] Less: Closing Costs (red, negative)
- [ ] **Cash Back at Closing** = final amount

**"What You Could Do With It" Section:**
- [ ] 3x2 grid of use case cards:
  - College Savings (blue)
  - Home Improvements (teal)
  - Vacation (purple)
  - Savings & Investments (amber)
  - Pay Off Other Bills (rose)
  - Emergency Fund (stone)
- [ ] Each card has icon and label

**Footer disclaimer:** "Final cash back amount may vary..."

---

### Chart: Accelerated Payoff (PRIORITY)

**Header:** Gradient header (purple) "ACCELERATED PAYOFF"

**Extra Payment Input:**
- [ ] **EDITABLE** dollar amount input field
- [ ] Shows percentage of monthly savings being applied
- [ ] **Quick-select buttons:** 25%, 50%, 75%, 100%
- [ ] Buttons update the dollar amount based on max savings

**Payoff Timeline Visual:**
- [ ] "Without extra payments" bar (full width, 30 years)
- [ ] "With $X/mo extra" bar (shorter width, calculated years)
- [ ] Years displayed at end of each bar

**Savings Highlights (2 cards):**
- [ ] **Years Saved** - purple gradient card with Calendar icon
- [ ] **Interest Saved** - teal gradient card with DollarSign icon (in $K format)

**Comparison Table:**
- [ ] 3-column: Item | Proposed Loan | Accelerated
- [ ] **Loan Term** row (years)
- [ ] **Total Interest** row (dollar amounts)
- [ ] **You Save** row (highlighted in teal)

**Calculations:**
- [ ] Original term: 30 years
- [ ] New term calculated using amortization with extra payment
- [ ] Interest saved = Original total interest - New total interest

---

## Story Point Estimates

| Story | Points |
|-------|--------|
| Story 1: Loan Configuration Panel | 13 |
| Story 2: Value Propositions Panel | 21 |
| Story 3: Chart Highlights | 21 |
| **TOTAL** | **55** |

### Story 3 Breakdown by Chart
| Chart | Status | Points |
|-------|--------|--------|
| Debt Consolidation | ✅ Done | 3 |
| Blended Rate | ✅ Done | 2 |
| Payment Savings | Priority | 5 |
| Cash Back | Priority | 5 |
| Accelerated Payoff | Priority | 6 |
