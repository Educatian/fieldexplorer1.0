/**
 * Network data types and parsing
 */

import { getAllVenues, type VenueInfo } from '../data/venues';

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
}

export interface NetworkData {
    nodes: NodeData[];
    edges: EdgeData[];
    categories: string[];
}

// ============================================================================
// PARSING
// ============================================================================

export function parseNetworkData(): NetworkData {
    const venueData = getAllVenues();
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
