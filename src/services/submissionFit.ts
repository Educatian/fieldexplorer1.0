/**
 * Submission Fit Scorecard
 *
 * The headline differentiator: paste an abstract, get ranked SUBMISSION TARGETS
 * (not papers) scored by three signals that no incumbent combines:
 *   1. Topic fit      -- cosine between the abstract and the venue's TF-IDF fingerprint
 *   2. Methodology fit -- alignment of *research culture* (experimental / qualitative /
 *                         design / data-AI / review / theory), the thing citation maps ignore
 *   3. CFP readiness   -- how submittable the venue is right now, from verified deadlines
 *
 * Pure and dependency-light so it is unit-testable. The UI layer (index.tsx) builds
 * the VenueFitInput list from app data and renders the results.
 */

import semanticProfiles from '../data/semantic_profiles.json';

// Mirrors index.tsx METHODOLOGY_MAP. Kept here so the scorer is self-contained.
export const METHODOLOGY_MAP: Record<string, string[]> = {
    'Experimental': ['experiment', 'experimental', 'intervention', 'randomized', 'quasi-experimental', 'quantitative', 'control group', 'regression', 'effect size'],
    'Qualitative': ['qualitative', 'case study', 'ethnographic', 'ethnography', 'interview', 'narrative', 'thematic analysis', 'phenomenology', 'grounded theory', 'discourse'],
    'Design & Dev': ['design-based', 'design based', 'dbr', 'instructional design', 'prototype', 'interaction design', 'usability', 'system development', 'human-computer interaction', 'learning environment'],
    'Data & AI': ['learning analytics', 'data mining', 'machine learning', 'artificial intelligence', 'predictive', 'nlp', 'algorithm', 'clustering', 'classification', 'genai', 'generative'],
    'Review & Meta': ['systematic review', 'meta-analysis', 'evidence synthesis', 'scoping review', 'bibliometric', 'meta-synthesis', 'literature review'],
    'Theory': ['theoretical framework', 'epistemological', 'epistemic', 'conceptual model', 'philosophical', 'critique', 'perspective', 'framework'],
};

const STOP = new Set([
    'the', 'and', 'of', 'in', 'to', 'for', 'with', 'on', 'as', 'by', 'at', 'an', 'be', 'this', 'that', 'from',
    'which', 'are', 'was', 'were', 'has', 'have', 'had', 'been', 'will', 'can', 'not', 'but', 'or', 'their',
    'these', 'such', 'than', 'then', 'while', 'study', 'studies', 'research', 'paper', 'results', 'data',
    'using', 'used', 'use', 'also', 'between', 'more', 'about', 'through', 'into', 'both', 'some', 'our',
    'we', 'they', 'its', 'based', 'analysis', 'findings', 'present', 'propose', 'show', 'among', 'across',
    'however', 'therefore', 'thus', 'this', 'background', 'abstract', 'aim', 'aims', 'purpose', 'method', 'methods',
]);

export type TermVector = Record<string, number>;

/** Unigram + bigram term-weight vector for a free-text abstract. */
export function vectorizeText(text: string): TermVector {
    if (!text) return {};
    const cleaned = text.toLowerCase().replace(/<[^>]*>/g, ' ').replace(/[^a-z\s-]/g, ' ');
    const words = cleaned.split(/\s+/).filter(w => w.length > 3 && !STOP.has(w));
    const counts: TermVector = {};
    for (const w of words) counts[w] = (counts[w] || 0) + 1;
    for (let i = 0; i < words.length - 1; i++) {
        const bg = `${words[i]} ${words[i + 1]}`;
        counts[bg] = (counts[bg] || 0) + 1;
    }
    return counts;
}

/**
 * Expand a fingerprint for topic matching: keep each full term (weight 1.0) and
 * add its component words from bigrams / hyphenated terms at partial credit (0.5).
 * Venue fingerprints are sparse top-100 distinctive terms (often bigrams like
 * "epistemic performance"); a short abstract rarely shares the exact bigram, so
 * component expansion recovers real overlap while full-term hits still dominate.
 */
export function expandForTopic(vec: TermVector): TermVector {
    const out: TermVector = {};
    for (const key in vec) {
        const w = vec[key];
        out[key] = Math.max(out[key] || 0, w);
        const parts = key.split(/[\s-]+/).filter(p => p.length > 3 && !STOP.has(p));
        if (parts.length > 1) {
            for (const p of parts) out[p] = (out[p] || 0) + w * 0.5;
        }
    }
    return out;
}

