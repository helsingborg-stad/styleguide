import { CUSTOMIZE_MANUAL_TRIGGER_SELECTOR } from '../../state/runtimeConstants';

export function bindManualCustomizationInitTrigger(initializer: () => Promise<void>): void {
	const triggers = document.querySelectorAll<HTMLElement>(CUSTOMIZE_MANUAL_TRIGGER_SELECTOR);
	if (triggers.length === 0) {
		void initializer();
		return;
	}

	for (const trigger of triggers) {
		trigger.addEventListener('click', () => {
			void initializer();
		});
	}
}
