import { registerDesignBuilderElement } from '../root/DesignBuilderElement';
import { registerRootModeAdapters } from './registerRootModeAdapters';
import { resolveRootElementToInitialize } from './rootElement';

export function initializeDesignBuilderRootRuntime(): void {
	registerRootModeAdapters();
	resolveRootElementToInitialize();
	registerDesignBuilderElement();
}
