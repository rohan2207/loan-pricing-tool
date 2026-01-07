# GoodLeap Advantage - Pricing UI PRD

## Document Version
- **Version:** 1.0
- **Last Updated:** January 2026
- **Status:** Ready for Development

---

## 1. Overview

### 1.1 Purpose
The GoodLeap Advantage Pricing UI enables loan officers to:
1. Select liabilities to consolidate into a refinance
2. Configure loan parameters (LTV, program, rate)
3. View real-time Present vs Proposed payment comparison
4. See value propositions with intelligent recommendations
5. Generate customer-facing proposals with selected benefit charts

### 1.2 Prerequisites (Already Built)
- ✅ Liabilities data source (credit report integration)
- ✅ Pricing engine API
- ✅ Base UI component library

### 1.3 User Flow
```
Dashboard → Click "GoodLeap Advantage" → 
  Step 1: Select Debts → 
  Step 2: Configure & Price Loan → 
  Step 3: Review Value Propositions → 
  Step 4: Generate Proposal
```

---

## 2. Layout Structure

### 2.1 Overall Layout
```
┌─────────────────────────────────────────────────────────────────────┐
│ HEADER: GoodLeap Advantage                    [Generate] [X Close]  │
├─────────────────────────────────────────────────────────────────────┤
│ PROGRESS BAR: ① Select Debts → ② Price Loan → ③ Generate Proposal  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐     │
│  │                 │  │                 │  │                 │     │
│  │  DEBTS TABLE    │  │ LOAN CONFIG &   │  │    VALUE        │     │
│  │  (Liabilities)  │  │ COMPARISON      │  │  PROPOSITIONS   │     │
│  │                 │  │                 │  │                 │     │
│  │  ~33% width     │  │  ~33% width     │  │  ~33% width     │     │
│  │                 │  │                 │  │                 │     │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘     │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### 2.2 Responsive Behavior
- Desktop: 3-column layout
- Tablet: 2-column (debts + config stacked, propositions below)
- Mobile: Single column, scrollable

---

## 3. Component Specifications

### 3.1 Header
```
┌─────────────────────────────────────────────────────────────────┐
│ GoodLeap Advantage              [📥 Generate (2)] [✕]          │
└─────────────────────────────────────────────────────────────────┘
```

**Requirements:**
- Title: "GoodLeap Advantage"
- Generate button: Shows count of selected charts, disabled if 0
- Close button: Returns to main dashboard

### 3.2 Progress Bar
```
┌─────────────────────────────────────────────────────────────────┐
│  ① Select Debts ───────── ② Price Loan ───────── ③ Generate    │
│     [active]                 [pending]              [pending]   │
└─────────────────────────────────────────────────────────────────┘
```

**States:**
| Step | State | Visual |
|------|-------|--------|
| Select Debts | Active when no debts selected | Amber highlight |
| Select Debts | Complete when ≥1 debt selected | Green check |
| Price Loan | Active when debts selected, not priced | Amber highlight |
| Price Loan | Complete when priced | Green check |
| Generate | Active when charts selected | Amber highlight |

---

## 4. Column 1: Debts Table

### 4.1 Collapsible Behavior

**The Debts column is collapsible:**
- **Before Pricing:** Expanded by default (full table visible)
- **After Pricing:** Automatically collapses to show summary only
- **User Control:** Click header to toggle expand/collapse at any time
- **Re-pricing Trigger:** Collapses auto-expand when pricing is reset

**Rationale:** Once pricing is complete, the loan officer's focus shifts to Value Propositions. Collapsing the debts table gives more screen space to the important comparison and benefits sections.

### 4.2 Expanded Layout
```
┌────────────────────────────────────────────┐
│ [▼] Debts to Pay Off        [8 Selected]   │
├────────────────────────────────────────────┤
│ GOODLEAP LOAN                              │
│ ┌────────────────────────────────────────┐ │
│ │ CF-1234567  Solar    $42,000    ☑     │ │
│ └────────────────────────────────────────┘ │
├────────────────────────────────────────────┤
│ Creditor    Balance  Payment  Rate  Pay   │
├────────────────────────────────────────────┤
│ REGIONS     [$247.5K] [$1,710] [3.75%] ☑  │
│ Mortgage                                   │
│ CHASE AUTO  [$18,000] [$450]   [6.9%]  ☑  │
│ Installment                                │
│ ...                                        │
├────────────────────────────────────────────┤
│ Total Payoff: $525,314    Payment: $4,156  │
└────────────────────────────────────────────┘
```

### 4.3 Collapsed Layout (After Pricing)
```
┌─────────────────────┐
│ [▶] Debts to Pay Off│
│     [8 Selected]    │
├─────────────────────┤
│  📋 Selected Debts  │
│                     │
│    $525,314         │
│   -$4,156/mo        │
│                     │
│  [View All Debts]   │
└─────────────────────┘
       200px width
```

### 4.4 State Management

```javascript
// Collapse state
const [isDebtsCollapsed, setIsDebtsCollapsed] = useState(false);

// Auto-collapse when pricing completes
useEffect(() => {
  if (isPriced) {
    setIsDebtsCollapsed(true);
  }
}, [isPriced]);

// Expand when pricing is reset
const resetPricing = () => {
  setIsPriced(false);
  setIsDebtsCollapsed(false);  // Auto-expand
  // ... reset other state
};
```

### 4.5 Styling

```jsx
// Column container - dynamic width
<div className={cn(
  "border-r border-stone-200 bg-white overflow-auto transition-all duration-300",
  isDebtsCollapsed ? "w-[200px] flex-shrink-0" : "flex-1"
)}>
```

### 4.6 Full Layout

### 4.2 Table Columns

| Column | Width | Editable | Format |
|--------|-------|----------|--------|
| Creditor | flex | No | Name + Account Type |
| Balance | 80px | **Yes** | Currency input |
| Payment | 64px | **Yes** | Currency input |
| Rate | 56px | **Yes** | Percentage input |
| Will Pay | 40px | Checkbox | Toggle |

### 4.3 Editable Fields Requirements

```javascript
// Balance field
<input 
  type="text"
  value={account.balance}  // e.g., "$247,500"
  onChange={(e) => onAccountUpdate(account.id, 'balance', e.target.value)}
/>

// Payment field
<input 
  type="text"
  value={account.payment}  // e.g., "$1,710"
  onChange={(e) => onAccountUpdate(account.id, 'payment', e.target.value)}
/>

// Rate field
<input 
  type="text"
  value={account.rate}     // e.g., "3.75%"
  placeholder="—"
  onChange={(e) => onAccountUpdate(account.id, 'rate', e.target.value)}
/>
```

### 4.4 GoodLeap Loan Section
- Show existing GoodLeap consumer finance loan (e.g., solar)
- Separate visual section above main table
- Pre-selected by default
- Toggleable

**Editable Fields:**
| Field | Default | State Variable |
|-------|---------|----------------|
| Balance | $42,000 | `glBalance` |
| Payment | $350 | `glPayment` |
| Rate | 6.75% | `glRate` |

**State Variables:**
```javascript
const [glBalance, setGlBalance] = useState(42000);
const [glPayment, setGlPayment] = useState(350);
const [glRate, setGlRate] = useState(6.75);
```

**UI Layout:**
```
┌─────────────────────────────────────────────────────────┐
│ 🏠 GoodLeap Loan                                        │
├─────────────────────────────────────────────────────────┤
│ CF-1234567                                          [✓] │
│ Solar Installation                                      │
│ ┌─────────────┬─────────────┬─────────────┐            │
│ │   Balance   │   Payment   │    Rate     │            │
│ │ $[42,000]   │  $[350]     │  [6.75]%    │            │
│ └─────────────┴─────────────┴─────────────┘            │
└─────────────────────────────────────────────────────────┘
```

- Changing any field triggers `resetPricing()` (requires re-pricing)

### 4.5 Summary Footer
```
Total Payoff: $525,314    Monthly Payments: $4,156/mo
```
- Updates in real-time as selections/edits change

---

## 5. Column 2: Loan Configuration & Comparison

### 5.1 Structure
```
┌────────────────────────────────────────────┐
│ LOAN CONFIGURATION                         │
│                                            │
│ Property Value (AVM)          $[950,000]   │
│ (editable - defaults from AVM)             │
│                                            │
│ Program: [Conv] [FHA] [VA] [FHA-S] [VA-I]  │
│ Term:    [15 Year] [30 Year]               │
│                                            │
│ Select LTV                           75%   │
│ [50][55][60][65][70][75][80][Max]         │
│                                            │
│ Loan Amount                      $588,750  │
│ ┌──────────┬──────────┬──────────┐        │
│ │   LOAN   │  DEBTS   │ CASHOUT  │        │
│ │ $588,750 │ $525,314 │ $63,436  │        │
│ │[editable]│ (locked) │[editable]│        │
│ └──────────┴──────────┴──────────┘        │
│                                            │
│ ┌────────────────────────────────────────┐ │
│ │ Extra Cashout @ 80%           $39,250  │ │
│ └────────────────────────────────────────┘ │
│                                            │
│          [💰 Price Loan]                   │
├────────────────────────────────────────────┤
│ PRESENT vs PROPOSED COMPARISON             │
│ (shown after pricing)                      │
└────────────────────────────────────────────┘
```

### 5.2 Property Value (Editable)

**Purpose:** Allow LO to adjust property value if AVM seems incorrect or they have a better estimate.

**State Variable:**
```javascript
const [propertyValue, setPropertyValue] = useState(borrowerData?.property?.avmValue || 950000);
```

**UI Layout:**
```
┌────────────────────────────────────────────────────┐
│ Property Value (AVM)                  $[950,000]   │
│ (label, left)                    (editable, right) │
└────────────────────────────────────────────────────┘
```

**Styling:**
```jsx
<div className="p-2.5 bg-stone-50 rounded-lg border border-stone-200">
  <div className="flex items-center justify-between">
    <label className="text-xs text-stone-500 font-medium">Property Value (AVM)</label>
    <div className="flex items-center gap-1">
      <span className="text-stone-400">$</span>
      <input 
        type="text"
        value={propertyValue.toLocaleString()}
        onChange={(e) => {
          const val = parseInt(e.target.value.replace(/,/g, '')) || 0;
          setPropertyValue(val);
          resetPricing();  // Trigger re-pricing requirement
        }}
        className="w-28 px-2 py-1 text-right text-sm font-bold text-stone-800 border border-stone-200 rounded-lg"
      />
    </div>
  </div>
