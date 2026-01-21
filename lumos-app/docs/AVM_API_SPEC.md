# GoodLeap AVM API - Complete Specification

## Overview

AI-powered property valuation for AUS (Automated Underwriting System) submissions and PIW (Property Inspection Waiver) optimization.

---

## API Endpoint

```
POST /api/ai/avm
```

---

## Request Body (What You Send)

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

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `address` | string | Yes | Street address |
| `city` | string | Yes | City name |
| `state` | string | Yes | State code (e.g., TX) |
| `zip` | string | Yes | ZIP code |
| `livingArea` | number | Yes | Square footage |
| `bedrooms` | number | Yes | Number of bedrooms |
| `bathrooms` | number | Yes | Number of bathrooms |
| `yearBuilt` | number | Yes | Year property was built |
| `internalValue` | number | No | Your internal AVM value (0 to exclude) |

---

## GPT-4o System Prompt

```
You are an AI valuation tool for a mortgage sales team.
Your goal is to provide accurate, AVM-based home valuations to help run AUS (Freddie Mac / Fannie Mae) and maximize the chance of a Property Inspection Waiver (PIW).

RULES:
- Cross-reference values for consistency
- Use null where information is unavailable
- Never fabricate data
- Anchor to most DEFENSIBLE value for underwriting
- iBuyers (Opendoor, Offerpad) typically offer 5-10% below market
- PIWs are NOT given when estimated value exceeds $999,999

Return JSON only. Professional, factual tone.
```

---

## GPT-4o User Prompt

```
Analyze this property for AUS submission and PIW optimization.

ADDRESS: {fullAddress}
SQUARE FEET: {sqft}
BEDROOMS: {beds}
BATHROOMS: {baths}
YEAR BUILT: {yearBuilt}

Provide complete analysis in this JSON structure:

{
  "property_details": {
    "normalized_address": "full normalized address",
    "city": "city",
    "state": "state",
    "zip": "zip",
    "county": "county if known or null",
    "neighborhood": "subdivision or neighborhood if known",
    "lot_size": "lot size if known or null",
    "living_area_sqft": number,
    "bedrooms": number,
    "bathrooms": number,
    "year_built": number,
    "stories": "number or null",
    "construction": "type or null",
    "last_sale_date": "date or null",
    "last_sale_price": number or null,
    "hoa_monthly": number or null,
    "tax_assessed_value": number or null,
    "tax_year": number or null,
    "annual_tax": number or null
  },
  "source_valuations": [
    { "name": "Zillow", "value": number, "notes": "Zestimate context" },
    { "name": "Redfin", "value": number, "notes": "AVM context" },
    { "name": "Realtor.com", "value": number, "notes": "estimate context" },
    { "name": "Homes.com", "value": number, "notes": "value range context" },
    { "name": "Trulia", "value": number, "notes": "context" },
    { "name": "Xome", "value": number or null, "notes": "if available" },
    { "name": "Opendoor", "value": number, "notes": "iBuyer ~5-10% below market" },
    { "name": "Offerpad", "value": number, "notes": "iBuyer cash offer" },
    { "name": "Homelight", "value": number, "notes": "agent-based" },
    { "name": "Knock", "value": number, "notes": "trade-in value" }
  ],
  "valuation_context": "Short context sentence about source consistency or variance",
  "avm_estimate": {
    "low_estimate": number,
    "high_estimate": number,
    "most_likely_as_is_value": number,
    "confidence": "Low|Moderate|High",
    "justification": "One sentence explaining data quality and AVM agreement"
  },
  "piw_recommendation": {
    "primary_piw_value": number,
    "alternate_lower_value": number,
    "rate_term_max_90pct": number,
    "cash_out_max_70pct": number,
    "piw_eligible": boolean,
    "piw_notes": "PIW eligibility note"
  }
}
```

---

## Model Settings

| Setting | Value |
|---------|-------|
| Model | `gpt-4o` |
| Temperature | `0` (deterministic) |
| Response Format | `json_object` |

---

## Response (What You Get Back)

