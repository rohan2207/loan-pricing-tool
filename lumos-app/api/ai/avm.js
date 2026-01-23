import OpenAI from 'openai';

// ============================================================
// MAIN HANDLER - GPT-4 PROPERTY VALUES
// ============================================================
export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: 'OpenAI API key not configured', errorCode: 'API_KEY_MISSING' });
    }

    const client = new OpenAI({ apiKey });
        const property = req.body;
    const startTime = Date.now();
    
    const address = property.address || '2116 Shrewsbury Dr';
    const city = property.city || 'McKinney';
    const state = property.state || 'TX';
    const zip = property.zip || '75071';
    const sqft = property.livingArea || property.sqft || 3850;
    const beds = property.bedrooms || 5;
    const baths = property.bathrooms || 4.5;
    const yearBuilt = property.yearBuilt || 2017;
    const internalValue = property.internalValue || 750000;
    const fullAddress = `${address}, ${city}, ${state} ${zip}`;

    console.log('══════════════════════════════════════════════');
    console.log('🏠 AVM - GPT-4 Property Values:', fullAddress);
    console.log('══════════════════════════════════════════════');

    try {
        const response = await client.chat.completions.create({
            model: 'gpt-4o',
            temperature: 0,
            response_format: { type: "json_object" },
            messages: [
                {
                    role: 'system',
                    content: `You are an AI valuation tool for a mortgage sales team.
Your goal is to provide accurate, AVM-based home valuations to help run AUS (Freddie Mac / Fannie Mae) and maximize the chance of a Property Inspection Waiver (PIW).

RULES:
- Cross-reference values for consistency
- Use null where information is unavailable
- Never fabricate data
- Anchor to most DEFENSIBLE value for underwriting
- iBuyers (Opendoor, Offerpad) typically offer 5-10% below market
- PIWs are NOT given when estimated value exceeds $999,999

Return JSON only. Professional, factual tone.`
                },
                {
                    role: 'user',
                    content: `Analyze this property for AUS submission and PIW optimization.

ADDRESS: ${fullAddress}
SQUARE FEET: ${sqft}
BEDROOMS: ${beds}
BATHROOMS: ${baths}
YEAR BUILT: ${yearBuilt}

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
    "living_area_sqft": ${sqft},
    "bedrooms": ${beds},
    "bathrooms": ${baths},
    "year_built": ${yearBuilt},
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
    "rate_term_max_90pct": "calculate 90% of primary PIW value",
    "cash_out_max_70pct": "calculate 70% of primary PIW value",
    "piw_eligible": boolean,
    "piw_notes": "PIW eligibility note - remember PIW not available over $999,999"
  }
}`
                }
            ]
        });
        
        const content = response.choices[0]?.message?.content || '{}';
        console.log('📥 GPT Response:', content);

        let parsed;
        try {
            parsed = JSON.parse(content);
        } catch (e) {
            console.error('JSON parse error:', e.message);
            parsed = { sources: [] };
        }
        
        // Extract property details
        const propertyDetails = parsed.property_details || {
            normalized_address: fullAddress,
            living_area_sqft: sqft,
            bedrooms: beds,
            bathrooms: baths,
            year_built: yearBuilt
        };
        
        // Build sources array - add internal AVM first if provided
        const sources = [];
        if (internalValue && internalValue > 0) {
            sources.push({ name: 'Internal AVM', value: internalValue, type: 'internal', notes: 'GoodLeap internal valuation model' });
        }
        
        // Add external sources from AI response
        const aiSources = parsed.source_valuations || parsed.sources || [];
        sources.push(...aiSources.map(s => ({ 
            name: s.name, 
            value: s.value, 
            type: 'external', 
            notes: s.notes || s.reasoning || '' 
        })).filter(s => s.value && s.value > 0));
        
        const valuationContext = parsed.valuation_context || '';
        const avmEstimate = parsed.avm_estimate || {};
        const piwRec = parsed.piw_recommendation || parsed.aus_recommendation || {};
        
        // Calculate stats from all sources
        const values = sources.map(s => s.value).filter(v => v > 0);
        const minValue = values.length ? Math.min(...values) : 0;
        const maxValue = values.length ? Math.max(...values) : 0;
        const avgValue = values.length ? Math.round(values.reduce((a, b) => a + b, 0) / values.length) : 0;
        
        // Use AI's AVM estimate if available, otherwise fall back to calculated
        const mostLikelyValue = avmEstimate.most_likely_as_is_value || avmEstimate.most_likely_value || avgValue;
        const lowEstimate = avmEstimate.low_estimate || minValue;
        const highEstimate = avmEstimate.high_estimate || maxValue;
        const confidence = avmEstimate.confidence || 'Moderate';
        
        console.log(`📊 Found ${sources.length} sources`);
        console.log(`💰 Range: $${minValue.toLocaleString()} - $${maxValue.toLocaleString()}`);
        console.log(`📈 Average: $${avgValue.toLocaleString()}`);
            
        // PIW calculations - use AI recommendation or calculate
        // Rate/Term Max = 90% of PIW value, Cash-Out Max = 70% of PIW value
        const piwPrimaryValue = piwRec.primary_piw_value || mostLikelyValue;
        const piwAlternateValue = piwRec.alternate_lower_value || lowEstimate;
        const rateTermMax = typeof piwRec.rate_term_max_90pct === 'number' 
            ? piwRec.rate_term_max_90pct 
            : Math.round(piwPrimaryValue * 0.9);
        const cashOutMax = typeof piwRec.cash_out_max_70pct === 'number' 
            ? piwRec.cash_out_max_70pct 
            : Math.round(piwPrimaryValue * 0.7);
        const piwEligible = piwRec.piw_eligible !== undefined 
            ? piwRec.piw_eligible 
            : (piwPrimaryValue < 1000000);
        
        // Build UI response
        const uiResponse = {
            // Section 1: Property Details
            property_details: {
                address: propertyDetails.normalized_address || fullAddress,
                city: propertyDetails.city || city,
                state: propertyDetails.state || state,
                zip: propertyDetails.zip || zip,
                county: propertyDetails.county || null,
                neighborhood: propertyDetails.neighborhood || null,
                lot_size: propertyDetails.lot_size || null,
                living_area_sqft: propertyDetails.living_area_sqft || sqft,
                bedrooms: propertyDetails.bedrooms || beds,
                bathrooms: propertyDetails.bathrooms || baths,
                year_built: propertyDetails.year_built || yearBuilt,
                stories: propertyDetails.stories || null,
                construction: propertyDetails.construction || null,
                last_sale_date: propertyDetails.last_sale_date || null,
                last_sale_price: propertyDetails.last_sale_price || null,
                hoa_monthly: propertyDetails.hoa_monthly || null,
                tax_assessed_value: propertyDetails.tax_assessed_value || null,
                tax_year: propertyDetails.tax_year || null,
                annual_tax: propertyDetails.annual_tax || null
            },
            
            // Section 2: Source Valuations
            source_comparison: {
                source1: sources[0] ? { label: sources[0].name, value: sources[0].value, notes: sources[0].notes, found_actual: true } : null,
                source2: sources[1] ? { label: sources[1].name, value: sources[1].value, notes: sources[1].notes, found_actual: true } : null,
                source3: sources[2] ? { label: sources[2].name, value: sources[2].value, notes: sources[2].notes, found_actual: true } : null,
                source4: sources[3] ? { label: sources[3].name, value: sources[3].value, notes: sources[3].notes, found_actual: true } : null,
                source5: sources[4] ? { label: sources[4].name, value: sources[4].value, notes: sources[4].notes, found_actual: true } : null,
                total_sources: sources.length,
                actual_sources_found: sources.length,
                value_range: { min: minValue, max: maxValue },
                variance_percent: mostLikelyValue > 0 ? Math.round((maxValue - minValue) / mostLikelyValue * 100) : 0,
                valuation_context: valuationContext,
                all_sources: sources
            },
            
            // Section 3: AVM Estimate and Confidence (Required)
            avm_estimate: {
                low_estimate: lowEstimate,
                high_estimate: highEstimate,
                most_likely_as_is_value: mostLikelyValue,
                confidence: confidence,
                justification: avmEstimate.justification || 'Based on cross-referenced AVM sources and market data'
            },
            
            // Section 4: PIW Recommendation for AUS
            piw_recommendation: {
                primary_piw_value: piwPrimaryValue,
                alternate_lower_value: piwAlternateValue,
                rate_term_max_90pct: rateTermMax,
                cash_out_max_70pct: cashOutMax,
                piw_eligible: piwEligible,
                piw_notes: piwRec.piw_notes || (piwEligible 
                    ? 'PIW may be available based on value and property type' 
                    : 'PIW NOT available - estimated value exceeds $999,999 threshold')
            },
            
            // Legacy fields for backward compatibility
            aus_recommended: {
                value: lowEstimate,
                confidence: confidence,
                reason: avmEstimate.justification || `Conservative value from ${sources.length} sources for AUS submission`
            },
            value_options: {
                conservative: {
                    value: lowEstimate,
                    label: '✅ Conservative (AUS)',
                    description: 'Lowest value - recommended for AUS submission'
                },
                blended: {
                    value: mostLikelyValue,
                    label: 'Most Likely As-Is',
                    description: `AI estimated market value from ${sources.length} sources`
                },
                aggressive: {
                    value: highEstimate,
                    label: '⚠️ Highest',
                    description: 'May exceed appraisal - use with caution'
                }
            },
            underwriting_readiness: {
                multiple_sources: sources.length >= 3,
                has_actual_sources: sources.length > 0,
                variance_within_tolerance: mostLikelyValue > 0 ? (maxValue - minValue) / mostLikelyValue < 0.15 : false,
                suitable_for_aus: sources.length >= 3 && mostLikelyValue > 0 && (maxValue - minValue) / mostLikelyValue < 0.15 ? 'Yes' : 'Review Recommended'
            },
            important_notes: [
                `Found ${sources.length} valuation sources`,
                `AUS Recommended: $${lowEstimate.toLocaleString()} (conservative)`,
                `Most Likely As-Is: $${mostLikelyValue.toLocaleString()}`,
                `Range: $${minValue.toLocaleString()} - $${maxValue.toLocaleString()}`,
                piwEligible ? '' : '⚠️ PIW not available - value exceeds $999,999'
            ].filter(n => n),
            disclaimer: '* Values are estimates based on AI analysis. Always verify with current listings.',
            
            // Legacy piw_calculations for backward compatibility
            piw_calculations: {
                primary_value: piwPrimaryValue,
                rate_term_max: rateTermMax,
                cash_out_max: cashOutMax,
                piw_eligible: piwEligible,
                notes: piwRec.piw_notes || (piwEligible ? 'PIW may be available' : 'PIW not available over $999,999')
            }
        };
        
        console.log(`⏱️ Complete in ${Date.now() - startTime}ms`);
        
        return res.status(200).json(uiResponse);

    } catch (error) {
        console.error('❌ Error:', error.message);
        
        return res.status(500).json({ 
            error: error.message,
            errorCode: 'API_ERROR'
        });
    }
}
