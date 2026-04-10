import { html, nothing, render as renderTemplate, type TemplateResult } from 'lit-html';
import { GENERAL_SCOPE_KEY, GLOBAL_SCOPE_KEY, NON_CUSTOMIZABLE_COMPONENTS } from '../../shared/constants/designBuilderRuntimeConstants';
import { createDesignBuilderControl } from '../../shared/control-elements/createDesignBuilderControls';
import { emitDesignBuilderActionEvent } from '../../shared/events/designBuilderActionEvents';
import { createDesignBuilderModeSwitcher } from '../../shared/mode-switch/createDesignBuilderModeSwitcher';
import { DesignBuilderPresetManager } from '../../shared/presets/DesignBuilderPresetManager';
import { designBuilderPresetMatchesState, type DesignBuilderPresetTargets, type DesignBuilderProvidedPreset } from '../../shared/presets/designBuilderPresetDefinitions';
import { applyTokenOverridesToRootDocument, clearTokenOverridesFromRootDocument } from '../../shared/state/applyDesignBuilderOverridesToPage';
import { type DesignBuilderOverrideState, normalizeDesignBuilderOverrideState } from '../../shared/state/designBuilderOverrideState';
import type { ComponentTokenData, ScopedComponentOverrides, TokenCategory, TokenData } from '../../shared/types/designBuilderDataTypes';
import type { DesignBuilderModeSwitch, DesignBuilderRootElement } from '../../web-component/designBuilderRootContracts';
import { normalizeComponentName } from './componentTokenDefinitions';

export interface ComponentCustomizerRuntimeOptions {
	modeSwitch?: DesignBuilderModeSwitch;
	hostElement?: DesignBuilderRootElement;
}

interface RuntimePresetOption {
	key: string;
	id: string;
	label: string;
	source: 'provided' | 'saved';
	state: DesignBuilderOverrideState;
	targets: DesignBuilderPresetTargets;
}

export class ComponentCustomizerRuntime {
	private componentData: ComponentTokenData;
	private tokenLibrary: TokenData;
	private overrides: ScopedComponentOverrides;
	private hostElement: DesignBuilderRootElement | null;
	private presetManager: DesignBuilderPresetManager;
	private elementsByComponent = new Map<string, HTMLElement[]>();
	private editableComponents = new Set<string>();
	private activeComponent: string | null = null;
	private activeScopeKey: string = GENERAL_SCOPE_KEY;
	private mountElement: HTMLElement | ShadowRoot;
	private root: HTMLElement | null = null;
	private controlsContainer: HTMLElement | null = null;
	private componentSelect: HTMLSelectElement | null = null;
	private scopeSelect: HTMLSelectElement | null = null;
	private toggleTargetSelectionButton: HTMLButtonElement | null = null;
	private toggleTargetSelectionLabel: HTMLElement | null = null;
	private activeTargetElement: HTMLElement | null = null;
	private cleanupCallbacks: Array<() => void> = [];
	private modeSwitch?: DesignBuilderModeSwitch;
	private presetBarHost: HTMLElement | null = null;
	private isTargetSelectionEnabled = false;

	constructor(componentData: ComponentTokenData, tokenLibrary: TokenData, mountElement: HTMLElement | ShadowRoot, options: ComponentCustomizerRuntimeOptions = {}) {
		this.componentData = componentData;
		this.tokenLibrary = tokenLibrary;
		this.mountElement = mountElement;
		this.hostElement = options.hostElement ?? null;
		this.overrides = normalizeDesignBuilderOverrideState(this.hostElement?.overrideState).component;
		this.presetManager = new DesignBuilderPresetManager();
		this.modeSwitch = options.modeSwitch;

		this.collectComponentElements();
		this.collectEditableComponents();
		this.pruneUnknownOverrides();
		applyTokenOverridesToRootDocument(this.hostElement?.overrideState.token ?? {});
		this.applySavedOverrides();
		this.syncOverrideState();
		this.render();
	}

