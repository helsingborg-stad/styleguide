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

export interface ComponentTokenDefinition {
	name?: string;
	slug?: string;
	tokens?: string[];
	componentSettings?: TokenCategory[];
}

export type ComponentTokenData = Record<string, ComponentTokenDefinition>;
export type ComponentVariableOverrides = Record<string, string>;
export type ComponentOverrides = Record<string, ComponentVariableOverrides>;
export type ScopedComponentOverrides = Record<string, ComponentOverrides>;
