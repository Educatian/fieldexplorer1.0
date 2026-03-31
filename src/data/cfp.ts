export type CFPConfidence = 'official' | 'estimated' | 'missing';
export type CFPDeadlineState = 'upcoming' | 'passed' | 'unknown';
export type CFPTimezone = 'AoE' | 'PT' | 'Local';

export interface OfficialCFPRecord {
    venueName: string;
    submissionDeadline: string;
    submissionLabel: string;
    abstractDeadline?: string;
    abstractLabel?: string;
    sourceUrl: string;
    sourceLabel: string;
    verifiedAt: string;
    timezone: CFPTimezone;
    notes?: string;
}

export type CFPRecordMap = Record<string, OfficialCFPRecord>;

export interface ResolvedCFPInfo {
    venueName: string;
    confidence: CFPConfidence;
    deadlineState: CFPDeadlineState;
    isStale: boolean;
    primaryDeadlineIso: string | null;
    primaryDeadlineLabel: string;
    primaryDeadlineDisplay: string;
    secondaryDeadlineIso?: string;
    secondaryDeadlineLabel?: string;
    secondaryDeadlineDisplay?: string;
    daysUntil: number | null;
    sourceUrl?: string;
    sourceLabel?: string;
    verifiedAt?: string;
    timezoneLabel?: string;
    note: string;
}

const MONTH_MAP: Record<string, number> = {
    January: 0,
    February: 1,
    March: 2,
    April: 3,
    May: 4,
    June: 5,
    July: 6,
    August: 7,
    September: 8,
    October: 9,
    November: 10,
    December: 11
};

const OFFICIAL_CFP_RECORDS: CFPRecordMap = {
    "AERA Annual Meeting": {
        venueName: "AERA Annual Meeting",
        submissionDeadline: "2025-08-01",
        submissionLabel: "Paper / session submissions due",
        sourceUrl: "https://www.aera.net/Events-Meetings/Annual-Meeting/2026-Annual-Meeting",
        sourceLabel: "AERA 2026 Annual Meeting overview",
        verifiedAt: "2026-03-31",
        timezone: "Local",
        notes: "The official 2026 Annual Meeting page states that submissions closed on August 1, 2025."
    },
    "LAK Conference": {
        venueName: "LAK Conference",
        submissionDeadline: "2025-09-29",
        submissionLabel: "Full / short research papers due",
        sourceUrl: "https://www.solaresearch.org/events/lak/lak26/general-call/",
        sourceLabel: "LAK26 general call",
        verifiedAt: "2026-03-31",
        timezone: "AoE",
        notes: "Uses the research-track deadline published in the official LAK26 general call."
    },
    "EDM Conference": {
        venueName: "EDM Conference",
        submissionDeadline: "2026-02-09",
        submissionLabel: "Full / short papers due",
        abstractDeadline: "2026-02-02",
        abstractLabel: "Abstracts due",
        sourceUrl: "https://educationaldatamining.org/edm2026/important-dates/",
        sourceLabel: "EDM 2026 important dates",
        verifiedAt: "2026-03-31",
        timezone: "AoE",
        notes: "The EDM 2026 page explicitly lists both the abstract deadline and the main paper deadline."
    },
    "AIED Conference": {
        venueName: "AIED Conference",
        submissionDeadline: "2026-02-02",
        submissionLabel: "Main-track papers due",
        abstractDeadline: "2026-01-26",
        abstractLabel: "Main-track abstracts due",
        sourceUrl: "https://aied-conference.org/2026/call-for-paper",
        sourceLabel: "AIED 2026 important dates",
        verifiedAt: "2026-03-31",
        timezone: "AoE",
        notes: "The main-track page lists abstracts and papers separately; the abstract deadline is the first required gate."
    },
    "CHI Conference": {
        venueName: "CHI Conference",
        submissionDeadline: "2025-09-11",
        submissionLabel: "Full paper due",
        abstractDeadline: "2025-09-04",
        abstractLabel: "Abstract / metadata due",
        sourceUrl: "https://chi2026.acm.org/for-authors/papers/",
        sourceLabel: "CHI 2026 papers call",
        verifiedAt: "2026-03-31",
        timezone: "AoE",
        notes: "CHI requires abstract / metadata first, followed by the full paper one week later."
    },
    "ICER Conference": {
        venueName: "ICER Conference",
        submissionDeadline: "2026-02-27",
        submissionLabel: "Full paper submission deadline",
        abstractDeadline: "2026-02-20",
        abstractLabel: "Titles / abstracts / authors due",
        sourceUrl: "https://icer2026.acm.org/track/icer-2026-papers",
        sourceLabel: "ICER 2026 research papers track",
        verifiedAt: "2026-03-31",
        timezone: "AoE",
        notes: "ICER 2026 requires title / abstract metadata before the full paper deadline."
    }
};

