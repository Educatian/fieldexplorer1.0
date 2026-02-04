/**
 * Venue data types and loaders
 * Stable IDs (slugs) are used for favorites sync
 */

import venuesJson from './venues.json';

// ============================================================================
// TYPES
// ============================================================================

export interface VenueInfo {
    id: string;        // Stable slug for database references
    name: string;      // Display name
    type: 'Journal' | 'Conference' | 'SubConference';
    categories: string[];
    impact?: 'Q1' | 'Q2' | 'Q3' | 'Q4';
    cfpDeadline?: string;
}

export interface VenueDetails {
    overview: { description: string; website: string };
    topics: string[];
    methodologyProfile: { methodology: string; prevalence: number }[];
    isExpertVerified?: boolean;
    newcomerFriendliness: { acceptanceRate: string; timeToDecision: string };
    keyContributors: { name: string; affiliation: string }[];
}

// ============================================================================
// DATA
// ============================================================================

export const venueData: VenueInfo[] = venuesJson as VenueInfo[];

// Lookup maps for O(1) access
const venueById = new Map<string, VenueInfo>();
const venueByName = new Map<string, VenueInfo>();

venueData.forEach(v => {
    venueById.set(v.id, v);
    venueByName.set(v.name, v);
});

// ============================================================================
// ACCESSORS
// ============================================================================

export function getVenueById(id: string): VenueInfo | undefined {
    return venueById.get(id);
}

export function getVenueByName(name: string): VenueInfo | undefined {
    return venueByName.get(name);
}

export function getAllVenues(): VenueInfo[] {
    return venueData;
}

export function getVenueIdByName(name: string): string | undefined {
    return venueByName.get(name)?.id;
}

// ============================================================================
// STATIC VENUE DETAILS
// ============================================================================

