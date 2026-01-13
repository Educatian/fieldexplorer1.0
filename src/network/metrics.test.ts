/**
 * Tests for network metrics
 */

import { describe, it, expect } from 'vitest';
import { calculateNetworkMetrics, applyMetricsToNodes } from './metrics';
import type { NodeData, EdgeData } from './parser';

describe('calculateNetworkMetrics', () => {
    it('calculates metrics for a normal graph', () => {
        const nodes: NodeData[] = [
            { id: 'Journal A', label: 'Journal A', group: 'Journal', impact: 'Q1' },
            { id: 'Journal B', label: 'Journal B', group: 'Journal', impact: 'Q2' },
            { id: 'Category X', label: 'Category X', group: 'Category' },
            { id: 'Category Y', label: 'Category Y', group: 'Category' },
        ];
        const edges: EdgeData[] = [
            { from: 'Journal A', to: 'Category X' },
            { from: 'Journal A', to: 'Category Y' },
            { from: 'Journal B', to: 'Category X' },
        ];

        const metrics = calculateNetworkMetrics(nodes, edges);

        expect(metrics.degreeCentrality.get('Journal A')).toBe(2);
        expect(metrics.degreeCentrality.get('Journal B')).toBe(1);
        expect(metrics.degreeCentrality.get('Category X')).toBe(2);
        expect(metrics.networkDensity).toBeGreaterThan(0);
        expect(metrics.communityCount).toBeGreaterThan(0);
        expect(metrics.hubScore.get('Journal A')).toBe(2);
        expect(metrics.hubScore.get('Journal B')).toBe(1);
    });

    it('handles empty graph without errors', () => {
        const nodes: NodeData[] = [];
        const edges: EdgeData[] = [];

        const metrics = calculateNetworkMetrics(nodes, edges);

        expect(metrics.networkDensity).toBe(0);
        expect(metrics.avgClustering).toBe(0);
        expect(metrics.communityCount).toBe(0);
    });

    it('handles single node graph', () => {
        const nodes: NodeData[] = [
            { id: 'Single', label: 'Single', group: 'Journal' },
        ];
        const edges: EdgeData[] = [];

        const metrics = calculateNetworkMetrics(nodes, edges);

        expect(metrics.degreeCentrality.get('Single')).toBe(0);
        expect(metrics.networkDensity).toBe(0);
        expect(metrics.communityCount).toBe(1);
    });
});

describe('applyMetricsToNodes', () => {
    it('applies sizing based on metrics', () => {
        const nodes: NodeData[] = [
            { id: 'Journal A', label: 'Journal A', group: 'Journal', impact: 'Q1' },
            { id: 'Category X', label: 'Category X', group: 'Category' },
        ];
        const edges: EdgeData[] = [
            { from: 'Journal A', to: 'Category X' },
        ];

        const metrics = calculateNetworkMetrics(nodes, edges);
        const sized = applyMetricsToNodes(nodes, metrics);

        expect(sized[0].size).toBeGreaterThan(10); // Q1 journal should be larger
        expect(sized[0].title).toContain('PageRank');
        expect(sized[1].size).toBeGreaterThanOrEqual(14); // Category base size
    });
});