</div>
```

**Behavior:**
- Defaults to AVM value from `borrowerData.property.avmValue`
- Formatted with commas for readability
- Changing value triggers `resetPricing()` (requires re-pricing)
- Affects: LTV calculation, max loan amount, Extra Cashout @ 80%, equity calculations

---

### 5.3 Program Selection

| Program | Max LTV | MI/MIP | Notes |
|---------|---------|--------|-------|
| Conventional | 80% | PMI if LTV > 80% | Default |
| FHA | 96.5% | UFMIP (1.75%) + Monthly MIP | Show UFMIP in loan |
| VA | 100% | None | Veteran only |
| FHA Streamline | 96.5% | UFMIP + MIP | Existing FHA |
| VA IRRRL | 100% | None | Existing VA |

### 5.4 LTV Preset Buttons

```
┌────┬────┬────┬────┬────┬────┬────┬─────┐
│50% │55% │60% │65% │70% │75% │80% │ Max │
└────┴────┴────┴────┴────┴────┴────┴─────┘
```

**Requirements:**
- 8 preset buttons in a row
- Disable buttons below minimum required LTV
- "Max" shows program-specific max (e.g., 80% for Conv, 96.5% for FHA)
- Selecting a preset clears any manual cashout override
- Active button: Amber background, white text
- Disabled: Gray, no hover

### 5.5 Loan/Debts/Cashout Breakdown

**Bidirectional Sync:**
```
Loan Amount = Debts + Cashout

If user edits Loan:
  Cashout = Loan - Debts (auto-calculated)

If user edits Cashout:
  Loan = Debts + Cashout (auto-calculated)
  LTV = (Loan / Property Value) × 100

Debts: Always locked (from selection)
```

**Visual Treatment:**
- Loan: Light background, editable
- Debts: Darker background, "From selection" label, locked
- Cashout: Amber highlight, editable (most common adjustment)

### 5.6 Extra Cashout @ 80%

```javascript
const maxLoanAt80 = propertyValue * 0.80;
const extraCashout = maxLoanAt80 - currentLoanAmount;

// Show only if:
// 1. Current LTV < 80%
// 2. extraCashout > 0
```

Display: Teal background callout showing potential additional cashout

### 5.7 Rate Options (Post-Pricing)

After pricing, show rate options with lender credits/discount points:

```
┌─────────────────────────────────────────────────────┐
│ Select Rate                                          │
│ ○ 7.250% (+$2,500 credit)                           │
│ ○ 7.125% (+$1,200 credit)                           │
│ ● 7.000% (Par rate)                 ← Default       │
│ ○ 6.875% (-$1,800 points)                           │
│ ○ 6.750% (-$3,200 points)                           │
└─────────────────────────────────────────────────────┘
```

**Requirements:**
- Radio button selection
- Show credit as positive (lender pays)
- Show points as negative (borrower pays)
- Points cost appears in closing costs and comparison table

---

## 6. Present vs Proposed Comparison Table

### 6.1 Layout
```
┌─────────────────────────────────────────────────────────────────┐
│      Present                               Proposed             │
├─────────────────────────────────────────────────────────────────┤
│ Calculate P&I from: [$247,500] @ [3.75%] for [30 yr ▼] [Calc]  │
├─────────────────────────────────────────────────────────────────┤
│ P&I              $1,710    →    $3,447                          │
│ [✓] Include Escrow                                              │
│ Taxes            $450      →    $450                            │
│ Insurance        $120      →    $120                            │
│ MI/MIP           $0        →    $125                            │
│ Points/Credit    —         →    ($2,625)                        │
│ Debts Being      $2,446    →    $0 (Paid Off)                   │
│   Paid Off                                                      │
│ Other Debts      $154      →    $154                            │
│   (Not Paid)                                                    │
├─────────────────────────────────────────────────────────────────┤
│ TOTAL            $4,880    →    $4,296                          │
│                                                                 │
│ Monthly Savings: $584    │    Annual: $7,008                    │
└─────────────────────────────────────────────────────────────────┘
```

**Note:** The term dropdown (10, 15, 20, 30 years) allows accurate P&I calculation for the borrower's existing mortgage. This flows to the proposal document for an accurate "X Year Fixed" display.

**Key Row Types:**
| Row | Present | Proposed | Notes |
|-----|---------|----------|-------|
| Debts Being Paid Off | Payment amount | $0 | Teal text for proposed |
| Other Debts (Not Paid) | Payment amount | Same amount | Gray text, only shown if > $0 |

### 6.2 Editable Present Values

| Field | Editable | Calculation |
|-------|----------|-------------|
| P&I | Yes | Can calculate from Balance + Rate |
| Taxes | Yes | Direct input |
| Insurance | Yes | Direct input |
| MI/MIP | Yes | Direct input (for existing MI) |
| Other Debts | No | Sum of selected non-mortgage debts |

### 6.3 Calculate P&I from Balance

**UI Layout:**
```
┌────────────────────────────────────────────────────────────────────┐
│ Calculate P&I from: $[247,500] @ [3.75] % for [30 yr ▼] [Calc]    │
└────────────────────────────────────────────────────────────────────┘
```

**Components:**
| Field | Type | Default | Options |
|-------|------|---------|---------|
| Balance | Number input | $247,500 | Any positive number |
| Rate | Number input | 3.75% | Step: 0.125% |
| Term | Dropdown | 30 yr | 10 yr, 15 yr, 20 yr, 30 yr |

**State Variable:**
```javascript
const [currentTerm, setCurrentTerm] = useState(30);  // 10, 15, 20, or 30 years
```

**Term Selector Styling:**
```jsx
<select 
  value={currentTerm}
  onChange={(e) => setCurrentTerm(parseInt(e.target.value))}
  className="px-1.5 py-1 border border-stone-200 rounded-lg text-xs bg-white focus:border-amber-400 focus:outline-none"
>
  <option value={10}>10 yr</option>
  <option value={15}>15 yr</option>
  <option value={20}>20 yr</option>
  <option value={30}>30 yr</option>
</select>
```

**Amortization Formula:**
```javascript
function calculatePI(balance, annualRate, termYears = 30) {
  const r = annualRate / 100 / 12;  // Monthly rate
  const n = termYears * 12;          // Total payments
  return balance * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}
