import { parseComponentTokenData } from './componentTokenDefinitions';
import { designBuilderStyles } from '../../shared/styling/designBuilderStyleText';
import { isTokenData } from '../../shared/design-tokens/designTokenLibrary';
import type { DesignBuilderModeSwitch, DesignBuilderRootElement } from '../../web-component/designBuilderRootContracts';
import { ComponentCustomizerRuntime } from './ComponentCustomizerRuntime';

const COMPONENT_CUSTOMIZER_STYLE_ID = 'design-builder-component-customizer-style';

export interface ComponentCustomizerInitializationOptions {
	mountElement?: HTMLElement | ShadowRoot;
	modeSwitch?: DesignBuilderModeSwitch;
	hostElement?: DesignBuilderRootElement;
	showSaveButton?: boolean;
}

export async function initializeComponentCustomizer(componentTokenData: unknown, tokenLibraryPayload: unknown, options: ComponentCustomizerInitializationOptions = {}): Promise<ComponentCustomizerRuntime | null> {
	const mountElement = options.mountElement ?? document.body;
	ensureComponentCustomizerStyles(mountElement);

	const customizeData = parseComponentTokenData(componentTokenData);
	if (Object.keys(customizeData).length === 0) {
		return null;
	}

	const tokenLibrary = isTokenData(tokenLibraryPayload) ? tokenLibraryPayload : null;
	if (!tokenLibrary) {
		return null;
	}

	const runtime = new ComponentCustomizerRuntime(customizeData, tokenLibrary, mountElement, {
		modeSwitch: options.modeSwitch,
		hostElement: options.hostElement,
		showSaveButton: options.showSaveButton,
	});

	return runtime;
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
