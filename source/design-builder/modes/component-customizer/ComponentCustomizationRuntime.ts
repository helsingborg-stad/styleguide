import { createControl } from '../../controls';
import { html, nothing, render as renderTemplate, type TemplateResult } from 'lit-html';
import { createModeSwitcher } from '../../dom/createModeSwitcher';
import type { DesignBuilderModeSwitch } from '../../root/types';
import { ComponentStorageAdapter } from '../../services/ComponentStorageAdapter';
import { applyPersistedTokenOverrides, clearPersistedTokenOverrides } from '../../services/applyPersistedOverrides';
import { normalizeDesignBuilderOverrideState, type DesignBuilderOverrideState } from '../../services/overrideState';
import { SharedPresetManager } from '../../services/SharedPresetManager';
import { LocalStorageAdapter } from '../../storage';
import {
	COMPONENT_STORAGE_KEY,
	GENERAL_SCOPE_KEY,
	GLOBAL_SCOPE_KEY,
	NON_CUSTOMIZABLE_COMPONENTS,
} from '../../state/runtimeConstants';
import type { ComponentTokenData, ScopedComponentOverrides, TokenCategory, TokenData } from '../../types/runtime';
import { normalizeComponentName } from '../../utils/componentTokens';

export interface ComponentCustomizationRuntimeOptions {
	modeSwitch?: DesignBuilderModeSwitch;
}

export class ComponentCustomizationRuntime {
	private componentData: ComponentTokenData;
	private tokenLibrary: TokenData;
	private storage: ComponentStorageAdapter;
	private overrides: ScopedComponentOverrides;
	private presetManager: SharedPresetManager;
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

	constructor(
		componentData: ComponentTokenData,
		tokenLibrary: TokenData,
		mountElement: HTMLElement | ShadowRoot,
		options: ComponentCustomizationRuntimeOptions = {},
	) {
		this.componentData = componentData;
		this.tokenLibrary = tokenLibrary;
		this.mountElement = mountElement;
		this.storage = new ComponentStorageAdapter();
		this.overrides = this.storage.load();
		this.presetManager = new SharedPresetManager();
		this.modeSwitch = options.modeSwitch;

		this.collectComponentElements();
		this.collectEditableComponents();
		this.pruneUnknownOverrides();
		this.applySavedOverrides();
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
				const isMissingComponent =
					!this.elementsByComponent.has(componentName) || !this.editableComponents.has(componentName);
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
			this.storage.save(this.overrides);
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
				element.dataset.customizeTooltip = scopeLabel
					? `Customize ${this.getComponentLabel(componentName)} (${scopeLabel})`
					: `Customize ${this.getComponentLabel(componentName)}`;

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
		this.toggleTargetSelectionButton.setAttribute(
			'title',
			this.isTargetSelectionEnabled ? 'Stop picking a component from the page' : 'Pick a component from the page',
		);
		this.toggleTargetSelectionButton.classList.toggle('db-btn-primary', this.isTargetSelectionEnabled);
	}

	private render(): void {
		if (this.editableComponents.size === 0) return;

		const root = document.createElement('div');
		root.className = 'db-builder db-builder-customizer';
		root.hidden = true;
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
		const modeSwitcher = this.modeSwitch ? createModeSwitcher(this.modeSwitch) : null;

		return html`
			<div class="db-header">
				<h1 class="db-header-title">Design Builder</h1>
				<p class="db-header-subtitle">${this.tokenLibrary.name} v${this.tokenLibrary.version}</p>
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
					<button type="button" class="db-btn db-btn-danger" data-action="reset-all-components" @click=${this.handleResetAllClick}>
						Reset all
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
		const preferredMatch =
			preferredElement && (scopeKey === GENERAL_SCOPE_KEY || this.getScopeKeyForElement(preferredElement) === scopeKey)
				? preferredElement
				: null;
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
				${availableScopeKeys.map(
					(scopeKey) => html`<option value=${scopeKey}>${this.getScopeOptionLabel(scopeKey)}</option>`,
				)}
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

		const tokenStorage = new LocalStorageAdapter();
		clearPersistedTokenOverrides(tokenStorage.load());
		applyPersistedTokenOverrides(presetOverrides.token);
		tokenStorage.save(presetOverrides.token);

		this.clearAppliedOverrides();
		this.overrides = this.storage.normalize(presetOverrides.component);
		this.applySavedOverrides();
		this.storage.save(this.overrides);
		this.presetManager.setActive(name);
		this.refreshPresetBar();
		this.renderControls();
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
			token: new LocalStorageAdapter().load(),
			component: this.storage.normalize(this.overrides),
		};
	}

	private exportJson(): void {
		let state = normalizeDesignBuilderOverrideState({});
		try {
			const raw = localStorage.getItem(COMPONENT_STORAGE_KEY);
			state = raw ? normalizeDesignBuilderOverrideState(JSON.parse(raw)) : state;
		} catch {
			state = normalizeDesignBuilderOverrideState({});
		}

		state.component = this.storage.normalize(this.overrides);
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

		const importedState = normalizeDesignBuilderOverrideState(parsed);
		const importedOverrides = importedState.component;
		if (Object.keys(importedOverrides).length === 0) {
			alert('Error: No recognized component overrides were found in the selected file.');
			return;
		}

		const tokenStorage = new LocalStorageAdapter();
		const currentTokenOverrides = tokenStorage.load();
		clearPersistedTokenOverrides(currentTokenOverrides);
		applyPersistedTokenOverrides(importedState.token);
		tokenStorage.save(importedState.token);

		this.clearAppliedOverrides();
		this.overrides = importedOverrides;
		this.applySavedOverrides();
		this.storage.save(this.overrides);
		this.presetManager.clearActive();
		this.refreshPresetBar();
		this.renderControls();
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

		renderTemplate(
			html`${categories.map((category) => this.renderControlsCategoryTemplate(category))}`,
			this.controlsContainer,
		);
	}

	private renderComponentOptions(): void {
		if (!this.componentSelect) {
			return;
		}

		const componentNames = this.getSortedComponentNames();
		renderTemplate(
			html`
				${componentNames.map(
					(componentName) => html`<option value=${componentName}>${this.getComponentLabel(componentName)}</option>`,
				)}
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
		const currentValue =
			this.overrides[this.activeScopeKey]?.[this.activeComponent as string]?.[setting.variable] || setting.default;
		return createControl(setting, currentValue, (variable, value) => {
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

	private handleChange(
		componentName: string,
		scopeKey: string,
		variable: string,
		value: string,
		defaultValue: string,
	): void {
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

		this.storage.save(this.overrides);
		this.presetManager.clearActive();
		this.refreshPresetBar();
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
		this.storage.save(this.overrides);
		this.presetManager.clearActive();
		this.refreshPresetBar();
		this.renderControls();
	}

	private resetAllComponents(): void {
		if (!confirm('Reset all component customizations on this page?')) {
			return;
		}

		this.clearAppliedOverrides();
		this.overrides = {};
		this.storage.save(this.overrides);
		this.presetManager.clearActive();
		this.refreshPresetBar();
		this.renderControls();
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

	private readonly handleDeletePresetClick = (event: Event, name: string): void => {
		event.stopPropagation();
		this.deletePreset(name);
	};
}
