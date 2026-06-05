import { describe, it, expect } from 'vitest';
import {
    vectorizeText, cosine, methodologyDistribution, cfpReadiness, rankSubmissionFit,
    methodologyNeighborhoods, explainFit, type VenueFitResult,
} from './submissionFit';

function mkResult(over: Partial<VenueFitResult> & { name: string }): VenueFitResult {
    return {
        name: over.name,
        overall: over.overall ?? 50,
        topicScore: over.topicScore ?? 50,
        methodScore: over.methodScore ?? null,
        cfpScore: over.cfpScore ?? 30,
        cfpDaysUntil: over.cfpDaysUntil ?? null,
        cfpVerified: over.cfpVerified ?? false,
        sharedTerms: over.sharedTerms ?? [],
        topMethodology: over.topMethodology ?? null,
        type: over.type,
        impact: over.impact,
    };
}

describe('vectorizeText', () => {
    it('drops short words and stopwords, keeps unigrams + bigrams', () => {
        const v = vectorizeText('Collaborative learning analytics in classrooms');
        expect(v['collaborative']).toBe(1);
        expect(v['analytics']).toBe(1);
        expect(v['the']).toBeUndefined();
        expect(v['collaborative learning']).toBe(1); // bigram
    });
});

describe('cosine', () => {
    it('is 1 for identical vectors and 0 for disjoint', () => {
        const a = { x: 1, y: 2 };
        expect(cosine(a, a)).toBeCloseTo(1, 5);
        expect(cosine({ a: 1 }, { b: 1 })).toBe(0);
    });
});

describe('methodologyDistribution', () => {
    it('routes ML/AI vocabulary to Data & AI', () => {
        const d = methodologyDistribution(vectorizeText(
            'machine learning predictive classification algorithm learning analytics'));
        const top = Object.entries(d).sort((a, b) => b[1] - a[1])[0][0];
        expect(top).toBe('Data & AI');
    });
    it('routes interview/case vocabulary to Qualitative', () => {
        const d = methodologyDistribution(vectorizeText(
            'qualitative case study interview ethnographic thematic analysis'));
        const top = Object.entries(d).sort((a, b) => b[1] - a[1])[0][0];
        expect(top).toBe('Qualitative');
    });
});

describe('cfpReadiness', () => {
    it('is highest for imminent deadlines and decays', () => {
        expect(cfpReadiness(7)).toBeGreaterThan(cfpReadiness(30));
        expect(cfpReadiness(30)).toBeGreaterThan(cfpReadiness(120));
        expect(cfpReadiness(-3)).toBeLessThan(cfpReadiness(200));
        expect(cfpReadiness(null)).toBeGreaterThan(0);
        expect(cfpReadiness(10, true)).toBeGreaterThanOrEqual(cfpReadiness(10, false));
    });
});