```

**Why Term Matters:**
- A 15-year mortgage has higher P&I than 30-year for same balance
- Correctly calculating present P&I ensures accurate savings comparison
- Term flows to Proposal document for accurate "Current vs Proposed" display

### 6.4 Escrow Toggle

```
[✓] Include Escrow (Taxes & Insurance)
```

**When unchecked:**
- Hide Taxes and Insurance rows
- Show note: "Taxes & Insurance paid separately"
- Adjust totals accordingly

### 6.5 Debts Breakdown Rows

The comparison table shows two debt-related rows:

**Debts Being Paid Off:**
- Present: Sum of monthly payments for selected **non-mortgage** debts
- Calculation: Filter selected accounts where `accountType !== 'Mortgage'` and `accountType !== 'HELOC'`, then sum their payments
- This is independent of the editable `currentPI` value (so changing P&I updates the total correctly)
- Proposed: $0 (all selected debts are paid off at closing)
- Visual: Present in normal text, Proposed in teal (positive outcome)

**Calculation Logic:**
```javascript
// Calculate "other debts" from non-mortgage selected accounts
const nonMortgageSelected = sel.filter(a => 
  a.accountType?.toLowerCase() !== 'mortgage' && 
  a.accountType?.toLowerCase() !== 'heloc'
);
const other = nonMortgageSelected.reduce((s, a) => s + parseAmount(a.payment), 0) + 
  (goodLeapSelected ? goodLeapLoan.payment : 0);

// Current total = P&I + Escrow + MIP + Other Debts
currentTotal: currentPI + currentEscrow + currentMIP + other
```

**Other Debts (Not Paid):**
- Present: Sum of monthly payments for debts NOT selected for payoff
- Proposed: Same amount (these debts continue to be paid)
- Visual: Both sides in muted gray text
- Note: Only shown if there are debts not being paid off

```
┌─────────────────────────────────────────────────┐
│ Present           │           │      Proposed   │
├───────────────────┼───────────┼─────────────────┤
│ $2,446            │ Debts     │      $0         │
│                   │ Being     │   (Paid Off)    │
│                   │ Paid Off  │                 │
├───────────────────┼───────────┼─────────────────┤
│ $154              │ Other     │      $154       │
│                   │ Debts     │                 │
│                   │(Not Paid) │                 │
└─────────────────────────────────────────────────┘
```

### 6.6 Proposed Calculations

```javascript
// Principal & Interest (30-year amortization)
const r = rate / 100 / 12;
const n = 360;
const proposedPI = loanAmount * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);

// Escrow (same as present unless changed)
const proposedEscrow = includeEscrow ? (taxes + insurance) : 0;

// Mortgage Insurance
let proposedMI = 0;
if (program === 'FHA') {
  proposedMI = (loanAmount * 0.0055) / 12;  // Annual MIP rate
} else if (program === 'Conventional' && ltv > 80) {
  const pmiRate = ltv > 95 ? 0.01 : ltv > 90 ? 0.008 : 0.005;
  proposedMI = (baseLoanAmount * pmiRate) / 12;
}

// Debts not being paid off (continue to be paid)
const debtsNotPaidPayment = accounts
  .filter(a => !a.willPay)
  .reduce((sum, a) => sum + parseAmount(a.payment), 0);

// Total (including debts not being paid)
const proposedTotal = proposedPI + proposedEscrow + proposedMI + debtsNotPaidPayment;
const currentTotal = currentPI + currentEscrow + currentMI + debtsPaidOff + debtsNotPaidPayment;

// Savings (debts not paid cancel out since they're on both sides)
const monthlySavings = currentTotal - proposedTotal;
const annualSavings = monthlySavings * 12;
```

### 6.6 UI Design Specifications - Present vs Proposed

#### Card Container
```css
/* Comparison card */
.comparison-card {
  background: white;
  border-radius: 12px;              /* rounded-xl */
  border: 1px solid #E7E5E4;        /* border-stone-200 */
  overflow: hidden;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
}
```

#### Header Row
```
┌──────────────────────────────────────────────────────┐
│  Present                            Proposed         │
│  (gray text)                        (amber text)     │
└──────────────────────────────────────────────────────┘
```
- Background: `bg-stone-50`
- Font: `text-xs font-medium uppercase`
- Present label: `text-stone-600`
- Proposed label: `text-amber-600`
- Padding: `px-4 py-2.5`

#### Row Styling
```
┌───────────────────────────────────────────────────────┐
│ P&I            │    $1,710    │ →  │    $3,447       │
│ (label)        │   (present)  │    │   (proposed)    │
└───────────────────────────────────────────────────────┘
```

| Element | Style |
|---------|-------|
| Label | `text-stone-600 text-sm` |
| Present value | `text-stone-800 font-medium text-right` |
| Arrow (→) | `text-stone-300` centered |
| Proposed value | `text-amber-600 font-medium text-right` |
| Row padding | `px-4 py-2` |
| Row border | `border-b border-stone-100` |
| Alternating | Every other row `bg-stone-50/50` |

#### Editable Input Fields (Present Column)
```jsx
<input 
  type="text"
  className="
    w-20                    /* fixed width */
    px-2 py-1              /* compact padding */
    text-right             /* right-aligned numbers */
    text-sm font-medium    /* match non-editable style */
    bg-white               /* white background */
    border border-stone-200 /* subtle border */
    rounded-lg             /* rounded corners */
    focus:border-amber-400 /* amber focus state */
    focus:outline-none     /* no outline */
    hover:border-stone-300 /* hover feedback */
  "
/>
```

#### Total Row
```
┌───────────────────────────────────────────────────────┐
│ TOTAL          │    $4,726    │    │    $4,142       │
│ (bold)         │   (bold)     │    │ (bold, amber)   │
└───────────────────────────────────────────────────────┘
```
- Background: `bg-stone-100`
- Label: `font-bold text-stone-800`
- Present value: `font-bold text-stone-800`
- Proposed value: `font-bold text-amber-600`
- No bottom border

#### Savings Summary Bar
```
┌───────────────────────────────────────────────────────┐
│  Monthly: $584/mo        │        Annual: $7,008      │
│  (teal, large)           │        (teal, large)       │
└───────────────────────────────────────────────────────┘
```
- Background: `bg-gradient-to-r from-teal-50 to-teal-100`
- Border: `border-t-2 border-teal-200`
- Text: `text-teal-700 font-bold`
- Values: `text-xl` or `text-2xl`
- Padding: `p-4`

#### Negative Savings (Payment Increase)
When `monthlySavings < 0`:
```
┌───────────────────────────────────────────────────────┐
│  Monthly: +$234/mo       │        Annual: +$2,808     │
│  (rose/red)              │        (rose/red)          │
└───────────────────────────────────────────────────────┘
```
- Background: `bg-rose-50`
- Border: `border-rose-200`
- Text: `text-rose-600 font-bold`
- Show "+" prefix for increases

---

### 6.7 UI Design Specifications - Loan Configuration

#### Section Container
```css
.loan-config-section {
  background: white;
  border-radius: 12px;
  border: 1px solid #E7E5E4;
  padding: 16px;
  margin-bottom: 12px;
}
```

#### Program Selection Buttons
```
┌─────┐ ┌─────┐ ┌─────┐ ┌───────────┐ ┌─────────┐
│Conv │ │ FHA │ │ VA  │ │FHA Stream │ │VA IRRRL │
└─────┘ └─────┘ └─────┘ └───────────┘ └─────────┘
```

**Button Specs:**
```jsx
<button className="
  px-3 py-1.5              /* compact padding */
  text-xs font-medium      /* small, medium weight */
  rounded-full             /* pill shape */
  transition-all           /* smooth transitions */
  
  /* Default state */
  bg-stone-100 text-stone-600 hover:bg-stone-200
  
  /* Selected state */
  bg-stone-800 text-white
"/>
```

| State | Background | Text |
|-------|------------|------|
| Default | `bg-stone-100` | `text-stone-600` |
| Hover | `bg-stone-200` | `text-stone-600` |
| Selected | `bg-stone-800` | `text-white` |

#### Term Selection
```
┌──────────┐  ┌──────────┐
│ 15 Year  │  │ 30 Year  │
└──────────┘  └──────────┘
```
- Same button styling as Program
- `30 Year` default selected

#### LTV Preset Grid
```
┌────┬────┬────┬────┬────┬────┬────┬─────┐
│50% │55% │60% │65% │70% │75% │80% │ Max │
└────┴────┴────┴────┴────┴────┴────┴─────┘
```

**Grid Layout:**
```jsx
<div className="grid grid-cols-8 gap-1">
  {[50, 55, 60, 65, 70, 75, 80].map(ltv => (
    <button className="
      py-2                   /* vertical padding */
      rounded-lg             /* rounded corners */
      text-xs font-semibold  /* small bold text */
      transition-all
    ">
      {ltv}%
    </button>
  ))}
  <button>Max</button>
