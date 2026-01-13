/**
 * Tests for network parser
 */

import { describe, it, expect } from 'vitest';
import { parseNetworkData } from './parser';

describe('parseNetworkData', () => {
    it('returns valid nodes and edges from venue data', () => {
        const result = parseNetworkData();

        // Should have nodes (venues + categories)
        expect(result.nodes.length).toBeGreaterThan(0);
        expect(result.edges.length).toBeGreaterThan(0);
        expect(result.categories.length).toBeGreaterThan(0);

        // Check node structure
        const journalNode = result.nodes.find(n => n.group === 'Journal');
        expect(journalNode).toBeDefined();
        expect(journalNode?.id).toBeDefined();
        expect(journalNode?.label).toBeDefined();

        // Check category structure
        const categoryNode = result.nodes.find(n => n.group === 'Category');
        expect(categoryNode).toBeDefined();

        // Check edge structure
        const edge = result.edges[0];
        expect(edge.from).toBeDefined();
        expect(edge.to).toBeDefined();
    });

    it('creates correct venue-to-category edges', () => {
        const result = parseNetworkData();

        // Each edge should connect a venue to a category
        for (const edge of result.edges.slice(0, 10)) { // Check first 10
            const fromNode = result.nodes.find(n => n.id === edge.from);
            const toNode = result.nodes.find(n => n.id === edge.to);

            // From should be venue, to should be category
            expect(['Journal', 'Conference', 'SubConference']).toContain(fromNode?.group);
            expect(toNode?.group).toBe('Category');
        }
    });
});
