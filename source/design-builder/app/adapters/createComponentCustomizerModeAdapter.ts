import type {
	DesignBuilderModeAdapter,
	DesignBuilderRootConfiguration,
	DesignBuilderRootElement,
} from '../../root/types';
import { CUSTOMIZE_INIT_MODE_MANUAL } from '../../state/runtimeConstants';
import { bindManualCustomizationInitTrigger } from '../../modes/component-customizer/bindManualCustomizationInitTrigger';
import {
	initializeComponentCustomizationTool,
	type ComponentCustomizationInitializationOptions,
} from '../../modes/component-customizer/initializeComponentCustomizationTool';

function resolveInitMode(configuration: DesignBuilderRootConfiguration): string {
	if (typeof configuration.config.initMode !== 'string') {
		return '';
	}

	return configuration.config.initMode.toLowerCase().trim();
}

function resolveMountElement(
	hostElement: DesignBuilderRootElement,
	configuration: DesignBuilderRootConfiguration,
): HTMLElement {
	const mountSelectorFromConfig =
		typeof configuration.config.customizerContainerSelector === 'string'
			? configuration.config.customizerContainerSelector.trim()
			: '';
	if (mountSelectorFromConfig) {
		const selectedElement = document.querySelector<HTMLElement>(mountSelectorFromConfig);
		if (selectedElement) {
			return selectedElement;
		}
	}

	return hostElement.parentElement ?? hostElement;
}

function resolveInitializationOptions(
	hostElement: DesignBuilderRootElement,
	configuration: DesignBuilderRootConfiguration,
	openOnInitialize: boolean,
): ComponentCustomizationInitializationOptions {
	return {
		mountElement: resolveMountElement(hostElement, configuration),
		openOnInitialize,
	};
}

export function createComponentCustomizerModeAdapter(): DesignBuilderModeAdapter {
	return async ({ hostElement, configuration }) => {
		const initializeWithoutOpeningPanel = async () => {
			await initializeComponentCustomizationTool(
				configuration.componentData,
				configuration.tokenLibraryData,
				configuration.config,
				resolveInitializationOptions(hostElement, configuration, false),
			);
		};

		const initializeAndOpenPanel = async () => {
			await initializeComponentCustomizationTool(
				configuration.componentData,
				configuration.tokenLibraryData,
				configuration.config,
				resolveInitializationOptions(hostElement, configuration, true),
			);
		};

		if (resolveInitMode(configuration) === CUSTOMIZE_INIT_MODE_MANUAL) {
			// Ensure saved overrides are applied on page load even in manual mode.
			await initializeWithoutOpeningPanel();
			bindManualCustomizationInitTrigger(initializeAndOpenPanel);
			return;
		}

		await initializeWithoutOpeningPanel();
	};
}
