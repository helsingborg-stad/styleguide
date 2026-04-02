import type { DesignBuilderModeAdapter } from '../../root/types';
import { initializeFullPageDesignBuilder } from '../../modes/full-page/initializeFullPageDesignBuilder';

export function createFullPageModeAdapter(): DesignBuilderModeAdapter {
	return ({ configuration, renderContainer }) => {
		initializeFullPageDesignBuilder(configuration.tokenData, renderContainer);
	};
}
