/** A single, quiet line icon vocabulary for the map toolbar. */
export function installToolbarIcons(): void {
    const icons: Record<string, [string,string?]> = {
        'fullscreen-btn': ['M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5'],
        'theme-btn': ['M12 3a9 9 0 1 0 0 18V3Z M12 3a9 9 0 0 1 0 18'],
        'lang-btn': ['M3 12h18M12 3c5 5 5 13 0 18-5-5-5-13 0-18Z', ''],
        'about-btn': ['M12 11v6m0-10v.1'],
        'profile-btn': ['M5 21v-2a7 7 0 0 1 14 0v2M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z'],
        'tour-btn': ['M3 4h7l2 2 2-2h7v15h-7l-2 2-2-2H3V4Zm9 2v15'],
        'refresh-btn': ['M20 7v5h-5M4 17v-5h5M5.5 7a8 8 0 0 1 13-2L20 7M4 17l1.5 2a8 8 0 0 0 13-2'],
        'citation-layer-btn': ['m10 13 4-4m-5 7-2 2a4 4 0 0 1-5-5l4-4a4 4 0 0 1 5 0m2-1 2-2a4 4 0 0 1 5 5l-4 4a4 4 0 0 1-5 0','인용'],
        'submission-fit-btn': ['m15 9 6-6m-5 0h5v5M19 11a8 8 0 1 1-6-6M15 12a3 3 0 1 1-3-3','적합도'],
        'methodology-map-btn': ['M9 3h6m-5 0v7l-6 9a1.3 1.3 0 0 0 1 2h14a1.3 1.3 0 0 0 1-2l-6-9V3M7 15h10','방법론'],
        'tb-more-btn': ['M5 12h.01M12 12h.01M19 12h.01','더보기'],
    };
    for (const [id,[path,label]] of Object.entries(icons)) {
        const button = document.getElementById(id);
        if (!button) continue;
        const circle = ['lang-btn','about-btn'].includes(id) ? '<circle cx="12" cy="12" r="9"/>' : '';
        button.innerHTML = `<svg class="toolbar-icon" aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${circle}<path d="${path}"/></svg>${label ? `<span>${label}</span>` : ''}`;
    }
}
