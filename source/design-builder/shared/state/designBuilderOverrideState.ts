import { GENERAL_SCOPE_KEY, GLOBAL_SCOPE_KEY } from '../constants/designBuilderRuntimeConstants';
import type { ScopedComponentOverrides } from '../types/designBuilderDataTypes';

export interface DesignBuilderOverrideState {
	token: Record<string, string>;
	/**
	 * Optional colour-mode overrides. The underscored names are deliberately
	 * kept in the serialized document so older consumers can continue to read
	 * the `token` and `component` slices unchanged.
	 */
	_dark?: Record<string, string> | null;
	_contrast?: Record<string, string> | null;
	component: ScopedComponentOverrides;
	/** Sparse component/scope assignments; omitted values inherit Default. */
	componentSchemes?: Partial<Record<'dark' | 'contrast', ScopedComponentOverrides>>;
}

export function createEmptyOverrideState(): DesignBuilderOverrideState {
	return {
		token: {},
		component: {},
	};
}

function normalizeOverrideValue(value: unknown): string | null {
	if (typeof value === 'string' && value.trim() !== '') {
		return value;
	}

	if (typeof value === 'number' && Number.isFinite(value)) {
		return value.toString();
	}

	return null;
}

export function normalizeTokenOverrides(input: unknown): Record<string, string> {
	if (!input || typeof input !== 'object' || Array.isArray(input)) {
		return {};
	}

	const filtered: Record<string, string> = {};
	for (const [key, value] of Object.entries(input as Record<string, unknown>)) {
		const normalizedValue = normalizeOverrideValue(value);
		if (normalizedValue !== null) {
			filtered[key] = normalizedValue;
		}
	}

	return filtered;
}

function normalizeThemeOverrides(input: unknown): Record<string, string> | null {
	if (input === null || input === undefined) {
		return null;
	}

	return normalizeTokenOverrides(input);
}

function isLegacyComponentOverrides(input: Record<string, unknown>): boolean {
	const values = Object.values(input);
	if (values.length === 0) {
		return false;
	}

	return values.every((value) => {
		if (!value || typeof value !== 'object' || Array.isArray(value)) {
			return false;
		}

		const variableValues = Object.values(value as Record<string, unknown>);
		return variableValues.every((entry) => normalizeOverrideValue(entry) !== null);
	});
}

function normalizeComponentValueMap(input: Record<string, unknown>): Record<string, string> {
	const filtered: Record<string, string> = {};

	for (const [variable, value] of Object.entries(input)) {
		const normalizedValue = normalizeOverrideValue(value);
		if (normalizedValue !== null) {
			filtered[variable] = normalizedValue;
		}
	}

	return filtered;
}

function normalizeComponentMap(input: Record<string, unknown>): ScopedComponentOverrides[string] {
	const cleaned: ScopedComponentOverrides[string] = {};

	for (const [componentName, values] of Object.entries(input)) {
		if (!values || typeof values !== 'object' || Array.isArray(values)) continue;

		const filtered = normalizeComponentValueMap(values as Record<string, unknown>);
		if (Object.keys(filtered).length > 0) {
			cleaned[componentName] = filtered;
		}
	}

	return cleaned;
}

export function normalizeComponentOverrides(input: unknown): ScopedComponentOverrides {
	if (!input || typeof input !== 'object' || Array.isArray(input)) {
		return {};
	}

	const record = input as Record<string, unknown>;
	if (isLegacyComponentOverrides(record)) {
		const legacy = normalizeComponentMap(record);
		if (Object.keys(legacy).length === 0) {
			return {};
		}

		return {
			[GENERAL_SCOPE_KEY]: legacy,
		};
	}

	const result: ScopedComponentOverrides = {};

	for (const [scopeKey, scopeValue] of Object.entries(record)) {
		if (!scopeValue || typeof scopeValue !== 'object' || Array.isArray(scopeValue)) continue;

		const componentOverrides = normalizeComponentMap(scopeValue as Record<string, unknown>);
		if (Object.keys(componentOverrides).length > 0) {
			const normalizedScopeKey = scopeKey === GLOBAL_SCOPE_KEY ? GENERAL_SCOPE_KEY : scopeKey;
			result[normalizedScopeKey] = {
				...(result[normalizedScopeKey] || {}),
				...componentOverrides,
			};
		}
	}

	return result;
}

export function normalizeDesignBuilderOverrideState(input: unknown): DesignBuilderOverrideState {
	if (!input || typeof input !== 'object' || Array.isArray(input)) {
		return createEmptyOverrideState();
	}

	const record = input as Record<string, unknown>;
	if ('token' in record || 'component' in record || '_dark' in record || '_contrast' in record || 'componentSchemes' in record) {
		const schemes = record.componentSchemes as Record<string, unknown> | undefined;
		return {
			token: normalizeTokenOverrides(record.token),
			...('_dark' in record ? { _dark: normalizeThemeOverrides(record._dark) } : {}),
			...('_contrast' in record ? { _contrast: normalizeThemeOverrides(record._contrast) } : {}),
			component: normalizeComponentOverrides(record.component),
			...(schemes && typeof schemes === 'object' && !Array.isArray(schemes)
				? {
						componentSchemes: {
							...('dark' in schemes ? { dark: normalizeComponentOverrides(schemes.dark) } : {}),
							...('contrast' in schemes ? { contrast: normalizeComponentOverrides(schemes.contrast) } : {}),
						},
					}
				: {}),
		};
	}

	const tokenOverrides = normalizeTokenOverrides(record);
	if (Object.keys(tokenOverrides).length === Object.keys(record).length) {
		return {
			token: tokenOverrides,
			component: {},
		};
	}

	return {
		token: {},
		component: normalizeComponentOverrides(record),
	};
}

export function hasOverrideStateData(state: DesignBuilderOverrideState): boolean {
	return Object.keys(state.token).length > 0 || (state._dark !== null && state._dark !== undefined) || (state._contrast !== null && state._contrast !== undefined) || Object.keys(state.component).length > 0 || Object.values(state.componentSchemes ?? {}).some((scheme) => Object.keys(scheme).length > 0);
}

/** Merge at variable level so a scheme changes colours, not shared layout. */
export function getSchemeComponentOverrides(state: DesignBuilderOverrideState, mode: 'base' | 'dark' | 'contrast', maskOtherSchemes = false): ScopedComponentOverrides {
	const result = normalizeComponentOverrides(state.component);
	for (const [scope, components] of Object.entries(mode === 'base' ? {} : (state.componentSchemes?.[mode] ?? {}))) {
		result[scope] ??= {};
		for (const [component, variables] of Object.entries(components)) {
			result[scope][component] = { ...result[scope][component], ...variables };
		}
	}
	if (!maskOtherSchemes) return result;
	// Mask assignments from other preference media queries during a forced
	// preview. CSS initial restores the component stylesheet's fallback chain.
	for (const scheme of Object.values(state.componentSchemes ?? {})) {
		for (const [scope, components] of Object.entries(scheme)) {
			result[scope] ??= {};
			for (const [component, variables] of Object.entries(components)) {
				result[scope][component] ??= {};
				for (const variable of Object.keys(variables)) {
					result[scope][component][variable] ??= result[GENERAL_SCOPE_KEY]?.[component]?.[variable] ?? 'initial';
				}
			}
		}
	}
	return result;
}
