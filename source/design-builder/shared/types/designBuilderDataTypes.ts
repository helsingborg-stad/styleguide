import type { TokenSetting } from '../control-elements/controls/types';

export interface TokenCategory {
	id: string;
	label: string;
	description?: string;
	present?: 'swatch';
	settings: TokenSetting[];
}

export interface TokenData {
	name: string;
	version: string;
	categories: TokenCategory[];
}

export interface DesignBuilderRootInitConfig {
	initMode?: unknown;
	customizerContainerSelector?: unknown;
}

export interface ComponentTokenDefinition {
	name?: string;
	slug?: string;
	tokens?: string[];
}

export type ComponentTokenData = Record<string, ComponentTokenDefinition>;
export type ComponentVariableOverrides = Record<string, string>;
export type ComponentOverrides = Record<string, ComponentVariableOverrides>;
export type ScopedComponentOverrides = Record<string, ComponentOverrides>;

declare global {
	interface Window {
		styleguideCustomizeData?: unknown;
		styleguideDesignTokenLibrary?: unknown;
		styleguideCustomizeInitMode?: unknown;
	}
}
