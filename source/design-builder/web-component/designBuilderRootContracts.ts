import type { DesignBuilderOverrideState } from '../shared/state/designBuilderOverrideState';
import type { DesignBuilderProvidedPreset } from '../shared/presets/designBuilderPresetDefinitions';

export const DESIGN_BUILDER_MODE_FULL_PAGE = 'full-page';
export const DESIGN_BUILDER_MODE_COMPONENT_CUSTOMIZER = 'component-customizer';

export type DesignBuilderMode = typeof DESIGN_BUILDER_MODE_FULL_PAGE | typeof DESIGN_BUILDER_MODE_COMPONENT_CUSTOMIZER;

export interface DesignBuilderRootConfiguration {
	mode: DesignBuilderMode;
	availableModes: DesignBuilderMode[];
	tokenData: unknown;
	tokenLibraryData: unknown;
	componentData: unknown;
	overrideState: DesignBuilderOverrideState;
	presets: DesignBuilderProvidedPreset[];
}

export interface DesignBuilderModeSwitch {
	activeMode: DesignBuilderMode;
	availableModes: DesignBuilderMode[];
	onSwitch: (mode: DesignBuilderMode) => void;
}

export interface DesignBuilderModeAdapterContext {
	hostElement: DesignBuilderRootElement;
	configuration: DesignBuilderRootConfiguration;
	renderContainer: ShadowRoot;
	modeSwitch: DesignBuilderModeSwitch;
}

export interface DesignBuilderModeAdapterResult {
	dispose?: () => void | Promise<void>;
}

export type DesignBuilderModeAdapter = (context: DesignBuilderModeAdapterContext) => DesignBuilderModeAdapterResult | void | Promise<DesignBuilderModeAdapterResult | void>;

export interface DesignBuilderRootElement extends HTMLElement {
	tokenData: unknown;
	tokenLibraryData: unknown;
	componentData: unknown;
	overrideState: DesignBuilderOverrideState;
	presets: DesignBuilderProvidedPreset[];
	getRenderContainer(): ShadowRoot;
}
