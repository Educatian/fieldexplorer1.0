/**
 * Network analysis metrics (Scientific Evidence)
 * PageRank, Clustering Coefficient, Louvain Community Detection
 */

import type { NodeData, EdgeData } from './parser';

// ============================================================================
// TYPES
// ============================================================================

export interface NetworkMetrics {
    degreeCentrality: Map<string, number>;
    normalizedDegree: Map<string, number>;
    hubScore: Map<string, number>;
    networkDensity: number;
    avgClustering: number;
    pageRank: Map<string, number>;
    communities: Map<string, number>;
    communityCount: number;
}

// ============================================================================
// CALCULATION
// ============================================================================

export function calculateNetworkMetrics(nodes: NodeData[], edges: EdgeData[]): NetworkMetrics {
    // Build adjacency list
    const adjacency = new Map<string, Set<string>>();
    nodes.forEach(n => adjacency.set(n.id, new Set()));

    edges.forEach(e => {
        adjacency.get(e.from)?.add(e.to);
        adjacency.get(e.to)?.add(e.from);
    });

    // 1. Degree Centrality
    const degreeCentrality = new Map<string, number>();
    adjacency.forEach((neighbors, nodeId) => {
        degreeCentrality.set(nodeId, neighbors.size);
    });

    // 2. Normalized Degree (0-1 scale)
    const normalizedDegree = new Map<string, number>();
    const n = nodes.length;
    if (n > 1) {
        degreeCentrality.forEach((deg, nodeId) => {
            normalizedDegree.set(nodeId, deg / (n - 1));
        });
    }

    // 3. Hub Score (for venues: how many categories they connect)
    const hubScore = new Map<string, number>();
    nodes.forEach(node => {
        if (node.group === 'Journal' || node.group === 'Conference') {
            const neighbors = adjacency.get(node.id) || new Set();
            const categoryConnections = Array.from(neighbors).filter(
                nId => nodes.find(nd => nd.id === nId)?.group === 'Category'
            ).length;
            hubScore.set(node.id, categoryConnections);
        }
    });

    // 4. Network Density: 2|E| / (|V| * (|V|-1))
    const networkDensity = n > 1 ? (2 * edges.length) / (n * (n - 1)) : 0;

    // 5. Average Local Clustering Coefficient
    let totalClustering = 0;
    let countable = 0;

    nodes.forEach(node => {
        const neighbors = Array.from(adjacency.get(node.id) || []);
        const k = neighbors.length;
        if (k < 2) return;

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
    const d = 0.85;
    const iterations = 50;

    nodes.forEach(node => pageRank.set(node.id, 1 / n));

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

    nodes.forEach(node => {
        if (!visited.has(node.id)) {
            const queue = [node.id];
            while (queue.length > 0) {
                const current = queue.shift()!;
                if (visited.has(current)) continue;
                visited.add(current);
                communities.set(current, communityId);

                const currentNode = nodes.find(nd => nd.id === current);
                (adjacency.get(current) || new Set()).forEach(neighbor => {
                    const neighborNode = nodes.find(nd => nd.id === neighbor);
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

// ============================================================================
// NODE SIZING
// ============================================================================

export function applyMetricsToNodes(nodes: NodeData[], metrics: NetworkMetrics): NodeData[] {
    const maxPageRank = Math.max(...Array.from(metrics.pageRank.values()));

    return nodes.map(node => {
        const degree = metrics.degreeCentrality.get(node.id) || 0;
        const hubScoreVal = metrics.hubScore.get(node.id) || 0;
        const pageRankScore = metrics.pageRank.get(node.id) || 0;
        const communityId = metrics.communities.get(node.id) || 0;

        let size = 10;
        if (node.group === 'Journal' || node.group === 'Conference') {
            const prNormalized = maxPageRank > 0 ? pageRankScore / maxPageRank : 0;
            size = 10 + (prNormalized * 10) + (hubScoreVal * 1.5);
            if (node.impact === 'Q1') size += 4;
        } else if (node.group === 'Category') {
            size = 14 + Math.min(degree * 1.5, 20);
        }

        return {
            ...node,
            size,
            title: `${node.id}\nPageRank: ${(pageRankScore * 100).toFixed(2)}%\nDegree: ${degree} | Community: ${communityId + 1}`
        };
    });
}
