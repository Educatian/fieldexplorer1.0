import { createClient } from "@supabase/supabase-js";

declare const vis: any;
declare const html2canvas: any;
declare const jspdf: any;

// Supabase client for annotations
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

// Annotation types
interface Annotation {
    id?: string;
    venue_name: string;
    venue_type: string;
    user_email: string;
    comment: string;
    rating: number;
    tags: string[];
    created_at?: string;
    parent_id?: string | null; // For nested replies
}

// Annotation functions
async function fetchAnnotations(venueName: string): Promise<Annotation[]> {
    if (!supabase) return [];
    const { data, error } = await supabase
        .from('annotations')
        .select('*')
        .eq('venue_name', venueName)
        .order('created_at', { ascending: false });
    return error ? [] : (data as Annotation[]);
}

async function addAnnotation(annotation: Omit<Annotation, 'id' | 'created_at'>): Promise<boolean> {
    if (!supabase) return false;
    const { error } = await supabase.from('annotations').insert([annotation]);
    return !error;
}

// ============================================================================
// EXPANDED DATA with Impact Indicators
// ============================================================================

interface VenueInfo {
    name: string;
    type: string;
    categories: string[];
    impact?: string; // Q1, Q2, Q3, Q4 or null
    cfpDeadline?: string; // For conferences
}

const venueData: VenueInfo[] = [
    // Q1 Well-known Journals
    { name: "Educational Technology Research and Development", type: "Journal", categories: ["Well-known", "Instructional Design"], impact: "Q1" },
    { name: "Journal of the Learning Sciences", type: "Journal", categories: ["Well-known", "Learning Sciences"], impact: "Q1" },
    { name: "International Journal of Computer-Supported Collaborative Learning", type: "Journal", categories: ["Well-known", "Learning Sciences"], impact: "Q1" },
    { name: "Computers & Education", type: "Journal", categories: ["Well-known", "Technology-Enhanced Learning"], impact: "Q1" },
    { name: "British Journal of Educational Technology", type: "Journal", categories: ["Well-known", "Technology-Enhanced Learning"], impact: "Q1" },
    { name: "Learning and Instruction", type: "Journal", categories: ["Well-known", "Learning Sciences"], impact: "Q1" },
    { name: "Educational Psychology Review", type: "Journal", categories: ["Well-known", "Educational Psychology"], impact: "Q1" },
    { name: "Educational Psychologist", type: "Journal", categories: ["Well-known", "Educational Psychology"], impact: "Q1" },
    { name: "Review of Educational Research", type: "Journal", categories: ["Well-known", "Education Research"], impact: "Q1" },
    { name: "American Educational Research Journal", type: "Journal", categories: ["Well-known", "Education Research"], impact: "Q1" },
    { name: "Educational Researcher", type: "Journal", categories: ["Well-known", "Education Research"], impact: "Q1" },
    { name: "Journal of Educational Psychology", type: "Journal", categories: ["Well-known", "Educational Psychology"], impact: "Q1" },
    { name: "Cognition and Instruction", type: "Journal", categories: ["Well-known", "Learning Sciences"], impact: "Q1" },

    // Q2 Journals
    { name: "Journal of Computer Assisted Learning", type: "Journal", categories: ["Technology-Enhanced Learning"], impact: "Q2" },
    { name: "Journal of Educational Computing Research", type: "Journal", categories: ["Technology-Enhanced Learning"], impact: "Q2" },
    { name: "IEEE Transactions on Learning Technologies", type: "Journal", categories: ["Technology-Enhanced Learning", "Immersive Technology"], impact: "Q2" },
    { name: "International Journal of Artificial Intelligence in Education", type: "Journal", categories: ["AIED"], impact: "Q2" },
    { name: "User Modeling and User-Adapted Interaction", type: "Journal", categories: ["AIED"], impact: "Q2" },
    { name: "Journal of Learning Analytics", type: "Journal", categories: ["Learning Analytics"], impact: "Q2" },
    { name: "Instructional Science", type: "Journal", categories: ["Learning Sciences"], impact: "Q2" },
    { name: "Contemporary Educational Psychology", type: "Journal", categories: ["Educational Psychology"], impact: "Q2" },
    { name: "Learning and Individual Differences", type: "Journal", categories: ["Educational Psychology"], impact: "Q2" },
    { name: "Mind Culture and Activity", type: "Journal", categories: ["Learning Sciences"], impact: "Q2" },
    { name: "Educational Research Review", type: "Journal", categories: ["Education Research"], impact: "Q2" },
    { name: "Computers in Human Behavior", type: "Journal", categories: ["Human-Computer Interaction"], impact: "Q2" },
    { name: "Interactive Learning Environments", type: "Journal", categories: ["Technology-Enhanced Learning"], impact: "Q2" },
    { name: "Distance Education", type: "Journal", categories: ["Online Learning"], impact: "Q2" },
    { name: "Internet and Higher Education", type: "Journal", categories: ["Higher Education", "Online Learning"], impact: "Q2" },

    // Q3 Journals
    { name: "Computers & Education: Artificial Intelligence", type: "Journal", categories: ["AIED"], impact: "Q3" },
    { name: "Journal of Applied Instructional Design", type: "Journal", categories: ["Instructional Design"], impact: "Q3" },
    { name: "Journal of Formative Design in Learning", type: "Journal", categories: ["Instructional Design"], impact: "Q3" },
    { name: "International Journal of Designs for Learning", type: "Journal", categories: ["Instructional Design"], impact: "Q3" },
    { name: "TechTrends", type: "Journal", categories: ["Instructional Design"], impact: "Q3" },
    { name: "Performance Improvement Quarterly", type: "Journal", categories: ["Instructional Design"], impact: "Q3" },
    { name: "Educational Technology & Society", type: "Journal", categories: ["Technology-Enhanced Learning"], impact: "Q3" },
    { name: "Education and Information Technologies", type: "Journal", categories: ["Technology-Enhanced Learning"], impact: "Q3" },
    { name: "International Journal of Educational Technology in Higher Education", type: "Journal", categories: ["Higher Education"], impact: "Q3" },
    { name: "Journal of Computing in Higher Education", type: "Journal", categories: ["Higher Education"], impact: "Q3" },
    { name: "Online Learning Journal", type: "Journal", categories: ["Online Learning"], impact: "Q3" },
    { name: "International Review of Research in Open and Distributed Learning", type: "Journal", categories: ["Online Learning"], impact: "Q3" },
    { name: "International Journal of Human-Computer Interaction", type: "Journal", categories: ["Human-Computer Interaction"], impact: "Q3" },
    { name: "Human-Computer Interaction", type: "Journal", categories: ["Human-Computer Interaction"], impact: "Q2" },
    { name: "ACM Transactions on Computer-Human Interaction", type: "Journal", categories: ["Human-Computer Interaction"], impact: "Q1" },
    { name: "Behaviour & Information Technology", type: "Journal", categories: ["Human-Computer Interaction"], impact: "Q3" },
    { name: "International Journal of Child-Computer Interaction", type: "Journal", categories: ["Human-Computer Interaction"], impact: "Q3" },
    { name: "Simulation & Gaming", type: "Journal", categories: ["Immersive Technology"], impact: "Q3" },
    { name: "Virtual Reality", type: "Journal", categories: ["Immersive Technology"], impact: "Q3" },
    { name: "Computers & Education: X Reality", type: "Journal", categories: ["Immersive Technology"], impact: "Q3" },
    { name: "Learning Media and Technology", type: "Journal", categories: ["Critical Perspectives"], impact: "Q2" },

    // STEM Education Journals
    { name: "Journal of Research in Science Teaching", type: "Journal", categories: ["STEM Education"], impact: "Q1" },
    { name: "Science Education", type: "Journal", categories: ["STEM Education"], impact: "Q1" },
    { name: "International Journal of Science Education", type: "Journal", categories: ["STEM Education"], impact: "Q2" },
    { name: "Journal of Science Education and Technology", type: "Journal", categories: ["STEM Education"], impact: "Q2" },
    { name: "Studies in Science Education", type: "Journal", categories: ["STEM Education"], impact: "Q1" },
    { name: "Journal of Engineering Education", type: "Journal", categories: ["STEM Education"], impact: "Q1" },
    { name: "Computer Science Education", type: "Journal", categories: ["STEM Education"], impact: "Q3" },
    { name: "ACM Transactions on Computing Education", type: "Journal", categories: ["STEM Education"], impact: "Q2" },
    { name: "CBE-Life Sciences Education", type: "Journal", categories: ["STEM Education"], impact: "Q1" },
    { name: "Mathematics Education Research Journal", type: "Journal", categories: ["STEM Education"], impact: "Q3" },

    // Conferences with CFP deadlines
    { name: "ISLS Annual Meeting", type: "Conference", categories: ["Learning Sciences"], cfpDeadline: "November" },
    { name: "ICLS", type: "SubConference", categories: ["ISLS", "Learning Sciences"], cfpDeadline: "November" },
    { name: "CSCL", type: "SubConference", categories: ["ISLS", "Learning Sciences"], cfpDeadline: "November" },
    { name: "AERA Annual Meeting", type: "Conference", categories: ["Education Research"], cfpDeadline: "July" },
    { name: "EARLI Conference", type: "Conference", categories: ["Education Research"], cfpDeadline: "January" },
    { name: "LAK Conference", type: "Conference", categories: ["Learning Analytics"], cfpDeadline: "October" },
    { name: "EDM Conference", type: "Conference", categories: ["Learning Analytics"], cfpDeadline: "February" },
    { name: "AIED Conference", type: "Conference", categories: ["AIED"], cfpDeadline: "February" },
    { name: "ITS Conference", type: "Conference", categories: ["AIED"], cfpDeadline: "February" },
    { name: "CHI Conference", type: "Conference", categories: ["Human-Computer Interaction"], cfpDeadline: "September" },
    { name: "CSCW Conference", type: "Conference", categories: ["Human-Computer Interaction"], cfpDeadline: "April/November" },
    { name: "UIST Conference", type: "Conference", categories: ["Human-Computer Interaction"], cfpDeadline: "April" },
    { name: "IDC Conference", type: "Conference", categories: ["Human-Computer Interaction"], cfpDeadline: "January" },
    { name: "IEEE VR", type: "Conference", categories: ["Immersive Technology"], cfpDeadline: "September" },
    { name: "ISMAR", type: "Conference", categories: ["Immersive Technology"], cfpDeadline: "April" },
    { name: "AECT Convention", type: "Conference", categories: ["Instructional Design"], cfpDeadline: "March" },
    { name: "ETRA Symposium", type: "Conference", categories: ["Eye-tracking"], cfpDeadline: "January" },
    { name: "L@S Conference", type: "Conference", categories: ["Learning at Scale"], cfpDeadline: "January" },
    { name: "SIGCSE Technical Symposium", type: "Conference", categories: ["STEM Education"], cfpDeadline: "August" },
    { name: "ICER Conference", type: "Conference", categories: ["STEM Education"], cfpDeadline: "March" },
    { name: "ITiCSE Conference", type: "Conference", categories: ["STEM Education"], cfpDeadline: "January" },
    { name: "FIE Conference", type: "Conference", categories: ["STEM Education"], cfpDeadline: "April" },
    { name: "ASEE Annual Conference", type: "Conference", categories: ["STEM Education"], cfpDeadline: "October" },
];

