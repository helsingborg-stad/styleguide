import { html, nothing, render as renderTemplate, type TemplateResult } from 'lit-html';
import { GENERAL_SCOPE_KEY, GLOBAL_SCOPE_KEY, NON_CUSTOMIZABLE_COMPONENTS } from '../../shared/constants/designBuilderRuntimeConstants';
import type { ControlChangeOptions } from '../../shared/control-elements/controls/types';
import { createDesignBuilderCategory, createDesignBuilderControl, createReadOnlyDesignBuilderControl } from '../../shared/control-elements/createDesignBuilderControls';
import { emitDesignBuilderActionEvent } from '../../shared/events/designBuilderActionEvents';
import { createDetailsMenuDismissController, type DetailsMenuDismissController } from '../../shared/menus/createDetailsMenuDismissController';
import { createDesignBuilderModeSwitcher } from '../../shared/mode-switch/createDesignBuilderModeSwitcher';
import { DesignBuilderPresetManager } from '../../shared/presets/DesignBuilderPresetManager';
import { type DesignBuilderPresetTargets, type DesignBuilderProvidedPreset, designBuilderPresetMatchesState } from '../../shared/presets/designBuilderPresetDefinitions';
import { applyTokenOverridesToRootDocument, clearTokenOverridesFromRootDocument } from '../../shared/state/applyDesignBuilderOverridesToPage';
import { getComponentOverrideTargets } from '../../shared/state/componentOverrideTargets';
import { type DesignBuilderOverrideState, normalizeDesignBuilderOverrideState } from '../../shared/state/designBuilderOverrideState';
import { getNamedScopeKeysForElement, getResolvedScopeKeyForElement } from '../../shared/state/designBuilderScope';
import { withResolvedTokenSettingDefaults } from '../../shared/tokens/resolveTokenSettingDefault';
import { registerControlInfoTooltips } from '../../shared/tooltips/registerControlInfoTooltips';
import type { ComponentSettingDefinition, ComponentSettingVisibilityCondition, ComponentTokenData, ComponentTokenReferenceSetting, ScopedComponentOverrides, TokenCategory, TokenData } from '../../shared/types/designBuilderDataTypes';
import type { DesignBuilderModeSwitch, DesignBuilderRootElement } from '../../web-component/designBuilderRootContracts';
import { translations } from '../translations';
import { normalizeComponentName } from './componentTokenDefinitions';

export interface ComponentCustomizerRuntimeOptions {
	modeSwitch?: DesignBuilderModeSwitch;
	hostElement?: DesignBuilderRootElement;
	showSaveButton?: boolean;
}

interface RuntimePresetOption {
	key: string;
	id: string;
	label: string;
	source: 'provided' | 'saved';
	state: DesignBuilderOverrideState;
	targets: DesignBuilderPresetTargets;
}

type ColorTokenVariant = 'base' | 'contrast' | 'contrast-muted' | 'border' | 'alt';

type TokenLibrarySettingMatch = {
	category: TokenCategory;
	setting: TokenCategory['settings'][number];
};

type ColorTokenSourceFamily = {
	family: string;
	label: string;
	categoryId: string;
	variants: Partial<Record<ColorTokenVariant, string>>;
};

