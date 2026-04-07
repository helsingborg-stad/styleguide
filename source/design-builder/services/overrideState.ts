import { GENERAL_SCOPE_KEY, GLOBAL_SCOPE_KEY } from '../state/runtimeConstants';
import type { ScopedComponentOverrides } from '../types/runtime';

export interface DesignBuilderOverrideState {
	token: Record<string, string>;
	component: ScopedComponentOverrides;
}

export function createEmptyOverrideState(): DesignBuilderOverrideState {
	return {
		token: {},
		component: {},
	};
}

export function normalizeTokenOverrides(input: unknown): Record<string, string> {
	if (!input || typeof input !== 'object' || Array.isArray(input)) {
		return {};
	}

	const filtered: Record<string, string> = {};
	for (const [key, value] of Object.entries(input as Record<string, unknown>)) {
		if (typeof value === 'string' && value.trim() !== '') {
			filtered[key] = value;
		}
	}

	return filtered;
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
		return variableValues.every((entry) => typeof entry === 'string');
	});
}

function normalizeComponentValueMap(input: Record<string, unknown>): Record<string, string> {
	const filtered: Record<string, string> = {};

	for (const [variable, value] of Object.entries(input)) {
		if (typeof value === 'string' && value.trim() !== '') {
			filtered[variable] = value;
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
	if ('token' in record || 'component' in record) {
		return {
			token: normalizeTokenOverrides(record.token),
			component: normalizeComponentOverrides(record.component),
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
	return Object.keys(state.token).length > 0 || Object.keys(state.component).length > 0;
}
