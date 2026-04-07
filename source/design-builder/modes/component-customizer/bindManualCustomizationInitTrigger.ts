import { CUSTOMIZE_MANUAL_TRIGGER_SELECTOR } from '../../state/runtimeConstants';

function resolveInitializationClickTargets(root: HTMLElement): HTMLElement[] {
	if (root.matches('[data-js-toggle-trigger]')) {
		return [root];
	}

	const nestedToggleTriggers = Array.from(root.querySelectorAll<HTMLElement>('[data-js-toggle-trigger]'));
	return nestedToggleTriggers.length > 0 ? nestedToggleTriggers : [root];
}

export function bindManualCustomizationInitTrigger(initializer: () => Promise<void>): () => void {
	const triggerRoots = Array.from(document.querySelectorAll<HTMLElement>(CUSTOMIZE_MANUAL_TRIGGER_SELECTOR));
	if (triggerRoots.length === 0) {
		void initializer();
		return () => {};
	}

	const clickTargets = Array.from(
		new Set(triggerRoots.flatMap((triggerRoot) => resolveInitializationClickTargets(triggerRoot))),
	);

	const handleTriggerClick = () => {
		void initializer();
	};

	for (const clickTarget of clickTargets) {
		clickTarget.addEventListener('click', handleTriggerClick);
	}

	return () => {
		for (const clickTarget of clickTargets) {
			clickTarget.removeEventListener('click', handleTriggerClick);
		}
	};
}
