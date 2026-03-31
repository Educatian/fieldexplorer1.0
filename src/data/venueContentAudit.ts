export type ContentStatus = 'official' | 'publisher' | 'editorial' | 'reference' | 'suppressed';

export interface VenueWebsiteAudit {
    url: string;
    status: 'official' | 'publisher';
    verifiedAt: string;
    sourceLabel?: string;
    sourceUrl?: string;
}

export interface VenueContentAudit {
    website?: VenueWebsiteAudit;
    overviewStatus: ContentStatus;
    topicsStatus: ContentStatus;
    methodologyStatus: ContentStatus;
    impactStatus: ContentStatus;
    newcomerStatus: ContentStatus;
    contributorStatus: ContentStatus;
}

const FACT_CHECKED_ON = '2026-03-31';

const venueWebsiteOverrides: Record<string, VenueWebsiteAudit> = {
    'AERA Annual Meeting': {
        url: 'https://www.aera.net/Events-Meetings/Annual-Meeting/2026-Annual-Meeting',
        status: 'official',
        verifiedAt: FACT_CHECKED_ON,
        sourceLabel: 'AERA 2026 Annual Meeting',
        sourceUrl: 'https://www.aera.net/Events-Meetings/Annual-Meeting/2026-Annual-Meeting'
    },
    'LAK Conference': {
        url: 'https://www.solaresearch.org/events/lak/lak26/general-call/',
        status: 'official',
        verifiedAt: FACT_CHECKED_ON,
        sourceLabel: 'LAK26 General Call',
        sourceUrl: 'https://www.solaresearch.org/events/lak/lak26/general-call/'
    },
    'EDM Conference': {
        url: 'https://educationaldatamining.org/edm2026/important-dates/',
        status: 'official',
        verifiedAt: FACT_CHECKED_ON,
        sourceLabel: 'EDM 2026 Important Dates',
        sourceUrl: 'https://educationaldatamining.org/edm2026/important-dates/'
    },
    'AIED Conference': {
        url: 'https://aied-conference.org/2026/call-for-paper',
        status: 'official',
        verifiedAt: FACT_CHECKED_ON,
        sourceLabel: 'AIED 2026 Call for Paper',
        sourceUrl: 'https://aied-conference.org/2026/call-for-paper'
    },
    'CHI Conference': {
        url: 'https://chi2026.acm.org/for-authors/papers/',
        status: 'official',
        verifiedAt: FACT_CHECKED_ON,
        sourceLabel: 'CHI 2026 Papers',
        sourceUrl: 'https://chi2026.acm.org/for-authors/papers/'
    },
    'CSCW Conference': {
        url: 'https://cscw.acm.org/2026/papers.html',
        status: 'official',
        verifiedAt: FACT_CHECKED_ON,
        sourceLabel: 'CSCW 2026 Papers',
        sourceUrl: 'https://cscw.acm.org/2026/papers.html'
    },
    'UIST Conference': {
        url: 'https://uist.acm.org/2026/',
        status: 'official',
        verifiedAt: FACT_CHECKED_ON,
        sourceLabel: 'UIST 2026 Official Site',
        sourceUrl: 'https://uist.acm.org/2026/'
    },
    'IDC Conference': {
        url: 'https://idc.acm.org/2026/',
        status: 'official',
        verifiedAt: FACT_CHECKED_ON,
        sourceLabel: 'IDC 2026 Official Site',
        sourceUrl: 'https://idc.acm.org/2026/'
    },
    'IEEE VR': {
        url: 'https://ieeevr.org/2026/',
        status: 'official',
        verifiedAt: FACT_CHECKED_ON,
        sourceLabel: 'IEEE VR 2026 Official Site',
        sourceUrl: 'https://ieeevr.org/2026/'
    },
    'ETRA Symposium': {
        url: 'https://etra.acm.org/2026/submissionprocess.html',
        status: 'official',
        verifiedAt: FACT_CHECKED_ON,
        sourceLabel: 'ETRA 2026 Submission Process',
        sourceUrl: 'https://etra.acm.org/2026/submissionprocess.html'
    },
    'SIGCSE Technical Symposium': {
        url: 'https://sigcse2026.sigcse.org/',
        status: 'official',
        verifiedAt: FACT_CHECKED_ON,
        sourceLabel: 'SIGCSE TS 2026 Official Site',
        sourceUrl: 'https://sigcse2026.sigcse.org/'
    },
    'ICER Conference': {
        url: 'https://icer2026.acm.org/track/icer-2026-papers',
        status: 'official',
        verifiedAt: FACT_CHECKED_ON,
        sourceLabel: 'ICER 2026 Research Papers',
        sourceUrl: 'https://icer2026.acm.org/track/icer-2026-papers'
    }
};

export const IMPACT_REFERENCE_NOTE = 'Q 등급은 앱 내부의 참고용 정적 분류입니다. 실시간 JCR/SJR 수치를 직접 반영하지 않습니다.';
export const OVERVIEW_EDITORIAL_NOTE = '개요와 주요 토픽은 공식 aims and scope와 학회 소개를 바탕으로 정리한 편집 요약입니다.';
export const METHODOLOGY_REFERENCE_NOTE = '연구 성향 프로필은 앱 내 정적 프로필과 키워드 매핑을 조합한 탐색용 참고 정보입니다.';
export const NEWCOMER_SUPPRESSED_NOTE = '채택률과 심사 기간은 공개 공식 소스가 일관되지 않아 단정형 수치를 기본 노출에서 제외했습니다.';
export const CONTRIBUTORS_SUPPRESSED_NOTE = '대표 연구자 목록은 시기와 맥락에 따라 크게 달라질 수 있어 기본 노출에서 제외했습니다.';

export function getVenueContentAudit(name: string, fallbackWebsite?: string): VenueContentAudit {
    const override = venueWebsiteOverrides[name];
    const website = override ?? (fallbackWebsite && fallbackWebsite !== '#'
        ? {
            url: fallbackWebsite,
            status: isPublisherWebsite(fallbackWebsite) ? 'publisher' : 'official',
            verifiedAt: FACT_CHECKED_ON
        }
        : undefined);

    return {
        website,
        overviewStatus: 'editorial',
        topicsStatus: 'editorial',
        methodologyStatus: 'reference',
        impactStatus: 'reference',
        newcomerStatus: 'suppressed',
        contributorStatus: 'suppressed'
    };
}

function isPublisherWebsite(url: string): boolean {
    return /(springer|sciencedirect|tandfonline|sagepub|onlinelibrary\.wiley|apa\.org|dl\.acm\.org|ieeexplore)/i.test(url);
}

export function softenEditorialDescription(text: string): string {
    const replacements: Array<[RegExp, string]> = [
        [/최고 저널/g, '대표 저널 중 하나'],
        [/최상위 저널/g, '영향력 있는 저널'],
        [/선도적 저널/g, '대표적인 저널'],
        [/핵심 저널/g, '주요 저널'],
        [/핵심 국제학술대회/g, '주요 국제학술대회'],
        [/최고 학술대회/g, '대표 학술대회'],
        [/세계 최고의 학술대회/g, '대표적인 국제학술대회'],
        [/대규모 연례 학술대회/g, '연례 학술대회'],
        [/선도적인 국제 학술지/g, '주요 국제 학술지']
    ];

    return replacements.reduce((acc, [pattern, replacement]) => acc.replace(pattern, replacement), text);
}
