# GoodLeap AVM - Product Requirements Document

## Overview

The GoodLeap AVM (Automated Valuation Model) provides property valuations from multiple sources to support AUS (Automated Underwriting System) submissions and PIW (Property Inspection Waiver) optimization.

## Purpose

Help mortgage sales teams obtain accurate property valuations by aggregating estimates from 10+ sources, enabling confident AUS submissions and maximizing PIW eligibility.

---

## Data Sources

| Source | Type | Description |
|--------|------|-------------|
| **Internal AVM** | Actual | GoodLeap's internal valuation model |
| **Zillow** | External | Zestimate - market-based algorithm |
| **Redfin** | External | Typically slightly conservative |
| **Realtor.com** | External | MLS-based estimate |
| **Homes.com** | External | Consumer-focused estimate |
| **Trulia** | External | Zillow-owned platform |
| **Opendoor** | External | iBuyer - typically 5-10% below market |
| **Offerpad** | External | iBuyer cash offer estimate |
| **Homelight** | External | Agent-based estimate |
| **Knock** | External | Trade-in value |
| **Orchard** | External | Move-first value |

---

## Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Frontend UI   │────▶│   API Server    │────▶│    GPT-4o       │
│  (React/Vite)   │     │  (Express.js)   │     │   (OpenAI)      │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        │                       │                       │
        │                       │                       │
        ▼                       ▼                       ▼
   Displays values       Processes request        Returns estimated
   System auto-selects   Adds internal AVM        values for 10 sources
   conservative for AUS  Calculates stats         with reasoning
```

---

## API Specification

### Endpoint

```
POST /api/ai/avm
```

### Request Body

```json
{
  "address": "2116 Shrewsbury Dr",
  "city": "McKinney",
  "state": "TX",
  "zip": "75071",
  "livingArea": 3850,
  "bedrooms": 5,
  "bathrooms": 4.5,
  "yearBuilt": 2017,
  "internalValue": 750000
}
```

### Response

```json
{
  "aus_recommended": {
    "value": 700000,
    "confidence": "Moderate",
    "reason": "Conservative value from 11 sources for AUS submission"
  },
  "value_options": {
    "conservative": {
      "value": 700000,
      "label": "✅ Conservative (AUS)",
      "description": "Lowest value - recommended for AUS submission"
    },
    "blended": {
      "value": 747000,
      "label": "Most Likely",
      "description": "AI estimated market value from 11 sources"
    },
    "aggressive": {
      "value": 780000,
      "label": "⚠️ Highest",
      "description": "May exceed appraisal - use with caution"
    }
  },
  "source_comparison": {
    "total_sources": 11,
    "variance_percent": 10,
    "all_sources": [
      { "name": "Internal AVM", "value": 750000, "type": "internal", "reasoning": "GoodLeap internal model" },
      { "name": "Zillow", "value": 770000, "type": "external", "reasoning": "Zestimate based on..." },
      { "name": "Redfin", "value": 750000, "type": "external", "reasoning": "Conservative estimate..." },
      { "name": "Opendoor", "value": 700000, "type": "external", "reasoning": "iBuyer 8% below market..." }
    ]
  },
  "underwriting_readiness": {
    "multiple_sources": true,
    "has_actual_sources": true,
    "variance_within_tolerance": true,
    "suitable_for_aus": "Yes"
  },
  "piw_calculations": {
    "primary_value": 747000,
    "rate_term_max": 672300,
    "cash_out_max": 597600,
    "piw_eligible": true,
    "notes": "PIW may be available based on value and property type"
  },
  "avm_analysis": {
    "low_estimate": 700000,
    "high_estimate": 780000,
    "most_likely_value": 747000,
    "confidence": "Moderate",
    "justification": "Strong agreement across 11 sources with 10% variance"
  },
  "methodology": "Based on area market data, comparable sales, and platform-specific algorithms",
  "disclaimer": "* Values are estimates based on AI analysis and historical data. May not reflect current market conditions."
}
```

---

## PIW Calculations

| Calculation | Formula | Example ($747K value) |
|-------------|---------|----------------------|
| **Rate & Term Max** | Value × 90% | $672,300 |
| **Cash-Out Max** | Value × 80% | $597,600 |
| **PIW Eligible** | Value < $1,000,000 | ✅ Yes |

> **Note:** PIW is not available for properties valued over $999,999.

---

## UI Components

### Value Options Display

The system displays three value tiers for reference:

| Option | Description | AUS Usage |
|--------|-------------|-----------|
| **Conservative** | Lowest value from all sources | ✅ **Auto-selected for AUS** |
| **Average/Blended** | Mean of all sources | Reference only |
| **Aggressive** | Highest value | ⚠️ May exceed appraisal |

> **Important:** The Conservative value is automatically used for AUS submissions. This is a system decision, not user-selected, to ensure underwriting safety.

### Source Display

- Shows all sources with values
- **Green badge**: Internal/verified sources
- **Blue badge**: External estimates
- Displays reasoning for each value

### Underwriting Readiness

Checks:
- ✅ Multiple sources present
- ✅ Actual sources found
- ✅ Variance within tolerance (<15%)
- Overall suitability for AUS

---

## Data Flow

1. **User loads property** → Frontend sends property details to API
2. **API receives request** → Extracts property details
3. **GPT-4o called** → Returns estimated values for 10 platforms with reasoning
4. **API processes** → Adds internal AVM, calculates stats
5. **Response returned** → UI displays all sources and recommendations
6. **System provides AUS value** → Conservative value auto-selected for AUS submission

> **Note:** The AUS recommended value is automatically calculated by the system (not user-selected) using the conservative approach for underwriting safety.

---

## GPT-4 Prompt

### System Prompt

```
You are an AI valuation tool for a mortgage sales team. Your objective is to deliver 
accurate, defensible, AVM-based residential property valuations to support AUS 
(Automated Underwriting System) submissions and maximize the probability of a 
Property Inspection Waiver (PIW).

