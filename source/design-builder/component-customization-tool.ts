import { createControl } from './controls';
import {
	ComponentDiscovery,
	GENERAL_SCOPE_KEY,
	getScopeKeyForElement,
	getScopeLabel,
	getScopeOptionLabel,
} from './core/component-discovery';
import { ComponentOverrideManager } from './core/component-override-manager';
import { buildCategoriesForComponent } from './core/component-token-mapper';
import type { ComponentTokenData, TokenData } from './core/types';

/**
 * Component-level customization tool.
 *
 * Provides a floating panel for customizing design tokens
 * scoped to individual components on the page.
 */
export class ComponentCustomizationTool {
	private componentData: ComponentTokenData;
	private tokenLibrary: TokenData;
	private discovery: ComponentDiscovery;
	private overrideManager: ComponentOverrideManager;
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
		this.discovery = new ComponentDiscovery(componentData, tokenLibrary);
		this.overrideManager = new ComponentOverrideManager();

		this.activeComponent = this.discovery.getFirstEditableComponent();
		this.overrideManager.pruneUnknownOverrides(this.discovery);
		this.overrideManager.applySavedOverrides(this.discovery);
		this.setupEditableTargets();
		this.render();
		this.bindComponentSelection();
	}

	private getComponentLabel(componentName: string): string {
		const definition = this.componentData[componentName];
		if (definition && typeof definition.name === 'string' && definition.name.trim() !== '') {
			return definition.name;
		}
		return componentName;
	}

	private setupEditableTargets(): void {
		for (const [componentName, elements] of this.discovery.getElementsByComponent().entries()) {
			if (!this.discovery.getEditableComponents().has(componentName)) continue;

			for (const element of elements) {
				element.classList.add('db-component-target');
				const scopeLabel = getScopeLabel(getScopeKeyForElement(element));
				element.dataset.customizeTooltip = scopeLabel
					? `Customize ${this.getComponentLabel(componentName)} (${scopeLabel})`
					: `Customize ${this.getComponentLabel(componentName)}`;

				for (const link of element.querySelectorAll<HTMLAnchorElement>('a[href]')) {
					link.addEventListener('click', (event) => event.preventDefault());
				}
			}
		}
	}

	private bindComponentSelection(): void {
		for (const [componentName, elements] of this.discovery.getElementsByComponent().entries()) {
			if (!this.discovery.getEditableComponents().has(componentName)) continue;

			for (const element of elements) {
				element.addEventListener('click', (event: MouseEvent) => {
					event.preventDefault();
					event.stopPropagation();
					if (!this.root) return;

					this.activeComponent = componentName;
					this.activeScopeKey = getScopeKeyForElement(element);
					this.refreshScopeSelect();
					this.setActiveTarget(componentName, this.activeScopeKey, element);
					if (this.componentSelect) this.componentSelect.value = componentName;
					this.renderControls();
					this.root.classList.add('db-component-tool--open');
				});
			}
		}
	}

	private render(): void {
		if (this.discovery.getEditableComponents().size === 0) return;

		const root = document.createElement('aside');
		root.className = 'db-component-tool';
		root.innerHTML = `
			<div class="db-component-tool__panel">
				<div class="db-component-tool__header">
					<strong>Component customization</strong>
					<button type="button" class="db-component-tool__close" data-action="close-panel" aria-label="Close component customization">\u00d7</button>
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
					<button type="button" class="db-btn db-btn--success" data-action="save-changes">Save changes</button>
				</div>
				<div class="db-component-tool__controls" data-component-controls></div>
			</div>
		`;

		document.body.appendChild(root);
		this.root = root;
		this.controlsContainer = root.querySelector<HTMLElement>('[data-component-controls]');
		this.componentSelect = root.querySelector<HTMLSelectElement>('[data-action="select-component"]');
		this.scopeSelect = root.querySelector<HTMLSelectElement>('[data-action="select-scope"]');

		root
			.querySelector('[data-action="close-panel"]')
			?.addEventListener('click', () => root.classList.remove('db-component-tool--open'));

		if (this.componentSelect) {
			this.componentSelect.innerHTML = '';
			for (const name of this.discovery.getSortedEditableNames()) {
				const option = document.createElement('option');
				option.value = name;
				option.textContent = this.getComponentLabel(name);
				this.componentSelect.appendChild(option);
			}

			if (this.activeComponent && this.discovery.getSortedEditableNames().includes(this.activeComponent)) {
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
			const label = this.getComponentLabel(this.activeComponent);
			const scopeLabel = getScopeLabel(this.activeScopeKey);
			const suffix = scopeLabel ? ` in scope "${scopeLabel}"` : '';
			if (!confirm(`Reset all overrides for ${label}${suffix}?`)) return;

			this.overrideManager.resetComponent(this.activeComponent, this.activeScopeKey, this.discovery);
			this.renderControls();
		});

		root.querySelector('[data-action="reset-all-components"]')?.addEventListener('click', () => {
			if (!confirm('Reset all component customizations on this page?')) return;
			this.overrideManager.resetAll(this.discovery);
			this.renderControls();
		});

		root.querySelector('[data-action="save-changes"]')?.addEventListener('click', () => {
			this.overrideManager.applySavedOverrides(this.discovery);
			this.renderControls();
			alert('Changes saved!');
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

		const candidates = this.discovery.getElementsForContext(componentName, scopeKey);
		const preferredMatch =
			preferredElement && (scopeKey === GENERAL_SCOPE_KEY || getScopeKeyForElement(preferredElement) === scopeKey)
				? preferredElement
				: null;
		const fallback = (this.discovery.getElementsByComponent().get(componentName) || [])[0] || null;
		const target = preferredMatch || candidates[0] || fallback;

		this.activeScopeKey = scopeKey;
		if (!target) {
			this.activeTargetElement = null;
			if (this.scopeSelect) this.scopeSelect.value = this.activeScopeKey;
			return;
		}

		target.classList.add('db-component-target--active');
		this.activeTargetElement = target;
		if (this.scopeSelect) this.scopeSelect.value = this.activeScopeKey;
	}

	private refreshScopeSelect(): void {
		if (!this.scopeSelect || !this.activeComponent) return;

		const available = this.discovery.getAvailableScopeKeys(this.activeComponent);
		if (!available.includes(this.activeScopeKey)) {
			this.activeScopeKey = GENERAL_SCOPE_KEY;
		}

		this.scopeSelect.innerHTML = '';
		for (const key of available) {
			const option = document.createElement('option');
			option.value = key;
			option.textContent = getScopeOptionLabel(key);
			this.scopeSelect.appendChild(option);
		}
		this.scopeSelect.value = this.activeScopeKey;
	}

	private renderControls(): void {
		if (!this.controlsContainer) return;
		this.controlsContainer.innerHTML = '';

		if (!this.activeComponent) {
			this.controlsContainer.textContent = 'No component selected.';
			return;
		}

		const categories = buildCategoriesForComponent(this.activeComponent, this.componentData, this.tokenLibrary);
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
					this.overrideManager.getComponentOverride(this.activeScopeKey, this.activeComponent, setting.variable) ||
					setting.default;
				const control = createControl(setting, currentValue, (variable, value) => {
					this.overrideManager.handleChange(
						this.activeComponent as string,
						this.activeScopeKey,
						variable,
						value,
						setting.default,
						this.discovery,
					);
				});
				body.appendChild(control);
			}

			section.appendChild(body);
			this.controlsContainer.appendChild(section);
		}
	}
}
