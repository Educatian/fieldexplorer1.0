/**
 * Rule Engine Module
 * 
 * Deterministic rule-based recommendation system.
 * Phase 5.5: Rule-only baseline for AI comparison.
 */

import type { RuleSignal } from '../types/snapshot';

export interface VenueRuleInput {
    venueId: string;
    venueName: string;
    type: 'Journal' | 'Conference' | 'SubConference';
    impact?: string;
    cfpDeadline?: string;
    categories?: string[];
    ifHistory?: Array<{ year: number; value: number }>;
    userFavorites?: Set<string>;
    viewedNodes?: string[];
}

export interface RuleEngineResult {
    venueId: string;
    signals: RuleSignal[];
    totalScore: number;
    explanation: string[];
}

// Rule weights configuration
const RULE_WEIGHTS = {
    DEADLINE_BOOST_7DAYS: 3,
    DEADLINE_BOOST_14DAYS: 2.5,
    DEADLINE_BOOST_30DAYS: 2,
    DEADLINE_BOOST_60DAYS: 1,
    IF_Q1_BOOST: 2.5,
    IF_Q2_BOOST: 1.5,
    IF_TREND_CONSECUTIVE_3: 2,
    IF_TREND_CONSECUTIVE_2: 1.5,
    CATEGORY_MATCH: 1.5,
    RECENTLY_VIEWED_PENALTY: -0.5,
    IS_CONFERENCE_BOOST: 0.5
};

/**
 * Rule Engine - generates deterministic signals
 */
export function runRuleEngine(venue: VenueRuleInput, context: {
    currentDate?: Date;
    userCategories?: string[];
    viewedNodes?: string[];
} = {}): RuleEngineResult {
    const signals: RuleSignal[] = [];
    const explanation: string[] = [];
    const now = context.currentDate || new Date();

    // 1. Deadline boost (time-sensitive)
    if (venue.cfpDeadline) {
        const deadlineSignal = checkDeadlineBoost(venue.cfpDeadline, now);
        if (deadlineSignal) {
            signals.push(deadlineSignal);
            explanation.push(deadlineSignal.reason);
        }
    }

    // 2. Impact factor boost (trust)
    if (venue.impact) {
        const impactSignal = checkImpactBoost(venue.impact);
        if (impactSignal) {
            signals.push(impactSignal);
            explanation.push(impactSignal.reason);
        }
    }

    // 3. IF Trend boost (trust)
    if (venue.ifHistory && venue.ifHistory.length >= 2) {
        const trendSignal = checkIFTrendBoost(venue.ifHistory);
        if (trendSignal) {
            signals.push(trendSignal);
            explanation.push(trendSignal.reason);
        }
    }

    // 4. Category match boost (relevance)
    if (venue.categories && context.userCategories) {
        const categorySignal = checkCategoryMatch(venue.categories, context.userCategories);
        if (categorySignal) {
            signals.push(categorySignal);
            explanation.push(categorySignal.reason);
        }
    }

    // 5. Recently viewed penalty (behavior)
    if (context.viewedNodes?.includes(venue.venueId)) {
        signals.push({
            type: 'recency_boost',
            category: 'behavior',
            weight: RULE_WEIGHTS.RECENTLY_VIEWED_PENALTY,
            reason: '최근 조회됨'
        });
        explanation.push('최근 조회됨 (중복 추천 방지)');
    }

    // Calculate total score
    const totalScore = signals.reduce((sum, s) => sum + s.weight, 0);

    return {
        venueId: venue.venueId,
        signals,
        totalScore,
        explanation
    };
}

/**
 * Check deadline boost
 */
function checkDeadlineBoost(cfpMonth: string, now: Date): RuleSignal | null {
    const monthMap: Record<string, number> = {
        'January': 0, 'February': 1, 'March': 2, 'April': 3,
        'May': 4, 'June': 5, 'July': 6, 'August': 7,
        'September': 8, 'October': 9, 'November': 10, 'December': 11
    };

    const firstMonth = cfpMonth.split('/')[0];
    const monthIndex = monthMap[firstMonth];
    if (monthIndex === undefined) return null;

    let deadline = new Date(now.getFullYear(), monthIndex, 15);
    if (deadline < now) {
        deadline = new Date(now.getFullYear() + 1, monthIndex, 15);
    }

    const daysUntil = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (daysUntil <= 7) {
        return {
            type: 'deadline_boost',
            category: 'time',
            weight: RULE_WEIGHTS.DEADLINE_BOOST_7DAYS,
            reason: '마감 임박 (7일 이내)',
            expiresAt: deadline
        };
    } else if (daysUntil <= 14) {
        return {
            type: 'deadline_boost',
            category: 'time',
            weight: RULE_WEIGHTS.DEADLINE_BOOST_14DAYS,
            reason: '마감 임박 (2주 이내)',
            expiresAt: deadline
        };
    } else if (daysUntil <= 30) {
        return {
            type: 'deadline_boost',
            category: 'time',
            weight: RULE_WEIGHTS.DEADLINE_BOOST_30DAYS,
            reason: '마감 다가옴 (1개월 이내)',
            expiresAt: deadline
        };
    } else if (daysUntil <= 60) {
        return {
            type: 'deadline_boost',
            category: 'time',
            weight: RULE_WEIGHTS.DEADLINE_BOOST_60DAYS,
            reason: '여유 있음 (2개월 이내)',
            expiresAt: deadline
        };
    }

    return null;
}

