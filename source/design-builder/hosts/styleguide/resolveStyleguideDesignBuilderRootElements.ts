import { ComponentOverrideLocalStorageStore } from '../../features/component-customizer/persistence/ComponentOverrideLocalStorageStore';
import type { DesignBuilderRootElement } from '../../web-component/designBuilderRootContracts';
import { hasOverrideStateData, normalizeDesignBuilderOverrideState, type DesignBuilderOverrideState } from '../../shared/state/designBuilderOverrideState';
import { isLocalStoragePersistenceEnabled } from '../../shared/persistence/designBuilderStorageOptIn';
import { TokenOverrideLocalStorageStore } from '../../shared/persistence/TokenOverrideLocalStorageStore';

function getExistingRootElements(): DesignBuilderRootElement[] {
	return Array.from(document.querySelectorAll<DesignBuilderRootElement>('design-builder'));
}

function serializeOverrideState(state: DesignBuilderOverrideState): string | null {
	try {
		return JSON.stringify(normalizeDesignBuilderOverrideState(state));
	} catch {
		return null;
	}
}

function hydratePersistedOverrideState(rootElement: DesignBuilderRootElement): void {
	if (rootElement.hasAttribute('override-state') || !isLocalStoragePersistenceEnabled(rootElement)) {
		return;
	}

	const overrideState = normalizeDesignBuilderOverrideState({
		token: new TokenOverrideLocalStorageStore().load(),
		component: new ComponentOverrideLocalStorageStore().load(),
	});

	if (!hasOverrideStateData(overrideState)) {
		return;
	}

	const serialized = serializeOverrideState(overrideState);
	if (serialized) {
		rootElement.setAttribute('override-state', serialized);
	}
}

function bindStyleguideSaveAdapter(rootElement: DesignBuilderRootElement): void {
	if (rootElement.dataset.designBuilderSaveAdapterBound === 'true' || !isLocalStoragePersistenceEnabled(rootElement)) {
		return;
	}

	rootElement.dataset.designBuilderSaveAdapterBound = 'true';
	rootElement.addEventListener('design-builder:save', (event) => {
		const detail = (event as CustomEvent<{ state?: unknown }>).detail;
		const state = normalizeDesignBuilderOverrideState(detail?.state);
		new TokenOverrideLocalStorageStore().save(state.token);
		new ComponentOverrideLocalStorageStore().save(state.component);
	});
}

function normalizeLegacyRootAttributes(rootElement: DesignBuilderRootElement): void {
	if (!rootElement.hasAttribute('token-data')) {
		const legacyTokenData = rootElement.getAttribute('data-tokens');
		const legacyTokenLibrary = rootElement.getAttribute('data-token-library');
		const normalizedTokenData = legacyTokenData ?? legacyTokenLibrary;
		if (normalizedTokenData) {
			rootElement.setAttribute('token-data', normalizedTokenData);
		}
	}

	if (!rootElement.hasAttribute('component-data')) {
		const legacyComponentData = rootElement.getAttribute('data-component-data');
		if (legacyComponentData) {
			rootElement.setAttribute('component-data', legacyComponentData);
		}
	}

	if (!rootElement.hasAttribute('presets')) {
		const legacyPresets = rootElement.getAttribute('data-presets');
		if (legacyPresets) {
			rootElement.setAttribute('presets', legacyPresets);
		}
	}

	if (!rootElement.hasAttribute('show-save-button')) {
		const legacyShowSaveButton = rootElement.getAttribute('data-show-save-button');
		if (legacyShowSaveButton) {
			rootElement.setAttribute('show-save-button', legacyShowSaveButton);
		}
	}

	hydratePersistedOverrideState(rootElement);
	bindStyleguideSaveAdapter(rootElement);
}

function createRootElementFromLegacyContainer(container: HTMLElement): DesignBuilderRootElement {
	const rootElement = document.createElement('design-builder') as DesignBuilderRootElement;

	for (const { name, value } of Array.from(container.attributes)) {
		rootElement.setAttribute(name, value);
	}

	const legacyTokenData = container.getAttribute('data-tokens');
	if (legacyTokenData) {
		rootElement.setAttribute('token-data', legacyTokenData);
	}

	rootElement.innerHTML = container.innerHTML;
	container.replaceWith(rootElement);

	return rootElement;
}

export function resolveStyleguideDesignBuilderRootElements(): DesignBuilderRootElement[] {
	const existingRootElements = getExistingRootElements();
	if (existingRootElements.length > 0) {
		for (const existingRootElement of existingRootElements) {
			normalizeLegacyRootAttributes(existingRootElement);
		}
		return existingRootElements;
	}

	const legacyContainers = Array.from(document.querySelectorAll<HTMLElement>('[data-design-builder]')).filter((container) => container.tagName.toLowerCase() !== 'design-builder');
	if (legacyContainers.length > 0) {
		return legacyContainers.map((legacyContainer) => {
			const rootElement = createRootElementFromLegacyContainer(legacyContainer);
			normalizeLegacyRootAttributes(rootElement);
			return rootElement;
		});
	}

	return [];
}