</div>
```

**Button States:**
| State | Background | Text |
|-------|------------|------|
| Default | `bg-stone-100` | `text-stone-600` |
| Hover | `bg-stone-200` | `text-stone-600` |
| Selected | `bg-amber-500` | `text-white` + shadow |
| Disabled | `bg-stone-100` | `text-stone-300` + cursor-not-allowed |

**Disabled Logic:**
```javascript
// Disable LTV options below minimum required
const minLTV = Math.ceil((totalDebts / propertyValue) * 100);
const isDisabled = ltv < minLTV;
```

#### LTV Display
```
┌────────────────────────────────────────────────────┐
│ Select LTV                                   75%   │
│ (label, left)                         (value, right)
└────────────────────────────────────────────────────┘
```
- Label: `text-sm text-stone-600`
- Value: `text-lg font-bold text-amber-600`

#### Loan Amount Display
```
┌────────────────────────────────────────────────────┐
│ Loan Amount                            $588,750    │
│                              (+$10,294 UFMIP)      │
└────────────────────────────────────────────────────┘
```
- Label: `text-sm text-stone-600`
- Value: `text-lg font-bold text-stone-800`
- UFMIP note: `text-[10px] text-sky-600` (only for FHA)

#### Loan/Debts/Cashout Grid
```
┌──────────────┬──────────────┬──────────────┐
│     LOAN     │    DEBTS     │   CASHOUT    │
│   $588,750   │   $525,314   │   $63,436    │
│  [editable]  │  (From sel)  │  [editable]  │
└──────────────┴──────────────┴──────────────┘
```

**Grid Layout:**
```jsx
<div className="grid grid-cols-3 gap-2">
  {/* Loan - Editable */}
  <div className="bg-stone-50 rounded-lg p-2">
    <p className="text-[10px] text-stone-500 uppercase mb-1">Loan</p>
    <div className="flex items-center">
      <span className="text-stone-400 text-sm">$</span>
      <input className="..." />
    </div>
  </div>
  
  {/* Debts - Locked */}
  <div className="bg-stone-100 rounded-lg p-2">
    <p className="text-[10px] text-stone-500 uppercase mb-1">Debts</p>
    <p className="font-bold text-stone-800 text-sm">$525,314</p>
    <p className="text-[8px] text-stone-400">From selection</p>
  </div>
  
  {/* Cashout - Editable, highlighted */}
  <div className="bg-amber-50 rounded-lg p-2 border border-amber-200">
    <p className="text-[10px] text-amber-600 uppercase mb-1">Cashout</p>
    <div className="flex items-center">
      <span className="text-amber-500 text-sm">$</span>
      <input className="..." />
    </div>
  </div>
</div>
```

**Visual Hierarchy:**
| Card | Background | Border | Label Color | Value Color |
|------|------------|--------|-------------|-------------|
| Loan | `bg-stone-50` | none | `text-stone-500` | `text-stone-800` |
| Debts | `bg-stone-100` | none | `text-stone-500` | `text-stone-800` |
| Cashout | `bg-amber-50` | `border-amber-200` | `text-amber-600` | `text-amber-600` |

#### Extra Cashout @ 80% Callout
```
┌────────────────────────────────────────────────────┐
│  Extra Cashout @ 80%                     $39,250   │
│  (teal background, teal text)                      │
└────────────────────────────────────────────────────┘
```

```jsx
<div className="
  mt-2 p-2.5 
  bg-teal-50 
  border border-teal-200 
  rounded-lg 
  flex items-center justify-between
">
  <span className="text-sm text-teal-700">Extra Cashout @ 80%</span>
  <span className="text-lg font-bold text-teal-600">$39,250</span>
</div>
```

**Show Condition:**
```javascript
const maxLoanAt80 = propertyValue * 0.80;
const extraCashout = maxLoanAt80 - currentLoanAmount;
const showExtraCashout = extraCashout > 0 && currentLTV < 80;
```

#### Price Loan Button
```
┌────────────────────────────────────────────────────┐
│               💰 Price Loan                        │
└────────────────────────────────────────────────────┘
```

```jsx
<button className="
  w-full py-3 
  rounded-xl 
  font-semibold text-sm
  flex items-center justify-center gap-2
  transition-all
  
  /* Default */
  bg-amber-500 text-white hover:bg-amber-600 shadow-sm
  
  /* Disabled (no debts selected) */
  bg-stone-100 text-stone-400 cursor-not-allowed
  
  /* Loading */
  bg-amber-400 cursor-wait
">
  <DollarSign size={16} />
  Price Loan
</button>
```

**States:**
| State | Background | Text | Cursor |
|-------|------------|------|--------|
| Default | `bg-amber-500` | `text-white` | pointer |
| Hover | `bg-amber-600` | `text-white` | pointer |
| Disabled | `bg-stone-100` | `text-stone-400` | not-allowed |
| Loading | `bg-amber-400` | `text-white` | wait |

#### Rate Options (Post-Pricing) - Prominent UI

When the loan is priced, the rate selection area becomes visually prominent to guide the LO to the next step:

```
┌──────────────────────────────────────────────────────────────┐
│  ● Select Your Rate                          [Step 2 of 3]  │
│    (amber gradient background)                               │
├──────────────────────────────────────────────────────────────┤
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────┐│
│ │  6.625%  │ │  6.875%  │ │ ●7.000%● │ │  7.125%  │ │7.375%││
│ │ 1 Point  │ │0.5 Point │ │ Par Rate │ │  Credit  │ │Credit││
│ └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────┘│
│                            (selected)                        │
└──────────────────────────────────────────────────────────────┘
```

**Container Styling (Post-Pricing):**
```jsx
<div className="
  mt-3 -mx-4 -mb-4 p-4 
  bg-gradient-to-r from-amber-50 to-orange-50 
  border-t-2 border-amber-300 
  rounded-b-xl
">
  {/* Header with pulsing indicator */}
  <div className="flex items-center gap-2 mb-3">
    <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
    <label className="text-sm font-semibold text-amber-800">Select Your Rate</label>
    <span className="text-xs bg-amber-200 text-amber-800 px-2 py-0.5 rounded-full">Step 2 of 3</span>
  </div>
  
  {/* Rate buttons grid */}
  <div className="grid grid-cols-5 gap-1.5">
    {/* ... rate options ... */}
  </div>
</div>
```

**Rate Button States:**
| State | Border | Background | Rate Text |
|-------|--------|------------|-----------|
| Default | `border-transparent` | `bg-white/80` | `text-stone-700` |
| Hover | `border-amber-200` | `bg-white` | `text-stone-700` |
| Selected | `border-amber-500` + `ring-2` | `bg-white` | `text-amber-600` |

**Credit vs Points Display:**
| Type | Text Color | Format |
|------|------------|--------|
| Credit (lender pays) | `text-teal-600` | `$2,625 Credit` |
| Par rate | `text-stone-400` | `Par Rate` |
| Points (borrower pays) | `text-rose-500` | `1 Point` |

---

## 7. Column 3: Value Propositions

### 7.1 Layout
```
┌────────────────────────────────────────────┐
│ ✨ Value Propositions            [2]       │
│                                  Locked    │
├────────────────────────────────────────────┤
│                                            │
│ ● PROVIDING VALUE (4)                      │
│                                            │
│ ┌────────────────────────────────────────┐ │
│ │ [Top Benefit]                          │ │
│ │ 💳 Debt Consolidation      -$4,156/mo  │ │
│ │    8 accounts paid off            [✓]  │ │
│ └────────────────────────────────────────┘ │
│                                            │
│ ┌────────────────────────────────────────┐ │
│ │ [Recommended]                          │ │
│ │ 📄 Payment Savings          $401/mo    │ │
│ │    $4,812 annually                [✓]  │ │
│ └────────────────────────────────────────┘ │
│                                            │
│ ... more cards ...                         │
│                                            │
│ ○ REVIEW / ADJUST (3)                      │
│   These may improve with different settings│
│                                            │
│ ┌────────────────────────────────────────┐ │
│ │ [No Value]                             │ │
│ │ 💵 Cash Back                    $0     │ │
│ │    No cashout available           [ ]  │ │
│ └────────────────────────────────────────┘ │
│                                            │
│ Select up to 2 charts (2/2 selected)       │
│ [📥 Generate Proposal (2 charts)]          │
└────────────────────────────────────────────┘
```

### 7.2 Value Proposition Cards

**All 8 Cards:**

| ID | Icon | Title | Value | Inline Control |
|----|------|-------|-------|----------------|
| debt-consolidation | ➕ | Debt Consolidation | `-$X/mo` | Static: "N accounts paid off" |
| payment-savings | 📄 | Payment Savings | `$X/mo` | Static: "$X annually" |
| cash-back | 💵 | Cash Back | `$X` | Static: "In your pocket" |
| cash-flow-window | 📅 | Cash Flow Window | `$X` | Input: `[60] days payment-free` |
| break-even | ⏱️ | Break-Even | `X mo` | Static: "✓ Under 2 years" |
| accelerated-payoff | 🏠 | Accelerated Payoff | `$X` | Slider: `──●── 100% of $657` |
| compound-growth | 📈 | Compound Growth | `$X/mo` | Input: `Invest @ [7] % return` |
| disposable-income | 👛 | Disposable Income | `+$X/mo` | Inputs: `$[12000] gross @ [25]% tax` |

**Card Layout with Inline Control:**
```
┌─────────────────────────────────────────────────────────┐
│ [Top Benefit]                                      [☑]  │
│                                                         │
│  ┌────┐  Compound Growth                               │
│  │ 📈 │  $657/mo                                       │
│  └────┘  Invest @ [7] % return  ← inline input        │
│                                                    [↗] │
└─────────────────────────────────────────────────────────┘
```

### 7.3 Card Component

```jsx
<Card
  icon={<Icon />}
  title="Payment Savings"
  value="$401/mo"
  subtitle="$4,812 annually"
  selected={boolean}
  onToggle={fn}
  onView={fn}           // Opens chart preview flyover
  badge="Top Benefit" | "Recommended" | "Review" | "No Value"
  color="teal" | "amber" | "rose" | "gray"
  disabled={boolean}
