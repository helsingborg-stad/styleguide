const CUTOUT_BUTTON_SELECTOR = '.c-button.c-button__filled--inherit';
const TRANSPARENT = 'rgba(0, 0, 0, 0)';

function findSurfaceColor(button: HTMLElement): string | null {
	let ancestor = button.parentElement;

	while (ancestor) {
		const backgroundColor = getComputedStyle(ancestor).backgroundColor;

		if (backgroundColor !== 'transparent' && backgroundColor !== TRANSPARENT) {
			return backgroundColor;
		}

		ancestor = ancestor.parentElement;
	}

	return null;
}

function syncCutoutSurface(button: HTMLElement): void {
	const surfaceColor = findSurfaceColor(button);

	if (surfaceColor && button.style.getPropertyValue('--c-button-cutout-surface') !== surfaceColor) {
		button.style.setProperty('--c-button-cutout-surface', surfaceColor);
	}
}

function syncAllCutoutSurfaces(): void {
	document.querySelectorAll<HTMLElement>(CUTOUT_BUTTON_SELECTOR).forEach(syncCutoutSurface);
}

export function init(): void {
	document.addEventListener('DOMContentLoaded', () => {
		syncAllCutoutSurfaces();

		let frame = 0;
		const observer = new MutationObserver(() => {
			cancelAnimationFrame(frame);
			frame = requestAnimationFrame(syncAllCutoutSurfaces);
		});

		observer.observe(document.documentElement, {
			attributeFilter: ['class', 'style'],
			attributes: true,
			subtree: true,
		});
	});
}
