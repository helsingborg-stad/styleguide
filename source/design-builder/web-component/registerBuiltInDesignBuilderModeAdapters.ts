import { createComponentCustomizerModeAdapter } from '../features/component-customizer/createComponentCustomizerModeAdapter';
import { createFullPageEditorModeAdapter } from '../features/full-page-editor/createFullPageEditorModeAdapter';
import { registerDesignBuilderModeAdapter } from './DesignBuilderCustomElement';
import { DESIGN_BUILDER_MODE_COMPONENT_CUSTOMIZER, DESIGN_BUILDER_MODE_FULL_PAGE } from './designBuilderRootContracts';

export function registerBuiltInDesignBuilderModeAdapters(): void {
	registerDesignBuilderModeAdapter(DESIGN_BUILDER_MODE_FULL_PAGE, createFullPageEditorModeAdapter());
	registerDesignBuilderModeAdapter(DESIGN_BUILDER_MODE_COMPONENT_CUSTOMIZER, createComponentCustomizerModeAdapter());
}
