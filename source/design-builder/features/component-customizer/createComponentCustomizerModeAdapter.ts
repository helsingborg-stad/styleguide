import type { DesignBuilderModeAdapter } from '../../web-component/designBuilderRootContracts';
import { initializeComponentCustomizer } from './initializeComponentCustomizer';

export function createComponentCustomizerModeAdapter(): DesignBuilderModeAdapter {
	return async ({ hostElement, configuration, renderContainer, modeSwitch }) => {
		const runtime = await initializeComponentCustomizer(configuration.componentData, configuration.tokenData, {
			mountElement: renderContainer,
			modeSwitch,
			hostElement,
			showSaveButton: configuration.showSaveButton,
		});

		return {
			dispose: () => {
				runtime?.dispose();
			},
		};
	};
}
