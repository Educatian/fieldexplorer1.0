/**
 * AI Ranking Module
 * 
 * Phase 6: AI-enhanced recommendation ranking.
 * Implements Rule → AI → Human pipeline with failure mode fallback.
 */

import { runRuleEngine, trackRuleEvaluation, type VenueRuleInput, type RuleEngineResult } from './rules';

export interface AIRankingConfig {
    enabled: boolean;
    modelVersion: string;
    fallbackToRules: boolean;
    minConfidence: number;
}

export interface AIRankingResult {
    venueId: string;
    ruleScore: number;
    aiScore: number | null;
    finalScore: number;
    source: 'rule' | 'ai' | 'hybrid';
    confidence: number;
    explanation: string[];
}

// Default configuration
let aiConfig: AIRankingConfig = {
    enabled: false, // Disabled by default for Phase 5.5 baseline
    modelVersion: 'rule-only-v1',
    fallbackToRules: true,
    minConfidence: 0.6
};

// Simulated AI state (for future Gemini/OpenAI integration)
let aiAvailable = false;
let lastAIError: string | null = null;

/**
 * Configure AI ranking
 */
export function configureAI(config: Partial<AIRankingConfig>): void {
    aiConfig = { ...aiConfig, ...config };
}

/**
 * Get current AI configuration
 */
export function getAIConfig(): AIRankingConfig {
    return { ...aiConfig };
}

/**
 * Check if AI is available
 */
export function isAIAvailable(): boolean {
    return aiConfig.enabled && aiAvailable;
}

/**
 * Failure Mode Handler
 */
interface FailureMode {
    scenario: string;
    fallback: string;
    lastOccurred?: Date;
    occurrenceCount: number;
}

const failureModes: Record<string, FailureMode> = {
    'ai_api_failure': {
        scenario: 'AI API 호출 실패',
        fallback: 'Rule Engine 결과 사용',
        occurrenceCount: 0
    },
    'ai_timeout': {
        scenario: 'AI 응답 시간 초과',
        fallback: 'Rule Engine 결과 사용',
        occurrenceCount: 0
    },
    'low_confidence': {
        scenario: 'AI 신뢰도 낮음',
        fallback: 'Rule Engine 결과 가중 평균',
        occurrenceCount: 0
    },
    'data_missing': {
        scenario: '필수 데이터 누락',
        fallback: '기본 추천만 표시',
        occurrenceCount: 0
    },
    'supabase_outage': {
        scenario: 'Supabase 접속 불가',
        fallback: 'LocalStorage 캐시 사용',
        occurrenceCount: 0
    },
    'network_error': {
        scenario: '네트워크 오류',
        fallback: '오프라인 모드',
        occurrenceCount: 0
    }
};

/**
 * Log failure mode occurrence
 */
export function logFailure(mode: keyof typeof failureModes): void {
    if (failureModes[mode]) {
        failureModes[mode].lastOccurred = new Date();
        failureModes[mode].occurrenceCount++;
        console.warn(`[FailureMode] ${failureModes[mode].scenario} → ${failureModes[mode].fallback}`);
    }
}

/**
 * Get failure mode statistics
 */
export function getFailureModeStats(): Record<string, FailureMode> {
    return { ...failureModes };
}

/**
 * Rank venues using Rule → AI → Human pipeline
 */
export async function rankVenues(
    venues: VenueRuleInput[],
    context: {
        userCategories?: string[];
        viewedNodes?: string[];
    } = {}
): Promise<AIRankingResult[]> {
    const results: AIRankingResult[] = [];

    for (const venue of venues) {
        try {
            // Step 1: Run Rule Engine
            const ruleResult = runRuleEngine(venue, context);
            trackRuleEvaluation(ruleResult);

            // Step 2: Try AI (if enabled)
            let aiScore: number | null = null;
            let source: 'rule' | 'ai' | 'hybrid' = 'rule';
            let confidence = 0.8; // Default rule confidence

            if (aiConfig.enabled && aiAvailable) {
                try {
                    aiScore = await getAIScore(venue, ruleResult);
                    if (aiScore !== null) {
                        source = 'hybrid';
                        confidence = 0.9;
                    }
                } catch (error) {
                    logFailure('ai_api_failure');
                    if (!aiConfig.fallbackToRules) {
                        throw error;
                    }
                }
            }

            // Step 3: Calculate final score
            let finalScore: number;
            if (aiScore !== null && source === 'hybrid') {
                // Hybrid: weighted average (60% AI, 40% Rules)
                finalScore = aiScore * 0.6 + ruleResult.totalScore * 0.4;
            } else {
                // Rule-only
                finalScore = ruleResult.totalScore;
            }

            results.push({
                venueId: venue.venueId,
                ruleScore: ruleResult.totalScore,
                aiScore,
                finalScore,
                source,
                confidence,
                explanation: ruleResult.explanation
            });

        } catch (error) {
            logFailure('data_missing');
            // Fallback: minimal result
            results.push({
                venueId: venue.venueId,
                ruleScore: 0,
                aiScore: null,
                finalScore: 0,
                source: 'rule',
                confidence: 0.3,
                explanation: ['데이터 처리 중 오류 발생']
            });
        }
    }

    // Sort by final score descending
    return results.sort((a, b) => b.finalScore - a.finalScore);
}

/**
 * Simulated AI scoring (placeholder for future integration)
 * In production: Replace with actual Gemini/OpenAI API call
 */
async function getAIScore(venue: VenueRuleInput, ruleResult: RuleEngineResult): Promise<number | null> {
    // Simulated delay
    await new Promise(resolve => setTimeout(resolve, 10));

    // Placeholder logic: enhance rule score with random factor
    // In production: Call Gemini API with context
    if (!aiAvailable) return null;

    const baseScore = ruleResult.totalScore;
    const aiEnhancement = Math.random() * 0.5; // Small random boost
    return baseScore + aiEnhancement;
}

/**
 * Enable AI (for testing/future use)
 */
export function enableAI(apiKey?: string): void {
    // Placeholder for API key validation
    if (apiKey) {
        aiAvailable = true;
        aiConfig.enabled = true;
        aiConfig.modelVersion = 'gemini-pro-v1';
        console.log('[AI] Enabled with model:', aiConfig.modelVersion);
    }
}

/**
 * Disable AI (return to rule-only baseline)
 */
export function disableAI(): void {
    aiAvailable = false;
    aiConfig.enabled = false;
    aiConfig.modelVersion = 'rule-only-v1';
    console.log('[AI] Disabled, using rule-only baseline');
}

/**
 * Get recommendation explanation for UI
 */
export function getRecommendationExplanation(result: AIRankingResult): string {
    const lines: string[] = [];

    if (result.source === 'hybrid') {
        lines.push('🤖 AI + 규칙 기반 추천');
    } else {
        lines.push('📐 규칙 기반 추천');
    }

    lines.push(...result.explanation.map(e => `• ${e}`));
    lines.push(`신뢰도: ${Math.round(result.confidence * 100)}%`);

    return lines.join('\n');
}
