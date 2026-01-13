/**
 * CFP Calendar Module
 * 
 * Timeline view and filtering for Conference CFP deadlines.
 * Includes RuleSignal generation for deadline_boost.
 */

import type { RuleSignal, Snapshot, CFPInfo } from '../types/snapshot';

export interface CFPEntry {
    venueId: string;
    venueName: string;
    deadline: Date;
    notification?: Date;
    conferenceDate?: Date;
    url?: string;
    daysUntilDeadline: number;
}

/**
 * Parse CFP deadline from venue data
 */
export function parseCFPDeadline(cfpMonth: string | undefined, year: number = new Date().getFullYear()): Date | null {
    if (!cfpMonth) return null;

    const monthMap: Record<string, number> = {
        'January': 0, 'February': 1, 'March': 2, 'April': 3,
        'May': 4, 'June': 5, 'July': 6, 'August': 7,
        'September': 8, 'October': 9, 'November': 10, 'December': 11
    };

    // Handle multiple months like "April/November"
    const firstMonth = cfpMonth.split('/')[0];
    const monthIndex = monthMap[firstMonth];

    if (monthIndex === undefined) return null;

    // Assume deadline is mid-month (15th)
    const deadline = new Date(year, monthIndex, 15);

    // If deadline has passed, use next year
    if (deadline < new Date()) {
        deadline.setFullYear(deadline.getFullYear() + 1);
    }

    return deadline;
}

/**
 * Calculate days until deadline
 */
export function daysUntil(date: Date): number {
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Get CFP entries sorted by deadline
 */
export function getCFPEntries(venues: Array<{ name: string; cfpDeadline?: string }>): CFPEntry[] {
    const entries: CFPEntry[] = [];

    for (const venue of venues) {
        const deadline = parseCFPDeadline(venue.cfpDeadline);
        if (deadline) {
            entries.push({
                venueId: venue.name,
                venueName: venue.name,
                deadline,
                daysUntilDeadline: daysUntil(deadline)
            });
        }
    }

    return entries.sort((a, b) => a.daysUntilDeadline - b.daysUntilDeadline);
}

/**
 * Filter entries by days range
 */
export function filterByDays(entries: CFPEntry[], maxDays: number): CFPEntry[] {
    return entries.filter(e => e.daysUntilDeadline >= 0 && e.daysUntilDeadline <= maxDays);
}

/**
 * Generate RuleSignal for upcoming deadlines
 */
export function generateDeadlineSignals(entries: CFPEntry[]): Map<string, RuleSignal> {
    const signals = new Map<string, RuleSignal>();

    for (const entry of entries) {
        if (entry.daysUntilDeadline < 0) continue; // Past deadline

        let weight = 0;
        let reason = '';

        if (entry.daysUntilDeadline <= 7) {
            weight = 3;
            reason = '마감 임박 (7일 이내)';
        } else if (entry.daysUntilDeadline <= 14) {
            weight = 2.5;
            reason = '마감 임박 (2주 이내)';
        } else if (entry.daysUntilDeadline <= 30) {
            weight = 2;
            reason = '마감 다가옴 (1개월 이내)';
        } else if (entry.daysUntilDeadline <= 60) {
            weight = 1;
            reason = '여유 있음 (2개월 이내)';
        }

        if (weight > 0) {
            signals.set(entry.venueId, {
                type: 'deadline_boost',
                category: 'time',
                weight,
                reason,
                expiresAt: entry.deadline
            });
        }
    }

    return signals;
}

/**
 * Get urgency badge HTML
 */
export function getUrgencyBadge(daysUntil: number): string {
    if (daysUntil < 0) return '<span class="badge badge-expired">마감</span>';
    if (daysUntil <= 7) return '<span class="badge badge-urgent">🔥 D-' + daysUntil + '</span>';
    if (daysUntil <= 14) return '<span class="badge badge-soon">⚡ D-' + daysUntil + '</span>';
    if (daysUntil <= 30) return '<span class="badge badge-upcoming">📅 D-' + daysUntil + '</span>';
    return '<span class="badge badge-normal">D-' + daysUntil + '</span>';
}

/**
 * Render CFP timeline HTML
 */
export function renderCFPTimeline(entries: CFPEntry[], maxItems: number = 10): string {
    const upcoming = entries.filter(e => e.daysUntilDeadline >= 0).slice(0, maxItems);

    if (upcoming.length === 0) {
        return '<div class="cfp-empty">예정된 CFP 마감일이 없습니다</div>';
    }

    return `
    <div class="cfp-timeline">
      ${upcoming.map(e => `
        <div class="cfp-item" data-venue="${e.venueId}">
          <div class="cfp-date">
            <span class="cfp-month">${e.deadline.toLocaleDateString('ko-KR', { month: 'short' })}</span>
            <span class="cfp-day">${e.deadline.getDate()}</span>
          </div>
          <div class="cfp-info">
            <div class="cfp-name">${e.venueName}</div>
            ${getUrgencyBadge(e.daysUntilDeadline)}
          </div>
        </div>
      `).join('')}
    </div>
  `;
}
