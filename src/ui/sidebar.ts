/**
 * Sidebar rendering functions
 */

import type { NodeData, EdgeData } from '../network/parser';
import { getVenueDetailsByName, type VenueDetails } from '../data/venues';

// ============================================================================
// VENUE DETAILS VIEW
// ============================================================================

export interface RenderContext {
  nodes: NodeData[];
  edges: EdgeData[];
  favorites: Set<string>;
  onNodeClick?: (nodeId: string) => void;
}

export function getRecommendations(nodeId: string, nodes: NodeData[], edges: EdgeData[]): NodeData[] {
  const myCategories = edges.filter(e => e.from === nodeId).map(e => e.to);
  const recommendations = new Set<string>();

  for (const cat of myCategories) {
    const sameCategory = edges.filter(e => e.to === cat && e.from !== nodeId).map(e => e.from);
    sameCategory.forEach(n => recommendations.add(n));
  }

  return Array.from(recommendations)
    .slice(0, 5)
    .map(id => nodes.find(n => n.id === id)!)
    .filter(Boolean);
}

export function renderVenueDetails(data: VenueDetails, node: NodeData, recommendations: NodeData[]): string {
  const desc = data.overview?.description || '정보 없음';
  const website = data.overview?.website;
  const topics = data.topics?.length ? data.topics.join(', ') : '정보 없음';
  const acceptance = data.newcomerFriendliness?.acceptanceRate || 'N/A';
  const decision = data.newcomerFriendliness?.timeToDecision || 'N/A';

  const methodologyHtml = data.methodologyProfile?.length
    ? data.methodologyProfile.map(m => {
      const isExpert = data.isExpertVerified;
      const barTitle = isExpert ? "Expert Verified" : "Data-driven Profile";
      return `
            <div style="margin-bottom: 12px;" title="${barTitle}">
              <div style="display: flex; justify-content: space-between; margin-bottom: 5px; font-size: 0.75rem; font-weight: 500;">
                <span style="color: var(--text-secondary);">${m.methodology}</span>
                <span style="color: var(--color-accent); font-family: 'Inter', sans-serif;">${m.prevalence}%</span>
              </div>
              <div style="background: rgba(255, 255, 255, 0.05); border-radius: 4px; height: 6px; overflow: hidden; position: relative;">
                <div class="methodology-bar-shimmer" style="
                  background: linear-gradient(90deg, var(--color-accent) 0%, #ffc857 50%, var(--color-accent) 100%);
                  background-size: 200% 100%;
                  width: ${m.prevalence}%;
                  height: 100%;
                  border-radius: 4px;
                  animation: shimmer 3s infinite linear;
                  box-shadow: 0 0 10px rgba(245, 166, 35, 0.2);
                "></div>
              </div>
            </div>
            `;
    }).join('')
    : '<p style="color: var(--text-muted); font-size: 0.85rem;">정보 없음</p>';

  const contributorsHtml = data.keyContributors?.length
    ? `<ul class="sidebar-list">${data.keyContributors.map(c =>
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

// ============================================================================
// CATEGORY DETAILS VIEW
// ============================================================================

export function renderCategoryDetails(connectedNodes: NodeData[]): string {
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
