export interface TokenSettingOption {
	value: string;
	label: string;
	swatch?: string;
	contrastSwatch?: string;
	extraValues?: Record<string, string>;
}

export interface TokenSetting {
	variable: string;
	outputs?: string[];
	label: string;
	description?: string;
	type: 'color' | 'rgba' | 'range' | 'select' | 'font' | 'token-color';
	default: string;
	unit?: string;
	min?: number;
	max?: number;
	step?: number;
	options?: TokenSettingOption[];
	locked?: boolean;
	contrast?: string | string[];
	notes?: string;
	linkedDefaults?: Record<string, string>;
	visibleWhen?: {
		hasClass?: string[];
		hasAnyClass?: string[];
		doesNotHaveClass?: string[];
	};
}

export interface ControlChangeOptions {
	preserveMatchingDefault?: boolean;
}

export type ChangeCallback = (variable: string, value: string, extraValues?: Record<string, string>, options?: ControlChangeOptions) => void;
