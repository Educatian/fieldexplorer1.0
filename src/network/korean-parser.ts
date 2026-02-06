/**
 * Korean Network Parser
 * Radial layout based on KSET identity survey (Jung et al., 2025)
 * 
 * Operationalization:
 * - M (mean distance) → radius via power transform
 * - Cluster k=3 → color coding
 * - State transitions → university/field/tenure groups
 */

import koreanNodesData from '../data/korean_nodes.json';
import koreanLinksData from '../data/korean_links.json';

// ============================================================================
// TYPES
// ============================================================================

export type KoreanNetworkState = 'overall' | 'university' | 'field' | 't0_1y' | 't1_5y' | 't5_10y' | 't10y_plus';

export interface KoreanNode {
    id: string;
    label: string;
    type: 'center' | 'journal' | 'discipline';
    cluster_k3: number;
    fixed?: boolean;
    M?: {
        overall: number;
        university?: number;
        field?: number;
        t0_1y?: number;
        t1_5y?: number;
        t5_10y?: number;
        t10y_plus?: number;
    };
}

export interface KoreanLink {
    source: string;
    target: string;
}

export interface KoreanNetworkNode {
    id: string;
    label: string;
    x: number;
    y: number;
    fixed: boolean;
    size: number;
    color: string;
    font: { color: string };
    borderWidth: number;
    borderWidthSelected: number;
    cluster: number;
    M_current: number;
}

export interface KoreanNetworkEdge {
    from: string;
    to: string;
    color: { color: string; opacity: number };
    width: number;
    dashes?: boolean;
    type?: 'distance' | 'similarity';
}

