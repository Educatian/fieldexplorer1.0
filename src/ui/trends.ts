/**
 * IF Trends Module
 * 
 * Impact Factor trend visualization with Chart.js.
 * Shows historical IF data with trend analysis.
 */

import type { Snapshot, RuleSignal } from '../types/snapshot';

export interface IFHistoryEntry {
    year: number;
    value: number;
}

export interface VenueIFData {
    venueId: string;
    venueName: string;
    currentIF?: number;
    impactQuartile?: string;
    history: IFHistoryEntry[];
}

// Sample IF history data (to be expanded)
export const sampleIFHistory: Record<string, IFHistoryEntry[]> = {
    'Educational Technology Research and Development': [
        { year: 2021, value: 3.6 },
        { year: 2022, value: 3.8 },
        { year: 2023, value: 4.0 },
        { year: 2024, value: 4.2 }
    ],
    'Journal of the Learning Sciences': [
        { year: 2021, value: 3.5 },
        { year: 2022, value: 3.7 },
        { year: 2023, value: 3.8 },
        { year: 2024, value: 3.9 }
    ],
    'Computers & Education': [
        { year: 2021, value: 8.5 },
        { year: 2022, value: 11.1 },
        { year: 2023, value: 12.0 },
        { year: 2024, value: 11.5 }
    ],
    'British Journal of Educational Technology': [
        { year: 2021, value: 5.2 },
        { year: 2022, value: 6.1 },
        { year: 2023, value: 6.5 },
        { year: 2024, value: 6.8 }
    ],
    'Learning and Instruction': [
        { year: 2021, value: 4.5 },
        { year: 2022, value: 4.7 },
        { year: 2023, value: 4.9 },
        { year: 2024, value: 5.1 }
    ]
};

/**
 * Calculate IF trend direction
 */
export function calculateTrend(history: IFHistoryEntry[]): 'up' | 'down' | 'stable' {
    if (history.length < 2) return 'stable';

    const sorted = [...history].sort((a, b) => a.year - b.year);
    const recent = sorted.slice(-2);
    const diff = recent[1].value - recent[0].value;

    if (diff > 0.3) return 'up';
    if (diff < -0.3) return 'down';
    return 'stable';
}

/**
 * Calculate consecutive years of increase
 */
export function calculateConsecutiveIncrease(history: IFHistoryEntry[]): number {
    if (history.length < 2) return 0;

    const sorted = [...history].sort((a, b) => a.year - b.year);
    let consecutive = 0;

    for (let i = sorted.length - 1; i > 0; i--) {
        if (sorted[i].value > sorted[i - 1].value) {
            consecutive++;
        } else {
            break;
        }
    }

    return consecutive;
}

/**
 * Generate RuleSignal for IF trend
 */
export function generateIFTrendSignal(venueId: string, history: IFHistoryEntry[]): RuleSignal | null {
    const consecutive = calculateConsecutiveIncrease(history);

    if (consecutive >= 2) {
        return {
            type: 'if_trend_boost',
            category: 'trust',
            weight: consecutive >= 3 ? 2 : 1.5,
            reason: `IF ${consecutive}년 연속 상승`
        };
    }

    return null;
}

/**
 * Get trend badge HTML
 */
export function getTrendBadge(history: IFHistoryEntry[]): string {
    const trend = calculateTrend(history);
    const consecutive = calculateConsecutiveIncrease(history);

    if (trend === 'up' && consecutive >= 2) {
        return `<span class="badge badge-trend-up">📈 ${consecutive}년↑</span>`;
    } else if (trend === 'up') {
        return '<span class="badge badge-trend-up">📈 상승</span>';
    } else if (trend === 'down') {
        return '<span class="badge badge-trend-down">📉 하락</span>';
    }
    return '<span class="badge badge-trend-stable">➡️ 유지</span>';
}

/**
 * Render IF trend chart container HTML
 */
export function renderIFTrendContainer(venueId: string, history: IFHistoryEntry[]): string {
    if (history.length === 0) {
        return '<div class="if-trend-empty">IF 히스토리 데이터 없음</div>';
    }

    const latest = history[history.length - 1];
    const trendBadge = getTrendBadge(history);

    return `
    <div class="if-trend-section">
      <div class="if-trend-header">
        <span class="if-current">IF ${latest.value.toFixed(1)}</span>
        ${trendBadge}
      </div>
      <div class="if-chart-container">
        <canvas id="if-trend-chart" width="280" height="120"></canvas>
      </div>
    </div>
  `;
}

/**
 * Initialize Chart.js chart for IF trend
 * Call this after the container is added to DOM
 */
export function initIFTrendChart(canvasId: string, history: IFHistoryEntry[]): void {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!canvas || history.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // @ts-ignore - Chart is loaded via CDN
    const Chart = window.Chart;
    if (!Chart) {
        console.warn('Chart.js not loaded');
        return;
    }

    // Destroy existing chart if any
    const existingChart = Chart.getChart(canvas);
    if (existingChart) {
        existingChart.destroy();
    }

    const sorted = [...history].sort((a, b) => a.year - b.year);
    const labels = sorted.map(h => h.year.toString());
    const data = sorted.map(h => h.value);

    new Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets: [{
                label: 'Impact Factor',
                data,
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.3,
                pointRadius: 4,
                pointBackgroundColor: '#3b82f6'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: (context: any) => `IF: ${context.raw.toFixed(2)}`
                    }
                }
            },
            scales: {
                x: {
                    grid: { display: false },
                    ticks: { color: '#64748b', font: { size: 10 } }
                },
                y: {
                    grid: { color: 'rgba(100, 116, 139, 0.2)' },
                    ticks: { color: '#64748b', font: { size: 10 } }
                }
            }
        }
    });
}
