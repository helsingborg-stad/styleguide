import {
	DESIGN_BUILDER_MODE_COMPONENT_CUSTOMIZER,
	DESIGN_BUILDER_MODE_FULL_PAGE,
	type DesignBuilderMode,
	type DesignBuilderModeSwitch,
} from '../root/types';

function getModeLabel(mode: DesignBuilderMode): string {
	if (mode === DESIGN_BUILDER_MODE_COMPONENT_CUSTOMIZER) {
		return 'Components';
	}

	return 'Tokens';
}

export function createModeSwitcher(modeSwitch: DesignBuilderModeSwitch): HTMLElement | null {
	if (modeSwitch.availableModes.length < 2) {
		return null;
	}

	const switcher = document.createElement('div');
	switcher.className = 'db-mode-switch';
	switcher.setAttribute('role', 'group');
	switcher.setAttribute('aria-label', 'Design Builder mode');

	for (const mode of modeSwitch.availableModes) {
		const button = document.createElement('button');
		button.type = 'button';
		button.className = 'db-mode-switch-button';
		button.textContent = getModeLabel(mode);

		if (mode === modeSwitch.activeMode) {
			button.classList.add('db-mode-switch-button-active');
			button.setAttribute('aria-pressed', 'true');
		} else {
			button.setAttribute('aria-pressed', 'false');
			button.addEventListener('click', () => {
				modeSwitch.onSwitch(mode);
			});
		}

		switcher.appendChild(button);
	}

	return switcher;
}
