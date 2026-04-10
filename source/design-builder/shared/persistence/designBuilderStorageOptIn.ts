export const DESIGN_BUILDER_STORAGE_ATTRIBUTE = 'data-design-builder-storage';
export const LOCAL_STORAGE_PERSISTENCE_MODE = 'local-storage';

function hasLocalStorageOptIn(element: Element | null | undefined): boolean {
	return element?.getAttribute(DESIGN_BUILDER_STORAGE_ATTRIBUTE) === LOCAL_STORAGE_PERSISTENCE_MODE;
}

export function isLocalStoragePersistenceEnabled(element: Element | null | undefined): boolean {
	if (hasLocalStorageOptIn(element)) {
		return true;
	}

	return hasLocalStorageOptIn(globalThis.document?.documentElement);
}
