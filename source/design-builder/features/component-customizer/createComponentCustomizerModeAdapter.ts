import type { DesignBuilderModeAdapter } from '../../web-component/designBuilderRootContracts';
import { initializeComponentCustomizer } from './initializeComponentCustomizer';

export function createComponentCustomizerModeAdapter(): DesignBuilderModeAdapter {
	return async ({ hostElement, configuration, renderContainer, modeSwitch }) => {
		const runtime = await initializeComponentCustomizer(configuration.componentData, configuration.tokenLibraryData, {
			mountElement: renderContainer,
			modeSwitch,
			hostElement,
		});

		return {
			dispose: () => {
				runtime?.dispose();
			},
		};
	};
}
