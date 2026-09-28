// Apply saved tokens before the page's interactive features initialize.
import './designTokenApply.ts';
import './app.js';

// A single observer also handles features added after the initial render.
function loadPageFeatures() {
    const pending = new Map([
        ['[data-tooltip]', () => import('./tooltip/tooltip.ts')],
        ['[popover]', () => import('./popover/popoverInit.ts')],
        ['[data-modifier-preview]', () => import('./doc/modifierPreview.ts')],
        ['input[data-datalist]', () => import('./datalistAutocomplete.ts')],
    ]);

    const loadMatching = (root) => {
        for (const [selector, load] of pending) {
            if (root.matches?.(selector) || root.querySelector?.(selector)) {
                pending.delete(selector);
                void load();
            }
        }
    };

    loadMatching(document.documentElement);
    if (pending.size === 0) return;

    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (node instanceof Element) loadMatching(node);
            }
        }
        if (pending.size === 0) observer.disconnect();
    });
    observer.observe(document.body, { childList: true, subtree: true });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadPageFeatures, { once: true });
} else {
    loadPageFeatures();
}