/**
 * Check impact factor boost
 */
function checkImpactBoost(impact: string): RuleSignal | null {
    if (impact === 'Q1') {
        return {
            type: 'similarity_boost',
            category: 'trust',
            weight: RULE_WEIGHTS.IF_Q1_BOOST,
            reason: 'Q1 등급 저널'
        };
    } else if (impact === 'Q2') {
        return {
            type: 'similarity_boost',
            category: 'trust',
            weight: RULE_WEIGHTS.IF_Q2_BOOST,
            reason: 'Q2 등급 저널'
        };
    }
    return null;
}

/**
 * Check IF trend boost
 */
function checkIFTrendBoost(history: Array<{ year: number; value: number }>): RuleSignal | null {
    if (history.length < 2) return null;

    const sorted = [...history].sort((a, b) => a.year - b.year);
    let consecutive = 0;

    for (let i = sorted.length - 1; i > 0; i--) {
        if (sorted[i].value > sorted[i - 1].value) {
            consecutive++;
        } else {
            break;
        }
    }

    if (consecutive >= 3) {
        return {
            type: 'if_trend_boost',
            category: 'trust',
            weight: RULE_WEIGHTS.IF_TREND_CONSECUTIVE_3,
            reason: `IF ${consecutive}년 연속 상승`
        };
    } else if (consecutive >= 2) {
        return {
            type: 'if_trend_boost',
            category: 'trust',
            weight: RULE_WEIGHTS.IF_TREND_CONSECUTIVE_2,
            reason: `IF ${consecutive}년 연속 상승`
        };
    }

    return null;
}

/**
 * Check category match
 */
function checkCategoryMatch(venueCategories: string[], userCategories: string[]): RuleSignal | null {
    const matches = venueCategories.filter(c => userCategories.includes(c));

    if (matches.length > 0) {
        return {
            type: 'similarity_boost',
            category: 'relevance',
            weight: RULE_WEIGHTS.CATEGORY_MATCH * matches.length,
            reason: `관심 카테고리 일치: ${matches.join(', ')}`
        };
    }

    return null;
}

/**
 * Rule Engine metrics for baseline comparison
 */
export interface RuleEngineMetrics {
    totalEvaluations: number;
    signalCounts: Record<string, number>;
    avgScore: number;
    topRecommendations: Array<{ venueId: string; score: number }>;
    evaluatedAt: Date;
}

let metricsAccumulator: {
    evaluations: number;
    signalCounts: Record<string, number>;
    scores: number[];
    results: RuleEngineResult[];
} = {
    evaluations: 0,
    signalCounts: {},
    scores: [],
    results: []
};

/**
 * Track Rule Engine evaluation for metrics
 */
export function trackRuleEvaluation(result: RuleEngineResult): void {
    metricsAccumulator.evaluations++;
    metricsAccumulator.scores.push(result.totalScore);
    metricsAccumulator.results.push(result);

    for (const signal of result.signals) {
        metricsAccumulator.signalCounts[signal.type] =
            (metricsAccumulator.signalCounts[signal.type] || 0) + 1;
    }
}

/**
 * Get Rule Engine metrics snapshot
 */
export function getRuleEngineMetrics(): RuleEngineMetrics {
    const avgScore = metricsAccumulator.scores.length > 0
        ? metricsAccumulator.scores.reduce((a, b) => a + b, 0) / metricsAccumulator.scores.length
        : 0;

    const topRecommendations = [...metricsAccumulator.results]
        .sort((a, b) => b.totalScore - a.totalScore)
        .slice(0, 10)
        .map(r => ({ venueId: r.venueId, score: r.totalScore }));

    return {
        totalEvaluations: metricsAccumulator.evaluations,
        signalCounts: { ...metricsAccumulator.signalCounts },
        avgScore,
        topRecommendations,
        evaluatedAt: new Date()
    };
}

/**
 * Reset metrics accumulator
 */
export function resetRuleEngineMetrics(): void {
    metricsAccumulator = {
        evaluations: 0,
        signalCounts: {},
        scores: [],
        results: []
    };
}