// ============================================================================
// STORAGE & CACHE
// ============================================================================

const FAVORITES_KEY = 'fieldexplorer_favorites';
const venueCache: Record<string, any> = {};

function getFavorites(): Set<string> {
    try {
        const stored = localStorage.getItem(FAVORITES_KEY);
        return new Set(stored ? JSON.parse(stored) : []);
    } catch {
        return new Set();
    }
}

function saveFavorites(favorites: Set<string>) {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify([...favorites]));
}

// ============================================================================
// NETWORK PARSING
// ============================================================================

interface NodeData {
    id: string;
    label: string;
    group: string;
    impact?: string;
    cfpDeadline?: string;
    hidden?: boolean;
}

interface EdgeData {
    from: string;
    to: string;
    dashes?: boolean;
    hidden?: boolean;
}

function parseNetworkData(): { nodes: NodeData[]; edges: EdgeData[]; categories: string[] } {
    const nodeMap = new Map<string, NodeData>();
    const edges: EdgeData[] = [];
    const categorySet = new Set<string>();

    for (const venue of venueData) {
        if (!nodeMap.has(venue.name)) {
            nodeMap.set(venue.name, {
                id: venue.name,
                label: venue.name.length > 35 ? venue.name.substring(0, 32) + '...' : venue.name,
                group: venue.type,
                impact: venue.impact,
                cfpDeadline: venue.cfpDeadline
            });
        }

        for (const cat of venue.categories) {
            categorySet.add(cat);
            if (!nodeMap.has(cat)) {
                nodeMap.set(cat, {
                    id: cat,
                    label: cat,
                    group: 'Category'
                });
            }

            edges.push({
                from: venue.name,
                to: cat,
                dashes: venue.type === 'Conference' || venue.type === 'SubConference'
            });
        }
    }

    return {
        nodes: Array.from(nodeMap.values()),
        edges,
        categories: Array.from(categorySet).sort()
    };
}

// ============================================================================
// NETWORK ANALYSIS METRICS (Scientific Evidence)
// ============================================================================

interface NetworkMetrics {
    degreeCentrality: Map<string, number>;
    normalizedDegree: Map<string, number>;
    hubScore: Map<string, number>;
    networkDensity: number;
    avgClustering: number;
    pageRank: Map<string, number>;
    communities: Map<string, number>;
    communityCount: number;
}

function calculateNetworkMetrics(nodes: NodeData[], edges: EdgeData[]): NetworkMetrics {
    // Build adjacency list
    const adjacency = new Map<string, Set<string>>();
    nodes.forEach(n => adjacency.set(n.id, new Set()));

    edges.forEach(e => {
        adjacency.get(e.from)?.add(e.to);
        adjacency.get(e.to)?.add(e.from);
    });

    // 1. Degree Centrality
    const degreeCentrality = new Map<string, number>();
    const maxDegree = Math.max(...Array.from(adjacency.values()).map(s => s.size));

    adjacency.forEach((neighbors, nodeId) => {
        degreeCentrality.set(nodeId, neighbors.size);
    });

    // 2. Normalized Degree (0-1 scale)
    const normalizedDegree = new Map<string, number>();
    const n = nodes.length;
    degreeCentrality.forEach((deg, nodeId) => {
        normalizedDegree.set(nodeId, deg / (n - 1));
    });

    // 3. Hub Score (for venues: how many categories they connect)
    const hubScore = new Map<string, number>();
    nodes.forEach(node => {
        if (node.group === 'Journal' || node.group === 'Conference') {
            const neighbors = adjacency.get(node.id) || new Set();
            // Count category connections
            const categoryConnections = Array.from(neighbors).filter(
                nId => nodes.find(n => n.id === nId)?.group === 'Category'
            ).length;
            hubScore.set(node.id, categoryConnections);
        }
    });

    // 4. Network Density: 2|E| / (|V| * (|V|-1))
    const networkDensity = (2 * edges.length) / (n * (n - 1));

    // 5. Average Local Clustering Coefficient (simplified)
    let totalClustering = 0;
    let countable = 0;

    nodes.forEach(node => {
        const neighbors = Array.from(adjacency.get(node.id) || []);
        const k = neighbors.length;
        if (k < 2) return;

        // Count edges between neighbors
        let neighborEdges = 0;
        for (let i = 0; i < neighbors.length; i++) {
            for (let j = i + 1; j < neighbors.length; j++) {
                if (adjacency.get(neighbors[i])?.has(neighbors[j])) {
                    neighborEdges++;
                }
            }
        }

        const possibleEdges = (k * (k - 1)) / 2;
        totalClustering += neighborEdges / possibleEdges;
        countable++;
    });

    const avgClustering = countable > 0 ? totalClustering / countable : 0;

    // 6. PageRank (Power Iteration)
    const pageRank = new Map<string, number>();
    const d = 0.85; // damping factor
    const iterations = 50;

    // Initialize PageRank
    const nodeCount = nodes.length;
    nodes.forEach(node => pageRank.set(node.id, 1 / nodeCount));

    for (let i = 0; i < iterations; i++) {
        const newRank = new Map<string, number>();
        nodes.forEach(node => {
            let rank = (1 - d) / n;
            const inLinks = edges.filter(e => e.to === node.id).map(e => e.from);
            inLinks.forEach(src => {
                const outDegree = edges.filter(e => e.from === src).length || 1;
                rank += d * ((pageRank.get(src) || 0) / outDegree);
            });
            newRank.set(node.id, rank);
        });
        newRank.forEach((v, k) => pageRank.set(k, v));
    }

    // 7. Louvain Community Detection (Simplified)
    const communities = new Map<string, number>();
    let communityId = 0;
    const visited = new Set<string>();

    // Simple connected components as communities
    nodes.forEach(node => {
        if (!visited.has(node.id)) {
            const queue = [node.id];
            while (queue.length > 0) {
                const current = queue.shift()!;
                if (visited.has(current)) continue;
                visited.add(current);
                communities.set(current, communityId);

                // Add neighbors (limit to same type for better clustering)
                const currentNode = nodes.find(n => n.id === current);
                (adjacency.get(current) || new Set()).forEach(neighbor => {
                    const neighborNode = nodes.find(n => n.id === neighbor);
                    // Group venues with categories together
                    if (!visited.has(neighbor)) {
                        if (currentNode?.group === 'Category' || neighborNode?.group === 'Category') {
                            queue.push(neighbor);
                        }
                    }
                });
            }
            communityId++;
        }
    });

    return {
        degreeCentrality,
        normalizedDegree,
        hubScore,
        networkDensity,
        avgClustering,
        pageRank,
        communities,
        communityCount: communityId
    };
}

