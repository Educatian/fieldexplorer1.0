/**
 * Research Topics Module
 * 
 * Displays ISLS research topics in a modal popup with filtering and search.
 */

import islsTopics from '../data/isls-topics.json';

export interface ResearchTopic {
    id: string;
    name: string;
    category: string;
    description: string;
}

// Category colors
const CATEGORY_COLORS: Record<string, string> = {
    'CSCL': '#10b981',
    'Learning Sciences': '#7ba0cc',
    'Methodologies': '#f59e0b',
    'Technology': '#8b5cf6',
    'Practice': '#ef4444'
};

// Category icons
const CATEGORY_ICONS: Record<string, string> = {
    'CSCL': '🤝',
    'Learning Sciences': '🧠',
    'Methodologies': '📊',
    'Technology': '💻',
    'Practice': '🎯'
};

/**
 * Get all unique categories
 */
export function getCategories(): string[] {
    const categories = new Set<string>();
    islsTopics.forEach(topic => categories.add(topic.category));
    return Array.from(categories).sort();
}

/**
 * Filter topics by category and search query
 */
export function filterTopics(category: string = 'All', searchQuery: string = ''): ResearchTopic[] {
    let filtered = islsTopics as ResearchTopic[];

    // Filter by category
    if (category !== 'All') {
        filtered = filtered.filter(t => t.category === category);
    }

    // Filter by search query
    if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(t =>
            t.name.toLowerCase().includes(query) ||
            t.description.toLowerCase().includes(query)
        );
    }

    return filtered;
}

/**
 * Render research topics modal
 */
export function renderResearchTopicsModal(): string {
    const categories = getCategories();

    return `
        <div class="research-topics-overlay" id="research-topics-modal">
            <div class="research-topics-content">
                <div class="modal-header">
                    <div class="modal-title">
                        <h2>🔬 ISLS Research Topics</h2>
                        <p class="modal-subtitle">49개의 학습과학 연구 주제 탐색</p>
                    </div>
                    <button class="sidebar-close" id="close-research-topics">✕</button>
                </div>
                
                <div class="modal-controls">
                    <div class="search-box-large">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="11" cy="11" r="8"/>
                            <path d="m21 21-4.35-4.35"/>
                        </svg>
                        <input 
                            type="text" 
                            id="topics-search" 
                            placeholder="연구 주제 검색..."
                        />
                    </div>
                    
                    <div class="category-filter">
                        <button class="filter-chip active" data-category="All">
                            All (49)
                        </button>
                        ${categories.map(cat => `
                            <button class="filter-chip" data-category="${cat}">
                                ${CATEGORY_ICONS[cat] || '📌'} ${cat}
                            </button>
                        `).join('')}
                    </div>
                </div>
                
                <div class="modal-body" id="topics-grid">
                    ${renderTopicsGrid(islsTopics as ResearchTopic[])}
                </div>
            </div>
        </div>
    `;
}


/**
 * Render topics grid
 */
function renderTopicsGrid(topics: ResearchTopic[]): string {
    if (topics.length === 0) {
        return `
            <div class="topics-empty">
                <p>검색 결과가 없습니다</p>
            </div>
        `;
    }

    return `
        <div class="topics-grid">
            ${topics.map(topic => renderTopicCard(topic)).join('')}
        </div>
    `;
}

/**
 * Render individual topic card
 */
function renderTopicCard(topic: ResearchTopic): string {
    const color = CATEGORY_COLORS[topic.category] || '#64748b';
    const icon = CATEGORY_ICONS[topic.category] || '📌';

    return `
        <div class="topic-card" data-topic-id="${topic.id}">
            <div class="topic-header">
                <span class="topic-icon">${icon}</span>
                <span class="topic-category" style="color: ${color}">
                    ${topic.category}
                </span>
            </div>
            <h3 class="topic-name">${topic.name}</h3>
            <p class="topic-description">${topic.description}</p>
        </div>
    `;
}

/**
 * Initialize research topics modal
 */
export function initResearchTopicsModal(): void {
    const modal = document.getElementById('research-topics-modal');
    if (!modal) return;

    // Close button
    const closeBtn = document.getElementById('close-research-topics');
    closeBtn?.addEventListener('click', () => {
        console.log('[Research Topics] Close button clicked');
        modal.classList.remove('visible');
        console.log('[Research Topics] After close, classes:', modal.classList.toString());
    });

    // Click outside content to close (click on overlay background)
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            console.log('[Research Topics] Overlay clicked, closing');
            modal.classList.remove('visible');
            console.log('[Research Topics] After overlay close, classes:', modal.classList.toString());
        }
    });

    // Search functionality
    const searchInput = document.getElementById('topics-search') as HTMLInputElement;
    searchInput?.addEventListener('input', (e) => {
        const query = (e.target as HTMLInputElement).value;
        const activeCategory = document.querySelector('.filter-chip.active')?.getAttribute('data-category') || 'All';
        updateTopicsGrid(activeCategory, query);
    });

    // Category filter
    const filterChips = modal.querySelectorAll('.filter-chip');
    filterChips.forEach(chip => {
        chip.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;
            const category = target.getAttribute('data-category') || 'All';

            // Update active state
            filterChips.forEach(c => c.classList.remove('active'));
            target.classList.add('active');

            // Update grid
            const searchQuery = searchInput?.value || '';
            updateTopicsGrid(category, searchQuery);
        });
    });

    // Topic card click - opens ISLS wiki page
    modal.addEventListener('click', (e) => {
        const card = (e.target as HTMLElement).closest('.topic-card');
        if (card) {
            const topicId = card.getAttribute('data-topic-id');
            console.log('Topic clicked:', topicId);

            if (topicId) {
                // Open ISLS wiki page in new window
                const wikiUrl = `https://www.isls.org/research-topics/${topicId}`;
                window.open(wikiUrl, '_blank', 'noopener,noreferrer');
            }
        }
    });
}

/**
 * Update topics grid based on filters
 */
function updateTopicsGrid(category: string, searchQuery: string): void {
    const grid = document.getElementById('topics-grid');
    if (!grid) return;

    const filtered = filterTopics(category, searchQuery);
    grid.innerHTML = renderTopicsGrid(filtered);

    // Update count in "All" button
    const allButton = document.querySelector('.filter-chip[data-category="All"]');
    if (allButton) {
        allButton.textContent = `All (${filtered.length})`;
    }
}

/**
 * Show research topics modal
 */
export function showResearchTopicsModal(): void {
    console.log('[Research Topics] showResearchTopicsModal called');
    const modal = document.getElementById('research-topics-modal');
    console.log('[Research Topics] Modal found:', !!modal, modal?.classList.toString());
    if (modal) {
        modal.classList.add('visible');
        console.log('[Research Topics] Added visible class:', modal.classList.toString());
    } else {
        console.error('[Research Topics] Modal not found!');
    }
}

/**
 * Hide research topics modal
 */
export function hideResearchTopicsModal(): void {
    const modal = document.getElementById('research-topics-modal');
    if (modal) {
        modal.classList.remove('visible');
    }
}
