/** Escape plain user text for HTML text and quoted-attribute contexts. */
export function escapeHtml(value: unknown): string {
    return String(value ?? '').replace(/[&<>"']/g, c => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    }[c]!));
}

export function ratingValue(value: unknown): number {
    const number = Number(value);
    return Number.isFinite(number) ? Math.min(5, Math.max(0, Math.round(number))) : 0;
}
