const CONTAINER = '[js-expand-container]';
const BUTTON = '[js-expand-button]';
const EXPANDED = 'aria-expanded';
const CONTROLS = 'aria-controls';
const HIDDEN = 'aria-hidden';

/**
 * Toggles the aria-expanded state of a button and syncs the aria-hidden state
 * of the element it controls.
 */
const toggle = (button: Element, expanded: boolean): boolean => {
    button.setAttribute(EXPANDED, String(expanded));

    const id = button.getAttribute(CONTROLS);
    const controls = id ? document.getElementById(id) : null;

    if (!controls) {
        return expanded;
    }

    controls.setAttribute(HIDDEN, expanded ? 'false' : 'true');

    return expanded;
};

/**
 * Handles a click on a tab button: expands the clicked tab and collapses all
 * sibling buttons within the same container.
 */
const toggleButton = (button: Element): void => {
    const alreadyExpanded = button.getAttribute(EXPANDED) === 'true';

    if (alreadyExpanded) {
        return;
    }

    toggle(button, true);

    const container = button.closest(CONTAINER);
    if (!container) {
        return;
    }

    container.querySelectorAll(BUTTON).forEach((sibling) => {
        if (sibling !== button) {
            toggle(sibling, false);
        }
    });
};

/**
 * Attaches click listeners to all tab buttons found in the document and
 * watches for dynamically added containers via a MutationObserver.
 */
const initButtons = (root: Element | Document = document): void => {
    root.querySelectorAll<HTMLElement>(BUTTON).forEach((button) => {
        button.addEventListener('click', () => toggleButton(button));
    });
};

export function init(): void {
    document.addEventListener('DOMContentLoaded', () => {
        initButtons();

        new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node instanceof HTMLElement) {
                        initButtons(node);
                    }
                });
            });
        }).observe(document.body, { childList: true, subtree: true });
    });
}
