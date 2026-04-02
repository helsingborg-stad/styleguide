export const DESIGN_BUILDER_MODE_FULL_PAGE = 'full-page';
export const DESIGN_BUILDER_MODE_COMPONENT_CUSTOMIZER = 'component-customizer';

export type DesignBuilderMode = typeof DESIGN_BUILDER_MODE_FULL_PAGE | typeof DESIGN_BUILDER_MODE_COMPONENT_CUSTOMIZER;

export interface DesignBuilderRootConfiguration {
	mode: DesignBuilderMode;
	config: Record<string, unknown>;
	tokenData: unknown;
	tokenLibraryData: unknown;
	componentData: unknown;
}

export interface DesignBuilderModeAdapterContext {
	hostElement: DesignBuilderRootElement;
	configuration: DesignBuilderRootConfiguration;
	renderContainer: ShadowRoot;
}

export type DesignBuilderModeAdapter = (context: DesignBuilderModeAdapterContext) => void | Promise<void>;

export interface DesignBuilderRootElement extends HTMLElement {
	mode: DesignBuilderMode;
	config: Record<string, unknown>;
	tokenData: unknown;
	tokenLibraryData: unknown;
	componentData: unknown;
	getRenderContainer(): ShadowRoot;
}
