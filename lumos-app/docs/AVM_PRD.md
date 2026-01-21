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
    "value": 747000,
    "confidence": "Medium",
    "reason": "Average of 11 sources"
  },
  "value_options": {
    "conservative": {
      "value": 700000,
      "label": "✅ Conservative",
      "description": "Lowest value - safest for AUS"
    },
    "blended": {
      "value": 747000,
      "label": "Average",
      "description": "Average of 11 sources"
    },
    "aggressive": {
      "value": 780000,
      "label": "⚠️ Highest",
      "description": "May exceed appraisal"
    }
  },
  "source_comparison": {
    "total_sources": 11,
    "variance_percent": 10,
    "all_sources": [
      { "name": "Internal AVM", "value": 750000, "type": "internal" },
      { "name": "Zillow", "value": 770000, "type": "external", "reasoning": "..." },
      { "name": "Redfin", "value": 750000, "type": "external", "reasoning": "..." }
    ]
  },
  "piw_calculations": {
    "primary_value": 747000,
    "rate_term_max": 672300,
    "cash_out_max": 597600,
    "piw_eligible": true,
    "notes": "PIW may be available"
  },
  "methodology": "Based on area market data and property characteristics",
  "disclaimer": "* Values are estimates based on historical data and may not reflect current market conditions. Always verify with current listings."
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
You are a real estate valuation expert. You know property values in Texas markets. 
Always provide numeric values based on your knowledge. Return JSON only.
```

### User Prompt Template

```
What would be the home value for this property on each platform?

Address: {fullAddress}
Square Feet: {sqft}
Bedrooms: {beds}
Bathrooms: {baths}
Year Built: {yearBuilt}

Provide the value each platform would show AND explain how you calculated it:

1. Zillow
2. Redfin
3. Realtor.com
4. Homes.com
5. Trulia
6. Opendoor
7. Offerpad
8. Homelight
9. Knock
10. Orchard

Return JSON:
{
  "sources": [
    { "name": "Zillow", "value": number, "reasoning": "how you calculated this" },
    { "name": "Redfin", "value": number, "reasoning": "how you calculated this" },
    { "name": "Realtor.com", "value": number, "reasoning": "how you calculated this" },
    { "name": "Homes.com", "value": number, "reasoning": "how you calculated this" },
    { "name": "Trulia", "value": number, "reasoning": "how you calculated this" },
    { "name": "Opendoor", "value": number, "reasoning": "how you calculated this" },
    { "name": "Offerpad", "value": number, "reasoning": "how you calculated this" },
    { "name": "Homelight", "value": number, "reasoning": "how you calculated this" },
    { "name": "Knock", "value": number, "reasoning": "how you calculated this" },
    { "name": "Orchard", "value": number, "reasoning": "how you calculated this" }
  ],
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
