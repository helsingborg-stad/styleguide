import {
	createControl,
	createReadOnlyControl,
	createSwatchBand,
	type TokenSetting,
} from '../../controls';
import { createModeSwitcher } from '../../dom/createModeSwitcher';
import type { DesignBuilderModeSwitch } from '../../root/types';
import { normalizeDesignBuilderOverrideState } from '../../services/overrideState';
import { SharedPresetManager } from '../../services/SharedPresetManager';
import { ComponentStorageAdapter } from '../../services/ComponentStorageAdapter';
import {
	applyPersistedComponentOverrides,
	clearPersistedComponentOverrides,
	clearPersistedTokenOverrides,
} from '../../services/applyPersistedOverrides';
import { STORAGE_KEY, type StorageAdapter } from '../../storage';
import type { DesignBuilderOverrideState } from '../../services/overrideState';
import type { TokenCategory, TokenData } from '../../types/runtime';

export class FullPageDesignBuilderRuntime {
	private container: HTMLElement;
	private storage: StorageAdapter;
	private tokens: TokenData;
	private overrides: Record<string, string>;
	private saveTimeout: ReturnType<typeof setTimeout> | null = null;
	private presetManager: SharedPresetManager;
	private presetBar: HTMLElement | null = null;
	private showLockedFields = false;
	private modeSwitch?: DesignBuilderModeSwitch;

	constructor(container: HTMLElement, tokens: TokenData, storage: StorageAdapter, modeSwitch?: DesignBuilderModeSwitch) {
		this.container = container;
		this.tokens = tokens;
		this.storage = storage;
		this.presetManager = new SharedPresetManager();
		this.overrides = storage.load();
		this.modeSwitch = modeSwitch;
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
		const root = document.createElement('div');
		root.className = 'db-builder db-builder-fullpage';

		const header = document.createElement('div');
		header.className = 'db-header';
		header.innerHTML = `
      <h1 class="db-header-title">Design Builder</h1>
      <p class="db-header-subtitle">${this.tokens.name} v${this.tokens.version}</p>
      <div class="db-header-actions">
<label class="db-header-toggle-row" title="Show non-editable fields">
<input type="checkbox" data-action="toggle-locked" ${this.showLockedFields ? 'checked' : ''}>
<span>Show uneditable</span>
</label>
        <button type="button" class="db-btn" data-action="export">Export JSON</button>
        <button type="button" class="db-btn" data-action="import">Import JSON</button>
        <button type="button" class="db-btn db-btn-danger" data-action="reset">Reset All</button>
        <button type="button" class="db-btn db-btn-primary" data-action="save-preset">Save preset</button>
        <input type="file" accept=".json,application/json" data-action="import-file" hidden>
      </div>
    `;

		const headerActions = header.querySelector<HTMLElement>('.db-header-actions');
		const modeSwitcher = this.modeSwitch ? createModeSwitcher(this.modeSwitch) : null;
		if (headerActions && modeSwitcher) {
			headerActions.prepend(modeSwitcher);
		}

		root.appendChild(header);

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
		root.appendChild(this.presetBar);

		const categoriesWrap = document.createElement('div');
		categoriesWrap.className = 'db-categories';

		for (const category of this.tokens.categories) {
			categoriesWrap.appendChild(this.renderCategory(category));
		}

		root.appendChild(categoriesWrap);
		this.container.appendChild(root);
	}

	public destroy(): void {
		if (this.saveTimeout) {
			clearTimeout(this.saveTimeout);
			this.saveTimeout = null;
		}

		this.container.innerHTML = '';
	}

	private renderCategory(category: TokenCategory): HTMLElement {
		const section = document.createElement('section');
		section.className = 'db-category';
		section.dataset.categoryId = category.id;

		const header = document.createElement('div');
		header.className = 'db-category-header';
		header.innerHTML = `
      <h2 class="db-category-title">${category.label}</h2>
      ${category.description ? `<p class="db-category-description">${category.description}</p>` : ''}
      <span class="db-category-toggle" aria-hidden="true"></span>
    `;
		section.appendChild(header);

		const body = document.createElement('div');
		body.className = 'db-category-body';

		if (category.present === 'swatch') {
			body.appendChild(createSwatchBand(category.settings));
		} else {
			for (const setting of category.settings) {
				if (setting.locked) {
					if (!this.showLockedFields) {
						continue;
					}

					const currentValue = this.overrides[setting.variable] || setting.default;
					body.appendChild(createReadOnlyControl(setting, currentValue));
					continue;
				}

				const currentValue = this.overrides[setting.variable] || setting.default;
				const control = createControl(setting, currentValue, (variable, value) => {
					this.handleChange(variable, value, setting.default);
				});
				body.appendChild(control);
			}
		}

		section.appendChild(body);

		header.addEventListener('click', () => {
			section.classList.toggle('db-category-collapsed');
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
		let state = normalizeDesignBuilderOverrideState({});
		try {
			const raw = localStorage.getItem(STORAGE_KEY);
			state = raw ? normalizeDesignBuilderOverrideState(JSON.parse(raw)) : state;
		} catch {
			state = normalizeDesignBuilderOverrideState({});
		}

		state.token = { ...this.overrides };
		const data = JSON.stringify(state, null, 2);
		const blob = new Blob([data], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const anchor = document.createElement('a');
		anchor.href = url;
		anchor.download = 'design-builder-overrides.json';
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

		const importedState = normalizeDesignBuilderOverrideState(parsed);
		const importedOverrides: Record<string, string> = {};
		const entries = Object.entries(importedState.token);

		for (const [variable, value] of entries) {
			if (!tokenVariables.has(variable)) continue;
			if (lockedVariables.has(variable)) continue;
			importedOverrides[variable] = value;
		}

		if (entries.length > 0 && Object.keys(importedOverrides).length === 0) {
			alert('Error: No recognized design token overrides were found in the selected file.');
			return;
		}

		for (const prop of Object.keys(this.overrides)) {
			document.documentElement.style.removeProperty(prop);
		}

		const componentStorage = new ComponentStorageAdapter();
		const currentComponentOverrides = componentStorage.load();
		clearPersistedComponentOverrides(currentComponentOverrides);
		applyPersistedComponentOverrides(importedState.component);
		componentStorage.save(importedState.component);

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
		list.className = 'db-presets-list';
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
		chip.className = 'db-presets-chip';
		if (isActive) chip.classList.add('db-presets-chip-active');

		const label = document.createElement('span');
		label.className = 'db-presets-chip-label';
		label.textContent = name;
		chip.appendChild(label);

		const del = document.createElement('span');
		del.className = 'db-presets-chip-delete';
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

		this.presetManager.save(trimmed, this.getCurrentPresetState());
		this.presetManager.setActive(trimmed);
		this.refreshPresetBar();
	}

	private loadPreset(name: string): void {
		const all = this.presetManager.loadAll();
		const presetOverrides = all[name];
		if (!presetOverrides) return;

		clearPersistedTokenOverrides(this.overrides);
		const componentStorage = new ComponentStorageAdapter();
		clearPersistedComponentOverrides(componentStorage.load());

		this.overrides = { ...presetOverrides.token };
		this.removeLockedOverrides();
		this.applyAll();
		applyPersistedComponentOverrides(presetOverrides.component);
		componentStorage.save(presetOverrides.component);
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

	private getCurrentPresetState(): DesignBuilderOverrideState {
		return {
			token: { ...this.overrides },
			component: new ComponentStorageAdapter().load(),
		};
	}
}
