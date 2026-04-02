import type { DesignBuilderModeAdapter } from '../../root/types';
import { initializeFullPageDesignBuilder } from '../../modes/full-page/initializeFullPageDesignBuilder';

export function createFullPageModeAdapter(): DesignBuilderModeAdapter {
	return ({ hostElement, configuration }) => {
		initializeFullPageDesignBuilder(hostElement, configuration.tokenData);
	};
}
