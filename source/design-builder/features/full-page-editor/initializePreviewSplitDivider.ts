import { MAX_SPLIT, MIN_SPLIT } from '../../shared/constants/designBuilderRuntimeConstants';
import { emitDesignBuilderActionEvent } from '../../shared/events/designBuilderActionEvents';
import type { DesignBuilderRootElement } from '../../web-component/designBuilderRootContracts';
import { DesignBuilderSplitLocalStorageStore, type DesignBuilderSplitStore } from './DesignBuilderSplitLocalStorageStore';

export function initializePreviewSplitDivider(
	splitStore: DesignBuilderSplitStore = new DesignBuilderSplitLocalStorageStore(),
	hostElement?: DesignBuilderRootElement,
): void {
	const layout = document.querySelector<HTMLElement>('.db-layout');
	const divider = document.querySelector<HTMLElement>('[data-db-divider]');
	if (!layout || !divider) return;
	if (divider.dataset.dbDividerInitialized === 'true') return;

	divider.dataset.dbDividerInitialized = 'true';

	const saved = splitStore.load();
	if (saved !== null) {
		layout.style.setProperty('--db-split', `${saved}%`);
	}

	const onPointerMove = (event: PointerEvent) => {
		const rect = layout.getBoundingClientRect();
		let ratio = ((event.clientX - rect.left) / rect.width) * 100;
		ratio = Math.max(MIN_SPLIT, Math.min(MAX_SPLIT, ratio));
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
			const split = parseFloat(current);
			splitStore.save(split);
			if (hostElement) {
				emitDesignBuilderActionEvent(hostElement, {
					action: 'split-change',
					mode: 'full-page',
					state: hostElement.overrideState,
					metadata: { split },
				});
			}
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
