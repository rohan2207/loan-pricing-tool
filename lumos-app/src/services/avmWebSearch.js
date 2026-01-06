import { z } from 'zod';

// ============================================================
// RESPONSE SCHEMA
// ============================================================
export const AVMResponseSchema = z.object({
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
// API BASE URL (Vite proxies /api/ai to server in dev)
// ============================================================
const API_BASE = '/api/ai';

// ============================================================
// MAIN FUNCTION - Calls server API
// ============================================================
export async function getPropertyValuations(property) {
    console.log('══════════════════════════════════════════════');
    console.log('🏠 AVM ANALYSIS - CALLING SERVER API');
    console.log('══════════════════════════════════════════════');
    
    try {
        const startTime = Date.now();
        
        const response = await fetch(`${API_BASE}/avm`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(property)
        });

        console.log(`⏱️ Response in ${Date.now() - startTime}ms`);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            
            if (response.status === 422) {
                console.error('❌ Validation error:', errorData);
                throw new Error(`AI response validation failed: ${errorData.error || 'Unknown error'}`);
            }
            
            throw new Error(errorData.error || `Server error: ${response.status}`);
        }

        const data = await response.json();
        
        // Validate on client side as well for type safety
        const validated = AVMResponseSchema.safeParse(data);
        
        if (!validated.success) {
            console.warn('⚠️ Client-side validation issues:', validated.error.errors);
            // Return data anyway since server already validated
            return data;
        }
        
        console.log('✅ AVM analysis received successfully');
        console.log('📍 Recommended:', validated.data.aus_recommended?.value);
        
        return validated.data;
        
    } catch (error) {
        console.error('════════════════════════════════════════════════');
        console.error('❌ AVM ERROR');
        console.error('Message:', error.message);
        console.error('════════════════════════════════════════════════');
        throw error;
    }
}
