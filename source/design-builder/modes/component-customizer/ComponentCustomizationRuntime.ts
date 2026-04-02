import { createControl } from '../../controls';
import { GENERAL_SCOPE_KEY, GLOBAL_SCOPE_KEY, NON_CUSTOMIZABLE_COMPONENTS } from '../../state/runtimeConstants';
import type { ComponentTokenData, ScopedComponentOverrides, TokenCategory, TokenData } from '../../types/runtime';
import { normalizeComponentName } from '../../utils/componentTokens';
import { ComponentStorageAdapter } from '../../services/ComponentStorageAdapter';

export class ComponentCustomizationRuntime {
	private componentData: ComponentTokenData;
	private tokenLibrary: TokenData;
	private storage: ComponentStorageAdapter;
	private overrides: ScopedComponentOverrides;
	private elementsByComponent = new Map<string, HTMLElement[]>();
	private editableComponents = new Set<string>();
	private activeComponent: string | null = null;
	private activeScopeKey: string = GENERAL_SCOPE_KEY;
	private mountElement: HTMLElement;
	private root: HTMLElement | null = null;
	private controlsContainer: HTMLElement | null = null;
	private componentSelect: HTMLSelectElement | null = null;
	private scopeSelect: HTMLSelectElement | null = null;
	private activeTargetElement: HTMLElement | null = null;

	constructor(componentData: ComponentTokenData, tokenLibrary: TokenData, mountElement: HTMLElement) {
		this.componentData = componentData;
		this.tokenLibrary = tokenLibrary;
		this.mountElement = mountElement;
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

		this.mountElement.appendChild(root);
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
