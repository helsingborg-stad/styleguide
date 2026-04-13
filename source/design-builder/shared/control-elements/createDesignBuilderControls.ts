/**
 * Control render adapters for design-builder settings.
 */

import './controls/layout/ControlRow';
import './controls/layout/ReadOnlyControlRow';
import './controls/layout/Category';
import './controls/layout/SwatchBand';
import type { TokenCategory } from '../types/designBuilderDataTypes';
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

type SwatchBandElement = HTMLElement & {
	settings: TokenSetting[];
};

type CategoryElement = HTMLElement & {
	category: Pick<TokenCategory, 'id' | 'label' | 'description'>;
	items: HTMLElement[];
	collapsible: boolean;
};

export function createDesignBuilderControl(setting: TokenSetting, currentValue: string, onChange: ChangeCallback): HTMLElement {
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

export function createReadOnlyDesignBuilderControl(setting: TokenSetting, currentValue: string): HTMLElement {
	const row = document.createElement('db-readonly-control-row') as ReadOnlyControlRowElement;
	row.setting = setting;
	row.value = currentValue;
	return row;
}

export function createDesignBuilderSwatchBand(settings: TokenSetting[]): HTMLElement {
	const band = document.createElement('db-swatch-band') as SwatchBandElement;
	band.settings = settings;
	return band;
}

export function createDesignBuilderCategory(category: TokenCategory, items: HTMLElement[], collapsible = false): HTMLElement {
	const categoryElement = document.createElement('db-category') as CategoryElement;
	categoryElement.category = {
		id: category.id,
		label: category.label,
		description: category.description,
	};
	categoryElement.items = items;
	categoryElement.collapsible = collapsible;
	return categoryElement;
}
