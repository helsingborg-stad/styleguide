import { registerDesignBuilderModeAdapter } from '../root/DesignBuilderElement';
import { DESIGN_BUILDER_MODE_COMPONENT_CUSTOMIZER, DESIGN_BUILDER_MODE_FULL_PAGE } from '../root/types';
import { createComponentCustomizerModeAdapter } from './adapters/createComponentCustomizerModeAdapter';
import { createFullPageModeAdapter } from './adapters/createFullPageModeAdapter';

export function registerRootModeAdapters(): void {
	registerDesignBuilderModeAdapter(DESIGN_BUILDER_MODE_FULL_PAGE, createFullPageModeAdapter());
	registerDesignBuilderModeAdapter(DESIGN_BUILDER_MODE_COMPONENT_CUSTOMIZER, createComponentCustomizerModeAdapter());
}
