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

export interface ComponentTokenReferenceSetting {
	token: string;
	label: string;
	description?: string;
}

export type ComponentSettingDefinition = TokenSetting | ComponentTokenReferenceSetting;

export interface ComponentSettingCategory {
	id: string;
	label: string;
	description?: string;
	present?: 'swatch';
	settings: ComponentSettingDefinition[];
}

export interface ComponentTokenDefinition {
	name?: string;
	slug?: string;
	tokens?: string[];
	componentSettings?: ComponentSettingCategory[];
}

export type ComponentTokenData = Record<string, ComponentTokenDefinition>;
export type ComponentVariableOverrides = Record<string, string>;
export type ComponentOverrides = Record<string, ComponentVariableOverrides>;
export type ScopedComponentOverrides = Record<string, ComponentOverrides>;
