/**
 * Network data types and parsing
 * Now includes semantic similarity edges between venues
 */

import { getAllVenues, type VenueInfo } from '../data/venues';
import semanticProfiles from '../data/semantic_profiles.json';

// ============================================================================
// TYPES
// ============================================================================

export interface NodeData {
    id: string;
    label: string;
    group: string;
    impact?: string;
    cfpDeadline?: string;
    hidden?: boolean;
    size?: number;
    title?: string;
}

export interface EdgeData {
    from: string;
    to: string;
    dashes?: boolean;
    hidden?: boolean;
    // Similarity edge properties
    isSimilarity?: boolean;
    similarity?: number;
    width?: number;
    color?: { color: string; opacity: number };
}

export interface NetworkData {
    nodes: NodeData[];
    edges: EdgeData[];
    categories: string[];
}

// ============================================================================
// SEMANTIC SIMILARITY
// ============================================================================

interface SemanticProfile {
    name: string;
    vector: Record<string, number>;
}

const SIMILARITY_THRESHOLD = 0.15; // Minimum similarity to create edge

/**
 * Calculate cosine similarity between two TF-IDF vectors
 */
function cosineSimilarity(vecA: Record<string, number>, vecB: Record<string, number>): number {
    const allKeys = new Set([...Object.keys(vecA), ...Object.keys(vecB)]);

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (const key of allKeys) {
        const a = vecA[key] || 0;
        const b = vecB[key] || 0;
        dotProduct += a * b;
        normA += a * a;
        normB += b * b;
    }

    if (normA === 0 || normB === 0) return 0;
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Generate similarity edges between venues based on semantic profiles
 */
function generateSimilarityEdges(venueNames: string[]): EdgeData[] {
    const profiles = semanticProfiles as Record<string, SemanticProfile>;
    const similarityEdges: EdgeData[] = [];

    // Filter venues that have semantic profiles
    const venuesWithProfiles = venueNames.filter(name => profiles[name]?.vector);

    // Compare all pairs
    for (let i = 0; i < venuesWithProfiles.length; i++) {
        for (let j = i + 1; j < venuesWithProfiles.length; j++) {
            const venueA = venuesWithProfiles[i];
            const venueB = venuesWithProfiles[j];

            const vecA = profiles[venueA].vector;
            const vecB = profiles[venueB].vector;

            const similarity = cosineSimilarity(vecA, vecB);

            if (similarity >= SIMILARITY_THRESHOLD) {
                // Edge width and opacity based on similarity strength
                const width = 1 + similarity * 4; // 1-5 range
                const opacity = 0.3 + similarity * 0.5; // 0.3-0.8 range

                similarityEdges.push({
                    from: venueA,
                    to: venueB,
                    isSimilarity: true,
                    similarity: Math.round(similarity * 100) / 100,
                    dashes: true, // Dotted line for similarity edges
                    width,
                    color: { color: '#8B5CF6', opacity } // Purple for semantic links
                });
            }
        }
    }

    return similarityEdges;
}

// ============================================================================
// PARSING
// ============================================================================

export function parseNetworkData(): NetworkData {
    const venueData = getAllVenues();
    const nodeMap = new Map<string, NodeData>();
    const edges: EdgeData[] = [];
    const categorySet = new Set<string>();
    const venueNames: string[] = [];

    for (const venue of venueData) {
        if (!nodeMap.has(venue.name)) {
            nodeMap.set(venue.name, {
                id: venue.name,
                label: venue.name.length > 35 ? venue.name.substring(0, 32) + '...' : venue.name,
                group: venue.type,
                impact: venue.impact,
                cfpDeadline: venue.cfpDeadline
            });
            venueNames.push(venue.name);
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

    // Add semantic similarity edges between venues
    const similarityEdges = generateSimilarityEdges(venueNames);
    edges.push(...similarityEdges);

    console.log(`[Network] Generated ${similarityEdges.length} similarity edges (threshold: ${SIMILARITY_THRESHOLD})`);

    return {
        nodes: Array.from(nodeMap.values()),
        edges,
        categories: Array.from(categorySet).sort()
    };
}
