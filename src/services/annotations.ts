/**
 * Annotation service for Supabase
 */

import { createClient } from '@supabase/supabase-js';

// ============================================================================
// TYPES
// ============================================================================

export interface Annotation {
    id?: string;
    venue_name: string;
    venue_type: string;
    user_email: string;
    comment: string;
    rating: number;
    tags: string[];
    created_at?: string;
    parent_id?: string | null;
}

// ============================================================================
// SUPABASE CLIENT
// ============================================================================

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = supabaseUrl && supabaseKey
    ? createClient(supabaseUrl, supabaseKey)
    : null;

// ============================================================================
// ANNOTATION FUNCTIONS
// ============================================================================

export async function fetchAnnotations(venueName: string): Promise<Annotation[]> {
    if (!supabase) return [];

    const { data, error } = await supabase
        .from('annotations')
        .select('*')
        .eq('venue_name', venueName)
        .order('created_at', { ascending: false });

    return error ? [] : (data as Annotation[]);
}

export async function addAnnotation(annotation: Omit<Annotation, 'id' | 'created_at'>): Promise<boolean> {
    if (!supabase) return false;

    const { error } = await supabase.from('annotations').insert([annotation]);
    return !error;
}

// ============================================================================
// ANNOTATION RENDERING
// ============================================================================

const TAGS = ['신규 연구자 추천', '까다로운 리뷰', '빠른 피드백', '높은 영향력'];

function starRating(rating: number): string {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
}

export function renderAnnotations(annotations: Annotation[], venueName: string, venueType: string): string {
    const rootAnnotations = annotations.filter(a => !a.parent_id);
    const replies = annotations.filter(a => a.parent_id);

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
