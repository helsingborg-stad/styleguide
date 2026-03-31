import type { ComponentTokenData, TokenCategory, TokenData } from './types';

/**
 * Maps component token names to token library categories/settings.
 * Pure function with no DOM dependency.
 */
export function buildCategoriesForComponent(
	componentName: string,
	componentData: ComponentTokenData,
	tokenLibrary: TokenData,
): TokenCategory[] {
	const definition = componentData[componentName];
	const tokens = Array.isArray(definition?.tokens) ? definition.tokens : [];
	if (tokens.length === 0) return [];

	const availableTokenNames = new Set(tokens.map((t) => t.trim()).filter(Boolean));

	const categories: TokenCategory[] = [];
	for (const category of tokenLibrary.categories) {
		const matchedSettings = category.settings
			.filter((setting) => availableTokenNames.has(setting.variable.replace(/^--/, '')))
			.map((setting) => {
				const tokenName = setting.variable.replace(/^--/, '');
				return {
					...setting,
					variable: `--c-${componentName}--${tokenName}`,
				};
			});

		if (matchedSettings.length === 0) continue;

		categories.push({
			id: category.id,
			label: category.label,
			description: category.description,
			present: category.present,
			settings: matchedSettings,
		});
	}

	return categories;
}