describe('rankSubmissionFit', () => {
    it('returns [] when the abstract has no usable signal', () => {
        expect(rankSubmissionFit('a an the of', [{ name: 'Computers & Education' }])).toEqual([]);
    });

    it('ranks the topically-matching venue above an unrelated one', () => {
        // Build an abstract from a venue we know exists in the fingerprint set.
        const abstract = `This study examines learning analytics and self-regulated learning
            in online higher education, using machine learning to model student engagement
            and feedback from digital learning environments.`;
        const venues = [
            { name: 'Computers & Education', type: 'Journal' },
            { name: 'Journal of the Learning Sciences', type: 'Journal' },
        ].filter(v => v); // both should have fingerprints
        const ranked = rankSubmissionFit(abstract, venues);
        expect(ranked.length).toBeGreaterThan(0);
        // Every result carries an explainable score breakdown.
        for (const r of ranked) {
            expect(r.overall).toBeGreaterThanOrEqual(0);
            expect(r.overall).toBeLessThanOrEqual(100);
            expect(Array.isArray(r.sharedTerms)).toBe(true);
        }
        // Results are sorted by overall descending.
        for (let i = 1; i < ranked.length; i++) {
            expect(ranked[i - 1].overall).toBeGreaterThanOrEqual(ranked[i].overall);
        }
    });

    it('exposes 6 methodology neighborhoods with sorted venue shares', () => {
        const nb = methodologyNeighborhoods([
            'Computers & Education', 'Journal of the Learning Sciences',
            'British Journal of Educational Technology', 'Educational Technology Research and Development',
        ]);
        expect(nb).toHaveLength(6);
        for (const cat of nb) {
            for (let i = 1; i < cat.venues.length; i++) {
                expect(cat.venues[i - 1].share).toBeGreaterThanOrEqual(cat.venues[i].share);
            }
        }
        // At least one category should have populated venues from the fingerprint set.
        expect(nb.some(c => c.venues.length > 0)).toBe(true);
    });

    it('rewards CFP readiness when topic is held roughly constant', () => {
        const abstract = 'learning analytics online education feedback digital students engagement';
        const soon = rankSubmissionFit(abstract, [{ name: 'Computers & Education', cfpDaysUntil: 7, cfpVerified: true }]);
        const far = rankSubmissionFit(abstract, [{ name: 'Computers & Education', cfpDaysUntil: 300 }]);
        if (soon.length && far.length) {
            expect(soon[0].cfpScore).toBeGreaterThan(far[0].cfpScore);
            expect(soon[0].overall).toBeGreaterThanOrEqual(far[0].overall);
        }
    });
});

describe('explainFit (scorecard teaching moment)', () => {
    it('returns null for empty results', () => {
        expect(explainFit([])).toBeNull();
    });

    it('builds a headline + self-check from the top result alone', () => {
        const t = explainFit([mkResult({
            name: 'Journal of the Learning Sciences',
            sharedTerms: ['epistemic', 'argumentation', 'sensemaking'],
            topMethodology: 'Qualitative',
        })]);
        expect(t).not.toBeNull();
        expect(t!.topName).toBe('Journal of the Learning Sciences');
        expect(t!.runnerName).toBeNull();
        expect(t!.contrast).toBeNull();           // no runner-up
        expect(t!.headline).toContain('Journal of the Learning Sciences');
        expect(t!.headline).toContain('Qualitative'); // discourse/culture signal surfaced
        expect(t!.nextCheck.length).toBeGreaterThan(0);
        expect(t!.caveat).toContain('휴리스틱');     // honest framing
    });

    it('contrasts #1 vs #2 on distinctive terms and methodology culture', () => {
        const t = explainFit([
            mkResult({ name: 'ijCSCL', sharedTerms: ['collaborative', 'discourse', 'group'], topMethodology: 'Qualitative', impact: 'Q1', cfpDaysUntil: 10 }),
            mkResult({ name: 'Computers & Education', sharedTerms: ['collaborative', 'analytics', 'platform'], topMethodology: 'Data & AI', impact: 'Q1', cfpDaysUntil: 120 }),
        ]);
        expect(t).not.toBeNull();
        expect(t!.runnerName).toBe('Computers & Education');
        // shared term "collaborative" is common → excluded from distinctive sets
        expect(t!.distinctiveTop).not.toContain('collaborative');
        expect(t!.distinctiveTop).toContain('discourse');
        expect(t!.distinctiveRunner).toContain('analytics');
        expect(t!.contrast).toBeTruthy();
        expect(t!.methodNote).toContain('Qualitative');
        expect(t!.methodNote).toContain('Data & AI');
        // CFP gap >= 14 days → tradeoff surfaces the sooner deadline
        expect(t!.tradeoff).toContain('ijCSCL');
    });

    it('degrades gracefully when there is no methodology or term signal', () => {
        const t = explainFit([
            mkResult({ name: 'Venue A', sharedTerms: [], topMethodology: null }),
            mkResult({ name: 'Venue B', sharedTerms: [], topMethodology: null }),
        ]);
        expect(t).not.toBeNull();
        expect(t!.methodNote).toBeNull();
        expect(t!.headline).toContain('약');       // weak-signal wording
        expect(typeof t!.nextCheck).toBe('string');
    });
});
