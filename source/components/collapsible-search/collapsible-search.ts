/** CSS class applied to the wrapper when the panel is open. */
const EXPANDED_CLASS = 'c-collapsible-search--expanded';

/** Attribute selector used to find all collapsible-search root elements. */
const ROOT_SELECTOR = '[data-js-collapsible-search]';

/**
 * Manages one collapsible-search instance. The component owns its full state
 * because opening and closing also changes focus, inertness and ARIA values.
 */
class CollapsibleSearch {
	private static initializedRoots = new WeakSet<HTMLElement>();
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
		if (CollapsibleSearch.initializedRoots.has(root)) return;

		const trigger = root.querySelector<HTMLButtonElement>('[data-js-collapsible-search-trigger]');
		const panel = root.querySelector<HTMLFormElement>(':scope > form');
		const input = root.querySelector<HTMLInputElement>('[data-js-collapsible-search-input]');
		const closeButton = root.querySelector<HTMLButtonElement>('[data-js-collapsible-search-close]');

		if (!trigger || !panel || !input || !closeButton) return;

		CollapsibleSearch.initializedRoots.add(root);
		this.trigger = trigger;
		this.panel = panel;
		this.input = input;
		this.closeButton = closeButton;
		this.onDocumentClickBound = (event) => this.onDocumentClick(event);
		this.onKeydownBound = (event) => this.onKeydown(event);
		this.onFocusOutBound = (event) => this.onFocusOut(event);

		this.trigger.addEventListener('click', () => this.open());
		this.closeButton.addEventListener('click', () => this.close());

		if (this.isOpen()) this.attachGlobalListeners();
	}

	open(): void {
		if (this.isOpen()) return;

		this.root.classList.add(EXPANDED_CLASS);
		this.trigger.setAttribute('aria-expanded', 'true');
		this.panel.removeAttribute('inert');
		this.panel.setAttribute('aria-hidden', 'false');
		this.attachGlobalListeners();

		requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				if (!this.isOpen()) return;
				this.input.focus();
			});
		});
	}

	close(): void {
		if (!this.isOpen()) return;

		this.root.classList.remove(EXPANDED_CLASS);
		this.trigger.setAttribute('aria-expanded', 'false');
		this.panel.setAttribute('inert', '');
		this.panel.setAttribute('aria-hidden', 'true');
		this.detachGlobalListeners();
		this.trigger.focus();
	}

	isOpen(): boolean {
		return this.root.classList.contains(EXPANDED_CLASS);
	}

	private onDocumentClick(event: MouseEvent): void {
		if (event.target instanceof Node && !this.root.contains(event.target)) this.close();
	}

	private onKeydown(event: KeyboardEvent): void {
		if (event.key === 'Escape') {
			event.preventDefault();
			this.close();
		}
	}

	private onFocusOut(_event: FocusEvent): void {
		setTimeout(() => {
			if (!this.root.contains(document.activeElement)) this.close();
		}, 0);
	}

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

/** Initialise all collapsible-search components currently in the DOM. */
export function init(): void {
	document.querySelectorAll<HTMLElement>(ROOT_SELECTOR).forEach((root) => new CollapsibleSearch(root));
}

export default CollapsibleSearch;
