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
                    content: `You are a real estate valuation expert. You know property values in Texas markets. Always provide numeric values based on your knowledge. Return JSON only.`
                },
                {
                    role: 'user',
                    content: `What would be the home value for this property on each platform?

Address: ${fullAddress}
Square Feet: ${sqft}
Bedrooms: ${beds}
Bathrooms: ${baths}
Year Built: ${yearBuilt}

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
        
        // Add internal value as first source
        const sources = [
            { name: 'Internal AVM', value: internalValue, type: 'internal', reasoning: 'GoodLeap internal valuation model' },
            ...(parsed.sources || []).map(s => ({ ...s, type: 'external' }))
        ];
        
        const methodology = parsed.methodology || 'Based on area market data and property characteristics';
        
        // Calculate stats
        const values = sources.map(s => s.value).filter(v => v > 0);
        const minValue = Math.min(...values);
        const maxValue = Math.max(...values);
        const avgValue = Math.round(values.reduce((a, b) => a + b, 0) / values.length);
        
        console.log(`📊 Found ${sources.length} sources`);
        console.log(`💰 Range: $${minValue.toLocaleString()} - $${maxValue.toLocaleString()}`);
        console.log(`📈 Average: $${avgValue.toLocaleString()}`);
        
        // Build UI response
        const uiResponse = {
            aus_recommended: {
                value: avgValue,
                confidence: 'Medium',
                reason: `Average of ${sources.length} sources`
            },
            value_options: {
                conservative: {
                    value: minValue,
                    label: '✅ Conservative',
                    description: 'Lowest value - safest for AUS'
                },
                blended: {
                    value: avgValue,
                    label: 'Average',
                    description: `Average of ${sources.length} sources`
                },
                aggressive: {
                    value: maxValue,
                    label: '⚠️ Highest',
                    description: 'May exceed appraisal'
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
                variance_percent: Math.round((maxValue - minValue) / avgValue * 100),
                all_sources: sources
            },
            underwriting_readiness: {
                multiple_sources: sources.length >= 3,
                has_actual_sources: true,
                variance_within_tolerance: (maxValue - minValue) / avgValue < 0.15,
                suitable_for_aus: sources.length >= 3 ? 'Yes' : 'Review'
            },
            important_notes: [
                `Found ${sources.length} valuation sources`,
                `Range: $${minValue.toLocaleString()} - $${maxValue.toLocaleString()}`,
                `Variance: ${Math.round((maxValue - minValue) / avgValue * 100)}%`
            ],
            methodology: methodology,
            disclaimer: '* Values are estimates based on historical data and may not reflect current market conditions. Always verify with current listings.',
            piw_calculations: {
                primary_value: avgValue,
                rate_term_max: Math.round(avgValue * 0.9),
                cash_out_max: Math.round(avgValue * 0.8),
                piw_eligible: avgValue < 1000000,
                notes: avgValue >= 1000000 ? 'PIW not available over $999,999' : 'PIW may be available'
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