/>
```

**Card Visual States:**
- Default: White background, gray border
- Selected: Colored background, checkbox filled
- Hover: Shadow, colored border
- Disabled (No Value): Gray background, muted text

### 7.4 Badge Types

| Badge | Background | When Applied |
|-------|------------|--------------|
| Top Benefit | Gold gradient | Highest impact card |
| Recommended | Teal | Top 3 cards by impact |
| Review | Amber | Provides value but needs attention (e.g., break-even > 24mo) |
| No Value | Gray | Zero or negative impact |

### 7.5 Recommendation Engine

**Important: Rankings are FIXED based on original benefit values**

The recommendation engine uses the **original/full** savings amounts for impact calculation, NOT the user-adjusted values from inline controls. This ensures:
- Rankings stay consistent regardless of slider/input adjustments
- "Top Benefit" and "Recommended" badges don't jump around when user explores options
- User can adjust values to see different scenarios without affecting the recommendation order

```javascript
const cards = [
  {
    id: 'debt-consolidation',
    impact: totalMonthlyPaymentsEliminated,
    providesValue: selectedDebtCount > 0 && totalPayments > 0
  },
  {
    id: 'payment-savings',
    impact: Math.abs(monthlySavings * 12),  // Annual impact
    providesValue: monthlySavings > 0,
    negative: monthlySavings < 0
  },
  {
    id: 'cash-back',
    impact: cashoutAmount,
    providesValue: cashoutAmount > 0
  },
  {
    id: 'cash-flow-window',
    impact: currentTotalPayment * 2,  // 2 months of payments (fixed)
    providesValue: currentTotalPayment > 0
  },
  {
    id: 'break-even',
    impact: monthlySavings > 0 ? Math.max(0, 60 - breakEvenMonths) : 0,
    providesValue: monthlySavings > 0 && breakEvenMonths <= 36,
    warning: monthlySavings > 0 && breakEvenMonths > 24
  },
  {
    id: 'accelerated-payoff',
    // Uses ORIGINAL monthlySavings (not adjusted) to keep ranking fixed
    impact: monthlySavings > 0 ? monthlySavings * 60 : 0,
    providesValue: monthlySavings > 0
  },
  {
    id: 'compound-growth',
    // Uses ORIGINAL monthlySavings (not adjusted) to keep ranking fixed
    impact: monthlySavings > 0 ? monthlySavings * 84 : 0,  // 7 years weighted
    providesValue: monthlySavings > 0
  }
];

// Split into groups
const valueCards = cards.filter(c => c.providesValue);
const noValueCards = cards.filter(c => !c.providesValue);

// Sort by impact (highest first)
const sortedValueCards = [...valueCards].sort((a, b) => b.impact - a.impact);

// Assign badges
const topBenefit = sortedValueCards[0]?.id;
const recommended = sortedValueCards.slice(0, 3).map(c => c.id);
```

### 7.6 Selection Limit

```javascript
const MAX_CHARTS = 2;

const toggle = (id) => {
  setSelections(prev => {
    const isSelected = prev[id];
    const currentCount = Object.values(prev).filter(Boolean).length;
    
    // Don't allow selecting more than MAX
    if (!isSelected && currentCount >= MAX_CHARTS) {
      return prev;
    }
    
    return { ...prev, [id]: !isSelected };
  });
};
```

**UI Feedback:**
- "Select up to 2 charts for your proposal"
- "1 chart selected • Select 1 more or generate"
- "✓ 2 charts selected (maximum)"

### 7.7 Locked State (Before Pricing)

```
┌────────────────────────────────────────────┐
│           🔒                               │
│                                            │
│    Value Propositions Locked               │
│                                            │
│    Click "Price Loan" to unlock            │
│    and see available benefits              │
└────────────────────────────────────────────┘
```

---

## 8. Chart Specifications

### 8.0 Interactive Chart Controls (Inline in Cards)

**Design Philosophy:** Controls are embedded directly in the Value Proposition cards themselves, eliminating the disconnect between the card display and the chart configuration. Users can adjust parameters without opening the chart flyover.

| Chart | Control | Default | Range | Inline Display |
|-------|---------|---------|-------|----------------|
| Compound Growth | Interest Rate | 7% | 3-12% | "Invest @ [7] % return" |
| Accelerated Payoff | Extra Payment % | 100% | 0-100% | Slider with "X% of $657" |
| Cash Flow Window | Days | 60 | 30-90 | "[60] days payment-free" |
| Disposable Income | Gross Income | $12,000 | $1k-100k | "$ [12000] gross @ [25] % tax" |
| Disposable Income | Tax Rate | 25% | 10-45% | Combined with income |

**State Management (in GoodLeapAdvantageTabs.jsx):**
```javascript
// Chart configurable parameters - inline adjustable
const [compoundRate, setCompoundRate] = useState(7);
const [acceleratedPercent, setAcceleratedPercent] = useState(100);
const [cashFlowDays, setCashFlowDays] = useState(60);
const [grossIncome, setGrossIncome] = useState(12000);
const [taxRate, setTaxRate] = useState(25);
```

**Inline Control Patterns:**

```jsx
// Rate input (Compound Growth)
<div className="flex items-center gap-2 mt-1">
  <span className="text-xs text-stone-400">Invest @</span>
  <input type="number" value={7} className="w-12 text-xs text-center border rounded" />
  <span className="text-xs text-stone-400">% return</span>
</div>

// Slider with percentage (Accelerated Payoff)
<div className="flex items-center gap-2 mt-1">
  <input type="range" min="0" max="100" value={100} className="w-16 h-1.5 accent-teal-500" />
  <span className="text-xs font-semibold">100%</span>
  <span className="text-xs text-stone-400">of $657</span>
</div>

// Days input (Cash Flow Window)
<div className="flex items-center gap-2 mt-1">
  <input type="number" value={60} className="w-12 text-xs text-center border rounded" />
  <span className="text-xs text-stone-400">days payment-free</span>
</div>

// Income + Tax (Disposable Income)
<div className="flex items-center gap-1.5 mt-1">
  <span className="text-[10px]">$</span>
  <input type="number" value={12000} className="w-16 text-[10px] border rounded" />
  <span className="text-[10px]">gross @</span>
  <input type="number" value={25} className="w-8 text-[10px] border rounded" />
  <span className="text-[10px]">% tax</span>
</div>
```

**Data Flow:**
1. User adjusts value in card → State updates in parent (`GoodLeapAdvantageTabs.jsx`)
2. Card display value recalculates immediately
3. When chart flyover opens, it receives config values via `chartConfig` prop in `buildChartData()`
4. Chart flyover uses `useEffect` to sync its local state when `chartConfig` changes
5. **Important:** Rankings use ORIGINAL values (not adjusted) so they stay fixed

**Chart Sync Implementation (ChartPreview.jsx):**
```javascript
// Sync local state with chartConfig when it changes from main UI
useEffect(() => {
  if (chartConfig.compoundRate !== undefined) setCompoundRate(chartConfig.compoundRate);
  if (chartConfig.acceleratedPercent !== undefined) setAcceleratedPaymentPercent(chartConfig.acceleratedPercent);
  if (chartConfig.cashFlowDays !== undefined) setCashFlowDays(chartConfig.cashFlowDays);
  if (chartConfig.taxRate !== undefined) setTaxRate(chartConfig.taxRate);
  if (chartConfig.grossIncome !== undefined) setGrossMonthlyIncome(chartConfig.grossIncome);
}, [chartConfig.compoundRate, chartConfig.acceleratedPercent, chartConfig.cashFlowDays, 
    chartConfig.taxRate, chartConfig.grossIncome]);
