import type { TokenData } from '../types/designBuilderDataTypes';
import { applyComponentOverridesToPage, clearComponentOverridesFromPage } from './applyDesignBuilderOverridesToPage';
import { getSchemeComponentOverrides, type DesignBuilderOverrideState } from './designBuilderOverrideState';

let previousComponents: DesignBuilderOverrideState['component'] = {};
let previousVariables: string[] = [];

/** Force the selected editing scheme independently of the browser preference. */
export function previewDesignBuilderScheme(state: DesignBuilderOverrideState, mode: 'base' | 'dark' | 'contrast', tokens: TokenData): void {
	const effectiveMode = mode !== 'base' && state[mode === 'dark' ? '_dark' : '_contrast'] == null ? 'base' : mode;
	for (const variable of new Set([...previousVariables, ...Object.keys(state._dark ?? {}), ...Object.keys(state._contrast ?? {})])) {
		document.documentElement.style.removeProperty(variable);
	}
	const defaults: Record<string, string> = {};
	for (const category of tokens.categories) {
		for (const setting of category.settings) {
			if (setting.variable.startsWith('--color--')) defaults[setting.variable] = setting.default;
		}
	}
	const variant = mode === 'base' ? {} : state[mode === 'dark' ? '_dark' : '_contrast'];
	const values = { ...defaults, ...state.token, ...variant };
	previousVariables = Object.keys(values);
	for (const [variable, value] of Object.entries(values)) {
		document.documentElement.style.setProperty(variable, value);
	}
	clearComponentOverridesFromPage(previousComponents);
	clearComponentOverridesFromPage(state.component);
	for (const overrides of Object.values(state.componentSchemes ?? {})) clearComponentOverridesFromPage(overrides);
	previousComponents = getSchemeComponentOverrides(state, effectiveMode, true);
	applyComponentOverridesToPage(previousComponents);
}
