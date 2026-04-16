export function parseScopeAttributeValue(value?: string | null): string[] {
	if (!value) {
		return [];
	}

	const scopeNames = new Set<string>();
	for (const candidate of value.split(';')) {
		const scopeName = candidate.trim();
		if (scopeName) {
			scopeNames.add(scopeName);
		}
	}

	return Array.from(scopeNames);
}

export function getNamedScopeKeysForElement(element: HTMLElement): string[] {
	const scope = element.closest<HTMLElement>('[data-scope]')?.dataset.scope;
	return parseScopeAttributeValue(scope).map((scopeName) => `scope:${scopeName}`);
}

export function getResolvedScopeKeyForElement(element: HTMLElement, fallbackScopeKey: string): string {
	return getNamedScopeKeysForElement(element)[0] ?? fallbackScopeKey;
}
