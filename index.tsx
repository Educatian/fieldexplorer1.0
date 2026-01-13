import { createClient } from "@supabase/supabase-js";

declare const vis: any;
declare const html2canvas: any;
declare const jspdf: any;

// Supabase client for annotations
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

// ============================================================================
// COMPREHENSIVE USER ACTION LOGGING SYSTEM
// ============================================================================
let currentSessionId: string | null = null;
try {
    currentSessionId = sessionStorage.getItem('fieldexplorer_session') || crypto.randomUUID();
    sessionStorage.setItem('fieldexplorer_session', currentSessionId);
} catch { /* fallback */ }

interface LogEntry {
    action_type: string;
    context_tag?: string;
    target_element?: string;
    target_node?: string;
    metadata?: Record<string, unknown>;
    screen_x?: number;
    screen_y?: number;
}

async function logAction(entry: LogEntry) {
    if (!supabase) return;

    try {
        const { data: { user } } = await supabase.auth.getUser();

        await supabase.from('user_logs').insert({
            user_id: user?.id || null,
            session_id: currentSessionId,
            action_type: entry.action_type,
            context_tag: entry.context_tag || detectContext(),
            target_element: entry.target_element,
            target_node: entry.target_node,
            metadata: entry.metadata || {},
            screen_x: entry.screen_x,
            screen_y: entry.screen_y
        });
    } catch (e) {
        console.warn('[Log] Failed:', e);
    }
}

function detectContext(): string {
    // Detect current context based on visible elements
    if (document.getElementById('admin-popup-container')) return 'admin';
    if (document.getElementById('collab-popup')?.style.display !== 'none') return 'collab';
    if (document.querySelector('.sidebar')?.classList.contains('active')) return 'sidebar';
    if (document.querySelector('.comparison-panel')?.classList.contains('active')) return 'comparison';
    return 'network';
}

function getElementDescription(el: HTMLElement): string {
    // Get meaningful description of clicked element
    if (el.id) return `#${el.id}`;
    if (el.getAttribute('data-metric')) return `metric:${el.getAttribute('data-metric')}`;
    if (el.getAttribute('data-filter')) return `filter:${el.getAttribute('data-filter')}`;
    if (el.classList.contains('btn')) return `btn:${el.textContent?.substring(0, 30)}`;
    if (el.tagName === 'BUTTON') return `button:${el.textContent?.substring(0, 30)}`;
    if (el.classList.contains('stat-item')) return 'stat-item';
    if (el.classList.contains('metric-item')) return 'metric-item';
    return el.tagName.toLowerCase();
}

// Global click logger
document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    if (!target) return;

    // Skip logging for network canvas clicks (handled separately)
    if (target.tagName === 'CANVAS') return;

    logAction({
        action_type: 'click',
        target_element: getElementDescription(target),
        screen_x: e.clientX,
        screen_y: e.clientY
    });
}, { passive: true });

// Auth state change logging
supabase?.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN') {
        logAction({ action_type: 'login', metadata: { email: session?.user?.email } });
    } else if (event === 'SIGNED_OUT') {
        logAction({ action_type: 'logout' });
    }
});

// Page view logging
logAction({ action_type: 'page_view', context_tag: 'network', metadata: { url: window.location.href } });

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

