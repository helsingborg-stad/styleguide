export interface TokenSetting {
	variable: string;
	label: string;
	description?: string;
	type: 'color' | 'rgba' | 'range' | 'select' | 'font';
	default: string;
	unit?: string;
	min?: number;
	max?: number;
	step?: number;
	options?: Array<{ value: string; label: string }>;
	locked?: boolean;
	contrast?: string | string[];
	notes?: string;
}

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

export type ChangeCallback = (variable: string, value: string) => void;

export interface ComponentTokenDefinition {
	name?: string;
	slug?: string;
	tokens?: string[];
}

export type ComponentTokenData = Record<string, ComponentTokenDefinition>;
export type ComponentVariableOverrides = Record<string, string>;
export type ComponentOverrides = Record<string, ComponentVariableOverrides>;
export type ScopedComponentOverrides = Record<string, ComponentOverrides>;
