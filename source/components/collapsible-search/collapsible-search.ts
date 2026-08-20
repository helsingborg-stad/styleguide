/** CSS class applied to the wrapper when the panel is open. */
const EXPANDED_CLASS = 'c-collapsible-search--expanded';

/** Attribute selector used to find all collapsible-search root elements. */
const ROOT_SELECTOR = '[data-js-collapsible-search]';

/**
 * CollapsibleSearch
 *
 * Manages one instance of the collapsible-search component:
 *
 * - Clicking the trigger opens the panel and focuses the input.
 * - Clicking the close button or pressing Escape collapses the panel and
 *   returns focus to the trigger.
 * - Clicking outside the component collapses the panel.
 * - Keyboard-navigating focus completely away from the component closes it.
 */
class CollapsibleSearch {
	private readonly root: HTMLElement;
	private readonly trigger!: HTMLButtonElement;
	private readonly panel!: HTMLFormElement;
	private readonly input!: HTMLInputElement;
	private readonly closeButton!: HTMLButtonElement;

	private readonly onDocumentClickBound!: (event: MouseEvent) => void;
	private readonly onKeydownBound!: (event: KeyboardEvent) => void;
	private readonly onFocusOutBound!: (event: FocusEvent) => void;

	constructor(root: HTMLElement) {
		this.root = root;

		const trigger = root.querySelector<HTMLButtonElement>('[data-js-collapsible-search-trigger]');
		const panel = root.querySelector<HTMLFormElement>('[data-js-collapsible-search] > form') ?? root.querySelector<HTMLFormElement>('[class$="__panel"]');
		const input = root.querySelector<HTMLInputElement>('[data-js-collapsible-search-input]');
		const closeButton = root.querySelector<HTMLButtonElement>('[data-js-collapsible-search-close]');

		if (!trigger || !panel || !input || !closeButton) {
			return;
		}

		this.trigger = trigger;
		this.panel = panel;
		this.input = input;
		this.closeButton = closeButton;

		this.onDocumentClickBound = (e) => this.onDocumentClick(e);
		this.onKeydownBound = (e) => this.onKeydown(e);
		this.onFocusOutBound = (e) => this.onFocusOut(e);

		this.trigger.addEventListener('click', () => this.open());
		this.closeButton.addEventListener('click', () => this.close());

		// Sync initial expanded state that may have been server-rendered.
		if (this.root.classList.contains(EXPANDED_CLASS)) {
			this.attachGlobalListeners();
		}
	}

	// -------------------------------------------------------------------------
	// Public API
	// -------------------------------------------------------------------------

	/**
	 * Expand the search panel.
	 */
	open(): void {
		if (this.isOpen()) {
			return;
		}

		this.root.classList.add(EXPANDED_CLASS);
		this.trigger.setAttribute('aria-expanded', 'true');
		this.panel.removeAttribute('inert');
		this.panel.setAttribute('aria-hidden', 'false');

		document.addEventListener('click', this.onDocumentClickBound);
		document.addEventListener('keydown', this.onKeydownBound);

		// Double-rAF: the first frame applies the CSS expanded class; the second
		// frame runs after the panel's initial paint so the input is focusable.
		requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				this.input.focus();
				this.root.addEventListener('focusout', this.onFocusOutBound);
			});
		});
	}

	/**
	 * Collapse the search panel and return focus to the trigger.
	 */
	close(): void {
		if (!this.isOpen()) {
			return;
		}

		this.root.classList.remove(EXPANDED_CLASS);
		this.trigger.setAttribute('aria-expanded', 'false');
		this.panel.setAttribute('inert', '');
		this.panel.setAttribute('aria-hidden', 'true');

		this.trigger.focus();

		this.detachGlobalListeners();
	}

	/**
	 * Returns true when the panel is currently expanded.
	 */
	isOpen(): boolean {
		return this.root.classList.contains(EXPANDED_CLASS);
	}

	// -------------------------------------------------------------------------
	// Internal event handlers
	// -------------------------------------------------------------------------

	private onDocumentClick(event: MouseEvent): void {
		if (event.target instanceof Node && !this.root.contains(event.target)) {
			this.close();
		}
	}

	private onKeydown(event: KeyboardEvent): void {
		if (event.key === 'Escape') {
			event.preventDefault();
			this.close();
		}
	}

	private onFocusOut(_event: FocusEvent): void {
		// Defer so focus can settle after the current event loop tick.
		// relatedTarget can be null mid-transition (e.g. visibility change on
		// the trigger), so we rely on document.activeElement instead.
		setTimeout(() => {
			if (!this.root.contains(document.activeElement)) {
				this.close();
			}
		}, 0);
	}

	// -------------------------------------------------------------------------
	// Listener lifecycle
	// -------------------------------------------------------------------------

	private attachGlobalListeners(): void {
		document.addEventListener('click', this.onDocumentClickBound);
		document.addEventListener('keydown', this.onKeydownBound);
		this.root.addEventListener('focusout', this.onFocusOutBound);
	}

	private detachGlobalListeners(): void {
		document.removeEventListener('click', this.onDocumentClickBound);
		document.removeEventListener('keydown', this.onKeydownBound);
		this.root.removeEventListener('focusout', this.onFocusOutBound);
	}
}

// -------------------------------------------------------------------------
// Bootstrap
// -------------------------------------------------------------------------

/**
 * Initialise all collapsible-search components currently in the DOM.
 */
export function init(): void {
	document.querySelectorAll<HTMLElement>(ROOT_SELECTOR).forEach((root) => {
		new CollapsibleSearch(root);
	});
}

export default CollapsibleSearch;
