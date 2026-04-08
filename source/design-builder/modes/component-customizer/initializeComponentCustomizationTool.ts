import { loadTokenLibrary, isTokenData } from '../../services/tokenData';
import { parseComponentTokenData } from '../../utils/componentTokens';
import type { DesignBuilderRootInitConfig } from '../../types/runtime';
import type { DesignBuilderModeSwitch, DesignBuilderRootElement } from '../../root/types';
import { designBuilderStyles } from '../../designBuilderStyleText';
import { ComponentCustomizationRuntime } from './ComponentCustomizationRuntime';

const COMPONENT_CUSTOMIZER_STYLE_ID = 'design-builder-component-customizer-style';

export interface ComponentCustomizationInitializationOptions {
	mountElement?: HTMLElement | ShadowRoot;
	openOnInitialize?: boolean;
	modeSwitch?: DesignBuilderModeSwitch;
	hostElement?: DesignBuilderRootElement;
}

export async function initializeComponentCustomizationTool(
	componentTokenData: unknown,
	tokenLibraryPayload: unknown,
	rootConfig?: DesignBuilderRootInitConfig,
	options: ComponentCustomizationInitializationOptions = {},
): Promise<ComponentCustomizationRuntime | null> {
	const mountElement = options.mountElement ?? resolveMountElement(rootConfig);
	ensureComponentCustomizerStyles(mountElement);

	const customizeData = parseComponentTokenData(componentTokenData);
	if (Object.keys(customizeData).length === 0) {
		return null;
	}

	const tokenLibrary = isTokenData(tokenLibraryPayload) ? tokenLibraryPayload : await loadTokenLibrary();
	if (!tokenLibrary) {
		return null;
	}

	const runtime = new ComponentCustomizationRuntime(customizeData, tokenLibrary, mountElement, {
		modeSwitch: options.modeSwitch,
		hostElement: options.hostElement,
	});

	if (options.openOnInitialize) {
		openComponentCustomizationPanel(mountElement);
	}

	return runtime;
}

function resolveMountElement(rootConfig?: DesignBuilderRootInitConfig): HTMLElement {
	const mountSelector =
		typeof rootConfig?.customizerContainerSelector === 'string' ? rootConfig.customizerContainerSelector.trim() : '';
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
