const CUTOUT_BUTTON_SELECTOR = '.c-button.c-button__filled--inherit';

function getCanvasFont(style: CSSStyleDeclaration): string {
	return `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
}

function truncateText(context: CanvasRenderingContext2D, value: string, availableWidth: number): string {
	if (context.measureText(value).width <= availableWidth) {
		return value;
	}

	const suffix = '…';
	let start = 0;
	let end = value.length;

	while (start < end) {
		const middle = Math.ceil((start + end) / 2);
		if (context.measureText(`${value.slice(0, middle)}${suffix}`).width <= availableWidth) {
			start = middle;
		} else {
			end = middle - 1;
		}
	}

	return `${value.slice(0, start)}${suffix}`;
}

function syncCutoutLabel(button: HTMLElement): void {
	const measure = button.querySelector<HTMLElement>('.c-button__cutout-measure');
	const measureText = measure?.querySelector<HTMLElement>('.c-button__label-text');
	const cutoutText = button.querySelector<SVGTextElement>('.c-button__cutout-label-text');

	if (!measureText || !cutoutText) {
		return;
	}

	const originalLabel = cutoutText.dataset.cutoutLabel ?? '';
	const availableWidth = measureText.getBoundingClientRect().width;
	const context = document.createElement('canvas').getContext('2d');

	if (!context || availableWidth <= 0) {
		return;
	}

	context.font = getCanvasFont(getComputedStyle(cutoutText));
	cutoutText.textContent = truncateText(context, originalLabel, availableWidth);
}

function syncAllCutoutLabels(): void {
	document.querySelectorAll<HTMLElement>(CUTOUT_BUTTON_SELECTOR).forEach(syncCutoutLabel);
}

export function init(): void {
	document.addEventListener('DOMContentLoaded', () => {
		syncAllCutoutLabels();
		document.fonts?.ready.then(syncAllCutoutLabels);

		const observer = new ResizeObserver(syncAllCutoutLabels);
		document.querySelectorAll<HTMLElement>(CUTOUT_BUTTON_SELECTOR).forEach((button) => observer.observe(button));
	});
}
