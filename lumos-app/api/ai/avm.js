import OpenAI from 'openai';
import { z } from 'zod';

// ============================================================
// MODEL PARAMETERS (Task 6: Deterministic settings)
// ============================================================
const MODEL_CONFIG = {
    model: 'gpt-4o-mini',
    temperature: 0.05,
    max_tokens: 700,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    response_format: { type: 'json_object' }
};

// ============================================================
// SYSTEM PROMPT
// ============================================================
const SYSTEM_PROMPT = `You are a mortgage property valuation assistant.
Your job is to select and explain a working property value for AUS usage using internal and external AVMs.

Follow all rules strictly.
Do not invent values.
Do not change section order or labels.

SELECTION RULES:
1) Prefer internal AVM when supported by low variance
2) Avoid highest value unless supported by multiple sources
3) Favor consistency and explainability over optimism
4) Do not reference LTV, guidelines, or approval guarantees

Output valid JSON only.`;

// ============================================================
// RESPONSE SCHEMA
// ============================================================
const AVMResponseSchema = z.object({
    aus_recommended: z.object({
        value: z.number(),
        confidence: z.enum(['High', 'Medium', 'Low']),
        reason: z.string()
    }),
    value_options: z.object({
        conservative: z.object({
            value: z.number(),
            label: z.string(),
            description: z.string()
        }),
        blended: z.object({
            value: z.number(),
            label: z.string(),
            description: z.string()
        }),
        aggressive: z.object({
            value: z.number(),
            label: z.string(),
            description: z.string()
        })
    }),
    source_comparison: z.object({
        internal_avm: z.object({ value: z.number(), confidence: z.string().optional() }),
        zillow: z.object({ value: z.number().nullable() }),
        redfin: z.object({ value: z.number().nullable() }),
        realtor: z.object({ value: z.number().nullable() }),
        value_range: z.object({ min: z.number(), max: z.number() }),
        variance_percent: z.number()
    }),
    underwriting_readiness: z.object({
        multiple_sources: z.boolean(),
        variance_within_tolerance: z.boolean(),
        internal_alignment: z.boolean(),
        suitable_for_aus: z.enum(['Yes', 'Use with caution'])
    }),
    important_notes: z.array(z.string())
});

// ============================================================
// COMPUTE FACTS (Task 7: Pre-compute to reduce prompt size)
// ============================================================
function computeFacts(property) {
    // Property values
    const internalAvm = property.avmValue || 785000;
    const confidence = property.confidence || 93;
    const avmLow = property.avmLow || Math.round(internalAvm * 0.93);
    const avmHigh = property.avmHigh || Math.round(internalAvm * 1.07);
    
    // Simulated external values (in real app, these would come from APIs)
    const zillowValue = property.zillowValue || Math.round(internalAvm * 0.98);
    const redfinValue = property.redfinValue || Math.round(internalAvm * 1.02);
    const realtorValue = property.realtorValue || Math.round(internalAvm * 0.99);
    
    // Calculate metrics
    const values = [internalAvm, zillowValue, redfinValue, realtorValue].filter(v => v);
    const sourceCount = values.length;
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const sortedValues = [...values].sort((a, b) => a - b);
    const medianValue = sortedValues[Math.floor(sortedValues.length / 2)];
    const variancePercent = parseFloat(((maxValue - minValue) / medianValue * 100).toFixed(1));

    // Determine confidence level based on variance
    let confidenceLevel = 'High';
    if (variancePercent > 10) confidenceLevel = 'Low';
    else if (variancePercent > 5) confidenceLevel = 'Medium';

    return {
        internalAvm,
        confidence,
        avmLow,
        avmHigh,
        zillowValue,
        redfinValue,
        realtorValue,
        sourceCount,
        minValue,
        maxValue,
        medianValue,
        variancePercent,
        confidenceLevel,
        multipleSourcesPresent: sourceCount >= 2,
        varianceWithinTolerance: variancePercent < 10,
        internalAlignment: Math.abs(internalAvm - medianValue) / medianValue < 0.05
    };
}

