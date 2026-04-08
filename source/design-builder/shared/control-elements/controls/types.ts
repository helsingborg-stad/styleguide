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

export type ChangeCallback = (variable: string, value: string) => void;
