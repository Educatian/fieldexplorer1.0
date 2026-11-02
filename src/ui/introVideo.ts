/** Load Drive only on request; navigating away from the introduction stops playback. */
export function installIntroVideo(): void {
    const details = document.querySelector<HTMLDetailsElement>('.intro-on-demand');
    const frame = details?.querySelector<HTMLIFrameElement>('iframe[data-src]');
    const modal = details?.closest<HTMLElement>('.modal-overlay');
    if (!details || !frame || !modal) return;
    const sync = () => {
        if (details.open && modal.classList.contains('visible')) {
            if (!frame.hasAttribute('src')) frame.src = frame.dataset.src!;
        } else {
            frame.removeAttribute('src');
        }
    };
    details.addEventListener('toggle', sync);
    new MutationObserver(() => {
        if (!modal.classList.contains('visible')) details.open = false;
        sync();
    }).observe(modal, {attributes: true, attributeFilter: ['class']});
    sync();
}
