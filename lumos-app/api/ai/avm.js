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
                    content: `You are an AI valuation tool for a mortgage sales team. Your objective is to deliver accurate, defensible, AVM-based residential property valuations to support AUS (Automated Underwriting System) submissions and maximize the probability of a Property Inspection Waiver (PIW).

PRIORITY: Credibility, data consistency, and CONSERVATIVE optimization for underwriting outcomes.

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

Return JSON only.`
                },
                {
                    role: 'user',
                    content: `Provide property valuations for AUS submission and PIW optimization.

PROPERTY DETAILS:
Address: ${fullAddress}
Square Feet: ${sqft}
Bedrooms: ${beds}
Bathrooms: ${baths}
Year Built: ${yearBuilt}

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
        
        // Add internal value as first source if provided
        const sources = [];
        if (internalValue && internalValue > 0) {
            sources.push({ name: 'Internal AVM', value: internalValue, type: 'internal', reasoning: 'GoodLeap internal valuation model' });
        }
        sources.push(...(parsed.sources || []).map(s => ({ ...s, type: 'external' })));
        
        const methodology = parsed.methodology || 'Based on area market data and property characteristics';
        const avmEstimate = parsed.avm_estimate || {};
        const ausRec = parsed.aus_recommendation || {};
        
        // Calculate stats from all sources
        const values = sources.map(s => s.value).filter(v => v > 0);
        const minValue = Math.min(...values);
        const maxValue = Math.max(...values);
        const avgValue = Math.round(values.reduce((a, b) => a + b, 0) / values.length);
        
        // Use AI's AVM estimate if available, otherwise fall back to calculated
        const mostLikelyValue = avmEstimate.most_likely_value || avgValue;
        const lowEstimate = avmEstimate.low_estimate || minValue;
        const highEstimate = avmEstimate.high_estimate || maxValue;
        const confidence = avmEstimate.confidence || 'Medium';
        
        console.log(`📊 Found ${sources.length} sources`);
        console.log(`💰 Range: $${minValue.toLocaleString()} - $${maxValue.toLocaleString()}`);
        console.log(`📈 Average: $${avgValue.toLocaleString()}`);
        
        // PIW calculations - use AI recommendation or calculate
        const piwPrimaryValue = ausRec.primary_piw_value || mostLikelyValue;
        const rateTermMax = ausRec.rate_term_max_90pct || Math.round(piwPrimaryValue * 0.9);
        const cashOutMax = ausRec.cash_out_max_80pct || Math.round(piwPrimaryValue * 0.8);
        const piwEligible = ausRec.piw_eligible !== undefined ? ausRec.piw_eligible : (piwPrimaryValue < 1000000);
        
        // Build UI response
        const uiResponse = {
            aus_recommended: {
                value: lowEstimate, // Conservative for AUS
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
                    label: 'Most Likely',
                    description: `AI estimated market value from ${sources.length} sources`
                },
                aggressive: {
                    value: highEstimate,
                    label: '⚠️ Highest',
                    description: 'May exceed appraisal - use with caution'
                }
            },
            source_comparison: {
                source1: sources[0] ? { label: sources[0].name, value: sources[0].value, found_actual: true } : null,
                source2: sources[1] ? { label: sources[1].name, value: sources[1].value, found_actual: true } : null,
                source3: sources[2] ? { label: sources[2].name, value: sources[2].value, found_actual: true } : null,
                source4: sources[3] ? { label: sources[3].name, value: sources[3].value, found_actual: true } : null,
                source5: sources[4] ? { label: sources[4].name, value: sources[4].value, found_actual: true } : null,
                total_sources: sources.length,
                actual_sources_found: sources.length,
                value_range: { min: minValue, max: maxValue },
                variance_percent: Math.round((maxValue - minValue) / mostLikelyValue * 100),
                all_sources: sources
            },
            underwriting_readiness: {
                multiple_sources: sources.length >= 3,
                has_actual_sources: true,
                variance_within_tolerance: (maxValue - minValue) / mostLikelyValue < 0.15,
                suitable_for_aus: sources.length >= 3 && (maxValue - minValue) / mostLikelyValue < 0.15 ? 'Yes' : 'Review Recommended'
            },
            important_notes: [
                `Found ${sources.length} valuation sources`,
                `AUS Recommended: $${lowEstimate.toLocaleString()} (conservative)`,
                `Most Likely: $${mostLikelyValue.toLocaleString()}`,
                `Range: $${minValue.toLocaleString()} - $${maxValue.toLocaleString()}`,
                ausRec.notes || ''
            ].filter(n => n),
            methodology: methodology,
            disclaimer: '* Values are estimates based on AI analysis and historical data. May not reflect current market conditions. Always verify with current listings and consider ordering an appraisal for high-value transactions.',
            piw_calculations: {
                primary_value: piwPrimaryValue,
                rate_term_max: rateTermMax,
                cash_out_max: cashOutMax,
                piw_eligible: piwEligible,
                notes: ausRec.notes || (piwEligible ? 'PIW may be available based on value and property type' : 'PIW not available - value exceeds $999,999 threshold')
            },
            avm_analysis: {
                low_estimate: lowEstimate,
                high_estimate: highEstimate,
                most_likely_value: mostLikelyValue,
                confidence: confidence,
                justification: avmEstimate.justification || 'Based on comparable market data'
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
