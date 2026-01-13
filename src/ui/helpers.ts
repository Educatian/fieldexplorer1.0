/**
 * UI Helper functions
 */

// ============================================================================
// MODAL & OVERLAY
// ============================================================================

export function hideLoading(): void {
    document.getElementById('loading-overlay')?.classList.add('hidden');
}

export function showModal(id: string): void {
    const el = document.getElementById(id);
    if (el) {
        el.classList.add('visible');
        el.style.opacity = '1';
        el.style.visibility = 'visible';
    }
}

export function hideModal(id: string): void {
    const el = document.getElementById(id);
    if (el) {
        el.classList.remove('visible');
        el.style.opacity = '';
        el.style.visibility = '';
    }
}

// ============================================================================
// SIDEBAR
// ============================================================================

export function showSidebar(): void {
    document.getElementById('sidebar')?.classList.add('visible');
}

export function hideSidebar(): void {
    document.getElementById('sidebar')?.classList.remove('visible');
}

// ============================================================================
// TOAST (Vanilla Queue)
// ============================================================================

const toastQueue: HTMLElement[] = [];

export function showToast(message: string, type: 'success' | 'error' | 'info' = 'info'): void {
    const container = document.getElementById('toast-container') || createToastContainer();

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;

    container.appendChild(toast);
    toastQueue.push(toast);

    // Auto-remove after 3s
    setTimeout(() => {
        toast.classList.add('fade-out');
        setTimeout(() => {
            toast.remove();
            const idx = toastQueue.indexOf(toast);
            if (idx > -1) toastQueue.splice(idx, 1);
        }, 300);
    }, 3000);
}

function createToastContainer(): HTMLElement {
    const container = document.createElement('div');
    container.id = 'toast-container';
    container.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        display: flex;
        flex-direction: column;
        gap: 8px;
    `;
    document.body.appendChild(container);

    // Add toast styles
    const style = document.createElement('style');
    style.textContent = `
        .toast {
            padding: 12px 20px;
            border-radius: 8px;
            background: rgba(21, 40, 82, 0.95);
            backdrop-filter: blur(10px);
            color: #fff;
            font-size: 0.9rem;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            border: 1px solid rgba(255,255,255,0.1);
            animation: toast-in 0.3s ease;
        }
        .toast-success { border-left: 3px solid #10b981; }
        .toast-error { border-left: 3px solid #ef4444; }
        .toast-info { border-left: 3px solid #3b82f6; }
        .toast.fade-out { opacity: 0; transition: opacity 0.3s; }
        @keyframes toast-in {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);

    return container;
}

// ============================================================================
// SIDEBAR TITLE
// ============================================================================

const typeLabels: Record<string, string> = {
    'Journal': '저널',
    'Conference': '학회',
    'SubConference': '학회',
    'Category': '카테고리'
};

export function setSidebarTitle(title: string, type: string, impact?: string): void {
    const titleEl = document.getElementById('sidebar-title');
    const typeEl = document.getElementById('sidebar-type');
    const badge = document.getElementById('impact-badge');

    if (titleEl) titleEl.textContent = title;
    if (typeEl) typeEl.textContent = typeLabels[type] || type;

    if (badge) {
        if (impact) {
            badge.textContent = impact;
            badge.style.display = 'inline';
            badge.style.background = impact === 'Q1' ? '#10b981' : impact === 'Q2' ? '#3b82f6' : '#f59e0b';
        } else {
            badge.style.display = 'none';
        }
    }
}

export function setSidebarContent(html: string): void {
    const el = document.getElementById('sidebar-content');
    if (el) el.innerHTML = html;
}
