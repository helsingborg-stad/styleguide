import type { DesignBuilderModeAdapter, DesignBuilderModeSwitch, DesignBuilderRootConfiguration, DesignBuilderRootElement } from '../../web-component/designBuilderRootContracts';
import { CUSTOMIZE_INIT_MODE_MANUAL } from '../../shared/constants/designBuilderRuntimeConstants';
import { bindManualComponentCustomizerInitializationTrigger } from './bindManualComponentCustomizerInitializationTrigger';
import { initializeComponentCustomizer, type ComponentCustomizerInitializationOptions } from './initializeComponentCustomizer';

function resolveInitMode(configuration: DesignBuilderRootConfiguration): string {
	if (typeof configuration.config.initMode !== 'string') {
		return '';
	}

	return configuration.config.initMode.toLowerCase().trim();
}

function resolveMountElement(hostElement: DesignBuilderRootElement, configuration: DesignBuilderRootConfiguration, renderContainer: ShadowRoot): HTMLElement | ShadowRoot {
	const mountSelectorFromConfig = typeof configuration.config.customizerContainerSelector === 'string' ? configuration.config.customizerContainerSelector.trim() : '';
	if (mountSelectorFromConfig) {
		const selectedElement = document.querySelector<HTMLElement>(mountSelectorFromConfig);
		if (selectedElement) {
			return selectedElement;
		}
	}

	if (hostElement.hidden || hostElement.hasAttribute('hidden')) {
		return hostElement.parentElement ?? hostElement;
	}

	return renderContainer;
}

function resolveInitializationOptions(hostElement: DesignBuilderRootElement, configuration: DesignBuilderRootConfiguration, renderContainer: ShadowRoot, openOnInitialize: boolean, modeSwitch: DesignBuilderModeSwitch): ComponentCustomizerInitializationOptions {
	return {
		mountElement: resolveMountElement(hostElement, configuration, renderContainer),
		openOnInitialize,
		modeSwitch,
		hostElement,
	};
}

export function createComponentCustomizerModeAdapter(): DesignBuilderModeAdapter {
	return async ({ hostElement, configuration, renderContainer, modeSwitch }) => {
		let runtimeCleanup: (() => void) | null = null;
		let unbindManualTrigger = () => {};

		const initializeWithoutOpeningPanel = async () => {
			runtimeCleanup?.();
			runtimeCleanup = null;

			const runtime = await initializeComponentCustomizer(configuration.componentData, configuration.tokenLibraryData, configuration.config, resolveInitializationOptions(hostElement, configuration, renderContainer, false, modeSwitch));

			runtimeCleanup = runtime ? () => runtime.dispose() : null;
		};

		const initializeAndOpenPanel = async () => {
			runtimeCleanup?.();
			runtimeCleanup = null;

			const runtime = await initializeComponentCustomizer(configuration.componentData, configuration.tokenLibraryData, configuration.config, resolveInitializationOptions(hostElement, configuration, renderContainer, true, modeSwitch));

			runtimeCleanup = runtime ? () => runtime.dispose() : null;
		};

		if (resolveInitMode(configuration) === CUSTOMIZE_INIT_MODE_MANUAL) {
			// Ensure saved overrides are applied on page load even in manual mode.
			await initializeWithoutOpeningPanel();
			unbindManualTrigger = bindManualComponentCustomizerInitializationTrigger(initializeAndOpenPanel);
			return {
				dispose: () => {
					unbindManualTrigger();
					runtimeCleanup?.();
					runtimeCleanup = null;
				},
			};
		}

		await initializeWithoutOpeningPanel();
		return {
			dispose: () => {
				unbindManualTrigger();
				runtimeCleanup?.();
				runtimeCleanup = null;
			},
		};
	};
}
