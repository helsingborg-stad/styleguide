import type { ComponentTokenData } from '../types/runtime';

export function normalizeComponentName(value: string): string {
	return value.trim().toLowerCase().replace(/^c-/, '');
}

export function parseComponentTokenData(raw: unknown): ComponentTokenData {
	if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
		return {};
	}

	const parsed: ComponentTokenData = {};
	for (const [key, value] of Object.entries(raw)) {
		const normalizedKey = normalizeComponentName(key);
		if (!normalizedKey) continue;

		if (!value || typeof value !== 'object' || Array.isArray(value)) {
			continue;
		}

		const definition = value as Record<string, unknown>;
		parsed[normalizedKey] = {
			name: typeof definition.name === 'string' ? definition.name : undefined,
			slug: typeof definition.slug === 'string' ? normalizeComponentName(definition.slug) : normalizedKey,
			tokens: Array.isArray(definition.tokens)
				? definition.tokens.filter((token): token is string => typeof token === 'string')
				: [],
		};
	}

	return parsed;
}
