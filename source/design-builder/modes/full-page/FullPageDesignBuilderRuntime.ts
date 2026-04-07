import { createControl, createReadOnlyControl, createSwatchBand } from '../../controls';
import { html, nothing, render as renderTemplate, type TemplateResult } from 'lit-html';
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
	private root: HTMLElement | null = null;
	private presetBarHost: HTMLElement | null = null;
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
		if (!this.root) {
			this.root = document.createElement('div');
			this.root.className = 'db-builder db-builder-fullpage';
			this.container.appendChild(this.root);
		}

		renderTemplate(this.renderShellTemplate(), this.root);
		this.presetBarHost = this.root.querySelector<HTMLElement>('[data-preset-bar]');
		this.renderPresetBar();
	}

	public destroy(): void {
		if (this.saveTimeout) {
			clearTimeout(this.saveTimeout);
			this.saveTimeout = null;
		}

		renderTemplate(nothing, this.container);
		this.root = null;
		this.presetBarHost = null;
	}

	private renderShellTemplate(): TemplateResult {
		const modeSwitcher = this.modeSwitch ? createModeSwitcher(this.modeSwitch) : null;

		return html`
			<div class="db-header">
				<h1 class="db-header-title">Design Builder</h1>
				<p class="db-header-subtitle">${this.tokens.name} v${this.tokens.version}</p>
				<div class="db-header-actions">
					${modeSwitcher ?? nothing}
					<label class="db-header-toggle-row" title="Show non-editable fields">
						<input
							type="checkbox"
							data-action="toggle-locked"
							?checked=${this.showLockedFields}
							@change=${this.handleLockedFieldsToggle}
						>
						<span>Show uneditable</span>
					</label>
					<button type="button" class="db-btn" data-action="export" @click=${this.handleExportClick}>Export JSON</button>
					<button type="button" class="db-btn" data-action="import" @click=${this.handleImportClick}>Import JSON</button>
					<button type="button" class="db-btn db-btn-danger" data-action="reset" @click=${this.handleResetClick}>
						Reset All
					</button>
					<button type="button" class="db-btn db-btn-primary" data-action="save-preset" @click=${this.handleSavePresetClick}>
						Save preset
					</button>
					<input
						type="file"
						accept=".json,application/json"
						data-action="import-file"
						hidden
						@change=${this.handleImportFileChange}
					>
				</div>
			</div>
			<div data-preset-bar></div>
			<div class="db-categories">
				${this.tokens.categories.map((category) => this.renderCategoryTemplate(category))}
			</div>
		`;
	}

	private renderCategoryTemplate(category: TokenCategory): TemplateResult {
		return html`
			<section class="db-category" data-category-id=${category.id}>
				<div class="db-category-header" @click=${this.toggleCategoryCollapsed}>
					<h2 class="db-category-title">${category.label}</h2>
					${category.description
						? html`<p class="db-category-description">${category.description}</p>`
						: nothing}
					<span class="db-category-toggle" aria-hidden="true"></span>
				</div>
				<div class="db-category-body">
					${this.renderCategoryBody(category)}
				</div>
			</section>
		`;
	}

	private renderCategoryBody(category: TokenCategory): Array<HTMLElement> {
		if (category.present === 'swatch') {
			return [createSwatchBand(category.settings)];
		}

		const items: HTMLElement[] = [];
		for (const setting of category.settings) {
			if (setting.locked) {
				if (!this.showLockedFields) {
					continue;
				}

				const currentValue = this.overrides[setting.variable] || setting.default;
				items.push(createReadOnlyControl(setting, currentValue));
				continue;
			}

			const currentValue = this.overrides[setting.variable] || setting.default;
			items.push(
				createControl(setting, currentValue, (variable, value) => {
					this.handleChange(variable, value, setting.default);
				}),
			);
		}

		return items;
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

		this.render();
	}

	private renderPresetBar(): void {
		if (!this.presetBarHost) {
			return;
		}
		const names = this.presetManager.names();
		const activeName = this.presetManager.getActive();

		renderTemplate(
			html`
				<div class=${names.length === 0 ? 'db-presets u-display--none' : 'db-presets'} ?hidden=${names.length === 0}>
					${names.length > 0
						? html`
								<div class="db-presets-list">
									${names.map((name) => this.renderPresetChipTemplate(name, name === activeName))}
								</div>
							`
						: nothing}
				</div>
			`,
			this.presetBarHost,
		);
	}

	private renderPresetChipTemplate(name: string, isActive: boolean): TemplateResult {
		return html`
			<button
				type="button"
				class=${isActive ? 'db-presets-chip db-presets-chip-active' : 'db-presets-chip'}
				@click=${() => this.loadPreset(name)}
			>
				<span class="db-presets-chip-label">${name}</span>
				<span
					class="db-presets-chip-delete"
					title=${`Delete "${name}"`}
					@click=${(event: Event) => this.handleDeletePresetClick(event, name)}
				>
					&times;
				</span>
			</button>
		`;
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
		this.render();
	}

	private deletePreset(name: string): void {
		if (!confirm(`Delete preset "${name}"?`)) return;
		this.presetManager.delete(name);
		this.refreshPresetBar();
	}

	private refreshPresetBar(): void {
		this.renderPresetBar();
	}

	private getCurrentPresetState(): DesignBuilderOverrideState {
		return {
			token: { ...this.overrides },
			component: new ComponentStorageAdapter().load(),
		};
	}

	private readonly handleLockedFieldsToggle = (event: Event): void => {
		this.showLockedFields = (event.currentTarget as HTMLInputElement).checked;
		this.render();
	};

	private readonly handleExportClick = (): void => {
		this.exportJson();
	};

	private readonly handleImportClick = (): void => {
		this.root?.querySelector<HTMLInputElement>('[data-action="import-file"]')?.click();
	};

	private readonly handleImportFileChange = (event: Event): void => {
		const input = event.currentTarget as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) {
			return;
		}

		void this.importJson(file);
		input.value = '';
	};

	private readonly handleResetClick = (): void => {
		this.resetAll();
	};

	private readonly handleSavePresetClick = (): void => {
		this.savePreset();
	};

	private readonly toggleCategoryCollapsed = (event: Event): void => {
		(event.currentTarget as HTMLElement).closest<HTMLElement>('.db-category')?.classList.toggle('db-category-collapsed');
	};

	private readonly handleDeletePresetClick = (event: Event, name: string): void => {
		event.stopPropagation();
		this.deletePreset(name);
	};
}
