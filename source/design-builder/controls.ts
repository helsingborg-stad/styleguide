/**
 * Control render adapters for design-builder settings.
 */

import './controls/layout/ControlRow';
import './controls/layout/ContrastPair';
import './controls/layout/ReadOnlyControlRow';
import './controls/layout/SwatchBand';
import type { ContrastSettingValue } from './controls/layout/ContrastPair';
import type { ChangeCallback, TokenSetting } from './controls/types';

export type { ChangeCallback, TokenSetting } from './controls/types';

type ControlRowElement = HTMLElement & {
	setting: TokenSetting;
	value: string;
};

type ReadOnlyControlRowElement = HTMLElement & {
	setting: TokenSetting;
	value: string;
};

type ContrastPairElement = HTMLElement & {
	base: TokenSetting;
	baseValue: string;
	contrasts: ContrastSettingValue[];
};

type SwatchBandElement = HTMLElement & {
	settings: TokenSetting[];
};

export function createControl(setting: TokenSetting, currentValue: string, onChange: ChangeCallback): HTMLElement {
	const row = document.createElement('db-control-row') as ControlRowElement;
	row.setting = setting;
	row.value = currentValue;
	row.addEventListener('control-change', (event) => {
		const detail = (event as CustomEvent<{ variable: string; value: string }>).detail;
		if (!detail) {
			return;
		}

		onChange(detail.variable, detail.value);
	});
	return row;
}

export function createReadOnlyControl(setting: TokenSetting, currentValue: string): HTMLElement {
	const row = document.createElement('db-readonly-control-row') as ReadOnlyControlRowElement;
	row.setting = setting;
	row.value = currentValue;
	return row;
}

export function createContrastPair(
	base: TokenSetting,
	contrasts: { setting: TokenSetting; value: string }[],
	baseValue: string,
	onChange: ChangeCallback,
): HTMLElement {
	const pair = document.createElement('db-contrast-pair') as ContrastPairElement;
	pair.base = base;
	pair.baseValue = baseValue;
	pair.contrasts = contrasts;
	pair.addEventListener('contrast-change', (event) => {
		const detail = (event as CustomEvent<{ variable: string; value: string }>).detail;
		if (!detail) {
			return;
		}

		onChange(detail.variable, detail.value);
	});

	return pair;
}

export function createSwatchBand(settings: TokenSetting[]): HTMLElement {
	const band = document.createElement('db-swatch-band') as SwatchBandElement;
	band.settings = settings;
	return band;
}