function formatDate(dateIso: string): string {
    const [year, month, day] = dateIso.split('-').map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        timeZone: 'UTC'
    }).format(date);
}

function toDeadlineMoment(dateIso: string, timezone: CFPTimezone): Date {
    switch (timezone) {
        case 'AoE':
            return new Date(`${dateIso}T23:59:59-12:00`);
        case 'PT':
            return new Date(`${dateIso}T23:59:59-08:00`);
        default:
            return new Date(`${dateIso}T23:59:59Z`);
    }
}

function calculateDaysUntil(dateIso: string, timezone: CFPTimezone, now: Date): number {
    const deadline = toDeadlineMoment(dateIso, timezone);
    return Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

function getTimezoneLabel(timezone: CFPTimezone): string {
    switch (timezone) {
        case 'AoE':
            return 'AoE';
        case 'PT':
            return 'PT';
        default:
            return 'Local';
    }
}

function parseLegacyMonths(legacyPattern: string): number[] {
    return legacyPattern
        .split('/')
        .map(part => MONTH_MAP[part.trim()])
        .filter((value): value is number => value !== undefined);
}

function resolveEstimatedDeadline(legacyPattern: string, now: Date): string | null {
    const months = parseLegacyMonths(legacyPattern);
    if (!months.length) return null;

    const currentYear = now.getUTCFullYear();
    const candidates = months
        .flatMap(month => [
            new Date(Date.UTC(currentYear, month, 15)),
            new Date(Date.UTC(currentYear + 1, month, 15))
        ])
        .filter(candidate => candidate.getTime() >= now.getTime())
        .sort((a, b) => a.getTime() - b.getTime());

    const deadline = candidates[0];
    if (!deadline) return null;

    const year = deadline.getUTCFullYear();
    const month = String(deadline.getUTCMonth() + 1).padStart(2, '0');
    const day = String(deadline.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

export function resolveCFPInfo(venueName: string, legacyPattern?: string, now = new Date()): ResolvedCFPInfo {
    const official = OFFICIAL_CFP_RECORDS[venueName];

    if (official) {
        const primaryIso = official.abstractDeadline || official.submissionDeadline;
        const primaryLabel = official.abstractLabel || official.submissionLabel;
        const daysUntil = calculateDaysUntil(primaryIso, official.timezone, now);
        const verifiedAgeDays = Math.floor((now.getTime() - new Date(`${official.verifiedAt}T00:00:00Z`).getTime()) / (1000 * 60 * 60 * 24));
        const deadlineState: CFPDeadlineState = daysUntil >= 0 ? 'upcoming' : 'passed';
        const baseNote = official.notes || 'Verified against the official CFP page.';

        return {
            venueName,
            confidence: 'official',
            deadlineState,
            isStale: verifiedAgeDays > 180,
            primaryDeadlineIso: primaryIso,
            primaryDeadlineLabel: primaryLabel,
            primaryDeadlineDisplay: formatDate(primaryIso),
            secondaryDeadlineIso: official.abstractDeadline ? official.submissionDeadline : undefined,
            secondaryDeadlineLabel: official.abstractDeadline ? official.submissionLabel : undefined,
            secondaryDeadlineDisplay: official.abstractDeadline ? formatDate(official.submissionDeadline) : undefined,
            daysUntil,
            sourceUrl: official.sourceUrl,
            sourceLabel: official.sourceLabel,
            verifiedAt: official.verifiedAt,
            timezoneLabel: getTimezoneLabel(official.timezone),
            note: deadlineState === 'passed'
                ? `${baseNote} This stored deadline has already passed, so the next cycle should be re-verified once a new CFP page is published.`
                : baseNote
        };
    }

    if (legacyPattern) {
        const estimatedIso = resolveEstimatedDeadline(legacyPattern, now);
        const daysUntil = estimatedIso ? calculateDaysUntil(estimatedIso, 'Local', now) : null;

        return {
            venueName,
            confidence: 'estimated',
            deadlineState: estimatedIso ? (daysUntil !== null && daysUntil >= 0 ? 'upcoming' : 'passed') : 'unknown',
            isStale: false,
            primaryDeadlineIso: estimatedIso,
            primaryDeadlineLabel: 'Estimated recurring CFP window',
            primaryDeadlineDisplay: estimatedIso ? `${formatDate(estimatedIso)} (estimated)` : legacyPattern,
            daysUntil,
            note: `No current official CFP link is stored yet. This date is estimated from the legacy recurring month pattern: ${legacyPattern}.`
        };
    }

    return {
        venueName,
        confidence: 'missing',
        deadlineState: 'unknown',
        isStale: true,
        primaryDeadlineIso: null,
        primaryDeadlineLabel: 'CFP status unavailable',
        primaryDeadlineDisplay: 'No CFP data',
        daysUntil: null,
        note: 'No CFP schedule is stored for this venue yet.'
    };
}

export function getBuiltInOfficialCFPRecord(venueName: string): OfficialCFPRecord | undefined {
    return OFFICIAL_CFP_RECORDS[venueName];
}

export function getAllBuiltInOfficialCFPRecords(): CFPRecordMap {
    return { ...OFFICIAL_CFP_RECORDS };
}

export function resolveCFPInfoWithOverrides(
    venueName: string,
    legacyPattern: string | undefined,
    overrides: CFPRecordMap,
    now = new Date()
): ResolvedCFPInfo {
    const override = overrides[venueName];

    if (override) {
        const mergedRecords = { ...OFFICIAL_CFP_RECORDS, [venueName]: override };
        const official = mergedRecords[venueName];
        const primaryIso = official.abstractDeadline || official.submissionDeadline;
        const primaryLabel = official.abstractLabel || official.submissionLabel;
        const daysUntil = calculateDaysUntil(primaryIso, official.timezone, now);
        const verifiedAgeDays = Math.floor((now.getTime() - new Date(`${official.verifiedAt}T00:00:00Z`).getTime()) / (1000 * 60 * 60 * 24));
        const deadlineState: CFPDeadlineState = daysUntil >= 0 ? 'upcoming' : 'passed';
        const baseNote = official.notes || 'Verified against the official CFP page.';

        return {
            venueName,
            confidence: 'official',
            deadlineState,
            isStale: verifiedAgeDays > 180,
            primaryDeadlineIso: primaryIso,
            primaryDeadlineLabel: primaryLabel,
            primaryDeadlineDisplay: formatDate(primaryIso),
            secondaryDeadlineIso: official.abstractDeadline ? official.submissionDeadline : undefined,
            secondaryDeadlineLabel: official.abstractDeadline ? official.submissionLabel : undefined,
            secondaryDeadlineDisplay: official.abstractDeadline ? formatDate(official.submissionDeadline) : undefined,
            daysUntil,
            sourceUrl: official.sourceUrl,
            sourceLabel: official.sourceLabel,
            verifiedAt: official.verifiedAt,
            timezoneLabel: getTimezoneLabel(official.timezone),
            note: deadlineState === 'passed'
                ? `${baseNote} This stored deadline has already passed, so the next cycle should be re-verified once a new CFP page is published.`
                : baseNote
        };
    }

    return resolveCFPInfo(venueName, legacyPattern, now);
}
