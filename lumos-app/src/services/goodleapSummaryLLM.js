import { z } from 'zod';

// ============================================================
// RESPONSE SCHEMA (Zod)
// ============================================================
export const CallPrepBriefSchema = z.object({
    one_line_summary: z.string(),
    key_numbers: z.object({
        working_property_value: z.number(),
        total_liens: z.number(),
        estimated_equity: z.number(),
        total_non_mortgage_debt: z.number(),
        total_monthly_payments: z.number(),
        credit_snapshot: z.string()
    }),
    what_we_see: z.array(z.string()),
    how_we_can_help: z.array(z.string()),
    suggested_talk_track: z.object({
        opening_line: z.string(),
        discovery_questions: z.array(z.string()),
        value_statement: z.string(),
        close_for_next_step: z.string()
    }),
    conversation_starters: z.array(z.string()),
    missing_info_to_confirm: z.array(z.string())
});

// ============================================================
// API BASE URL (Vite proxies /api/ai to server in dev)
// ============================================================
const API_BASE = '/api/ai';

// ============================================================
// MAIN FUNCTION - Calls server API
// ============================================================
export async function generateCallPrepBrief(input) {
    console.log('══════════════════════════════════════════════');
    console.log('📞 CALL PREP BRIEF - CALLING SERVER API');
    console.log('══════════════════════════════════════════════');
    
    try {
        const startTime = Date.now();
        
        const response = await fetch(`${API_BASE}/call-prep`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(input)
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
        const validated = CallPrepBriefSchema.safeParse(data);
        
        if (!validated.success) {
            console.warn('⚠️ Client-side validation issues:', validated.error.errors);
            // Return data anyway since server already validated
            return data;
        }
        
        console.log('✅ Call Prep Brief received successfully');
        return validated.data;
        
    } catch (error) {
        console.error('════════════════════════════════════════════════');
        console.error('❌ CALL PREP BRIEF ERROR');
        console.error('Message:', error.message);
        console.error('════════════════════════════════════════════════');
        throw error;
    }
}

// Keep old export for backwards compatibility
export const generateAIBriefing = generateCallPrepBrief;
export const FALLBACK_BRIEFING = null;
