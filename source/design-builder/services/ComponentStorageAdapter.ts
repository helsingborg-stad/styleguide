import { COMPONENT_STORAGE_KEY, GENERAL_SCOPE_KEY, GLOBAL_SCOPE_KEY } from '../state/runtimeConstants';
import type { ComponentOverrides, ComponentVariableOverrides, ScopedComponentOverrides } from '../types/runtime';

export class ComponentStorageAdapter {
	private key: string;

	constructor(key: string = COMPONENT_STORAGE_KEY) {
		this.key = key;
	}

	public load(): ScopedComponentOverrides {
		try {
			const raw = localStorage.getItem(this.key);
			if (!raw) return {};
			const parsed = JSON.parse(raw);
			if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
				return {};
			}

			if (this.isLegacyComponentOverrides(parsed as Record<string, unknown>)) {
				const legacy = this.normalizeComponentOverrides(parsed as Record<string, unknown>);
				if (Object.keys(legacy).length === 0) {
					return {};
				}

				return {
					[GENERAL_SCOPE_KEY]: legacy,
				};
			}

			return this.normalizeScopedOverrides(parsed as Record<string, unknown>);
		} catch {
			return {};
		}
	}

	public save(overrides: ScopedComponentOverrides): void {
		const cleaned = this.normalizeScopedOverrides(overrides as Record<string, unknown>);

		if (Object.keys(cleaned).length === 0) {
			localStorage.removeItem(this.key);
			return;
		}

		localStorage.setItem(this.key, JSON.stringify(cleaned));
	}

	private isLegacyComponentOverrides(input: Record<string, unknown>): boolean {
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

	private normalizeScopedOverrides(input: Record<string, unknown>): ScopedComponentOverrides {
		const result: ScopedComponentOverrides = {};

		for (const [scopeKey, scopeValue] of Object.entries(input)) {
			if (!scopeValue || typeof scopeValue !== 'object' || Array.isArray(scopeValue)) continue;

			const componentOverrides = this.normalizeComponentOverrides(scopeValue as Record<string, unknown>);
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
