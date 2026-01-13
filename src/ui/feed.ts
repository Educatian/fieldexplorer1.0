/**
 * Recent Reviews Feed Module
 * 
 * Facebook-style timeline feed with cursor pagination.
 */

import { createClient } from '@supabase/supabase-js';

export interface FeedItem {
    id: string;
    venue_name: string;
    venue_type: string;
    rating: number | null;
    comment: string;
    tags: string[] | null;
    created_at: string;
    author_label: string;
}

export interface FeedCursor {
    created_at: string;
    id: string;
}

export interface FeedState {
    items: FeedItem[];
    cursor: FeedCursor | null;
    hasMore: boolean;
    loading: boolean;
    error: string | null;
}

/**
 * Fetch feed from Supabase
 */
export async function fetchFeed(
    supabase: ReturnType<typeof createClient>,
    cursor?: FeedCursor,
    limit: number = 20
): Promise<{ items: FeedItem[]; hasMore: boolean }> {
    let query = supabase
        .from('annotations_feed')
        .select('*')
        .order('created_at', { ascending: false })
        .order('id', { ascending: false })
        .limit(limit + 1); // +1 to check hasMore

    // Cursor pagination (다음 페이지)
    if (cursor) {
        const ts = new Date(cursor.created_at).toISOString();
        query = query.or(`created_at.lt.${ts},and(created_at.eq.${ts},id.lt.${cursor.id})`);
    }

    const { data, error } = await query;

    if (error) {
        throw new Error(error.message);
    }

    const items = data || [];
    const hasMore = items.length > limit;

    return {
        items: hasMore ? items.slice(0, limit) : items,
        hasMore
    };
}

/**
 * Format relative time (e.g., "2분 전")
 */
export function formatTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffSec < 60) return '방금 전';
    if (diffMin < 60) return `${diffMin}분 전`;
    if (diffHour < 24) return `${diffHour}시간 전`;
    if (diffDay < 7) return `${diffDay}일 전`;

    return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
}

/**
 * Render star rating
 */
function renderStars(rating: number | null): string {
    if (!rating) return '';
    return '⭐'.repeat(rating);
}

/**
 * Render feed item card
 */
export function renderFeedItem(item: FeedItem): string {
    const timeAgo = formatTimeAgo(item.created_at);
    const stars = renderStars(item.rating);
    const tags = item.tags?.map(t => `<span class="feed-tag">${t}</span>`).join('') || '';

    return `
    <div class="feed-card" data-venue="${item.venue_name}">
      <div class="feed-header">
        <span class="feed-author">${item.author_label === 'me' ? '👤 나' : `👤 ${item.author_label}`}</span>
        <span class="feed-time">${timeAgo}</span>
      </div>
      <div class="feed-venue">
        <span class="feed-venue-type ${item.venue_type.toLowerCase()}">${item.venue_type === 'Journal' ? '📘' : '🎤'}</span>
        <span class="feed-venue-name">${item.venue_name}</span>
      </div>
      ${stars ? `<div class="feed-rating">${stars}</div>` : ''}
      <div class="feed-comment">${item.comment}</div>
      ${tags ? `<div class="feed-tags">${tags}</div>` : ''}
    </div>
  `;
}

/**
 * Render feed popup
 */
export function renderFeedPopup(state: FeedState, onLoadMore?: () => void): string {
    const itemsHtml = state.items.length > 0
        ? state.items.map(renderFeedItem).join('')
        : '<div class="feed-empty">아직 리뷰가 없어요</div>';

    const loadMoreBtn = state.hasMore && !state.loading
        ? '<button class="btn feed-load-more">더 보기</button>'
        : '';

    const loadingIndicator = state.loading
        ? '<div class="feed-loading">불러오는 중...</div>'
        : '';

    const errorMessage = state.error
        ? `<div class="feed-error">${state.error} <button class="btn feed-retry">재시도</button></div>`
        : '';

    return `
    <div class="feed-popup" id="feed-popup">
      <div class="feed-overlay"></div>
      <div class="feed-container">
        <div class="feed-popup-header">
          <h3>📢 최신 리뷰</h3>
          <button class="feed-close" id="feed-close">✕</button>
        </div>
        <div class="feed-content">
          ${errorMessage}
          ${itemsHtml}
          ${loadingIndicator}
          ${loadMoreBtn}
        </div>
      </div>
    </div>
  `;
}

/**
 * Get last cursor from items
 */
export function getLastCursor(items: FeedItem[]): FeedCursor | null {
    if (items.length === 0) return null;
    const last = items[items.length - 1];
    return { created_at: last.created_at, id: last.id };
}
