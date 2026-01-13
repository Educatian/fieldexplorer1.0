/**
 * Node Comparison Module
 * 
 * Side-by-side comparison of 2-3 venues.
 * Implements Progressive Disclosure: Overview ↔ Compare ↔ Decide → Commit
 */

export interface ComparisonState {
    isActive: boolean;
    nodes: string[];        // Max 3 venue IDs
    startTime: number;      // For decision_time_ms tracking
}

// Global state
let comparisonState: ComparisonState = {
    isActive: false,
    nodes: [],
    startTime: 0
};

/**
 * Toggle comparison mode on/off
 */
export function toggleComparisonMode(): boolean {
    comparisonState.isActive = !comparisonState.isActive;

    if (comparisonState.isActive) {
        comparisonState.nodes = [];
        comparisonState.startTime = Date.now();
    }

    return comparisonState.isActive;
}

/**
 * Get current comparison state
 */
export function getComparisonState(): ComparisonState {
    return { ...comparisonState };
}

/**
 * Add a node to comparison (max 3)
 */
export function addToComparison(nodeId: string): boolean {
    if (!comparisonState.isActive) return false;
    if (comparisonState.nodes.length >= 3) return false;
    if (comparisonState.nodes.includes(nodeId)) return false;

    comparisonState.nodes.push(nodeId);
    return true;
}

/**
 * Remove a node from comparison
 */
export function removeFromComparison(nodeId: string): boolean {
    const index = comparisonState.nodes.indexOf(nodeId);
    if (index === -1) return false;

    comparisonState.nodes.splice(index, 1);
    return true;
}

/**
 * Clear all comparison nodes
 */
export function clearComparison(): void {
    comparisonState.nodes = [];
}

/**
 * Get decision time in milliseconds
 */
export function getDecisionTime(): number {
    return Date.now() - comparisonState.startTime;
}

/**
 * Venue data for comparison display
 */
export interface VenueCompareData {
    id: string;
    name: string;
    type: string;
    impact?: string;
    cfpDeadline?: string;
    categories?: string[];
}

/**
 * Render comparison panel HTML
 */
export function renderComparisonPanel(venues: VenueCompareData[]): string {
    if (venues.length === 0) {
        return `
      <div class="comparison-empty">
        <p>📊 비교할 노드를 클릭하세요 (최대 3개)</p>
        <p class="hint">Shift + 클릭 또는 C 키로 비교 모드 전환</p>
      </div>
    `;
    }

    const columns = venues.map(v => `
    <div class="compare-column" data-venue-id="${v.id}">
      <div class="compare-header">
        <span class="compare-name">${v.name}</span>
        <button class="compare-remove" data-id="${v.id}" title="제거">✕</button>
      </div>
      <div class="compare-body">
        <div class="compare-row">
          <span class="compare-label">유형</span>
          <span class="compare-value type-${v.type.toLowerCase()}">${v.type}</span>
        </div>
        <div class="compare-row">
          <span class="compare-label">등급</span>
          <span class="compare-value ${v.impact ? 'impact-' + v.impact : ''}">${v.impact || '-'}</span>
        </div>
        ${v.cfpDeadline ? `
        <div class="compare-row">
          <span class="compare-label">CFP 마감</span>
          <span class="compare-value">${v.cfpDeadline}</span>
        </div>
        ` : ''}
      </div>
      <div class="compare-actions">
        <button class="btn compare-favorite" data-id="${v.id}">♡ 즐겨찾기</button>
      </div>
    </div>
  `).join('');

    return `
    <div class="comparison-panel">
      <div class="comparison-header">
        <span>📊 비교 모드 (${venues.length}/3)</span>
        <button class="btn compare-clear" title="모두 지우기">🗑️ 초기화</button>
      </div>
      <div class="comparison-grid">
        ${columns}
      </div>
      <div class="comparison-footer">
        <span class="decision-timer">⏱️ ${Math.floor(getDecisionTime() / 1000)}초</span>
        <button class="btn compare-done">✓ 비교 완료</button>
      </div>
    </div>
  `;
}

/**
 * Get CSS for comparison panel
 */
export function getComparisonCSS(): string {
    return `
    .comparison-panel {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background: var(--glass-bg);
      backdrop-filter: blur(10px);
      border-top: 1px solid var(--glass-border);
      padding: 16px;
      z-index: 100;
      animation: slideUp 0.3s ease;
    }

    @keyframes slideUp {
      from { transform: translateY(100%); }
      to { transform: translateY(0); }
    }

    .comparison-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
      font-weight: 600;
    }

    .comparison-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 12px;
    }

    .compare-column {
      background: var(--bg-secondary);
      border-radius: 10px;
      padding: 12px;
      border: 1px solid var(--border-color);
    }

    .compare-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 10px;
    }

    .compare-name {
      font-weight: 600;
      font-size: 0.85rem;
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .compare-remove {
      background: none;
      border: none;
      cursor: pointer;
      color: var(--text-muted);
      padding: 2px 6px;
    }

    .compare-remove:hover {
      color: #ef4444;
    }

    .compare-body {
      display: flex;
      flex-direction: column;
      gap: 6px;
      margin-bottom: 10px;
    }

    .compare-row {
      display: flex;
      justify-content: space-between;
      font-size: 0.8rem;
    }

    .compare-label {
      color: var(--text-muted);
    }

    .compare-value {
      font-weight: 500;
    }

    .compare-value.impact-Q1 { color: #10b981; }
    .compare-value.impact-Q2 { color: #3b82f6; }
    .compare-value.impact-Q3 { color: #f59e0b; }

    .compare-actions {
      display: flex;
      gap: 6px;
    }

    .compare-favorite {
      flex: 1;
      font-size: 0.75rem;
      padding: 6px;
    }

    .comparison-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 12px;
      padding-top: 12px;
      border-top: 1px solid var(--border-color);
    }

    .decision-timer {
      font-size: 0.8rem;
      color: var(--text-muted);
    }

    .compare-done {
      background: var(--color-accent);
      color: #000;
      font-weight: 600;
    }

    .comparison-empty {
      text-align: center;
      padding: 20px;
      color: var(--text-muted);
    }

    .comparison-empty .hint {
      font-size: 0.75rem;
      margin-top: 8px;
      opacity: 0.7;
    }

    /* Comparison mode indicator on nodes */
    .node-compare-selected {
      box-shadow: 0 0 15px rgba(245, 166, 35, 0.6);
    }
  `;
}