	private collectComponentElements(): void {
		const nodes = document.querySelectorAll<HTMLElement>('[data-component]');

		for (const node of nodes) {
			if (node.closest<HTMLElement>('[data-customizable="false"]')) {
				continue;
			}

			const componentName = normalizeComponentName(node.dataset.component || '');
			if (!componentName) continue;
			if (NON_CUSTOMIZABLE_COMPONENTS.has(componentName)) continue;

			const existing = this.elementsByComponent.get(componentName) || [];
			existing.push(node);
			this.elementsByComponent.set(componentName, existing);
		}

		this.activeComponent = this.elementsByComponent.keys().next().value || null;
	}

	private pruneUnknownOverrides(): void {
		let hasChanges = false;

		for (const [scopeKey, scopeOverrides] of Object.entries(this.overrides)) {
			for (const componentName of Object.keys(scopeOverrides)) {
				const isMissingComponent = !this.elementsByComponent.has(componentName) || !this.editableComponents.has(componentName);
				const hasContextTarget = this.getElementsForContext(componentName, scopeKey).length > 0;

				if (isMissingComponent || !hasContextTarget) {
					delete this.overrides[scopeKey][componentName];
					hasChanges = true;
				}
			}

			if (Object.keys(this.overrides[scopeKey]).length === 0) {
				delete this.overrides[scopeKey];
				hasChanges = true;
			}
		}

		if (hasChanges) {
			this.syncOverrideState();
		}
	}

	private applySavedOverrides(): void {
		const orderedScopeKeys = Object.keys(this.overrides).sort((a, b) => {
			if (a === GENERAL_SCOPE_KEY) return -1;
			if (b === GENERAL_SCOPE_KEY) return 1;
			return a.localeCompare(b);
		});

		for (const scopeKey of orderedScopeKeys) {
			const scopeOverrides = this.overrides[scopeKey] || {};
			for (const [componentName, componentOverrides] of Object.entries(scopeOverrides)) {
				for (const [variable, value] of Object.entries(componentOverrides)) {
					this.applyVariable(componentName, scopeKey, variable, value);
				}
			}
		}
	}

	private collectEditableComponents(): void {
		for (const componentName of this.elementsByComponent.keys()) {
			if (this.buildCategoriesForComponent(componentName).length > 0) {
				this.editableComponents.add(componentName);
			}
		}

		if (this.activeComponent && !this.editableComponents.has(this.activeComponent)) {
			const firstEditable = this.editableComponents.values().next().value;
			this.activeComponent = typeof firstEditable === 'string' ? firstEditable : null;
		}
	}

	private enableTargetSelection(): void {
		for (const [componentName, elements] of this.elementsByComponent.entries()) {
			const isEditable = this.editableComponents.has(componentName);
			for (const element of elements) {
				if (!isEditable) continue;

				element.classList.add('db-component-target');
				const scopeLabel = this.getScopeLabel(this.getScopeKeyForElement(element));
				element.dataset.customizeTooltip = scopeLabel ? `Customize ${this.getComponentLabel(componentName)} (${scopeLabel})` : `Customize ${this.getComponentLabel(componentName)}`;

				const links = element.querySelectorAll<HTMLAnchorElement>('a[href]');
				for (const link of links) {
					const handleLinkClick = (event: MouseEvent) => {
						event.preventDefault();
					};
					link.addEventListener('click', handleLinkClick);
					this.cleanupCallbacks.push(() => {
						link.removeEventListener('click', handleLinkClick);
					});
				}
			}
		}

		for (const [componentName, elements] of this.elementsByComponent.entries()) {
			if (!this.editableComponents.has(componentName)) continue;

			for (const element of elements) {
				const handleElementClick = (event: MouseEvent) => {
					event.preventDefault();
					event.stopPropagation();

					if (!this.root) return;

					this.activeComponent = componentName;
					this.activeScopeKey = this.getScopeKeyForElement(element);
					this.refreshScopeSelect();
					this.setActiveTarget(componentName, this.activeScopeKey, element);
					if (this.componentSelect) {
						this.componentSelect.value = componentName;
					}
					this.renderControls();
					this.root.hidden = false;
					this.setTargetSelectionEnabled(false);
				};

				element.addEventListener('click', handleElementClick);
				this.cleanupCallbacks.push(() => {
					element.removeEventListener('click', handleElementClick);
				});
			}
		}
	}