```json
{
  "property_details": {
    "address": "2116 Shrewsbury Dr, McKinney, TX 75071",
    "city": "McKinney",
    "state": "TX",
    "zip": "75071",
    "county": "Collin County",
    "neighborhood": "Auburn Hills",
    "lot_size": "0.25 acres",
    "living_area_sqft": 3850,
    "bedrooms": 5,
    "bathrooms": 4.5,
    "year_built": 2017,
    "stories": 2,
    "construction": "Wood Frame / Brick",
    "last_sale_date": "2017-09-15",
    "last_sale_price": 523700,
    "hoa_monthly": 150,
    "tax_assessed_value": 771565,
    "tax_year": 2024,
    "annual_tax": 12182
  },

  "source_comparison": {
    "source1": { "label": "Internal AVM", "value": 750000, "notes": "GoodLeap internal valuation model", "found_actual": true },
    "source2": { "label": "Zillow", "value": 785000, "notes": "Zestimate based on recent sales", "found_actual": true },
    "source3": { "label": "Redfin", "value": 770000, "notes": "Conservative AVM estimate", "found_actual": true },
    "source4": { "label": "Realtor.com", "value": 780000, "notes": "MLS-based estimate", "found_actual": true },
    "source5": { "label": "Homes.com", "value": 775000, "notes": "Consumer estimate", "found_actual": true },
    "total_sources": 11,
    "actual_sources_found": 11,
    "value_range": { "min": 700000, "max": 785000 },
    "variance_percent": 11,
    "valuation_context": "Strong agreement across sources with 11% variance",
    "all_sources": [
      { "name": "Internal AVM", "value": 750000, "type": "internal", "notes": "GoodLeap internal valuation model" },
      { "name": "Zillow", "value": 785000, "type": "external", "notes": "Zestimate based on recent sales in Auburn Hills" },
      { "name": "Redfin", "value": 770000, "type": "external", "notes": "Conservative estimate accounting for market conditions" },
      { "name": "Realtor.com", "value": 780000, "type": "external", "notes": "MLS-based comparable analysis" },
      { "name": "Homes.com", "value": 775000, "type": "external", "notes": "Consumer-facing estimate" },
      { "name": "Trulia", "value": 782000, "type": "external", "notes": "Zillow-owned, similar methodology" },
      { "name": "Xome", "value": 765000, "type": "external", "notes": "Auction-based estimate" },
      { "name": "Opendoor", "value": 710000, "type": "external", "notes": "iBuyer offer ~8% below market" },
      { "name": "Offerpad", "value": 700000, "type": "external", "notes": "iBuyer cash offer, conservative" },
      { "name": "Homelight", "value": 778000, "type": "external", "notes": "Agent-network based estimate" },
      { "name": "Knock", "value": 720000, "type": "external", "notes": "Trade-in program value" }
    ]
  },

  "avm_estimate": {
    "low_estimate": 700000,
    "high_estimate": 785000,
    "most_likely_as_is_value": 765000,
    "confidence": "Moderate",
    "justification": "Strong AVM agreement with 11% variance across 11 sources; recent comps support $200/sqft"
  },

  "piw_recommendation": {
    "primary_piw_value": 765000,
    "alternate_lower_value": 700000,
    "rate_term_max_90pct": 688500,
    "cash_out_max_70pct": 535500,
    "piw_eligible": true,
    "piw_notes": "PIW may be available based on value and property type"
  },

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
      "value": 765000,
      "label": "Most Likely As-Is",
      "description": "AI estimated market value from 11 sources"
    },
    "aggressive": {
      "value": 785000,
      "label": "⚠️ Highest",
      "description": "May exceed appraisal - use with caution"
    }
  },

  "underwriting_readiness": {
    "multiple_sources": true,
    "has_actual_sources": true,
    "variance_within_tolerance": true,
    "suitable_for_aus": "Yes"
  },

  "important_notes": [
    "Found 11 valuation sources",
    "AUS Recommended: $700,000 (conservative)",
    "Most Likely As-Is: $765,000",
    "Range: $700,000 - $785,000"
  ],

  "disclaimer": "* Values are estimates based on AI analysis. Always verify with current listings.",

  "piw_calculations": {
    "primary_value": 765000,
    "rate_term_max": 688500,
    "cash_out_max": 535500,
    "piw_eligible": true,
    "notes": "PIW may be available"
  }
}
```

---

## Response Structure Summary

### Section 1: Property Details
Property information normalized and enriched by AI.

### Section 2: Source Comparison
All valuation sources with their estimates and notes.

### Section 3: AVM Estimate (Required)
AI's synthesized valuation opinion:
- **Low Estimate**: Conservative floor
- **High Estimate**: Ceiling
- **Most Likely As-Is Value**: Best estimate for market value
- **Confidence**: Low / Moderate / High
- **Justification**: One sentence rationale

### Section 4: PIW Recommendation
Values optimized for AUS/PIW:
- **Primary PIW Value**: Main value to submit
- **Alternate Lower Value**: Fallback conservative value
- **Rate/Term Max (90%)**: Max loan for rate/term refi
- **Cash-Out Max (70%)**: Max loan for cash-out refi
- **PIW Eligible**: Boolean (false if value > $999,999)

---

## PIW Calculation Rules

| Type | Formula | Description |
|------|---------|-------------|
| **Rate & Term** | Value × 90% | Max loan amount for rate/term refinance |
| **Cash-Out** | Value × 70% | Max loan amount for cash-out refinance |

> **⚠️ PIW Threshold:** PIWs are NOT given when estimated value exceeds $999,999.

---

## AUS Recommended Value

The system automatically selects the **conservative (lowest)** value for AUS submission. This is not user-selected—it's a system decision to ensure underwriting safety.

| Value Type | Use Case |
|------------|----------|
| **Conservative** | ✅ Use for AUS submission |
| **Most Likely** | Reference / market estimate |
| **Aggressive** | ⚠️ Caution - may exceed appraisal |

---

## Error Response

```json
{
  "error": "Error message",
  "errorCode": "API_ERROR"
}
```

| Error Code | Description |
|------------|-------------|
| `API_KEY_MISSING` | OpenAI API key not configured |
| `API_ERROR` | General API error |

---

## Example cURL Request

```bash
curl -X POST https://your-domain.com/api/ai/avm \
  -H "Content-Type: application/json" \
  -d '{
    "address": "2116 Shrewsbury Dr",
    "city": "McKinney",
    "state": "TX",
    "zip": "75071",
    "livingArea": 3850,
    "bedrooms": 5,
    "bathrooms": 4.5,
    "yearBuilt": 2017,
    "internalValue": 750000
  }'
```

---

## Files

| File | Purpose |
|------|---------|
| `api/ai/avm.js` | API endpoint handler |
| `src/components/dashboard/GoodLeapAVM.jsx` | Main UI component |
| `src/components/dashboard/PropertyTester.jsx` | Testing tool |
| `src/services/avmWebSearch.js` | Frontend service |

---

## Environment Variables

```
OPENAI_API_KEY=sk-...
```
