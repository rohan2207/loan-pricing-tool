import { z } from 'zod';

// ============================================================
// RESPONSE SCHEMA - Clean Architecture with Actual vs Calculated
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
        // Dynamic sources - up to 4 displayed
        source1: z.object({
            label: z.string(),
            value: z.number(),
            found_actual: z.boolean(),
            notes: z.string().optional()
        }).nullable().optional(),
        source2: z.object({
            label: z.string(),
            value: z.number(),
            found_actual: z.boolean(),
            notes: z.string().optional()
        }).nullable().optional(),
        source3: z.object({
            label: z.string(),
            value: z.number(),
            found_actual: z.boolean(),
            notes: z.string().optional()
        }).nullable().optional(),
        source4: z.object({
            label: z.string(),
            value: z.number(),
            found_actual: z.boolean(),
            notes: z.string().optional()
        }).nullable().optional(),
        // Summary stats
        total_sources: z.number(),
        actual_sources_found: z.number(),
        calculated_estimates: z.number().optional(),
        comparable_sales: z.number().optional(),
        value_range: z.object({ min: z.number(), max: z.number() }),
        variance_percent: z.number(),
        all_sources: z.array(z.object({
            name: z.string(),
            value: z.number(),
            found_actual: z.boolean(),
            notes: z.string().optional()
        })).optional(),
        comparables: z.array(z.object({
            address: z.string().optional(),
            sale_price: z.number().optional(),
            sqft: z.number().optional(),
            beds: z.number().optional(),
            baths: z.number().optional(),
            sale_date: z.string().optional()
        })).optional()
    }),
    underwriting_readiness: z.object({
        multiple_sources: z.boolean(),
        has_actual_sources: z.boolean().optional(),
        variance_within_tolerance: z.boolean(),
        suitable_for_aus: z.enum(['Yes', 'Use with caution'])
    }),
    important_notes: z.array(z.string()),
    piw_calculations: z.object({
        primary_value: z.number(),
        rate_term_max: z.number(),
        cash_out_max: z.number(),
        piw_eligible: z.boolean(),
        notes: z.string().optional()
    }).optional()
});

// ============================================================
// API BASE URL
// ============================================================
const API_BASE = '/api/ai';

// ============================================================
// ERROR TYPES
// ============================================================
export const AVM_ERROR_CODES = {
    API_KEY_MISSING: 'API_KEY_MISSING',
    INVALID_API_KEY: 'INVALID_API_KEY',
    QUOTA_EXCEEDED: 'QUOTA_EXCEEDED',
    RESPONSES_API_UNAVAILABLE: 'RESPONSES_API_UNAVAILABLE',
    RATE_LIMITED: 'RATE_LIMITED',
    SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
    EMPTY_RESPONSE: 'EMPTY_RESPONSE',
    JSON_PARSE_FAILED: 'JSON_PARSE_FAILED',
    SCHEMA_VALIDATION_FAILED: 'SCHEMA_VALIDATION_FAILED',
    NETWORK_ERROR: 'NETWORK_ERROR',
    UNKNOWN_ERROR: 'UNKNOWN_ERROR'
};

// Custom error class
export class AVMError extends Error {
    constructor(message, errorCode, details = null, rawData = null) {
        super(message);
        this.name = 'AVMError';
        this.errorCode = errorCode;
        this.details = details;
        this.rawData = rawData;
        this.timestamp = new Date().toISOString();
    }
}

// ============================================================
// MAIN FUNCTION
// ============================================================
export async function getPropertyValuations(property) {
    console.log('══════════════════════════════════════════════');
    console.log('🏠 AVM ANALYSIS - CLEAN ARCHITECTURE');
    console.log('══════════════════════════════════════════════');
    console.log('📍 Property:', property?.address || 'Default address');
    
    const startTime = Date.now();
    let response;
    
    // Make the API call
    try {
        response = await fetch(`${API_BASE}/avm`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(property)
        });
        console.log(`⏱️ Response in ${Date.now() - startTime}ms`);
    } catch (networkError) {
        console.error('❌ Network error:', networkError.message);
        throw new AVMError(
            'Failed to connect to AVM service',
            AVM_ERROR_CODES.NETWORK_ERROR,
            networkError.message
        );
    }

    // Parse response
    let data;
    try {
        data = await response.json();
    } catch (parseError) {
        throw new AVMError(
            'Invalid response from server',
            AVM_ERROR_CODES.UNKNOWN_ERROR,
            parseError.message
        );
    }

    // Handle errors
    if (!response.ok) {
        const errorCode = data.errorCode || AVM_ERROR_CODES.UNKNOWN_ERROR;
        console.error('════════════════════════════════════════════════');
        console.error('❌ AVM API ERROR:', errorCode);
        console.error('════════════════════════════════════════════════');
        
        throw new AVMError(
            data.error || `Server error: ${response.status}`,
            errorCode,
            data.details,
            data.rawData || data.rawContent
        );
    }

    // Client-side validation (non-blocking)
    const validated = AVMResponseSchema.safeParse(data);
    if (!validated.success) {
        console.warn('⚠️ Client validation warnings:', validated.error.errors);
    }
    
    console.log('══════════════════════════════════════════════');
    console.log('✅ AVM ANALYSIS COMPLETE');
    console.log('══════════════════════════════════════════════');
    console.log('💰 Recommended:', data.aus_recommended?.value);
    console.log('📊 Confidence:', data.aus_recommended?.confidence);
    console.log('🎯 Actual sources:', data.source_comparison?.actual_sources_found || 0);
    
    return validated.success ? validated.data : data;
}
