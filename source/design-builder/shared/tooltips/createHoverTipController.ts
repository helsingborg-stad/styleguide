/**
 * Hover tip controller for showing token metadata inside the design-builder panel.
 */

const DEFAULT_VARIABLE_MESSAGE = 'Hover an option to preview token details';
const DEFAULT_DESCRIPTION_MESSAGE = 'Token description is shown here when available.';
const HOVER_TIP_TARGET_SELECTOR = '[data-tip-variable]';

export type HoverTipController = {
	refresh: () => void;
	dispose: () => void;
};

/**
 * Creates delegated hover tip listeners for a design-builder root element.
 */
export function createHoverTipController(root: HTMLElement): HoverTipController {
	const resetHoverTip = (): void => {
		const variableElement = root.querySelector<HTMLElement>('[data-hover-tip-variable]');
		const descriptionElement = root.querySelector<HTMLElement>('[data-hover-tip-description]');
		if (!variableElement || !descriptionElement) {
			return;
		}

		variableElement.textContent = DEFAULT_VARIABLE_MESSAGE;
		descriptionElement.textContent = DEFAULT_DESCRIPTION_MESSAGE;
	};

	const updateHoverTip = (target: EventTarget | null): void => {
		const variableElement = root.querySelector<HTMLElement>('[data-hover-tip-variable]');
		const descriptionElement = root.querySelector<HTMLElement>('[data-hover-tip-description]');
		if (!variableElement || !descriptionElement) {
			return;
		}

		if (!(target instanceof Element)) {
			resetHoverTip();
			return;
		}

		const tipTarget = target.closest<HTMLElement>(HOVER_TIP_TARGET_SELECTOR);
		if (!tipTarget) {
			resetHoverTip();
			return;
		}

		variableElement.textContent = tipTarget.dataset.tipVariable?.trim() || DEFAULT_VARIABLE_MESSAGE;
		descriptionElement.textContent = tipTarget.dataset.tipDescription?.trim() || DEFAULT_DESCRIPTION_MESSAGE;
	};

	const handlePointerOver = (event: Event): void => {
		updateHoverTip(event.target);
	};

	const handlePointerOut = (event: Event): void => {
		const tipTarget = event.target instanceof Element ? event.target.closest<HTMLElement>(HOVER_TIP_TARGET_SELECTOR) : null;
		if (!tipTarget) {
			return;
		}

		const relatedTarget = (event as PointerEvent).relatedTarget;
		const relatedTipTarget = relatedTarget instanceof Element ? relatedTarget.closest<HTMLElement>(HOVER_TIP_TARGET_SELECTOR) : null;
		if (relatedTipTarget === tipTarget) {
			return;
		}

		resetHoverTip();
	};

	const handleFocusIn = (event: Event): void => {
		updateHoverTip(event.target);
	};

	const handleFocusOut = (event: Event): void => {
		const tipTarget = event.target instanceof Element ? event.target.closest<HTMLElement>(HOVER_TIP_TARGET_SELECTOR) : null;
		if (!tipTarget) {
			return;
		}

		const relatedTarget = (event as FocusEvent).relatedTarget;
		const relatedTipTarget = relatedTarget instanceof Element ? relatedTarget.closest<HTMLElement>(HOVER_TIP_TARGET_SELECTOR) : null;
		if (relatedTipTarget === tipTarget) {
			return;
		}

		resetHoverTip();
	};

	root.addEventListener('pointerover', handlePointerOver);
	root.addEventListener('pointerout', handlePointerOut);
	root.addEventListener('focusin', handleFocusIn);
	root.addEventListener('focusout', handleFocusOut);
	resetHoverTip();

	return {
		refresh: resetHoverTip,
		dispose: () => {
			root.removeEventListener('pointerover', handlePointerOver);
			root.removeEventListener('pointerout', handlePointerOut);
			root.removeEventListener('focusin', handleFocusIn);
			root.removeEventListener('focusout', handleFocusOut);
		},
	};
}