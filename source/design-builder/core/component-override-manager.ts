import type { ScopedComponentOverrides, ComponentOverrides, ComponentVariableOverrides } from './types';
import { GLOBAL_SCOPE_KEY, GENERAL_SCOPE_KEY, getScopeKeyForElement } from './component-discovery';
import type { ComponentDiscovery } from './component-discovery';

const COMPONENT_STORAGE_KEY = 'design-tokens-component-overrides';

/**
 * Manages scoped component-level token overrides.
 * Handles storage, legacy migration, and applying/removing CSS variables on elements.
 */
export class ComponentOverrideManager {
	private overrides: ScopedComponentOverrides;
	private storageKey: string;

	constructor(storageKey: string = COMPONENT_STORAGE_KEY) {
		this.storageKey = storageKey;
		this.overrides = this.load();
	}

	getOverrides(): ScopedComponentOverrides {
		return this.overrides;
	}

	getComponentOverride(scopeKey: string, componentName: string, variable: string): string | undefined {
		return this.overrides[scopeKey]?.[componentName]?.[variable];
	}

	handleChange(
		componentName: string,
		scopeKey: string,
		variable: string,
		value: string,
		defaultValue: string,
		discovery: ComponentDiscovery,
	): void {
		if (!this.overrides[scopeKey]) this.overrides[scopeKey] = {};
		if (!this.overrides[scopeKey][componentName]) this.overrides[scopeKey][componentName] = {};

		if (!value || value === defaultValue) {
			delete this.overrides[scopeKey][componentName][variable];
			this.removeVariable(componentName, scopeKey, variable, discovery);
		} else {
			this.overrides[scopeKey][componentName][variable] = value;
			this.applyVariable(componentName, scopeKey, variable, value, discovery);
		}

		if (Object.keys(this.overrides[scopeKey][componentName]).length === 0) {
			delete this.overrides[scopeKey][componentName];
		}
		if (Object.keys(this.overrides[scopeKey]).length === 0) {
			delete this.overrides[scopeKey];
		}

		this.save();
	}

	applySavedOverrides(discovery: ComponentDiscovery): void {
		const orderedScopeKeys = Object.keys(this.overrides).sort((a, b) => {
			if (a === GENERAL_SCOPE_KEY) return -1;
			if (b === GENERAL_SCOPE_KEY) return 1;
			return a.localeCompare(b);
		});

		for (const scopeKey of orderedScopeKeys) {
			const scopeOverrides = this.overrides[scopeKey] || {};
			for (const [componentName, componentOverrides] of Object.entries(scopeOverrides)) {
				for (const [variable, value] of Object.entries(componentOverrides)) {
					this.applyVariable(componentName, scopeKey, variable, value, discovery);
				}
			}
		}
	}

	pruneUnknownOverrides(discovery: ComponentDiscovery): void {
		let hasChanges = false;

		for (const [scopeKey, scopeOverrides] of Object.entries(this.overrides)) {
			for (const componentName of Object.keys(scopeOverrides)) {
				const elements = discovery.getElementsByComponent();
				const editable = discovery.getEditableComponents();
				const isMissing = !elements.has(componentName) || !editable.has(componentName);
				const hasTarget = discovery.getElementsForContext(componentName, scopeKey).length > 0;

				if (isMissing || !hasTarget) {
					delete this.overrides[scopeKey][componentName];
					hasChanges = true;
				}
			}

			if (Object.keys(this.overrides[scopeKey]).length === 0) {
				delete this.overrides[scopeKey];
				hasChanges = true;
			}
		}

		if (hasChanges) this.save();
	}

	resetComponent(componentName: string, scopeKey: string, discovery: ComponentDiscovery): void {
		const variables = Object.keys(this.overrides[scopeKey]?.[componentName] || {});
		for (const variable of variables) {
			this.removeVariable(componentName, scopeKey, variable, discovery);
		}

		if (this.overrides[scopeKey]) {
			delete this.overrides[scopeKey][componentName];
			if (Object.keys(this.overrides[scopeKey]).length === 0) {
				delete this.overrides[scopeKey];
			}
		}
		this.save();
	}

	resetAll(discovery: ComponentDiscovery): void {
		for (const [scopeKey, scopeOverrides] of Object.entries(this.overrides)) {
			for (const [componentName, componentOverrides] of Object.entries(scopeOverrides)) {
				for (const variable of Object.keys(componentOverrides)) {
					this.removeVariable(componentName, scopeKey, variable, discovery);
				}
			}
		}
		this.overrides = {};
		this.save();
	}

	private hasLocalScopeOverride(componentName: string, variable: string, element: HTMLElement): boolean {
		const localScopeKey = getScopeKeyForElement(element);
		if (localScopeKey === GENERAL_SCOPE_KEY || localScopeKey === GLOBAL_SCOPE_KEY) return false;
		const localValue = this.overrides[localScopeKey]?.[componentName]?.[variable];
		return typeof localValue === 'string' && localValue.trim() !== '';
	}

	private applyVariable(
		componentName: string,
		scopeKey: string,
		variable: string,
		value: string,
		discovery: ComponentDiscovery,
	): void {
		let elements = discovery.getElementsForContext(componentName, scopeKey);
		if (scopeKey === GENERAL_SCOPE_KEY) {
			elements = elements.filter((el) => !this.hasLocalScopeOverride(componentName, variable, el));
		}
		for (const el of elements) {
			el.style.setProperty(variable, value);
		}
	}

	private removeVariable(
		componentName: string,
		scopeKey: string,
		variable: string,
		discovery: ComponentDiscovery,
	): void {
		let elements = discovery.getElementsForContext(componentName, scopeKey);
		if (scopeKey === GENERAL_SCOPE_KEY) {
			elements = elements.filter((el) => !this.hasLocalScopeOverride(componentName, variable, el));
		}
		for (const el of elements) {
			el.style.removeProperty(variable);
		}
	}

	private load(): ScopedComponentOverrides {
		try {
			const raw = localStorage.getItem(this.storageKey);
			if (!raw) return {};
			const parsed = JSON.parse(raw);
			if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};

			if (this.isLegacyFormat(parsed as Record<string, unknown>)) {
				const legacy = this.normalizeComponentOverrides(parsed as Record<string, unknown>);
				return Object.keys(legacy).length === 0 ? {} : { [GLOBAL_SCOPE_KEY]: legacy };
			}

			return this.normalizeScopedOverrides(parsed as Record<string, unknown>);
		} catch {
			return {};
		}
	}

	private save(): void {
		const cleaned = this.normalizeScopedOverrides(this.overrides as Record<string, unknown>);
		if (Object.keys(cleaned).length === 0) {
			localStorage.removeItem(this.storageKey);
			return;
		}
		localStorage.setItem(this.storageKey, JSON.stringify(cleaned));
	}

	private isLegacyFormat(input: Record<string, unknown>): boolean {
		const values = Object.values(input);
		if (values.length === 0) return false;
		return values.every((value) => {
			if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
			return Object.values(value as Record<string, unknown>).every((entry) => typeof entry === 'string');
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
