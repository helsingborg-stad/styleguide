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
type ComponentOverrides = Record<string, Record<string, string>>;

declare global {
	interface Window {
		styleguideCustomizeData?: unknown;
		styleguideDesignTokenLibrary?: unknown;
	}
}

const COMPONENT_STORAGE_KEY = 'design-tokens-component-overrides';

class ComponentStorageAdapter {
	private key: string;

	constructor(key: string = COMPONENT_STORAGE_KEY) {
		this.key = key;
	}

	public load(): ComponentOverrides {
		try {
			const raw = localStorage.getItem(this.key);
			if (!raw) return {};
			const parsed = JSON.parse(raw);
			if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
				return {};
			}

			const result: ComponentOverrides = {};
			for (const [componentName, values] of Object.entries(parsed)) {
				if (!values || typeof values !== 'object' || Array.isArray(values)) continue;

				const componentOverrides: Record<string, string> = {};
				for (const [variable, value] of Object.entries(values)) {
					if (typeof value === 'string' && value.trim() !== '') {
						componentOverrides[variable] = value;
					}
				}

				if (Object.keys(componentOverrides).length > 0) {
					result[componentName] = componentOverrides;
				}
			}

			return result;
		} catch {
			return {};
		}
	}

	public save(overrides: ComponentOverrides): void {
		const cleaned: ComponentOverrides = {};

		for (const [componentName, values] of Object.entries(overrides)) {
			const filtered: Record<string, string> = {};

			for (const [variable, value] of Object.entries(values)) {
				if (typeof value === 'string' && value.trim() !== '') {
					filtered[variable] = value;
				}
			}

			if (Object.keys(filtered).length > 0) {
				cleaned[componentName] = filtered;
			}
		}

		if (Object.keys(cleaned).length === 0) {
			localStorage.removeItem(this.key);
			return;
		}

		localStorage.setItem(this.key, JSON.stringify(cleaned));
	}
}

class ComponentCustomizationTool {
	private componentData: ComponentTokenData;
	private tokenLibrary: TokenData;
	private storage: ComponentStorageAdapter;
	private overrides: ComponentOverrides;
	private elementsByComponent = new Map<string, HTMLElement[]>();
	private editableComponents = new Set<string>();
	private activeComponent: string | null = null;
	private root: HTMLElement | null = null;
	private controlsContainer: HTMLElement | null = null;
	private componentSelect: HTMLSelectElement | null = null;

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

			const existing = this.elementsByComponent.get(componentName) || [];
			existing.push(node);
			this.elementsByComponent.set(componentName, existing);
		}

		this.activeComponent = this.elementsByComponent.keys().next().value || null;
	}

	private pruneUnknownOverrides(): void {
		let hasChanges = false;

		for (const componentName of Object.keys(this.overrides)) {
			if (!this.elementsByComponent.has(componentName) || !this.editableComponents.has(componentName)) {
				delete this.overrides[componentName];
				hasChanges = true;
			}
		}

		if (hasChanges) {
			this.storage.save(this.overrides);
		}
	}

	private applySavedOverrides(): void {
		for (const [componentName, componentOverrides] of Object.entries(this.overrides)) {
			for (const [variable, value] of Object.entries(componentOverrides)) {
				this.applyVariable(componentName, variable, value);
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
				element.dataset.customizeTooltip = `Customize ${this.getComponentLabel(componentName)}`;

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
				element.addEventListener('click', () => {
					if (!this.root) return;

					this.activeComponent = componentName;
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
			<button type="button" class="db-component-tool__toggle" data-action="toggle-panel">Customize component</button>
			<div class="db-component-tool__panel">
				<div class="db-component-tool__header">
					<strong>Component customization</strong>
					<button type="button" class="db-component-tool__close" data-action="close-panel" aria-label="Close component customization">×</button>
				</div>
				<div class="db-component-tool__select-row">
					<label for="db-component-select">Component</label>
					<select id="db-component-select" data-action="select-component"></select>
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

		const toggleButton = root.querySelector<HTMLElement>('[data-action="toggle-panel"]');
		const closeButton = root.querySelector<HTMLElement>('[data-action="close-panel"]');
		toggleButton?.addEventListener('click', () => root.classList.toggle('db-component-tool--open'));
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

			this.componentSelect.addEventListener('change', () => {
				this.activeComponent = this.componentSelect?.value || null;
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
				const currentValue = this.overrides[this.activeComponent]?.[setting.variable] || setting.default;
				const control = createControl(setting, currentValue, (variable, value) => {
					this.handleChange(this.activeComponent as string, variable, value, setting.default);
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

	private handleChange(componentName: string, variable: string, value: string, defaultValue: string): void {
		if (!this.overrides[componentName]) {
			this.overrides[componentName] = {};
		}

		if (!value || value === defaultValue) {
			delete this.overrides[componentName][variable];
			this.removeVariable(componentName, variable);
		} else {
			this.overrides[componentName][variable] = value;
			this.applyVariable(componentName, variable, value);
		}

		if (Object.keys(this.overrides[componentName]).length === 0) {
			delete this.overrides[componentName];
		}

		this.storage.save(this.overrides);
	}

	private applyVariable(componentName: string, variable: string, value: string): void {
		const elements = this.elementsByComponent.get(componentName) || [];
		for (const element of elements) {
			element.style.setProperty(variable, value);
		}
	}

	private removeVariable(componentName: string, variable: string): void {
		const elements = this.elementsByComponent.get(componentName) || [];
		for (const element of elements) {
			element.style.removeProperty(variable);
		}
	}

	private resetComponent(componentName: string): void {
		if (!confirm(`Reset all overrides for ${this.getComponentLabel(componentName)}?`)) {
			return;
		}

		const variables = Object.keys(this.overrides[componentName] || {});
		for (const variable of variables) {
			this.removeVariable(componentName, variable);
		}

		delete this.overrides[componentName];
		this.storage.save(this.overrides);
		this.renderControls();
	}

	private resetAllComponents(): void {
		if (!confirm('Reset all component customizations on this page?')) {
			return;
		}

		for (const [componentName, componentOverrides] of Object.entries(this.overrides)) {
			for (const variable of Object.keys(componentOverrides)) {
				this.removeVariable(componentName, variable);
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

async function init(): Promise<void> {
	const container = document.querySelector<HTMLElement>('[data-design-builder]');
	if (container) {
		const tokensAttr = container.getAttribute('data-tokens');
		if (!tokensAttr) {
			container.textContent = 'Error: No token data found.';
			return;
		}

		let tokens: TokenData;
		try {
			tokens = JSON.parse(tokensAttr);
		} catch {
			container.textContent = 'Error: Invalid token data.';
			return;
		}

		const storage = new LocalStorageAdapter();
		new DesignBuilder(container, tokens, storage);

		initDivider();
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
}

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', () => {
		void init();
	});
} else {
	void init();
}
