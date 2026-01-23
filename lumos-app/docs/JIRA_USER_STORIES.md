# JIRA User Stories - Pricing Scenarios

## Epic: Pricing Scenarios Tool
Build a comprehensive pricing scenarios tool that enables loan officers to configure loan parameters, visualize value propositions, and present compelling charts to borrowers.

---

## Part 1: Loan Configuration (Left Panel)

### Story 1.1: Program Selection
**As a** loan officer  
**I want to** select from available loan programs (Conventional, FHA, VA)  
**So that** I can configure the correct product type for my borrower

**Acceptance Criteria:**
- [ ] Display pill-style buttons for Conventional, FHA, and VA
- [ ] Selected program shows checkmark and purple highlight
- [ ] Only one program can be selected at a time
- [ ] Default selection is "Conventional"

---

### Story 1.2: Term Selection
**As a** loan officer  
**I want to** select loan terms (30, 20, 15, 10 years)  
**So that** I can match the borrower's desired payoff timeline

**Acceptance Criteria:**
- [ ] Display pill-style buttons for 30, 20, 15, and 10 year terms
- [ ] Selected term shows checkmark and purple highlight
- [ ] Only one term can be selected at a time
- [ ] Default selection is 30 years

---

### Story 1.3: Property Value Input
**As a** loan officer  
**I want to** enter and edit the property value  
**So that** I can calculate accurate LTV and loan scenarios

**Acceptance Criteria:**
- [ ] Editable input field with currency formatting
- [ ] Default value of $425,000
- [ ] Large, prominent font for easy visibility
- [ ] Value updates dynamically affect LTV calculation

---

### Story 1.4: Occupancy Selection
**As a** loan officer  
**I want to** select occupancy type (Primary, Second Home, Investment)  
**So that** I can apply correct pricing adjustments

**Acceptance Criteria:**
- [ ] Display options for Primary, Second Home, and Investment
- [ ] Selected occupancy shows purple highlight
- [ ] Default selection is "Primary"

---

### Story 1.5: Property Type Selection
**As a** loan officer  
**I want to** select property type (Single Family, Condo, Townhouse, Multi-Family)  
**So that** I can apply correct pricing adjustments

**Acceptance Criteria:**
- [ ] Display options for all property types
- [ ] Selected type shows purple highlight
- [ ] Default selection is "Single Family"

---

### Story 1.6: Number of Units Selection
**As a** loan officer  
**I want to** select number of units (1-4)  
**So that** I can configure multi-unit property scenarios

**Acceptance Criteria:**
- [ ] Display options for 1, 2, 3, and 4 units
- [ ] Selected unit count shows purple highlight
- [ ] Default selection is 1 Unit

---

### Story 1.7: LTV Slider
**As a** loan officer  
**I want to** adjust the Loan-to-Value ratio using a slider  
**So that** I can model different down payment scenarios

**Acceptance Criteria:**
- [ ] Interactive slider from 0% to 100%
- [ ] Large, prominent LTV percentage display
- [ ] Tick marks at key intervals (50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100)
- [ ] Purple fill indicating selected LTV level
- [ ] Pencil icon indicating editability

---

### Story 1.8: Loan Amount Input
**As a** loan officer  
**I want to** enter the loan amount  
**So that** I can calculate accurate payment scenarios

**Acceptance Criteria:**
- [ ] Large, editable input field with currency formatting
- [ ] Bold label "Loan Amount"
- [ ] Value persists during session

---

### Story 1.9: Debts to Pay Off Input
**As a** loan officer  
**I want to** enter debts being consolidated  
**So that** I can show debt consolidation benefits

**Acceptance Criteria:**
- [ ] Large, editable input field with currency formatting
- [ ] Bold label "Debts to Pay Off"
- [ ] Value used in monthly savings calculations

---

### Story 1.10: Cashout Input
**As a** loan officer  
**I want to** enter the cashout amount  
**So that** I can model cash-out refinance scenarios

**Acceptance Criteria:**
- [ ] Large, editable input field with currency formatting
- [ ] Bold label "Cashout"
- [ ] Value flows to Cash From/To Borrower calculation

---

### Story 1.11: Calculate Value Propositions Button
**As a** loan officer  
**I want to** click a button to calculate and display rate options  
**So that** I can see available pricing scenarios

**Acceptance Criteria:**
- [ ] Purple "Calculate Value Propositions" button
- [ ] Refresh icon on button
- [ ] Clicking reveals rate selection cards below

---

### Story 1.12: Rate Selection Cards
**As a** loan officer  
**I want to** select from 5 rate options (2 buy-down, par, 2 credit)  
**So that** I can choose the best pricing for my borrower