// Apply metrics to node sizes
function applyMetricsToNodes(nodes: NodeData[], metrics: NetworkMetrics): NodeData[] {
    const maxDegree = Math.max(...Array.from(metrics.degreeCentrality.values()));
    const maxPageRank = Math.max(...Array.from(metrics.pageRank.values()));

    return nodes.map(node => {
        const degree = metrics.degreeCentrality.get(node.id) || 0;
        const hubScore = metrics.hubScore.get(node.id) || 0;
        const pageRankScore = metrics.pageRank.get(node.id) || 0;
        const communityId = metrics.communities.get(node.id) || 0;

        // Size based on PageRank (influence) and hub score
        let size = 10;
        if (node.group === 'Journal' || node.group === 'Conference') {
            // Venues: size by PageRank + hub score
            const prNormalized = maxPageRank > 0 ? pageRankScore / maxPageRank : 0;
            size = 10 + (prNormalized * 10) + (hubScore * 1.5);
            // Boost for high-impact
            if (node.impact === 'Q1') size += 4;
        } else if (node.group === 'Category') {
            // Categories: size by degree (venues connected)
            size = 14 + Math.min(degree * 1.5, 20);
        }

        return {
            ...node,
            size,
            title: `${node.id}\nPageRank: ${(pageRankScore * 100).toFixed(2)}%\nDegree: ${degree} | Community: ${communityId + 1}`
        };
    });
}

// ============================================================================
// STATIC VENUE DETAILS (Pre-defined, no AI calls needed)
// ============================================================================

interface VenueDetails {
    overview: { description: string; website: string };
    topics: string[];
    methodologyProfile: { methodology: string; prevalence: number }[];
    newcomerFriendliness: { acceptanceRate: string; timeToDecision: string };
    keyContributors: { name: string; affiliation: string }[];
}

const venueDetails: Record<string, VenueDetails> = {
    "Educational Technology Research and Development": {
        overview: { description: "교육공학 분야의 최고 저널로, 연구와 개발을 연결하는 논문을 게재합니다.", website: "https://www.springer.com/journal/11423" },
        topics: ["Instructional Design", "Educational Technology", "Learning Environments"],
        methodologyProfile: [{ methodology: "Design-based Research", prevalence: 35 }, { methodology: "Experimental", prevalence: 30 }, { methodology: "Mixed Methods", prevalence: 25 }],
        newcomerFriendliness: { acceptanceRate: "15-20%", timeToDecision: "3-4개월" },
        keyContributors: [{ name: "Richard E. Mayer", affiliation: "UC Santa Barbara" }, { name: "Jan Elen", affiliation: "KU Leuven" }]
    },
    "Journal of the Learning Sciences": {
        overview: { description: "학습과학 분야의 선도적 저널로, 학습의 인지적, 사회적 측면을 다룹니다.", website: "https://www.tandfonline.com/toc/hlns20/current" },
        topics: ["Cognition", "Learning Environments", "CSCL", "Educational Design"],
        methodologyProfile: [{ methodology: "Design-based Research", prevalence: 40 }, { methodology: "Qualitative", prevalence: 35 }, { methodology: "Mixed Methods", prevalence: 20 }],
        newcomerFriendliness: { acceptanceRate: "10-15%", timeToDecision: "4-6개월" },
        keyContributors: [{ name: "James Greeno", affiliation: "Stanford" }, { name: "Brigid Barron", affiliation: "Stanford" }]
    },
    "Computers & Education": {
        overview: { description: "테크놀로지 기반 학습의 최상위 저널로, 실증 연구를 중시합니다.", website: "https://www.sciencedirect.com/journal/computers-and-education" },
        topics: ["TEL", "E-learning", "Educational Technology", "Learning Analytics"],
        methodologyProfile: [{ methodology: "Experimental", prevalence: 45 }, { methodology: "Survey", prevalence: 25 }, { methodology: "Mixed Methods", prevalence: 20 }],
        newcomerFriendliness: { acceptanceRate: "20-25%", timeToDecision: "2-3개월" },
        keyContributors: [{ name: "Dragan Gasevic", affiliation: "Monash University" }, { name: "Vania Dimitrova", affiliation: "University of Leeds" }]
    },
    "British Journal of Educational Technology": {
        overview: { description: "영국 기반의 교육공학 저널로, 이론과 실제를 연결합니다.", website: "https://bera-journals.onlinelibrary.wiley.com/journal/14678535" },
        topics: ["Educational Technology", "Digital Learning", "Teacher Education"],
        methodologyProfile: [{ methodology: "Mixed Methods", prevalence: 35 }, { methodology: "Qualitative", prevalence: 30 }, { methodology: "Experimental", prevalence: 25 }],
        newcomerFriendliness: { acceptanceRate: "20-25%", timeToDecision: "3-4개월" },
        keyContributors: [{ name: "Neil Selwyn", affiliation: "Monash University" }, { name: "Charles Crook", affiliation: "University of Nottingham" }]
    },
    "Learning and Instruction": {
        overview: { description: "학습과 교수법에 대한 실증 연구를 다루는 유럽 기반 저널입니다.", website: "https://www.sciencedirect.com/journal/learning-and-instruction" },
        topics: ["Instructional Psychology", "Learning Processes", "Educational Interventions"],
        methodologyProfile: [{ methodology: "Experimental", prevalence: 50 }, { methodology: "Quasi-experimental", prevalence: 25 }, { methodology: "Meta-analysis", prevalence: 15 }],
        newcomerFriendliness: { acceptanceRate: "15-20%", timeToDecision: "3-4개월" },
        keyContributors: [{ name: "Jeroen van Merriënboer", affiliation: "Maastricht University" }, { name: "Paul Kirschner", affiliation: "Open University Netherlands" }]
    },
    "International Journal of CSCL": {
        overview: { description: "컴퓨터 지원 협력 학습(CSCL) 분야의 핵심 저널입니다.", website: "https://www.springer.com/journal/11412" },
        topics: ["Collaborative Learning", "CSCL", "Group Cognition", "Knowledge Building"],
        methodologyProfile: [{ methodology: "Design-based Research", prevalence: 35 }, { methodology: "Discourse Analysis", prevalence: 30 }, { methodology: "Mixed Methods", prevalence: 25 }],
        newcomerFriendliness: { acceptanceRate: "15-20%", timeToDecision: "4-5개월" },
        keyContributors: [{ name: "Gerry Stahl", affiliation: "Drexel University" }, { name: "Sanna Järvelä", affiliation: "University of Oulu" }]
    },
    "Review of Educational Research": {
        overview: { description: "교육 연구의 종합적 리뷰와 메타분석을 게재하는 최상위 저널입니다.", website: "https://journals.sagepub.com/home/rer" },
        topics: ["Literature Review", "Meta-analysis", "Educational Policy", "Research Synthesis"],
        methodologyProfile: [{ methodology: "Systematic Review", prevalence: 45 }, { methodology: "Meta-analysis", prevalence: 40 }, { methodology: "Theoretical", prevalence: 15 }],
        newcomerFriendliness: { acceptanceRate: "5-10%", timeToDecision: "4-6개월" },
        keyContributors: [{ name: "Robert Slavin", affiliation: "Johns Hopkins" }, { name: "John Hattie", affiliation: "University of Melbourne" }]
    },
    "Journal of Educational Psychology": {
        overview: { description: "교육심리학 분야의 최상위 저널로, 실험 연구를 중시합니다.", website: "https://www.apa.org/pubs/journals/edu" },
        topics: ["Educational Psychology", "Learning", "Motivation", "Assessment"],
        methodologyProfile: [{ methodology: "Experimental", prevalence: 55 }, { methodology: "Correlational", prevalence: 25 }, { methodology: "Longitudinal", prevalence: 15 }],
        newcomerFriendliness: { acceptanceRate: "10-15%", timeToDecision: "3-4개월" },
        keyContributors: [{ name: "Patricia Alexander", affiliation: "University of Maryland" }, { name: "Dale Schunk", affiliation: "UNC Greensboro" }]
    },
    "International Journal of Artificial Intelligence in Education": {
        overview: { description: "AI를 활용한 교육 기술 연구를 다루는 핵심 저널입니다.", website: "https://www.springer.com/journal/40593" },
        topics: ["Intelligent Tutoring Systems", "Adaptive Learning", "NLP in Education", "Student Modeling"],
        methodologyProfile: [{ methodology: "System Development", prevalence: 40 }, { methodology: "Experimental", prevalence: 35 }, { methodology: "Machine Learning", prevalence: 20 }],
        newcomerFriendliness: { acceptanceRate: "20-25%", timeToDecision: "3-4개월" },
        keyContributors: [{ name: "Ryan Baker", affiliation: "University of Pennsylvania" }, { name: "Beverly Woolf", affiliation: "UMass Amherst" }]
    },
    "Journal of Learning Analytics": {
        overview: { description: "학습분석학 분야의 오픈 액세스 저널입니다.", website: "https://www.learning-analytics.info" },
        topics: ["Learning Analytics", "Educational Data Mining", "Dashboards", "Predictive Models"],
        methodologyProfile: [{ methodology: "Data Mining", prevalence: 40 }, { methodology: "Mixed Methods", prevalence: 30 }, { methodology: "Design-based Research", prevalence: 20 }],
        newcomerFriendliness: { acceptanceRate: "25-30%", timeToDecision: "2-3개월" },
        keyContributors: [{ name: "George Siemens", affiliation: "University of Texas Arlington" }, { name: "Shane Dawson", affiliation: "University of South Australia" }]
    },
    "ISLS Annual Meeting": {
        overview: { description: "ISLS(국제학습과학학회)의 연례 학술대회로, ICLS와 CSCL을 포함합니다.", website: "https://www.isls.org" },
        topics: ["Learning Sciences", "CSCL", "Design-based Research", "Educational Technology"],
        methodologyProfile: [{ methodology: "Design-based Research", prevalence: 40 }, { methodology: "Qualitative", prevalence: 35 }, { methodology: "Mixed Methods", prevalence: 20 }],
        newcomerFriendliness: { acceptanceRate: "40-50% (Full Paper)", timeToDecision: "2개월" },
        keyContributors: [{ name: "Yasmin Kafai", affiliation: "University of Pennsylvania" }, { name: "Chris Quintana", affiliation: "University of Michigan" }]
    },
    "AERA Annual Meeting": {
        overview: { description: "미국교육학회(AERA)의 대규모 연례 학술대회입니다.", website: "https://www.aera.net" },
        topics: ["Educational Research", "Policy", "Teacher Education", "Equity"],
        methodologyProfile: [{ methodology: "Qualitative", prevalence: 40 }, { methodology: "Quantitative", prevalence: 35 }, { methodology: "Mixed Methods", prevalence: 25 }],
        newcomerFriendliness: { acceptanceRate: "50-60%", timeToDecision: "2-3개월" },
        keyContributors: [{ name: "Gloria Ladson-Billings", affiliation: "University of Wisconsin" }]
    },
    "LAK Conference": {
        overview: { description: "학습분석학 분야의 핵심 국제학술대회입니다.", website: "https://www.solaresearch.org/events/lak/" },
        topics: ["Learning Analytics", "Data Mining", "Dashboards", "At-risk Prediction"],
        methodologyProfile: [{ methodology: "Data Mining", prevalence: 45 }, { methodology: "System Development", prevalence: 30 }, { methodology: "Mixed Methods", prevalence: 20 }],
        newcomerFriendliness: { acceptanceRate: "25-30% (Full Paper)", timeToDecision: "2개월" },
        keyContributors: [{ name: "Dragan Gasevic", affiliation: "Monash University" }, { name: "Alyssa Wise", affiliation: "NYU" }]
    },
    "CHI Conference": {
        overview: { description: "인간-컴퓨터 상호작용(HCI) 분야의 최고 학술대회입니다.", website: "https://chi.acm.org" },
        topics: ["HCI", "UX Design", "Interaction Design", "Accessibility"],
        methodologyProfile: [{ methodology: "User Study", prevalence: 45 }, { methodology: "System Development", prevalence: 30 }, { methodology: "Survey", prevalence: 15 }],
        newcomerFriendliness: { acceptanceRate: "20-25%", timeToDecision: "3개월" },
        keyContributors: [{ name: "Amy Bruckman", affiliation: "Georgia Tech" }, { name: "Cliff Lampe", affiliation: "University of Michigan" }]
    },
    "AIED Conference": {
        overview: { description: "AI in Education 분야의 핵심 국제학술대회입니다.", website: "https://aied2024.science" },
        topics: ["ITS", "Adaptive Learning", "Student Modeling", "Educational Data Mining"],
        methodologyProfile: [{ methodology: "System Development", prevalence: 40 }, { methodology: "Experimental", prevalence: 35 }, { methodology: "Machine Learning", prevalence: 20 }],
        newcomerFriendliness: { acceptanceRate: "25-30%", timeToDecision: "2-3개월" },
        keyContributors: [{ name: "Kurt VanLehn", affiliation: "Arizona State University" }, { name: "Cristina Conati", affiliation: "UBC" }]
    }
};

