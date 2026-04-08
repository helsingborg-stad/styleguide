const SPLIT_STORAGE_KEY = 'design-builder-split';
const MINIMUM_SPLIT_PERCENT = 20;
const MAXIMUM_SPLIT_PERCENT = 80;

export function initializePreviewSplitDivider(): void {
	const layout = document.querySelector<HTMLElement>('.db-layout');
	const divider = document.querySelector<HTMLElement>('[data-db-divider]');
	if (!layout || !divider) return;
	if (divider.dataset.dbDividerInitialized === 'true') return;

	divider.dataset.dbDividerInitialized = 'true';

	const saved = localStorage.getItem(SPLIT_STORAGE_KEY);
	if (saved) {
		const ratio = parseFloat(saved);
		if (ratio >= MINIMUM_SPLIT_PERCENT && ratio <= MAXIMUM_SPLIT_PERCENT) {
			layout.style.setProperty('--db-split', `${ratio}%`);
		}
	}

	const onPointerMove = (event: PointerEvent) => {
		const rect = layout.getBoundingClientRect();
		let ratio = ((event.clientX - rect.left) / rect.width) * 100;
		ratio = Math.max(MINIMUM_SPLIT_PERCENT, Math.min(MAXIMUM_SPLIT_PERCENT, ratio));
		layout.style.setProperty('--db-split', `${ratio}%`);
	};

	const onPointerUp = (event: PointerEvent) => {
		divider.classList.remove('is-dragging');
		document.body.style.userSelect = '';
		document.body.style.cursor = '';
		divider.releasePointerCapture(event.pointerId);
		divider.removeEventListener('pointermove', onPointerMove);
		divider.removeEventListener('pointerup', onPointerUp);

		const current = layout.style.getPropertyValue('--db-split');
		if (current) {
			localStorage.setItem(SPLIT_STORAGE_KEY, parseFloat(current).toString());
		}
	};

	divider.addEventListener('pointerdown', (event: PointerEvent) => {
		event.preventDefault();
		divider.classList.add('is-dragging');
		document.body.style.userSelect = 'none';
		document.body.style.cursor = 'col-resize';
		divider.setPointerCapture(event.pointerId);
		divider.addEventListener('pointermove', onPointerMove);
		divider.addEventListener('pointerup', onPointerUp);
	});
}