// ============================================================
// BUILD PROMPT
// ============================================================
function buildPrompt(property, facts) {
    const {
        internalAvm, confidence, avmLow, avmHigh,
        zillowValue, redfinValue, realtorValue,
        sourceCount, minValue, maxValue, medianValue, variancePercent,
        multipleSourcesPresent, varianceWithinTolerance, internalAlignment
    } = facts;

    return `Analyze these property valuations and select a working value for AUS.

PROPERTY
- Address: ${property.address || '2116 Shrewsbury Dr'}
- City: ${property.city || 'McKinney'}
- State: ${property.state || 'TX'}
- Square footage: ${property.livingArea || 3850} sqft
- Year built: ${property.yearBuilt || 2017}

AVM SOURCES
- Internal AVM: $${internalAvm.toLocaleString()}, confidence: ${confidence}%, range: $${avmLow.toLocaleString()} - $${avmHigh.toLocaleString()}
- Zillow: $${zillowValue.toLocaleString()}
- Redfin: $${redfinValue.toLocaleString()}
- Realtor.com: $${realtorValue.toLocaleString()}

PRE-CALCULATED METRICS
- Source count: ${sourceCount}
- Min value: $${minValue.toLocaleString()}
- Max value: $${maxValue.toLocaleString()}
- Median value: $${medianValue.toLocaleString()}
- Variance: ${variancePercent}%

Return this EXACT JSON structure:
{
  "aus_recommended": {
    "value": ${internalAvm},
    "confidence": "${variancePercent < 5 ? 'High' : variancePercent < 10 ? 'Medium' : 'Low'}",
    "reason": "One sentence explaining why this value was selected"
  },
  "value_options": {
    "conservative": {
      "value": ${minValue},
      "label": "Safest for underwriting",
      "description": "Lowest defensible value across all sources"
    },
    "blended": {
      "value": ${medianValue},
      "label": "Balanced estimate",
      "description": "Median of all available sources"
    },
    "aggressive": {
      "value": ${maxValue},
      "label": "Best case (not recommended)",
      "description": "Upper bound - may increase appraisal risk"
    }
  },
  "source_comparison": {
    "internal_avm": { "value": ${internalAvm}, "confidence": "${confidence}%" },
    "zillow": { "value": ${zillowValue} },
    "redfin": { "value": ${redfinValue} },
    "realtor": { "value": ${realtorValue} },
    "value_range": { "min": ${minValue}, "max": ${maxValue} },
    "variance_percent": ${variancePercent}
  },
  "underwriting_readiness": {
    "multiple_sources": ${multipleSourcesPresent},
    "variance_within_tolerance": ${varianceWithinTolerance},
    "internal_alignment": ${internalAlignment},
    "suitable_for_aus": "${varianceWithinTolerance && multipleSourcesPresent ? 'Yes' : 'Use with caution'}"
  },
  "important_notes": [
    "AVMs are estimates; final value determined by appraisal or underwriting",
    "Selected value prioritizes stability and defensibility"
  ]
}

RULES:
- aus_recommended.value should typically be the internal AVM when variance is low
- If variance > 10%, confidence should be "Low"
- If variance 5-10%, confidence should be "Medium"
- conservative is always the minimum value
- aggressive is always the maximum value (with warning)
- Output JSON only`;
}

// ============================================================
// JSON REPAIR (Task 5: Repair fallback)
// ============================================================
async function repairJSON(client, invalidJSON) {
    const repairPrompt = `You are a JSON formatter. Return ONLY valid JSON.

INVALID JSON:
${invalidJSON}

REQUIRED SCHEMA:
{
  "aus_recommended": { "value": number, "confidence": "High|Medium|Low", "reason": "string" },
  "value_options": { "conservative": { "value": number, "label": "string", "description": "string" }, "blended": { "value": number, "label": "string", "description": "string" }, "aggressive": { "value": number, "label": "string", "description": "string" } },
  "source_comparison": { "internal_avm": { "value": number, "confidence": "string" }, "zillow": { "value": number }, "redfin": { "value": number }, "realtor": { "value": number }, "value_range": { "min": number, "max": number }, "variance_percent": number },
  "underwriting_readiness": { "multiple_sources": boolean, "variance_within_tolerance": boolean, "internal_alignment": boolean, "suitable_for_aus": "Yes|Use with caution" },
  "important_notes": ["string"]
}

INSTRUCTIONS:
- Keep the same values from the invalid JSON
- Only fix structure and types
- Do not add new facts
- Return valid JSON only`;

    const response = await client.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
            { role: 'system', content: 'You are a JSON formatter. Return ONLY valid JSON.' },
            { role: 'user', content: repairPrompt }
        ],
        temperature: 0,
        max_tokens: 700,
        response_format: { type: 'json_object' }
    });

    return response.choices[0]?.message?.content;
}

// ============================================================
// MAIN HANDLER
// ============================================================
export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const apiKey = process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: 'OpenAI API key not configured on server. Set OPENAI_API_KEY in .env.local' });
    }

    const client = new OpenAI({ apiKey });

    try {
        const property = req.body;

        // Task 7: Compute facts before prompting
        const facts = computeFacts(property);
        const prompt = buildPrompt(property, facts);

        console.log('📤 AVM Analysis - Sending to OpenAI...');
        const startTime = Date.now();

        const response = await client.chat.completions.create({
            ...MODEL_CONFIG,
            messages: [
                { role: 'system', content: SYSTEM_PROMPT },
                { role: 'user', content: prompt }
            ]
        });

        console.log(`⏱️ Response in ${Date.now() - startTime}ms`);

        const content = response.choices[0]?.message?.content;
        if (!content) {
            return res.status(500).json({ error: 'OpenAI returned empty response' });
        }

        let parsed;
        try {
            parsed = JSON.parse(content);
        } catch (e) {
            return res.status(422).json({ 
                error: 'Invalid JSON from OpenAI', 
                details: e.message,
                raw: content.substring(0, 500)
            });
        }

        // Validate with Zod
        const validated = AVMResponseSchema.safeParse(parsed);

        if (!validated.success) {
            console.log('⚠️ Validation failed, attempting repair...');
            
            // Task 5: JSON repair attempt
            const repairedContent = await repairJSON(client, content);
            
            if (repairedContent) {
                try {
                    const repairedParsed = JSON.parse(repairedContent);
                    const repairedValidated = AVMResponseSchema.safeParse(repairedParsed);
                    
                    if (repairedValidated.success) {
                        console.log('✅ Repair successful');
                        return res.status(200).json(repairedValidated.data);
                    }
                } catch (e) {
                    // Repair also failed
                }
            }

            // Return 422 if repair failed
            return res.status(422).json({
                error: 'Validation failed after repair attempt',
                details: validated.error.errors,
                raw: parsed
            });
        }

        console.log('✅ AVM analysis complete');
        return res.status(200).json(validated.data);

    } catch (error) {
        console.error('❌ AVM error:', error.message);
        return res.status(500).json({ 
            error: 'Failed to analyze property valuations', 
            details: error.message 
        });
    }
}

