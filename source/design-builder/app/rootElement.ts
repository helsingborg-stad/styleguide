import type { DesignBuilderRootElement } from '../root/types';
import { ComponentStorageAdapter } from '../services/ComponentStorageAdapter';
import { resolveCustomizeInitMode } from '../services/customizeInitMode';
import { hasOverrideStateData, normalizeDesignBuilderOverrideState, type DesignBuilderOverrideState } from '../services/overrideState';
import { LocalStorageAdapter } from '../storage';

function serializePayload(value: unknown): string | null {
	if (value === undefined) {
		return null;
	}

	try {
		return JSON.stringify(value);
	} catch {
		return null;
	}
}

function parseObjectAttribute(value: string | null): Record<string, unknown> {
	if (!value) {
		return {};
	}

	try {
		const parsed = JSON.parse(value) as unknown;
		if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
			return {};
		}

		return parsed as Record<string, unknown>;
	} catch {
		return {};
	}
}

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
	if (rootElement.hasAttribute('override-state')) {
		return;
	}

	const overrideState = normalizeDesignBuilderOverrideState({
		token: new LocalStorageAdapter().load(),
		component: new ComponentStorageAdapter().load(),
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
	if (rootElement.dataset.designBuilderSaveAdapterBound === 'true') {
		return;
	}

	rootElement.dataset.designBuilderSaveAdapterBound = 'true';
	rootElement.addEventListener('design-builder:save', (event) => {
		const detail = (event as CustomEvent<{ state?: unknown }>).detail;
		const state = normalizeDesignBuilderOverrideState(detail?.state);
		new LocalStorageAdapter().save(state.token);
		new ComponentStorageAdapter().save(state.component);
	});
}

function mergeCustomizeConfig(rootElement: DesignBuilderRootElement): void {
	const existingConfig = parseObjectAttribute(rootElement.getAttribute('config'));
	if (typeof existingConfig.initMode === 'string' && existingConfig.initMode.trim() !== '') {
		return;
	}

	existingConfig.initMode = resolveCustomizeInitMode();
	rootElement.setAttribute('config', JSON.stringify(existingConfig));
}

function hydrateComponentPayload(rootElement: DesignBuilderRootElement): void {
	const hasWindowPayload =
		window.styleguideCustomizeData !== undefined && window.styleguideDesignTokenLibrary !== undefined;
	if (!hasWindowPayload) {
		return;
	}

	if (!rootElement.hasAttribute('component-data')) {
		const serializedComponentData = serializePayload(window.styleguideCustomizeData);
		if (serializedComponentData) {
			rootElement.setAttribute('component-data', serializedComponentData);
		}
	}

	if (!rootElement.hasAttribute('token-library')) {
		const serializedTokenLibrary = serializePayload(window.styleguideDesignTokenLibrary);
		if (serializedTokenLibrary) {
			rootElement.setAttribute('token-library', serializedTokenLibrary);
		}
	}

	mergeCustomizeConfig(rootElement);
}

function normalizeLegacyRootAttributes(rootElement: DesignBuilderRootElement): void {
	if (!rootElement.hasAttribute('token-data')) {
		const legacyTokenData = rootElement.getAttribute('data-tokens');
		if (legacyTokenData) {
			rootElement.setAttribute('token-data', legacyTokenData);
		}
	}

	if (!rootElement.hasAttribute('token-library')) {
		const legacyTokenLibrary = rootElement.getAttribute('data-token-library');
		if (legacyTokenLibrary) {
			rootElement.setAttribute('token-library', legacyTokenLibrary);
		}
	}

	if (!rootElement.hasAttribute('component-data')) {
		const legacyComponentData = rootElement.getAttribute('data-component-data');
		if (legacyComponentData) {
			rootElement.setAttribute('component-data', legacyComponentData);
		}
	}

	hydrateComponentPayload(rootElement);
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

function createComponentRootElementFromPayload(): DesignBuilderRootElement | null {
	if (window.styleguideCustomizeData === undefined || window.styleguideDesignTokenLibrary === undefined) {
		return null;
	}

	const serializedComponentData = serializePayload(window.styleguideCustomizeData);
	const serializedTokenLibrary = serializePayload(window.styleguideDesignTokenLibrary);
	if (!serializedComponentData || !serializedTokenLibrary) {
		return null;
	}

	const componentRootElement = document.createElement('design-builder') as DesignBuilderRootElement;
	componentRootElement.setAttribute('component-data', serializedComponentData);
	componentRootElement.setAttribute('token-library', serializedTokenLibrary);
	componentRootElement.setAttribute('config', JSON.stringify({ initMode: resolveCustomizeInitMode() }));
	componentRootElement.setAttribute('hidden', '');
	componentRootElement.setAttribute('aria-hidden', 'true');
	componentRootElement.setAttribute('data-customizable', 'false');
	document.body.appendChild(componentRootElement);

	return componentRootElement;
}

export function resolveRootElementsToInitialize(): DesignBuilderRootElement[] {
	const existingRootElements = getExistingRootElements();
	if (existingRootElements.length > 0) {
		for (const existingRootElement of existingRootElements) {
			normalizeLegacyRootAttributes(existingRootElement);
		}
		return existingRootElements;
	}

	const legacyContainers = Array.from(document.querySelectorAll<HTMLElement>('[data-design-builder]')).filter(
		(container) => container.tagName.toLowerCase() !== 'design-builder',
	);
	if (legacyContainers.length > 0) {
		return legacyContainers.map((legacyContainer) => createRootElementFromLegacyContainer(legacyContainer));
	}

	const payloadRoot = createComponentRootElementFromPayload();
	return payloadRoot ? [payloadRoot] : [];
}
