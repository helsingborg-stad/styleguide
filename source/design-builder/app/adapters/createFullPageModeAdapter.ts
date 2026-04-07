import type { DesignBuilderModeAdapter } from '../../root/types';
import { initializeFullPageDesignBuilder } from '../../modes/full-page/initializeFullPageDesignBuilder';

export function createFullPageModeAdapter(): DesignBuilderModeAdapter {
	return ({ hostElement, configuration, renderContainer, modeSwitch }) => {
		const runtime = initializeFullPageDesignBuilder(
			configuration.tokenData ?? configuration.tokenLibraryData,
			renderContainer,
			hostElement,
			modeSwitch,
		);

		return {
			dispose: () => {
				runtime?.destroy();
			},
		};
	};
}
