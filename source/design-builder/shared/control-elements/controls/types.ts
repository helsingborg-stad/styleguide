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
	type: 'color' | 'rgba' | 'range' | 'minmaxrange' | 'range-bounds' | 'select' | 'font' | 'token-color';
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
	pairWith?: string;
	rangeConstraint?: {
		group: string;
		role: 'min' | 'max';
	};
	rangeBounds?: {
		maxVariable: string;
		maxDefault: string;
		maxValue?: string;
		maxOutputs?: string[];
		minLabel?: string;
		maxLabel?: string;
	};
	visibleWhen?: {
		settingEquals?: Array<{
			variable: string;
			value: string;
		}>;
		settingNotEquals?: Array<{
			variable: string;
			value: string;
		}>;
		hasClass?: string[];
		hasAnyClass?: string[];
		doesNotHaveClass?: string[];
	};
}

export interface ControlChangeOptions {
	preserveMatchingDefault?: boolean;
}

export type ChangeCallback = (variable: string, value: string, extraValues?: Record<string, string>, options?: ControlChangeOptions) => void;
