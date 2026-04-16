import { normalizeComponentName } from '../../features/component-customizer/componentTokenDefinitions';
import { GENERAL_SCOPE_KEY, NON_CUSTOMIZABLE_COMPONENTS } from '../constants/designBuilderRuntimeConstants';
import type { ScopedComponentOverrides } from '../types/designBuilderDataTypes';
import { getNamedScopeKeysForElement } from './designBuilderScope';

function getElementsByComponent(): Map<string, HTMLElement[]> {
	const elementsByComponent = new Map<string, HTMLElement[]>();

	for (const node of document.querySelectorAll<HTMLElement>('[data-component]')) {
		if (node.closest<HTMLElement>('[data-customizable="false"]')) {
			continue;
		}

		const componentName = normalizeComponentName(node.dataset.component || '');
		if (!componentName || NON_CUSTOMIZABLE_COMPONENTS.has(componentName)) {
			continue;
		}

		const existing = elementsByComponent.get(componentName) || [];
		existing.push(node);
		elementsByComponent.set(componentName, existing);
	}

	return elementsByComponent;
}

function hasLocalScopeOverrideForElement(overrides: ScopedComponentOverrides, componentName: string, variable: string, element: HTMLElement): boolean {
	const localScopeKeys = getNamedScopeKeysForElement(element);
	if (localScopeKeys.length === 0) {
		return false;
	}

	return localScopeKeys.some((localScopeKey) => {
		const localValue = overrides[localScopeKey]?.[componentName]?.[variable];
		return typeof localValue === 'string' && localValue.trim() !== '';
	});
}

function getElementsForContext(elementsByComponent: Map<string, HTMLElement[]>, componentName: string, scopeKey: string): HTMLElement[] {
	const elements = elementsByComponent.get(componentName) || [];
	if (scopeKey === GENERAL_SCOPE_KEY) {
		return elements;
	}

	return elements.filter((element) => getNamedScopeKeysForElement(element).includes(scopeKey));
}

export function applyTokenOverridesToRootDocument(overrides: Record<string, string>): void {
	for (const [variable, value] of Object.entries(overrides)) {
		document.documentElement.style.setProperty(variable, value);
	}
}

export function clearTokenOverridesFromRootDocument(overrides: Record<string, string>): void {
	for (const variable of Object.keys(overrides)) {
		document.documentElement.style.removeProperty(variable);
	}
}

export function applyComponentOverridesToPage(overrides: ScopedComponentOverrides): void {
	const elementsByComponent = getElementsByComponent();
	const orderedScopeKeys = Object.keys(overrides).sort((a, b) => {
		if (a === GENERAL_SCOPE_KEY) return -1;
		if (b === GENERAL_SCOPE_KEY) return 1;
		return a.localeCompare(b);
	});

	for (const scopeKey of orderedScopeKeys) {
		const scopeOverrides = overrides[scopeKey] || {};
		for (const [componentName, componentOverrides] of Object.entries(scopeOverrides)) {
			for (const [variable, value] of Object.entries(componentOverrides)) {
				let elements = getElementsForContext(elementsByComponent, componentName, scopeKey);
				if (scopeKey === GENERAL_SCOPE_KEY) {
					elements = elements.filter((element) => !hasLocalScopeOverrideForElement(overrides, componentName, variable, element));
				}

				for (const element of elements) {
					element.style.setProperty(variable, value);
				}
			}
		}
	}
}

export function clearComponentOverridesFromPage(overrides: ScopedComponentOverrides): void {
	const elementsByComponent = getElementsByComponent();

	for (const [scopeKey, scopeOverrides] of Object.entries(overrides)) {
		for (const [componentName, componentOverrides] of Object.entries(scopeOverrides)) {
			for (const variable of Object.keys(componentOverrides)) {
				let elements = getElementsForContext(elementsByComponent, componentName, scopeKey);
				if (scopeKey === GENERAL_SCOPE_KEY) {
					elements = elements.filter((element) => !hasLocalScopeOverrideForElement(overrides, componentName, variable, element));
				}

				for (const element of elements) {
					element.style.removeProperty(variable);
				}
			}
		}
	}
}
