import { normalizeComponentName } from '../../features/component-customizer/componentTokenDefinitions';
import { GENERAL_SCOPE_KEY, NON_CUSTOMIZABLE_COMPONENTS } from '../constants/designBuilderRuntimeConstants';
import type { ScopedComponentOverrides } from '../types/designBuilderDataTypes';

const THEME_STYLE_ID = 'design-builder-theme-overrides';
const DEFAULT_THEME_VARIANTS_STYLE_ID = 'default-theme-variants';
let initialDefaultThemeVariantsCss: string | null = null;
import { getComponentOverrideTargets } from './componentOverrideTargets';
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

function serializeThemeDeclarations(overrides: Record<string, string> | null): string {
	if (!overrides) {
		return '';
	}

	return Object.entries(overrides)
		.map(([variable, value]) => `${variable}: ${value};`)
		.join('');
}

function serializeThemeCss(dark: Record<string, string> | null, contrast: Record<string, string> | null): string {
	const darkDeclarations = serializeThemeDeclarations(dark);
	const contrastDeclarations = serializeThemeDeclarations(contrast);
	return `${darkDeclarations ? `@media (prefers-color-scheme: dark) { :root { ${darkDeclarations} } }` : ''}${contrastDeclarations ? `@media (prefers-contrast: more), (forced-colors: active) { :root { ${contrastDeclarations} } }` : ''}`;
}

/** Replaces the server-rendered default variants when a token preset is loaded. */
export function applyDefaultThemeVariantsToPage(dark: Record<string, string> | null, contrast: Record<string, string> | null): void {
	const css = serializeThemeCss(dark, contrast);
	let style = document.getElementById(DEFAULT_THEME_VARIANTS_STYLE_ID) as HTMLStyleElement | null;

	if (style && initialDefaultThemeVariantsCss === null) {
		initialDefaultThemeVariantsCss = style.textContent;
	}

	if (!css) {
		style?.remove();
		return;
	}

	if (!style) {
		style = document.createElement('style');
		style.id = DEFAULT_THEME_VARIANTS_STYLE_ID;
		document.head.appendChild(style);
	}

	style.textContent = css;
}

/** Restores the server-rendered variants after resetting token customizations. */
export function restoreDefaultThemeVariantsToPage(): void {
	if (initialDefaultThemeVariantsCss === null) {
		return;
	}

	let style = document.getElementById(DEFAULT_THEME_VARIANTS_STYLE_ID) as HTMLStyleElement | null;
	if (initialDefaultThemeVariantsCss === '') {
		style?.remove();
		return;
	}

	if (!style) {
		style = document.createElement('style');
		style.id = DEFAULT_THEME_VARIANTS_STYLE_ID;
		document.head.appendChild(style);
	}

	style.textContent = initialDefaultThemeVariantsCss;
}

/** Applies persisted mode variants without changing the base inline overrides. */
export function applyThemeOverridesToPage(dark: Record<string, string> | null, contrast: Record<string, string> | null): void {
	const css = serializeThemeCss(dark, contrast);
	let style = document.getElementById(THEME_STYLE_ID) as HTMLStyleElement | null;

	if (!css) {
		style?.remove();
		return;
	}

	if (!style) {
		style = document.createElement('style');
		style.id = THEME_STYLE_ID;
		document.head.appendChild(style);
	}

	style.textContent = css;
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
					for (const target of getComponentOverrideTargets(element, componentName)) {
						target.style.setProperty(variable, value);
					}
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
					for (const target of getComponentOverrideTargets(element, componentName)) {
						target.style.removeProperty(variable);
					}
				}
			}
		}
	}
}
