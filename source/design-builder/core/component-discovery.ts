import type { ComponentTokenData, TokenData, TokenCategory } from './types';
import { buildCategoriesForComponent } from './component-token-mapper';

const NON_CUSTOMIZABLE_COMPONENTS = new Set(['scope', 'fab']);
export const GLOBAL_SCOPE_KEY = '__global__';
export const GENERAL_SCOPE_KEY = '__general__';

/**
 * Discovers and catalogs [data-component] elements on the page.
 * Provides scope resolution and editability determination.
 */
export class ComponentDiscovery {
	private elementsByComponent = new Map<string, HTMLElement[]>();
	private editableComponents = new Set<string>();

	constructor(componentData: ComponentTokenData, tokenLibrary: TokenData) {
		this.collectElements();
		this.determineEditable(componentData, tokenLibrary);
	}

	getElementsByComponent(): Map<string, HTMLElement[]> {
		return this.elementsByComponent;
	}

	getEditableComponents(): Set<string> {
		return this.editableComponents;
	}

	getFirstEditableComponent(): string | null {
		const first = this.editableComponents.values().next().value;
		return typeof first === 'string' ? first : null;
	}

	getSortedEditableNames(): string[] {
		return Array.from(this.editableComponents).sort((a, b) => a.localeCompare(b));
	}

	getElementsForContext(componentName: string, scopeKey: string): HTMLElement[] {
		const elements = this.elementsByComponent.get(componentName) || [];
		if (scopeKey === GENERAL_SCOPE_KEY) return elements;
		return elements.filter((el) => getScopeKeyForElement(el) === scopeKey);
	}

	getAvailableScopeKeys(componentName: string): string[] {
		const scopes = new Set<string>([GENERAL_SCOPE_KEY]);
		const elements = this.elementsByComponent.get(componentName) || [];
		for (const el of elements) {
			scopes.add(getScopeKeyForElement(el));
		}
		const specific = Array.from(scopes)
			.filter((key) => key !== GENERAL_SCOPE_KEY && key !== GLOBAL_SCOPE_KEY)
			.sort((a, b) => a.localeCompare(b));
		return [GENERAL_SCOPE_KEY, ...specific];
	}

	private collectElements(): void {
		const nodes = document.querySelectorAll<HTMLElement>('[data-component]');
		for (const node of nodes) {
			if (node.closest<HTMLElement>('[data-customizable="false"]')) continue;
			const name = normalizeComponentName(node.dataset.component || '');
			if (!name || NON_CUSTOMIZABLE_COMPONENTS.has(name)) continue;
			const existing = this.elementsByComponent.get(name) || [];
			existing.push(node);
			this.elementsByComponent.set(name, existing);
		}
	}

	private determineEditable(componentData: ComponentTokenData, tokenLibrary: TokenData): void {
		for (const componentName of this.elementsByComponent.keys()) {
			if (buildCategoriesForComponent(componentName, componentData, tokenLibrary).length > 0) {
				this.editableComponents.add(componentName);
			}
		}
	}
}

export function normalizeComponentName(value: string): string {
	return value.trim().toLowerCase().replace(/^c-/, '');
}

export function getScopeKeyForElement(element: HTMLElement): string {
	const scope = element.closest<HTMLElement>('[data-scope]')?.dataset.scope?.trim();
	return scope ? `scope:${scope}` : GLOBAL_SCOPE_KEY;
}

export function getScopeLabel(scopeKey: string): string {
	if (scopeKey === GLOBAL_SCOPE_KEY) return '';
	return `Scope: ${scopeKey.replace(/^scope:/, '')}`;
}

export function getScopeOptionLabel(scopeKey: string): string {
	if (scopeKey === GENERAL_SCOPE_KEY) return 'Scope: General (all scopes)';
	if (scopeKey === GLOBAL_SCOPE_KEY) return 'Scope: General';
	return `Scope: ${scopeKey.replace(/^scope:/, '')}`;
}