/** Cosine similarity over the shared keys of two sparse vectors. */
export function cosine(a: TermVector, b: TermVector): number {
    let dot = 0, na = 0, nb = 0;
    for (const k in a) { na += a[k] * a[k]; if (k in b) dot += a[k] * b[k]; }
    for (const k in b) nb += b[k] * b[k];
    if (na === 0 || nb === 0) return 0;
    return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

/** Methodology-culture distribution (6 dims) inferred from a term vector. */
export function methodologyDistribution(vec: TermVector): TermVector {
    const scores: TermVector = {};
    for (const cat of Object.keys(METHODOLOGY_MAP)) scores[cat] = 0;
    for (const term in vec) {
        const w = vec[term];
        for (const [cat, patterns] of Object.entries(METHODOLOGY_MAP)) {
            if (patterns.some(p => term === p || term.includes(p))) scores[cat] += w;
        }
    }
    return scores;
}

/** Methodology shares normalized over the 6 culture dimensions (sum = 1, or all 0). */
export function methodologyShares(vec: TermVector): TermVector {
    const dist = methodologyDistribution(vec);
    let total = 0;
    for (const c in dist) total += dist[c];
    if (total <= 0) return dist;
    const out: TermVector = {};
    for (const c in dist) out[c] = dist[c] / total;
    return out;
}

/** The dominant methodology category of a term vector, or null if no signal. */
export function dominantMethodology(vec: TermVector): string | null {
    const dist = methodologyDistribution(vec);
    let best: string | null = null, bestV = 0;
    for (const c in dist) if (dist[c] > bestV) { bestV = dist[c]; best = c; }
    return bestV > 0 ? best : null;
}

function hasSignal(v: TermVector): boolean {
    for (const k in v) if (v[k] > 0) return true;
    return false;
}

/** CFP readiness in [0,1] from days-until-deadline and verification state. */
export function cfpReadiness(daysUntil: number | null | undefined, verified?: boolean): number {
    let base: number;
    if (daysUntil === null || daysUntil === undefined) base = 0.3;      // unknown deadline
    else if (daysUntil < 0) base = 0.15;                                 // already passed (next cycle)
    else if (daysUntil <= 14) base = 1.0;
    else if (daysUntil <= 45) base = 0.85;
    else if (daysUntil <= 90) base = 0.65;
    else if (daysUntil <= 180) base = 0.45;
    else base = 0.3;
    if (verified && base > 0.15) base = Math.min(1, base + 0.05);
    return base;
}

export interface VenueFitInput {
    name: string;
    type?: string;
    impact?: string;            // Q1..Q4
    cfpDaysUntil?: number | null;
    cfpVerified?: boolean;
}

export interface VenueFitResult {
    name: string;
    type?: string;
    impact?: string;
    overall: number;            // 0..100
    topicScore: number;         // 0..100
    methodScore: number | null; // 0..100, null when abstract has no methodology signal
    cfpScore: number;           // 0..100
    cfpDaysUntil: number | null;
    cfpVerified: boolean;
    sharedTerms: string[];      // top overlapping fingerprint terms (the "why")
    topMethodology: string | null;
}

const WEIGHTS = { topic: 0.65, method: 0.15, cfp: 0.2 };
// A venue's fingerprint must devote at least this share of its mass to methodology
// vocabulary before we trust a methodology-fit score. Below it, the per-venue
// estimate is too sparse (it would saturate to 100%), so we report "no signal".
const METH_COVERAGE_MIN = 0.03;

/** Rank venues as submission targets for a pasted abstract. */
export function rankSubmissionFit(abstract: string, venues: VenueFitInput[]): VenueFitResult[] {
    const aVec = vectorizeText(abstract);
    if (!hasSignal(aVec)) return [];
    const aDomMethod = dominantMethodology(aVec); // the abstract's primary research culture
    const abstractHasMethod = aDomMethod !== null;
    const aTopic = expandForTopic(aVec);

    const profiles = semanticProfiles as Record<string, any>;

    // PASS 1: compute raw signals per venue.
    interface Interim {
        v: VenueFitInput; rawTopic: number; method: number | null; cfp: number;
        shared: string[]; topMethodology: string | null;
    }
    const interim: Interim[] = [];

    for (const v of venues) {
        const profile = profiles[v.name];
        if (!profile || !profile.vector) continue;
        const vVec: TermVector = profile.vector;

        const rawTopic = cosine(aTopic, expandForTopic(vVec)); // 0..1, component-expanded
        if (rawTopic <= 0) continue;

        const vShares = methodologyShares(vVec);
        // Methodology coverage: fraction of the venue fingerprint that is methodology
        // vocabulary. Gates out sparse venues whose share would falsely saturate to 100%.
        let vMethMass = 0, vTotalMass = 0;
        const vMethDist = methodologyDistribution(vVec);
        for (const c in vMethDist) vMethMass += vMethDist[c];
        for (const k in vVec) vTotalMass += vVec[k];
        const methCoverage = vTotalMass > 0 ? vMethMass / vTotalMass : 0;
        const method = (abstractHasMethod && aDomMethod && methCoverage >= METH_COVERAGE_MIN)
            ? (vShares[aDomMethod] ?? 0)
            : null;
        const cfp = cfpReadiness(v.cfpDaysUntil, v.cfpVerified);

        const vTopic = expandForTopic(vVec);
        const shared = Object.keys(aTopic)
            .filter(k => k in vTopic)
            .sort((x, y) => {
                const cy = aTopic[y] * vTopic[y], cx = aTopic[x] * vTopic[x];
                if (cy !== cx) return cy - cx;
                return (y.includes(' ') ? 1 : 0) - (x.includes(' ') ? 1 : 0);
            })
            .slice(0, 6);
        const topMethodology = method !== null
            ? (Object.entries(vShares).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null)
            : null;

        interim.push({ v, rawTopic, method, cfp, shared, topMethodology });
    }

    if (interim.length === 0) return [];

    // PASS 2: normalize topic to the strongest match in this candidate pool so the
    // best topical fit anchors the ranking (raw cosine over sparse fingerprints is
    // tiny in absolute terms). Methodology stays a minor, non-overriding signal.
    const maxTopic = Math.max(...interim.map(x => x.rawTopic));

    const results: VenueFitResult[] = interim.map(x => {
        const topicNorm = maxTopic > 0 ? x.rawTopic / maxTopic : 0; // 0..1 relative
        let overall: number;
        if (x.method === null) {
            const t = WEIGHTS.topic / (WEIGHTS.topic + WEIGHTS.cfp);
            const c = WEIGHTS.cfp / (WEIGHTS.topic + WEIGHTS.cfp);
            overall = t * topicNorm + c * x.cfp;
        } else {
            overall = WEIGHTS.topic * topicNorm + WEIGHTS.method * x.method + WEIGHTS.cfp * x.cfp;
        }
        return {
            name: x.v.name,
            type: x.v.type,
            impact: x.v.impact,
            overall: Math.round(overall * 100),
            topicScore: Math.round(topicNorm * 100),
            methodScore: x.method === null ? null : Math.round(x.method * 100),
            cfpScore: Math.round(x.cfp * 100),
            cfpDaysUntil: x.v.cfpDaysUntil ?? null,
            cfpVerified: !!x.v.cfpVerified,
            sharedTerms: x.shared,
            topMethodology: x.topMethodology,
        };
    });

    return results.sort((a, b) => b.overall - a.overall);
}

export interface MethodologyNeighborhood {
    category: string;
    venues: { name: string; share: number }[];
}

/**
 * Methodology Neighborhood Map: group venues by their dominant research culture.
 * This is the angle citation maps miss -- it answers "where do experiments vs
 * design-based research vs qualitative case studies actually live?" from the
 * venue fingerprints, not from who-cites-whom.
 */
export function methodologyNeighborhoods(venueNames: string[]): MethodologyNeighborhood[] {
    const profiles = semanticProfiles as Record<string, any>;
    const cats = Object.keys(METHODOLOGY_MAP);
    const acc: Record<string, { name: string; share: number }[]> = {};
    cats.forEach(c => (acc[c] = []));
    for (const name of venueNames) {
        const p = profiles[name];
        if (!p || !p.vector) continue;
        const dist = methodologyDistribution(p.vector);
        let total = 0;
        for (const c of cats) total += dist[c];
        if (total <= 0) continue;
        for (const c of cats) {
            const share = Math.round((dist[c] / total) * 100);
            if (share > 0) acc[c].push({ name, share });
        }
    }
    return cats.map(c => ({ category: c, venues: acc[c].sort((a, b) => b.share - a.share).slice(0, 6) }));
}
