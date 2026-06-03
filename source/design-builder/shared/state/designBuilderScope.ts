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
	const scopeNames = new Set<string>();
	let currentElement: HTMLElement | null = element;

	while (currentElement) {
		for (const scopeName of parseScopeAttributeValue(currentElement.dataset.scope)) {
			scopeNames.add(scopeName);
		}

		currentElement = currentElement.parentElement;
	}

	return Array.from(scopeNames).map((scopeName) => `scope:${scopeName}`);
}

export function getResolvedScopeKeyForElement(element: HTMLElement, fallbackScopeKey: string): string {
	return getNamedScopeKeysForElement(element)[0] ?? fallbackScopeKey;
}