```

---

### 8.1 Payment Savings Comparison

**Purpose:** Show current vs proposed payment breakdown

**Layout:**
```
┌─────────────────────────────────────────────────────┐
│           PAYMENT SAVINGS COMPARISON                │
├─────────────────────────────────────────────────────┤
│                                                     │
│    ┌─────┐              ┌─────┐      ╭───────╮     │
│    │$154 │ Remaining    │$570 │      │$4,812 │     │
│    │─────│              │─────│      │ANNUAL │     │
│    │$2,292│ Debts       │     │      │SAVINGS│     │
│    │─────│ Paid Off     │$3,447│     ╰───────╯     │
│    │$570 │              │ P&I │                     │
│    │─────│ Escrow       │     │      ╭───────╮     │
│    │$1,710│             │     │      │ $401  │     │
│    │ P&I │              │     │      │MONTHLY│     │
│    └─────┘              └─────┘      ╰───────╯     │
│    $4,726               $4,171                      │
│    Current              Proposed                    │
│                                                     │
├─────────────────────────────────────────────────────┤
│ Payment Breakdown                                   │
│                         Current    Proposed         │
│ Mortgage P&I            $1,710     $3,447          │
│ Escrow                  $570       $570            │
│ Other Debts             $2,292     $0 (Paid Off)   │
│ Remaining Debts         $154       $154            │
│ ─────────────────────────────────────────────      │
│ TOTAL                   $4,726     $4,171          │
└─────────────────────────────────────────────────────┘
```

**Data Required:**
```javascript
{
  currentMortgagePI: number,
  currentEscrow: number,
  currentMI: number,
  debtsPaidOff: number,      // Monthly payments being eliminated
  debtsRemaining: number,    // Monthly payments NOT being eliminated
  
  proposedPI: number,
  proposedEscrow: number,
  proposedMI: number,
  
  currentTotal: number,
  proposedTotal: number,
  monthlySavings: number,
  annualSavings: number
}
```

**Stacked Bar Calculation:**
```javascript
const maxPayment = Math.max(currentTotal, proposedTotal);
const scale = 200 / maxPayment;  // 200px max height

// Heights
const currentPIHeight = currentMortgagePI * scale;
const currentEscrowHeight = currentEscrow * scale;
// ... etc
```

**Important:** Both Current and Proposed bars must include `debtsRemaining` since borrower pays those either way.

---

### 8.2 Debt Consolidation Worksheet

**Purpose:** Show all debts being paid off

**Layout:**
```
┌─────────────────────────────────────────────────────┐
│           DEBT CONSOLIDATION WORKSHEET              │
├─────────────────────────────────────────────────────┤
│                                                     │
│ Creditor          Type        Monthly    Payoff    │
│ ─────────────────────────────────────────────────  │
│ REGIONS BANK      Mortgage    $1,710   $247,500 ✓  │
│ PENFED            Mortgage    $1,250   $180,000 ✓  │
│ CHASE AUTO        Auto        $450     $18,000  ✓  │
│ 5/3 DIVIDEND      Installment $121     $12,645  ✓  │
│ WFBNA CARD        Revolving   $154     $10,200  ✓  │
│ ... more ...                                        │
│ ─────────────────────────────────────────────────  │
│ TOTAL                         $4,156   $525,314    │
│                                                     │
├─────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────┐ │
│ │            OUR PROMISE                          │ │
│ │                                                 │ │
│ │ ✓ All debts above will be paid at closing      │ │
│ │ ✓ One simple payment moving forward            │ │
│ │ ✓ $4,156/mo in payments eliminated             │ │
│ └─────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
```

**Data Required:**
```javascript
{
  accounts: [
    { creditor: string, accountType: string, payment: number, balance: number }
  ],
  totalPayment: number,
  totalBalance: number
}
```

---

### 8.3 Cash Back

**Purpose:** Show cashout amount and potential uses

**Layout:**
```
┌─────────────────────────────────────────────────────┐
│                   CASH BACK                         │
├─────────────────────────────────────────────────────┤
│                                                     │
│              ╭─────────────╮                        │
│              │             │                        │
│              │   $63,436   │                        │
│              │  CASH BACK  │                        │
│              │             │                        │
│              ╰─────────────╯                        │
│                                                     │
│         Money in your pocket at closing             │
│                                                     │
│  ┌──────────────────────────────────────────────┐  │
│  │ How is this calculated?                      │  │
│  │                                              │  │
│  │ Loan Amount          $588,750                │  │
│  │ − Debts Paid Off    −$525,314                │  │
│  │ ─────────────────────────────                │  │
│  │ = Cash Back          $63,436                 │  │
│  └──────────────────────────────────────────────┘  │
│                                                     │
│  Potential Uses:                                    │
│  🏠 Home Improvements    💰 Emergency Fund         │
│  🎓 Education            🏖️ Vacation               │
└─────────────────────────────────────────────────────┘
```

**Data Required:**
```javascript
{
  cashout: number,
  loanAmount: number,
  debtsPaidOff: number
}
```

---

### 8.4 Cash Flow Window

**Purpose:** Show configurable payment-free period (30-90 days)

**Interactive Control:**
- Days slider (30 to 90 days, step 15)
- Number input for precise entry
- Default: 60 days

**Layout:**
```
┌─────────────────────────────────────────────────────┐
│               CASH FLOW WINDOW                      │
│            60 days payment-free period              │
├─────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────┐ │
│ │ 📅 Adjust Payment-Free Period                   │ │
│ │ Days until first payment:                        │ │
│ │ ─────────────●───────────────────  [60] days    │ │
│ │ 30 days (1 mo)   60 days (2 mo)   90 days (3 mo)│ │
│ └─────────────────────────────────────────────────┘ │
│                                                     │
│              ╭─────────────╮                        │
│              │             │                        │
│              │   $9,312    │                        │
│              │ CASH IN     │                        │
│              │ YOUR POCKET │                        │
│              ╰─────────────╯                        │
│                                                     │
│   2 months × $4,656/mo = $9,312                    │
│                                                     │
│  How It Works (60 Day Window):                      │
│  ✓ Loan closes: All existing payments stop         │
│  ✓ Month 1 & 2: No payments due ($0)              │
│  ✓ Month 3: First new payment ($3,447)            │
│                                                     │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐            │
│  │ Month 1 │  │ Month 2 │  │ Month 3 │            │
│  │   $0    │  │   $0    │  │ $3,447  │            │
│  └─────────┘  └─────────┘  └─────────┘            │
└─────────────────────────────────────────────────────┘
```

**Calculation:**
```javascript
const cashInPocket = currentTotalPayment * 2;  // 2 months
const month3Payment = proposedTotalPayment;
```

---

### 8.5 Break-Even Analysis

**Purpose:** Show time to recoup closing costs

**Layout:**
```
┌─────────────────────────────────────────────────────┐
│              BREAK-EVEN ANALYSIS                    │
├─────────────────────────────────────────────────────┤
│                                                     │
│              ╭─────────────╮                        │
│              │             │                        │
│              │     18      │                        │
│              │   MONTHS    │                        │
│              │             │                        │
│              ╰─────────────╯                        │
│                                                     │
│         Time to recoup closing costs                │
│                                                     │
│  ┌──────────────────────────────────────────────┐  │
│  │ Closing Costs        $8,057                  │  │
│  │ + Points (if any)    $1,800                  │  │
│  │ ─────────────────────────────                │  │
│  │ Total to Recoup      $9,857                  │  │
│  │                                              │  │
│  │ Monthly Savings      $548                    │  │
│  │                                              │  │
│  │ $9,857 ÷ $548 = 18 months                   │  │
│  └──────────────────────────────────────────────┘  │
│                                                     │
│  ✓ Under 2 years = Excellent                       │
└─────────────────────────────────────────────────────┘
```

**Calculation:**
```javascript
const totalCosts = closingCosts + Math.max(0, pointsCost);
const breakEvenMonths = monthlySavings > 0 
  ? Math.ceil(totalCosts / monthlySavings) 
  : Infinity;
```

---

### 8.6 Accelerated Payoff

**Purpose:** Show mortgage payoff acceleration with extra payments

**Interactive Control:**
- Slider to adjust extra payment amount (0% to 100% of savings)
- Default: 100% (full savings applied)

**Layout:**
```
┌─────────────────────────────────────────────────────┐
│             ACCELERATED PAYOFF                      │
├─────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────┐ │
│ │ ⚙️ Adjust Extra Payment Amount                  │ │
│ │ Apply from savings: $657 / $657                 │ │
│ │ ──────────────●───────────────────────────────  │ │
│ │ $0 (None)           100%         $657 (Max)    │ │
│ └─────────────────────────────────────────────────┘ │
│                                                     │
│  Apply $657/mo extra to principal                   │
│                                                     │
│  ╭──────────╮          ╭──────────╮                │
│  │          │          │          │                │
│  │   7.2    │          │ $127,000 │                │
│  │  YEARS   │          │ INTEREST │                │
│  │  SAVED   │          │  SAVED   │                │
│  │          │          │          │                │
│  ╰──────────╯          ╰──────────╯                │
│                                                     │
│  ┌──────────────────────────────────────────────┐  │
│  │                                              │  │
│  │  Original Payoff:    30 years                │  │
│  │  Accelerated:        22.8 years              │  │
│  │  ─────────────────────────────               │  │
│  │  Time Saved:         7.2 years               │  │
│  │                                              │  │
│  │  Total Interest (Original):    $398,000      │  │
│  │  Total Interest (Accelerated): $271,000      │  │
│  │  ─────────────────────────────               │  │
│  │  Interest Saved:               $127,000      │  │
│  └──────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