	private disableTargetSelection(): void {
		for (const cleanup of this.cleanupCallbacks.splice(0).reverse()) {
			cleanup();
		}

		for (const elements of this.elementsByComponent.values()) {
			for (const element of elements) {
				element.classList.remove('db-component-target');
				delete element.dataset.customizeTooltip;
			}
		}
	}

	private setTargetSelectionEnabled(enabled: boolean): void {
		if (this.isTargetSelectionEnabled === enabled) {
			this.updateTargetSelectionButton();
			return;
		}

		this.isTargetSelectionEnabled = enabled;

		if (enabled) {
			this.enableTargetSelection();
		} else {
			this.disableTargetSelection();
		}

		this.updateTargetSelectionButton();
	}

	private updateTargetSelectionButton(): void {
		if (!this.toggleTargetSelectionButton || !this.toggleTargetSelectionLabel) {
			return;
		}

		this.toggleTargetSelectionLabel.textContent = this.isTargetSelectionEnabled ? 'Stop picking' : 'Pick on page';
		this.toggleTargetSelectionButton.setAttribute('aria-pressed', this.isTargetSelectionEnabled ? 'true' : 'false');
		this.toggleTargetSelectionButton.setAttribute('title', this.isTargetSelectionEnabled ? 'Stop picking a component from the page' : 'Pick a component from the page');
		this.toggleTargetSelectionButton.classList.toggle('db-btn-primary', this.isTargetSelectionEnabled);
	}

	private render(): void {
		if (this.editableComponents.size === 0) return;

		const root = document.createElement('div');
		root.className = 'db-builder db-builder-customizer';
		this.mountElement.appendChild(root);
		this.root = root;

		renderTemplate(this.renderShellTemplate(), root);

		this.controlsContainer = root.querySelector<HTMLElement>('[data-component-controls]');
		this.componentSelect = root.querySelector<HTMLSelectElement>('[data-action="select-component"]');
		this.scopeSelect = root.querySelector<HTMLSelectElement>('[data-action="select-scope"]');
		this.toggleTargetSelectionButton = root.querySelector<HTMLButtonElement>('[data-action="toggle-target-selection"]');
		this.toggleTargetSelectionLabel = root.querySelector<HTMLElement>('[data-role="toggle-target-selection-label"]');
		this.presetBarHost = root.querySelector<HTMLElement>('[data-preset-bar]');

		this.renderPresetBar();
		this.renderComponentOptions();
		this.refreshScopeSelect();
		this.updateTargetSelectionButton();
		this.renderControls();
	}

	private renderShellTemplate(): TemplateResult {
		const modeSwitcher = this.modeSwitch ? createDesignBuilderModeSwitcher(this.modeSwitch) : null;

		return html`
			<div class="db-header">
				<div class="db-header-actions" data-header-actions>
					${modeSwitcher ?? nothing}
					<button
						type="button"
						class="db-btn"
						data-action="toggle-target-selection"
						aria-pressed="false"
						@click=${this.handleToggleTargetSelectionClick}
					>
						<svg class="db-btn-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
							<path fill="currentColor" d="M4 3h7v2H6v5H4V3Zm10 0h6v7h-2V5h-4V3ZM4 14h2v4h5v2H4v-6Zm14 0h2v6h-7v-2h5v-4Zm-6-3 6-6v4h4l-6 6V11h-4Z" />
						</svg>
						<span data-role="toggle-target-selection-label">Pick on page</span>
					</button>
					<button type="button" class="db-btn" data-action="export" @click=${this.handleExportClick}>Export JSON</button>
					<button type="button" class="db-btn" data-action="import" @click=${this.handleImportClick}>Import JSON</button>
					<button type="button" class="db-btn db-btn-primary" data-action="save" @click=${this.handleSaveClick}>Save</button>
					<button type="button" class="db-btn db-btn-danger" data-action="reset-all-components" @click=${this.handleResetAllClick}>
						Reset all
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
			<div class="db-presets">
				<div class="db-builder-context-grid">
					<label class="db-builder-context-row" for="db-component-select"
						>Component
						<select
							id="db-component-select"
							class="db-control-text"
							data-action="select-component"
							@change=${this.handleComponentSelectChange}
						></select>
					</label>
					<label class="db-builder-context-row" for="db-scope-select"
						>Scope
						<select
							id="db-scope-select"
							class="db-control-text"
							data-action="select-scope"
							@change=${this.handleScopeSelectChange}
						></select>
					</label>
				</div>
				<div class="db-header-actions">
					<button type="button" class="db-btn" data-action="reset-component" @click=${this.handleResetComponentClick}>
						Reset selected
					</button>
				</div>
			</div>
			<div class="db-categories" data-component-controls></div>
		`;
	}

