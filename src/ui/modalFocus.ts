/** Shared focus lifecycle for the app's existing modal surfaces. */
export function installModalFocus(): void {
    const selector = '[role="dialog"], .modal-overlay.visible > .modal, .collab-container, .feed-container';
    type State = {dialog: HTMLElement; trigger: HTMLElement | null};
    const stack: State[] = [];
    const inertBefore = new Map<HTMLElement, boolean>();
    // CSS keeps visibility during the closing transition. Treat a closed overlay as
    // closed immediately so its focus trap/inert state cannot outlive that transition.
    const visible = (e: HTMLElement) => e.isConnected && !e.closest('.modal-overlay:not(.visible)')
        && e.getClientRects().length > 0 && getComputedStyle(e).visibility !== 'hidden';
    const focusable = (dialog: HTMLElement) => [...dialog.querySelectorAll<HTMLElement>(
        'button:not([disabled]),a[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])',
    )].filter(e => visible(e) && !e.closest('[hidden]') && e.tabIndex >= 0);
    const focusFirst = (dialog: HTMLElement) => (focusable(dialog)[0] || dialog).focus({preventScroll: true});
    const restoreInert = () => { for (const [node, old] of inertBefore) node.inert = old; inertBefore.clear(); };
    const applyInert = (dialog: HTMLElement) => {
        restoreInert();
        let root = dialog;
        while (root.parentElement && root.parentElement !== document.body) root = root.parentElement;
        for (const node of [...document.body.children]) {
            if (node instanceof HTMLElement && node !== root && !['SCRIPT','STYLE','LINK'].includes(node.tagName)) {
                inertBefore.set(node, node.inert); node.inert = true;
            }
        }
    };
    const reconcile = () => {
        const dialogs = [...document.querySelectorAll<HTMLElement>(selector)].filter(visible);
        const current = stack.at(-1);
        for (const dialog of dialogs) {
            if (stack.some(s => s.dialog === dialog)) continue;
            const trigger = document.activeElement instanceof HTMLElement ? document.activeElement : null;
            dialog.setAttribute('role', 'dialog'); dialog.setAttribute('aria-modal', 'true');
            if (!dialog.hasAttribute('aria-label') && !dialog.hasAttribute('aria-labelledby')) {
                dialog.setAttribute('aria-label', dialog.querySelector('h2,h3')?.textContent?.trim() || '대화상자');
            }
            dialog.tabIndex = -1;
            stack.push({dialog, trigger});
        }
        let returnTo: HTMLElement | null = null;
        for (let i = stack.length - 1; i >= 0; i--) {
            if (!dialogs.includes(stack[i].dialog)) { returnTo ||= stack[i].trigger; stack.splice(i, 1); }
        }
        const next = stack.at(-1);
        if (current?.dialog !== next?.dialog) {
            restoreInert();
            if (next) {
                applyInert(next.dialog);
                if (returnTo && next.dialog.contains(returnTo)) returnTo.focus({preventScroll:true});
                else if (!next.dialog.contains(document.activeElement)) focusFirst(next.dialog);
            } else if (returnTo) {
                const target = visible(returnTo) ? returnTo : document.getElementById('tb-more-btn');
                if (target && visible(target)) target.focus({preventScroll:true});
            }
        }
        for (const close of document.querySelectorAll<HTMLButtonElement>('.fit-close,.sidebar-close,.collab-close,.feed-close')) {
            if (!close.hasAttribute('aria-label')) close.setAttribute('aria-label', '닫기');
        }
    };
    document.addEventListener('keydown', event => {
        const current = stack.at(-1)?.dialog;
        if (!current || event.key !== 'Tab') return;
        const items = focusable(current), first = items[0], last = items.at(-1);
        if (!first) { event.preventDefault(); current.focus(); return; }
        if (event.shiftKey && (document.activeElement === first || !current.contains(document.activeElement))) {
            event.preventDefault(); last!.focus();
        } else if (!event.shiftKey && (document.activeElement === last || !current.contains(document.activeElement))) {
            event.preventDefault(); first.focus();
        }
    }, true);
    document.addEventListener('focusin', event => {
        const current = stack.at(-1)?.dialog;
        if (current && event.target instanceof Node && !current.contains(event.target)) focusFirst(current);
    });
    new MutationObserver(reconcile).observe(document.body, {subtree:true, childList:true, attributes:true, attributeFilter:['class','style','hidden']});
    reconcile();
}
