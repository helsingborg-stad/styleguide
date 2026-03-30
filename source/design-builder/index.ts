/**
 * Design Builder — Token Settings Panel
 *
 * Entry point for the design builder page.
 * Reads design-tokens.json from the page, renders controls,
 * and manages live preview + storage.
 */

import {
	createContrastPair,
	createControl,
	createReadOnlyControl,
	createSwatchBand,
	type TokenSetting,
} from './controls';
import { LocalStorageAdapter, PresetManager, type StorageAdapter } from './storage';

interface TokenCategory {
	id: string;
	label: string;
	description?: string;
	present?: 'swatch';
	settings: TokenSetting[];
}

interface TokenData {
	name: string;
	version: string;
	categories: TokenCategory[];
}

interface ComponentTokenDefinition {
	name?: string;
	slug?: string;
	tokens?: string[];
}

type ComponentTokenData = Record<string, ComponentTokenDefinition>;
type ComponentVariableOverrides = Record<string, string>;
type ComponentOverrides = Record<string, ComponentVariableOverrides>;
type ScopedComponentOverrides = Record<string, ComponentOverrides>;

declare global {
	interface Window {
		styleguideCustomizeData?: unknown;
		styleguideDesignTokenLibrary?: unknown;
		styleguideCustomizeInitMode?: unknown;
	}
}

const COMPONENT_STORAGE_KEY = 'design-tokens-component-overrides';
const GLOBAL_SCOPE_KEY = '__global__';
const GENERAL_SCOPE_KEY = '__general__';
const NON_CUSTOMIZABLE_COMPONENTS = new Set(['scope', 'fab']);
const CUSTOMIZE_INIT_MODE_ONLOAD = 'onload';
const CUSTOMIZE_INIT_MODE_MANUAL = 'manual';
const CUSTOMIZE_MANUAL_TRIGGER_SELECTOR = '[data-customize-init-fab]';

type CustomizeInitMode = typeof CUSTOMIZE_INIT_MODE_ONLOAD | typeof CUSTOMIZE_INIT_MODE_MANUAL;

class ComponentStorageAdapter {
	private key: string;

	constructor(key: string = COMPONENT_STORAGE_KEY) {
		this.key = key;
	}

	public load(): ScopedComponentOverrides {
		try {
			const raw = localStorage.getItem(this.key);
			if (!raw) return {};
			const parsed = JSON.parse(raw);
			if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
				return {};
			}

			if (this.isLegacyComponentOverrides(parsed as Record<string, unknown>)) {
				const legacy = this.normalizeComponentOverrides(parsed as Record<string, unknown>);
				if (Object.keys(legacy).length === 0) {
					return {};
				}

				return {
					[GLOBAL_SCOPE_KEY]: legacy,
				};
			}

			return this.normalizeScopedOverrides(parsed as Record<string, unknown>);
		} catch {
			return {};
		}
	}

	public save(overrides: ScopedComponentOverrides): void {
		const cleaned = this.normalizeScopedOverrides(overrides as Record<string, unknown>);

		if (Object.keys(cleaned).length === 0) {
			localStorage.removeItem(this.key);
			return;
		}

		localStorage.setItem(this.key, JSON.stringify(cleaned));
	}

	private isLegacyComponentOverrides(input: Record<string, unknown>): boolean {
		const values = Object.values(input);
		if (values.length === 0) {
			return false;
		}

		return values.every((value) => {
			if (!value || typeof value !== 'object' || Array.isArray(value)) {
				return false;
			}

			const variableValues = Object.values(value as Record<string, unknown>);
			return variableValues.every((entry) => typeof entry === 'string');
		});
	}

	private normalizeScopedOverrides(input: Record<string, unknown>): ScopedComponentOverrides {
		const result: ScopedComponentOverrides = {};

		for (const [scopeKey, scopeValue] of Object.entries(input)) {
			if (!scopeValue || typeof scopeValue !== 'object' || Array.isArray(scopeValue)) continue;

			const componentOverrides = this.normalizeComponentOverrides(scopeValue as Record<string, unknown>);
			if (Object.keys(componentOverrides).length > 0) {
				result[scopeKey] = componentOverrides;
			}
		}

		return result;
	}

	private normalizeComponentOverrides(input: Record<string, unknown>): ComponentOverrides {
		const cleaned: ComponentOverrides = {};

		for (const [componentName, values] of Object.entries(input)) {
			if (!values || typeof values !== 'object' || Array.isArray(values)) continue;

			const filtered: ComponentVariableOverrides = {};

			for (const [variable, value] of Object.entries(values)) {
				if (typeof value === 'string' && value.trim() !== '') {
					filtered[variable] = value;
				}
			}

			if (Object.keys(filtered).length > 0) {
				cleaned[componentName] = filtered;
			}
		}

		return cleaned;
	}
}