	private setActiveTarget(componentName: string, scopeKey: string, preferredElement?: HTMLElement): void {
		if (this.activeTargetElement) {
			this.activeTargetElement.classList.remove('db-component-target-active');
		}

		const candidates = this.getElementsForContext(componentName, scopeKey);
		const preferredMatch = preferredElement && (scopeKey === GENERAL_SCOPE_KEY || this.getScopeKeyForElement(preferredElement) === scopeKey) ? preferredElement : null;
		const fallbackCandidates = this.elementsByComponent.get(componentName) || [];
		const target = preferredMatch || candidates[0] || fallbackCandidates[0] || null;

		this.activeScopeKey = scopeKey;
		if (!target) {
			this.activeTargetElement = null;
			if (this.scopeSelect) {
				this.scopeSelect.value = this.activeScopeKey;
			}
			return;
		}

		target.classList.add('db-component-target-active');
		this.activeTargetElement = target;

		if (this.scopeSelect) {
			this.scopeSelect.value = this.activeScopeKey;
		}
	}

	private getScopeKeyForElement(element: HTMLElement): string {
		const scope = element.closest<HTMLElement>('[data-scope]')?.dataset.scope?.trim();
		if (!scope) {
			return GLOBAL_SCOPE_KEY;
		}

		return `scope:${scope}`;
	}

	private getScopeLabel(scopeKey: string): string {
		if (scopeKey === GLOBAL_SCOPE_KEY) {
			return '';
		}

		return `Scope: ${scopeKey.replace(/^scope:/, '')}`;
	}

	private getElementsForContext(componentName: string, scopeKey: string): HTMLElement[] {
		const elements = this.elementsByComponent.get(componentName) || [];
		if (scopeKey === GENERAL_SCOPE_KEY) {
			return elements;
		}

		return elements.filter((element) => this.getScopeKeyForElement(element) === scopeKey);
	}

	private refreshScopeSelect(): void {
		if (!this.scopeSelect || !this.activeComponent) {
			return;
		}

		const availableScopeKeys = this.getAvailableScopeKeys(this.activeComponent);
		if (!availableScopeKeys.includes(this.activeScopeKey)) {
			this.activeScopeKey = GENERAL_SCOPE_KEY;
		}

		renderTemplate(
			html`
				${availableScopeKeys.map((scopeKey) => html`<option value=${scopeKey}>${this.getScopeOptionLabel(scopeKey)}</option>`)}
			`,
			this.scopeSelect,
		);
		this.scopeSelect.value = this.activeScopeKey;
	}

	private getAvailableScopeKeys(componentName: string): string[] {
		const availableScopes = new Set<string>([GENERAL_SCOPE_KEY]);
		const elements = this.elementsByComponent.get(componentName) || [];

		for (const element of elements) {
			availableScopes.add(this.getScopeKeyForElement(element));
		}

		const specificScopes = Array.from(availableScopes)
			.filter((scopeKey) => scopeKey !== GENERAL_SCOPE_KEY && scopeKey !== GLOBAL_SCOPE_KEY)
			.sort((a, b) => a.localeCompare(b));

		return [GENERAL_SCOPE_KEY, ...specificScopes];
	}

	private getScopeOptionLabel(scopeKey: string): string {
		if (scopeKey === GENERAL_SCOPE_KEY) {
			return 'Scope: General (all scopes)';
		}

		if (scopeKey === GLOBAL_SCOPE_KEY) {
			return 'Scope: General';
		}

		return `Scope: ${scopeKey.replace(/^scope:/, '')}`;
	}