const LOCAL_COLOR_SOURCE_CATEGORY_IDS = new Set(['colors-brand-palette', 'colors-brand', 'colors-layout', 'colors-ui', 'colors-state']);
const STATE_COLOR_SOURCE_CATEGORY_ID = 'colors-state';
const BRAND_PALETTE_CATEGORY_ID = 'colors-brand-palette';
const EXCLUDED_SWATCH_COLOR_FAMILIES = new Set(['alpha', 'focus']);
const LAST_EDITED_COMPONENT_STORAGE_KEY = 'design-builder-last-edited-component';

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
	private activeTargetWasPicked = false;
	private cleanupCallbacks: Array<() => void> = [];
	private modeSwitch?: DesignBuilderModeSwitch;
	private presetBarHost: HTMLElement | null = null;
	private menuDismissController: DetailsMenuDismissController | null = null;
	private isTargetSelectionEnabled = false;
	private showSaveButton: boolean;
	private showLockedFields = false;

	constructor(componentData: ComponentTokenData, tokenLibrary: TokenData, mountElement: HTMLElement | ShadowRoot, options: ComponentCustomizerRuntimeOptions = {}) {
		this.componentData = componentData;
		this.tokenLibrary = withResolvedTokenSettingDefaults(tokenLibrary);
		this.mountElement = mountElement;
		this.hostElement = options.hostElement ?? null;
		this.overrides = normalizeDesignBuilderOverrideState(this.hostElement?.overrideState).component;
		this.presetManager = new DesignBuilderPresetManager();
		this.modeSwitch = options.modeSwitch;
		this.showSaveButton = options.showSaveButton ?? true;
		this.showLockedFields = this.hostElement?.showLockedFields ?? false;

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
			for (const [componentName, componentOverrides] of Object.entries(this.overrides[scopeKey])) {
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

		const lastEditedComponent = this.getLastEditedComponent();
		if (lastEditedComponent && this.editableComponents.has(lastEditedComponent) && this.elementsByComponent.has(lastEditedComponent)) {
			this.activeComponent = lastEditedComponent;
		}

		if (this.activeComponent && !this.editableComponents.has(this.activeComponent)) {
			const firstEditable = this.editableComponents.values().next().value;
			this.activeComponent = typeof firstEditable === 'string' ? firstEditable : null;
		}
	}

	private getLastEditedComponent(): string | null {
		try {
			return normalizeComponentName(localStorage.getItem(LAST_EDITED_COMPONENT_STORAGE_KEY) || '');
		} catch {
			return null;
		}
	}

	private rememberLastEditedComponent(componentName: string | null): void {
		if (!componentName || !this.editableComponents.has(componentName)) {
			return;
		}

		try {
			localStorage.setItem(LAST_EDITED_COMPONENT_STORAGE_KEY, componentName);
		} catch {
			// Ignore storage failures; component selection should still work.
		}
	}

	private enableTargetSelection(): void {
		const visibleComponents = new Set(this.getSortedComponentNames());

		for (const [componentName, elements] of this.elementsByComponent.entries()) {
			const isEditable = visibleComponents.has(componentName);
			for (const element of elements) {
				if (!isEditable) continue;

				element.classList.add('db-component-target');
				const scopeLabel = this.getScopeLabelForElement(element);
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
			if (!visibleComponents.has(componentName)) continue;

			for (const element of elements) {
				const handleElementClick = (event: MouseEvent) => {
					event.preventDefault();
					event.stopPropagation();

					if (!this.root) return;

					this.activeComponent = componentName;
					this.rememberLastEditedComponent(componentName);
					this.activeScopeKey = this.getScopeKeyForElement(element);
					this.refreshScopeSelect();
					this.setActiveTarget(componentName, this.activeScopeKey, element, true);
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

		if (this.isTargetSelectionEnabled) {
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

		this.toggleTargetSelectionLabel.textContent = this.isTargetSelectionEnabled ? translations.stopPicking : translations.pickOnPage;
		this.toggleTargetSelectionButton.setAttribute('aria-pressed', this.isTargetSelectionEnabled ? 'true' : 'false');
		this.toggleTargetSelectionButton.setAttribute('title', this.isTargetSelectionEnabled ? 'Stop picking a component from the page' : 'Pick a component from the page');
		this.toggleTargetSelectionButton.classList.toggle('db-btn-primary', this.isTargetSelectionEnabled);
	}

	private render(): void {
		if (this.editableComponents.size === 0) return;

		registerControlInfoTooltips();

		const root = document.createElement('div');
		root.className = 'db-builder db-builder-customizer';
		this.mountElement.appendChild(root);
		this.root = root;
		this.menuDismissController = createDetailsMenuDismissController(root);

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
					<div class="db-header-actions-right">
						<details class="db-header-menu">
							<summary class="db-btn db-header-menu-trigger db-tooltip-target" aria-label="${translations.importExportJson}" data-tooltip="${translations.importExportJson}">
								<svg class="db-btn-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
									<title>${translations.importExportJson}</title>
									<path
										fill="currentColor"
										d="M7 4h10v2H7l2.5 2.5L8 10 3 5l5-5 1.5 1.5L7 4Zm10 16H7v-2h10l-2.5-2.5L16 14l5 5-5 5-1.5-1.5L17 20Z"
									/>
								</svg>
							</summary>
							<div class="db-header-menu-content" role="menu" aria-label="${translations.importExportJson}">
								<button type="button" class="db-btn" data-action="export" role="menuitem" @click=${this.handleExportClick}>${translations.exportJson}</button>
								<button type="button" class="db-btn" data-action="import" role="menuitem" @click=${this.handleImportClick}>${translations.importJson}</button>
							</div>
						</details>
						${
							this.showSaveButton
								? html`
									<button type="button" class="db-btn db-btn-primary db-tooltip-target" data-action="save" aria-label="Save" data-tooltip="Save" @click=${this.handleSaveClick}>
										<svg class="db-btn-icon" viewBox="0 -960 960 960" aria-hidden="true" focusable="false">
											<title>Save</title>
											<path fill="currentColor" d="M840-680v480q0 33-23.5 56.5T760-120H200q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h480l160 160Zm-80 34L646-760H200v560h560v-446ZM565-275q35-35 35-85t-35-85q-35-35-85-35t-85 35q-35 35-35 85t35 85q35 35 85 35t85-35ZM240-560h360v-160H240v160Zm-40-86v446-560 114Z" />
										</svg>
									</button>
								`
								: nothing
						}
						<details class="db-header-menu db-header-menu-danger">
							<summary class="db-btn db-header-menu-trigger db-tooltip-target" aria-label="${translations.resetActions}" data-tooltip="${translations.resetActions}">
								<svg class="db-btn-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
									<title>${translations.resetActions}</title>
									<path fill="currentColor" d="M12 3a9 9 0 1 1-8.66 11.43l1.93-.52A7 7 0 1 0 12 5h-1.59l2.3 2.29-1.42 1.42L6.58 4l4.71-4.71 1.42 1.42L10.41 3H12Z" />
								</svg>
							</summary>
							<div class="db-header-menu-content" role="menu" aria-label="${translations.resetActions}">
								<button type="button" class="db-btn db-btn-danger" data-action="reset-all-components" role="menuitem" @click=${this.handleResetAllClick}>${translations.resetAll}</button>
							</div>
						</details>
					</div>
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
						>${translations.component}
						<select
							id="db-component-select"
							class="db-control-text"
							data-action="select-component"
							@change=${this.handleComponentSelectChange}
						></select>
					</label>
					<label class="db-builder-context-row" for="db-scope-select"
						>${translations.scope}
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
						${translations.resetSelected}
					</button>
				</div>
			</div>
			<div class="db-categories" data-component-controls></div>
		`;
	}

	private setActiveTarget(componentName: string, scopeKey: string, preferredElement?: HTMLElement, wasPicked = false): void {
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
			this.activeTargetWasPicked = false;
			if (this.scopeSelect) {
				this.scopeSelect.value = this.activeScopeKey;
			}
			return;
		}

		target.classList.add('db-component-target-active');
		this.activeTargetElement = target;
		this.activeTargetWasPicked = wasPicked && target === preferredMatch;

		if (this.scopeSelect) {
			this.scopeSelect.value = this.activeScopeKey;
		}
	}

	private getScopeKeyForElement(element: HTMLElement): string {
		return getResolvedScopeKeyForElement(element, GLOBAL_SCOPE_KEY);
	}

	private getScopeLabelForElement(element: HTMLElement): string {
		const scopeKeys = getNamedScopeKeysForElement(element);
		if (scopeKeys.length === 0) {
			return '';
		}

		const labelPrefix = scopeKeys.length > 1 ? 'Scopes' : 'Scope';
		return `${labelPrefix}: ${scopeKeys.map((scopeKey) => scopeKey.replace(/^scope:/, '')).join(', ')}`;
	}

	private getScopeLabel(scopeKey: string): string {
		if (scopeKey === GLOBAL_SCOPE_KEY) {
			return '';
		}

		return `${translations.scope}: ${scopeKey.replace(/^scope:/, '')}`;
	}

	private getElementsForContext(componentName: string, scopeKey: string): HTMLElement[] {
		const elements = this.elementsByComponent.get(componentName) || [];
		if (scopeKey === GENERAL_SCOPE_KEY) {
			return elements;
		}

		return elements.filter((element) => getNamedScopeKeysForElement(element).includes(scopeKey));
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
			for (const scopeKey of getNamedScopeKeysForElement(element)) {
				availableScopes.add(scopeKey);
			}
		}

		const specificScopes = Array.from(availableScopes)
			.filter((scopeKey) => scopeKey !== GENERAL_SCOPE_KEY && scopeKey !== GLOBAL_SCOPE_KEY)
			.sort((a, b) => a.localeCompare(b));

		return [GENERAL_SCOPE_KEY, ...specificScopes];
	}

	private getScopeOptionLabel(scopeKey: string): string {
		if (scopeKey === GENERAL_SCOPE_KEY) {
			return `${translations.scope}: ${translations.generalAllScopes}`;
		}

		if (scopeKey === GLOBAL_SCOPE_KEY) {
			return `${translations.scope}: ${translations.general}`;
		}

		return `${translations.scope}: ${scopeKey.replace(/^scope:/, '')}`;
	}

	private getSortedComponentNames(): string[] {
		return Array.from(this.editableComponents)
			.filter((componentName) => this.getVisibleCategoriesForComponent(componentName).length > 0)
			.sort((a, b) => a.localeCompare(b));
	}

	private getVisibleCategoriesForComponent(componentName: string): TokenCategory[] {
		const categories = this.buildCategoriesForComponent(componentName);
		if (this.showLockedFields) {
			return categories;
		}

		return categories
			.map((category) => ({
				...category,
				settings: category.settings.filter((setting) => !setting.locked),
			}))
			.filter((category) => category.settings.length > 0);
	}

	private syncVisibleComponentState(): void {
		const visibleComponentNames = this.getSortedComponentNames();
		if (!this.activeComponent || !visibleComponentNames.includes(this.activeComponent)) {
			this.activeComponent = visibleComponentNames[0] ?? null;
		}

		if (this.activeTargetElement && (!this.activeComponent || normalizeComponentName(this.activeTargetElement.dataset.component || '') !== this.activeComponent)) {
			this.activeTargetElement.classList.remove('db-component-target-active');
			this.activeTargetElement = null;
			this.activeTargetWasPicked = false;
		}

		if (this.activeComponent) {
			const availableScopeKeys = this.getAvailableScopeKeys(this.activeComponent);
			if (!availableScopeKeys.includes(this.activeScopeKey)) {
				this.activeScopeKey = GENERAL_SCOPE_KEY;
			}
			const preferredElement = this.activeTargetWasPicked ? (this.activeTargetElement ?? undefined) : undefined;
			this.setActiveTarget(this.activeComponent, this.activeScopeKey, preferredElement, this.activeTargetWasPicked);
		} else {
			this.activeScopeKey = GENERAL_SCOPE_KEY;
			this.activeTargetWasPicked = false;
		}
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
						${translations.preset}
						<select
							id="db-component-preset-select"
							class="db-control-text"
							data-action="select-preset"
							.value=${activePresetKey}
							@change=${this.handlePresetSelectChange}
						>
							<option value="">${translations.chooseAPreset}</option>
							${
								hasProvidedPresets
									? html`
										<optgroup label="Built-in presets">
											${presetOptions.filter((preset) => preset.source === 'provided').map((preset) => html`<option value=${preset.key}>${preset.label}</option>`)}
										</optgroup>
									`
									: nothing
							}
							${
								savedPresetOptions.length > 0
									? html`
										<optgroup label="${translations.savedPresets}">
											${savedPresetOptions.map((preset) => html`<option value=${preset.key}>${preset.label}</option>`)}
										</optgroup>
									`
									: nothing
							}
						</select>
					</label>
					<details class="db-presets-menu">
						<summary class="db-btn db-presets-menu-trigger db-tooltip-target" aria-label="${translations.presetActions}" data-tooltip="${translations.presetActions}">
							<svg class="db-btn-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
								<title>${translations.presetActions}</title>
								<path
									fill="currentColor"
									d="M12 7a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm0 6.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm0 6.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"
								/>
							</svg>
						</summary>
						<div class="db-presets-menu-content" role="menu" aria-label="${translations.presetActions}">
							<button type="button" class="db-btn db-btn-primary" data-action="save-preset" role="menuitem" @click=${this.handleSavePresetClick}>
								${translations.savePreset}
							</button>
							<button
								type="button"
								class="db-btn"
								data-action="delete-preset"
								role="menuitem"
								?disabled=${activeSavedPreset === null}
								@click=${this.handleDeleteActivePresetClick}
							>
								${translations.deletePreset}
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
		return (
			presetOptions.find((preset) =>
				designBuilderPresetMatchesState(
					{
						id: preset.id,
						label: preset.label,
						state: preset.state,
						targets: preset.targets,
					},
					currentState,
				),
			)?.key ?? ''
		);
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

		this.syncVisibleComponentState();

		if (!this.activeComponent) {
			renderTemplate(html`No component selected.`, this.controlsContainer);
			return;
		}

		const categories = this.getVisibleCategoriesForComponent(this.activeComponent);
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

	private renderControlsCategoryTemplate(category: TokenCategory): HTMLElement {
		return createDesignBuilderCategory(
			category,
			category.settings.map((setting) => this.renderControl(setting)),
			false,
		);
	}

	private renderControl(setting: TokenCategory['settings'][number]): HTMLElement {
		const currentValue = this.overrides[this.activeScopeKey]?.[this.activeComponent as string]?.[setting.variable] || setting.default;
		if (setting.locked) {
			return createReadOnlyDesignBuilderControl(setting, currentValue);
		}

		return createDesignBuilderControl(setting, currentValue, (variable, value, extraValues, options) => {
			this.handleChange(this.activeComponent as string, this.activeScopeKey, variable, value, setting.default, setting.linkedDefaults, extraValues, options);
		});
	}

	private toLocalizedComponentVariable(componentName: string, variable: string): string {
		const trimmed = variable.trim();
		const localizedPrefix = `--c-${componentName}--`;

		if (trimmed.startsWith(localizedPrefix)) {
			return trimmed;
		}

		return `${localizedPrefix}${trimmed.replace(/^--/, '')}`;
	}

	private appendCategory(categories: TokenCategory[], category: TokenCategory): void {
		if (category.settings.length === 0) {
			return;
		}

		const existing = categories.find((item) => item.id === category.id);
		if (existing) {
			existing.settings.push(...category.settings);
			if (!existing.description && category.description) {
				existing.description = category.description;
			}
			if (!existing.present && category.present) {
				existing.present = category.present;
			}
			return;
		}

		categories.push({
			...category,
			settings: [...category.settings],
		});
	}

	private isTokenReferenceSetting(setting: ComponentSettingDefinition): setting is ComponentTokenReferenceSetting {
		return 'token' in setting;
	}

	private findTokenLibraryEntry(tokenName: string): TokenLibrarySettingMatch | null {
		const variable = `--${tokenName}`;
		for (const category of this.tokenLibrary.categories) {
			const matchedSetting = category.settings.find((setting) => setting.variable === variable);
			if (matchedSetting) {
				return {
					category,
					setting: matchedSetting,
				};
			}
		}

		return null;
	}

	private normalizeColorTokenName(tokenName: string): string {
		return tokenName.trim().replace(/^--/, '');
	}

	private describeColorToken(tokenName: string): { family: string; variant: ColorTokenVariant } | null {
		const normalized = this.normalizeColorTokenName(tokenName);
		if (!normalized.startsWith('color--')) {
			return null;
		}

		const rawName = normalized.slice('color--'.length);
		if (rawName.endsWith('-contrast-muted')) {
			return {
				family: rawName.slice(0, -'-contrast-muted'.length),
				variant: 'contrast-muted',
			};
		}

		if (rawName.endsWith('-contrast')) {
			return {
				family: rawName.slice(0, -'-contrast'.length),
				variant: 'contrast',
			};
		}

		if (rawName.endsWith('-border')) {
			return {
				family: rawName.slice(0, -'-border'.length),
				variant: 'border',
			};
		}

		if (rawName.endsWith('-alt')) {
			return {
				family: rawName.slice(0, -'-alt'.length),
				variant: 'alt',
			};
		}

		return {
			family: rawName,
			variant: 'base',
		};
	}

	private composeColorTokenName(family: string, variant: ColorTokenVariant): string {
		switch (variant) {
			case 'base':
				return `color--${family}`;
			case 'contrast':
				return `color--${family}-contrast`;
			case 'contrast-muted':
				return `color--${family}-contrast-muted`;
			case 'border':
				return `color--${family}-border`;
			case 'alt':
				return `color--${family}-alt`;
		}
	}

	private isSelectableLocalColorSetting(categoryId: string, setting: TokenCategory['settings'][number]): boolean {
		if (!LOCAL_COLOR_SOURCE_CATEGORY_IDS.has(categoryId)) {
			return false;
		}

		if (setting.type !== 'color') {
			return false;
		}

		return this.describeColorToken(setting.variable) !== null;
	}

	private normalizeContrastTokenNames(contrast: string | string[] | undefined): string[] {
		if (typeof contrast === 'string') {
			const token = this.normalizeColorTokenName(contrast);
			return token ? [token] : [];
		}

		if (!Array.isArray(contrast)) {
			return [];
		}

		return contrast.map((token) => this.normalizeColorTokenName(token)).filter(Boolean);
	}

	private resolveSourceTokenForVariant(sourceFamily: ColorTokenSourceFamily, variant: ColorTokenVariant): string | null {
		const { variants } = sourceFamily;
		switch (variant) {
			case 'base':
				return variants.base ?? null;
			case 'contrast':
				return variants.contrast ?? variants['contrast-muted'] ?? variants.base ?? null;
			case 'contrast-muted':
				return variants['contrast-muted'] ?? variants.contrast ?? variants.base ?? null;
			case 'border':
				return variants.border ?? variants.base ?? null;
			case 'alt':
				return variants.alt ?? variants.base ?? null;
		}
	}

	private isPaletteFamilyConfigured(sourceFamily: ColorTokenSourceFamily): boolean {
		if (sourceFamily.categoryId !== BRAND_PALETTE_CATEGORY_ID) {
			return true;
		}

		const tokenOverrides = this.hostElement?.overrideState.token ?? {};
		return Object.values(sourceFamily.variants).some((tokenName) => Boolean(tokenName && tokenOverrides[`--${tokenName}`]));
	}

	private isSelectableSwatchFamily(sourceFamily: ColorTokenSourceFamily): boolean {
		return !EXCLUDED_SWATCH_COLOR_FAMILIES.has(sourceFamily.family) && this.isPaletteFamilyConfigured(sourceFamily);
	}

	private buildSelectableColorFamilies(includeStateColors: boolean): ColorTokenSourceFamily[] {
		const families = new Map<string, ColorTokenSourceFamily>();

		for (const category of this.tokenLibrary.categories) {
			if (!LOCAL_COLOR_SOURCE_CATEGORY_IDS.has(category.id)) {
				continue;
			}

			if (!includeStateColors && category.id === STATE_COLOR_SOURCE_CATEGORY_ID) {
				continue;
			}

			for (const setting of category.settings) {
				if (!this.isSelectableLocalColorSetting(category.id, setting)) {
					continue;
				}

				const descriptor = this.describeColorToken(setting.variable);
				if (!descriptor) {
					continue;
				}

				const existing = families.get(descriptor.family) ?? {
					family: descriptor.family,
					label: setting.label,
					categoryId: category.id,
					variants: {},
				};

				existing.variants[descriptor.variant] = this.normalizeColorTokenName(setting.variable);
				if (descriptor.variant === 'base') {
					existing.label = setting.label;
				}

				families.set(descriptor.family, existing);
			}
		}

		return [...families.values()].filter((family) => Boolean(family.variants.base) && this.isSelectableSwatchFamily(family));
	}

	private buildColorLinkedDefaults(componentName: string, targetContrastTokens: string[]): Record<string, string> {
		return Object.fromEntries(targetContrastTokens.map((tokenName) => [this.toLocalizedComponentVariable(componentName, tokenName), `var(--${tokenName})`]));
	}

	private collectLinkedTargetColorTokens(tokenNames: Iterable<string>, tokenName: string, contrast: string | string[] | undefined): string[] {
		const descriptor = this.describeColorToken(tokenName);
		if (!descriptor || descriptor.variant !== 'base') {
			return [];
		}

		const linkedTokens = new Set<string>(this.normalizeContrastTokenNames(contrast));
		for (const candidateTokenName of tokenNames) {
			const normalizedCandidateTokenName = this.normalizeColorTokenName(candidateTokenName);
			const candidateDescriptor = this.describeColorToken(normalizedCandidateTokenName);
			if (!candidateDescriptor || candidateDescriptor.family !== descriptor.family || candidateDescriptor.variant === 'base') {
				continue;
			}

			linkedTokens.add(this.composeColorTokenName(candidateDescriptor.family, candidateDescriptor.variant));
		}

		const variantOrder: Record<ColorTokenVariant, number> = {
			base: 0,
			contrast: 1,
			'contrast-muted': 2,
			border: 3,
			alt: 4,
		};

		return [...linkedTokens].sort((left, right) => {
			const leftDescriptor = this.describeColorToken(left);
			const rightDescriptor = this.describeColorToken(right);
			if (!leftDescriptor || !rightDescriptor) {
				return left.localeCompare(right);
			}

			return variantOrder[leftDescriptor.variant] - variantOrder[rightDescriptor.variant];
		});
	}

	private buildColorExtraValues(componentName: string, targetContrastTokens: string[], sourceFamily: ColorTokenSourceFamily): Record<string, string> | undefined {
		if (targetContrastTokens.length === 0) {
			return undefined;
		}

		const extraValues: Record<string, string> = {};
		for (const targetContrastToken of targetContrastTokens) {
			const descriptor = this.describeColorToken(targetContrastToken);
			if (!descriptor) {
				continue;
			}

			const sourceToken = this.resolveSourceTokenForVariant(sourceFamily, descriptor.variant);
			extraValues[this.toLocalizedComponentVariable(componentName, targetContrastToken)] = sourceToken ? `var(--${sourceToken})` : '';
		}

		return Object.keys(extraValues).length > 0 ? extraValues : undefined;
	}

	private createLocalizedColorSelectionSetting(componentName: string, availableTokenNames: Iterable<string>, tokenName: string, setting: TokenCategory['settings'][number], label: string, description: string | undefined, includeStateColors: boolean): TokenCategory['settings'][number] | null {
		const descriptor = this.describeColorToken(tokenName);
		if (!descriptor) {
			return null;
		}

		const targetContrastTokens = this.collectLinkedTargetColorTokens(availableTokenNames, tokenName, setting.contrast);
		const options = this.buildSelectableColorFamilies(includeStateColors)
			.map((sourceFamily) => {
				const sourceToken = this.resolveSourceTokenForVariant(sourceFamily, descriptor.variant);
				if (!sourceToken) {
					return null;
				}

				const baseToken = sourceFamily.variants.base;
				if (!baseToken) {
					return null;
				}

				return {
					value: `var(--${sourceToken})`,
					label: sourceFamily.label,
					swatch: `var(--${baseToken})`,
					contrastSwatch: sourceFamily.variants.contrast ? `var(--${sourceFamily.variants.contrast})` : undefined,
					extraValues: this.buildColorExtraValues(componentName, targetContrastTokens, sourceFamily),
				};
			})
			.filter((option): option is NonNullable<typeof option> => option !== null);

		if (options.length === 0) {
			return null;
		}

		return {
			...setting,
			variable: this.toLocalizedComponentVariable(componentName, tokenName),
			label,
			description,
			type: 'token-color',
			default: `var(--${tokenName})`,
			locked: setting.locked,
			options,
			linkedDefaults: this.buildColorLinkedDefaults(componentName, targetContrastTokens),
		};
	}

	private collectExposedComponentTokens(settings: ComponentSettingDefinition[]): Set<string> {
		const tokens = new Set<string>();
		for (const setting of settings) {
			if (this.isTokenReferenceSetting(setting)) {
				tokens.add(setting.token);
			}
		}

		return tokens;
	}

	private getComponentSettingVisibilityTargets(componentName: string): HTMLElement[] {
		const activeElement = this.activeTargetElement && normalizeComponentName(this.activeTargetElement.dataset.component || '') === componentName ? this.activeTargetElement : null;
		const contextElements = this.getElementsForContext(componentName, this.activeScopeKey);

		return this.activeTargetWasPicked && activeElement ? [activeElement] : contextElements;
	}

	private matchesVisibilityCondition(targetElement: HTMLElement, condition: ComponentSettingVisibilityCondition | undefined): boolean {
		if (!condition) {
			return true;
		}

		if (condition.hasClass?.some((className) => !targetElement.classList.contains(className))) {
			return false;
		}

		if (condition.hasAnyClass && condition.hasAnyClass.length > 0 && !condition.hasAnyClass.some((className) => targetElement.classList.contains(className))) {
			return false;
		}

		if (condition.doesNotHaveClass?.some((className) => targetElement.classList.contains(className))) {
			return false;
		}

		return true;
	}

	private isComponentSettingVisible(setting: ComponentSettingDefinition, targetElements: HTMLElement[]): boolean {
		if (!setting.visibleWhen || targetElements.length === 0) {
			return true;
		}

		return targetElements.some((targetElement) => this.matchesVisibilityCondition(targetElement, setting.visibleWhen));
	}

	private getRedundantCompanionColorTokens(tokenNames: Iterable<string>): Set<string> {
		const normalized = new Set<string>([...tokenNames].map((tokenName) => this.normalizeColorTokenName(tokenName)));
		const redundant = new Set<string>();

		for (const tokenName of normalized) {
			const descriptor = this.describeColorToken(tokenName);
			if (!descriptor || descriptor.variant !== 'base') {
				continue;
			}

			const contrastToken = this.composeColorTokenName(descriptor.family, 'contrast');
			const mutedContrastToken = this.composeColorTokenName(descriptor.family, 'contrast-muted');
			if (normalized.has(contrastToken)) {
				redundant.add(contrastToken);
			}
			if (normalized.has(mutedContrastToken)) {
				redundant.add(mutedContrastToken);
			}
		}

		return redundant;
	}

	private resolveComponentSetting(componentName: string, availableTokenNames: Set<string>, hiddenTokenNames: Set<string>, setting: ComponentSettingDefinition): TokenCategory['settings'][number] | null {
		if (this.isTokenReferenceSetting(setting)) {
			if (!availableTokenNames.has(setting.token)) {
				return null;
			}

			if (hiddenTokenNames.has(setting.token)) {
				return null;
			}

			const tokenEntry = this.findTokenLibraryEntry(setting.token);
			if (!tokenEntry) {
				return null;
			}

			const tokenSetting = tokenEntry.setting;
			if (this.isSelectableLocalColorSetting(tokenEntry.category.id, tokenSetting)) {
				return this.createLocalizedColorSelectionSetting(componentName, availableTokenNames, setting.token, tokenSetting, setting.label, setting.description ?? tokenSetting.description, setting.includeStateColors === true);
			}

			return {
				...tokenSetting,
				variable: this.toLocalizedComponentVariable(componentName, setting.token),
				label: setting.label,
				description: setting.description ?? tokenSetting.description,
				locked: tokenSetting.locked,
			};
		}

		const localizedVariable = this.toLocalizedComponentVariable(componentName, setting.variable);
		const tokenEntry = this.findTokenLibraryEntry(setting.variable.replace(/^--/, ''));
		if (tokenEntry && this.isSelectableLocalColorSetting(tokenEntry.category.id, tokenEntry.setting)) {
			return this.createLocalizedColorSelectionSetting(componentName, availableTokenNames, setting.variable.replace(/^--/, ''), tokenEntry.setting, setting.label, setting.description, false);
		}

		return {
			...setting,
			variable: localizedVariable,
		};
	}

	private buildLegacyTokenCategories(componentName: string, availableTokenNames: Set<string>, includeStateColors = false): TokenCategory[] {
		const categories: TokenCategory[] = [];
		const hiddenTokenNames = this.getRedundantCompanionColorTokens(availableTokenNames);

		for (const category of this.tokenLibrary.categories) {
			const matchedSettings = category.settings
				.filter((setting) => availableTokenNames.has(setting.variable.replace(/^--/, '')) && !hiddenTokenNames.has(setting.variable.replace(/^--/, '')))
				.map((setting) => {
					const tokenName = setting.variable.replace(/^--/, '');
					if (this.isSelectableLocalColorSetting(category.id, setting)) {
						return this.createLocalizedColorSelectionSetting(componentName, availableTokenNames, tokenName, setting, setting.label, setting.description, includeStateColors);
					}

					return {
						...setting,
						variable: this.toLocalizedComponentVariable(componentName, tokenName),
					};
				})
				.filter((setting): setting is NonNullable<typeof setting> => setting !== null);

			this.appendCategory(categories, {
				id: category.id,
				label: category.label,
				description: category.description,
				present: category.present,
				settings: matchedSettings,
			});
		}

		return categories;
	}

	private buildCategoriesForComponent(componentName: string): TokenCategory[] {
		const definition = this.componentData[componentName];
		const tokens = Array.isArray(definition?.tokens) ? definition.tokens : [];
		const availableTokenNames = new Set(tokens.map((token) => token.trim()).filter(Boolean));
		const componentSettings = Array.isArray(definition?.componentSettings) ? definition.componentSettings : [];

		if (componentSettings.length === 0) {
			return this.buildLegacyTokenCategories(componentName, availableTokenNames);
		}

		const categories: TokenCategory[] = [];
		const exposedTokenNames = this.collectExposedComponentTokens(componentSettings.flatMap((category) => category.settings));
		const hiddenTokenNames = this.getRedundantCompanionColorTokens(exposedTokenNames);
		const targetElements = this.getComponentSettingVisibilityTargets(componentName);
		for (const category of componentSettings) {
			const matchedSettings = category.settings
				.filter((setting) => this.isComponentSettingVisible(setting, targetElements))
				.map((setting) => this.resolveComponentSetting(componentName, availableTokenNames, hiddenTokenNames, setting))
				.filter((setting): setting is TokenCategory['settings'][number] => setting !== null);

			this.appendCategory(categories, {
				id: category.id,
				label: category.label,
				description: category.description,
				present: category.present,
				settings: matchedSettings,
			});
		}

		return categories;
	}

	private handleChange(componentName: string, scopeKey: string, variable: string, value: string, defaultValue: string, linkedDefaults: Record<string, string> = {}, extraValues: Record<string, string> = {}, options: ControlChangeOptions = {}): void {
		if (!this.overrides[scopeKey]) {
			this.overrides[scopeKey] = {};
		}

		if (!this.overrides[scopeKey][componentName]) {
			this.overrides[scopeKey][componentName] = {};
		}

		const nextValues = {
			[variable]: value,
			...extraValues,
		};
		const defaultValues = {
			[variable]: defaultValue,
			...linkedDefaults,
		};

		for (const [currentVariable, currentDefaultValue] of Object.entries(defaultValues)) {
			const nextValue = nextValues[currentVariable] ?? '';
			const shouldRemoveOverride = !nextValue || (!options.preserveMatchingDefault && nextValue === currentDefaultValue);
			if (shouldRemoveOverride) {
				delete this.overrides[scopeKey][componentName][currentVariable];
				this.removeVariable(componentName, scopeKey, currentVariable);
				continue;
			}

			this.overrides[scopeKey][componentName][currentVariable] = nextValue;
			this.applyVariable(componentName, scopeKey, currentVariable, nextValue);
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
			relatedVariables: Object.keys(linkedDefaults),
		});
	}

	private hasLocalScopeOverrideForElement(componentName: string, variable: string, element: HTMLElement): boolean {
		const localScopeKeys = getNamedScopeKeysForElement(element);
		if (localScopeKeys.length === 0) {
			return false;
		}

		return localScopeKeys.some((localScopeKey) => {
			const localValue = this.overrides[localScopeKey]?.[componentName]?.[variable];
			return typeof localValue === 'string' && localValue.trim() !== '';
		});
	}

	private applyVariable(componentName: string, scopeKey: string, variable: string, value: string): void {
		let elements = this.getElementsForContext(componentName, scopeKey);
		if (scopeKey === GENERAL_SCOPE_KEY) {
			elements = elements.filter((element) => !this.hasLocalScopeOverrideForElement(componentName, variable, element));
		}

		for (const element of elements) {
			for (const target of getComponentOverrideTargets(element, componentName)) {
				target.style.setProperty(variable, value);
			}
		}
	}

	private removeVariable(componentName: string, scopeKey: string, variable: string): void {
		let elements = this.getElementsForContext(componentName, scopeKey);
		if (scopeKey === GENERAL_SCOPE_KEY) {
			elements = elements.filter((element) => !this.hasLocalScopeOverrideForElement(componentName, variable, element));
		}

		for (const element of elements) {
			for (const target of getComponentOverrideTargets(element, componentName)) {
				target.style.removeProperty(variable);
			}
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

		this.menuDismissController?.dispose();
		this.menuDismissController = null;

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
		this.rememberLastEditedComponent(this.activeComponent);
		this.activeTargetWasPicked = false;
		if (this.activeComponent) {
			this.refreshScopeSelect();
			this.setActiveTarget(this.activeComponent, this.activeScopeKey);
		}
		this.renderControls();
	};

	private readonly handleScopeSelectChange = (event: Event): void => {
		this.activeScopeKey = (event.currentTarget as HTMLSelectElement).value || GENERAL_SCOPE_KEY;
		this.activeTargetWasPicked = false;
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