class ComponentCustomizationTool {
	private componentData: ComponentTokenData;
	private tokenLibrary: TokenData;
	private storage: ComponentStorageAdapter;
	private overrides: ScopedComponentOverrides;
	private elementsByComponent = new Map<string, HTMLElement[]>();
	private editableComponents = new Set<string>();
	private activeComponent: string | null = null;
	private activeScopeKey: string = GENERAL_SCOPE_KEY;
	private root: HTMLElement | null = null;
	private controlsContainer: HTMLElement | null = null;
	private componentSelect: HTMLSelectElement | null = null;
	private scopeSelect: HTMLSelectElement | null = null;
	private activeTargetElement: HTMLElement | null = null;

	constructor(componentData: ComponentTokenData, tokenLibrary: TokenData) {
		this.componentData = componentData;
		this.tokenLibrary = tokenLibrary;
		this.storage = new ComponentStorageAdapter();
		this.overrides = this.storage.load();

		this.collectComponentElements();
		this.collectEditableComponents();
		this.pruneUnknownOverrides();
		this.applySavedOverrides();
		this.setupEditableTargets();
		this.render();
		this.bindComponentSelection();
	}

	private collectComponentElements(): void {
		const nodes = document.querySelectorAll<HTMLElement>('[data-component]');

		for (const node of nodes) {
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

	private setupEditableTargets(): void {
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
					link.addEventListener('click', (event) => {
						event.preventDefault();
					});
				}
			}
		}
	}

	private bindComponentSelection(): void {
		for (const [componentName, elements] of this.elementsByComponent.entries()) {
			if (!this.editableComponents.has(componentName)) continue;

			for (const element of elements) {
				element.addEventListener('click', (event: MouseEvent) => {
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
					this.root.classList.add('db-component-tool--open');
				});
			}
		}
	}

	private render(): void {
		if (this.editableComponents.size === 0) return;

		const root = document.createElement('aside');
		root.className = 'db-component-tool';
		root.innerHTML = `
			<div class="db-component-tool__panel">
				<div class="db-component-tool__header">
					<strong>Component customization</strong>
					<button type="button" class="db-component-tool__close" data-action="close-panel" aria-label="Close component customization">×</button>
				</div>
				<div class="db-component-tool__select-row">
					<label for="db-component-select">Component</label>
					<select id="db-component-select" data-action="select-component"></select>
				</div>
				<div class="db-component-tool__select-row">
					<label for="db-scope-select">Scope</label>
					<select id="db-scope-select" data-action="select-scope"></select>
				</div>
				<div class="db-component-tool__actions">
					<button type="button" class="db-btn" data-action="reset-component">Reset selected</button>
					<button type="button" class="db-btn db-btn--danger" data-action="reset-all-components">Reset all</button>
				</div>
				<div class="db-component-tool__controls" data-component-controls></div>
			</div>
		`;

		document.body.appendChild(root);
		this.root = root;
		this.controlsContainer = root.querySelector<HTMLElement>('[data-component-controls]');
		this.componentSelect = root.querySelector<HTMLSelectElement>('[data-action="select-component"]');
		this.scopeSelect = root.querySelector<HTMLSelectElement>('[data-action="select-scope"]');

		const closeButton = root.querySelector<HTMLElement>('[data-action="close-panel"]');
		closeButton?.addEventListener('click', () => root.classList.remove('db-component-tool--open'));

		if (this.componentSelect) {
			this.componentSelect.innerHTML = '';

			for (const componentName of this.getSortedComponentNames()) {
				const option = document.createElement('option');
				option.value = componentName;
				option.textContent = this.getComponentLabel(componentName);
				this.componentSelect.appendChild(option);
			}

			if (this.activeComponent && this.getSortedComponentNames().includes(this.activeComponent)) {
				this.componentSelect.value = this.activeComponent;
			}

			this.refreshScopeSelect();

			this.componentSelect.addEventListener('change', () => {
				this.activeComponent = this.componentSelect?.value || null;
				if (this.activeComponent) {
					this.refreshScopeSelect();
					this.setActiveTarget(this.activeComponent, this.activeScopeKey);
				}
				this.renderControls();
			});
		}

		if (this.scopeSelect) {
			this.scopeSelect.addEventListener('change', () => {
				this.activeScopeKey = this.scopeSelect?.value || GENERAL_SCOPE_KEY;
				if (this.activeComponent) {
					this.setActiveTarget(this.activeComponent, this.activeScopeKey);
				}
				this.renderControls();
			});
		}

		root.querySelector('[data-action="reset-component"]')?.addEventListener('click', () => {
			if (!this.activeComponent) return;
			this.resetComponent(this.activeComponent);
		});

		root.querySelector('[data-action="reset-all-components"]')?.addEventListener('click', () => {
			this.resetAllComponents();
		});

		this.renderControls();
		if (this.activeComponent) {
			this.setActiveTarget(this.activeComponent, this.activeScopeKey);
		}
	}

	private setActiveTarget(componentName: string, scopeKey: string, preferredElement?: HTMLElement): void {
		if (this.activeTargetElement) {
			this.activeTargetElement.classList.remove('db-component-target--active');
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

		target.classList.add('db-component-target--active');
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

		this.scopeSelect.innerHTML = '';

		for (const scopeKey of availableScopeKeys) {
			const option = document.createElement('option');
			option.value = scopeKey;
			option.textContent = this.getScopeOptionLabel(scopeKey);
			this.scopeSelect.appendChild(option);
		}

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

	private renderControls(): void {
		if (!this.controlsContainer) return;
		this.controlsContainer.innerHTML = '';

		if (!this.activeComponent) {
			this.controlsContainer.textContent = 'No component selected.';
			return;
		}

		const categories = this.buildCategoriesForComponent(this.activeComponent);
		if (categories.length === 0) {
			this.controlsContainer.textContent = 'No token customization options were found for this component.';
			return;
		}

		for (const category of categories) {
			const section = document.createElement('section');
			section.className = 'db-category';

			const header = document.createElement('div');
			header.className = 'db-category__header';
			header.innerHTML = `<h2 class="db-category__title">${category.label}</h2>`;
			section.appendChild(header);

			const body = document.createElement('div');
			body.className = 'db-category__body';

			for (const setting of category.settings) {
				const currentValue =
					this.overrides[this.activeScopeKey]?.[this.activeComponent]?.[setting.variable] || setting.default;
				const control = createControl(setting, currentValue, (variable, value) => {
					this.handleChange(this.activeComponent as string, this.activeScopeKey, variable, value, setting.default);
				});
				body.appendChild(control);
			}

			section.appendChild(body);
			this.controlsContainer.appendChild(section);
		}
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
	}

	private applyVariable(componentName: string, scopeKey: string, variable: string, value: string): void {
		const elements = this.getElementsForContext(componentName, scopeKey);
		for (const element of elements) {
			element.style.setProperty(variable, value);
		}
	}

	private removeVariable(componentName: string, scopeKey: string, variable: string): void {
		const elements = this.getElementsForContext(componentName, scopeKey);
		for (const element of elements) {
			element.style.removeProperty(variable);
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
		this.renderControls();
	}

	private resetAllComponents(): void {
		if (!confirm('Reset all component customizations on this page?')) {
			return;
		}

		for (const [scopeKey, scopeOverrides] of Object.entries(this.overrides)) {
			for (const [componentName, componentOverrides] of Object.entries(scopeOverrides)) {
				for (const variable of Object.keys(componentOverrides)) {
					this.removeVariable(componentName, scopeKey, variable);
				}
			}
		}

		this.overrides = {};
		this.storage.save(this.overrides);
		this.renderControls();
	}
}

function normalizeComponentName(value: string): string {
	return value.trim().toLowerCase().replace(/^c-/, '');
}

function parseComponentTokenData(raw: unknown): ComponentTokenData {
	if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
		return {};
	}

	const parsed: ComponentTokenData = {};
	for (const [key, value] of Object.entries(raw)) {
		const normalizedKey = normalizeComponentName(key);
		if (!normalizedKey) continue;

		if (!value || typeof value !== 'object' || Array.isArray(value)) {
			continue;
		}

		const definition = value as Record<string, unknown>;
		parsed[normalizedKey] = {
			name: typeof definition.name === 'string' ? definition.name : undefined,
			slug: typeof definition.slug === 'string' ? normalizeComponentName(definition.slug) : normalizedKey,
			tokens: Array.isArray(definition.tokens)
				? definition.tokens.filter((token): token is string => typeof token === 'string')
				: [],
		};
	}

	return parsed;
}

function isTokenData(value: unknown): value is TokenData {
	if (!value || typeof value !== 'object' || Array.isArray(value)) {
		return false;
	}

	const maybeData = value as { categories?: unknown };
	return Array.isArray(maybeData.categories);
}

async function loadTokenLibrary(): Promise<TokenData | null> {
	const embeddedLibrary = window.styleguideDesignTokenLibrary;
	if (isTokenData(embeddedLibrary)) {
		return embeddedLibrary;
	}

	return null;
}

function resolveCustomizeInitMode(): CustomizeInitMode {
	const rawMode =
		typeof window.styleguideCustomizeInitMode === 'string'
			? window.styleguideCustomizeInitMode.toLowerCase().trim()
			: '';

	if (rawMode === CUSTOMIZE_INIT_MODE_MANUAL) {
		return CUSTOMIZE_INIT_MODE_MANUAL;
	}

	return CUSTOMIZE_INIT_MODE_ONLOAD;
}

class DesignBuilder {
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
		// Header
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

		// Bind header actions
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

		// Preset bar
		this.presetBar = this.renderPresetBar();
		this.container.appendChild(this.presetBar);

		// Categories
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

		// Category header (collapsible)
		const header = document.createElement('div');
		header.className = 'db-category__header';
		header.innerHTML = `
      <h2 class="db-category__title">${category.label}</h2>
      ${category.description ? `<p class="db-category__description">${category.description}</p>` : ''}
      <span class="db-category__toggle material-symbols-outlined">expand_more</span>
    `;
		section.appendChild(header);

		// Category body
		const body = document.createElement('div');
		body.className = 'db-category__body';

		if (category.present === 'swatch') {
			body.appendChild(createSwatchBand(category.settings));
		} else {
			// Build lookup and track which settings are contrast targets
			const settingsMap = new Map<string, TokenSetting>();
			for (const setting of category.settings) {
				settingsMap.set(setting.variable, setting);
			}

			const contrastVars = new Set<string>();
			for (const s of category.settings) {
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

			for (const setting of category.settings) {
				if (setting.locked) {
					if (!this.showLockedFields) {
						continue;
					}

					const currentValue = this.overrides[setting.variable] || setting.default;
					body.appendChild(createReadOnlyControl(setting, currentValue));
					continue;
				}

				// Skip tokens already rendered as part of a contrast pair
				if (contrastVars.has(setting.variable)) continue;

				if (setting.contrast) {
					// Collect all contrast settings for this base
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
								const allSettings = [setting, ...contrasts.map((c) => c.setting)];
								const def = allSettings.find((s) => s.variable === variable)?.default || '';
								this.handleChange(variable, value, def);
							}),
						);
					}
				} else {
					// Regular control
					const currentValue = this.overrides[setting.variable] || setting.default;
					const control = createControl(setting, currentValue, (variable, value) => {
						this.handleChange(variable, value, setting.default);
					});
					body.appendChild(control);
				}
			}
		}

		section.appendChild(body);

		// Toggle collapse
		header.addEventListener('click', () => {
			section.classList.toggle('db-category--collapsed');
		});

		return section;
	}

	private handleChange(variable: string, value: string, defaultValue: string): void {
		// If value matches default or is empty, remove the override
		if (!value || value === defaultValue) {
			delete this.overrides[variable];
		} else {
			this.overrides[variable] = value;
		}

		// Apply to :root immediately
		if (value && value !== defaultValue) {
			document.documentElement.style.setProperty(variable, value);
		} else {
			document.documentElement.style.removeProperty(variable);
		}

		// Debounced save
		this.debounceSave();

		// Manual edit deactivates preset
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

		// Remove all overrides from :root
		for (const prop of Object.keys(this.overrides)) {
			document.documentElement.style.removeProperty(prop);
		}

		this.overrides = {};
		this.storage.clear();
		this.presetManager.clearActive();

		// Re-render
		this.container.innerHTML = '';
		this.render();
	}

	private exportJson(): void {
		const data = JSON.stringify(this.overrides, null, 2);
		const blob = new Blob([data], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'design-tokens-overrides.json';
		a.click();
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

	// --- Preset Management ---

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
		del.addEventListener('click', (e) => {
			e.stopPropagation();
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

		// Remove current overrides from :root
		for (const prop of Object.keys(this.overrides)) {
			document.documentElement.style.removeProperty(prop);
		}

		// Replace overrides and apply
		this.overrides = { ...presetOverrides };
		this.applyAll();
		this.storage.save(this.overrides);
		this.presetManager.setActive(name);

		// Re-render controls with new values
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

// --- Draggable Divider ---

const SPLIT_STORAGE_KEY = 'design-builder-split';
const MIN_SPLIT = 20;
const MAX_SPLIT = 80;

function initDivider(): void {
	const layout = document.querySelector<HTMLElement>('.db-layout');
	const divider = document.querySelector<HTMLElement>('[data-db-divider]');
	if (!layout || !divider) return;

	// Restore saved ratio
	const saved = localStorage.getItem(SPLIT_STORAGE_KEY);
	if (saved) {
		const ratio = parseFloat(saved);
		if (ratio >= MIN_SPLIT && ratio <= MAX_SPLIT) {
			layout.style.setProperty('--db-split', `${ratio}%`);
		}
	}

	const onPointerMove = (e: PointerEvent) => {
		const rect = layout.getBoundingClientRect();
		let ratio = ((e.clientX - rect.left) / rect.width) * 100;
		ratio = Math.max(MIN_SPLIT, Math.min(MAX_SPLIT, ratio));
		layout.style.setProperty('--db-split', `${ratio}%`);
	};

	const onPointerUp = (e: PointerEvent) => {
		divider.classList.remove('is-dragging');
		document.body.style.userSelect = '';
		document.body.style.cursor = '';
		divider.releasePointerCapture(e.pointerId);
		divider.removeEventListener('pointermove', onPointerMove);
		divider.removeEventListener('pointerup', onPointerUp);

		// Persist
		const current = layout.style.getPropertyValue('--db-split');
		if (current) {
			localStorage.setItem(SPLIT_STORAGE_KEY, parseFloat(current).toString());
		}
	};

	divider.addEventListener('pointerdown', (e: PointerEvent) => {
		e.preventDefault();
		divider.classList.add('is-dragging');
		document.body.style.userSelect = 'none';
		document.body.style.cursor = 'col-resize';
		divider.setPointerCapture(e.pointerId);
		divider.addEventListener('pointermove', onPointerMove);
		divider.addEventListener('pointerup', onPointerUp);
	});
}

// --- Init ---

let hasInitializedComponentCustomization = false;

function initializeDesignBuilderContainer(): boolean {
	const container = document.querySelector<HTMLElement>('[data-design-builder]');
	if (!container) {
		return false;
	}

	const tokensAttr = container.getAttribute('data-tokens');
	if (!tokensAttr) {
		container.textContent = 'Error: No token data found.';
		return true;
	}

	let tokens: TokenData;
	try {
		tokens = JSON.parse(tokensAttr);
	} catch {
		container.textContent = 'Error: Invalid token data.';
		return true;
	}

	const storage = new LocalStorageAdapter();
	new DesignBuilder(container, tokens, storage);
	initDivider();

	return true;
}

async function initializeComponentCustomizationTool(): Promise<void> {
	if (hasInitializedComponentCustomization) {
		return;
	}

	const customizeData = parseComponentTokenData(window.styleguideCustomizeData);
	if (Object.keys(customizeData).length === 0) {
		return;
	}

	const tokenLibrary = await loadTokenLibrary();
	if (!tokenLibrary) {
		return;
	}

	new ComponentCustomizationTool(customizeData, tokenLibrary);
	hasInitializedComponentCustomization = true;
}

function openComponentCustomizationPanel(): void {
	const panelRoot = document.querySelector<HTMLElement>('.db-component-tool');
	if (!panelRoot) {
		return;
	}

	panelRoot.classList.add('db-component-tool--open');
}

function bindManualCustomizationInitTrigger(): void {
	const triggers = document.querySelectorAll<HTMLElement>(CUSTOMIZE_MANUAL_TRIGGER_SELECTOR);
	if (triggers.length === 0) {
		void initializeComponentCustomizationTool();
		return;
	}

	for (const trigger of triggers) {
		trigger.addEventListener('click', async () => {
			await initializeComponentCustomizationTool();
			openComponentCustomizationPanel();
		});
	}
}

async function init(): Promise<void> {
	if (initializeDesignBuilderContainer()) {
		return;
	}

	if (resolveCustomizeInitMode() === CUSTOMIZE_INIT_MODE_MANUAL) {
		bindManualCustomizationInitTrigger();
		return;
	}

	await initializeComponentCustomizationTool();
}

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', () => {
		void init();
	});
} else {
	void init();
}
