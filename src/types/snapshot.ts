/**
 * Snapshot Pattern for Data Versioning
 * 
 * All external data is wrapped in Snapshot<T> for:
 * - AI recommendation traceability
 * - Experiment reproducibility
 * - Data confidence modeling
 */

export type Snapshot<T> = {
    data: T;
    fetchedAt: Date;          // Data collection timestamp
    derivedAt?: Date;         // Derived metric calculation timestamp (IF trend, urgency, etc.)
    source: string;           // "JCR2024", "manual", "api", etc.
    version: string;          // "2024.01"
    confidence: number;       // 0~1 confidence score
}

// Confidence examples:
// - Fresh API data: 0.95
// - Manual entry: 0.6
// - Stale data: auto-decay based on age

/**
 * CFP (Call for Papers) Information
 */
export interface CFPInfo {
    deadline?: string;        // ISO date string
    notification?: string;    // ISO date string
    conferenceDate?: string;  // ISO date string
    url?: string;
}

/**
 * Impact Factor data point
 */
export interface ImpactFactor {
    year: number;
    value: number;
}

/**
 * Venue Metadata
 */
export interface VenueMetadata {
    name: string;
    type: 'Journal' | 'Conference' | 'SubConference';
    category: string;
    abbreviation?: string;
    publisher?: string;
    description?: string;
    focus?: string[];
    scope?: string;
    reviewTime?: string;
    acceptanceRate?: string;
    openAccess?: boolean;
    website?: string;
}

/**
 * Complete Venue Data with Snapshots
 */
export interface VenueData {
    id: string;               // Stable slug identifier
    cfp: Snapshot<CFPInfo>;
    impact: Snapshot<ImpactFactor[]>;
    metadata: Snapshot<VenueMetadata>;
}

/**
 * Rule Signal for Recommendation Pipeline
 */
export interface RuleSignal {
    type: 'deadline_boost' | 'if_trend_boost' | 'similarity_boost' | 'recency_boost';
    category: 'time' | 'trust' | 'relevance' | 'behavior';
    weight: number;
    reason: string;
    expiresAt?: Date;         // Auto-expiration for time-sensitive signals
}

/**
 * Helper: Create a fresh Snapshot
 */
export function createSnapshot<T>(
    data: T,
    source: string,
    version: string,
    confidence: number = 0.8
): Snapshot<T> {
    return {
        data,
        fetchedAt: new Date(),
        source,
        version,
        confidence
    };
}

/**
 * Helper: Calculate confidence decay based on age
 */
export function calculateConfidenceDecay(
    snapshot: Snapshot<unknown>,
    halfLifeDays: number = 90
): number {
    const ageMs = Date.now() - new Date(snapshot.fetchedAt).getTime();
    const ageDays = ageMs / (1000 * 60 * 60 * 24);
    const decay = Math.pow(0.5, ageDays / halfLifeDays);
    return Math.max(0.1, snapshot.confidence * decay);
}
