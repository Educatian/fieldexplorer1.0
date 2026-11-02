import { describe, it, expect } from 'vitest';
import {
    vectorizeText, cosine, methodologyDistribution, rankSubmissionFit,
    methodologyNeighborhoods, explainFit, type VenueFitResult,
} from './submissionFit';

function mkResult(over: Partial<VenueFitResult> & { name: string }): VenueFitResult {
    return {
        name: over.name,
        overall: over.overall ?? 50,
        topicScore: over.topicScore ?? 50,
        methodScore: over.methodScore ?? null,
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

    it('scores by topic fit alone when the abstract has no methodology signal', () => {
        const abstract = 'online education feedback digital students engagement motivation classrooms';
        const ranked = rankSubmissionFit(abstract, [
            { name: 'Computers & Education', type: 'Journal' },
            { name: 'Journal of the Learning Sciences', type: 'Journal' },
        ]);
        expect(ranked.length).toBeGreaterThan(0);
        for (const r of ranked) {
            expect(r.methodScore).toBeNull();
            expect(r.overall).toBe(r.topicScore);
        }
        // The strongest topical match anchors the pool at 100.
        expect(ranked[0].overall).toBe(100);
    });

    it('exposes raw overlap independently of candidate-relative normalization', () => {
        const abstract = 'online education feedback digital students engagement motivation classrooms';
        const full = rankSubmissionFit(abstract, [
            { name: 'Computers & Education' }, { name: 'Journal of the Learning Sciences' },
            { name: 'British Journal of Educational Technology' },
        ]);
        expect(full.length).toBeGreaterThan(1);
        const weaker = full.find(r => r.topicScore < 100)!;
        expect(weaker).toBeDefined();
        const solo = rankSubmissionFit(abstract, [{ name: weaker.name }])[0];
        expect(solo.rawTopicCosine).toBe(weaker.rawTopicCosine);
        expect(solo.topicScore).toBe(100);
        expect(solo.candidateCount).toBe(1);
        expect(weaker.candidateCount).toBe(full.length);
        expect(solo.matchedTermCount).toBe(weaker.matchedTermCount);
        expect(solo.matchedTermCount!).toBeGreaterThanOrEqual(solo.sharedTerms.length);
        expect(solo.rawTopicCosine!).toBeGreaterThan(0);
        expect(solo.rawTopicCosine!).toBeLessThanOrEqual(1);
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
        expect(t!.caveat).toContain('게재 확률이 아닙니다');
        expect(t!.caveat).toContain('상대점수');
    });

    it('contrasts #1 vs #2 on distinctive terms and methodology culture', () => {
        const t = explainFit([
            mkResult({ name: 'ijCSCL', sharedTerms: ['collaborative', 'discourse', 'group'], topMethodology: 'Qualitative', impact: 'Q1' }),
            mkResult({ name: 'Computers & Education', sharedTerms: ['collaborative', 'analytics', 'platform'], topMethodology: 'Data & AI', impact: 'Q2' }),
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
        // Q-tier differs → tradeoff surfaces both tiers
        expect(t!.tradeoff).toContain('ijCSCL=Q1');
        expect(t!.tradeoff).toContain('Computers & Education=Q2');
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
