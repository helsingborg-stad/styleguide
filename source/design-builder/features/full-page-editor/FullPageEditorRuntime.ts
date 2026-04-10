import { html, nothing, render as renderTemplate, type TemplateResult } from 'lit-html';
import { createDesignBuilderControl, createDesignBuilderSwatchBand, createReadOnlyDesignBuilderControl } from '../../shared/control-elements/createDesignBuilderControls';
import { emitDesignBuilderActionEvent } from '../../shared/events/designBuilderActionEvents';
import { createDesignBuilderModeSwitcher } from '../../shared/mode-switch/createDesignBuilderModeSwitcher';
import { DesignBuilderPresetManager } from '../../shared/presets/DesignBuilderPresetManager';
import { designBuilderPresetMatchesState, type DesignBuilderPresetTargets, type DesignBuilderProvidedPreset } from '../../shared/presets/designBuilderPresetDefinitions';
import { applyComponentOverridesToPage, clearComponentOverridesFromPage, clearTokenOverridesFromRootDocument } from '../../shared/state/applyDesignBuilderOverridesToPage';
import { type DesignBuilderOverrideState, normalizeDesignBuilderOverrideState } from '../../shared/state/designBuilderOverrideState';
import type { TokenCategory, TokenData } from '../../shared/types/designBuilderDataTypes';
import type { DesignBuilderModeSwitch, DesignBuilderRootElement } from '../../web-component/designBuilderRootContracts';

interface RuntimePresetOption {
	key: string;
	id: string;
	label: string;
	source: 'provided' | 'saved';
	state: DesignBuilderOverrideState;
	targets: DesignBuilderPresetTargets;
}

export class FullPageEditorRuntime {
	private container: HTMLElement;
	private hostElement: DesignBuilderRootElement;
	private tokens: TokenData;
	private overrides: Record<string, string>;
	private presetManager: DesignBuilderPresetManager;
	private root: HTMLElement | null = null;
	private presetBarHost: HTMLElement | null = null;
	private showLockedFields = false;
	private modeSwitch?: DesignBuilderModeSwitch;

	constructor(container: HTMLElement, tokens: TokenData, hostElement: DesignBuilderRootElement, modeSwitch?: DesignBuilderModeSwitch) {
		this.container = container;
		this.hostElement = hostElement;
		this.tokens = tokens;
		this.presetManager = new DesignBuilderPresetManager();
		this.overrides = { ...hostElement.overrideState.token };
		this.modeSwitch = modeSwitch;
		this.removeLockedOverrides();
		this.syncOverrideState();

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
			this.syncOverrideState();
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
		renderTemplate(nothing, this.container);
		this.root = null;
		this.presetBarHost = null;
	}

