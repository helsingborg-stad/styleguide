import { parseComponentTokenData } from './componentTokenDefinitions';
import { designBuilderStyles } from '../../shared/styling/designBuilderStyleText';
import { isTokenData, readEmbeddedDesignTokenLibrary } from '../../shared/design-tokens/designTokenLibrary';
import type { DesignBuilderRootInitConfig } from '../../shared/types/designBuilderDataTypes';
import type { DesignBuilderModeSwitch, DesignBuilderRootElement } from '../../web-component/designBuilderRootContracts';
import { ComponentCustomizerRuntime } from './ComponentCustomizerRuntime';

const COMPONENT_CUSTOMIZER_STYLE_ID = 'design-builder-component-customizer-style';

export interface ComponentCustomizerInitializationOptions {
	mountElement?: HTMLElement | ShadowRoot;
	openOnInitialize?: boolean;
	modeSwitch?: DesignBuilderModeSwitch;
	hostElement?: DesignBuilderRootElement;
}

export async function initializeComponentCustomizer(componentTokenData: unknown, tokenLibraryPayload: unknown, rootConfig?: DesignBuilderRootInitConfig, options: ComponentCustomizerInitializationOptions = {}): Promise<ComponentCustomizerRuntime | null> {
	const mountElement = options.mountElement ?? resolveMountElement(rootConfig);
	ensureComponentCustomizerStyles(mountElement);

	const customizeData = parseComponentTokenData(componentTokenData);
	if (Object.keys(customizeData).length === 0) {
		return null;
	}

	const tokenLibrary = isTokenData(tokenLibraryPayload) ? tokenLibraryPayload : await readEmbeddedDesignTokenLibrary();
	if (!tokenLibrary) {
		return null;
	}

	const runtime = new ComponentCustomizerRuntime(customizeData, tokenLibrary, mountElement, {
		modeSwitch: options.modeSwitch,
		hostElement: options.hostElement,
	});

	if (options.openOnInitialize) {
		openComponentCustomizationPanel(mountElement);
	}

	return runtime;
}

function resolveMountElement(rootConfig?: DesignBuilderRootInitConfig): HTMLElement {
	const mountSelector = typeof rootConfig?.customizerContainerSelector === 'string' ? rootConfig.customizerContainerSelector.trim() : '';
	if (mountSelector) {
		const selected = document.querySelector<HTMLElement>(mountSelector);
		if (selected) {
			return selected;
		}
	}

	return document.body;
}

function openComponentCustomizationPanel(mountElement?: ParentNode): void {
	const panelRoot = (mountElement ?? document).querySelector<HTMLElement>('.db-builder-customizer');
	if (!panelRoot) {
		return;
	}

	panelRoot.hidden = false;
}

function ensureComponentCustomizerStyles(mountElement: HTMLElement | ShadowRoot): void {
	if (mountElement instanceof ShadowRoot) {
		return;
	}

	if (document.getElementById(COMPONENT_CUSTOMIZER_STYLE_ID)) {
		return;
	}

	const style = document.createElement('style');
	style.id = COMPONENT_CUSTOMIZER_STYLE_ID;
	style.textContent = designBuilderStyles;
	document.head.appendChild(style);
}