**Amortization Calculation:**
```javascript
function calculateAcceleratedPayoff(loanAmount, rate, termYears, extraPayment) {
  const monthlyRate = rate / 100 / 12;
  const originalPayment = calculatePI(loanAmount, rate, termYears);
  const totalPayment = originalPayment + extraPayment;
  
  let balance = loanAmount;
  let months = 0;
  let totalInterest = 0;
  
  while (balance > 0 && months < termYears * 12) {
    const interestPayment = balance * monthlyRate;
    const principalPayment = Math.min(totalPayment - interestPayment, balance);
    
    balance -= principalPayment;
    totalInterest += interestPayment;
    months++;
  }
  
  return {
    acceleratedMonths: months,
    acceleratedYears: months / 12,
    yearsSaved: termYears - (months / 12),
    interestPaid: totalInterest,
    interestSaved: calculateTotalInterest(loanAmount, rate, termYears) - totalInterest
  };
}
```

---

### 8.7 Compound Growth

**Purpose:** Show investment potential of monthly savings

**Interactive Control:**
- Interest rate slider (3% to 12%, default 7%)
- Number input for precise rate entry

**Layout:**
```
┌─────────────────────────────────────────────────────┐
│              COMPOUND GROWTH                        │
│         Invest your savings @ 7% annual return      │
├─────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────┐ │
│ │ ⚙️ Adjust Parameters                            │ │
│ │ Interest Rate: ─────────●───────────  [7.0] %  │ │
│ └─────────────────────────────────────────────────┘ │
│                                                     │
│  Invest $401/mo at 7% annual return                 │
│                                                     │
│  ┌─────────┬─────────┬─────────┬─────────┐         │
│  │ 5 Years │10 Years │20 Years │30 Years │         │
│  ├─────────┼─────────┼─────────┼─────────┤         │
│  │ $28,700 │ $69,300 │$209,000 │$489,000 │         │
│  └─────────┴─────────┴─────────┴─────────┘         │
│                                                     │
│  ═══════════════════════════════════════════       │
│  ░░░░░▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓         │
│  ═══════════════════════════════════════════       │
│      Contributions        Interest Earned          │
│                                                     │
│  Total Contributed: $144,360 (30 years)            │
│  Total Interest:    $344,640                       │
│  ─────────────────────────────                     │
│  Final Value:       $489,000                       │
└─────────────────────────────────────────────────────┘
```

**Future Value Calculation:**
```javascript
function calculateFutureValue(monthlyPayment, annualRate, years) {
  const monthlyRate = annualRate / 12;
  const months = years * 12;
  
  // FV of annuity formula
  const fv = monthlyPayment * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
  
  const totalContributed = monthlyPayment * months;
  const interestEarned = fv - totalContributed;
  
  return { futureValue: fv, contributed: totalContributed, interest: interestEarned };
}

// Calculate for each milestone
const milestones = [5, 10, 20, 30].map(years => ({
  years,
  ...calculateFutureValue(monthlySavings, 0.07, years)
}));
```

---

### 8.8 Disposable Income Calculator

**Purpose:** Show how refinancing increases disposable income (income after all payments)

**Interactive Controls:**
- Gross Monthly Income input (editable)
- Tax Rate slider (10% to 45%, step 1%)
- Live calculation of income after taxes

**Layout:**
```
┌─────────────────────────────────────────────────────┐
│          ESTIMATED DISPOSABLE INCOME                │
│      Compare your take-home income before and after │
├─────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────┐ │
│ │ ⚙️ Enter Your Income Details                    │ │
│ │                                                  │ │
│ │ Gross Monthly Income      Estimated Tax Rate    │ │
│ │ $ [12,000]                ────●─────── [25] %   │ │
│ │                                                  │ │
│ │ ┌──────────────────────────────────────────┐   │ │
│ │ │ Income After Taxes            $9,000/mo  │   │ │
│ │ └──────────────────────────────────────────┘   │ │
│ └─────────────────────────────────────────────────┘ │
│                                                     │
│ ┌─────────────────────────────────────────────────┐ │
│ │                         Current    Proposed     │ │
│ │ ─────────────────────────────────────────────── │ │
│ │ Monthly Income          $12,000    $12,000      │ │
│ │ Income After Taxes      $9,000     $9,000       │ │
│ │ Mortgage Payment        $1,710     $3,499       │ │
│ │ Other Monthly Payments  $2,446     $0           │ │
│ │ ─────────────────────────────────────────────── │ │
│ │ Disposable Income ($)   $4,844     $5,501       │ │
│ │ Disposable Income (%)   53.8%      61.1%        │ │
│ └─────────────────────────────────────────────────┘ │
│                                                     │
│ ╭─────────────────────────────────────────────────╮ │
│ │     Increase in Disposable Income               │ │
│ │                                                 │ │
│ │        +7.3%           |        +$657          │ │
│ │   Percentage Increase  |   Monthly Increase    │ │
│ ╰─────────────────────────────────────────────────╯ │
└─────────────────────────────────────────────────────┘
```

**Calculation:**
```javascript
// Income after taxes
const incomeAfterTaxes = grossMonthlyIncome * (1 - taxRate / 100);

// Current disposable
const currentMortgagePmt = analysisData.currentMortgagePI || 1710;
const currentOtherDebtPmt = analysisData.debtsPaidOff || 2446;
const currentDisposable = incomeAfterTaxes - currentMortgagePmt - currentOtherDebtPmt;
const currentDisposablePct = (currentDisposable / incomeAfterTaxes) * 100;

// Proposed disposable (debts paid off)
const proposedMortgagePmt = analysisData.proposedPI || 3499;
const proposedOtherDebtPmt = analysisData.debtsRemaining || 0;
const proposedDisposable = incomeAfterTaxes - proposedMortgagePmt - proposedOtherDebtPmt;
const proposedDisposablePct = (proposedDisposable / incomeAfterTaxes) * 100;

// Increase
const disposableIncrease = proposedDisposable - currentDisposable;
const disposableIncreasePct = proposedDisposablePct - currentDisposablePct;
```

**Data Required:**
```javascript
{
  grossMonthlyIncome: number,  // User input (default from borrower data)
  taxRate: number,             // User input (default 25%)
  currentMortgagePI: number,   // From present breakdown
  debtsPaidOff: number,        // Monthly payments of selected debts
  proposedPI: number,          // New mortgage P&I
  debtsRemaining: number       // Debts not being paid off
}
```

---

## 9. Proposal Document Generator

### 9.1 Document Layout

```
┌─────────────────────────────────────────────────────┐
│                    goodleap                         │
│                                                     │
│  LOAN PROPOSAL FOR          PROVIDED BY             │
│  Ken Customer               Test QA LO              │
│  1111 Test St               Mortgage Specialist     │
│  North Las Vegas, NV        949-555-5555            │
│  89033                      qa@goodleap.com         │
│                             NMLS# 123456            │
│                                                     │
├─────────────────────────────────────────────────────┤
│                  LOAN PROPOSAL                      │
├─────────────────────────────────────────────────────┤
│                      Current    Proposed Loan       │
│  Loan Program/Term   XX Year*   XX Year Fixed      │
│  * (dynamically set from currentTerm/term values)  │
│  Interest Rate       3.75%      6.875%             │
│  APR                 —          7.125%             │
│  Principal & Int.    $1,710     $3,447             │
│  Mortgage Insurance  $0         $125               │
│  Total Payment       $4,572     $4,171             │
│                                                     │
│  * Your actual rate, payment and costs could be    │
│    higher. Get an official Loan Estimate.          │
│                                                     │
├─────────────────────────────────────────────────────┤
│                  Your Benefits                      │
├─────────────────────────────────────────────────────┤
│                  PROPOSED LOAN                      │
├─────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐          │
│  │   [Chart 1]     │  │   [Chart 2]     │          │
│  │   Mini Version  │  │   Mini Version  │          │
│  └─────────────────┘  └─────────────────┘          │
│                                                     │
├─────────────────────────────────────────────────────┤
│ GoodLeap, LLC. NMLS# 30336        Confidential  P1 │
└─────────────────────────────────────────────────────┘
```