	private renderShellTemplate(): TemplateResult {
		const modeSwitcher = this.modeSwitch ? createDesignBuilderModeSwitcher(this.modeSwitch) : null;

		return html`
			<div class="db-header">
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
					<button type="button" class="db-btn db-btn-primary" data-action="save" @click=${this.handleSaveClick}>Save</button>
					<button type="button" class="db-btn db-btn-danger" data-action="reset" @click=${this.handleResetClick}>
						Reset All
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
					${category.description ? html`<p class="db-category-description">${category.description}</p>` : nothing}
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
			return [createDesignBuilderSwatchBand(category.settings)];
		}

		const items: HTMLElement[] = [];
		for (const setting of category.settings) {
			if (setting.locked) {
				if (!this.showLockedFields) {
					continue;
				}

				const currentValue = this.overrides[setting.variable] || setting.default;
				items.push(createReadOnlyDesignBuilderControl(setting, currentValue));
				continue;
			}

			const currentValue = this.overrides[setting.variable] || setting.default;
			items.push(
				createDesignBuilderControl(setting, currentValue, (variable, value) => {
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

		this.syncOverrideState();
		this.presetManager.clearActive();
		this.refreshPresetBar();
		this.emitAction('change', {
			variable,
			value,
			defaultValue,
		});
	}

	private applyAll(): void {
		for (const [prop, value] of Object.entries(this.overrides)) {
			document.documentElement.style.setProperty(prop, value);
		}

		applyComponentOverridesToPage(this.hostElement.overrideState.component);
	}

	private resetAll(): void {
		if (!confirm('Reset all tokens to their default values? This clears all customizations.')) {
			return;
		}

		for (const prop of Object.keys(this.overrides)) {
			document.documentElement.style.removeProperty(prop);
		}

		this.overrides = {};
		this.syncOverrideState();
		this.presetManager.clearActive();
		this.render();
		this.emitAction('reset-all');
	}

	private exportJson(): void {
		const state = normalizeDesignBuilderOverrideState({
			token: this.overrides,
			component: this.hostElement.overrideState.component,
		});
		const data = JSON.stringify(state, null, 2);
		const blob = new Blob([data], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const anchor = document.createElement('a');
		anchor.href = url;
		anchor.download = 'design-builder-overrides.json';
		anchor.click();
		URL.revokeObjectURL(url);
		this.emitAction('export', {
			fileName: anchor.download,
		});
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

		clearComponentOverridesFromPage(this.hostElement.overrideState.component);
		applyComponentOverridesToPage(importedState.component);

		this.overrides = importedOverrides;
		this.applyAll();
		this.hostElement.overrideState = normalizeDesignBuilderOverrideState({
			token: importedOverrides,
			component: importedState.component,
		});
		this.presetManager.clearActive();

		this.render();
		this.emitAction('import', {
			fileName: file.name,
			tokenOverrideCount: Object.keys(importedOverrides).length,
			componentScopeCount: Object.keys(importedState.component).length,
		});
	}

	private renderPresetBar(): void {
		if (!this.presetBarHost) {
			return;
		}
		const presetOptions = this.getPresetOptions();
		const activePresetKey = this.getActivePresetKey(presetOptions);
		const hasProvidedPresets = presetOptions.some((preset) => preset.source === 'provided');
		const savedPresetOptions = presetOptions.filter((preset) => preset.source === 'saved');
		const activeSavedPreset = savedPresetOptions.find((preset) => preset.key === activePresetKey) ?? null;

		renderTemplate(
			html`
				<div class=${presetOptions.length === 0 ? 'db-presets u-display--none' : 'db-presets'} ?hidden=${presetOptions.length === 0}>
					<label class="db-builder-context-row" for="db-full-page-preset-select">
						Preset
						<select
							id="db-full-page-preset-select"
							class="db-control-text"
							data-action="select-preset"
							.value=${activePresetKey}
							@change=${this.handlePresetSelectChange}
						>
							<option value="">Choose a preset</option>
							${
								hasProvidedPresets
									? html`
										<optgroup label="Built-in presets">
											${presetOptions
												.filter((preset) => preset.source === 'provided')
												.map((preset) => html`<option value=${preset.key}>${preset.label}</option>`)}
										</optgroup>
									`
									: nothing
							}
							${
								savedPresetOptions.length > 0
									? html`
										<optgroup label="Saved presets">
											${savedPresetOptions.map((preset) => html`<option value=${preset.key}>${preset.label}</option>`)}
										</optgroup>
									`
									: nothing
							}
						</select>
					</label>
					<details class="db-presets-menu">
						<summary class="db-btn db-presets-menu-trigger" aria-label="Preset actions" title="Preset actions">
							<svg class="db-btn-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
								<path
									fill="currentColor"
									d="M12 7a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm0 6.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm0 6.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"
								/>
							</svg>
						</summary>
						<div class="db-presets-menu-content" role="menu" aria-label="Preset actions">
							<button type="button" class="db-btn db-btn-primary" data-action="save-preset" role="menuitem" @click=${this.handleSavePresetClick}>
								Save preset
							</button>
							<button
								type="button"
								class="db-btn"
								data-action="delete-preset"
								role="menuitem"
								?disabled=${activeSavedPreset === null}
								@click=${this.handleDeleteActivePresetClick}
							>
								Delete preset
							</button>
						</div>
					</details>
				</div>
			`,
			this.presetBarHost,
		);
	}

	private savePreset(): void {
		const name = prompt('Preset name:');
		if (!name || !name.trim()) return;

		const trimmed = name.trim();
		const normalizedName = trimmed.toLowerCase();
		if (this.getProvidedPresets().some((preset) => preset.id.toLowerCase() === normalizedName || preset.label.toLowerCase() === normalizedName)) {
			alert(`A built-in preset already uses the name "${trimmed}". Choose another preset name.`);
			return;
		}

		const existing = this.presetManager.names();
		if (existing.includes(trimmed)) {
			if (!confirm(`A preset named "${trimmed}" already exists. Overwrite it?`)) {
				return;
			}
		}

		this.presetManager.save(trimmed, this.getCurrentPresetState());
		this.presetManager.setActive(trimmed);
		this.refreshPresetBar();
		this.emitAction('preset-save', {
			presetName: trimmed,
		});
	}

	private loadPreset(option: RuntimePresetOption): void {
		if (option.targets.token) {
			clearTokenOverridesFromRootDocument(this.overrides);
			this.overrides = { ...option.state.token };
			this.removeLockedOverrides();
		}

		const nextComponentOverrides = option.targets.component
			? normalizeDesignBuilderOverrideState({ component: option.state.component }).component
			: this.hostElement.overrideState.component;
		if (option.targets.component) {
			clearComponentOverridesFromPage(this.hostElement.overrideState.component);
		}

		this.hostElement.overrideState = normalizeDesignBuilderOverrideState({
			token: this.overrides,
			component: nextComponentOverrides,
		});
		this.removeLockedOverrides();
		this.applyAll();

		if (option.source === 'saved') {
			this.presetManager.setActive(option.id);
		} else {
			this.presetManager.clearActive();
		}

		this.render();
		this.emitAction('preset-load', {
			presetName: option.label,
			presetSource: option.source,
		});
	}

	private deletePreset(name: string): void {
		if (!confirm(`Delete preset "${name}"?`)) return;
		this.presetManager.delete(name);
		this.refreshPresetBar();
		this.emitAction('preset-delete', {
			presetName: name,
		});
	}

	private refreshPresetBar(): void {
		this.renderPresetBar();
	}

	private getProvidedPresets(): DesignBuilderProvidedPreset[] {
		return Array.isArray(this.hostElement.presets) ? this.hostElement.presets : [];
	}

	private getPresetOptions(): RuntimePresetOption[] {
		const providedOptions = this.getProvidedPresets().map((preset) => ({
			key: `provided:${preset.id}`,
			id: preset.id,
			label: preset.label,
			source: 'provided' as const,
			state: preset.state,
			targets: preset.targets,
		}));

		const savedOptions = Object.entries(this.presetManager.loadAll())
			.sort(([leftName], [rightName]) => leftName.localeCompare(rightName))
			.map(([name, state]) => ({
				key: `saved:${name}`,
				id: name,
				label: name,
				source: 'saved' as const,
				state,
				targets: {
					token: true,
					component: true,
				},
			}));

		return [...providedOptions, ...savedOptions];
	}

	private getActivePresetKey(presetOptions: RuntimePresetOption[]): string {
		const activeSavedPresetName = this.presetManager.getActive();
		if (activeSavedPresetName) {
			const activeSavedPreset = presetOptions.find((preset) => preset.source === 'saved' && preset.id === activeSavedPresetName);
			if (activeSavedPreset) {
				return activeSavedPreset.key;
			}
		}

		const currentState = this.getCurrentPresetState();
		return presetOptions.find((preset) => designBuilderPresetMatchesState({
			id: preset.id,
			label: preset.label,
			state: preset.state,
			targets: preset.targets,
		}, currentState))?.key ?? '';
	}

	private findPresetOption(key: string): RuntimePresetOption | null {
		return this.getPresetOptions().find((preset) => preset.key === key) ?? null;
	}

	private getCurrentPresetState(): DesignBuilderOverrideState {
		return {
			token: { ...this.overrides },
			component: this.hostElement.overrideState.component,
		};
	}

	private syncOverrideState(): void {
		this.hostElement.overrideState = normalizeDesignBuilderOverrideState({
			token: this.overrides,
			component: this.hostElement.overrideState.component,
		});
	}

	private emitAction(action: 'change' | 'save' | 'reset-all' | 'import' | 'export' | 'preset-save' | 'preset-load' | 'preset-delete', metadata?: Record<string, unknown>): void {
		emitDesignBuilderActionEvent(this.hostElement, {
			action,
			mode: 'full-page',
			state: this.hostElement.overrideState,
			metadata,
		});
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

	private readonly handleSaveClick = (): void => {
		this.emitAction('save');
	};

	private readonly handlePresetSelectChange = (event: Event): void => {
		const option = this.findPresetOption((event.currentTarget as HTMLSelectElement).value);
		if (!option) {
			this.presetManager.clearActive();
			this.refreshPresetBar();
			return;
		}

		this.loadPreset(option);
	};

	private readonly handleDeleteActivePresetClick = (): void => {
		const activePreset = this.findPresetOption(this.getActivePresetKey(this.getPresetOptions()));
		if (!activePreset || activePreset.source !== 'saved') {
			return;
		}

		this.deletePreset(activePreset.id);
	};

	private readonly toggleCategoryCollapsed = (event: Event): void => {
		(event.currentTarget as HTMLElement).closest<HTMLElement>('.db-category')?.classList.toggle('db-category-collapsed');
	};
}
