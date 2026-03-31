/**
 * Control Renderers for Design Token Types
 *
 * Factory functions that delegate to web components.
 * Maintains backward-compatible API for existing consumers.
 */

import type { TokenSetting, ChangeCallback } from './core/types';

// Side-effect imports to ensure custom elements are registered
import './core/components/db-control';
import './core/components/db-contrast-pair';
import './core/components/db-swatch-band';

import type { DbControl } from './core/components/db-control';
import type { DbContrastPair } from './core/components/db-contrast-pair';
import type { DbSwatchBand } from './core/components/db-swatch-band';

export type { TokenSetting, ChangeCallback } from './core/types';

/**
 * Creates a control row for a single token setting.
 */
export function createControl(setting: TokenSetting, currentValue: string, onChange: ChangeCallback): HTMLElement {
	const control = document.createElement('db-control') as DbControl;
	control.configure(setting, currentValue, onChange);
	return control;
}

/**
 * Creates a compact read-only control row for locked settings.
 */
export function createReadOnlyControl(setting: TokenSetting, currentValue: string): HTMLElement {
	const row = document.createElement('div');
	row.className = 'db-control db-control--readonly db-control--locked';
	row.dataset.variable = setting.variable;

	const label = document.createElement('label');
	label.className = 'db-control__label';
	label.textContent = setting.label;
	row.appendChild(label);

	const valueWrap = document.createElement('div');
	valueWrap.className = 'db-control__readonly-value';

	if (setting.type === 'color' || setting.type === 'rgba') {
		const swatch = document.createElement('div');
		swatch.className = 'db-control__swatch';
		swatch.style.backgroundColor = currentValue;
		valueWrap.appendChild(swatch);
	}

	const valueText = document.createElement('span');
	valueText.className = 'db-control__value-display db-control__value-display--readonly';
	valueText.textContent = currentValue;
	valueWrap.appendChild(valueText);

	row.appendChild(valueWrap);

	return row;
}

/**
 * Creates a contrast pair group.
 */
export function createContrastPair(
	base: TokenSetting,
	contrasts: { setting: TokenSetting; value: string }[],
	baseValue: string,
	onChange: ChangeCallback,
): HTMLElement {
	const pair = document.createElement('db-contrast-pair') as DbContrastPair;
	pair.configure(base, contrasts, baseValue, onChange);
	return pair;
}

/**
 * Creates a compact swatch band for a group of color tokens.
 */
export function createSwatchBand(settings: TokenSetting[]): HTMLElement {
	const band = document.createElement('db-swatch-band') as DbSwatchBand;
	band.configure(settings);
	return band;
}
