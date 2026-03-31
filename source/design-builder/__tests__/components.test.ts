import type { TokenSetting, ChangeCallback } from '../core/types';

// Import components to register custom elements
import '../core/components/db-control';
import '../core/components/db-color-control';
import '../core/components/db-rgba-control';
import '../core/components/db-range-control';
import '../core/components/db-select-control';
import '../core/components/db-font-control';
import '../core/components/db-contrast-pair';
import '../core/components/db-swatch-band';

import { DbControl } from '../core/components/db-control';
import { DbColorControl } from '../core/components/db-color-control';
import { DbRgbaControl } from '../core/components/db-rgba-control';
import { DbRangeControl } from '../core/components/db-range-control';
import { DbSelectControl } from '../core/components/db-select-control';
import { DbFontControl } from '../core/components/db-font-control';
import { DbContrastPair } from '../core/components/db-contrast-pair';
import { DbSwatchBand } from '../core/components/db-swatch-band';

function makeSetting(overrides: Partial<TokenSetting> = {}): TokenSetting {
	return {
		variable: '--color--primary',
		label: 'Primary Color',
		type: 'color',
		default: '#0000ff',
		...overrides,
	};
}

describe('DbColorControl', () => {
	it('renders color input, swatch, and text input', () => {
		const el = document.createElement('db-color-control') as DbColorControl;
		document.body.appendChild(el);
		const onChange = jest.fn();
		el.configure(makeSetting(), '#ff0000', onChange);

		expect(el.querySelector('input[type="color"]')).not.toBeNull();
		expect(el.querySelector('.db-control__swatch')).not.toBeNull();
		expect(el.querySelector('input[type="text"]')).not.toBeNull();
		document.body.removeChild(el);
	});

	it('setValue updates inputs', () => {
		const el = document.createElement('db-color-control') as DbColorControl;
		document.body.appendChild(el);
		el.configure(makeSetting(), '#ff0000', jest.fn());
		el.setValue('#00ff00');

		const textInput = el.querySelector<HTMLInputElement>('input[type="text"]');
		expect(textInput?.value).toBe('#00ff00');
		document.body.removeChild(el);
	});

	it('disables inputs when locked', () => {
		const el = document.createElement('db-color-control') as DbColorControl;
		document.body.appendChild(el);
		el.configure(makeSetting({ locked: true }), '#ff0000', jest.fn());

		const colorInput = el.querySelector<HTMLInputElement>('input[type="color"]');
		const textInput = el.querySelector<HTMLInputElement>('input[type="text"]');
		expect(colorInput?.disabled).toBe(true);
		expect(textInput?.disabled).toBe(true);
		expect(el.querySelector('.db-control__swatch--clickable')).toBeNull();
		document.body.removeChild(el);
	});
});

describe('DbRangeControl', () => {
	it('renders range input with min/max/step', () => {
		const el = document.createElement('db-range-control') as DbRangeControl;
		document.body.appendChild(el);
		el.configure(makeSetting({ type: 'range', min: 0, max: 100, step: 1, unit: 'px' }), '16px', jest.fn());

		const input = el.querySelector<HTMLInputElement>('input[type="range"]');
		expect(input).not.toBeNull();
		expect(input?.min).toBe('0');
		expect(input?.max).toBe('100');
		expect(input?.step).toBe('1');
		document.body.removeChild(el);
	});

	it('setValue updates range and display', () => {
		const el = document.createElement('db-range-control') as DbRangeControl;
		document.body.appendChild(el);
		el.configure(makeSetting({ type: 'range', min: 0, max: 100 }), '50', jest.fn());
		el.setValue('75');

		const display = el.querySelector<HTMLElement>('.db-control__value-display');
		expect(display?.textContent).toBe('75');
		document.body.removeChild(el);
	});
});