function saveFavorites(favorites: Set<string>, lastAction?: { action: 'add' | 'remove', nodeId: string }) {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify([...favorites]));
    if (lastAction) {
        logAction({
            action_type: lastAction.action === 'add' ? 'favorite_add' : 'favorite_remove',
            context_tag: 'sidebar',
            target_node: lastAction.nodeId
        });
    }
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
    id?: string;
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
            // Skip ripple animation when in cluster mode
            if (isClustered) return;

            flagshipIds.forEach(id => {
                // Check if node is visible (not in a cluster)
                try {
                    const nodePositions = network.getPositions([id]);
                    const position = nodePositions[id];
                    if (!position) return;

                    // Verify the node is actually visible in the dataset
                    const nodeData = nodesDataset.get(id);
                    if (!nodeData || nodeData.hidden) return;

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
                } catch {
                    // Node might be clustered, skip it
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
            logAction({ action_type: 'node_deselect', context_tag: 'network' });
            return;
        }
        const nodeId = params.nodes[0];
        const node = nodes.find(n => n.id === nodeId);
        logAction({
            action_type: 'node_click',
            context_tag: 'network',
            target_node: nodeId,
            metadata: { label: node?.label, group: node?.group }
        });
        handleNodeClick(nodeId);
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
        try {
            // If in cluster mode, need to uncluster first for filters to work properly
            if (isClustered) {
                // Open all clusters before applying filters
                try {
                    const allIds = nodesDataset.getIds();
                    allIds.forEach((id: string) => {
                        try {
                            if (network.isCluster(id)) {
                                network.openCluster(id);
                            }
                        } catch { /* node might not be a cluster */ }
                    });
                } catch (e) {
                    console.warn('Error opening clusters:', e);
                }
                isClustered = false;
                const clusterBtn = document.getElementById('cluster-btn');
                if (clusterBtn) clusterBtn.classList.remove('active');
                showToast('필터 적용을 위해 클러스터 해제됨');

                // Wait a bit for cluster to fully open
                setTimeout(() => applyFiltersInternal(), 100);
                return;
            }

            applyFiltersInternal();
        } catch (err) {
            console.error('Filter error:', err);
            showToast('필터 적용 중 오류 발생');
        }
    }

    function applyFiltersInternal() {
        try {
            // Build update array with explicit hidden values
            const nodeUpdates: { id: string; hidden: boolean }[] = [];
            const visibleNodeIds = new Set<string>();

            nodes.forEach(n => {
                let shouldHide = false;

                if (n.group === 'Category') {
                    shouldHide = false; // Categories always visible
                } else if (n.group === 'Journal') {
                    // Hide if journal filter is off OR if impact filter doesn't match
                    shouldHide = !filterJournal || (!!impactFilter && n.impact !== impactFilter);
                } else if (n.group === 'Conference' || n.group === 'SubConference') {
                    shouldHide = !filterConference;
                }

                nodeUpdates.push({ id: n.id, hidden: shouldHide });
                if (!shouldHide) visibleNodeIds.add(n.id);
            });

            // Update all nodes at once
            nodesDataset.update(nodeUpdates);

            // Update edges - hide if either endpoint is hidden
            const edgeUpdates = edges.map(e => ({
                id: `${e.from}-${e.to}`,  // Ensure edge has an id
                from: e.from,
                to: e.to,
                hidden: !visibleNodeIds.has(e.from) || !visibleNodeIds.has(e.to)
            }));
            edgesDataset.update(edgeUpdates);

            // Force redraw to apply visibility changes
            network.redraw();

            // Fit network to show visible nodes with slight delay
            setTimeout(() => {
                try {
                    network.fit({ animation: { duration: 300 } });
                } catch { /* ignore */ }
            }, 100);

            console.log(`Filter applied: ${visibleNodeIds.size} nodes visible`);
        } catch (err) {
            console.error('Filter internal error:', err);
        }
    }

    document.getElementById('filter-journal')!.addEventListener('click', (e) => {
        try {
            filterJournal = !filterJournal;
            (e.target as HTMLElement).classList.toggle('active', filterJournal);
            applyFilters();
            logAction({ action_type: 'filter_toggle', context_tag: 'network', metadata: { filter: 'journal', value: filterJournal } });
        } catch (err) {
            console.error('Journal filter error:', err);
            showToast('저널 필터 오류');
        }
    });

    document.getElementById('filter-conf')!.addEventListener('click', (e) => {
        try {
            filterConference = !filterConference;
            (e.target as HTMLElement).classList.toggle('active', filterConference);
            applyFilters();
            logAction({ action_type: 'filter_toggle', context_tag: 'network', metadata: { filter: 'conference', value: filterConference } });
        } catch (err) {
            console.error('Conference filter error:', err);
            showToast('학회 필터 오류');
        }
    });

    // Impact filter dropdown
    document.getElementById('impact-filter')!.addEventListener('change', (e) => {
        try {
            impactFilter = (e.target as HTMLSelectElement).value;
            applyFilters();
            logAction({ action_type: 'filter_change', context_tag: 'network', metadata: { filter: 'impact', value: impactFilter } });
            showToast(impactFilter ? `${impactFilter} 저널만 표시` : '전체 등급 표시');
        } catch (err) {
            console.error('Impact filter error:', err);
            showToast('등급 필터 오류');
        }
    });

    // ========================================================================
    // METRIC CLICK INTERACTIONS (V3)
    // ========================================================================

    let activeMetricHighlight: string | null = null;

    function highlightByMetric(metric: string) {
        // Toggle off if clicking same metric
        if (activeMetricHighlight === metric) {
            resetHighlight();
            activeMetricHighlight = null;
            showToast('하이라이트 해제');
            return;
        }

        activeMetricHighlight = metric;

        switch (metric) {
            case 'journals':
                nodesDataset.update(nodes.map(n => ({
                    id: n.id,
                    opacity: n.group === 'journal' ? 1 : 0.15
                })));
                showToast('📚 저널 노드 강조');
                break;

            case 'conferences':
                nodesDataset.update(nodes.map(n => ({
                    id: n.id,
                    opacity: n.group === 'conference' ? 1 : 0.15
                })));
                showToast('🎓 학회 노드 강조');
                break;

            case 'categories':
                nodesDataset.update(nodes.map(n => ({
                    id: n.id,
                    opacity: n.group === 'category' ? 1 : 0.15
                })));
                showToast('🏷️ 카테고리 노드 강조');
                break;

            case 'density':
                // Highlight top-connected nodes (degree centrality)
                const degrees: Record<string, number> = {};
                edges.forEach(e => {
                    degrees[e.from] = (degrees[e.from] || 0) + 1;
                    degrees[e.to] = (degrees[e.to] || 0) + 1;
                });
                const sorted = Object.entries(degrees).sort((a, b) => b[1] - a[1]);
                const top10 = new Set(sorted.slice(0, 10).map(s => s[0]));
                nodesDataset.update(nodes.map(n => ({
                    id: n.id,
                    opacity: top10.has(n.id) ? 1 : 0.15
                })));
                showToast('🔗 연결 많은 상위 10개 노드');
                break;

            case 'edges':
                // Highlight all edges
                edgesDataset.update(edges.map(e => ({
                    id: e.id,
                    color: { color: '#00d4ff', opacity: 1 }
                })));
                showToast('📊 엣지 강조');
                break;

            case 'components':
                // Color by connected components
                const visited = new Set<string>();
                const componentColors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dfe6e9', '#a29bfe', '#fd79a8', '#00b894'];
                let componentIdx = 0;
                const nodeColors: Record<string, string> = {};

                function dfs(nodeId: string, color: string) {
                    if (visited.has(nodeId)) return;
                    visited.add(nodeId);
                    nodeColors[nodeId] = color;
                    edges.forEach(e => {
                        if (e.from === nodeId) dfs(e.to, color);
                        if (e.to === nodeId) dfs(e.from, color);
                    });
                }

                nodes.forEach(n => {
                    if (!visited.has(n.id)) {
                        dfs(n.id, componentColors[componentIdx % componentColors.length]);
                        componentIdx++;
                    }
                });

                nodesDataset.update(nodes.map(n => ({
                    id: n.id,
                    color: { background: nodeColors[n.id], border: nodeColors[n.id] },
                    opacity: 1
                })));
                showToast(`🎨 ${componentIdx}개 컴포넌트 색상 구분`);
                break;

            default:
                resetHighlight();
        }
    }

    function resetHighlight() {
        nodesDataset.update(nodes.map(n => ({
            id: n.id,
            opacity: 1,
            color: undefined, // Reset to default
            borderDashes: false,
            borderWidth: undefined
        })));
        edgesDataset.update(edges.map(e => ({
            id: e.id,
            color: undefined // Reset to default
        })));
    }

    // ========================================================================
    // PHASE 2: ISOLATED NODES & BRIDGE NODES
    // ========================================================================

    // Calculate node degrees (connection counts)
    function getNodeDegrees(): Map<string, number> {
        const degrees = new Map<string, number>();
        nodes.forEach(n => degrees.set(n.id, 0));
        edges.forEach(e => {
            degrees.set(e.from, (degrees.get(e.from) || 0) + 1);
            degrees.set(e.to, (degrees.get(e.to) || 0) + 1);
        });
        return degrees;
    }

    // Get isolated nodes (0 connections)
    function getIsolatedNodes(): string[] {
        const degrees = getNodeDegrees();
        return nodes.filter(n => degrees.get(n.id) === 0).map(n => n.id);
    }

    // Get bridge nodes (connect multiple components)
    function getBridgeNodes(): string[] {
        const bridgeNodes: string[] = [];

        // For each node, check if removing it increases component count
        nodes.forEach(node => {
            // Get node's neighbors
            const neighbors = new Set<string>();
            edges.forEach(e => {
                if (e.from === node.id) neighbors.add(e.to);
                if (e.to === node.id) neighbors.add(e.from);
            });

            if (neighbors.size < 2) return;

            // Check if neighbors are in different components when node is removed
            const componentsWithoutNode = findComponentsExcluding(node.id);

            // If neighbors end up in different components, this is a bridge node
            const neighborComponents = new Set<number>();
            neighbors.forEach(n => {
                const compIdx = componentsWithoutNode.get(n);
                if (compIdx !== undefined) neighborComponents.add(compIdx);
            });

            if (neighborComponents.size > 1) {
                bridgeNodes.push(node.id);
            }
        });

        return bridgeNodes;
    }

    function findComponentsExcluding(excludeNodeId: string): Map<string, number> {
        const nodeToComponent = new Map<string, number>();
        const visited = new Set<string>();
        let componentIdx = 0;

        function dfs(nodeId: string, compIdx: number) {
            if (visited.has(nodeId) || nodeId === excludeNodeId) return;
            visited.add(nodeId);
            nodeToComponent.set(nodeId, compIdx);
            edges.forEach(e => {
                if (e.from === nodeId && e.to !== excludeNodeId) dfs(e.to, compIdx);
                if (e.to === nodeId && e.from !== excludeNodeId) dfs(e.from, compIdx);
            });
        }

        nodes.forEach(n => {
            if (!visited.has(n.id) && n.id !== excludeNodeId) {
                dfs(n.id, componentIdx);
                componentIdx++;
            }
        });

        return nodeToComponent;
    }

    // Apply visual indicators for isolated and bridge nodes
    function applyNodeIndicators() {
        const isolatedNodes = new Set(getIsolatedNodes());
        const bridgeNodes = new Set(getBridgeNodes());

        nodesDataset.update(nodes.map(n => {
            const isIsolated = isolatedNodes.has(n.id);
            const isBridge = bridgeNodes.has(n.id);

            return {
                id: n.id,
                borderDashes: isIsolated ? [5, 5] : false,
                borderWidth: isIsolated ? 2 : (isBridge ? 3 : undefined),
                label: isBridge ? `⭐ ${n.label || n.id}` : (n.label || n.id)
            };
        }));

        const isolatedCount = isolatedNodes.size;
        const bridgeCount = bridgeNodes.size;

        // Update UI metric values
        const isolatedEl = document.getElementById('metric-isolated');
        const bridgesEl = document.getElementById('metric-bridges');
        if (isolatedEl) isolatedEl.textContent = String(isolatedCount);
        if (bridgesEl) bridgesEl.textContent = String(bridgeCount);

        console.log(`[Network] Isolated: ${isolatedCount}, Bridges: ${bridgeCount}`);
    }

    // Add toggle for isolated nodes only view
    let showOnlyIsolated = false;

    function toggleIsolatedView() {
        showOnlyIsolated = !showOnlyIsolated;

        if (showOnlyIsolated) {
            const isolatedNodes = new Set(getIsolatedNodes());
            nodesDataset.update(nodes.map(n => ({
                id: n.id,
                opacity: isolatedNodes.has(n.id) ? 1 : 0.1
            })));
            showToast(`🔘 고립 노드만 표시 (${isolatedNodes.size}개)`);
        } else {
            resetHighlight();
            showToast('전체 노드 표시');
        }
    }

    // Apply indicators on load (after network stabilizes)
    setTimeout(() => {
        applyNodeIndicators();
    }, 2000);

    // Add click handlers to stat and metric items
    document.querySelectorAll('.stat-item[data-metric], .metric-item[data-metric]').forEach(el => {
        el.addEventListener('click', () => {
            const metric = el.getAttribute('data-metric');
            if (metric === 'isolated') {
                toggleIsolatedView();
            } else if (metric === 'bridges') {
                // Highlight bridge nodes
                const bridgeNodes = new Set(getBridgeNodes());
                nodesDataset.update(nodes.map(n => ({
                    id: n.id,
                    opacity: bridgeNodes.has(n.id) ? 1 : 0.15
                })));
                showToast(`⭐ 브릿지 노드 강조 (${bridgeNodes.size}개)`);
            } else if (metric) {
                highlightByMetric(metric);
            }
        });
    });

    // CFP Deadline filter - highlight nodes with upcoming CFP deadlines
    let cfpFilterDays = 0; // 0 = off, 30/60/90 = days

    function getCFPEntries() {
        const monthMap: Record<string, number> = {
            'January': 0, 'February': 1, 'March': 2, 'April': 3,
            'May': 4, 'June': 5, 'July': 6, 'August': 7,
            'September': 8, 'October': 9, 'November': 10, 'December': 11
        };

        const entries: Array<{ venueId: string; deadline: Date; daysUntil: number }> = [];
        const now = new Date();
        const currentYear = now.getFullYear();

        for (const venue of venueData) {
            if (!venue.cfpDeadline) continue;

            const firstMonth = venue.cfpDeadline.split('/')[0];
            const monthIndex = monthMap[firstMonth];
            if (monthIndex === undefined) continue;

            let deadline = new Date(currentYear, monthIndex, 15);
            if (deadline < now) {
                deadline = new Date(currentYear + 1, monthIndex, 15);
            }

            const daysUntil = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
            entries.push({ venueId: venue.name, deadline, daysUntil });
        }

        return entries.sort((a, b) => a.daysUntil - b.daysUntil);
    }

    function applyCFPFilter() {
        if (cfpFilterDays === 0) {
            // Show all conferences
            showToast('CFP 필터 해제');
            return;
        }

        const cfpEntries = getCFPEntries();
        const urgentVenues = new Set(
            cfpEntries
                .filter(e => e.daysUntil >= 0 && e.daysUntil <= cfpFilterDays)
                .map(e => e.venueId)
        );

        // Highlight urgent nodes
        const updates = nodes.map(n => {
            if (urgentVenues.has(n.id)) {
                return { id: n.id, borderWidth: 4, color: { border: '#f59e0b' } };
            }
            return { id: n.id, borderWidth: 1, color: { border: undefined } };
        });
        nodesDataset.update(updates);

        showToast(`CFP 마감 ${cfpFilterDays}일 이내: ${urgentVenues.size}개 학회`);
    }

    // CFP filter button toggle (if exists)
    const cfpFilterBtn = document.getElementById('cfp-filter-btn');
    if (cfpFilterBtn) {
        cfpFilterBtn.addEventListener('click', () => {
            // Cycle through: 0 -> 30 -> 60 -> 90 -> 0
            cfpFilterDays = cfpFilterDays === 0 ? 30 :
                cfpFilterDays === 30 ? 60 :
                    cfpFilterDays === 60 ? 90 : 0;
            cfpFilterBtn.classList.toggle('active', cfpFilterDays > 0);
            cfpFilterBtn.textContent = cfpFilterDays > 0 ? `📅 D-${cfpFilterDays}` : '📅 CFP';
            applyCFPFilter();
        });
    }

    // ========================================================================
    // COMPARISON MODE (Phase 3)
    // ========================================================================

    interface ComparisonState {
        isActive: boolean;
        nodes: string[];
        startTime: number;
    }

    const comparisonState: ComparisonState = {
        isActive: false,
        nodes: [],
        startTime: 0
    };

    const compareBtn = document.getElementById('compare-btn');
    let comparisonPanelEl: HTMLElement | null = null;

    function toggleComparisonMode() {
        comparisonState.isActive = !comparisonState.isActive;

        if (comparisonState.isActive) {
            comparisonState.nodes = [];
            comparisonState.startTime = Date.now();
            showToast('📊 비교 모드 활성화 - 노드를 클릭하세요 (최대 3개)');
        } else {
            removeComparisonPanel();
            showToast('비교 모드 종료');
        }

        compareBtn?.classList.toggle('active', comparisonState.isActive);
    }

    function addToComparison(nodeId: string): boolean {
        if (!comparisonState.isActive) return false;
        if (comparisonState.nodes.length >= 3) {
            showToast('⚠️ 최대 3개까지 비교 가능');
            return false;
        }
        if (comparisonState.nodes.includes(nodeId)) {
            // Remove if already added
            comparisonState.nodes = comparisonState.nodes.filter(n => n !== nodeId);
            showToast(`비교에서 제거: ${nodeId}`);
        } else {
            comparisonState.nodes.push(nodeId);
            showToast(`비교에 추가: ${nodeId} (${comparisonState.nodes.length}/3)`);
        }

        renderComparisonPanel();
        return true;
    }

    function getVenueDataForComparison(nodeId: string) {
        const venue = venueData.find(v => v.name === nodeId);
        return venue ? {
            id: venue.name,
            name: venue.name,
            type: venue.type,
            impact: venue.impact,
            cfpDeadline: venue.cfpDeadline,
            categories: venue.categories
        } : null;
    }

    function renderComparisonPanel() {
        if (!comparisonState.isActive) return;

        // Remove existing panel
        removeComparisonPanel();

        // Create panel container
        comparisonPanelEl = document.createElement('div');
        comparisonPanelEl.id = 'comparison-panel-container';

        const venues = comparisonState.nodes
            .map(getVenueDataForComparison)
            .filter(Boolean);

        if (venues.length === 0) {
            comparisonPanelEl.innerHTML = `
                <div class="comparison-panel">
                    <div class="comparison-empty">
                        <p>📊 비교할 노드를 클릭하세요 (최대 3개)</p>
                        <p class="hint">노드 클릭 또는 C 키로 비교 모드 전환</p>
                        <button class="btn compare-cancel" style="margin-top: 10px;">✕ 비교 취소</button>
                    </div>
                </div>
            `;
        } else {
            const elapsedSec = Math.floor((Date.now() - comparisonState.startTime) / 1000);
            const columns = venues.map(v => `
                <div class="compare-column" data-venue-id="${v!.id}">
                    <div class="compare-header" style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px;">
                        <span class="compare-name">${v!.name}</span>
                        <button class="compare-remove" data-id="${v!.id}" title="제거">✕</button>
                    </div>
                    <div class="compare-body">
                        <div class="compare-row"><span class="compare-label">유형</span><span class="compare-value">${v!.type}</span></div>
                        <div class="compare-row"><span class="compare-label">등급</span><span class="compare-value ${v!.impact ? 'impact-' + v!.impact : ''}">${v!.impact || '-'}</span></div>
                        ${v!.cfpDeadline ? `<div class="compare-row"><span class="compare-label">CFP</span><span class="compare-value">${v!.cfpDeadline}</span></div>` : ''}
                    </div>
                    <div class="compare-actions">
                        <button class="btn compare-favorite" data-id="${v!.id}">♡ 즐겨찾기</button>
                    </div>
                </div>
            `).join('');

            comparisonPanelEl.innerHTML = `
                <div class="comparison-panel">
                    <div class="comparison-header">
                        <span>📊 비교 모드 (${venues.length}/3)</span>
                        <button class="btn compare-clear" title="모두 지우기">🗑️ 초기화</button>
                    </div>
                    <div class="comparison-grid">${columns}</div>
                    <div class="comparison-footer">
                        <span class="decision-timer">⏱️ ${elapsedSec}초</span>
                        <button class="btn compare-done">✓ 비교 완료</button>
                    </div>
                </div>
            `;
        }

        document.body.appendChild(comparisonPanelEl);

        // Event handlers
        comparisonPanelEl.querySelectorAll('.compare-remove').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                if (id) {
                    comparisonState.nodes = comparisonState.nodes.filter(n => n !== id);
                    renderComparisonPanel();
                }
            });
        });

        comparisonPanelEl.querySelectorAll('.compare-favorite').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                if (id) {
                    const favorites = getFavorites();
                    favorites.add(id);
                    saveFavorites(favorites);
                    showToast(`♥ ${id} 즐겨찾기 추가`);
                    renderComparisonPanel();
                }
            });
        });

        comparisonPanelEl.querySelector('.compare-clear')?.addEventListener('click', () => {
            comparisonState.nodes = [];
            renderComparisonPanel();
        });

        comparisonPanelEl.querySelector('.compare-done')?.addEventListener('click', () => {
            const decisionTime = Date.now() - comparisonState.startTime;
            console.log('[CompareDecision]', {
                nodes: comparisonState.nodes,
                decisionTimeMs: decisionTime
            });
            showToast(`✓ 비교 완료 (${Math.floor(decisionTime / 1000)}초)`);
            toggleComparisonMode();
        });

        comparisonPanelEl.querySelector('.compare-cancel')?.addEventListener('click', () => {
            toggleComparisonMode();
        });
    }

    function removeComparisonPanel() {
        comparisonPanelEl?.remove();
        comparisonPanelEl = null;
    }

    // Compare button handler
    compareBtn?.addEventListener('click', toggleComparisonMode);

    // ========================================================================
    // FEED POPUP (Recent Reviews)
    // ========================================================================

    interface FeedItem {
        id: string;
        venue_name: string;
        venue_type: string;
        rating: number | null;
        comment: string;
        tags: string[] | null;
        created_at: string;
        author_label: string;
    }

    interface FeedCursor {
        created_at: string;
        id: string;
    }

    let feedItems: FeedItem[] = [];
    let feedCursor: FeedCursor | null = null;
    let feedHasMore = true;
    let feedLoading = false;

    const feedBtn = document.getElementById('feed-btn');

    function formatTimeAgo(dateString: string): string {
        const date = new Date(dateString);
        const now = new Date();
        const diffSec = Math.floor((now.getTime() - date.getTime()) / 1000);
        const diffMin = Math.floor(diffSec / 60);
        const diffHour = Math.floor(diffMin / 60);
        const diffDay = Math.floor(diffHour / 24);

        if (diffSec < 60) return '방금 전';
        if (diffMin < 60) return `${diffMin}분 전`;
        if (diffHour < 24) return `${diffHour}시간 전`;
        if (diffDay < 7) return `${diffDay}일 전`;
        return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
    }

    async function fetchFeed() {
        if (!supabase || feedLoading) return;
        feedLoading = true;

        try {
            let query = supabase
                .from('annotations_feed')
                .select('*')
                .order('created_at', { ascending: false })
                .order('id', { ascending: false })
                .limit(21);

            if (feedCursor) {
                const ts = new Date(feedCursor.created_at).toISOString();
                query = query.or(`created_at.lt.${ts},and(created_at.eq.${ts},id.lt.${feedCursor.id})`);
            }

            const { data, error } = await query;

            if (error) throw new Error(error.message);

            const items = data || [];
            feedHasMore = items.length > 20;
            const newItems = feedHasMore ? items.slice(0, 20) : items;
            feedItems = [...feedItems, ...newItems];

            if (newItems.length > 0) {
                const last = newItems[newItems.length - 1];
                feedCursor = { created_at: last.created_at, id: last.id };
            }

            renderFeedPopup();
        } catch (err: any) {
            showToast(`피드 로드 실패: ${err.message}`);
        } finally {
            feedLoading = false;
        }
    }

    function renderFeedPopup() {
        let popup = document.getElementById('feed-popup-container');
        if (!popup) {
            popup = document.createElement('div');
            popup.id = 'feed-popup-container';
            document.body.appendChild(popup);
        }

        const itemsHtml = feedItems.length > 0
            ? feedItems.map(item => `
                <div class="feed-card" data-venue="${item.venue_name}">
                    <div class="feed-header">
                        <span class="feed-author">${item.author_label === 'me' ? '👤 나' : `👤 ${item.author_label}`}</span>
                        <span class="feed-time">${formatTimeAgo(item.created_at)}</span>
                    </div>
                    <div class="feed-venue">
                        <span>${item.venue_type === 'Journal' ? '📘' : '🎤'}</span>
                        <span class="feed-venue-name">${item.venue_name}</span>
                    </div>
                    ${item.rating ? `<div class="feed-rating">${'⭐'.repeat(item.rating)}</div>` : ''}
                    <div class="feed-comment">${item.comment}</div>
                    ${item.tags?.length ? `<div class="feed-tags">${item.tags.map(t => `<span class="feed-tag">${t}</span>`).join('')}</div>` : ''}
                </div>
            `).join('')
            : '<div class="feed-empty">아직 리뷰가 없어요</div>';

        popup.innerHTML = `
            <div class="feed-popup">
                <div class="feed-overlay" id="feed-overlay"></div>
                <div class="feed-container">
                    <div class="feed-popup-header">
                        <h3>📢 최신 리뷰</h3>
                        <button class="feed-close" id="feed-close-btn">✕</button>
                    </div>
                    <div class="feed-content">
                        ${feedLoading && feedItems.length === 0 ? '<div class="feed-loading">불러오는 중...</div>' : itemsHtml}
                        ${feedHasMore && !feedLoading ? '<button class="btn feed-load-more" id="feed-load-more">더 보기</button>' : ''}
                        ${feedLoading && feedItems.length > 0 ? '<div class="feed-loading">불러오는 중...</div>' : ''}
                    </div>
                </div>
            </div>
        `;

        // Event handlers
        document.getElementById('feed-close-btn')?.addEventListener('click', closeFeedPopup);
        document.getElementById('feed-overlay')?.addEventListener('click', closeFeedPopup);
        document.getElementById('feed-load-more')?.addEventListener('click', fetchFeed);

        popup.querySelectorAll('.feed-card').forEach(card => {
            card.addEventListener('click', () => {
                const venueName = card.getAttribute('data-venue');
                if (venueName) {
                    navigateToVenue(venueName);
                    closeFeedPopup();
                }
            });
        });
    }

    function navigateToVenue(venueName: string) {
        const node = nodesDataset.get(venueName);
        if (!node) {
            showToast('노드를 찾을 수 없음');
            return;
        }

        requestAnimationFrame(() => {
            network.selectNodes([venueName]);
            network.focus(venueName, { scale: 1.5, animation: { duration: 400 } });
            handleNodeClick(venueName);
        });
    }

    function openFeedPopup() {
        feedItems = [];
        feedCursor = null;
        feedHasMore = true;
        feedLoading = false;
        fetchFeed();
    }

    function closeFeedPopup() {
        document.getElementById('feed-popup-container')?.remove();
    }

    feedBtn?.addEventListener('click', openFeedPopup);

    // ESC closes feed popup
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && document.getElementById('feed-popup-container')) {
            closeFeedPopup();
        }
    });

    // ========================================================================
    // WHAT'S NEW POPUP
    // ========================================================================

    const CURRENT_VERSION = '2.1.0';
    const lastSeenVersion = localStorage.getItem('fieldexplorer_version');

    if (lastSeenVersion !== CURRENT_VERSION) {
        showWhatsNewPopup();
    }

    function showWhatsNewPopup() {
        const popup = document.createElement('div');
        popup.id = 'whatsnew-popup-container';
        popup.innerHTML = `
            <div class="whatsnew-popup">
                <div class="whatsnew-overlay" id="whatsnew-overlay"></div>
                <div class="whatsnew-container">
                    <div class="whatsnew-emoji">🎉</div>
                    <div class="whatsnew-title">새로운 기능!</div>
                    <div class="whatsnew-version">Version ${CURRENT_VERSION}</div>
                    <div class="whatsnew-features">
                        <div class="whatsnew-feature">
                            <span class="whatsnew-feature-icon">📢</span>
                            <div class="whatsnew-feature-text">
                                <strong>리뷰 피드</strong>
                                <span>최신 리뷰를 한눈에 확인</span>
                            </div>
                        </div>
                        <div class="whatsnew-feature">
                            <span class="whatsnew-feature-icon">📊</span>
                            <div class="whatsnew-feature-text">
                                <strong>비교 모드</strong>
                                <span>최대 3개 venue를 나란히 비교 (C 키)</span>
                            </div>
                        </div>
                        <div class="whatsnew-feature">
                            <span class="whatsnew-feature-icon">📅</span>
                            <div class="whatsnew-feature-text">
                                <strong>CFP 마감일 필터</strong>
                                <span>30/60/90일 이내 마감 학회 하이라이트</span>
                            </div>
                        </div>
                        <div class="whatsnew-feature">
                            <span class="whatsnew-feature-icon">⌨️</span>
                            <div class="whatsnew-feature-text">
                                <strong>키보드 내비게이션</strong>
                                <span>화살표 키로 노드 탐색</span>
                            </div>
                        </div>
                    </div>
                    <button class="whatsnew-btn" id="whatsnew-close">확인했어요!</button>
                </div>
            </div>
        `;
        document.body.appendChild(popup);

        function closeWhatsNew() {
            localStorage.setItem('fieldexplorer_version', CURRENT_VERSION);
            popup.remove();
        }

        document.getElementById('whatsnew-close')?.addEventListener('click', closeWhatsNew);
        document.getElementById('whatsnew-overlay')?.addEventListener('click', closeWhatsNew);
    }


    // ========================================================================
    // COLLABORATION POPUP
    // ========================================================================

    interface CollabThread {
        id: string;
        title: string;
        description: string | null;
        author_id: string;
        status: string;
        purposes: string[];
        needed_roles: string[];
        last_activity_at: string;
        created_at: string;
    }

    function getPurposeIcons(purposes: string[]): string {
        if (!purposes || purposes.length === 0) return '📌';
        const iconMap: Record<string, string> = {
            'paper': '📝',
            'research_plan': '🔬',
            'data_analysis': '📊',
            'irb': '📋',
            'course_dev': '📚',
            'other': '📌'
        };
        return purposes.map(p => iconMap[p] || '📌').join('');
    }

    const collabBtn = document.getElementById('collab-btn');
    const adminBtn = document.getElementById('admin-btn');

    // Check if user is admin and show admin button
    async function checkAdminRole() {
        if (!supabase) return;
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', user.id)
            .single();

        if (data?.role === 'admin' && adminBtn) {
            adminBtn.style.display = 'inline-flex';
        }
    }

    checkAdminRole();

    adminBtn?.addEventListener('click', openAdminPopup);

    async function openAdminPopup() {
        if (!supabase) return;

        // Close existing popup if any
        document.getElementById('admin-popup-container')?.remove();

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            showToast('로그인이 필요합니다');
            return;
        }

        // Get stats
        const [usersRes, threadsRes] = await Promise.all([
            supabase.from('user_roles').select('*', { count: 'exact' }),
            supabase.from('collaboration_threads').select('*', { count: 'exact' })
        ]);

        const userCount = usersRes.count || 0;
        const threadCount = threadsRes.count || 0;

        // Get recent users
        const { data: users } = await supabase
            .from('user_roles')
            .select('user_id, role, created_at')
            .order('created_at', { ascending: false })
            .limit(10);

        const popup = document.createElement('div');
        popup.id = 'admin-popup-container';
        popup.innerHTML = `
            <div class="collab-popup">
                <div class="collab-overlay" id="admin-overlay"></div>
                <div class="collab-container" style="max-width: 700px;">
                    <div class="collab-header">
                        <span class="collab-title">🔐 Admin Dashboard</span>
                        <button class="collab-close" id="admin-close">×</button>
                    </div>
                    <div class="collab-content" style="padding: 20px; max-height: 70vh; overflow-y: auto;">
                        <!-- Stats -->
                        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-bottom: 20px;">
                            <div style="background: var(--bg-primary); padding: 16px; border-radius: 12px; text-align: center;">
                                <div style="font-size: 1.8rem; font-weight: 700; color: var(--klse-yellow);">${userCount}</div>
                                <div style="font-size: 0.75rem; color: var(--text-muted);">등록 사용자</div>
                            </div>
                            <div style="background: var(--bg-primary); padding: 16px; border-radius: 12px; text-align: center;">
                                <div style="font-size: 1.8rem; font-weight: 700; color: var(--klse-yellow);">${threadCount}</div>
                                <div style="font-size: 0.75rem; color: var(--text-muted);">협업 쓰레드</div>
                            </div>
                        </div>

                        <!-- User Search & Role Assignment -->
                        <div style="background: var(--bg-primary); padding: 16px; border-radius: 12px; margin-bottom: 20px;">
                            <h3 style="font-size: 0.9rem; margin-bottom: 12px;">👤 사용자 검색 & 역할 할당</h3>
                            <div style="display: flex; gap: 8px; margin-bottom: 12px;">
                                <input type="text" id="admin-user-search" placeholder="user_id 또는 이메일 검색..." 
                                    style="flex: 1; background: var(--klse-navy); border: 1px solid var(--border-color); border-radius: 8px; padding: 10px; color: var(--text-primary); font-size: 0.85rem;">
                                <button id="admin-search-btn" class="btn" style="padding: 10px 16px;">검색</button>
                            </div>
                            <div id="admin-search-result" style="font-size: 0.85rem;"></div>
                        </div>
                        
                        <!-- Announcement -->
                        <div style="background: var(--bg-primary); padding: 16px; border-radius: 12px; margin-bottom: 20px;">
                            <h3 style="font-size: 0.9rem; margin-bottom: 12px;">📧 전체 공지</h3>
                            <input type="text" id="admin-announce-subject" placeholder="공지 제목" 
                                style="width: 100%; background: var(--klse-navy); border: 1px solid var(--border-color); border-radius: 8px; padding: 10px; color: var(--text-primary); font-size: 0.85rem; margin-bottom: 8px;">
                            <textarea id="admin-announce-body" placeholder="공지 내용..." 
                                style="width: 100%; background: var(--klse-navy); border: 1px solid var(--border-color); border-radius: 8px; padding: 10px; color: var(--text-primary); font-size: 0.85rem; min-height: 80px; resize: vertical;"></textarea>
                            <button id="admin-send-announce" class="btn" style="margin-top: 8px;">📨 공지 발송 (저장)</button>
                            <div id="admin-announce-result" style="font-size: 0.8rem; margin-top: 8px;"></div>
                        </div>
                        
                        <!-- Recent Users -->
                        <h3 style="font-size: 0.9rem; margin-bottom: 12px;">👥 최근 사용자</h3>
                        <div style="max-height: 150px; overflow-y: auto;">
                            ${users?.map(u => `
                                <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid var(--border-color);">
                                    <span style="font-size: 0.8rem; font-family: monospace;">${u.user_id.substring(0, 12)}...</span>
                                    <div style="display: flex; align-items: center; gap: 8px;">
                                        <span style="font-size: 0.7rem; padding: 2px 8px; border-radius: 10px; background: ${u.role === 'admin' ? 'rgba(245, 166, 35, 0.2)' : 'rgba(123, 160, 204, 0.2)'}; color: ${u.role === 'admin' ? 'var(--klse-yellow)' : '#7ba0cc'};">${u.role}</span>
                                        <button class="admin-toggle-role" data-userid="${u.user_id}" data-role="${u.role}" 
                                            style="font-size: 0.7rem; padding: 2px 8px; border-radius: 6px; background: transparent; border: 1px solid var(--border-color); color: var(--text-muted); cursor: pointer;">
                                            ${u.role === 'admin' ? '→user' : '→admin'}
                                        </button>
                                    </div>
                                </div>
                            `).join('') || '<div style="color: var(--text-muted);">사용자 없음</div>'}
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(popup);

        document.getElementById('admin-overlay')?.addEventListener('click', closeAdminPopup);
        document.getElementById('admin-close')?.addEventListener('click', closeAdminPopup);

        // Search user
        document.getElementById('admin-search-btn')?.addEventListener('click', async () => {
            const searchInput = document.getElementById('admin-user-search') as HTMLInputElement;
            const resultDiv = document.getElementById('admin-search-result');
            if (!resultDiv || !searchInput.value.trim()) return;

            resultDiv.innerHTML = '검색 중...';
            const { data, error } = await supabase.from('user_roles')
                .select('user_id, role')
                .ilike('user_id', `%${searchInput.value.trim()}%`)
                .limit(5);

            if (error || !data?.length) {
                resultDiv.innerHTML = '<span style="color: var(--text-muted);">결과 없음</span>';
                return;
            }

            resultDiv.innerHTML = data.map(u => `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 6px 0;">
                    <span style="font-family: monospace; font-size: 0.8rem;">${u.user_id}</span>
                    <select class="admin-role-select" data-userid="${u.user_id}" 
                        style="background: var(--klse-navy); border: 1px solid var(--border-color); border-radius: 6px; padding: 4px 8px; color: var(--text-primary); font-size: 0.8rem;">
                        <option value="user" ${u.role === 'user' ? 'selected' : ''}>user</option>
                        <option value="admin" ${u.role === 'admin' ? 'selected' : ''}>admin</option>
                    </select>
                </div>
            `).join('');

            // Role change handler
            document.querySelectorAll('.admin-role-select').forEach(select => {
                select.addEventListener('change', async (e) => {
                    const target = e.target as HTMLSelectElement;
                    const userId = target.getAttribute('data-userid');
                    const newRole = target.value;

                    const { error } = await supabase.from('user_roles')
                        .update({ role: newRole })
                        .eq('user_id', userId);

                    if (error) {
                        showToast('역할 변경 실패: ' + error.message);
                    } else {
                        showToast(`✅ 역할 변경: ${newRole}`);
                    }
                });
            });
        });

        // Toggle role buttons in user list
        document.querySelectorAll('.admin-toggle-role').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const target = e.target as HTMLElement;
                const userId = target.getAttribute('data-userid');
                const currentRole = target.getAttribute('data-role');
                const newRole = currentRole === 'admin' ? 'user' : 'admin';

                const { error } = await supabase.from('user_roles')
                    .update({ role: newRole })
                    .eq('user_id', userId);

                if (error) {
                    showToast('역할 변경 실패: ' + error.message);
                } else {
                    showToast(`✅ ${userId.substring(0, 8)}... → ${newRole}`);
                    openAdminPopup(); // Refresh
                }
            });
        });

        // Send announcement
        document.getElementById('admin-send-announce')?.addEventListener('click', async () => {
            const subject = (document.getElementById('admin-announce-subject') as HTMLInputElement).value;
            const body = (document.getElementById('admin-announce-body') as HTMLTextAreaElement).value;
            const resultDiv = document.getElementById('admin-announce-result');

            if (!subject.trim() || !body.trim()) {
                if (resultDiv) resultDiv.innerHTML = '<span style="color: #ef4444;">제목과 내용을 입력하세요</span>';
                return;
            }

            const { error } = await supabase.from('announcement_logs').insert({
                admin_id: user.id,
                subject,
                body,
                recipient_count: userCount
            });

            if (error) {
                if (resultDiv) resultDiv.innerHTML = `<span style="color: #ef4444;">❌ ${error.message}</span>`;
            } else {
                if (resultDiv) resultDiv.innerHTML = '<span style="color: #22c55e;">✅ 공지 저장됨 (이메일은 Edge Function 연동 필요)</span>';
                (document.getElementById('admin-announce-subject') as HTMLInputElement).value = '';
                (document.getElementById('admin-announce-body') as HTMLTextAreaElement).value = '';
            }
        });
    }

    function closeAdminPopup() {
        document.getElementById('admin-popup-container')?.remove();
    }

    async function fetchThreads(): Promise<CollabThread[]> {
        if (!supabase) return [];
        const { data, error } = await supabase
            .from('collaboration_threads')
            .select('*')
            .order('last_activity_at', { ascending: false })
            .limit(20);

        if (error) {
            showToast('쓰레드 로드 실패: ' + error.message);
            return [];
        }
        return data || [];
    }

    function formatCollabTime(dateString: string): string {
        const date = new Date(dateString);
        const now = new Date();
        const diffMin = Math.floor((now.getTime() - date.getTime()) / 60000);
        if (diffMin < 60) return `${diffMin}분 전`;
        const diffHour = Math.floor(diffMin / 60);
        if (diffHour < 24) return `${diffHour}시간 전`;
        const diffDay = Math.floor(diffHour / 24);
        return `${diffDay}일 전`;
    }

    function getStatusLabel(status: string): string {
        switch (status) {
            case 'open': return '모집 중';
            case 'in_progress': return '진행 중';
            case 'closed': return '종료';
            default: return status;
        }
    }

    async function openCollabPopup() {
        // Remove existing popup first
        closeCollabPopup();

        const threads = await fetchThreads();

        const popup = document.createElement('div');
        popup.id = 'collab-popup-container';
        popup.innerHTML = `
            <div class="collab-popup">
                <div class="collab-overlay" id="collab-overlay"></div>
                <div class="collab-container">
                    <div class="collab-header">
                        <h3>🤝 협업 요청</h3>
                        <button class="collab-close" id="collab-close">✕</button>
                    </div>
                    <div class="collab-actions">
                        <button class="btn" id="collab-new-btn">+ 새 요청</button>
                    </div>
                    <div class="collab-content" id="collab-content">
                        ${threads.length > 0 ? threads.map(t => `
                            <div class="collab-thread" data-id="${t.id}">
                                <div class="collab-thread-header">
                                    <span class="collab-thread-title">${getPurposeIcons(t.purposes || [])} ${t.title}</span>
                                    <span class="collab-thread-status ${t.status}">${getStatusLabel(t.status)}</span>
                                </div>
                                ${t.description ? `<div class="collab-thread-desc">${t.description.substring(0, 100)}${t.description.length > 100 ? '...' : ''}</div>` : ''}
                                <div class="collab-thread-meta">
                                    <span>🕐 ${formatCollabTime(t.last_activity_at)}</span>
                                    ${t.needed_roles?.length > 0 ? `<span>👥 ${t.needed_roles.join(', ')}</span>` : ''}
                                </div>
                            </div>
                        `).join('') : '<div class="collab-empty">아직 협업 요청이 없어요</div>'}
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(popup);

        document.getElementById('collab-close')?.addEventListener('click', closeCollabPopup);
        document.getElementById('collab-overlay')?.addEventListener('click', closeCollabPopup);
        document.getElementById('collab-new-btn')?.addEventListener('click', showNewThreadForm);

        popup.querySelectorAll('.collab-thread').forEach(el => {
            el.addEventListener('click', () => {
                const threadId = el.getAttribute('data-id');
                if (threadId) showThreadDetail(threadId);
            });
        });
    }

    function closeCollabPopup() {
        document.getElementById('collab-popup-container')?.remove();
    }

    function showNewThreadForm() {
        const content = document.getElementById('collab-content');
        if (!content) return;

        content.innerHTML = `
            <div class="collab-form">
                <input type="text" id="new-thread-title" placeholder="협업 제목 *" required>
                
                <label style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 4px; display: block;">목적 유형 * (복수 선택)</label>
                <div id="purpose-checkboxes" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-bottom: 12px;">
                    <label style="display: flex; align-items: center; gap: 4px; font-size: 0.8rem; white-space: nowrap;"><input type="checkbox" value="paper"> 📝 논문</label>
                    <label style="display: flex; align-items: center; gap: 4px; font-size: 0.8rem; white-space: nowrap;"><input type="checkbox" value="research_plan"> 🔬 연구</label>
                    <label style="display: flex; align-items: center; gap: 4px; font-size: 0.8rem; white-space: nowrap;"><input type="checkbox" value="data_analysis"> 📊 분석</label>
                    <label style="display: flex; align-items: center; gap: 4px; font-size: 0.8rem; white-space: nowrap;"><input type="checkbox" value="irb"> 📋 IRB</label>
                    <label style="display: flex; align-items: center; gap: 4px; font-size: 0.8rem; white-space: nowrap;"><input type="checkbox" value="course_dev"> 📚 수업</label>
                    <label style="display: flex; align-items: center; gap: 4px; font-size: 0.8rem; white-space: nowrap;"><input type="checkbox" value="other"> 📌 기타</label>
                </div>
                
                <label style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 4px; display: block;">찾는 역할</label>
                <div id="role-checkboxes" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-bottom: 12px;">
                    <label style="display: flex; align-items: center; gap: 4px; font-size: 0.8rem; white-space: nowrap;"><input type="checkbox" value="coauthor"> 공동저자</label>
                    <label style="display: flex; align-items: center; gap: 4px; font-size: 0.8rem; white-space: nowrap;"><input type="checkbox" value="reviewer"> 리뷰어</label>
                    <label style="display: flex; align-items: center; gap: 4px; font-size: 0.8rem; white-space: nowrap;"><input type="checkbox" value="stats"> 통계</label>
                    <label style="display: flex; align-items: center; gap: 4px; font-size: 0.8rem; white-space: nowrap;"><input type="checkbox" value="coding"> 코딩</label>
                    <label style="display: flex; align-items: center; gap: 4px; font-size: 0.8rem; white-space: nowrap;"><input type="checkbox" value="design"> 디자인</label>
                </div>
                
                <textarea id="new-thread-desc" placeholder="프로젝트 설명, 타임라인, 산출물 등을 적어주세요..."></textarea>
                <button class="btn" id="create-thread-btn">생성하기</button>
                <button class="btn" id="cancel-thread-btn" style="background: transparent; color: var(--text-muted); border: 1px solid var(--border-color); margin-top: 8px;">취소</button>
            </div>
        `;

        document.getElementById('cancel-thread-btn')?.addEventListener('click', openCollabPopup);
        document.getElementById('create-thread-btn')?.addEventListener('click', createThread);
    }

    async function createThread() {
        if (!supabase) return;
        const title = (document.getElementById('new-thread-title') as HTMLInputElement).value;
        const desc = (document.getElementById('new-thread-desc') as HTMLTextAreaElement).value;

        // Get selected purposes
        const purposeCheckboxes = document.querySelectorAll('#purpose-checkboxes input[type="checkbox"]:checked');
        const purposes = Array.from(purposeCheckboxes).map(cb => (cb as HTMLInputElement).value);

        // Get selected roles
        const roleCheckboxes = document.querySelectorAll('#role-checkboxes input[type="checkbox"]:checked');
        const neededRoles = Array.from(roleCheckboxes).map(cb => (cb as HTMLInputElement).value);

        if (!title.trim()) {
            showToast('제목을 입력해주세요');
            return;
        }

        if (purposes.length === 0) {
            showToast('목적 유형을 선택해주세요');
            return;
        }

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { error } = await supabase.from('collaboration_threads').insert({
            title,
            description: desc || null,
            author_id: user.id,
            purposes,
            needed_roles: neededRoles
        });

        if (error) {
            showToast('생성 실패: ' + error.message);
        } else {
            showToast('✅ 협업 요청이 생성되었습니다');
            openCollabPopup();
        }
    }

    async function showThreadDetail(threadId: string) {
        if (!supabase) return;

        const [threadRes, repliesRes] = await Promise.all([
            supabase.from('collaboration_threads').select('*').eq('id', threadId).single(),
            supabase.from('collaboration_replies').select('*').eq('thread_id', threadId).order('created_at', { ascending: true })
        ]);

        const thread = threadRes.data;
        const replies = repliesRes.data || [];

        if (!thread) {
            showToast('쓰레드를 찾을 수 없습니다');
            return;
        }

        const content = document.getElementById('collab-content');
        if (!content) return;

        content.innerHTML = `
            <div style="margin-bottom: 16px;">
                <button class="btn" id="back-to-list" style="background: transparent; color: var(--text-muted); border: 1px solid var(--border-color); padding: 8px 16px;">← 목록으로</button>
            </div>
            <div class="collab-thread" style="cursor: default;">
                <div class="collab-thread-header">
                    <span class="collab-thread-title">${thread.title}</span>
                    <span class="collab-thread-status ${thread.status}">${getStatusLabel(thread.status)}</span>
                </div>
                ${thread.description ? `<div class="collab-thread-desc">${thread.description}</div>` : ''}
            </div>
            <h4 style="margin: 16px 0 8px; font-size: 0.9rem;">💬 댓글 (${replies.length})</h4>
            <div id="replies-list">
                ${replies.length > 0 ? replies.map(r => `
                    <div class="collab-reply">
                        <div class="collab-reply-author">👤 ${r.author_id.substring(0, 8)}...</div>
                        <div class="collab-reply-content">${r.content}</div>
                    </div>
                `).join('') : '<div class="collab-empty" style="padding: 20px;">아직 댓글이 없어요</div>'}
            </div>
            <div class="collab-form" style="margin-top: 16px;">
                <textarea id="reply-content" placeholder="댓글을 입력하세요..."></textarea>
                <button class="btn" id="submit-reply">댓글 작성</button>
            </div>
        `;

        document.getElementById('back-to-list')?.addEventListener('click', openCollabPopup);
        document.getElementById('submit-reply')?.addEventListener('click', () => submitReply(threadId));
    }

    async function submitReply(threadId: string) {
        if (!supabase) return;
        const content = (document.getElementById('reply-content') as HTMLTextAreaElement).value;

        if (!content.trim()) {
            showToast('댓글을 입력해주세요');
            return;
        }

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { error } = await supabase.from('collaboration_replies').insert({
            thread_id: threadId,
            author_id: user.id,
            content
        });

        if (error) {
            showToast('댓글 작성 실패: ' + error.message);
        } else {
            showToast('✅ 댓글이 작성되었습니다');
            showThreadDetail(threadId);
        }
    }

    collabBtn?.addEventListener('click', openCollabPopup);

    // ESC closes collab popup
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && document.getElementById('collab-popup-container')) {
            closeCollabPopup();
        }
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

    let searchLogTimeout: number | null = null;
    searchInput.addEventListener('input', (e) => {
        const query = (e.target as HTMLInputElement).value.toLowerCase().trim();
        updateAutocomplete(query);

        if (!query) {
            nodesDataset.update(nodes.map(n => ({ id: n.id, opacity: 1 })));
            return;
        }
        nodesDataset.update(nodes.map(n => ({ id: n.id, opacity: n.id.toLowerCase().includes(query) ? 1 : 0.08 })));

        // Debounced search logging (only log after 500ms of no typing)
        if (searchLogTimeout) clearTimeout(searchLogTimeout);
        searchLogTimeout = window.setTimeout(() => {
            logAction({ action_type: 'search', context_tag: 'network', metadata: { query } });
        }, 500);
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
        try {
            if (isClustered) {
                // Open all clusters
                const clusterIds = nodesDataset.getIds().filter((id: string) => network.isCluster(id));
                clusterIds.forEach((id: string) => {
                    try {
                        network.openCluster(id);
                    } catch {
                        // Cluster may already be open
                    }
                });
                (e.target as HTMLElement).classList.remove('active');
                showToast('클러스터 해제됨');
            } else {
                // Cluster by category
                const categoryNodes = nodes.filter(n => n.group === 'Category');
                let clustered = 0;

                categoryNodes.forEach(cat => {
                    const connectedNodes = network.getConnectedNodes(cat.id);
                    if (connectedNodes && connectedNodes.length > 0) {
                        try {
                            network.clusterByConnection(cat.id, {
                                clusterNodeProperties: {
                                    id: `cluster_${cat.id}`,
                                    label: `${cat.label}\n(${connectedNodes.length})`,
                                    shape: 'hexagon',
                                    size: 24 + Math.min(connectedNodes.length, 10),
                                    color: { background: '#8b5cf6', border: '#7c3aed' },
                                    font: { color: '#fff', size: 10, face: 'Inter, sans-serif' },
                                    borderWidth: 2
                                }
                            });
                            clustered++;
                        } catch {
                            // Skip if clustering fails for this node
                        }
                    }
                });

                (e.target as HTMLElement).classList.add('active');
                showToast(`${clustered}개 카테고리 클러스터 생성됨`);
            }

            isClustered = !isClustered;

            // Re-enable physics with stronger repulsion to spread out clusters
            network.setOptions({
                physics: {
                    enabled: true,
                    solver: 'forceAtlas2Based',
                    forceAtlas2Based: {
                        gravitationalConstant: isClustered ? -120 : -45,  // Stronger repulsion when clustered
                        centralGravity: 0.015,
                        springLength: isClustered ? 150 : 70,  // Longer springs when clustered
                        springConstant: 0.03,
                        avoidOverlap: 1
                    },
                    stabilization: { enabled: true, iterations: 150 }
                }
            });

            // Stabilize and then disable physics
            network.once('stabilizationIterationsDone', () => {
                network.setOptions({ physics: false });
                network.fit({ animation: { duration: 400 } });
            });
        } catch (err) {
            console.error('Clustering error:', err);
            showToast('클러스터 처리 중 오류 발생');
        }
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

    // Keyboard shortcuts (Enhanced for V2.0)
    // Session tracking for Decision Logs
    let decisionSessionId: string | null = null;
    try {
        decisionSessionId = crypto.randomUUID();
        console.log('[Session Started]', decisionSessionId);
    } catch { /* Browser doesn't support crypto.randomUUID */ }

    // ========================================================================
    // IN-APP ANNOUNCEMENT SYSTEM
    // ========================================================================
    async function checkForAnnouncements() {
        if (!supabase) return;

        // Get last seen announcement timestamp from localStorage
        const lastSeen = localStorage.getItem('lastAnnouncementSeen') || '1970-01-01';

        // Check for announcements newer than last seen
        const { data: announcements, error } = await supabase
            .from('announcement_logs')
            .select('id, subject, body, sent_at')
            .gt('sent_at', lastSeen)
            .order('sent_at', { ascending: false })
            .limit(1);

        if (error || !announcements?.length) return;

        const announcement = announcements[0];
        showAnnouncementPopup(announcement);
    }

    function showAnnouncementPopup(announcement: { id: string; subject: string; body: string; sent_at: string }) {
        // Remove existing popup
        document.getElementById('announcement-popup')?.remove();

        const popup = document.createElement('div');
        popup.id = 'announcement-popup';
        popup.innerHTML = `
            <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.7); z-index: 10000; display: flex; align-items: center; justify-content: center;">
                <div style="background: var(--klse-navy-light); border: 1px solid var(--klse-yellow); border-radius: 16px; max-width: 500px; width: 90%; padding: 24px; box-shadow: 0 20px 60px rgba(0,0,0,0.5);">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                        <span style="font-size: 1.1rem; font-weight: 600; color: var(--klse-yellow);">📢 공지사항</span>
                        <button id="close-announcement" style="background: none; border: none; color: var(--text-muted); font-size: 1.5rem; cursor: pointer;">×</button>
                    </div>
                    <h3 style="font-size: 1rem; margin-bottom: 12px; color: var(--text-primary);">${announcement.subject}</h3>
                    <p style="font-size: 0.9rem; color: var(--text-secondary); line-height: 1.6; white-space: pre-wrap;">${announcement.body}</p>
                    <div style="margin-top: 20px; display: flex; justify-content: flex-end;">
                        <button id="dismiss-announcement" class="btn" style="padding: 10px 20px;">확인</button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(popup);

        const dismiss = () => {
            localStorage.setItem('lastAnnouncementSeen', announcement.sent_at);
            popup.remove();
        };

        document.getElementById('close-announcement')?.addEventListener('click', dismiss);
        document.getElementById('dismiss-announcement')?.addEventListener('click', dismiss);
    }

    // Check for announcements on load
    checkForAnnouncements();

    document.addEventListener('keydown', (e) => {
        // Search focus
        if (e.key === '/' && document.activeElement !== searchInput) {
            e.preventDefault();
            searchInput.focus();
        }

        // Escape - close everything
        if (e.key === 'Escape') {
            hideSidebar();
            hideModal('about-modal');
            searchInput.blur();
            currentNodeId = null;
        }

        // Fullscreen toggle
        if ((e.key === 'f' || e.key === 'F') && document.activeElement !== searchInput) {
            toggleFullscreen();
        }

        // Arrow key navigation (NEW for V2.0)
        if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key) &&
            document.activeElement !== searchInput) {
            e.preventDefault();
            navigateToConnectedNode(e.key);
        }

        // C key - toggle comparison mode
        if ((e.key === 'c' || e.key === 'C') && document.activeElement !== searchInput) {
            toggleComparisonMode();
        }

        // Enter - expand selected node details
        if (e.key === 'Enter' && document.activeElement !== searchInput && currentNodeId) {
            showSidebar();
        }
    });

    // Navigate to connected node using arrow keys
    function navigateToConnectedNode(key: string) {
        const selectedNodes = network.getSelectedNodes();
        if (selectedNodes.length === 0) {
            // No selection - select first visible node
            const visibleNodes = nodesDataset.getIds().filter((id: string) => {
                const node = nodesDataset.get(id);
                return node && !node.hidden && node.group !== 'Category';
            });
            if (visibleNodes.length > 0) {
                network.selectNodes([visibleNodes[0]]);
                network.focus(visibleNodes[0], { scale: 1.5, animation: { duration: 300 } });
                handleNodeClick(visibleNodes[0]);
            }
            return;
        }

        const currentId = selectedNodes[0] as string;
        const connectedNodes = network.getConnectedNodes(currentId) as string[];

        if (connectedNodes.length === 0) return;

        // Get positions for directional navigation
        const currentPos = network.getPosition(currentId);
        let bestNode: string | null = null;
        let bestScore = -Infinity;

        connectedNodes.forEach((nodeId: string) => {
            const pos = network.getPosition(nodeId);
            const dx = pos.x - currentPos.x;
            const dy = pos.y - currentPos.y;

            let score = 0;
            switch (key) {
                case 'ArrowRight': score = dx; break;
                case 'ArrowLeft': score = -dx; break;
                case 'ArrowDown': score = dy; break;
                case 'ArrowUp': score = -dy; break;
            }

            if (score > bestScore && score > 0) {
                bestScore = score;
                bestNode = nodeId;
            }
        });

        // Fallback to first connected if no directional match
        if (!bestNode && connectedNodes.length > 0) {
            bestNode = connectedNodes[0];
        }

        if (bestNode) {
            network.selectNodes([bestNode]);
            network.focus(bestNode, { scale: 1.5, animation: { duration: 300 } });
            handleNodeClick(bestNode);
            showToast(`${key.replace('Arrow', '')} → ${(nodesDataset.get(bestNode) as any)?.label || bestNode}`);
        }
    }
}

main();