import { registerDesignBuilderElement } from '../root/DesignBuilderElement';
import { registerRootModeAdapters } from './registerRootModeAdapters';
import { resolveRootElementsToInitialize } from './rootElement';

export function initializeDesignBuilderRootRuntime(): void {
	registerRootModeAdapters();
	resolveRootElementsToInitialize();
	registerDesignBuilderElement();
}
