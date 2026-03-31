import { createControl, createContrastPair, createReadOnlyControl, createSwatchBand } from './controls';
import type { TokenCategory, TokenSetting } from './core/types';

export type CategoryChangeCallback = (variable: string, value: string, defaultValue: string) => void;

/**
 * Renders a single token category section (collapsible accordion)
 * with its controls, handling contrast-pair grouping and swatch bands.
 */
export class CategoryRenderer {
	private showLockedFields: boolean;

	constructor(showLockedFields: boolean) {
		this.showLockedFields = showLockedFields;
	}

	render(
		category: TokenCategory,
		getOverride: (variable: string) => string | undefined,
		onChange: CategoryChangeCallback,
	): HTMLElement {
		const section = document.createElement('section');
		section.className = 'db-category';
		section.dataset.categoryId = category.id;

		const header = document.createElement('div');
		header.className = 'db-category__header';
		header.innerHTML = `
			<h2 class="db-category__title">${category.label}</h2>
			${category.description ? `<p class="db-category__description">${category.description}</p>` : ''}
			<span class="db-category__toggle material-symbols-outlined">expand_more</span>
		`;
		section.appendChild(header);

		const body = document.createElement('div');
		body.className = 'db-category__body';

		if (category.present === 'swatch') {
			body.appendChild(createSwatchBand(category.settings));
		} else {
			this.renderSettingsControls(body, category.settings, getOverride, onChange);
		}

		section.appendChild(body);

		header.addEventListener('click', () => {
			section.classList.toggle('db-category--collapsed');
		});

		return section;
	}

	private renderSettingsControls(
		body: HTMLElement,
		settings: TokenSetting[],
		getOverride: (variable: string) => string | undefined,
		onChange: CategoryChangeCallback,
	): void {
		const settingsMap = new Map<string, TokenSetting>();
		for (const setting of settings) {
			settingsMap.set(setting.variable, setting);
		}

		const contrastVars = new Set<string>();
		for (const s of settings) {
			if (s.contrast) {
				const refs = Array.isArray(s.contrast) ? s.contrast : [s.contrast];
				for (const variable of refs) {
					const contrastSetting = settingsMap.get(variable);
					if (contrastSetting && !contrastSetting.locked) {
						contrastVars.add(variable);
					}
				}
			}
		}

		for (const setting of settings) {
			if (setting.locked) {
				if (!this.showLockedFields) continue;
				const currentValue = getOverride(setting.variable) || setting.default;
				body.appendChild(createReadOnlyControl(setting, currentValue));
				continue;
			}

			if (contrastVars.has(setting.variable)) continue;

			if (setting.contrast) {
				const refs = Array.isArray(setting.contrast) ? setting.contrast : [setting.contrast];
				const contrasts: { setting: TokenSetting; value: string }[] = [];
				for (const contrastVar of refs) {
					const contrastSetting = settingsMap.get(contrastVar);
					if (contrastSetting && !contrastSetting.locked) {
						contrasts.push({
							setting: contrastSetting,
							value: getOverride(contrastVar) || contrastSetting.default,
						});
					}
				}
				if (contrasts.length > 0) {
					const baseVal = getOverride(setting.variable) || setting.default;
					body.appendChild(
						createContrastPair(setting, contrasts, baseVal, (variable, value) => {
							const allSettings = [setting, ...contrasts.map((c) => c.setting)];
							const def = allSettings.find((s) => s.variable === variable)?.default || '';
							onChange(variable, value, def);
						}),
					);
				}
			} else {
				const currentValue = getOverride(setting.variable) || setting.default;
				const control = createControl(setting, currentValue, (variable, value) => {
					onChange(variable, value, setting.default);
				});
				body.appendChild(control);
			}
		}
	}
}
