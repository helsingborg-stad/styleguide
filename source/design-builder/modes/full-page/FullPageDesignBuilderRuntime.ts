import {
	createContrastPair,
	createControl,
	createReadOnlyControl,
	createSwatchBand,
	type TokenSetting,
} from '../../controls';
import { PresetManager, type StorageAdapter } from '../../storage';
import type { TokenCategory, TokenData } from '../../types/runtime';

export class FullPageDesignBuilderRuntime {
	private container: HTMLElement;
	private storage: StorageAdapter;
	private tokens: TokenData;
	private overrides: Record<string, string>;
	private saveTimeout: ReturnType<typeof setTimeout> | null = null;
	private presetManager: PresetManager;
	private presetBar: HTMLElement | null = null;
	private showLockedFields = false;

	constructor(container: HTMLElement, tokens: TokenData, storage: StorageAdapter) {
		this.container = container;
		this.tokens = tokens;
		this.storage = storage;
		this.presetManager = new PresetManager();
		this.overrides = storage.load();
		this.removeLockedOverrides();

		this.render();
		this.applyAll();
	}

	private removeLockedOverrides(): void {
		const lockedVariables = new Set<string>();

		for (const category of this.tokens.categories) {
			for (const setting of category.settings) {
				if (setting.locked) {
					lockedVariables.add(setting.variable);
				}
			}
		}

		let changed = false;
		for (const variable of lockedVariables) {
			if (variable in this.overrides) {
				delete this.overrides[variable];
				changed = true;
			}
		}

		if (changed) {
			this.storage.save(this.overrides);
		}
	}

	private render(): void {
		const header = document.createElement('div');
		header.className = 'db-header';
		header.innerHTML = `
      <h1 class="db-header__title">Design Builder</h1>
      <p class="db-header__subtitle">${this.tokens.name} v${this.tokens.version}</p>
      <div class="db-header__actions">
<label class="db-header__toggle-row" title="Show non-editable fields">
<input type="checkbox" data-action="toggle-locked" ${this.showLockedFields ? 'checked' : ''}>
<span>Show uneditable</span>
</label>
        <button type="button" class="db-btn" data-action="export">Export JSON</button>
        <button type="button" class="db-btn" data-action="import">Import JSON</button>
        <button type="button" class="db-btn db-btn--danger" data-action="reset">Reset All</button>
        <button type="button" class="db-btn db-btn--primary" data-action="save-preset">Save preset</button>
        <input type="file" accept=".json,application/json" data-action="import-file" hidden>
      </div>
    `;
		this.container.appendChild(header);

		const importInput = header.querySelector<HTMLInputElement>('[data-action="import-file"]');
		const toggleLockedInput = header.querySelector<HTMLInputElement>('[data-action="toggle-locked"]');
		toggleLockedInput?.addEventListener('change', () => {
			this.showLockedFields = toggleLockedInput.checked;
			this.container.innerHTML = '';
			this.render();
		});
		header.querySelector('[data-action="export"]')?.addEventListener('click', () => this.exportJson());
		header.querySelector('[data-action="import"]')?.addEventListener('click', () => importInput?.click());
		importInput?.addEventListener('change', () => {
			const file = importInput.files?.[0];
			if (!file) return;
			void this.importJson(file);
			importInput.value = '';
		});
		header.querySelector('[data-action="reset"]')?.addEventListener('click', () => this.resetAll());
		header.querySelector('[data-action="save-preset"]')?.addEventListener('click', () => this.savePreset());

		this.presetBar = this.renderPresetBar();
		this.container.appendChild(this.presetBar);

		const categoriesWrap = document.createElement('div');
		categoriesWrap.className = 'db-categories';

		for (const category of this.tokens.categories) {
			categoriesWrap.appendChild(this.renderCategory(category));
		}

		this.container.appendChild(categoriesWrap);
	}