export interface KoreanNetworkData {
    nodes: KoreanNetworkNode[];
    edges: KoreanNetworkEdge[];
    centerX: number;
    centerY: number;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const R_MIN = 120;   // Increased from 80 for more space
const R_MAX = 550;   // Increased from 420 for wider spread
const GAMMA = 1.6;  // Power transform for central clustering emphasis


const M_MIN = 1;
const M_MAX_JOURNAL = 5;
// const M_MAX_DISCIPLINE = 6;  // For future discipline nodes

const CLUSTER_COLORS: Record<number, string> = {
    3: '#2dd4bf',  // Core (teal)
    2: '#60a5fa',  // Mid (blue)
    1: '#94a3b8'   // Peripheral (slate)
};

const CENTER_COLOR = '#f5a623';  // KSET accent gold

// ============================================================================
// COORDINATE CALCULATIONS
// ============================================================================

/**
 * Convert M distance to radial coordinate
 * r = R_MIN + ((M - 1) / (M_MAX - 1))^γ * (R_MAX - R_MIN)
 */
function calculateRadius(M: number, isJournal: boolean = true): number {
    const mMax = isJournal ? M_MAX_JOURNAL : 6;
    const normalized = (M - M_MIN) / (mMax - M_MIN);
    const powered = Math.pow(normalized, GAMMA);
    return R_MIN + powered * (R_MAX - R_MIN);
}

/**
 * Generate stable angle from node ID hash
 * This ensures angle stays consistent across state transitions
 */
function calculateAngle(nodeId: string, index: number, total: number): number {
    // Simple hash-based seed for reproducibility
    let hash = 0;
    for (let i = 0; i < nodeId.length; i++) {
        hash = ((hash << 5) - hash) + nodeId.charCodeAt(i);
        hash = hash & hash;
    }

    // Distribute angles evenly with hash-based offset
    const baseAngle = (index / total) * 2 * Math.PI;
    const offset = (Math.abs(hash) % 100) / 100 * (Math.PI / total);

    return baseAngle + offset;
}

/**
 * Get M value for current state, with fallback to overall
 */
function getMForState(node: KoreanNode, state: KoreanNetworkState): number {
    if (!node.M) return 0;  // Center node

    const stateValue = node.M[state as keyof typeof node.M];
    if (typeof stateValue === 'number') {
        return stateValue;
    }

    // Fallback to overall
    return node.M.overall;
}

// ============================================================================
// NETWORK GENERATION
// ============================================================================

/**
 * Parse Korean network data and calculate positions for given state
 */
export function parseKoreanNetwork(
    state: KoreanNetworkState = 'overall',
    centerX: number = 0,
    centerY: number = 0
): KoreanNetworkData {
    const nodes: KoreanNetworkNode[] = [];
    const edges: KoreanNetworkEdge[] = [];

    const rawNodes = koreanNodesData as KoreanNode[];
    const rawLinks = koreanLinksData as KoreanLink[];

    // Filter non-center nodes for angle calculation
    const peripheralNodes = rawNodes.filter(n => n.type !== 'center');
    const totalPeripheral = peripheralNodes.length;

    let peripheralIndex = 0;

    for (const node of rawNodes) {
        const isCenter = node.type === 'center' || node.fixed;

        let x: number, y: number, size: number, color: string;
        let M_current = 0;

        if (isCenter) {
            // Center node: fixed at origin
            x = centerX;
            y = centerY;
            size = 50;
            color = CENTER_COLOR;
        } else {
            // Peripheral node: calculate radial position
            M_current = getMForState(node, state);
            const radius = calculateRadius(M_current);
            const angle = calculateAngle(node.id, peripheralIndex, totalPeripheral);

            x = centerX + radius * Math.cos(angle);
            y = centerY + radius * Math.sin(angle);

            // Size based on cluster (core = larger)
            size = node.cluster_k3 === 3 ? 28 : node.cluster_k3 === 2 ? 22 : 18;
            color = CLUSTER_COLORS[node.cluster_k3] || CLUSTER_COLORS[2];

            peripheralIndex++;
        }

        nodes.push({
            id: node.id,
            label: node.label,
            x,
            y,
            fixed: isCenter,
            size,
            color,
            font: { color: '#ffffff' },
            borderWidth: isCenter ? 3 : 2,
            borderWidthSelected: 4,
            cluster: node.cluster_k3,
            M_current
        });
    }

    // Generate KSET-to-journal edges (distance edges)
    for (const link of rawLinks) {
        const targetNode = nodes.find(n => n.id === link.target);
        const M = targetNode?.M_current || 2;

        // Edge opacity inversely proportional to distance
        const opacity = Math.max(0.3, 1 - (M - 1) / 4);
        const width = Math.max(1, 3 - M / 2);

        edges.push({
            from: link.source,
            to: link.target,
            color: { color: '#475569', opacity },
            width,
            dashes: false,
            type: 'distance'
        });
    }

    // Generate intra-cluster similarity edges (dashed)
    // Group nodes by cluster
    const clusterGroups: Record<number, KoreanNetworkNode[]> = {};
    for (const node of nodes) {
        if (node.id === 'KSET') continue; // Skip center
        if (!clusterGroups[node.cluster]) {
            clusterGroups[node.cluster] = [];
        }
        clusterGroups[node.cluster].push(node);
    }

    // Connect nodes within same cluster
    for (const cluster of Object.keys(clusterGroups)) {
        const clusterNum = parseInt(cluster);
        const clusterNodes = clusterGroups[clusterNum];
        const clusterColor = CLUSTER_COLORS[clusterNum] || '#475569';

        // Peripheral cluster gets lower opacity to reduce visual clutter
        const clusterOpacity = clusterNum === 1 ? 0.15 : 0.25;

        // Create pairwise connections within cluster
        for (let i = 0; i < clusterNodes.length; i++) {
            for (let j = i + 1; j < clusterNodes.length; j++) {
                edges.push({
                    from: clusterNodes[i].id,
                    to: clusterNodes[j].id,
                    color: { color: clusterColor, opacity: clusterOpacity },
                    width: 1,
                    dashes: true,
                    type: 'similarity'
                });
            }
        }
    }

    return { nodes, edges, centerX, centerY };
}

/**
 * Calculate interpolated positions between two states
 * Used for smooth state transitions
 */
export function interpolatePositions(
    fromState: KoreanNetworkState,
    toState: KoreanNetworkState,
    progress: number,  // 0 to 1
    centerX: number = 0,
    centerY: number = 0
): KoreanNetworkData {
    const fromNetwork = parseKoreanNetwork(fromState, centerX, centerY);
    const toNetwork = parseKoreanNetwork(toState, centerX, centerY);

    const interpolatedNodes = fromNetwork.nodes.map((fromNode, i) => {
        const toNode = toNetwork.nodes[i];

        // Lerp position
        const x = fromNode.x + (toNode.x - fromNode.x) * progress;
        const y = fromNode.y + (toNode.y - fromNode.y) * progress;
        const M_current = fromNode.M_current + (toNode.M_current - fromNode.M_current) * progress;

        return {
            ...fromNode,
            x,
            y,
            M_current
        };
    });

    return {
        nodes: interpolatedNodes,
        edges: fromNetwork.edges,
        centerX,
        centerY
    };
}

/**
 * Get cluster summary for legend
 */
export function getClusterSummary(): { cluster: number; label: string; color: string; count: number }[] {
    const rawNodes = koreanNodesData as KoreanNode[];

    return [
        {
            cluster: 3,
            label: '핵심 (Core)',
            color: CLUSTER_COLORS[3],
            count: rawNodes.filter(n => n.cluster_k3 === 3 && n.type !== 'center').length
        },
        {
            cluster: 2,
            label: '중간 (Mid)',
            color: CLUSTER_COLORS[2],
            count: rawNodes.filter(n => n.cluster_k3 === 2).length
        },
        {
            cluster: 1,
            label: '주변 (Peripheral)',
            color: CLUSTER_COLORS[1],
            count: rawNodes.filter(n => n.cluster_k3 === 1).length
        }
    ];
}
