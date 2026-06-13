/**
 * Onboarding Tour Module
 * 5-step interactive guide
 */

// ============================================================================
// TYPES
// ============================================================================

interface TourStep {
    target: string;        // CSS selector
    title: string;
    content: string;
    position: 'top' | 'bottom' | 'left' | 'right';
}

// ============================================================================
// TOUR STEPS
// ============================================================================

const TOUR_STEPS: TourStep[] = [
    {
        target: '#network',
        title: '🗺️ 네트워크 탐색',
        content: '학술 저널과 학회를 네트워크로 시각화합니다. 노드를 클릭하면 상세 정보를 볼 수 있어요.',
        position: 'bottom'
    },
    {
        target: '#search-input',
        title: '🔍 검색 기능',
        content: '저널이나 학회 이름을 검색하세요. 결과를 클릭하면 해당 노드로 이동합니다.',
        position: 'bottom'
    },
    {
        target: '#filter-journal',
        title: '📚 필터링',
        content: '저널과 학회를 각각 필터링하거나, 영향력 등급(Q1/Q2/Q3)으로 필터링할 수 있어요.',
        position: 'bottom'
    },
    {
        target: '.stats-panel',
        title: '📊 통계 정보',
        content: '현재 보이는 노드 수, 저널 수, 학회 수를 한눈에 확인하세요.',
        position: 'right'
    },
    {
        target: '.legend',
        title: '🎨 범례',
        content: '노드 색상의 의미를 확인하세요. 저널은 파란색, 학회는 초록색, 카테고리는 주황색입니다.',
        position: 'top'
    }
];

// ============================================================================
// TOUR STATE
// ============================================================================

const TOUR_COMPLETED_KEY = 'fieldexplorer_tour_completed';

let currentStep = 0;
let overlay: HTMLElement | null = null;
let tooltip: HTMLElement | null = null;
let spotlight: HTMLElement | null = null;

// ============================================================================
// TOUR FUNCTIONS
// ============================================================================

export function shouldShowTour(): boolean {
    return !localStorage.getItem(TOUR_COMPLETED_KEY);
}

export function startTour(): void {
    currentStep = 0;
    createOverlay();
    showStep(0);
}

export function skipTour(): void {
    localStorage.setItem(TOUR_COMPLETED_KEY, 'true');
    destroyTour();
}

function createOverlay(): void {
    // Create overlay
    overlay = document.createElement('div');
    overlay.id = 'tour-overlay';
    overlay.style.cssText = `
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.7);
        z-index: 9998;
        transition: opacity 0.3s;
    `;
    document.body.appendChild(overlay);

    // Create spotlight
    spotlight = document.createElement('div');
    spotlight.id = 'tour-spotlight';
    spotlight.style.cssText = `
        position: fixed;
        border-radius: 8px;
        box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.7);
        z-index: 9999;
        transition: all 0.3s ease;
        pointer-events: none;
    `;
    document.body.appendChild(spotlight);

    // Create tooltip
    tooltip = document.createElement('div');
    tooltip.id = 'tour-tooltip';
    tooltip.style.cssText = `
        position: fixed;
        background: linear-gradient(135deg, #11141d, #181c28);
        border: 1px solid rgba(99,102,241,0.35);
        border-radius: 12px;
        padding: 20px;
        max-width: 320px;
        z-index: 10000;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
        color: #ffffff;
        font-family: 'Inter', 'Noto Sans KR', sans-serif;
        transition: all 0.3s ease;
    `;
    document.body.appendChild(tooltip);

    // Add styles for navigation
    const style = document.createElement('style');
    style.id = 'tour-styles';
    style.textContent = `
        .tour-title {
            font-size: 1.1rem;
            font-weight: 600;
            margin-bottom: 8px;
        }
        .tour-content {
            font-size: 0.85rem;
            line-height: 1.5;
            color: #b8c5d6;
            margin-bottom: 16px;
        }
        .tour-nav {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .tour-progress {
            font-size: 0.7rem;
            color: #7a8ba3;
        }
        .tour-buttons {
            display: flex;
            gap: 8px;
        }
        .tour-btn {
            padding: 8px 16px;
            border-radius: 6px;
            font-size: 0.8rem;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
            border: none;
        }
        .tour-btn-skip {
            background: transparent;
            color: #7a8ba3;
        }
        .tour-btn-skip:hover {
            color: #ffffff;
        }
        .tour-btn-next {
            background: linear-gradient(135deg, #6366f1, #818cf8);
            color: #ffffff;
        }
        .tour-btn-next:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(245, 166, 35, 0.4);
        }
    `;
    document.head.appendChild(style);
}

