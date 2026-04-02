import { loadTokenLibrary, isTokenData } from '../../services/tokenData';
import { parseComponentTokenData } from '../../utils/componentTokens';
import type { DesignBuilderRootInitConfig } from '../../types/runtime';
import { ComponentCustomizationRuntime } from './ComponentCustomizationRuntime';

let hasInitializedComponentCustomization = false;
let customizationPanelMountElement: HTMLElement | null = null;
let componentCustomizationInitializationPromise: Promise<void> | null = null;

export interface ComponentCustomizationInitializationOptions {
	mountElement?: HTMLElement;
	openOnInitialize?: boolean;
}

export async function initializeComponentCustomizationTool(
	componentTokenData: unknown,
	tokenLibraryPayload: unknown,
	rootConfig?: DesignBuilderRootInitConfig,
	options: ComponentCustomizationInitializationOptions = {},
): Promise<void> {
	if (componentCustomizationInitializationPromise) {
		await componentCustomizationInitializationPromise;
		if (options.openOnInitialize) {
			openComponentCustomizationPanel(options.mountElement ?? customizationPanelMountElement ?? undefined);
		}
		return;
	}

	if (hasInitializedComponentCustomization) {
		if (options.openOnInitialize) {
			openComponentCustomizationPanel(options.mountElement ?? customizationPanelMountElement ?? undefined);
		}
		return;
	}

	componentCustomizationInitializationPromise = (async () => {
		const customizeData = parseComponentTokenData(componentTokenData);
		if (Object.keys(customizeData).length === 0) {
			return;
		}

		const tokenLibrary = isTokenData(tokenLibraryPayload) ? tokenLibraryPayload : await loadTokenLibrary();
		if (!tokenLibrary) {
			return;
		}

		const mountElement = options.mountElement ?? resolveMountElement(rootConfig);
		new ComponentCustomizationRuntime(customizeData, tokenLibrary, mountElement);
		customizationPanelMountElement = mountElement;
		hasInitializedComponentCustomization = true;

		if (options.openOnInitialize) {
			openComponentCustomizationPanel(mountElement);
		}
	})();

	try {
		await componentCustomizationInitializationPromise;
	} finally {
		componentCustomizationInitializationPromise = null;
	}
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

export function openComponentCustomizationPanel(mountElement?: ParentNode): void {
	const panelRoot = (mountElement ?? document).querySelector<HTMLElement>('.db-component-tool');
	if (!panelRoot) {
		return;
	}

	panelRoot.classList.add('db-component-tool--open');
}
