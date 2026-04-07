import { loadTokenLibrary, isTokenData } from '../../services/tokenData';
import { parseComponentTokenData } from '../../utils/componentTokens';
import type { DesignBuilderRootInitConfig } from '../../types/runtime';
import type { DesignBuilderModeSwitch, DesignBuilderRootElement } from '../../root/types';
import { ComponentCustomizationRuntime } from './ComponentCustomizationRuntime';

const COMPONENT_CUSTOMIZER_STYLE_ID = 'design-builder-component-customizer-style';
const COMPONENT_CUSTOMIZER_STYLE_ASSET = '/assets/dist/css/design-builder.css';

let componentCustomizationStyleReady: Promise<void> | null = null;

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
	await ensureComponentCustomizerStyles(mountElement);

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

async function ensureComponentCustomizerStyles(mountElement: HTMLElement | ShadowRoot): Promise<void> {
	if (mountElement instanceof ShadowRoot) {
		return;
	}

	if (document.getElementById(COMPONENT_CUSTOMIZER_STYLE_ID)) {
		return;
	}

	if (componentCustomizationStyleReady) {
		await componentCustomizationStyleReady;
		return;
	}

	componentCustomizationStyleReady = new Promise<void>((resolve) => {
		const link = document.createElement('link');
		link.id = COMPONENT_CUSTOMIZER_STYLE_ID;
		link.rel = 'stylesheet';
		link.href = COMPONENT_CUSTOMIZER_STYLE_ASSET;
		link.addEventListener('load', () => resolve(), { once: true });
		link.addEventListener('error', () => resolve(), { once: true });
		document.head.appendChild(link);
	});

	await componentCustomizationStyleReady;
}