PRIORITY: Credibility, data consistency, and CONSERVATIVE optimization for 
underwriting outcomes.

VALUATION RULES:
- Anchor to the most DEFENSIBLE value for underwriting, NOT the highest
- Favor tighter ranges when values cluster
- Widen ranges when values diverge
- iBuyers (Opendoor, Offerpad) typically offer 5-10% below market
- If value exceeds $999,999, PIW eligibility is unlikely

AUS OPTIMIZATION:
- Prefer values with strong alignment across sources
- Avoid values significantly above recent closed comps
- Use conservative rounding for AUS submissions

Return JSON only.
```

### User Prompt Template

```
Provide property valuations for AUS submission and PIW optimization.

PROPERTY DETAILS:
Address: {fullAddress}
Square Feet: {sqft}
Bedrooms: {beds}
Bathrooms: {baths}
Year Built: {yearBuilt}

Estimate what each platform would show for this property and explain your reasoning:

1. Zillow (Zestimate - typically market-aligned)
2. Redfin (usually slightly conservative)
3. Realtor.com (MLS-based)
4. Homes.com (consumer estimate)
5. Trulia (Zillow-owned, similar to Zestimate)
6. Opendoor (iBuyer - typically 5-10% below market)
7. Offerpad (iBuyer cash offer)
8. Homelight (agent-based estimate)
9. Knock (trade-in value)
10. Orchard (move-first value)

Return JSON:
{
  "sources": [
    { "name": "Zillow", "value": number, "reasoning": "explanation" },
    { "name": "Redfin", "value": number, "reasoning": "explanation" },
    { "name": "Realtor.com", "value": number, "reasoning": "explanation" },
    { "name": "Homes.com", "value": number, "reasoning": "explanation" },
    { "name": "Trulia", "value": number, "reasoning": "explanation" },
    { "name": "Opendoor", "value": number, "reasoning": "explanation" },
    { "name": "Offerpad", "value": number, "reasoning": "explanation" },
    { "name": "Homelight", "value": number, "reasoning": "explanation" },
    { "name": "Knock", "value": number, "reasoning": "explanation" },
    { "name": "Orchard", "value": number, "reasoning": "explanation" }
  ],
  "avm_estimate": {
    "low_estimate": number,
    "high_estimate": number,
    "most_likely_value": number,
    "confidence": "Low|Moderate|High",
    "justification": "one sentence explaining data quality and AVM agreement"
  },
  "aus_recommendation": {
    "primary_piw_value": number,
    "alternate_lower_value": number,
    "rate_term_max_90pct": number,
    "cash_out_max_80pct": number,
    "piw_eligible": boolean,
    "notes": "any caveats for underwriting"
  },
  "methodology": "brief explanation of overall approach"
}
```

### Model Settings

| Setting | Value |
|---------|-------|
| Model | `gpt-4o` |
| Temperature | `0` (deterministic) |
| Response Format | `json_object` |

---

## Property Tester Tool

A testing tool is available for QA and validation purposes.

### Access

**Sidebar → Testing → Property Tester**

Or navigate to the `propertyTester` view.

### Features

| Field | Description | Example |
|-------|-------------|---------|
| **Street Address** | Property street address | 2116 Shrewsbury Dr |
| **City** | City name | McKinney |
| **State** | State code | TX |
| **ZIP Code** | ZIP code | 75071 |
| **Square Feet** | Living area in sq ft | 3850 |
| **Bedrooms** | Number of bedrooms | 5 |
| **Bathrooms** | Number of bathrooms | 4.5 |
| **Year Built** | Year property was built | 2017 |
| **Internal AVM** | Optional internal value | 750000 (or 0 to exclude) |

### Test Output

The tester displays:
- **Valuation Summary** - Conservative, Average, Highest values
- **All Sources** - All 10+ sources with values and reasoning
- **PIW Calculations** - Rate & Term Max (90%), Cash-Out Max (80%)
- **Methodology** - How GPT-4o calculated values
- **Raw JSON Response** - Expandable technical view for debugging

### Use Cases

1. **Test different addresses** - Verify values for various properties
2. **Test without internal AVM** - Set to 0 to see external-only values
3. **Debug API responses** - View raw JSON for troubleshooting
4. **Validate PIW calculations** - Confirm 90%/80% calculations

---

## Technical Implementation

### Files

| File | Purpose |
|------|---------|
| `api/ai/avm.js` | API endpoint handler |
| `src/components/dashboard/GoodLeapAVM.jsx` | React UI component |
| `src/components/dashboard/PropertyTester.jsx` | Testing/QA tool |
| `src/services/avmWebSearch.js` | Frontend service layer |

### Dependencies

- **OpenAI GPT-4o** - For generating property value estimates
- **Express.js** - API server
- **React** - Frontend UI
- **Zod** - Schema validation

### Environment Variables

```
OPENAI_API_KEY=sk-...
```

---

## Disclaimer

```
* Values are estimates based on historical data and may not reflect 
  current market conditions. Always verify with current listings.
```

---

## Future Enhancements

1. **Real-time data** - Integrate with property data APIs (ATTOM, CoreLogic)
2. **Comparable sales** - Show recent sales in the area
3. **Confidence scoring** - AI-powered confidence based on data freshness
4. **Historical tracking** - Track value changes over time
5. **Appraisal comparison** - Compare estimates to actual appraisals

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Jan 2026 | Initial release with GPT-4o estimates |