	private getSortedComponentNames(): string[] {
		return Array.from(this.editableComponents).sort((a, b) => a.localeCompare(b));
	}

	private getComponentLabel(componentName: string): string {
		const definition = this.componentData[componentName];
		if (definition && typeof definition.name === 'string' && definition.name.trim() !== '') {
			return definition.name;
		}

		return componentName;
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
					<label class="db-builder-context-row" for="db-component-preset-select">
						Preset
						<select
							id="db-component-preset-select"
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
		const currentTokenOverrides = this.hostElement?.overrideState.token ?? {};
		const nextTokenOverrides = option.targets.token ? option.state.token : currentTokenOverrides;
		if (option.targets.token) {
			clearTokenOverridesFromRootDocument(currentTokenOverrides);
			applyTokenOverridesToRootDocument(option.state.token);
		}

		if (option.targets.component) {
			this.clearAppliedOverrides();
			this.overrides = normalizeDesignBuilderOverrideState({ component: option.state.component }).component;
			this.applySavedOverrides();
		}

		this.syncOverrideState(nextTokenOverrides);
		if (option.source === 'saved') {
			this.presetManager.setActive(option.id);
		} else {
			this.presetManager.clearActive();
		}

		this.refreshPresetBar();
		this.renderControls();
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
		return Array.isArray(this.hostElement?.presets) ? this.hostElement.presets : [];
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
			token: this.hostElement?.overrideState.token ?? {},
			component: normalizeDesignBuilderOverrideState({ component: this.overrides }).component,
		};
	}

	private exportJson(): void {
		const state = normalizeDesignBuilderOverrideState({
			token: this.hostElement?.overrideState.token ?? {},
			component: this.overrides,
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

		const importedState = normalizeDesignBuilderOverrideState(parsed);
		const importedOverrides = importedState.component;
		if (Object.keys(importedOverrides).length === 0) {
			alert('Error: No recognized component overrides were found in the selected file.');
			return;
		}

		const currentTokenOverrides = this.hostElement?.overrideState.token ?? {};
		clearTokenOverridesFromRootDocument(currentTokenOverrides);
		applyTokenOverridesToRootDocument(importedState.token);

		this.clearAppliedOverrides();
		this.overrides = importedOverrides;
		this.applySavedOverrides();
		this.syncOverrideState(importedState.token);
		this.presetManager.clearActive();
		this.refreshPresetBar();
		this.renderControls();
		this.emitAction('import', {
			fileName: file.name,
			tokenOverrideCount: Object.keys(importedState.token).length,
			componentScopeCount: Object.keys(importedOverrides).length,
		});
	}

	private renderControls(): void {
		if (!this.controlsContainer) return;

		if (!this.activeComponent) {
			renderTemplate(html`No component selected.`, this.controlsContainer);
			return;
		}

		const categories = this.buildCategoriesForComponent(this.activeComponent);
		if (categories.length === 0) {
			renderTemplate(html`No token customization options were found for this component.`, this.controlsContainer);
			return;
		}

		renderTemplate(html`${categories.map((category) => this.renderControlsCategoryTemplate(category))}`, this.controlsContainer);
	}

	private renderComponentOptions(): void {
		if (!this.componentSelect) {
			return;
		}

		const componentNames = this.getSortedComponentNames();
		renderTemplate(
			html`
				${componentNames.map((componentName) => html`<option value=${componentName}>${this.getComponentLabel(componentName)}</option>`)}
			`,
			this.componentSelect,
		);

		if (this.activeComponent && componentNames.includes(this.activeComponent)) {
			this.componentSelect.value = this.activeComponent;
		}
	}

	private renderControlsCategoryTemplate(category: TokenCategory): TemplateResult {
		return html`
			<section class="db-category">
				<div class="db-category-header">
					<h2 class="db-category-title">${category.label}</h2>
				</div>
				<div class="db-category-body">
					${category.settings.map((setting) => this.renderControl(setting))}
				</div>
			</section>
		`;
	}

	private renderControl(setting: TokenCategory['settings'][number]): HTMLElement {
		const currentValue = this.overrides[this.activeScopeKey]?.[this.activeComponent as string]?.[setting.variable] || setting.default;
		return createDesignBuilderControl(setting, currentValue, (variable, value) => {
			this.handleChange(this.activeComponent as string, this.activeScopeKey, variable, value, setting.default);
		});
	}

	private buildCategoriesForComponent(componentName: string): TokenCategory[] {
		const definition = this.componentData[componentName];
		const tokens = Array.isArray(definition?.tokens) ? definition.tokens : [];
		if (tokens.length === 0) return [];

		const availableTokenNames = new Set(tokens.map((token) => token.trim()).filter(Boolean));

		const categories: TokenCategory[] = [];
		for (const category of this.tokenLibrary.categories) {
			const matchedSettings = category.settings
				.filter((setting) => availableTokenNames.has(setting.variable.replace(/^--/, '')))
				.map((setting) => {
					const tokenName = setting.variable.replace(/^--/, '');
					return {
						...setting,
						variable: `--c-${componentName}--${tokenName}`,
					};
				});

			if (matchedSettings.length === 0) continue;

			categories.push({
				id: category.id,
				label: category.label,
				description: category.description,
				present: category.present,
				settings: matchedSettings,
			});
		}

		return categories;
	}

	private handleChange(componentName: string, scopeKey: string, variable: string, value: string, defaultValue: string): void {
		if (!this.overrides[scopeKey]) {
			this.overrides[scopeKey] = {};
		}

		if (!this.overrides[scopeKey][componentName]) {
			this.overrides[scopeKey][componentName] = {};
		}

		if (!value || value === defaultValue) {
			delete this.overrides[scopeKey][componentName][variable];
			this.removeVariable(componentName, scopeKey, variable);
		} else {
			this.overrides[scopeKey][componentName][variable] = value;
			this.applyVariable(componentName, scopeKey, variable, value);
		}

		if (Object.keys(this.overrides[scopeKey][componentName]).length === 0) {
			delete this.overrides[scopeKey][componentName];
		}

		if (Object.keys(this.overrides[scopeKey]).length === 0) {
			delete this.overrides[scopeKey];
		}

		this.syncOverrideState();
		this.presetManager.clearActive();
		this.refreshPresetBar();
		this.emitAction('change', {
			componentName,
			scopeKey,
			variable,
			value,
			defaultValue,
		});
	}

	private hasLocalScopeOverrideForElement(componentName: string, variable: string, element: HTMLElement): boolean {
		const localScopeKey = this.getScopeKeyForElement(element);
		if (localScopeKey === GENERAL_SCOPE_KEY || localScopeKey === GLOBAL_SCOPE_KEY) {
			return false;
		}

		const localValue = this.overrides[localScopeKey]?.[componentName]?.[variable];
		return typeof localValue === 'string' && localValue.trim() !== '';
	}

	private applyVariable(componentName: string, scopeKey: string, variable: string, value: string): void {
		let elements = this.getElementsForContext(componentName, scopeKey);
		if (scopeKey === GENERAL_SCOPE_KEY) {
			elements = elements.filter((element) => !this.hasLocalScopeOverrideForElement(componentName, variable, element));
		}

		for (const element of elements) {
			element.style.setProperty(variable, value);
		}
	}

	private removeVariable(componentName: string, scopeKey: string, variable: string): void {
		let elements = this.getElementsForContext(componentName, scopeKey);
		if (scopeKey === GENERAL_SCOPE_KEY) {
			elements = elements.filter((element) => !this.hasLocalScopeOverrideForElement(componentName, variable, element));
		}

		for (const element of elements) {
			element.style.removeProperty(variable);
		}
	}

	private clearAppliedOverrides(): void {
		for (const [scopeKey, scopeOverrides] of Object.entries(this.overrides)) {
			for (const [componentName, componentOverrides] of Object.entries(scopeOverrides)) {
				for (const variable of Object.keys(componentOverrides)) {
					this.removeVariable(componentName, scopeKey, variable);
				}
			}
		}
	}

	private resetComponent(componentName: string): void {
		const scopeLabel = this.getScopeLabel(this.activeScopeKey);
		const labelSuffix = scopeLabel ? ` in scope "${scopeLabel}"` : '';
		if (!confirm(`Reset all overrides for ${this.getComponentLabel(componentName)}${labelSuffix}?`)) {
			return;
		}

		const variables = Object.keys(this.overrides[this.activeScopeKey]?.[componentName] || {});
		for (const variable of variables) {
			this.removeVariable(componentName, this.activeScopeKey, variable);
		}

		if (this.overrides[this.activeScopeKey]) {
			delete this.overrides[this.activeScopeKey][componentName];
			if (Object.keys(this.overrides[this.activeScopeKey]).length === 0) {
				delete this.overrides[this.activeScopeKey];
			}
		}
		this.syncOverrideState();
		this.presetManager.clearActive();
		this.refreshPresetBar();
		this.renderControls();
		this.emitAction('reset-component', {
			componentName,
			scopeKey: this.activeScopeKey,
		});
	}

	private resetAllComponents(): void {
		if (!confirm('Reset all component customizations on this page?')) {
			return;
		}

		this.clearAppliedOverrides();
		this.overrides = {};
		this.syncOverrideState();
		this.presetManager.clearActive();
		this.refreshPresetBar();
		this.renderControls();
		this.emitAction('reset-all');
	}

	public dispose(): void {
		if (this.activeTargetElement) {
			this.activeTargetElement.classList.remove('db-component-target-active');
			this.activeTargetElement = null;
		}

		for (const cleanup of this.cleanupCallbacks.splice(0).reverse()) {
			cleanup();
		}

		for (const elements of this.elementsByComponent.values()) {
			for (const element of elements) {
				element.classList.remove('db-component-target', 'db-component-target-active');
				delete element.dataset.customizeTooltip;
			}
		}

		this.root?.remove();
		this.root = null;
		this.controlsContainer = null;
		this.componentSelect = null;
		this.scopeSelect = null;
		this.toggleTargetSelectionButton = null;
		this.toggleTargetSelectionLabel = null;
		this.presetBarHost = null;
	}

	private syncOverrideState(tokenOverrides: Record<string, string> | null = null): void {
		if (!this.hostElement) {
			return;
		}

		this.hostElement.overrideState = normalizeDesignBuilderOverrideState({
			token: tokenOverrides ?? this.hostElement.overrideState.token,
			component: this.overrides,
		});
	}

	private emitAction(action: 'change' | 'save' | 'reset-all' | 'reset-component' | 'import' | 'export' | 'preset-save' | 'preset-load' | 'preset-delete', metadata?: Record<string, unknown>): void {
		if (!this.hostElement) {
			return;
		}

		emitDesignBuilderActionEvent(this.hostElement, {
			action,
			mode: 'component-customizer',
			state: this.hostElement.overrideState,
			metadata,
		});
	}

	private readonly handleToggleTargetSelectionClick = (): void => {
		this.setTargetSelectionEnabled(!this.isTargetSelectionEnabled);
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

	private readonly handleSavePresetClick = (): void => {
		this.savePreset();
	};

	private readonly handleComponentSelectChange = (event: Event): void => {
		this.activeComponent = (event.currentTarget as HTMLSelectElement).value || null;
		if (this.activeComponent) {
			this.refreshScopeSelect();
			this.setActiveTarget(this.activeComponent, this.activeScopeKey);
		}
		this.renderControls();
	};

	private readonly handleScopeSelectChange = (event: Event): void => {
		this.activeScopeKey = (event.currentTarget as HTMLSelectElement).value || GENERAL_SCOPE_KEY;
		if (this.activeComponent) {
			this.setActiveTarget(this.activeComponent, this.activeScopeKey);
		}
		this.renderControls();
	};

	private readonly handleResetComponentClick = (): void => {
		if (!this.activeComponent) {
			return;
		}

		this.resetComponent(this.activeComponent);
	};

	private readonly handleResetAllClick = (): void => {
		this.resetAllComponents();
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
}