**Acceptance Criteria:**
- [ ] Display 5 rate cards after calculation
- [ ] Each card shows: Rate %, Payment, Cost in BPS, Cost in Dollars
- [ ] Selected card highlighted with orange border
- [ ] Par rate in center position
- [ ] Buy-down options show negative cost (borrower pays)
- [ ] Credit options show positive cost (lender credit)
- [ ] "Step 2 of 3" indicator

---

## Part 2: Value Propositions (Right Panel)

### Story 2.1: Monthly Payment Comparison Header
**As a** loan officer  
**I want to** see a clear header for the comparison section  
**So that** I can orient my borrower to the analysis

**Acceptance Criteria:**
- [ ] "Value Propositions" title in large, bold font
- [ ] "Monthly Payment Comparison" section header
- [ ] Include Escrows toggle in header area

---

### Story 2.2: Escrows Toggle
**As a** loan officer  
**I want to** toggle escrows on/off  
**So that** I can show scenarios with or without impounds

**Acceptance Criteria:**
- [ ] Toggle switch labeled "Include Escrows"
- [ ] When OFF: Remove Taxes & Insurance from comparison
- [ ] When OFF: Remove Escrows from Cash at Closing
- [ ] Default state is ON

---

### Story 2.3: Current Finances Column
**As a** loan officer  
**I want to** display the borrower's current payment breakdown  
**So that** I can compare against the proposed scenario

**Acceptance Criteria:**
- [ ] Orange-tinted header "Current Finances" with subtitle "What you're paying now"
- [ ] Line items: Principal & Interest, Subordinate Lien, Taxes (indented), Insurance (indented), Mortgage Insurance (indented)
- [ ] Mortgage Total row highlighted in orange
- [ ] Monthly Debts (Paid Off) in red
- [ ] Monthly Debts (NOT Paid) 
- [ ] Total Monthly row at bottom, bold with large font

---

### Story 2.4: GoodLeap Opportunity Column
**As a** loan officer  
**I want to** display the proposed payment breakdown  
**So that** I can show the benefits of refinancing

**Acceptance Criteria:**
- [ ] Purple-tinted header "GoodLeap Opportunity" with subtitle "Your new payment"
- [ ] Same line items as Current Finances
- [ ] Subordinate Lien shows "$0 ✓" in green
- [ ] Monthly Debts (Paid Off) shows "$0 ✓" in green
- [ ] Mortgage Total row highlighted in purple
- [ ] Total Monthly row at bottom, bold with large font

---

### Story 2.5: Monthly Savings Banner
**As a** loan officer  
**I want to** see a prominent savings display  
**So that** I can highlight the monthly benefit to borrowers

**Acceptance Criteria:**
- [ ] Green banner when savings positive, red when negative
- [ ] "💰 Monthly Savings" or "⚠️ Monthly Increase" label
- [ ] Large, bold savings amount
- [ ] Automatically calculated from Current Total - Proposed Total

---

### Story 2.6: Cash From/To Borrower Section
**As a** loan officer  
**I want to** see the net cash position at closing  
**So that** I can explain what the borrower receives or pays

**Acceptance Criteria:**
- [ ] "Cash at Closing" section header
- [ ] Green-tinted "Cash From/To Borrower" card
- [ ] Cashout Amount line item
- [ ] Plus: Lender Credit (when applicable, green)
- [ ] Less: Discount Points (when applicable, red)
- [ ] Estimated Loan Fees - EDITABLE input field
- [ ] Estimated Escrows - EDITABLE input field (only when escrows enabled)
- [ ] Final "Cash TO Borrower" or "Cash FROM Borrower" row
- [ ] Large, bold final amount in green (to) or red (from)

---

### Story 2.7: Editable Fees
**As a** loan officer  
**I want to** edit the estimated loan fees  
**So that** I can input accurate closing cost estimates

**Acceptance Criteria:**
- [ ] "Estimated Loan Fees" label
- [ ] Editable input field with currency formatting
- [ ] Default value of $3,000
- [ ] Changes dynamically update Cash From/To Borrower

---

### Story 2.8: Editable Escrows
**As a** loan officer  
**I want to** edit the estimated escrows  
**So that** I can input accurate prepaid amounts

**Acceptance Criteria:**
- [ ] "Estimated Escrows" label
- [ ] Editable input field with currency formatting
- [ ] Default value of $3,420 (6 months taxes + insurance)
- [ ] Only visible when Escrows toggle is ON
- [ ] Changes dynamically update Cash From/To Borrower

---

## Part 3: Chart Highlights

### Story 3.1: Chart Highlights Section
**As a** loan officer  
**I want to** see quick-access chart cards  
**So that** I can quickly navigate to detailed visualizations

**Acceptance Criteria:**
- [ ] "Chart Highlights" section header
- [ ] 2x2 grid of chart cards
- [ ] Each card shows: Chart name, key metric, arrow icon

---

### Story 3.2: Debt Consolidation Chart Card
**As a** loan officer  
**I want to** access the Debt Consolidation chart  
**So that** I can show borrowers their debt payoff benefits