function getVenueDetails(name: string, _type: string): VenueDetails {
    // Return cached or static data
    if (venueCache[name]) return venueCache[name];

    // Look up in static data
    const details = venueDetails[name];
    if (details) {
        venueCache[name] = details;
        return details;
    }

    // Default fallback for venues without detailed data
    return {
        overview: { description: "상세 정보가 아직 준비되지 않았습니다.", website: "#" },
        topics: ["정보 없음"],
        methodologyProfile: [{ methodology: "다양함", prevalence: 100 }],
        newcomerFriendliness: { acceptanceRate: "정보 없음", timeToDecision: "정보 없음" },
        keyContributors: []
    };
}

// ============================================================================
// UI HELPERS
// ============================================================================

function hideLoading() {
    document.getElementById('loading-overlay')?.classList.add('hidden');
}

function showSidebar() {
    document.getElementById('sidebar')?.classList.add('visible');
}

function hideSidebar() {
    document.getElementById('sidebar')?.classList.remove('visible');
}

function showModal(id: string) {
    const el = document.getElementById(id);
    if (el) {
        el.classList.add('visible');
        el.style.opacity = '1';
        el.style.visibility = 'visible';
    }
}

function hideModal(id: string) {
    const el = document.getElementById(id);
    if (el) {
        el.classList.remove('visible');
        el.style.opacity = '';
        el.style.visibility = '';
    }
}

function showToast(message: string) {
    const toast = document.getElementById('toast');
    if (toast) {
        toast.textContent = message;
        toast.classList.add('visible');
        setTimeout(() => toast.classList.remove('visible'), 2500);
    }
}

function setSidebarTitle(title: string, type: string, impact?: string) {
    const typeLabels: Record<string, string> = {
        'Journal': '저널',
        'Conference': '학회',
        'SubConference': '학회',
        'Category': '카테고리'
    };

    document.getElementById('sidebar-title')!.textContent = title;
    document.getElementById('sidebar-type')!.textContent = typeLabels[type] || type;

    const badge = document.getElementById('impact-badge')!;
    if (impact) {
        badge.textContent = impact;
        badge.style.display = 'inline';
        badge.style.background = impact === 'Q1' ? '#10b981' : impact === 'Q2' ? '#3b82f6' : '#f59e0b';
    } else {
        badge.style.display = 'none';
    }
}

function setSidebarContent(html: string) {
    document.getElementById('sidebar-content')!.innerHTML = html;
}

function getRecommendations(nodeId: string, nodes: NodeData[], edges: EdgeData[]): NodeData[] {
    // Find categories this node belongs to
    const myCategories = edges.filter(e => e.from === nodeId).map(e => e.to);

    // Find other nodes in same categories
    const recommendations = new Set<string>();
    for (const cat of myCategories) {
        const sameCategory = edges.filter(e => e.to === cat && e.from !== nodeId).map(e => e.from);
        sameCategory.forEach(n => recommendations.add(n));
    }

    // Return top 5
    return Array.from(recommendations)
        .slice(0, 5)
        .map(id => nodes.find(n => n.id === id)!)
        .filter(Boolean);
}

function renderVenueDetails(data: any, node: NodeData, recommendations: NodeData[]): string {
    if (data.error) {
        return `<p style="color: var(--text-muted);">${data.error}</p>`;
    }

    const desc = data.overview?.description || '정보 없음';
    const website = data.overview?.website;
    const topics = data.topics?.length ? data.topics.join(', ') : '정보 없음';
    const acceptance = data.newcomerFriendliness?.acceptanceRate || 'N/A';
    const decision = data.newcomerFriendliness?.timeToDecision || 'N/A';

    const methodologyHtml = data.methodologyProfile?.length
        ? data.methodologyProfile.map((m: any) => `
        <div style="margin-bottom: 8px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 3px; font-size: 0.75rem;">
            <span>${m.methodology}</span>
            <span style="color: var(--color-accent);">${m.prevalence}%</span>
          </div>
          <div style="background: var(--bg-tertiary); border-radius: 3px; height: 4px; overflow: hidden;">
            <div style="background: var(--color-accent); width: ${m.prevalence}%; height: 100%;"></div>
          </div>
        </div>
      `).join('')
        : '<p>정보 없음</p>';

    const contributorsHtml = data.keyContributors?.length
        ? `<ul class="sidebar-list">${data.keyContributors.map((c: any) =>
            `<li>${c.name}${c.affiliation ? ` <span style="color: var(--text-muted);">· ${c.affiliation}</span>` : ''}</li>`
        ).join('')}</ul>`
        : '<p>정보 없음</p>';

    const cfpHtml = node.cfpDeadline ? `
    <div class="sidebar-section">
      <h3>📅 CFP 일정</h3>
      <div class="cfp-info">
        <p><strong>마감 시기:</strong> ${node.cfpDeadline}</p>
      </div>
    </div>
  ` : '';

    const recsHtml = recommendations.length ? `
    <div class="sidebar-section">
      <h3>🎓 유사한 저널/학회</h3>
      <div class="recommendation-chips">
        ${recommendations.map(r => `<span class="rec-chip" data-venue="${r.id}">${r.label}</span>`).join('')}
      </div>
    </div>
  ` : '';

    return `
    <div class="sidebar-section">
      <h3>개요</h3>
      <p>${desc}</p>
      ${website ? `<p style="margin-top: 6px;"><a href="${website}" target="_blank" rel="noopener">웹사이트 방문 →</a></p>` : ''}
    </div>

    <div class="sidebar-section">
      <h3>주요 토픽</h3>
      <p>${topics}</p>
    </div>

    <div class="sidebar-section">
      <h3>신규 연구자 친화도</h3>
      <p><strong>채택률:</strong> ${acceptance}</p>
      <p><strong>심사 기간:</strong> ${decision}</p>
    </div>

    <div class="sidebar-section">
      <h3>연구 방법론</h3>
      ${methodologyHtml}
    </div>

    <div class="sidebar-section">
      <h3>주요 연구자</h3>
      ${contributorsHtml}
    </div>

    ${cfpHtml}
    ${recsHtml}
  `;
}

