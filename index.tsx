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
    { name: "Journal of Computer Assisted Learning", type: "Journal", categories: ["Technology-Enhanced Learning"], impact: "Q1" },
    { name: "Journal of Educational Computing Research", type: "Journal", categories: ["Technology-Enhanced Learning"], impact: "Q1" },
    { name: "IEEE Transactions on Learning Technologies", type: "Journal", categories: ["Technology-Enhanced Learning", "Immersive Technology"], impact: "Q1" },
    { name: "International Journal of Artificial Intelligence in Education", type: "Journal", categories: ["AIED"], impact: "Q1" },
    { name: "User Modeling and User-Adapted Interaction", type: "Journal", categories: ["AIED"], impact: "Q1" },
    { name: "Journal of Learning Analytics", type: "Journal", categories: ["Learning Analytics"], impact: "Q2" },
    { name: "Instructional Science", type: "Journal", categories: ["Learning Sciences"], impact: "Q1" },
    { name: "Contemporary Educational Psychology", type: "Journal", categories: ["Educational Psychology"], impact: "Q1" },
    { name: "Learning and Individual Differences", type: "Journal", categories: ["Educational Psychology"], impact: "Q1" },
    { name: "Mind Culture and Activity", type: "Journal", categories: ["Learning Sciences"], impact: "Q2" },
    { name: "Educational Research Review", type: "Journal", categories: ["Education Research"], impact: "Q1" },
    { name: "Computers in Human Behavior", type: "Journal", categories: ["Human-Computer Interaction"], impact: "Q1" },
    { name: "Interactive Learning Environments", type: "Journal", categories: ["Technology-Enhanced Learning"], impact: "Q1" },
    { name: "Distance Education", type: "Journal", categories: ["Online Learning"], impact: "Q1" },
    { name: "Internet and Higher Education", type: "Journal", categories: ["Higher Education", "Online Learning"], impact: "Q1" },

    // Q3 Journals
    { name: "Computers & Education: Artificial Intelligence", type: "Journal", categories: ["AIED"], impact: "Q3" },
    { name: "Journal of Applied Instructional Design", type: "Journal", categories: ["Instructional Design"], impact: "Q3" },
    { name: "Journal of Formative Design in Learning", type: "Journal", categories: ["Instructional Design"], impact: "Q3" },
    { name: "International Journal of Designs for Learning", type: "Journal", categories: ["Instructional Design"], impact: "Q3" },
    { name: "TechTrends", type: "Journal", categories: ["Instructional Design"], impact: "Q3" },
    { name: "Performance Improvement Quarterly", type: "Journal", categories: ["Instructional Design"], impact: "Q3" },
    { name: "Educational Technology & Society", type: "Journal", categories: ["Technology-Enhanced Learning"], impact: "Q1" },
    { name: "Education and Information Technologies", type: "Journal", categories: ["Technology-Enhanced Learning"], impact: "Q1" },
    { name: "International Journal of Educational Technology in Higher Education", type: "Journal", categories: ["Higher Education"], impact: "Q1" },
    { name: "Journal of Computing in Higher Education", type: "Journal", categories: ["Higher Education"], impact: "Q1" },
    { name: "Online Learning Journal", type: "Journal", categories: ["Online Learning"], impact: "Q1" },
    { name: "International Review of Research in Open and Distributed Learning", type: "Journal", categories: ["Online Learning"], impact: "Q3" },
    { name: "International Journal of Human-Computer Interaction", type: "Journal", categories: ["Human-Computer Interaction"], impact: "Q1" },
    { name: "Human-Computer Interaction", type: "Journal", categories: ["Human-Computer Interaction"], impact: "Q1" },
    { name: "ACM Transactions on Computer-Human Interaction", type: "Journal", categories: ["Human-Computer Interaction"], impact: "Q1" },
    { name: "Behaviour & Information Technology", type: "Journal", categories: ["Human-Computer Interaction"], impact: "Q3" },
    { name: "International Journal of Child-Computer Interaction", type: "Journal", categories: ["Human-Computer Interaction"], impact: "Q3" },
    { name: "Simulation & Gaming", type: "Journal", categories: ["Immersive Technology"], impact: "Q3" },
    { name: "Virtual Reality", type: "Journal", categories: ["Immersive Technology"], impact: "Q3" },
    { name: "Computers & Education: X Reality", type: "Journal", categories: ["Immersive Technology"], impact: "Q3" },
    { name: "Learning Media and Technology", type: "Journal", categories: ["Critical Perspectives"], impact: "Q1" },

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

    // Add category-to-category edges for closely related research areas
    const categoryLinks: Array<{ from: string; to: string }> = [
        { from: 'Learning Analytics', to: 'AIED' },
        { from: 'AIED', to: 'Human-Computer Interaction' },
        { from: 'Learning Sciences', to: 'Educational Psychology' },
    ];

    for (const link of categoryLinks) {
        if (categorySet.has(link.from) && categorySet.has(link.to)) {
            edges.push({
                from: link.from,
                to: link.to,
                dashes: true  // Distinct style for category-to-category links
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

    // === Shift+Drag: Move connected nodes together ===
    let shiftDragNodeId: string | null = null;
    let shiftDragStartPositions: Map<string, { x: number; y: number }> = new Map();
    let shiftDragConnectedNodes: string[] = [];
    let lastDragPosition: { x: number; y: number } | null = null;

    network.on('dragStart', (params: { nodes: string[]; event: { srcEvent: MouseEvent } }) => {
        if (params.nodes.length === 1 && params.event.srcEvent.shiftKey) {
            shiftDragNodeId = params.nodes[0];

            // Get all connected nodes (direct neighbors)
            const connectedEdges = network.getConnectedEdges(shiftDragNodeId);
            const connectedNodeSet = new Set<string>();

            connectedEdges.forEach((edgeId: string) => {
                const edge = edgesDataset.get(edgeId);
                if (edge) {
                    if (edge.from !== shiftDragNodeId) connectedNodeSet.add(edge.from as string);
                    if (edge.to !== shiftDragNodeId) connectedNodeSet.add(edge.to as string);
                }
            });

            shiftDragConnectedNodes = Array.from(connectedNodeSet);

            // Store initial positions of all connected nodes
            const allNodeIds = [shiftDragNodeId, ...shiftDragConnectedNodes];
            const positions = network.getPositions(allNodeIds);

            shiftDragStartPositions.clear();
            allNodeIds.forEach(id => {
                if (positions[id]) {
                    shiftDragStartPositions.set(id, { x: positions[id].x, y: positions[id].y });
                }
            });

            lastDragPosition = positions[shiftDragNodeId];
        }
    });

    network.on('dragging', (params: { nodes: string[]; event: { srcEvent: MouseEvent } }) => {
        if (shiftDragNodeId && params.nodes.includes(shiftDragNodeId) && params.event.srcEvent.shiftKey) {
            const currentPosition = network.getPositions([shiftDragNodeId])[shiftDragNodeId];

            if (lastDragPosition && currentPosition) {
                const deltaX = currentPosition.x - lastDragPosition.x;
                const deltaY = currentPosition.y - lastDragPosition.y;

                // Move all connected nodes by the same delta
                shiftDragConnectedNodes.forEach(nodeId => {
                    const nodePos = network.getPositions([nodeId])[nodeId];
                    if (nodePos) {
                        network.moveNode(nodeId, nodePos.x + deltaX, nodePos.y + deltaY);
                    }
                });

                lastDragPosition = currentPosition;
            }
        }
    });

    network.on('dragEnd', () => {
        shiftDragNodeId = null;
        shiftDragConnectedNodes = [];
        shiftDragStartPositions.clear();
        lastDragPosition = null;
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

    // ========================================================================
    // RESEARCH TOPICS POPUP
    // ========================================================================

    interface ResearchTopic {
        id: string;
        name: string;
        category: string;
        description: string;
        details?: string;
        keyResearchers?: string[];
        relatedTopics?: string[];
    }

    // ISLS Research Topics data (49 topics)
    const ISLS_TOPICS: ResearchTopic[] = [
        {
            id: "cscl-in-times-of-crisis", name: "CSCL in Times of Crisis", category: "CSCL",
            description: "위기 상황에서의 컴퓨터 지원 협력 학습",
            details: "이 주제는 팬데믹, 자연재해, 사회적 위기 상황에서 CSCL이 어떻게 학습 연속성을 지원하는지 탐구합니다. 원격 협력 도구의 효과성, 사회정서적 지원, 디지털 격차 해소 전략, 비동기/동기 학습의 균형 등을 다룹니다. COVID-19 팬데믹은 이 분야 연구를 크게 촉진시켰습니다.",
            keyResearchers: ["Stahl, G.", "Law, N.", "Järvelä, S."],
            relatedTopics: ["group-cognition", "learning-with-technology", "shared-regulation-cscl"]
        },
        {
            id: "analysis-of-discourse-data", name: "Analysis of Discourse Data", category: "Methodologies",
            description: "담화 데이터 분석 방법론",
            details: "담화 분석은 학습 대화, 토론, 글쓰기에서 의미 구성 과정을 탐구합니다. 대화 분석(CA), 비판적 담화 분석(CDA), 통계적 담화 분석, 다층 담화 분석 등 다양한 접근법이 있습니다. 협력 학습의 과정을 이해하는 핵심 방법론입니다.",
            keyResearchers: ["Gee, J.P.", "Mercer, N.", "Resnick, L."],
            relatedTopics: ["quantitative-ethnography", "conversation-analysis-ethnomethodological-approaches"]
        },
        {
            id: "argumentation-and-learning-in-cscl",
            name: "Argumentation and Learning in CSCL",
            category: "CSCL",
            description: "CSCL에서의 논증과 학습: 논쟁을 통한 학습",
            details: `논증 학습(Argumentation Learning)은 학생들이 논증적 담화에 참여함으로써 깊은 이해와 비판적 사고를 발달시키는 과정입니다.

**두 가지 접근:**
• 논쟁하기를 배우기(Learning to Argue): 논증 능력 자체를 향상시키는 것
• 논쟁을 통해 배우기(Arguing to Learn): 논증을 통해 내용 지식과 이해를 심화

**핵심 개념:**
• 대화적 공간(Dialogical Space): 경쟁이 아닌 협력적 탐구로서의 논증
• 근거 기반 주장(Claim-Evidence-Reasoning): 주장, 근거, 추론의 체계적 구조
• 숙의적 대화(Deliberative Dialogue): 합의 지향적 토론이 경쟁적 토론보다 학습에 효과적

**CSCL 도구와 스캐폴딩:**
• 시각적 논증 맵(Argument Maps)
• 대화 버튼과 문장 스타터(Sentence Starters)
• AI 지원 피드백 시스템
• Toulmin 모델 기반 구조화

**주요 연구자 기여:**
• Andriessen: 논쟁에서 배우기 프레임워크, 스캐폴딩 필요성 강조
• Baker: 학습 메커니즘 규명 (지식 명시화, 개념 변화)
• Asterhan: 숙의적 vs 논쟁적 대화의 학습 효과 비교`,
            keyResearchers: ["Andriessen, Jerry (위트레흐트대)", "Baker, Michael (CNRS/Telecom Paris)", "Asterhan, Christa (히브리대)", "Clark, Douglas"],
            relatedTopics: ["epistemic-cognition", "knowledge-building", "cscl-conceptual-change", "analysis-of-discourse-data"]
        },
        {
            id: "assessment", name: "Assessment", category: "Methodologies",
            description: "학습 평가 방법론",
            details: "학습과학에서의 평가는 전통적 시험을 넘어 형성평가, 포트폴리오 평가, 임베디드 평가, 동료 평가, 자기 평가 등 다양한 접근을 포함합니다. 학습을 위한 평가(AfL)와 학습으로서의 평가가 강조되며, 테크놀로지 기반 적응적 평가도 발전하고 있습니다.",
            keyResearchers: ["Black, P.", "Wiliam, D.", "Shepard, L."],
            relatedTopics: ["feedback-in-learning", "learning-analytics"]
        },
        {
            id: "augmented-reality-learning-sciences", name: "Augmented Reality in Learning", category: "Technology",
            description: "학습에서의 증강현실",
            details: "증강현실(AR)은 실제 환경에 디지털 정보를 오버레이하여 학습을 지원합니다. 과학 시뮬레이션, 역사 현장 학습, 의료 훈련, 언어 학습 등에서 맥락화된 학습 경험을 제공합니다. 공간적 이해와 체화된 학습을 촉진합니다.",
            keyResearchers: ["Dede, C.", "Dunleavy, M.", "Klopfer, E."],
            relatedTopics: ["embodiment-and-embodied-design", "learning-with-technology"]
        },
        {
            id: "automated-argumentation-analysis", name: "Automated Argumentation Analysis", category: "Methodologies",
            description: "자동화된 논증 분석",
            details: "자연어처리(NLP)와 기계학습을 활용하여 학생들의 논증을 자동으로 분석합니다. 논증 구조 추출, 논증 품질 평가, 실시간 피드백 제공 등이 연구됩니다. 대규모 담화 분석과 적시 피드백을 가능하게 합니다.",
            keyResearchers: ["Pinkwart, N.", "McLaren, B.", "Rosé, C."],
            relatedTopics: ["argumentation-and-learning-in-cscl", "learning-analytics"]
        },
        {
            id: "automated-collaborative-process-analysis", name: "Automated Collaborative Process Analysis", category: "Methodologies",
            description: "자동화된 협력 과정 분석",
            details: "협력 학습의 상호작용 패턴을 자동으로 감지하고 분석합니다. 사회적 네트워크 분석, 시퀀스 마이닝, 프로세스 마이닝 등의 기법을 사용하여 조절, 참여 패턴, 지식 구축 과정을 추적합니다.",
            keyResearchers: ["Reimann, P.", "Wise, A.", "Cress, U."],
            relatedTopics: ["learning-analytics", "group-awareness-tools", "quantitative-ethnography"]
        },
        {
            id: "classroom-orchestration", name: "Classroom Orchestration", category: "Practice",
            description: "테크놀로지 기반 교실 오케스트레이션",
            details: "교실 오케스트레이션은 교사가 테크놀로지 기반 학습 활동을 실시간으로 조정하고 관리하는 복잡한 과정입니다. 스크립팅, 모니터링 도구, 대시보드, 유연성과 구조의 균형이 핵심입니다. 1:1 컴퓨팅 환경에서 특히 중요합니다.",
            keyResearchers: ["Dillenbourg, P.", "Prieto, L.P.", "Roschelle, J."],
            relatedTopics: ["learning-with-technology", "group-awareness-tools", "technology-and-teacher-learning"]
        },
        {
            id: "cognition-and-metacognition", name: "Cognition and Metacognition", category: "Learning Sciences",
            description: "인지와 메타인지 과정",
            details: "학습에서의 인지 과정(주의, 지각, 기억, 추론)과 메타인지(인지에 대한 인식과 조절)를 탐구합니다. 학습 전략의 효과성, 메타인지 훈련, 자기조절학습과의 연결이 주요 주제입니다.",
            keyResearchers: ["Flavell, J.", "Brown, A.", "Schunk, D."],
            relatedTopics: ["self-regulated-learning", "metacognition-science"]
        },
        {
            id: "cognitive-apprenticeship", name: "Cognitive Apprenticeship", category: "Learning Sciences",
            description: "인지적 도제 학습",
            details: "전통적 도제의 원리(모델링, 코칭, 스캐폴딩, 페이딩)를 인지적 기술 습득에 적용합니다. 전문가 사고의 명시화, 상황적 학습, 정통 과제가 핵심입니다. 읽기, 쓰기, 수학 교육에 적용됩니다.",
            keyResearchers: ["Collins, A.", "Brown, J.S.", "Newman, S."],
            relatedTopics: ["situative-cognition", "distributed-scaffolding"]
        },
        {
            id: "cognitive-tutors", name: "Cognitive Tutors", category: "Technology",
            description: "인지 모델 기반 지능형 튜터링",
            details: "학습자의 인지 상태를 ACT-R 이론에 기반하여 모델링하고 개인화된 피드백을 제공하는 지능형 튜터링 시스템입니다. Carnegie Learning의 수학 튜터가 대표적이며, 대규모 효과성이 입증되었습니다.",
            keyResearchers: ["Anderson, J.R.", "Koedinger, K.", "Aleven, V."],
            relatedTopics: ["feedback-in-learning", "learning-analytics"]
        },
        {
            id: "collaboration-scripts-for-cscl", name: "Collaboration Scripts", category: "CSCL",
            description: "CSCL을 위한 협력 스크립트",
            details: "협력 스크립트는 학습자 간 상호작용을 구조화하여 생산적 협력을 유도합니다. Jigsaw, MURDER, ArgueGraph 등 다양한 유형이 있습니다. 과도한 구조화의 부작용(스크립트 역설)도 연구됩니다.",
            keyResearchers: ["Fischer, F.", "Kollar, I.", "Weinberger, A."],
            relatedTopics: ["group-cognition", "shared-regulation-cscl", "argumentation-and-learning-in-cscl"]
        },
        {
            id: "communities-of-learners", name: "Communities of Learners", category: "Learning Sciences",
            description: "학습자 공동체",
            details: "지식 공유, 상호 지원, 집단적 성장을 추구하는 학습자 집단입니다. Brown과 Campione의 FCL(Fostering Communities of Learners), Wenger의 실천 공동체(CoP) 등의 모델이 있습니다.",
            keyResearchers: ["Brown, A.", "Campione, J.", "Wenger, E."],
            relatedTopics: ["knowledge-building", "situative-cognition"]
        },
        {
            id: "complexity-and-the-learning-sciences", name: "Complexity and Learning Sciences", category: "Learning Sciences",
            description: "복잡계 이론과 학습과학",
            details: "복잡계 이론을 학습에 적용하여 창발, 자기조직화, 비선형 역학을 탐구합니다. 학습을 개인, 사회, 물질적 요소의 동적 상호작용으로 이해합니다. 에이전트 기반 모델링도 활용됩니다.",
            keyResearchers: ["Jacobson, M.", "Kauffman, S.", "Davis, B."],
            relatedTopics: ["distributed-intelligence", "systems-thinking"]
        },
        {
            id: "conversation-analysis-ethnomethodological-approaches", name: "Conversation Analysis", category: "Methodologies",
            description: "민족지학적 대화 분석",
            details: "Garfinkel과 Sacks의 민족지학적 방법론을 학습 맥락에 적용합니다. 턴테이킹, 수리(repair), 순차 조직 등 대화의 미시적 구조를 분석하여 학습이 상호작용에서 어떻게 구성되는지 탐구합니다.",
            keyResearchers: ["Sacks, H.", "Schegloff, E.", "Koschmann, T."],
            relatedTopics: ["analysis-of-discourse-data", "situative-cognition"]
        },
        {
            id: "creating-supporting-design-teams", name: "Supporting Design Teams", category: "Practice",
            description: "설계 팀 지원",
            details: "교육 혁신을 위한 협력적 설계 과정을 지원합니다. 교사, 연구자, 디자이너 간 파트너십, 공동 설계(co-design), 참여적 설계 등이 포함됩니다. 설계기반연구의 실천적 측면입니다.",
            keyResearchers: ["Penuel, W.", "Fishman, B.", "Coburn, C."],
            relatedTopics: ["design-design-based-research", "technology-and-teacher-learning"]
        },
        {
            id: "cscl-conceptual-change", name: "CSCL and Conceptual Change", category: "CSCL",
            description: "CSCL을 통한 개념 변화",
            details: "협력적 논의, 인지 갈등, 동료 설명을 통해 학습자가 기존의 오개념을 과학적 개념으로 재구성하는 과정입니다. 사회구성주의적 관점에서 개념 변화를 이해합니다.",
            keyResearchers: ["Vosniadou, S.", "Sinatra, G.", "Chi, M."],
            relatedTopics: ["argumentation-and-learning-in-cscl", "prior-knowledge"]
        },
        {
            id: "cscl-and-disabilities", name: "CSCL and Disabilities", category: "CSCL",
            description: "장애와 CSCL",
            details: "다양한 능력의 학습자가 협력 학습에 참여할 수 있도록 접근성, 보편적 설계, 보조 기술을 연구합니다. 인지적, 감각적, 운동적 장애에 대한 포용적 CSCL 환경 설계를 탐구합니다.",
            keyResearchers: ["Cook, A.M.", "Buzhardt, J.", "Stahl, G."],
            relatedTopics: ["learning-with-technology", "group-awareness-tools"]
        },
        {
            id: "data-science-education", name: "Data Science Education", category: "Technology",
            description: "데이터 과학 교육",
            details: "데이터 리터러시, 통계적 사고, 컴퓨팅 사고를 통합한 데이터 과학 교육을 탐구합니다. K-12 및 고등교육에서 데이터 분석, 시각화, 추론 능력 개발이 주요 주제입니다.",
            keyResearchers: ["Finzer, W.", "Lee, V.", "Engel, J."],
            relatedTopics: ["learning-with-technology", "computational-thinking"]
        },
        {
            id: "design-design-based-research",
            name: "Design-Based Research",
            category: "Methodologies",
            description: "설계기반연구(DBR): 반복적 설계와 이론 개발",
            details: `설계기반연구(Design-Based Research, DBR)는 교육 이론 검증과 학습 환경 개선을 동시에 추구하는 방법론입니다.

**핵심 특징:**
• 반복적 설계(Iterative Design): 설계 → 실행 → 분석 → 수정의 지속적 순환
• 자연스러운 교육 맥락에서 연구 수행
• 이론 개발과 실천 개선의 이중 목표
• '설계 실험(Design Experiments)'이라고도 불림

**추측 매핑(Conjecture Mapping):**
Sandoval(2014)이 제안한 도구로 설계 가정을 명시화:
• 구체화(Embodiments): 특정 설계 요소들
• 매개 과정(Mediating Processes): 예상되는 학습 메커니즘
• 학습 결과(Learning Outcomes): 목표하는 성과
• 설계 원리(Design Principles): 반복 사이클에서 도출되는 일반화 가능한 원칙

**DBR 프로세스:**
• 1단계: 문제 분석 및 초기 설계
• 2단계: 실행 및 데이터 수집
• 3단계: 분석 및 설계 수정
• 4단계: 반복 및 이론 정교화

**강점과 한계:**
• 강점: 생태학적 타당성, 실천적 유용성, 복잡성 포착
• 한계: 일반화 어려움, 시간 집약적, 연구자 개입의 편향 가능성`,
            keyResearchers: ["Barab, Sasha (아리조나주립대)", "Cobb, Paul (밴더빌트대)", "Sandoval, William (UCLA)", "DBR Collective"],
            relatedTopics: ["design-based-implementation-research", "creating-supporting-design-teams", "learning-environments"]
        },
        {
            id: "design-based-implementation-research", name: "Design-Based Implementation Research", category: "Methodologies",
            description: "설계기반실행연구(DBIR)",
            details: "DBR을 확장하여 혁신의 지속가능한 실행과 확산에 초점을 맞춥니다. 연구자-실천가 파트너십, 조직적 맥락, 정책 연계를 강조합니다.",
            keyResearchers: ["Penuel, W.", "Fishman, B.", "Sabelli, N."],
            relatedTopics: ["design-design-based-research", "technology-and-teacher-learning"]
        },
        {
            id: "distributed-intelligence", name: "Distributed Intelligence", category: "Learning Sciences",
            description: "분산 지능",
            details: "지능이 개인 내부에만 있는 것이 아니라 도구, 타인, 환경에 분산되어 있다는 관점입니다. 계산기, 노트, 협력자 등이 인지 시스템의 일부로 기능합니다. Hutchins의 분산 인지가 핵심입니다.",
            keyResearchers: ["Hutchins, E.", "Pea, R.", "Salomon, G."],
            relatedTopics: ["situative-cognition", "group-cognition"]
        },
        {
            id: "distributed-scaffolding", name: "Distributed Scaffolding", category: "Learning Sciences",
            description: "분산 스캐폴딩",
            details: "학습 지원이 교사, 동료, 도구, 과제 구조 등 여러 원천에서 제공됨을 인식합니다. 다중 원천 간 조정, 점진적 철수(fading), 상호보완적 지원 설계가 중요합니다.",
            keyResearchers: ["Tabak, I.", "Reiser, B.", "Puntambekar, S."],
            relatedTopics: ["cognitive-apprenticeship", "learning-with-technology"]
        },
        {
            id: "embodiment-and-embodied-design", name: "Embodiment and Embodied Design", category: "Learning Sciences",
            description: "체화된 인지와 설계",
            details: "신체 경험이 개념 이해에 근본적 역할을 한다는 관점입니다. 제스처, 움직임, 물리적 조작이 수학, 과학 학습을 지원합니다. 체화된 설계는 이를 테크놀로지 기반 학습에 적용합니다.",
            keyResearchers: ["Abrahamson, D.", "Nathan, M.", "Alibali, M."],
            relatedTopics: ["gestures-learning-teaching", "augmented-reality-learning-sciences"]
        },
        {
            id: "epistemic-cognition", name: "Epistemic Cognition", category: "Learning Sciences",
            description: "인식론적 인지",
            details: "지식의 본질, 정당화, 원천에 대한 신념과 사고입니다. 인식론적 발달, 영역 특수적 vs 일반적 인식론, 과학적 인식론이 연구됩니다. 비판적 사고와 과학 교육에 중요합니다.",
            keyResearchers: ["Hofer, B.", "Chinn, C.", "Greene, J."],
            relatedTopics: ["argumentation-and-learning-in-cscl", "knowledge-building"]
        },
        {
            id: "example-based-learning", name: "Example-Based Learning", category: "Learning Sciences",
            description: "예제 기반 학습",
            details: "전문가의 문제 해결 과정을 단계별로 보여줌으로써 학습자의 인지 부하를 줄이는 접근입니다. 자기설명 촉진, 페이딩, 오류 예제 등이 효과를 높입니다. 수학, 과학, 프로그래밍 교육에서 널리 사용됩니다.",
            keyResearchers: ["Renkl, A.", "Atkinson, R.", "Sweller, J."],
            relatedTopics: ["cognitive-load-theory", "worked-examples"]
        },
        {
            id: "foundations-of-the-learning-sciences", name: "Foundations of Learning Sciences", category: "Learning Sciences",
            description: "학습과학의 기초",
            details: "학습과학의 이론적 토대로 인지과학, 교육심리학, 인공지능, 인류학의 통합을 다룹니다. 구성주의, 상황적 학습, 사회문화적 이론이 핵심 패러다임입니다.",
            keyResearchers: ["Sawyer, R.K.", "Bransford, J.", "Nathan, M."],
            relatedTopics: ["situative-cognition", "design-design-based-research"]
        },
        {
            id: "gestures-learning-teaching", name: "Gestures in Learning", category: "Learning Sciences",
            description: "학습에서의 제스처",
            details: "제스처가 수학적 사고, 과학적 추론, 언어 학습을 어떻게 지원하는지 탐구합니다. 제스처-언어 불일치는 학습 준비 상태를 나타내며, 교사 제스처가 학생 이해에 영향을 미칩니다.",
            keyResearchers: ["Alibali, M.", "Goldin-Meadow, S.", "Nathan, M."],
            relatedTopics: ["embodiment-and-embodied-design", "representational-learning"]
        },
        {
            id: "group-awareness-tools", name: "Group Awareness Tools", category: "CSCL",
            description: "그룹 인식 도구",
            details: "협력 학습에서 동료의 활동, 지식 상태, 참여도 등을 시각화합니다. 참여 미터, 지식 인식 도구, 조정 도구 등이 조정과 공평한 참여를 촉진합니다.",
            keyResearchers: ["Janssen, J.", "Bodemer, D.", "Buder, J."],
            relatedTopics: ["group-cognition", "shared-regulation-cscl", "learning-analytics"]
        },
        {
            id: "group-cognition", name: "Group Cognition", category: "CSCL",
            description: "집단 인지",
            details: "개인 인지의 단순 합이 아닌 그룹 수준에서 창발하는 인지 과정입니다. 공유된 의미 구성, 상호주관성, 대화적 지식 구축이 핵심 개념입니다. Stahl의 VMT 연구가 대표적입니다.",
            keyResearchers: ["Stahl, G.", "Suthers, D.", "Roschelle, J."],
            relatedTopics: ["knowledge-building", "distributed-intelligence", "collaboration-scripts-for-cscl"]
        },
        {
            id: "information-problem-solving", name: "Information Problem Solving", category: "Learning Sciences",
            description: "정보 문제 해결",
            details: "디지털 환경에서 정보를 검색, 평가, 통합, 사용하는 능력입니다. 정보 리터러시, 비판적 평가, 출처 신뢰도 판단 등이 포함됩니다. 인터넷 시대의 핵심 역량입니다.",
            keyResearchers: ["Brand-Gruwel, S.", "Stadtler, M.", "Rouet, J.F."],
            relatedTopics: ["epistemic-cognition", "data-science-education"]
        },
        {
            id: "inquiry-learning-knowledge-integration", name: "Inquiry and Knowledge Integration", category: "Learning Sciences",
            description: "탐구 학습과 지식 통합",
            details: "학생이 질문, 조사, 증거 수집, 설명 구성을 통해 학습합니다. Linn의 WISE 프로젝트가 대표적이며, 다양한 아이디어를 연결하여 일관된 이해를 구축합니다.",
            keyResearchers: ["Linn, M.", "Songer, N.", "Krajcik, J."],
            relatedTopics: ["learning-through-problem-solving", "learning-with-technology"]
        },
        {
            id: "interactional-ethnography-and-problem-based-learning", name: "Interactional Ethnography and PBL", category: "Methodologies",
            description: "상호작용 민족지학과 PBL",
            details: "민족지학적 방법론을 문제기반학습(PBL) 연구에 적용합니다. 학습의 사회문화적 맥락, 참여 구조, 정체성 형성을 탐구합니다. 장기간 현장 관찰이 특징입니다.",
            keyResearchers: ["Green, J.", "Castanheira, M.", "Hmelo-Silver, C."],
            relatedTopics: ["conversation-analysis-ethnomethodological-approaches", "communities-of-learners"]
        },
        {
            id: "knowledge-building",
            name: "Knowledge Building",
            category: "CSCL",
            description: "지식 구축: 집단적 아이디어 개선과 지식 창출",
            details: `지식 구축(Knowledge Building)은 Marlene Scardamalia와 Carl Bereiter가 1990년대 초 개발한 교육 접근법으로, 학습자들이 과학자처럼 집단적으로 새로운 지식을 창출하는 과정입니다.

**핵심 개념:**
• 아이디어는 '개념적 인공물(conceptual artifacts)'로서 지속적으로 개선될 수 있음
• 집단 인지적 책임(Collective Cognitive Responsibility): 공동체 지식 발전에 대한 공유된 책임감
• 인식적 주체성(Epistemic Agency): 학습자가 지식 창출 과정의 주체로 참여

**Knowledge Forum (플랫폼):**
• 1980년대 CSILE(Computer Supported Intentional Learning Environments)로 시작
• 아이디어 공유, 연결, 재구성, 통합을 지원하는 비동기 온라인 환경
• 시각적 논증 맵과 대화 버튼으로 성찰적 토론 촉진

**12가지 지식 구축 원칙:**
• 실제 아이디어와 진정한 문제
• 개선 가능한 아이디어
• 아이디어 다양성
• 위에서 올라가기(Rise Above)
• 인식적 주체성
• 공동체 지식과 집단 책임

**'논쟁에서 배우기'와의 차이:** 지식 구축은 승패가 아닌 공동 지식 발전에 초점`,
            keyResearchers: ["Scardamalia, Marlene (토론토대 OISE)", "Bereiter, Carl (토론토대)", "Zhang, Jianwei (뉴욕주립대 알바니)"],
            relatedTopics: ["epistemic-cognition", "group-cognition", "communities-of-learners", "argumentation-and-learning-in-cscl"]
        },
        {
            id: "knowledge-creation", name: "Knowledge Creation", category: "Learning Sciences",
            description: "지식 창조",
            details: "기존 지식의 습득을 넘어 새로운 아이디어와 지식을 생성하는 과정입니다. Nonaka의 SECI 모델, 트리어로기적(Trialogical) 학습 접근이 있습니다.",
            keyResearchers: ["Nonaka, I.", "Paavola, S.", "Hakkarainen, K."],
            relatedTopics: ["knowledge-building", "communities-of-learners"]
        },
        {
            id: "learning-in-the-disciplines", name: "Learning in the Disciplines", category: "Learning Sciences",
            description: "학문 분야별 학습",
            details: "수학, 과학, 역사, 문학 등 각 분야의 고유한 인식론, 실천, 추론 방식을 탐구합니다. 분야 전문가처럼 생각하고 실천하는 법을 학습합니다.",
            keyResearchers: ["Wineburg, S.", "Lehrer, R.", "Sfard, A."],
            relatedTopics: ["epistemic-cognition", "inquiry-learning-knowledge-integration"]
        },
        {
            id: "learning-progressions-in-science-education", name: "Learning Progressions", category: "Learning Sciences",
            description: "과학 교육의 학습 진행",
            details: "학생들이 시간에 따라 핵심 과학 개념을 어떻게 발달시키는지 경험적으로 근거한 경로를 기술합니다. 교육과정 설계와 평가 개발에 활용됩니다.",
            keyResearchers: ["Corcoran, T.", "Duncan, R.G.", "Lehrer, R."],
            relatedTopics: ["assessment", "cscl-conceptual-change"]
        },
        {
            id: "learning-through-problem-solving", name: "Learning Through Problem Solving", category: "Learning Sciences",
            description: "문제 해결을 통한 학습",
            details: "문제기반학습(PBL), 프로젝트기반학습 등 실제적 문제를 통해 학습합니다. 맥락화된 학습, 자기주도성, 협력이 강조됩니다. 의학 교육에서 시작되어 확산되었습니다.",
            keyResearchers: ["Barrows, H.", "Hmelo-Silver, C.", "Schmidt, H."],
            relatedTopics: ["inquiry-learning-knowledge-integration", "productive-failure"]
        },
        {
            id: "learning-with-technology", name: "Learning with Technology", category: "Technology",
            description: "테크놀로지 기반 학습",
            details: "디지털 도구가 학습을 어떻게 지원하고 변형하는지 탐구합니다. TPACK(기술교수내용지식), SAMR 모델 등이 프레임워크로 사용됩니다. 도구가 학습을 어떻게 매개하는지가 핵심입니다.",
            keyResearchers: ["Mishra, P.", "Koehler, M.", "Jonassen, D."],
            relatedTopics: ["distributed-scaffolding", "augmented-reality-learning-sciences"]
        },
        {
            id: "learning-by-design", name: "Learning by Design", category: "Learning Sciences",
            description: "설계를 통한 학습",
            details: "학습자가 인공물(artifact)을 설계하고 만드는 과정에서 학습합니다. 공학 설계, 게임 만들기, 로봇 프로그래밍 등이 포함됩니다. Papert의 구성주의(Constructionism)가 이론적 토대입니다.",
            keyResearchers: ["Kolodner, J.", "Papert, S.", "Kafai, Y."],
            relatedTopics: ["inquiry-learning-knowledge-integration", "embodiment-and-embodied-design"]
        },
        {
            id: "multilevel-analysis", name: "Multilevel Analysis", category: "Methodologies",
            description: "다층 분석",
            details: "학생이 교실에, 교실이 학교에 내포된 위계적 데이터 구조를 모델링합니다. HLM(Hierarchical Linear Modeling)을 통해 개인, 그룹, 조직 수준의 효과를 분리할 수 있습니다.",
            keyResearchers: ["Raudenbush, S.", "Bryk, A.", "Snijders, T."],
            relatedTopics: ["analysis-of-discourse-data", "learning-analytics"]
        },
        {
            id: "neurocognitive-foundations-learning-sciences", name: "Neurocognitive Foundations", category: "Learning Sciences",
            description: "신경인지과학적 기초",
            details: "뇌과학 연구를 학습에 적용합니다. 가소성, 기억 공고화, 주의, 정서와 학습의 연결이 탐구됩니다. 신경신화(neuromyth) 비판과 증거기반 적용이 중요합니다.",
            keyResearchers: ["Howard-Jones, P.", "Ansari, D.", "Goswami, U."],
            relatedTopics: ["memory-and-learning", "emotion-and-learning"]
        },
        {
            id: "quantitative-ethnography", name: "Quantitative Ethnography", category: "Methodologies",
            description: "양적 민족지학",
            details: "ENA(Epistemic Network Analysis) 등을 통해 담화와 상호작용의 패턴을 정량화합니다. 빅데이터와 민족지학적 심층 분석을 결합하여 의미 있는 패턴을 발견합니다.",
            keyResearchers: ["Shaffer, D.W.", "Ruis, A.", "Siebert-Evenstone, A."],
            relatedTopics: ["analysis-of-discourse-data", "learning-analytics"]
        },
        {
            id: "representational-learning", name: "Representational Learning", category: "Learning Sciences",
            description: "표상을 통한 학습",
            details: "그래프, 다이어그램, 시뮬레이션 등 다양한 표상을 통한 학습을 탐구합니다. 다중 표상의 연결, 표상 능력 발달, 표상 도구 설계가 주요 주제입니다.",
            keyResearchers: ["Ainsworth, S.", "diSessa, A.", "Kozma, R."],
            relatedTopics: ["multimedia-learning", "visualization"]
        },
        {
            id: "shared-regulation-cscl", name: "Shared Regulation", category: "CSCL",
            description: "공유 조절",
            details: "그룹 구성원이 함께 목표를 설정하고, 진행을 모니터링하며, 전략을 조정하는 과정입니다. 자기조절, 공동조절, 사회적으로 공유된 조절이 구분됩니다.",
            keyResearchers: ["Järvelä, S.", "Hadwin, A.", "Malmberg, J."],
            relatedTopics: ["self-regulated-learning", "group-awareness-tools"]
        },
        {
            id: "massively-open-online-courses-moocs", name: "MOOCs", category: "Technology",
            description: "대규모 공개 온라인 강좌",
            details: "대규모 개방형 온라인 강좌로, 접근성, 확장성, 유연성을 제공합니다. 완료율, 학습자 참여, 동료 학습, 적응형 학습의 통합이 연구 주제입니다.",
            keyResearchers: ["Reich, J.", "Kizilcec, R.", "Dillahunt, T."],
            relatedTopics: ["learning-with-technology", "learning-analytics"]
        },
        {
            id: "situative-cognition", name: "Situated Cognition", category: "Learning Sciences",
            description: "상황 인지",
            details: "지식이 맥락에 놓여 있고 활동과 문화에서 분리될 수 없다는 관점입니다. 정통 과제, 실천 공동체, 학교와 실세계의 연결이 강조됩니다. 전이 문제의 핵심 관점입니다.",
            keyResearchers: ["Brown, J.S.", "Lave, J.", "Greeno, J."],
            relatedTopics: ["cognitive-apprenticeship", "communities-of-learners", "transfer-of-learning"]
        },
        {
            id: "statistical-discourse-analysis", name: "Statistical Discourse Analysis", category: "Methodologies",
            description: "통계적 담화 분석",
            details: "대규모 담화 데이터에 통계적 방법을 적용합니다. 자동 코딩, 주제 모델링, 시퀀스 분석 등을 통해 패턴을 발견합니다. 질적 분석과 양적 분석의 통합입니다.",
            keyResearchers: ["Rose, C.", "Chiu, M.", "Wise, A."],
            relatedTopics: ["analysis-of-discourse-data", "learning-analytics"]
        },
        {
            id: "technology-and-teacher-learning", name: "Technology and Teacher Learning", category: "Practice",
            description: "테크놀로지와 교사 학습",
            details: "교사가 테크놀로지를 학습하고 교수에 통합하는 과정을 탐구합니다. 온라인 전문성 개발, 비디오 기반 반성, 교사 학습 공동체가 효과적 접근법입니다.",
            keyResearchers: ["Ball, D.", "Borko, H.", "Fishman, B."],
            relatedTopics: ["classroom-orchestration", "design-based-implementation-research"]
        },
        // === Science of Learning (Cognitive Science perspective) ===
        {
            id: "cognitive-load-theory",
            name: "Cognitive Load Theory",
            category: "Science of Learning",
            description: "인지 부하 이론: 작업기억 용량과 학습 설계",
            details: `인지 부하 이론(CLT)은 1980년대 후반 호주의 교육심리학자 John Sweller가 개발한 이론으로, 인간 작업기억의 제한된 용량이 학습에 미치는 영향을 설명합니다.

**세 가지 인지 부하 유형:**
• 내재적 부하(Intrinsic Load): 학습 내용 자체의 고유한 복잡성. 요소 간 상호작용(element interactivity)이 높을수록 증가. 학습자의 사전 지식 수준에 따라 달라짐.
• 외재적 부하(Extraneous Load): 불필요한 교수 설계로 인해 발생하는 부하. 분리 주의 효과(split-attention), 중복 효과(redundancy) 등. 최소화가 목표.
• 본유적 부하(Germane Load): 스키마 구성과 자동화에 투입되는 '생산적' 부하. 학습과 장기기억 전이에 직접 기여.

**핵심 교수 설계 원칙:**
• 예제 기반 학습(Worked Examples): 초보자에게 완전한 해결 과정을 제시하여 인지 부하 감소
• 분절화(Segmenting): 복잡한 내용을 작은 단위로 나누어 순차 제시
• 사전훈련(Pre-training): 핵심 개념을 먼저 학습시켜 내재적 부하 감소
• 통합 형식(Integrated Format): 관련 정보를 공간/시간적으로 가깝게 배치하여 분리 주의 효과 방지
• 모달리티 원칙: 시각(다이어그램) + 청각(설명)을 결합하여 작업기억 용량 확장

**전문성 역전 효과(Expertise Reversal Effect):**
초보자에게 효과적인 교수법이 전문가에게는 오히려 방해가 될 수 있음. 학습자 수준에 맞는 적응적 교수 설계 필요.

**메타분석 결과:** Sweller et al.(2019)의 종합 연구에서 CLT 기반 교수 설계가 전통적 방법 대비 효과 크기 d=0.71로 유의미한 학습 향상을 보임.`,
            keyResearchers: ["Sweller, John (호주 뉴사우스웨일스대)", "Paas, Fred (네덜란드 에라스무스대)", "van Merriënboer, Jeroen (네덜란드 마스트리히트대)", "Kalyuga, Slava (호주)"],
            relatedTopics: ["multimedia-learning", "worked-examples", "example-based-learning", "expertise-development"]
        },
        {
            id: "retrieval-practice",
            name: "Retrieval Practice",
            category: "Science of Learning",
            description: "인출 연습: 테스트 효과와 능동적 기억 인출",
            details: `인출 연습(Retrieval Practice)은 정보를 단순히 다시 읽는 것보다 기억에서 능동적으로 인출하는 것이 장기 파지에 훨씬 효과적이라는 '테스트 효과(Testing Effect)'에 기반합니다.

**핵심 메커니즘:**
• 기억 흔적 강화: 인출 시도 자체가 신경 연결을 강화하여 기억을 더 접근 가능하게 만듦
• 기억 공고화 촉진: 인출은 해마 의존성을 줄이고 장기기억으로 통합
• 지식 격차 파악: 무엇을 모르는지 인식하여 학습 초점 조정 가능
• 메타인지 향상: 자기 이해 수준에 대한 정확한 판단력 발달

**효과적인 구현 방법:**
• 플래시카드와 자기 테스트
• 저위험 퀴즈(low-stakes quiz)
• 쓰면서 암기하기(brain dump)
• 교차 연습(interleaving)과 결합

**연구 결과:** Roediger & Karpicke(2006)의 실험에서 반복 학습 집단보다 인출 연습 집단이 일주일 후 50% 이상 더 많은 정보를 기억함.`,
            keyResearchers: ["Roediger, Henry (미국 워싱턴대 세인트루이스)", "Karpicke, Jeffrey (미국 퍼듀대)", "Butler, Andrew (미국 워싱턴대)"],
            relatedTopics: ["spaced-practice", "desirable-difficulties", "interleaving"]
        },
        {
            id: "spaced-practice",
            name: "Spaced Practice",
            category: "Science of Learning",
            description: "분산 연습: 간격 효과와 망각 곡선",
            details: `분산 연습(Spaced Practice)은 학습을 시간에 걸쳐 분산할 때 집중 연습(cramming)보다 장기 파지가 명확히 우수하다는 '간격 효과(Spacing Effect)'에 기반합니다.

**이론적 기초 - Ebbinghaus 망각 곡선:**
• 1885년 독일 심리학자 Ebbinghaus가 발견
• 새 정보의 약 70%가 24시간 내 망각
• 전략적 복습으로 망각 속도를 크게 늦출 수 있음

**왜 효과적인가:**
• 기억 공고화: 간격이 뇌의 기억 통합 시간을 허용
• 인출 노력 증가: 어느 정도 망각 후 인출 시 더 강한 기억 흔적 형성
• 인코딩 변산성: 다른 맥락에서 학습 시 다양한 인출 단서 형성

**최적 간격 설계:**
• 파지 기간의 10-20%가 최적 간격 (예: 1주일 시험 → 1-2일 간격)
• 간격 확장(expanding interval): 점진적으로 간격을 늘려가기
• Anki, SuperMemo 등 간격 반복 소프트웨어 활용

**효과 크기:** 메타분석에서 d=0.42~0.79로 중간-큰 효과 확인됨.`,
            keyResearchers: ["Cepeda, Nicholas (요크대)", "Pashler, Harold (UCSD)", "Dunlosky, John (켄트주립대)", "Ebbinghaus, Hermann (선구자)"],
            relatedTopics: ["retrieval-practice", "desirable-difficulties", "forgetting-curve"]
        },
        {
            id: "multimedia-learning",
            name: "Multimedia Learning",
            category: "Science of Learning",
            description: "멀티미디어 학습 이론: 이중 채널과 인지 부하 관리",
            details: `Richard Mayer의 멀티미디어 학습 이론(CTML)은 텍스트와 이미지를 함께 사용할 때 학습이 향상된다는 연구 기반 프레임워크입니다.

**세 가지 핵심 가정:**
• 이중 채널(Dual Channel): 시각과 청각 정보가 별도 채널에서 처리됨
• 제한된 용량(Limited Capacity): 각 채널은 동시에 처리할 수 있는 정보량에 한계가 있음
• 능동적 처리(Active Processing): 학습자가 정보를 선택, 조직, 통합해야 함

**핵심 멀티미디어 원칙:**
• 모달리티 원칙: 그래픽+음성 설명이 그래픽+텍스트보다 효과적
• 인접성 원칙: 관련 단어와 그림을 시공간적으로 가깝게 배치
• 중복성 원칙: 애니메이션+나래이션+동일 텍스트는 피하기
• 분절화 원칙: 복잡한 내용을 학습자 속도 조절이 가능한 세그먼트로
• 신호화 원칙: 핵심 요소를 강조하기 위한 신호 제공

**설계 지침:**
• 장식용 이미지는 인지 부하만 증가시키므로 피하기
• 1인칭 대화체 나래이션이 형식적 문체보다 효과적
• 전문가에게는 초보자와 다른 설계가 필요(전문성 역전 효과)`,
            keyResearchers: ["Mayer, Richard E. (UC 산타바바라)", "Moreno, Roxana", "Paivio, Allan (이중 부호화 이론)"],
            relatedTopics: ["cognitive-load-theory", "dual-coding", "representational-learning"]
        },
        {
            id: "self-regulated-learning",
            name: "Self-Regulated Learning",
            category: "Science of Learning",
            description: "자기조절학습: 학습의 자기주도적 통제",
            details: `자기조절학습(SRL)은 학습자가 목표 설정, 전략 선택, 진행 모니터링, 반성을 통해 자신의 학습을 주도적으로 관리하는 과정입니다.

**Zimmerman의 순환 모형 (3단계):**
• 사전숙고(Forethought): 과제 분석, 목표 설정, 전략 계획, 동기적 신념 활성화
• 수행(Performance): 과제 실행, 자기 모니터링, 자기 통제 전략 사용
• 자기성찰(Self-Reflection): 수행 평가, 귀인, 향후 전략 조정

**Pintrich의 4단계 모형:**
• 계획 및 활성화 → 모니터링 → 통제 → 반응 및 성찰
• 인지, 동기/정서, 행동, 맥락의 4개 영역에서 조절

**Winne & Hadwin의 정보처리 모형:**
• 과제 정의 → 목표 설정/계획 → 전략 실행 → 적응
• 메타인지적 모니터링과 피드백 강조

**핵심 요소:**
• 메타인지: 자신의 사고과정에 대한 인식과 조절
• 목표 설정: SMART 목표(구체적, 측정가능, 달성가능, 관련성, 시간제한)
• 자기 모니터링: 진행 상황 지속적 점검
• 귀인: 성공/실패 원인에 대한 해석

**교육적 시사점:** SRL은 가르칠 수 있으며, 명시적 전략 교수와 메타인지 프롬프트가 효과적.`,
            keyResearchers: ["Zimmerman, Barry J. (CUNY)", "Pintrich, Paul (미시간대)", "Winne, Philip (사이먼 프레이저대)", "Hadwin, Allyson"],
            relatedTopics: ["metacognition-science", "motivation-and-learning", "feedback-in-learning"]
        },
        {
            id: "metacognition-science", name: "Metacognition", category: "Science of Learning",
            description: "Thinking about thinking",
            details: "메타인지는 자신의 인지 과정에 대한 인식과 조절입니다. Flavell이 도입한 이 개념은 메타인지적 지식(과제, 전략, 자기 인식)과 메타인지적 기술(계획, 모니터링, 평가)로 구성됩니다. 학습 성과와 강한 상관관계가 있습니다.",
            keyResearchers: ["Flavell, J.", "Schraw, G.", "Veenman, M."],
            relatedTopics: ["self-regulated-learning", "calibration"]
        },
        {
            id: "desirable-difficulties",
            name: "Desirable Difficulties",
            category: "Science of Learning",
            description: "바람직한 어려움: 학습을 강화하는 도전",
            details: `Robert Bjork가 제안한 '바람직한 어려움(Desirable Difficulties)'은 학습 중 수행을 일시적으로 어렵게 만들지만, 장기 파지와 전이를 크게 향상시키는 조건들입니다.

**왜 '바람직한' 어려움인가:**
• 더 깊은 인코딩: 노력이 필요한 인출이 기억 흔적을 강화
• 더 다양한 인코딩: 여러 맥락에서 학습하면 유연한 지식 형성
• 유창성 환상 방지: 쉬운 학습이 과잉 자신감을 유발하는 것을 방지

**주요 바람직한 어려움들:**
• 간격 연습(Spacing): 집중 연습보다 분산 연습
• 인출 연습(Retrieval): 재학습보다 기억에서 인출
• 교차 연습(Interleaving): 블록 연습보다 유형을 섞어 연습
• 생성 효과(Generation): 정보를 주어지기보다 스스로 생성
• 맥락 변산성(Contextual variability): 다양한 조건에서 연습

**중요한 경계 조건:**
• 학습자에게 너무 어려우면 '바람직하지 않은 어려움'이 됨
• 기초 지식이 부족하면 효과 없음
• 난이도가 학습자 수준에 맞아야 함

**실용적 적용:** 시험 전 벼락치기보다 여러 날에 걸쳐 자기 테스트하며 공부하기.`,
            keyResearchers: ["Bjork, Robert A. (UCLA)", "Bjork, Elizabeth L. (UCLA)", "Soderstrom, Nicholas", "Roediger, Henry"],
            relatedTopics: ["retrieval-practice", "spaced-practice", "interleaving", "generation-effect"]
        },
        {
            id: "interleaving", name: "Interleaving", category: "Science of Learning",
            description: "Mixing different topics or problems",
            details: "교차 연습은 유사한 주제나 문제 유형을 섞어서 학습하는 것이 블록 연습보다 장기적으로 효과적임을 보여줍니다. 변별 학습과 인출 연습이 결합되어 학습이 향상됩니다.",
            keyResearchers: ["Rohrer, D.", "Bjork, R."],
            relatedTopics: ["spaced-practice", "desirable-difficulties"]
        },
        {
            id: "transfer-of-learning", name: "Transfer of Learning", category: "Science of Learning",
            description: "Applying knowledge to new situations",
            details: "학습 전이는 한 상황에서 학습한 것을 새로운 상황에 적용하는 것입니다. 근전이(near transfer)와 원전이(far transfer)가 구분되며, 추상화, 다양한 예시, 유추적 사고가 전이를 촉진합니다.",
            keyResearchers: ["Barnett, S.", "Ceci, S.", "Bransford, J."],
            relatedTopics: ["prior-knowledge", "analogical-reasoning"]
        },
        {
            id: "motivation-and-learning", name: "Motivation and Learning", category: "Science of Learning",
            description: "How motivation drives learning",
            details: "동기는 학습의 시작, 방향, 강도, 지속성을 결정합니다. 자기결정이론(SDT), 기대-가치 이론, 목표 지향성, 자기효능감 등이 핵심 개념입니다. 내재적 동기가 깊은 학습과 연결됩니다.",
            keyResearchers: ["Deci, E.", "Ryan, R.", "Eccles, J.", "Wigfield, A."],
            relatedTopics: ["self-regulated-learning", "emotion-and-learning"]
        },
        {
            id: "feedback-in-learning", name: "Feedback in Learning", category: "Science of Learning",
            description: "How feedback influences learning",
            details: "Hattie의 메타분석에서 피드백은 가장 효과적인 교육 개입 중 하나로 나타났습니다. 피드백 유형(과제 vs 과정 vs 자기조절), 타이밍, 복잡성, 학습자 수용 등이 효과에 영향을 미칩니다.",
            keyResearchers: ["Hattie, J.", "Shute, V.", "Kluger, A."],
            relatedTopics: ["formative-assessment", "self-regulated-learning"]
        },
        {
            id: "worked-examples", name: "Worked Examples", category: "Science of Learning",
            description: "Learning from step-by-step solutions",
            details: "예제 기반 학습은 전문가의 문제 해결 과정을 단계별로 보여줌으로써 학습자의 인지 부하를 줄입니다. 페이딩(fading), 자기설명 촉진, 오류 예제 등이 효과를 높입니다.",
            keyResearchers: ["Renkl, A.", "Atkinson, R.", "Sweller, J."],
            relatedTopics: ["cognitive-load-theory", "self-explanation"]
        },
        {
            id: "prior-knowledge", name: "Prior Knowledge Effects", category: "Science of Learning",
            description: "Role of existing knowledge",
            details: "사전 지식은 새로운 학습의 가장 강력한 예측 변인 중 하나입니다. 스키마 이론, 전문성 역전 효과, 오개념의 역할 등이 연구됩니다. '학습자가 이미 알고 있는 것을 파악하고, 그에 맞게 가르치라'는 Ausubel의 원칙이 적용됩니다.",
            keyResearchers: ["Dochy, F.", "Alexander, P.", "Chi, M."],
            relatedTopics: ["conceptual-change", "expertise-development"]
        },
        {
            id: "productive-failure", name: "Productive Failure", category: "Science of Learning",
            description: "Learning from initial failure",
            details: "Kapur가 제안한 생산적 실패는 직접 교수 전에 학습자가 먼저 문제를 탐색하도록 하여 깊은 이해를 촉진합니다. 실패 경험이 활성화 지식(activation knowledge)을 생성하여 후속 교수의 효과를 높입니다.",
            keyResearchers: ["Kapur, M.", "Bielaczyc, K."],
            relatedTopics: ["problem-solving", "desirable-difficulties"]
        },
        {
            id: "dual-coding", name: "Dual Coding Theory", category: "Science of Learning",
            description: "Learning through verbal and visual",
            details: "Paivio의 이중 부호화 이론은 정보가 언어적, 비언어적(이미지) 채널로 처리되며, 두 채널을 함께 사용하면 기억이 향상된다고 주장합니다. 멀티미디어 학습, 시각화, 마인드맵 등에 적용됩니다.",
            keyResearchers: ["Paivio, A."],
            relatedTopics: ["multimedia-learning"]
        }
    ];

    const TOPIC_CATEGORY_COLORS: Record<string, string> = {
        'CSCL': '#10b981',
        'Learning Sciences': '#7ba0cc',
        'Methodologies': '#f59e0b',
        'Technology': '#8b5cf6',
        'Practice': '#ef4444',
        'Science of Learning': '#ec4899'
    };

    const TOPIC_CATEGORY_ICONS: Record<string, string> = {
        'CSCL': '🤝',
        'Learning Sciences': '🧠',
        'Methodologies': '📊',
        'Technology': '💻',
        'Practice': '🎯',
        'Science of Learning': '🔬'
    };

    let currentTopicFilter = 'All';
    let currentTopicSearch = '';
    let selectedTopic: ResearchTopic | null = null;

    function getFilteredTopics(): ResearchTopic[] {
        let filtered = ISLS_TOPICS;
        if (currentTopicFilter !== 'All') {
            filtered = filtered.filter(t => t.category === currentTopicFilter);
        }
        if (currentTopicSearch.trim()) {
            const q = currentTopicSearch.toLowerCase();
            filtered = filtered.filter(t =>
                t.name.toLowerCase().includes(q) ||
                t.description.toLowerCase().includes(q)
            );
        }
        return filtered;
    }

    function renderTopicCard(topic: ResearchTopic): string {
        const color = TOPIC_CATEGORY_COLORS[topic.category] || '#64748b';
        const icon = TOPIC_CATEGORY_ICONS[topic.category] || '📌';
        return `
            <div class="topic-card" data-topic-id="${topic.id}">
                <div class="topic-header">
                    <span class="topic-icon">${icon}</span>
                    <span class="topic-category" style="color: ${color}">${topic.category}</span>
                </div>
                <h3 class="topic-name">${topic.name}</h3>
                <p class="topic-description">${topic.description}</p>
            </div>
        `;
    }

    function renderTopicsGrid(topics: ResearchTopic[]): string {
        if (topics.length === 0) {
            return '<div class="topics-empty"><p>검색 결과가 없습니다</p></div>';
        }
        return `<div class="topics-grid">${topics.map(renderTopicCard).join('')}</div>`;
    }

    // Simple markdown to HTML converter for topic details
    function formatTopicDetails(text: string): string {
        if (!text) return '';

        // Split by double newlines to get sections
        const sections = text.split(/\n\n+/);

        return sections.map(section => {
            const trimmed = section.trim();

            // Check if it's a header (starts with **)
            if (trimmed.startsWith('**') && trimmed.includes(':**')) {
                const headerMatch = trimmed.match(/^\*\*(.+?):\*\*\s*([\s\S]*)/);
                if (headerMatch) {
                    const title = headerMatch[1];
                    const content = headerMatch[2];
                    // Check if content has bullet points
                    if (content.includes('•')) {
                        const bullets = content.split('•').filter(b => b.trim());
                        const bulletHtml = bullets.map(b => `<li>${b.trim()}</li>`).join('');
                        return `<div class="detail-section"><h5>${title}</h5><ul>${bulletHtml}</ul></div>`;
                    }
                    return `<div class="detail-section"><h5>${title}</h5><p>${content}</p></div>`;
                }
            }

            // Handle lines with bullets
            if (trimmed.includes('•')) {
                const bullets = trimmed.split('•').filter(b => b.trim());
                const bulletHtml = bullets.map(b => {
                    // Convert **text** to <strong>text</strong>
                    const formatted = b.trim().replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
                    return `<li>${formatted}</li>`;
                }).join('');
                return `<ul class="detail-bullets">${bulletHtml}</ul>`;
            }

            // Regular paragraph - convert **text** to <strong>
            const formatted = trimmed.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
            return `<p>${formatted}</p>`;
        }).join('');
    }

    function renderTopicDetail(topic: ResearchTopic): string {
        const color = TOPIC_CATEGORY_COLORS[topic.category] || '#64748b';
        const icon = TOPIC_CATEGORY_ICONS[topic.category] || '📌';
        const details = topic.details || topic.description;
        const formattedDetails = formatTopicDetails(details);

        // Format researchers as individual badges
        const researcherBadges = topic.keyResearchers?.map(r =>
            `<span class="researcher-badge">${r}</span>`
        ).join('') || '<span style="color: var(--text-muted);">연구자 정보 없음</span>';

        const related = topic.relatedTopics?.map(id => {
            const t = ISLS_TOPICS.find(rt => rt.id === id);
            return t ? `<span class="related-topic-chip" data-topic-id="${id}">${t.name}</span>` : '';
        }).filter(Boolean).join('') || '<span style="color: var(--text-muted);">관련 주제 없음</span>';

        return `
            <div class="topic-detail-view">
                <button class="topic-back-btn" id="topic-back">← 목록으로</button>
                <div class="topic-detail-header">
                    <span class="topic-icon-large">${icon}</span>
                    <div>
                        <span class="topic-category-badge" style="background: ${color}20; color: ${color}">${topic.category}</span>
                        <h2 class="topic-detail-name">${topic.name}</h2>
                    </div>
                </div>
                <p class="topic-detail-summary">${topic.description}</p>
                <div class="topic-detail-content">
                    <h4>📖 상세 설명</h4>
                    <div class="detail-formatted">${formattedDetails}</div>
                </div>
                <div class="topic-detail-researchers">
                    <h4>👤 주요 연구자</h4>
                    <div class="researchers-container">${researcherBadges}</div>
                </div>
                <div class="topic-detail-related">
                    <h4>🔗 관련 주제</h4>
                    <div class="related-topics-container">${related}</div>
                </div>
                <div class="topic-detail-link">
                    <a href="https://www.isls.org/research-topics/${topic.id}" target="_blank" rel="noopener noreferrer" class="isls-link-btn">
                        🌐 ISLS 위키에서 더 보기
                    </a>
                </div>
            </div>
        `;
    }



    function showTopicDetail(topicId: string) {
        const topic = ISLS_TOPICS.find(t => t.id === topicId);
        if (!topic) return;

        selectedTopic = topic;
        const grid = document.getElementById('topics-grid');
        if (grid) {
            grid.innerHTML = renderTopicDetail(topic);

            // Back button
            document.getElementById('topic-back')?.addEventListener('click', () => {
                selectedTopic = null;
                updateTopicsGridUI();
            });

            // Related topic clicks
            grid.querySelectorAll('.related-topic-chip').forEach(chip => {
                chip.addEventListener('click', (e) => {
                    const id = (e.target as HTMLElement).getAttribute('data-topic-id');
                    if (id) showTopicDetail(id);
                });
            });
        }

        logAction({ action_type: 'topic_detail_view', context_tag: 'research-topics', metadata: { topicId } });
    }

    function openResearchTopicsPopup() {
        closeResearchTopicsPopup();

        const categories = [...new Set(ISLS_TOPICS.map(t => t.category))].sort();
        const topics = getFilteredTopics();

        const popup = document.createElement('div');
        popup.id = 'research-topics-popup-container';
        popup.innerHTML = `
        <div class="research-topics-overlay visible" id="research-topics-modal">
            <div class="research-topics-content">
                <div class="modal-header">
                    <div class="modal-title">
                        <h2>🔬 Research Topics</h2>
                        <p class="modal-subtitle">연구 주제 탐색 (${ISLS_TOPICS.length}개)</p>
                    </div>
                    <button class="sidebar-close" id="close-research-topics">✕</button>
                </div>

                <div class="modal-controls">
                    <div class="search-box-large">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.35-4.35" />
                        </svg>
                        <input type="text" id="topics-search" placeholder="연구 주제 검색...">
                    </div>

                    <div class="category-filter">
                        <button class="filter-chip ${currentTopicFilter === 'All' ? 'active' : ''}" data-category="All">
                            All (${ISLS_TOPICS.length})
                        </button>
                        ${categories.map(cat => `
                                <button class="filter-chip ${currentTopicFilter === cat ? 'active' : ''}" data-category="${cat}">
                                    ${TOPIC_CATEGORY_ICONS[cat] || '📌'} ${cat}
                                </button>
                            `).join('')}
                    </div>
                </div>

                <div class="modal-body" id="topics-grid">
                    ${renderTopicsGrid(topics)}
                </div>
            </div>
        </div>
        `;
        document.body.appendChild(popup);

        // Event: Close button
        document.getElementById('close-research-topics')?.addEventListener('click', closeResearchTopicsPopup);

        // Event: Overlay click
        document.getElementById('research-topics-modal')?.addEventListener('click', (e) => {
            if ((e.target as HTMLElement).id === 'research-topics-modal') {
                closeResearchTopicsPopup();
            }
        });

        // Event: Search
        const searchInput = document.getElementById('topics-search') as HTMLInputElement;
        searchInput?.addEventListener('input', () => {
            currentTopicSearch = searchInput.value;
            updateTopicsGridUI();
        });

        // Event: Filter chips
        popup.querySelectorAll('.filter-chip').forEach(chip => {
            chip.addEventListener('click', (e) => {
                const cat = (e.target as HTMLElement).getAttribute('data-category') || 'All';
                currentTopicFilter = cat;
                popup.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
                (e.target as HTMLElement).classList.add('active');
                updateTopicsGridUI();
            });
        });

        // Event: Topic card click - show detail view
        popup.addEventListener('click', (e) => {
            const card = (e.target as HTMLElement).closest('.topic-card');
            if (card) {
                const topicId = card.getAttribute('data-topic-id');
                if (topicId) {
                    showTopicDetail(topicId);
                }
            }
        });

        logAction({ action_type: 'popup_open', context_tag: 'research-topics' });
    }

    function updateTopicsGridUI() {
        const grid = document.getElementById('topics-grid');
        if (grid) {
            if (selectedTopic) {
                grid.innerHTML = renderTopicDetail(selectedTopic);
                // Re-bind detail view event handlers
                document.getElementById('topic-back')?.addEventListener('click', () => {
                    selectedTopic = null;
                    updateTopicsGridUI();
                });
                grid.querySelectorAll('.related-topic-chip').forEach(chip => {
                    chip.addEventListener('click', (e) => {
                        const id = (e.target as HTMLElement).getAttribute('data-topic-id');
                        if (id) showTopicDetail(id);
                    });
                });
            } else {
                const filtered = getFilteredTopics();
                grid.innerHTML = renderTopicsGrid(filtered);
            }
        }
    }

    function closeResearchTopicsPopup() {
        currentTopicFilter = 'All';
        currentTopicSearch = '';
        selectedTopic = null;
        document.getElementById('research-topics-popup-container')?.remove();
    }

    const researchTopicsBtn = document.getElementById('research-topics-btn');
    researchTopicsBtn?.addEventListener('click', openResearchTopicsPopup);

    // ESC closes research topics popup
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && document.getElementById('research-topics-popup-container')) {
            closeResearchTopicsPopup();
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
            return `< div class="search-autocomplete-item" data - id="${n.id}" >
        <span class="type-badge ${typeClass}">${typeLabel}</span>
                ${n.id}
            </div > `;
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
                                    id: `cluster_${cat.id} `,
                                    label: `${cat.label} \n(${connectedNodes.length})`,
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
        < div class="favorite-item" data - venue="${fav}" >
                    <span class="favorite-name">${fav}</span>
                    <button class="remove-fav" data-id="${fav}">✕</button>
                </div >
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
        < div class="my-annotation-item" data - id="${a.id}" >
                    <div class="my-annotation-venue">${a.venue_name}</div>
                    <div class="my-annotation-comment">${a.comment}</div>
                    <div class="my-annotation-meta">
                        <span style="color: var(--color-accent); font-size: 0.7rem;">${'★'.repeat(a.rating)}${'☆'.repeat(5 - a.rating)}</span>
                        <div class="my-annotation-actions">
                            <button class="delete" data-id="${a.id}">삭제</button>
                        </div>
                    </div>
                </div >
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
        < div style = "position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.7); z-index: 10000; display: flex; align-items: center; justify-content: center;" >
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
            </div >
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
            showToast(`${key.replace('Arrow', '')} → ${(nodesDataset.get(bestNode) as any)?.label || bestNode} `);
        }
    }
}

main();