const venueDetailsMap: Record<string, VenueDetails> = {
    "etrd": {
        overview: { description: "교육공학 분야의 최고 저널로, 연구와 개발을 연결하는 논문을 게재합니다.", website: "https://www.springer.com/journal/11423" },
        topics: ["Instructional Design", "Educational Technology", "Learning Environments"],
        methodologyProfile: [{ methodology: "Design-based Research", prevalence: 35 }, { methodology: "Experimental", prevalence: 30 }, { methodology: "Mixed Methods", prevalence: 25 }],
        newcomerFriendliness: { acceptanceRate: "15-20%", timeToDecision: "3-4개월" },
        keyContributors: [{ name: "Richard E. Mayer", affiliation: "UC Santa Barbara" }, { name: "Jan Elen", affiliation: "KU Leuven" }]
    },
    "jls": {
        overview: { description: "학습과학 분야의 선도적 저널로, 학습의 인지적, 사회적 측면을 다룹니다.", website: "https://www.tandfonline.com/toc/hlns20/current" },
        topics: ["Cognition", "Learning Environments", "CSCL", "Educational Design"],
        methodologyProfile: [{ methodology: "Design-based Research", prevalence: 40 }, { methodology: "Qualitative", prevalence: 35 }, { methodology: "Mixed Methods", prevalence: 20 }],
        newcomerFriendliness: { acceptanceRate: "10-15%", timeToDecision: "4-6개월" },
        keyContributors: [{ name: "James Greeno", affiliation: "Stanford" }, { name: "Brigid Barron", affiliation: "Stanford" }]
    },
    "ce": {
        overview: { description: "테크놀로지 기반 학습의 최상위 저널로, 실증 연구를 중시합니다.", website: "https://www.sciencedirect.com/journal/computers-and-education" },
        topics: ["TEL", "E-learning", "Educational Technology", "Learning Analytics"],
        methodologyProfile: [{ methodology: "Experimental", prevalence: 45 }, { methodology: "Survey", prevalence: 25 }, { methodology: "Mixed Methods", prevalence: 20 }],
        newcomerFriendliness: { acceptanceRate: "20-25%", timeToDecision: "2-3개월" },
        keyContributors: [{ name: "Dragan Gasevic", affiliation: "Monash University" }, { name: "Vania Dimitrova", affiliation: "University of Leeds" }]
    },
    "bjet": {
        overview: { description: "영국 기반의 교육공학 저널로, 이론과 실제를 연결합니다.", website: "https://bera-journals.onlinelibrary.wiley.com/journal/14678535" },
        topics: ["Educational Technology", "Digital Learning", "Teacher Education"],
        methodologyProfile: [{ methodology: "Mixed Methods", prevalence: 35 }, { methodology: "Qualitative", prevalence: 30 }, { methodology: "Experimental", prevalence: 25 }],
        newcomerFriendliness: { acceptanceRate: "20-25%", timeToDecision: "3-4개월" },
        keyContributors: [{ name: "Neil Selwyn", affiliation: "Monash University" }, { name: "Charles Crook", affiliation: "University of Nottingham" }]
    },
    "li": {
        overview: { description: "학습과 교수법에 대한 실증 연구를 다루는 유럽 기반 저널입니다.", website: "https://www.sciencedirect.com/journal/learning-and-instruction" },
        topics: ["Instructional Psychology", "Learning Processes", "Educational Interventions"],
        methodologyProfile: [{ methodology: "Experimental", prevalence: 50 }, { methodology: "Quasi-experimental", prevalence: 25 }, { methodology: "Meta-analysis", prevalence: 15 }],
        newcomerFriendliness: { acceptanceRate: "15-20%", timeToDecision: "3-4개월" },
        keyContributors: [{ name: "Jeroen van Merriënboer", affiliation: "Maastricht University" }, { name: "Paul Kirschner", affiliation: "Open University Netherlands" }]
    },
    "ijcscl": {
        overview: { description: "컴퓨터 지원 협력 학습(CSCL) 분야의 핵심 저널입니다.", website: "https://www.springer.com/journal/11412" },
        topics: ["Collaborative Learning", "CSCL", "Group Cognition", "Knowledge Building"],
        methodologyProfile: [{ methodology: "Design-based Research", prevalence: 35 }, { methodology: "Discourse Analysis", prevalence: 30 }, { methodology: "Mixed Methods", prevalence: 25 }],
        newcomerFriendliness: { acceptanceRate: "15-20%", timeToDecision: "4-5개월" },
        keyContributors: [{ name: "Gerry Stahl", affiliation: "Drexel University" }, { name: "Sanna Järvelä", affiliation: "University of Oulu" }]
    },
    "rer": {
        overview: { description: "교육 연구의 종합적 리뷰와 메타분석을 게재하는 최상위 저널입니다.", website: "https://journals.sagepub.com/home/rer" },
        topics: ["Literature Review", "Meta-analysis", "Educational Policy", "Research Synthesis"],
        methodologyProfile: [{ methodology: "Systematic Review", prevalence: 45 }, { methodology: "Meta-analysis", prevalence: 40 }, { methodology: "Theoretical", prevalence: 15 }],
        newcomerFriendliness: { acceptanceRate: "5-10%", timeToDecision: "4-6개월" },
        keyContributors: [{ name: "Robert Slavin", affiliation: "Johns Hopkins" }, { name: "John Hattie", affiliation: "University of Melbourne" }]
    },
    "jep": {
        overview: { description: "교육심리학 분야의 최상위 저널로, 실험 연구를 중시합니다.", website: "https://www.apa.org/pubs/journals/edu" },
        topics: ["Educational Psychology", "Learning", "Motivation", "Assessment"],
        methodologyProfile: [{ methodology: "Experimental", prevalence: 55 }, { methodology: "Correlational", prevalence: 25 }, { methodology: "Longitudinal", prevalence: 15 }],
        newcomerFriendliness: { acceptanceRate: "10-15%", timeToDecision: "3-4개월" },
        keyContributors: [{ name: "Patricia Alexander", affiliation: "University of Maryland" }, { name: "Dale Schunk", affiliation: "UNC Greensboro" }]
    },
    "ijaied": {
        overview: { description: "AI를 활용한 교육 기술 연구를 다루는 핵심 저널입니다.", website: "https://www.springer.com/journal/40593" },
        topics: ["Intelligent Tutoring Systems", "Adaptive Learning", "NLP in Education", "Student Modeling"],
        methodologyProfile: [{ methodology: "System Development", prevalence: 40 }, { methodology: "Experimental", prevalence: 35 }, { methodology: "Machine Learning", prevalence: 20 }],
        newcomerFriendliness: { acceptanceRate: "20-25%", timeToDecision: "3-4개월" },
        keyContributors: [{ name: "Ryan Baker", affiliation: "University of Pennsylvania" }, { name: "Beverly Woolf", affiliation: "UMass Amherst" }]
    },
    "jla": {
        overview: { description: "학습분석학 분야의 오픈 액세스 저널입니다.", website: "https://www.learning-analytics.info" },
        topics: ["Learning Analytics", "Educational Data Mining", "Dashboards", "Predictive Models"],
        methodologyProfile: [{ methodology: "Data Mining", prevalence: 40 }, { methodology: "Mixed Methods", prevalence: 30 }, { methodology: "Design-based Research", prevalence: 20 }],
        newcomerFriendliness: { acceptanceRate: "25-30%", timeToDecision: "2-3개월" },
        keyContributors: [{ name: "George Siemens", affiliation: "University of Texas Arlington" }, { name: "Shane Dawson", affiliation: "University of South Australia" }]
    },
    "isls": {
        overview: { description: "ISLS(국제학습과학학회)의 연례 학술대회로, ICLS와 CSCL을 포함합니다.", website: "https://www.isls.org" },
        topics: ["Learning Sciences", "CSCL", "Design-based Research", "Educational Technology"],
        methodologyProfile: [{ methodology: "Design-based Research", prevalence: 40 }, { methodology: "Qualitative", prevalence: 35 }, { methodology: "Mixed Methods", prevalence: 20 }],
        newcomerFriendliness: { acceptanceRate: "40-50% (Full Paper)", timeToDecision: "2개월" },
        keyContributors: [{ name: "Yasmin Kafai", affiliation: "University of Pennsylvania" }, { name: "Chris Quintana", affiliation: "University of Michigan" }]
    },
    "aera": {
        overview: { description: "미국교육학회(AERA)의 대규모 연례 학술대회입니다.", website: "https://www.aera.net" },
        topics: ["Educational Research", "Policy", "Teacher Education", "Equity"],
        methodologyProfile: [{ methodology: "Qualitative", prevalence: 40 }, { methodology: "Quantitative", prevalence: 35 }, { methodology: "Mixed Methods", prevalence: 25 }],
        newcomerFriendliness: { acceptanceRate: "50-60%", timeToDecision: "2-3개월" },
        keyContributors: [{ name: "Gloria Ladson-Billings", affiliation: "University of Wisconsin" }]
    },
    "lak": {
        overview: { description: "학습분석학 분야의 핵심 국제학술대회입니다.", website: "https://www.solaresearch.org/events/lak/" },
        topics: ["Learning Analytics", "Data Mining", "Dashboards", "At-risk Prediction"],
        methodologyProfile: [{ methodology: "Data Mining", prevalence: 45 }, { methodology: "System Development", prevalence: 30 }, { methodology: "Mixed Methods", prevalence: 20 }],
        newcomerFriendliness: { acceptanceRate: "25-30% (Full Paper)", timeToDecision: "2개월" },
        keyContributors: [{ name: "Dragan Gasevic", affiliation: "Monash University" }, { name: "Alyssa Wise", affiliation: "NYU" }]
    },
    "chi": {
        overview: { description: "인간-컴퓨터 상호작용(HCI) 분야의 최고 학술대회입니다.", website: "https://chi.acm.org" },
        topics: ["HCI", "UX Design", "Interaction Design", "Accessibility"],
        methodologyProfile: [{ methodology: "User Study", prevalence: 45 }, { methodology: "System Development", prevalence: 30 }, { methodology: "Survey", prevalence: 15 }],
        newcomerFriendliness: { acceptanceRate: "20-25%", timeToDecision: "3개월" },
        keyContributors: [{ name: "Amy Bruckman", affiliation: "Georgia Tech" }, { name: "Cliff Lampe", affiliation: "University of Michigan" }]
    },
    "aied": {
        overview: { description: "AI in Education 분야의 핵심 국제학술대회입니다.", website: "https://aied2024.science" },
        topics: ["ITS", "Adaptive Learning", "Student Modeling", "Educational Data Mining"],
        methodologyProfile: [{ methodology: "System Development", prevalence: 40 }, { methodology: "Experimental", prevalence: 35 }, { methodology: "Machine Learning", prevalence: 20 }],
        newcomerFriendliness: { acceptanceRate: "25-30%", timeToDecision: "2-3개월" },
        keyContributors: [{ name: "Kurt VanLehn", affiliation: "Arizona State University" }, { name: "Cristina Conati", affiliation: "UBC" }]
    }
};

export function getVenueDetailsById(id: string): VenueDetails {
    const details = venueDetailsMap[id];
    if (details) return details;

    // Default fallback
    return {
        overview: { description: "상세 정보가 아직 준비되지 않았습니다.", website: "#" },
        topics: ["정보 없음"],
        methodologyProfile: [{ methodology: "다양함", prevalence: 100 }],
        newcomerFriendliness: { acceptanceRate: "정보 없음", timeToDecision: "정보 없음" },
        keyContributors: []
    };
}

export function getVenueDetailsByName(name: string): VenueDetails {
    const venue = venueByName.get(name);
    if (venue) return getVenueDetailsById(venue.id);
    return getVenueDetailsById('');
}
