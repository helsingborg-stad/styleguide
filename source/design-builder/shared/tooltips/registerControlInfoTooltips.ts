/**
 * Registers a floating tooltip for design-builder control info buttons.
 */

const CONTROL_INFO_TOOLTIP_SELECTOR = '.db-control-info-btn.db-tooltip-target[data-tooltip]';
const TOOLTIP_ID = 'db-control-info-tooltip';
const TOOLTIP_VIEWPORT_MARGIN = 12;
const TOOLTIP_OFFSET = 6;
const TOOLTIP_ARROW_MARGIN = 12;

type ControlInfoTooltipState = {
	activeAnchor: HTMLElement | null;
	isRegistered: boolean;
	tooltipElement: HTMLDivElement | null;
};

const state: ControlInfoTooltipState = {
	activeAnchor: null,
	isRegistered: false,
	tooltipElement: null,
};

/**
 * Creates the shared tooltip element when needed.
 */
function ensureTooltipElement(): HTMLDivElement {
	if (state.tooltipElement?.isConnected) {
		return state.tooltipElement;
	}

	const tooltipElement = document.createElement('div');
	tooltipElement.id = TOOLTIP_ID;
	tooltipElement.className = 'db-floating-tooltip';
	tooltipElement.setAttribute('role', 'tooltip');
	tooltipElement.setAttribute('aria-hidden', 'true');
	document.body.appendChild(tooltipElement);
	state.tooltipElement = tooltipElement;
	return tooltipElement;
}

/**
 * Returns the tooltip anchor associated with an event target.
 */
function getTooltipAnchor(target: EventTarget | null): HTMLElement | null {
	if (!(target instanceof Element)) {
		return null;
	}

	return target.closest<HTMLElement>(CONTROL_INFO_TOOLTIP_SELECTOR);
}

/**
 * Positions the floating tooltip within the viewport.
 */
function positionTooltip(anchor: HTMLElement, tooltipElement: HTMLDivElement): void {
	const anchorRect = anchor.getBoundingClientRect();
	const tooltipRect = tooltipElement.getBoundingClientRect();
	const anchorCenter = anchorRect.left + anchorRect.width / 2;
	const maxLeft = Math.max(TOOLTIP_VIEWPORT_MARGIN, window.innerWidth - tooltipRect.width - TOOLTIP_VIEWPORT_MARGIN);
	const preferredLeft = anchorCenter - tooltipRect.width / 2;
	const left = Math.min(maxLeft, Math.max(TOOLTIP_VIEWPORT_MARGIN, preferredLeft));
	const top = anchorRect.bottom + TOOLTIP_OFFSET;
	const arrowLeft = Math.min(tooltipRect.width - TOOLTIP_ARROW_MARGIN, Math.max(TOOLTIP_ARROW_MARGIN, anchorCenter - left));

	tooltipElement.style.left = `${Math.round(left)}px`;
	tooltipElement.style.top = `${Math.round(top)}px`;
	tooltipElement.style.setProperty('--db-tooltip-arrow-left', `${Math.round(arrowLeft)}px`);
	tooltipElement.dataset.placement = 'bottom';
}

/**
 * Shows the tooltip for the provided anchor.
 */
function showTooltip(anchor: HTMLElement): void {
	const tooltipText = anchor.dataset.tooltip?.trim();
	if (!tooltipText) {
		return;
	}

	const tooltipElement = ensureTooltipElement();
	if (state.activeAnchor && state.activeAnchor !== anchor) {
		state.activeAnchor.removeAttribute('aria-describedby');
	}

	state.activeAnchor = anchor;
	anchor.setAttribute('aria-describedby', TOOLTIP_ID);
	tooltipElement.textContent = tooltipText;
	tooltipElement.style.visibility = 'hidden';
	tooltipElement.classList.add('db-floating-tooltip-visible');
	tooltipElement.setAttribute('aria-hidden', 'false');
	positionTooltip(anchor, tooltipElement);
	tooltipElement.style.visibility = '';
}

/**
 * Hides the currently visible tooltip.
 */
function hideTooltip(anchor?: HTMLElement | null): void {
	if (anchor && state.activeAnchor !== anchor) {
		return;
	}

	state.activeAnchor?.removeAttribute('aria-describedby');
	state.activeAnchor = null;

	if (!state.tooltipElement) {
		return;
	}

	state.tooltipElement.classList.remove('db-floating-tooltip-visible');
	state.tooltipElement.setAttribute('aria-hidden', 'true');
	state.tooltipElement.style.visibility = '';
	state.tooltipElement.textContent = '';
	state.tooltipElement.style.left = '';
	state.tooltipElement.style.top = '';
	state.tooltipElement.style.removeProperty('--db-tooltip-arrow-left');
	delete state.tooltipElement.dataset.placement;
}

/**
 * Repositions the tooltip when the viewport changes.
 */
function repositionActiveTooltip(): void {
	if (!state.activeAnchor || !state.tooltipElement || state.tooltipElement.getAttribute('aria-hidden') !== 'false') {
		return;
	}

	positionTooltip(state.activeAnchor, state.tooltipElement);
}

/**
 * Registers delegated tooltip handlers once per document.
 */
export function registerControlInfoTooltips(): void {
	if (state.isRegistered) {
		return;
	}

	state.isRegistered = true;

	document.addEventListener(
		'pointerover',
		(event) => {
			const anchor = getTooltipAnchor(event.target);
			if (!anchor || state.activeAnchor === anchor) {
				return;
			}

			showTooltip(anchor);
		},
		true,
	);

	document.addEventListener(
		'pointerout',
		(event) => {
			const anchor = getTooltipAnchor(event.target);
			if (!anchor) {
				return;
			}

			const relatedAnchor = getTooltipAnchor((event as PointerEvent).relatedTarget ?? null);
			if (relatedAnchor === anchor) {
				return;
			}

			hideTooltip(anchor);
		},
		true,
	);

	document.addEventListener(
		'focusin',
		(event) => {
			const anchor = getTooltipAnchor(event.target);
			if (!anchor) {
				return;
			}

			showTooltip(anchor);
		},
		true,
	);

	document.addEventListener(
		'focusout',
		(event) => {
			const anchor = getTooltipAnchor(event.target);
			if (!anchor) {
				return;
			}

			const relatedAnchor = getTooltipAnchor((event as FocusEvent).relatedTarget ?? null);
			if (relatedAnchor === anchor) {
				return;
			}

			hideTooltip(anchor);
		},
		true,
	);

	document.addEventListener(
		'pointerdown',
		(event) => {
			if (state.activeAnchor && getTooltipAnchor(event.target) !== state.activeAnchor) {
				hideTooltip(state.activeAnchor);
			}
		},
		true,
	);

	window.addEventListener('resize', repositionActiveTooltip);
	document.addEventListener('scroll', repositionActiveTooltip, true);
}

/**
 * Resets tooltip state for isolated tests.
 */
export function resetControlInfoTooltipsForTests(): void {
	hideTooltip();
	state.tooltipElement?.remove();
	state.tooltipElement = null;
}

registerControlInfoTooltips();
