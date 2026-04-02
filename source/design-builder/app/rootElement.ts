import {
	DESIGN_BUILDER_MODE_COMPONENT_CUSTOMIZER,
	DESIGN_BUILDER_MODE_FULL_PAGE,
	type DesignBuilderRootElement,
} from '../root/types';
import { resolveCustomizeInitMode } from '../services/customizeInitMode';

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

function isFullPageCandidate(rootElement: HTMLElement): boolean {
	const mode = rootElement.getAttribute('mode')?.trim().toLowerCase();
	return (
		mode === DESIGN_BUILDER_MODE_FULL_PAGE ||
		rootElement.hasAttribute('token-data') ||
		rootElement.hasAttribute('data-tokens') ||
		rootElement.hasAttribute('data-design-builder')
	);
}

function isComponentCandidate(rootElement: HTMLElement): boolean {
	const mode = rootElement.getAttribute('mode')?.trim().toLowerCase();
	return (
		mode === DESIGN_BUILDER_MODE_COMPONENT_CUSTOMIZER ||
		rootElement.hasAttribute('component-data') ||
		rootElement.hasAttribute('token-library')
	);
}

export function getExistingRootElement(): DesignBuilderRootElement | null {
	const rootElements = Array.from(document.querySelectorAll<DesignBuilderRootElement>('design-builder'));
	if (rootElements.length === 0) {
		return null;
	}

	if (rootElements.length === 1) {
		return rootElements[0];
	}

	return (
		rootElements.find((rootElement) => isFullPageCandidate(rootElement)) ??
		rootElements.find((rootElement) => isComponentCandidate(rootElement)) ??
		rootElements[0]
	);
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

	const modeAttribute = rootElement.getAttribute('mode')?.trim().toLowerCase() ?? '';
	if (modeAttribute === '') {
		if (isFullPageCandidate(rootElement)) {
			rootElement.setAttribute('mode', DESIGN_BUILDER_MODE_FULL_PAGE);
		} else if (isComponentCandidate(rootElement)) {
			rootElement.setAttribute('mode', DESIGN_BUILDER_MODE_COMPONENT_CUSTOMIZER);
		}
	}

	hydrateComponentPayload(rootElement);
}

export function createRootElementFromLegacyContainer(container: HTMLElement): DesignBuilderRootElement {
	const rootElement = document.createElement('design-builder') as DesignBuilderRootElement;

	for (const { name, value } of Array.from(container.attributes)) {
		rootElement.setAttribute(name, value);
	}

	const legacyTokenData = container.getAttribute('data-tokens');
	if (legacyTokenData) {
		rootElement.setAttribute('token-data', legacyTokenData);
	}

	rootElement.setAttribute('mode', DESIGN_BUILDER_MODE_FULL_PAGE);
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
	componentRootElement.setAttribute('mode', DESIGN_BUILDER_MODE_COMPONENT_CUSTOMIZER);
	componentRootElement.setAttribute('component-data', serializedComponentData);
	componentRootElement.setAttribute('token-library', serializedTokenLibrary);
	componentRootElement.setAttribute('config', JSON.stringify({ initMode: resolveCustomizeInitMode() }));
	componentRootElement.setAttribute('hidden', '');
	componentRootElement.setAttribute('aria-hidden', 'true');
	componentRootElement.setAttribute('data-customizable', 'false');
	document.body.appendChild(componentRootElement);

	return componentRootElement;
}

export function resolveRootElementToInitialize(): DesignBuilderRootElement | null {
	const existingRootElement = getExistingRootElement();
	if (existingRootElement) {
		normalizeLegacyRootAttributes(existingRootElement);
		return existingRootElement;
	}

	const legacyContainer = document.querySelector<HTMLElement>('[data-design-builder]');
	if (legacyContainer) {
		return createRootElementFromLegacyContainer(legacyContainer);
	}

	return createComponentRootElementFromPayload();
}
