/**
 * Decision Logs Service
 * 
 * Client for tracking user decision-making patterns for research analysis.
 * Supports session tracking, timing metrics, and choice logging.
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = supabaseUrl && supabaseKey
    ? createClient(supabaseUrl, supabaseKey)
    : null;

// Session management
let currentSessionId: string | null = null;
let sessionStartTime: number = 0;
let viewStartTime: number = 0;

/**
 * Start a new tracking session
 */
export function startSession(): string {
    currentSessionId = crypto.randomUUID();
    sessionStartTime = Date.now();
    viewStartTime = Date.now();
    return currentSessionId;
}

/**
 * Mark when user starts viewing a new node
 */
export function markViewStart(): void {
    viewStartTime = Date.now();
}

/**
 * Calculate decision time since view start
 */
function getDecisionTimeMs(): number {
    return Date.now() - viewStartTime;
}

/**
 * Log a decision event
 */
export async function logDecision(
    choice: 'favorited' | 'dismissed' | 'compared' | 'aborted',
    targetVenueId: string | null,
    context: {
        page?: string;
        filters?: Record<string, unknown>;
        searchQuery?: string;
    } = {},
    inputs: {
        comparedNodes?: string[];
        viewedNodes?: string[];
    } = {},
    signals: {
        ruleSignals?: Array<{ type: string; weight: number; reason: string }>;
        aiScores?: Record<string, number>;
    } = {}
): Promise<void> {
    if (!supabase) {
        console.log('[DecisionLog]', { choice, targetVenueId, time: getDecisionTimeMs() });
        return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    try {
        await supabase.from('decision_logs').insert({
            user_id: user.id,
            session_id: currentSessionId,
            context,
            inputs,
            signals,
            choice,
            target_venue_id: targetVenueId,
            decision_time_ms: getDecisionTimeMs()
        });

        // Reset view timer for next decision
        markViewStart();
    } catch (error) {
        console.warn('Failed to log decision:', error);
    }
}

/**
 * Log a favorite action
 */
export async function logFavorite(venueId: string, context = {}): Promise<void> {
    await logDecision('favorited', venueId, context);
}

/**
 * Log a dismiss action
 */
export async function logDismiss(venueId: string, context = {}): Promise<void> {
    await logDecision('dismissed', venueId, context);
}

/**
 * Log a comparison action
 */
export async function logCompare(venueIds: string[], context = {}): Promise<void> {
    await logDecision('compared', null, context, { comparedNodes: venueIds });
}

/**
 * Log an abort action (user left without decision)
 */
export async function logAbort(context = {}): Promise<void> {
    await logDecision('aborted', null, context);
}

/**
 * Get session ID for path analysis
 */
export function getSessionId(): string | null {
    return currentSessionId;
}