### 9.2 Mini Chart Components

Each chart needs a compact version for the proposal:

```jsx
// Render mini version based on chart type
function MiniChart({ chartId, data }) {
  switch (chartId) {
    case 'payment-savings':
      return <PaymentSavingsMini data={data} />;
    case 'debt-consolidation':
      return <DebtConsolidationMini data={data} />;
    case 'cash-back':
      return <CashBackMini data={data} />;
    case 'cash-flow-window':
      return <CashFlowMini data={data} />;
    case 'break-even':
      return <BreakEvenMini data={data} />;
    case 'accelerated-payoff':
      return <AcceleratedPayoffMini data={data} />;
    case 'compound-growth':
      return <CompoundGrowthMini data={data} />;
    default:
      return null;
  }
}
```

### 9.3 Export Options

- **Print:** `window.print()` with print-optimized CSS
- **Download PDF:** Use html2pdf.js or similar library

---

## 10. State Management

### 10.1 Key State Variables

```javascript
// Pricing state
const [isPriced, setIsPriced] = useState(false);
const [isRunningPricing, setIsRunningPricing] = useState(false);

// Loan configuration
const [program, setProgram] = useState('Conventional');
const [selectedLTV, setSelectedLTV] = useState(null);
const [manualCashout, setManualCashout] = useState(null);
const [selectedRateOption, setSelectedRateOption] = useState(2);  // Par rate

// Escrow
const [includeEscrow, setIncludeEscrow] = useState(true);

// Property value (editable, defaults from AVM)
const [propertyValue, setPropertyValue] = useState(borrowerData?.property?.avmValue || 950000);

// Present values (editable)
const [currentPI, setCurrentPI] = useState(1710);
const [currentTaxes, setCurrentTaxes] = useState(450);
const [currentInsurance, setCurrentInsurance] = useState(120);
const [currentMIP, setCurrentMIP] = useState(0);
const [currentBalance, setCurrentBalance] = useState(247500);
const [currentRate, setCurrentRate] = useState(3.75);
const [currentTerm, setCurrentTerm] = useState(30);  // 10, 15, 20, or 30 years

// GoodLeap loan
const [goodLeapSelected, setGoodLeapSelected] = useState(true);

// Chart selections
const [moduleSelections, setModuleSelections] = useState({
  'debt-consolidation': false,
  'payment-savings': false,
  'cash-back': false,
  'cash-flow-window': false,
  'break-even': false,
  'accelerated-payoff': false,
  'compound-growth': false
});
```

### 10.2 Re-Pricing Triggers

**Must reset `isPriced = false` when ANY of these change:**

1. ✅ Account selection changes (willPay toggle)
2. ✅ Account values change (balance, payment, rate)
3. ✅ Program changes
4. ✅ LTV selection changes
5. ✅ Manual cashout/loan amount changes
6. ✅ GoodLeap loan toggle
7. ✅ Escrow toggle
8. ✅ Property value changes

```javascript
const resetPricing = () => {
  if (isPriced) {
    setIsPriced(false);
    setModuleSelections({
      'debt-consolidation': false,
      'payment-savings': false,
      'cash-back': false,
      'cash-flow-window': false,
      'break-even': false,
      'accelerated-payoff': false,
      'compound-growth': false
    });
  }
};

// Use effect to detect account changes from parent
useEffect(() => {
  // Check if any account changed
  // Call resetPricing() if so
}, [accounts]);

// Wrapper functions for state updates
const updateProgram = (newProgram) => {
  setProgram(newProgram);
  setSelectedLTV(null);
  resetPricing();
};
```

---

## 11. Technical Requirements

### 11.1 Dependencies

```json
{
  "dependencies": {
    "react": "^18.x",
    "lucide-react": "^0.x",
    "tailwind-merge": "^2.x",
    "clsx": "^2.x"
  },
  "devDependencies": {
    "tailwindcss": "^3.x"
  }
}
```

### 11.2 Utility Functions

```javascript
// Currency formatter
const fmt = (n) => new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0
}).format(n);

// Parse currency string to number
const parseAmount = (val) => 
  typeof val === 'number' 
    ? val 
    : parseFloat(String(val).replace(/[$,]/g, '')) || 0;

// P&I calculation
const calculatePI = (balance, annualRate, termYears = 30) => {
  const r = annualRate / 100 / 12;
  const n = termYears * 12;
  return Math.round(balance * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
};

// CN utility for conditional classes
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
```

### 11.3 Component Props Interface

```typescript
interface GoodLeapAdvantageProps {
  accounts: Account[];
  borrowerData: BorrowerData;
  onExit: () => void;
  onViewChart: (chartType: string, data: ChartData) => void;
  onGenerateProposal: (selectedCharts: string[], data: ChartData) => void;
  onAccountToggle: (accountId: number) => void;
  onAccountUpdate: (accountId: number, field: string, value: string) => void;
  onToggleAll: (checked: boolean) => void;
}

interface Account {
  id: number;
  creditor: string;
  accountType: string;
  balance: string;  // "$247,500"
  payment: string;  // "$1,710"
  rate: string;     // "3.75%"
  willPay: boolean;
}

interface ChartData {
  // Current breakdown
  currentMortgagePI: number;
  currentEscrow: number;
  currentMI: number;
  debtsPaidOff: number;
  debtsRemaining: number;
  
  // Current loan info
  currentRate: number;           // e.g., 3.75
  currentTerm: number;           // 10, 15, 20, or 30 years
  
  // Proposed breakdown
  proposedPI: number;
  proposedEscrow: number;
  proposedMI: number;
  
  // Totals
  currentTotal: number;
  proposedTotal: number;
  monthlySavings: number;
  annualSavings: number;
  
  // Loan details
  newLoanAmount: number;
  ltv: number;
  cashout: number;
  rate: number;                  // Proposed rate
  term: number;                  // Proposed term (15 or 30)
  closingCosts: number;
  breakEvenMonths: number;
  
  // Accounts
  accounts: Account[];
}
```

---

## 12. Acceptance Criteria

### 12.1 Functional Requirements

- [ ] LO can select/deselect debts to consolidate
- [ ] LO can edit balance, payment, rate for any liability
- [ ] LO can select loan program (Conv, FHA, VA, etc.)
- [ ] LO can select LTV from presets or edit loan/cashout directly
- [ ] System shows real-time Present vs Proposed comparison
- [ ] System calculates MI/MIP based on program and LTV
- [ ] Value propositions are grouped by "Providing Value" vs "No Value"
- [ ] Recommendation engine highlights top benefits
- [ ] LO can select up to 2 charts for proposal
- [ ] System generates printable proposal document

### 12.2 UI/UX Requirements

- [ ] 3-column responsive layout
- [ ] Editable fields have clear visual treatment
- [ ] Progress bar shows current step
- [ ] Value propositions locked until pricing complete
- [ ] **Debts column auto-collapses when pricing completes**
- [ ] **Debts column shows summary when collapsed (200px width)**
- [ ] **Debts column can be manually expanded/collapsed via header toggle**
- [ ] Chart preview flyover works for each chart
- [ ] Proposal document is print-ready

### 12.3 Edge Cases

- [ ] Handle zero or negative savings gracefully
- [ ] Handle no debts selected
- [ ] Handle LTV below minimum required
- [ ] Handle missing rate data (show placeholder)
- [ ] Handle FHA UFMIP in loan amount display

---

## 13. Appendix

### 13.1 Color Palette

| Use | Tailwind Class | Hex |
|-----|---------------|-----|
| Primary Action | amber-500 | #F59E0B |
| Success/Savings | teal-500 | #14B8A6 |
| Warning/Review | amber-500 | #F59E0B |
| Negative/Loss | rose-500 | #F43F5E |
| Neutral Text | stone-800 | #292524 |
| Muted Text | stone-500 | #78716C |
| Background | stone-50 | #FAFAF9 |
| Card Border | stone-200 | #E7E5E4 |

### 13.2 File Structure

```
src/
├── components/
│   └── advantage/
│       ├── GoodLeapAdvantageTabs.jsx    # Main component
│       ├── ChartPreview.jsx             # Full chart views
│       ├── ProposalDocument.jsx         # Proposal generator
│       └── charts/
│           ├── PaymentSavingsChart.jsx
│           ├── DebtConsolidationChart.jsx
│           ├── CashBackChart.jsx
│           ├── CashFlowChart.jsx
│           ├── BreakEvenChart.jsx
│           ├── AcceleratedPayoffChart.jsx
│           └── CompoundGrowthChart.jsx
```

---

**End of PRD**