function showStep(stepIndex: number): void {
    const step = TOUR_STEPS[stepIndex];
    const target = document.querySelector(step.target) as HTMLElement;

    if (!target || !tooltip || !spotlight) {
        // If target doesn't exist, skip to next step or finish
        if (stepIndex < TOUR_STEPS.length - 1) {
            showStep(stepIndex + 1);
        } else {
            completeTour();
        }
        return;
    }

    const rect = target.getBoundingClientRect();
    const padding = 8;

    // Position spotlight
    spotlight.style.left = `${rect.left - padding}px`;
    spotlight.style.top = `${rect.top - padding}px`;
    spotlight.style.width = `${rect.width + padding * 2}px`;
    spotlight.style.height = `${rect.height + padding * 2}px`;

    // Update tooltip content
    tooltip.innerHTML = `
        <div class="tour-title">${step.title}</div>
        <div class="tour-content">${step.content}</div>
        <div class="tour-nav">
            <span class="tour-progress">${stepIndex + 1} / ${TOUR_STEPS.length}</span>
            <div class="tour-buttons">
                <button class="tour-btn tour-btn-skip" id="tour-skip">건너뛰기</button>
                <button class="tour-btn tour-btn-next" id="tour-next">
                    ${stepIndex === TOUR_STEPS.length - 1 ? '완료' : '다음'}
                </button>
            </div>
        </div>
    `;

    // Position tooltip
    positionTooltip(rect, step.position);

    // Bind events
    document.getElementById('tour-skip')?.addEventListener('click', skipTour);
    document.getElementById('tour-next')?.addEventListener('click', () => {
        if (currentStep < TOUR_STEPS.length - 1) {
            currentStep++;
            showStep(currentStep);
        } else {
            completeTour();
        }
    });
}

function positionTooltip(targetRect: DOMRect, position: string): void {
    if (!tooltip) return;

    const tooltipRect = tooltip.getBoundingClientRect();
    const gap = 16;

    let left = 0;
    let top = 0;

    switch (position) {
        case 'bottom':
            left = targetRect.left + (targetRect.width - tooltipRect.width) / 2;
            top = targetRect.bottom + gap;
            break;
        case 'top':
            left = targetRect.left + (targetRect.width - tooltipRect.width) / 2;
            top = targetRect.top - tooltipRect.height - gap;
            break;
        case 'left':
            left = targetRect.left - tooltipRect.width - gap;
            top = targetRect.top + (targetRect.height - tooltipRect.height) / 2;
            break;
        case 'right':
            left = targetRect.right + gap;
            top = targetRect.top + (targetRect.height - tooltipRect.height) / 2;
            break;
    }

    // Keep within viewport
    left = Math.max(16, Math.min(left, window.innerWidth - tooltipRect.width - 16));
    top = Math.max(16, Math.min(top, window.innerHeight - tooltipRect.height - 16));

    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
}

function completeTour(): void {
    localStorage.setItem(TOUR_COMPLETED_KEY, 'true');
    destroyTour();
}

function destroyTour(): void {
    overlay?.remove();
    spotlight?.remove();
    tooltip?.remove();
    document.getElementById('tour-styles')?.remove();

    overlay = null;
    spotlight = null;
    tooltip = null;
}

// ============================================================================
// RESET (for testing)
// ============================================================================

export function resetTour(): void {
    localStorage.removeItem(TOUR_COMPLETED_KEY);
}