describe('DbSelectControl', () => {
	const options = [
		{ value: 'a', label: 'Option A' },
		{ value: 'b', label: 'Option B' },
	];

	it('renders select with options', () => {
		const el = document.createElement('db-select-control') as DbSelectControl;
		document.body.appendChild(el);
		el.configure(makeSetting({ type: 'select', options }), 'b', jest.fn());

		const select = el.querySelector<HTMLSelectElement>('select');
		expect(select).not.toBeNull();
		expect(select?.options.length).toBe(2);
		expect(select?.value).toBe('b');
		document.body.removeChild(el);
	});

	it('setValue updates select', () => {
		const el = document.createElement('db-select-control') as DbSelectControl;
		document.body.appendChild(el);
		el.configure(makeSetting({ type: 'select', options }), 'a', jest.fn());
		el.setValue('b');

		const select = el.querySelector<HTMLSelectElement>('select');
		expect(select?.value).toBe('b');
		document.body.removeChild(el);
	});
});

describe('DbFontControl', () => {
	it('renders text input and preview', () => {
		const el = document.createElement('db-font-control') as DbFontControl;
		document.body.appendChild(el);
		el.configure(makeSetting({ type: 'font' }), 'Arial', jest.fn());

		const input = el.querySelector<HTMLInputElement>('input[type="text"]');
		expect(input?.value).toBe('Arial');
		expect(el.querySelector('.db-control__font-preview')).not.toBeNull();
		document.body.removeChild(el);
	});
});

describe('DbControl (wrapper)', () => {
	it('renders label, variable, input, and reset button', () => {
		const el = document.createElement('db-control') as DbControl;
		document.body.appendChild(el);
		el.configure(makeSetting(), '#ff0000', jest.fn());

		expect(el.querySelector('.db-control__label')?.textContent).toBe('Primary Color');
		expect(el.querySelector('.db-control__variable')?.textContent).toBe('--color--primary');
		expect(el.querySelector('db-color-control')).not.toBeNull();
		expect(el.querySelector('.db-control__reset')).not.toBeNull();
		document.body.removeChild(el);
	});

	it('does not render reset button when locked', () => {
		const el = document.createElement('db-control') as DbControl;
		document.body.appendChild(el);
		el.configure(makeSetting({ locked: true }), '#ff0000', jest.fn());

		expect(el.querySelector('.db-control__reset')).toBeNull();
		expect(el.classList.contains('db-control--locked')).toBe(true);
		document.body.removeChild(el);
	});

	it('reset button triggers onChange with empty value', () => {
		const onChange = jest.fn();
		const el = document.createElement('db-control') as DbControl;
		document.body.appendChild(el);
		el.configure(makeSetting(), '#ff0000', onChange);

		const resetBtn = el.querySelector<HTMLButtonElement>('.db-control__reset');
		resetBtn?.click();
		expect(onChange).toHaveBeenCalledWith('--color--primary', '');
		document.body.removeChild(el);
	});

	it('renders description when provided', () => {
		const el = document.createElement('db-control') as DbControl;
		document.body.appendChild(el);
		el.configure(makeSetting({ description: 'Test description' }), '#ff0000', jest.fn());

		expect(el.querySelector('.db-control__description')?.textContent).toBe('Test description');
		document.body.removeChild(el);
	});
});

describe('DbContrastPair', () => {
	it('renders base and contrast columns with preview', () => {
		const el = document.createElement('db-contrast-pair') as DbContrastPair;
		document.body.appendChild(el);
		el.configure(
			makeSetting({ variable: '--color--bg', label: 'Background' }),
			[{ setting: makeSetting({ variable: '--color--text', label: 'Text' }), value: '#000000' }],
			'#ffffff',
			jest.fn(),
		);

		expect(el.querySelectorAll('.db-pair__cell').length).toBe(2);
		expect(el.querySelector('.db-pair__preview')).not.toBeNull();
		document.body.removeChild(el);
	});
});

describe('DbSwatchBand', () => {
	it('renders grouped swatches', () => {
		const el = document.createElement('db-swatch-band') as DbSwatchBand;
		document.body.appendChild(el);
		el.configure([
			makeSetting({ variable: '--color--black-10', default: '#e5e5e5' }),
			makeSetting({ variable: '--color--black-20', default: '#cccccc' }),
			makeSetting({ variable: '--color--white-10', default: '#f5f5f5' }),
		]);

		expect(el.querySelectorAll('.db-swatch-band__row').length).toBe(2);
		expect(el.querySelectorAll('.db-swatch-band__swatch').length).toBe(3);
		document.body.removeChild(el);
	});
});