**Acceptance Criteria:**
- [ ] "Debt Consolidation" title
- [ ] "Total Paid Off" label with value (e.g., $150,000)
- [ ] Clicking opens full Debt Consolidation chart
- [ ] Chart shows itemized debts being consolidated
- [ ] Visual breakdown of debt types

---

### Story 3.3: Payment Savings Chart Card
**As a** loan officer  
**I want to** access the Payment Savings chart  
**So that** I can visualize monthly savings over time

**Acceptance Criteria:**
- [ ] "Payment Savings" title
- [ ] "Monthly" label with savings value (e.g., $2,518)
- [ ] Clicking opens full Payment Savings chart
- [ ] Chart shows current vs proposed payments
- [ ] Annual and lifetime savings projections

---

### Story 3.4: Cash Back Chart Card
**As a** loan officer  
**I want to** access the Cash Back chart  
**So that** I can show borrowers their cash at closing

**Acceptance Criteria:**
- [ ] "Cash Back" title
- [ ] "At Closing" label with value (e.g., $43,580)
- [ ] Clicking opens full Cash Back chart
- [ ] Chart shows breakdown of cash sources and uses

---

### Story 3.5: Accelerated Payoff Chart Card
**As a** loan officer  
**I want to** access the Accelerated Payoff chart  
**So that** I can show how extra payments shorten the loan

**Acceptance Criteria:**
- [ ] "Accelerated Payoff" title
- [ ] "Years Saved" label with value (e.g., 7 years)
- [ ] Clicking opens full Accelerated Payoff chart

---

### Story 3.6: Accelerated Payoff Chart - Full View
**As a** loan officer  
**I want to** show an interactive accelerated payoff visualization  
**So that** borrowers can see the impact of extra payments

**Acceptance Criteria:**
- [ ] "ACCELERATED PAYOFF" header with purple gradient
- [ ] Editable extra monthly payment input field
- [ ] Quick-select percentage buttons (25%, 50%, 75%, 100%)
- [ ] Visual timeline showing years saved
- [ ] Interest saved calculation
- [ ] Comparison table: Proposed Loan vs Accelerated
- [ ] Loan Term comparison (e.g., 30 years vs 23 years)
- [ ] Total Interest comparison
- [ ] "You Save" summary row

---

### Story 3.7: Charts in Left Navigation
**As a** loan officer  
**I want to** access charts from the left navigation sidebar  
**So that** I can quickly open any chart from anywhere in the app

**Acceptance Criteria:**
- [ ] "Charts" section in left navigation
- [ ] Sub-items: Debt Worksheet, Payment Savings, Cash Back, Accelerated Payoff
- [ ] Clicking opens chart in main content area
- [ ] "TEMPLATED DATA - FOR TESTING ONLY" banner when using test data

---

## Definition of Done (All Stories)
- [ ] Feature implemented per acceptance criteria
- [ ] Responsive design works on standard desktop screens
- [ ] UI matches Figma design specifications
- [ ] Code reviewed and merged to main branch
- [ ] Deployed to production environment

---

## Story Point Estimates

| Story | Points |
|-------|--------|
| 1.1 Program Selection | 2 |
| 1.2 Term Selection | 2 |
| 1.3 Property Value Input | 2 |
| 1.4 Occupancy Selection | 2 |
| 1.5 Property Type Selection | 2 |
| 1.6 Number of Units | 2 |
| 1.7 LTV Slider | 3 |
| 1.8 Loan Amount Input | 2 |
| 1.9 Debts to Pay Off Input | 2 |
| 1.10 Cashout Input | 2 |
| 1.11 Calculate Button | 2 |
| 1.12 Rate Selection Cards | 5 |
| 2.1 Comparison Header | 1 |
| 2.2 Escrows Toggle | 3 |
| 2.3 Current Finances Column | 3 |
| 2.4 GoodLeap Opportunity Column | 3 |
| 2.5 Monthly Savings Banner | 2 |
| 2.6 Cash From/To Borrower | 3 |
| 2.7 Editable Fees | 2 |
| 2.8 Editable Escrows | 2 |
| 3.1 Chart Highlights Section | 2 |
| 3.2 Debt Consolidation Card | 3 |
| 3.3 Payment Savings Card | 3 |
| 3.4 Cash Back Card | 3 |
| 3.5 Accelerated Payoff Card | 3 |
| 3.6 Accelerated Payoff Full | 5 |
| 3.7 Charts in Left Nav | 3 |
| **TOTAL** | **69** |

---

## Sprint Breakdown Recommendation

**Sprint 1 (Part 1 - Configuration):** Stories 1.1 - 1.12 = 28 points  
**Sprint 2 (Part 2 - Value Propositions):** Stories 2.1 - 2.8 = 22 points  
**Sprint 3 (Part 3 - Charts):** Stories 3.1 - 3.7 = 19 points