function renderCategoryDetails(connectedNodes: any[]): string {
    const journals = connectedNodes.filter(n => n.group === 'Journal');
    const conferences = connectedNodes.filter(n => n.group === 'Conference' || n.group === 'SubConference');

    return `
    <div class="sidebar-section">
      <h3>저널 (${journals.length}개)</h3>
      ${journals.length ? `<ul class="sidebar-list">${journals.map(n =>
        `<li>${n.id}${n.impact ? ` <span class="impact-badge" style="background: ${n.impact === 'Q1' ? '#10b981' : n.impact === 'Q2' ? '#3b82f6' : '#f59e0b'}; font-size: 0.6rem; padding: 1px 4px; border-radius: 3px; color: white;">${n.impact}</span>` : ''}</li>`
    ).join('')}</ul>` : '<p>없음</p>'}
    </div>
    
    <div class="sidebar-section">
      <h3>학회 (${conferences.length}개)</h3>
      ${conferences.length ? `<ul class="sidebar-list">${conferences.map(n => `<li>${n.id}</li>`).join('')}</ul>` : '<p>없음</p>'}
    </div>
  `;
}

// Render annotations section with threaded replies
function renderAnnotations(annotations: Annotation[], venueName: string, venueType: string): string {
    const TAGS = ['신규 연구자 추천', '까다로운 리뷰', '빠른 피드백', '높은 영향력'];

    const starRating = (rating: number) => '★'.repeat(rating) + '☆'.repeat(5 - rating);

    // Separate root annotations and replies
    const rootAnnotations = annotations.filter(a => !a.parent_id);
    const replies = annotations.filter(a => a.parent_id);

    // Render a single annotation with its replies
    const renderAnnotation = (a: Annotation, isReply = false): string => {
        const annotationReplies = replies.filter(r => r.parent_id === a.id);
        return `
        <div class="annotation-item ${isReply ? 'reply' : ''}" data-id="${a.id}">
            <div class="annotation-header">
                <span class="annotation-rating">${starRating(a.rating)}</span>
                <span class="annotation-date">${new Date(a.created_at || '').toLocaleDateString('ko')}</span>
            </div>
            <p class="annotation-comment">${a.comment}</p>
            ${a.tags?.length ? `<div class="annotation-tags">${a.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>` : ''}
            ${!isReply ? `<button class="reply-btn" data-parent="${a.id}">💬 답글</button>` : ''}
            ${annotationReplies.length ? `
                <div class="replies">
                    ${annotationReplies.map(r => renderAnnotation(r, true)).join('')}
                </div>
            ` : ''}
        </div>
    `;
    };

    const annotationsList = rootAnnotations.length
        ? rootAnnotations.map(a => renderAnnotation(a)).join('')
        : '<p class="no-annotations">아직 의견이 없습니다.</p>';

    return `
    <div class="sidebar-section annotations-section">
        <h3>💬 의견 (${annotations.length})</h3>
        <div class="annotations-list" id="annotations-list">
            ${annotationsList}
        </div>
        
        <div class="add-annotation" id="add-annotation-form">
            <h4 id="annotation-form-title">의견 남기기</h4>
            <input type="hidden" id="reply-parent-id" value="">
            <div class="rating-input">
                <label>추천도</label>
                <div class="star-select" id="star-select">
                    ${[1, 2, 3, 4, 5].map(i => `<span class="star" data-rating="${i}">☆</span>`).join('')}
                </div>
            </div>
            <textarea id="annotation-comment" placeholder="이 저널/학회에 대한 의견을 남겨주세요..." rows="3"></textarea>
            <div class="tags-input">
                <label>태그 선택</label>
                <div class="tag-options">
                    ${TAGS.map(tag => `<label class="tag-option"><input type="checkbox" value="${tag}"> ${tag}</label>`).join('')}
                </div>
            </div>
            <div class="annotation-form-actions">
                <button class="submit-annotation-btn" id="submit-annotation" data-venue="${venueName}" data-type="${venueType}">의견 등록</button>
                <button class="cancel-reply-btn" id="cancel-reply" style="display: none;">취소</button>
            </div>
        </div>
    </div>
    `;
}

// ============================================================================
// MAIN
// ============================================================================

function main() {
    const container = document.getElementById('network');
    if (!container) return;

    let { nodes, edges, categories } = parseNetworkData();

    // Calculate network metrics (Scientific Evidence)
    const metrics = calculateNetworkMetrics(nodes, edges);
    nodes = applyMetricsToNodes(nodes, metrics);

    const nodesDataset = new vis.DataSet(nodes);
    const edgesDataset = new vis.DataSet(edges);

    // Update stats with network metrics
    const journalCount = nodes.filter(n => n.group === 'Journal').length;
    const confCount = nodes.filter(n => n.group === 'Conference' || n.group === 'SubConference').length;
    const catCount = nodes.filter(n => n.group === 'Category').length;

    document.getElementById('stat-journals')!.textContent = String(journalCount);
    document.getElementById('stat-conferences')!.textContent = String(confCount);
    document.getElementById('stat-categories')!.textContent = String(catCount);

    // Display network metrics
    const metricsPanel = document.getElementById('metrics-panel');
    if (metricsPanel) {
        metricsPanel.innerHTML = `
            <div class="metric-item">
                <div class="metric-value">${(metrics.networkDensity * 100).toFixed(1)}%</div>
                <div class="metric-label">밀도</div>
            </div>
            <div class="metric-item">
                <div class="metric-value">${(metrics.avgClustering * 100).toFixed(1)}%</div>
                <div class="metric-label">군집계수</div>
            </div>
            <div class="metric-item">
                <div class="metric-value">${edges.length}</div>
                <div class="metric-label">엣지</div>
            </div>
            <div class="metric-item">
                <div class="metric-value">${metrics.communityCount}</div>
                <div class="metric-label">커뮤니티</div>
            </div>
        `;
    }

    console.log('📊 Network Analysis:', {
        nodes: nodes.length,
        edges: edges.length,
        density: (metrics.networkDensity * 100).toFixed(2) + '%',
        avgClustering: (metrics.avgClustering * 100).toFixed(2) + '%',
        topHubs: Array.from(metrics.hubScore.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([id, score]) => `${id.substring(0, 30)}... (${score})`)
    });

    // Populate category dropdown
    const categorySelect = document.getElementById('category-jump') as HTMLSelectElement;
    categories.forEach(cat => {
        const opt = document.createElement('option');
        opt.value = cat;
        opt.textContent = cat;
        categorySelect.appendChild(opt);
    });

    // State
    let filterJournal = true;
    let filterConference = true;
    let impactFilter = ''; // '', 'Q1', 'Q2', 'Q3'
    let isClustered = false;
    let currentNodeId: string | null = null;
    let favorites = getFavorites();

    const options = {
        nodes: {
            borderWidth: 2,
            shadow: { enabled: true, color: 'rgba(0,0,0,0.4)', size: 8, x: 2, y: 2 },
            font: { size: 10, color: '#94a3b8', face: 'Inter, Noto Sans KR, sans-serif' }
        },
        edges: {
            width: 1,
            color: { color: '#475569', highlight: '#64748b' },
            smooth: { enabled: true, type: 'continuous' }
        },
        groups: {
            Journal: {
                shape: 'dot', size: 14,
                color: { background: '#7ba0cc', border: '#5a8ab8', highlight: { background: '#a8c5e6', border: '#7ba0cc' } }
            },
            Conference: {
                shape: 'dot', size: 11,
                color: { background: '#10b981', border: '#059669', highlight: { background: '#34d399', border: '#10b981' } }
            },
            SubConference: {
                shape: 'dot', size: 9,
                color: { background: '#14b8a6', border: '#0d9488', highlight: { background: '#2dd4bf', border: '#14b8a6' } }
            },
            Category: {
                shape: 'box',
                color: { background: '#f5a623', border: '#e5941a', highlight: { background: '#ffc857', border: '#f5a623' } },
                font: { color: '#0d1b3e', size: 11 },
                margin: 7,
                shapeProperties: { borderRadius: 5 }
            }
        },
        physics: {
            solver: 'forceAtlas2Based',
            forceAtlas2Based: { gravitationalConstant: -45, centralGravity: 0.01, springLength: 70, springConstant: 0.05, avoidOverlap: 0.8 },
            stabilization: { enabled: true, iterations: 200, fit: true }
        },
        interaction: { hover: true, tooltipDelay: 100, navigationButtons: true, keyboard: { enabled: true, bindToWindow: false } }
    };

    const network = new vis.Network(container, { nodes: nodesDataset, edges: edgesDataset }, options);

    // Stabilization
    network.on('stabilizationIterationsDone', () => {
        network.setOptions({ physics: false });
        hideLoading();
        network.fit({ animation: { duration: 400, easingFunction: 'easeInOutQuad' } });

        // Apply URL params if any
        const params = new URLSearchParams(window.location.search);
        const focusNode = params.get('node');
        const searchQuery = params.get('q');

        if (focusNode && nodes.find(n => n.id === focusNode)) {
            setTimeout(() => {
                network.selectNodes([focusNode]);
                network.focus(focusNode, { scale: 1.5, animation: true });
            }, 500);
        }

        if (searchQuery) {
            (document.getElementById('search-input') as HTMLInputElement).value = searchQuery;
        }

        // Radar-style ripple animation for flagship journals (ETRD, JLS, IJCSCL only)
        const flagshipIds = [
            'Educational Technology Research and Development',
            'Journal of the Learning Sciences',
            'International Journal of Computer-Supported Collaborative Learning'
        ];

        let ripplePhase = 0;
        const maxRippleRadius = 50;

        // Draw ripple effect on canvas
        network.on('afterDrawing', (ctx: CanvasRenderingContext2D) => {
            flagshipIds.forEach(id => {
                const position = network.getPositions([id])[id];
                if (!position) return;

                // Draw multiple expanding ripples
                for (let i = 0; i < 3; i++) {
                    const phase = (ripplePhase + i * 20) % 60;
                    const radius = (phase / 60) * maxRippleRadius;
                    const alpha = 1 - (phase / 60);

                    ctx.beginPath();
                    ctx.arc(position.x, position.y, radius + 14, 0, 2 * Math.PI);
                    ctx.strokeStyle = `rgba(139, 92, 246, ${alpha * 0.6})`;
                    ctx.lineWidth = 2;
                    ctx.stroke();
                }
            });
        });

        // Animation loop
        setInterval(() => {
            ripplePhase = (ripplePhase + 1) % 60;
            network.redraw();
        }, 50);
    });

    // Node click handler
    async function handleNodeClick(nodeId: string) {
        if (network.isCluster(nodeId)) {
            network.openCluster(nodeId);
            return;
        }

        const node = nodesDataset.get(nodeId);
        if (!node) return;

        currentNodeId = nodeId;
        showSidebar();
        setSidebarTitle(node.id, node.group, node.impact);

        // Update favorite button
        const favBtn = document.getElementById('favorite-btn')!;
        favBtn.textContent = favorites.has(nodeId) ? '♥' : '♡';
        favBtn.classList.toggle('active', favorites.has(nodeId));

        if (node.group === 'Category') {
            const connectedIds = network.getConnectedNodes(nodeId);
            const connected = nodesDataset.get(connectedIds);
            setSidebarContent(renderCategoryDetails(connected));
        } else {
            const recs = getRecommendations(nodeId, nodes, edges);
            const data = getVenueDetails(node.id, node.group);

            // Fetch annotations from Supabase
            const annotations = await fetchAnnotations(node.id);
            const annotationsHtml = renderAnnotations(annotations, node.id, node.group);

            setSidebarContent(renderVenueDetails(data, node, recs) + annotationsHtml);

            // Add click handlers to recommendation chips
            document.querySelectorAll('.rec-chip').forEach(chip => {
                chip.addEventListener('click', () => {
                    const venueId = chip.getAttribute('data-venue');
                    if (venueId) {
                        network.selectNodes([venueId]);
                        network.focus(venueId, { scale: 1.5, animation: true });
                        handleNodeClick(venueId);
                    }
                });
            });

            // Star rating selection
            let selectedRating = 0;
            document.querySelectorAll('#star-select .star').forEach(star => {
                star.addEventListener('click', (e) => {
                    selectedRating = parseInt((e.target as HTMLElement).dataset.rating || '0');
                    document.querySelectorAll('#star-select .star').forEach((s, i) => {
                        s.textContent = i < selectedRating ? '★' : '☆';
                    });
                });
            });

            // Submit annotation
            document.getElementById('submit-annotation')?.addEventListener('click', async () => {
                const comment = (document.getElementById('annotation-comment') as HTMLTextAreaElement).value.trim();
                if (!comment) {
                    showToast('의견을 입력해주세요');
                    return;
                }
                if (selectedRating === 0) {
                    showToast('별점을 선택해주세요');
                    return;
                }

                const tags: string[] = [];
                document.querySelectorAll('.tag-option input:checked').forEach(input => {
                    tags.push((input as HTMLInputElement).value);
                });

                const user = JSON.parse(localStorage.getItem('fieldexplorer_user') || '{}');
                const parentIdInput = document.getElementById('reply-parent-id') as HTMLInputElement;
                const parentId = parentIdInput?.value || null;

                const success = await addAnnotation({
                    venue_name: node.id,
                    venue_type: node.group,
                    user_email: user.email || 'anonymous',
                    comment,
                    rating: selectedRating,
                    tags,
                    parent_id: parentId
                });

                if (success) {
                    showToast(parentId ? '답글이 등록되었습니다!' : '의견이 등록되었습니다!');
                    handleNodeClick(nodeId); // Refresh
                } else {
                    showToast('등록 실패. 다시 시도해주세요.');
                }
            });

            // Reply button click handler (event delegation)
            document.getElementById('annotations-list')?.addEventListener('click', (e) => {
                const target = e.target as HTMLElement;
                if (target.classList.contains('reply-btn')) {
                    const parentId = target.getAttribute('data-parent');
                    const formTitle = document.getElementById('annotation-form-title');
                    const parentIdInput = document.getElementById('reply-parent-id') as HTMLInputElement;
                    const cancelBtn = document.getElementById('cancel-reply');

                    if (formTitle) formTitle.textContent = '💬 답글 작성';
                    if (parentIdInput) parentIdInput.value = parentId || '';
                    if (cancelBtn) cancelBtn.style.display = 'block';

                    // Scroll to form
                    document.getElementById('add-annotation-form')?.scrollIntoView({ behavior: 'smooth' });
                }
            });

            // Cancel reply button
            document.getElementById('cancel-reply')?.addEventListener('click', () => {
                const formTitle = document.getElementById('annotation-form-title');
                const parentIdInput = document.getElementById('reply-parent-id') as HTMLInputElement;
                const cancelBtn = document.getElementById('cancel-reply');

                if (formTitle) formTitle.textContent = '의견 남기기';
                if (parentIdInput) parentIdInput.value = '';
                if (cancelBtn) cancelBtn.style.display = 'none';
            });
        }
    }

    network.on('click', (params: any) => {
        if (params.nodes.length === 0) {
            hideSidebar();
            currentNodeId = null;
            return;
        }
        handleNodeClick(params.nodes[0]);
    });

    // Hover
    network.on('hoverNode', (params: any) => {
        const neighbors = network.getConnectedNodes(params.node);
        neighbors.push(params.node);
        nodesDataset.update(nodes.map(n => ({ id: n.id, opacity: neighbors.includes(n.id) ? 1 : 0.12 })));
    });

    network.on('blurNode', () => {
        nodesDataset.update(nodes.map(n => ({ id: n.id, opacity: 1 })));
    });

    // Filters
    function applyFilters() {
        const updates = nodes.map(n => {
            if (n.group === 'Category') return { id: n.id, hidden: false };

            // Check venue type
            const typeHidden =
                (n.group === 'Journal' && !filterJournal) ||
                ((n.group === 'Conference' || n.group === 'SubConference') && !filterConference);

            // Check impact filter (only for journals)
            const impactHidden = impactFilter && n.group === 'Journal' && n.impact !== impactFilter;

            return { id: n.id, hidden: typeHidden || impactHidden };
        });
        nodesDataset.update(updates);

        const hiddenIds = new Set(updates.filter(u => u.hidden).map(u => u.id));
        edgesDataset.update(edges.map(e => ({ ...e, hidden: hiddenIds.has(e.from) || hiddenIds.has(e.to) })));
    }

    document.getElementById('filter-journal')!.addEventListener('click', (e) => {
        filterJournal = !filterJournal;
        (e.target as HTMLElement).classList.toggle('active', filterJournal);
        applyFilters();
    });

    document.getElementById('filter-conf')!.addEventListener('click', (e) => {
        filterConference = !filterConference;
        (e.target as HTMLElement).classList.toggle('active', filterConference);
        applyFilters();
    });

    // Impact filter dropdown
    document.getElementById('impact-filter')!.addEventListener('change', (e) => {
        impactFilter = (e.target as HTMLSelectElement).value;
        applyFilters();
        showToast(impactFilter ? `${impactFilter} 저널만 표시` : '전체 등급 표시');
    });

    // Category jump
    categorySelect.addEventListener('change', () => {
        const cat = categorySelect.value;
        if (cat) {
            network.selectNodes([cat]);
            network.focus(cat, { scale: 1.5, animation: { duration: 400 } });
            handleNodeClick(cat);
        }
        categorySelect.value = '';
    });

    // Search with Autocomplete
    const searchInput = document.getElementById('search-input') as HTMLInputElement;
    const autocomplete = document.getElementById('search-autocomplete')!;
    let autocompleteIndex = -1;
    let autocompleteItems: HTMLElement[] = [];

    function updateAutocomplete(query: string) {
        if (!query) {
            autocomplete.classList.remove('visible');
            autocompleteItems = [];
            return;
        }

        const matches = nodes.filter(n =>
            n.id.toLowerCase().includes(query) ||
            (n.label && n.label.toLowerCase().includes(query))
        ).slice(0, 10);

        if (matches.length === 0) {
            autocomplete.classList.remove('visible');
            autocompleteItems = [];
            return;
        }

        autocomplete.innerHTML = matches.map(n => {
            const typeClass = n.group === 'Conference' || n.group === 'SubConference' ? 'conference' :
                n.group === 'Category' ? 'category' : '';
            const typeLabel = n.group === 'Conference' || n.group === 'SubConference' ? '학회' :
                n.group === 'Category' ? '분야' : '저널';
            return `<div class="search-autocomplete-item" data-id="${n.id}">
                <span class="type-badge ${typeClass}">${typeLabel}</span>
                ${n.id}
            </div>`;
        }).join('');

        autocomplete.classList.add('visible');
        autocompleteItems = Array.from(autocomplete.querySelectorAll('.search-autocomplete-item'));
        autocompleteIndex = -1;
    }

    function selectAutocompleteItem(item: HTMLElement) {
        const nodeId = item.getAttribute('data-id');
        if (nodeId) {
            searchInput.value = nodeId;
            autocomplete.classList.remove('visible');
            nodesDataset.update(nodes.map(n => ({ id: n.id, opacity: 1 })));
            network.selectNodes([nodeId]);
            network.focus(nodeId, { scale: 1.5, animation: { duration: 300 } });
            handleNodeClick(nodeId);
        }
    }

    searchInput.addEventListener('input', (e) => {
        const query = (e.target as HTMLInputElement).value.toLowerCase().trim();
        updateAutocomplete(query);

        if (!query) {
            nodesDataset.update(nodes.map(n => ({ id: n.id, opacity: 1 })));
            return;
        }
        nodesDataset.update(nodes.map(n => ({ id: n.id, opacity: n.id.toLowerCase().includes(query) ? 1 : 0.08 })));
    });

    searchInput.addEventListener('keydown', (e) => {
        if (!autocomplete.classList.contains('visible')) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            autocompleteIndex = Math.min(autocompleteIndex + 1, autocompleteItems.length - 1);
            autocompleteItems.forEach((item, i) => item.classList.toggle('active', i === autocompleteIndex));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            autocompleteIndex = Math.max(autocompleteIndex - 1, 0);
            autocompleteItems.forEach((item, i) => item.classList.toggle('active', i === autocompleteIndex));
        } else if (e.key === 'Enter' && autocompleteIndex >= 0) {
            e.preventDefault();
            selectAutocompleteItem(autocompleteItems[autocompleteIndex]);
        } else if (e.key === 'Escape') {
            autocomplete.classList.remove('visible');
        }
    });

    autocomplete.addEventListener('click', (e) => {
        const item = (e.target as HTMLElement).closest('.search-autocomplete-item') as HTMLElement;
        if (item) selectAutocompleteItem(item);
    });

    // Hide autocomplete when clicking outside
    document.addEventListener('click', (e) => {
        if (!(e.target as HTMLElement).closest('.search-box')) {
            autocomplete.classList.remove('visible');
        }
    });

    // Clustering
    document.getElementById('cluster-btn')!.addEventListener('click', (e) => {
        if (isClustered) {
            nodesDataset.getIds().forEach((id: string) => { if (network.isCluster(id)) network.openCluster(id); });
            (e.target as HTMLElement).classList.remove('active');
            network.fit();
        } else {
            nodes.filter(n => n.group === 'Category').forEach(cat => {
                const count = network.getConnectedNodes(cat.id).length;
                if (count > 0) {
                    network.clusterByConnection(cat.id, {
                        clusterNodeProperties: {
                            label: `${cat.label}\n(${count})`,
                            shape: 'hexagon', size: 24,
                            color: { background: '#8b5cf6', border: '#7c3aed' },
                            font: { color: '#fff', size: 10 }
                        }
                    });
                }
            });
            (e.target as HTMLElement).classList.add('active');
        }
        isClustered = !isClustered;
    });

    // Favorite
    document.getElementById('favorite-btn')!.addEventListener('click', () => {
        if (!currentNodeId) return;
        if (favorites.has(currentNodeId)) {
            favorites.delete(currentNodeId);
            showToast('즐겨찾기에서 제거됨');
        } else {
            favorites.add(currentNodeId);
            showToast('즐겨찾기에 추가됨');
        }
        saveFavorites(favorites);
        document.getElementById('favorite-btn')!.textContent = favorites.has(currentNodeId) ? '♥' : '♡';
        document.getElementById('favorite-btn')!.classList.toggle('active', favorites.has(currentNodeId));
    });

    // Theme toggle with persistence
    const savedTheme = localStorage.getItem('fieldexplorer_theme') || 'dark';
    document.body.setAttribute('data-theme', savedTheme);

    document.getElementById('theme-btn')!.addEventListener('click', () => {
        const body = document.body;
        const isDark = body.getAttribute('data-theme') === 'dark';
        const newTheme = isDark ? 'light' : 'dark';
        body.setAttribute('data-theme', newTheme);
        localStorage.setItem('fieldexplorer_theme', newTheme);
        showToast(isDark ? '라이트 모드' : '다크 모드');
    });

    // Language toggle (한/영)
    let isKorean = true;
    document.getElementById('lang-btn')!.addEventListener('click', () => {
        isKorean = !isKorean;

        // Stats labels
        const statLabels = document.querySelectorAll('.stat-label');
        if (statLabels[0]) statLabels[0].textContent = isKorean ? '저널' : 'Journals';
        if (statLabels[1]) statLabels[1].textContent = isKorean ? '학회' : 'Conferences';
        if (statLabels[2]) statLabels[2].textContent = isKorean ? '카테고리' : 'Categories';
        if (statLabels[3]) statLabels[3].textContent = isKorean ? '커뮤니티' : 'Communities';

        // Metric labels
        const metricLabels = document.querySelectorAll('.metric-label');
        if (metricLabels[0]) metricLabels[0].textContent = isKorean ? '밀도' : 'Density';
        if (metricLabels[1]) metricLabels[1].textContent = isKorean ? '군집계수' : 'Clustering';
        if (metricLabels[2]) metricLabels[2].textContent = isKorean ? '엣지' : 'Edges';
        if (metricLabels[3]) metricLabels[3].textContent = isKorean ? '커뮤니티' : 'Communities';

        // Legend
        const legendTitle = document.querySelector('.legend h4');
        if (legendTitle) legendTitle.textContent = isKorean ? '범례' : 'Legend';
        const legendLabels = document.querySelectorAll('.legend-label');
        if (legendLabels[0]) legendLabels[0].textContent = isKorean ? '저널' : 'Journal';
        if (legendLabels[1]) legendLabels[1].textContent = isKorean ? '학회' : 'Conference';
        if (legendLabels[2]) legendLabels[2].textContent = isKorean ? '카테고리' : 'Category';

        // Filter buttons
        const filterJournal = document.getElementById('filter-journal');
        const filterConf = document.getElementById('filter-conf');
        if (filterJournal) filterJournal.textContent = isKorean ? '저널' : 'Journals';
        if (filterConf) filterConf.textContent = isKorean ? '학회' : 'Confs';

        // Search placeholder
        const searchInputEl = document.getElementById('search-input') as HTMLInputElement;
        if (searchInputEl) searchInputEl.placeholder = isKorean ? '검색...' : 'Search...';

        // Header buttons
        const clusterBtn = document.getElementById('cluster-btn');
        if (clusterBtn) {
            clusterBtn.textContent = isKorean ? '클러스터' : 'Cluster';
            clusterBtn.title = isKorean ? '카테고리별 그룹화' : 'Group by Category';
        }

        const fullscreenBtn = document.getElementById('fullscreen-btn');
        if (fullscreenBtn) fullscreenBtn.title = isKorean ? '전체화면 (F)' : 'Fullscreen (F)';

        const themeBtn = document.getElementById('theme-btn');
        if (themeBtn) themeBtn.title = isKorean ? '다크/라이트 테마' : 'Dark/Light Theme';

        const aboutBtn = document.getElementById('about-btn');
        if (aboutBtn) aboutBtn.title = isKorean ? '사용 안내' : 'Help';

        const refreshBtn = document.getElementById('refresh-btn');
        if (refreshBtn) refreshBtn.title = isKorean ? '새로고침' : 'Refresh';

        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.textContent = isKorean ? '🚪 로그아웃' : '🚪 Logout';
            logoutBtn.title = isKorean ? '로그아웃' : 'Logout';
        }

        // Fullscreen exit button
        const fullscreenExit = document.getElementById('fullscreen-exit');
        if (fullscreenExit) fullscreenExit.textContent = isKorean ? '✕ 전체화면 종료' : '✕ Exit Fullscreen';

        // Footer buttons
        const exportBtn = document.getElementById('export-btn');
        if (exportBtn) exportBtn.textContent = isKorean ? '📸 이미지 저장' : '📸 Save Image';

        const shareBtn = document.getElementById('share-btn');
        if (shareBtn) shareBtn.textContent = isKorean ? '🔗 공유' : '🔗 Share';

        const suggestLink = document.querySelector('.footer-links a') as HTMLAnchorElement;
        if (suggestLink) suggestLink.textContent = isKorean ? '📝 수정 제안' : '📝 Suggest Edit';

        // Category dropdown
        const catSelect = document.getElementById('category-jump') as HTMLSelectElement;
        if (catSelect && catSelect.options[0]) {
            catSelect.options[0].textContent = isKorean ? '📍 카테고리 이동' : '📍 Jump to Category';
        }

        // Sidebar buttons
        const favoriteBtn = document.getElementById('favorite-btn');
        if (favoriteBtn) favoriteBtn.title = isKorean ? '즐겨찾기' : 'Favorite';

        const pdfBtn = document.getElementById('pdf-btn');
        if (pdfBtn) pdfBtn.title = isKorean ? 'PDF 저장' : 'Save PDF';

        const sidebarClose = document.getElementById('sidebar-close');
        if (sidebarClose) sidebarClose.title = isKorean ? '닫기' : 'Close';

        // Metrics panel title
        const metricsPanel = document.getElementById('metrics-panel');
        if (metricsPanel) metricsPanel.title = isKorean ? '네트워크 분석 지표' : 'Network Analytics';

        showToast(isKorean ? '한국어' : 'English');
    });

    // Fullscreen
    const toggleFullscreen = () => {
        document.body.classList.toggle('fullscreen');
        showToast(document.body.classList.contains('fullscreen') ? '전체화면 모드' : '일반 모드');
    };
    document.getElementById('fullscreen-btn')!.addEventListener('click', toggleFullscreen);
    document.getElementById('fullscreen-exit')!.addEventListener('click', toggleFullscreen);

    // Export image
    document.getElementById('export-btn')!.addEventListener('click', async () => {
        showToast('이미지 저장 중...');
        try {
            const canvas = await html2canvas(container, { backgroundColor: getComputedStyle(document.body).getPropertyValue('--bg-primary') });
            const link = document.createElement('a');
            link.download = 'fieldexplorer-network.png';
            link.href = canvas.toDataURL();
            link.click();
            showToast('이미지 저장 완료!');
        } catch {
            showToast('이미지 저장 실패');
        }
    });

    // Share URL
    document.getElementById('share-btn')!.addEventListener('click', () => {
        const url = new URL(window.location.href);
        if (currentNodeId) url.searchParams.set('node', currentNodeId);
        if (searchInput.value) url.searchParams.set('q', searchInput.value);

        navigator.clipboard.writeText(url.toString()).then(() => {
            showToast('링크가 클립보드에 복사됨!');
        }).catch(() => {
            showToast('링크 복사 실패');
        });
    });

    // PDF export
    document.getElementById('pdf-btn')!.addEventListener('click', () => {
        if (!currentNodeId) return;

        const content = document.getElementById('sidebar-content')!;
        const title = document.getElementById('sidebar-title')!.textContent || '';

        try {
            const { jsPDF } = jspdf;
            const doc = new jsPDF();

            doc.setFontSize(18);
            doc.text(title, 20, 20);

            doc.setFontSize(10);
            const text = content.innerText;
            const lines = doc.splitTextToSize(text, 170);
            doc.text(lines, 20, 35);

            doc.save(`${title.substring(0, 30)}.pdf`);
            showToast('PDF 저장 완료!');
        } catch {
            showToast('PDF 저장 실패');
        }
    });

    // Sidebar close
    document.getElementById('sidebar-close')!.addEventListener('click', () => {
        hideSidebar();
        currentNodeId = null;
    });

    // About modal
    document.getElementById('about-btn')!.addEventListener('click', () => showModal('about-modal'));
    document.getElementById('modal-close')!.addEventListener('click', () => hideModal('about-modal'));
    document.getElementById('about-modal')!.addEventListener('click', (e) => {
        if ((e.target as HTMLElement).classList.contains('modal-overlay')) hideModal('about-modal');
    });

    // Profile modal
    async function fetchMyAnnotations(email: string) {
        if (!supabase) return [];
        const { data, error } = await supabase
            .from('annotations')
            .select('*')
            .eq('user_email', email)
            .order('created_at', { ascending: false });
        return error ? [] : (data as Annotation[]);
    }

    async function openProfileDialog() {
        const dialog = document.getElementById('profile-dialog')!;
        const user = JSON.parse(localStorage.getItem('fieldexplorer_user') || '{}');
        const email = user.email || 'guest';

        // Show dialog
        dialog.style.display = 'flex';

        // Update profile info
        document.getElementById('profile-email-text')!.textContent = email;
        document.getElementById('profile-badge-text')!.textContent = user.isGuest ? '게스트' : '회원';

        // Display favorites
        const favoritesContainer = document.getElementById('my-favorites-list')!;
        if (favorites.size === 0) {
            favoritesContainer.innerHTML = '<p style="color: var(--text-muted); font-size: 0.8rem;">즐겨찾기가 없습니다.</p>';
        } else {
            favoritesContainer.innerHTML = Array.from(favorites).map(fav => `
                <div class="favorite-item" data-venue="${fav}">
                    <span class="favorite-name">${fav}</span>
                    <button class="remove-fav" data-id="${fav}">✕</button>
                </div>
            `).join('');

            // Click to focus on node
            favoritesContainer.querySelectorAll('.favorite-item').forEach(item => {
                item.addEventListener('click', (e) => {
                    if (!(e.target as HTMLElement).classList.contains('remove-fav')) {
                        const venue = item.getAttribute('data-venue');
                        if (venue) {
                            dialog.style.display = 'none';
                            network.selectNodes([venue]);
                            network.focus(venue, { scale: 1.5, animation: { duration: 300 } });
                            handleNodeClick(venue);
                        }
                    }
                });
            });

            // Remove from favorites
            favoritesContainer.querySelectorAll('.remove-fav').forEach(btn => {
                btn.addEventListener('click', () => {
                    const id = btn.getAttribute('data-id');
                    if (id) {
                        favorites.delete(id);
                        saveFavorites(favorites);
                        openProfileDialog(); // Refresh
                        showToast('즐겨찾기에서 제거됨');
                    }
                });
            });
        }

        // Fetch my annotations
        const myAnnotations = await fetchMyAnnotations(email);
        const container = document.getElementById('my-annotations-list')!;

        if (myAnnotations.length === 0) {
            container.innerHTML = '<p style="color: var(--text-muted); font-size: 0.8rem;">작성한 의견이 없습니다.</p>';
        } else {
            container.innerHTML = myAnnotations.map(a => `
                <div class="my-annotation-item" data-id="${a.id}">
                    <div class="my-annotation-venue">${a.venue_name}</div>
                    <div class="my-annotation-comment">${a.comment}</div>
                    <div class="my-annotation-meta">
                        <span style="color: var(--color-accent); font-size: 0.7rem;">${'★'.repeat(a.rating)}${'☆'.repeat(5 - a.rating)}</span>
                        <div class="my-annotation-actions">
                            <button class="delete" data-id="${a.id}">삭제</button>
                        </div>
                    </div>
                </div>
            `).join('');

            // Delete handlers
            container.querySelectorAll('.delete').forEach(btn => {
                btn.addEventListener('click', async () => {
                    const id = btn.getAttribute('data-id');
                    if (confirm('정말 삭제하시겠습니까?')) {
                        if (supabase) {
                            await supabase.from('annotations').delete().eq('id', id);
                            openProfileDialog(); // Refresh
                            showToast('삭제되었습니다');
                        }
                    }
                });
            });
        }
    }

    // Refresh
    document.getElementById('refresh-btn')!.addEventListener('click', () => location.reload());

    // Logout
    document.getElementById('logout-btn')?.addEventListener('click', async () => {
        if (supabase) {
            await supabase.auth.signOut();
        }
        localStorage.removeItem('fieldexplorer_user');
        window.location.href = '/';
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === '/' && document.activeElement !== searchInput) {
            e.preventDefault();
            searchInput.focus();
        }
        if (e.key === 'Escape') {
            hideSidebar();
            hideModal('about-modal');
            searchInput.blur();
            currentNodeId = null;
        }
        if (e.key === 'f' || e.key === 'F') {
            if (document.activeElement !== searchInput) toggleFullscreen();
        }
    });
}

main();