	private renderCategory(category: TokenCategory): HTMLElement {
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
			const settingsMap = new Map<string, TokenSetting>();
			for (const setting of category.settings) {
				settingsMap.set(setting.variable, setting);
			}

			const contrastVars = new Set<string>();
			for (const setting of category.settings) {
				if (!setting.contrast) continue;
				const refs = Array.isArray(setting.contrast) ? setting.contrast : [setting.contrast];
				for (const variable of refs) {
					const contrastSetting = settingsMap.get(variable);
					if (contrastSetting && !contrastSetting.locked) {
						contrastVars.add(variable);
					}
				}
			}

			for (const setting of category.settings) {
				if (setting.locked) {
					if (!this.showLockedFields) {
						continue;
					}

					const currentValue = this.overrides[setting.variable] || setting.default;
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
								value: this.overrides[contrastVar] || contrastSetting.default,
							});
						}
					}
					if (contrasts.length > 0) {
						const baseVal = this.overrides[setting.variable] || setting.default;
						body.appendChild(
							createContrastPair(setting, contrasts, baseVal, (variable, value) => {
								const allSettings = [setting, ...contrasts.map((contrast) => contrast.setting)];
								const defaultValue = allSettings.find((item) => item.variable === variable)?.default || '';
								this.handleChange(variable, value, defaultValue);
							}),
						);
					}
				} else {
					const currentValue = this.overrides[setting.variable] || setting.default;
					const control = createControl(setting, currentValue, (variable, value) => {
						this.handleChange(variable, value, setting.default);
					});
					body.appendChild(control);
				}
			}
		}

		section.appendChild(body);

		header.addEventListener('click', () => {
			section.classList.toggle('db-category--collapsed');
		});

		return section;
	}

	private handleChange(variable: string, value: string, defaultValue: string): void {
		if (!value || value === defaultValue) {
			delete this.overrides[variable];
		} else {
			this.overrides[variable] = value;
		}

		if (value && value !== defaultValue) {
			document.documentElement.style.setProperty(variable, value);
		} else {
			document.documentElement.style.removeProperty(variable);
		}

		this.debounceSave();
		this.presetManager.clearActive();
		this.refreshPresetBar();
	}

	private debounceSave(): void {
		if (this.saveTimeout) clearTimeout(this.saveTimeout);
		this.saveTimeout = setTimeout(() => {
			this.storage.save(this.overrides);
		}, 300);
	}

	private applyAll(): void {
		for (const [prop, value] of Object.entries(this.overrides)) {
			document.documentElement.style.setProperty(prop, value);
		}
	}

	private resetAll(): void {
		if (!confirm('Reset all tokens to their default values? This clears all customizations.')) {
			return;
		}

		for (const prop of Object.keys(this.overrides)) {
			document.documentElement.style.removeProperty(prop);
		}

		this.overrides = {};
		this.storage.clear();
		this.presetManager.clearActive();
		this.container.innerHTML = '';
		this.render();
	}

	private exportJson(): void {
		const data = JSON.stringify(this.overrides, null, 2);
		const blob = new Blob([data], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const anchor = document.createElement('a');
		anchor.href = url;
		anchor.download = 'design-tokens-overrides.json';
		anchor.click();
		URL.revokeObjectURL(url);
	}

	private async importJson(file: File): Promise<void> {
		let fileContent: string;
		try {
			fileContent = await file.text();
		} catch {
			alert('Error: Could not read the selected JSON file.');
			return;
		}

		let parsed: unknown;
		try {
			parsed = JSON.parse(fileContent);
		} catch {
			alert('Error: Invalid JSON file.');
			return;
		}

		if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
			alert('Error: Imported JSON must be an object of CSS variable/value pairs.');
			return;
		}

		const tokenVariables = new Set<string>();
		const lockedVariables = new Set<string>();
		for (const category of this.tokens.categories) {
			for (const setting of category.settings) {
				tokenVariables.add(setting.variable);
				if (setting.locked) {
					lockedVariables.add(setting.variable);
				}
			}
		}

		const importedOverrides: Record<string, string> = {};
		const parsedOverrides = parsed as Record<string, unknown>;
		const entries = Object.entries(parsedOverrides);

		for (const [variable, value] of entries) {
			if (!tokenVariables.has(variable)) continue;
			if (lockedVariables.has(variable)) continue;
			if (typeof value !== 'string' || !value.trim()) continue;
			importedOverrides[variable] = value;
		}

		if (entries.length > 0 && Object.keys(importedOverrides).length === 0) {
			alert('Error: No recognized design token overrides were found in the selected file.');
			return;
		}

		for (const prop of Object.keys(this.overrides)) {
			document.documentElement.style.removeProperty(prop);
		}

		this.overrides = importedOverrides;
		this.applyAll();
		this.storage.save(this.overrides);
		this.presetManager.clearActive();

		this.container.innerHTML = '';
		this.render();
	}

	private renderPresetBar(): HTMLElement {
		const bar = document.createElement('div');
		bar.className = 'db-presets';

		const names = this.presetManager.names();
		if (names.length === 0) {
			bar.hidden = true;
			bar.classList.add('u-display--none');
			return bar;
		}

		const list = document.createElement('div');
		list.className = 'db-presets__list';
		const activeName = this.presetManager.getActive();

		for (const name of names) {
			list.appendChild(this.createPresetChip(name, name === activeName));
		}

		bar.appendChild(list);
		return bar;
	}

	private createPresetChip(name: string, isActive: boolean): HTMLElement {
		const chip = document.createElement('button');
		chip.type = 'button';
		chip.className = 'db-presets__chip';
		if (isActive) chip.classList.add('db-presets__chip--active');

		const label = document.createElement('span');
		label.className = 'db-presets__chip-label';
		label.textContent = name;
		chip.appendChild(label);

		const del = document.createElement('span');
		del.className = 'db-presets__chip-delete';
		del.textContent = '\u00d7';
		del.title = `Delete "${name}"`;
		del.addEventListener('click', (event) => {
			event.stopPropagation();
			this.deletePreset(name);
		});
		chip.appendChild(del);

		chip.addEventListener('click', () => this.loadPreset(name));
		return chip;
	}

	private savePreset(): void {
		const name = prompt('Preset name:');
		if (!name || !name.trim()) return;

		const trimmed = name.trim();
		const existing = this.presetManager.names();
		if (existing.includes(trimmed)) {
			if (!confirm(`A preset named "${trimmed}" already exists. Overwrite it?`)) {
				return;
			}
		}

		this.presetManager.save(trimmed, this.overrides);
		this.presetManager.setActive(trimmed);
		this.refreshPresetBar();
	}

	private loadPreset(name: string): void {
		const all = this.presetManager.loadAll();
		const presetOverrides = all[name];
		if (!presetOverrides) return;

		for (const prop of Object.keys(this.overrides)) {
			document.documentElement.style.removeProperty(prop);
		}

		this.overrides = { ...presetOverrides };
		this.removeLockedOverrides();
		this.applyAll();
		this.storage.save(this.overrides);
		this.presetManager.setActive(name);
		this.container.innerHTML = '';
		this.render();
	}

	private deletePreset(name: string): void {
		if (!confirm(`Delete preset "${name}"?`)) return;
		this.presetManager.delete(name);
		this.refreshPresetBar();
	}

	private refreshPresetBar(): void {
		if (!this.presetBar) return;
		const newBar = this.renderPresetBar();
		this.presetBar.replaceWith(newBar);
		this.presetBar = newBar;
	}
}
