import './controls/RangeControl';
import './controls/SelectControl';
import './controls/ColorControl';
import './controls/RgbaControl';
import './controls/FontControl';
import { createContrastPair, createControl, createReadOnlyControl, createSwatchBand, type TokenSetting } from './controls';

describe('controls change handling', () => {
	afterEach(() => {
		document.body.innerHTML = '';
	});

	it('ignores native bubbling change event for select and uses custom event detail value', () => {
		const setting: TokenSetting = {
			variable: '--font-size-body',
			label: 'Body size',
			type: 'select',
			default: '16px',
			options: [
				{ value: '16px', label: '16px' },
				{ value: '18px', label: '18px' },
			],
		};
		const onChange = jest.fn();

		const row = createControl(setting, '16px', onChange);
		document.body.appendChild(row);

		const select = row.querySelector('select-control select') as HTMLSelectElement;
		expect(select).toBeTruthy();

		select.value = '18px';
		expect(() => {
			select.dispatchEvent(new Event('change', { bubbles: true }));
		}).not.toThrow();

		expect(onChange).toHaveBeenCalledTimes(1);
		expect(onChange).toHaveBeenCalledWith('--font-size-body', '18px');
	});

	it('ignores native bubbling change event for range controls', () => {
		const setting: TokenSetting = {
			variable: '--space-medium',
			label: 'Space medium',
			type: 'range',
			default: '8',
			min: 0,
			max: 16,
			step: 1,
		};
		const onChange = jest.fn();

		const row = createControl(setting, '8', onChange);
		document.body.appendChild(row);

		const input = row.querySelector('range-control input[type="range"]') as HTMLInputElement;
		expect(input).toBeTruthy();

		input.value = '12';
		expect(() => {
			input.dispatchEvent(new Event('input', { bubbles: true }));
			input.dispatchEvent(new Event('change', { bubbles: true }));
		}).not.toThrow();

		expect(onChange).toHaveBeenCalledTimes(1);
		expect(onChange).toHaveBeenCalledWith('--space-medium', '12');
	});

	it('ignores native bubbling events for color controls and uses custom event detail value', () => {
		const setting: TokenSetting = {
			variable: '--color-primary',
			label: 'Primary color',
			type: 'color',
			default: '#ff0000',
		};
		const onChange = jest.fn();

		const row = createControl(setting, '#ff0000', onChange);
		document.body.appendChild(row);

		const textInput = row.querySelector('color-control input[type="text"]') as HTMLInputElement;
		expect(textInput).toBeTruthy();

		textInput.value = '#00ff00';
		expect(() => {
			textInput.dispatchEvent(new Event('change', { bubbles: true }));
		}).not.toThrow();

		expect(onChange).toHaveBeenCalledTimes(1);
		expect(onChange).toHaveBeenCalledWith('--color-primary', '#00ff00');
	});

	it('ignores native bubbling events for rgba controls and uses custom event detail value', () => {
		const setting: TokenSetting = {
			variable: '--overlay',
			label: 'Overlay',
			type: 'rgba',
			default: 'rgba(0, 0, 0, 0.5)',
		};
		const onChange = jest.fn();

		const row = createControl(setting, 'rgba(0, 0, 0, 0.5)', onChange);
		document.body.appendChild(row);

		const alphaInput = row.querySelector('rgba-control input.db-control__alpha') as HTMLInputElement;
		expect(alphaInput).toBeTruthy();

		alphaInput.value = '0.7';
		expect(() => {
			alphaInput.dispatchEvent(new Event('input', { bubbles: true }));
			alphaInput.dispatchEvent(new Event('change', { bubbles: true }));
		}).not.toThrow();

		expect(onChange).toHaveBeenCalledTimes(1);
		expect(onChange).toHaveBeenCalledWith('--overlay', 'rgba(0, 0, 0, 0.7)');
	});

	it('ignores native bubbling events for font controls and uses custom event detail value', () => {
		const setting: TokenSetting = {
			variable: '--font-family-body',
			label: 'Body font',
			type: 'font',
			default: 'Arial, sans-serif',
		};
		const onChange = jest.fn();

		const row = createControl(setting, 'Arial, sans-serif', onChange);
		document.body.appendChild(row);

		const input = row.querySelector('font-control input[type="text"]') as HTMLInputElement;
		expect(input).toBeTruthy();

		input.value = 'Georgia, serif';
		expect(() => {
			input.dispatchEvent(new Event('change', { bubbles: true }));
		}).not.toThrow();

		expect(onChange).toHaveBeenCalledTimes(1);
		expect(onChange).toHaveBeenCalledWith('--font-family-body', 'Georgia, serif');
	});

	it('renders read-only control row with locked and readonly host attributes', () => {
		const setting: TokenSetting = {
			variable: '--color-fixed',
			label: 'Fixed color',
			type: 'color',
			default: '#112233',
			locked: true,
		};

		const row = createReadOnlyControl(setting, '#112233');
		document.body.appendChild(row);

		expect(row.hasAttribute('readonly')).toBe(true);
		expect(row.hasAttribute('locked')).toBe(true);
		expect(row.querySelector('.db-control-row__label')?.textContent).toBe('Fixed color');
		expect(row.querySelector('.db-control__value-display--readonly')?.textContent).toBe('#112233');
	});

	it('updates contrast preview and bubbles contrast-change via callback', () => {
		const base: TokenSetting = {
			variable: '--color-primary',
			label: 'Primary',
			type: 'color',
			default: '#000000',
		};
		const contrastSetting: TokenSetting = {
			variable: '--color-on-primary',
			label: 'On Primary',
			type: 'color',
			default: '#ffffff',
		};

		const onChange = jest.fn();
		const pair = createContrastPair(base, [{ setting: contrastSetting, value: '#ffffff' }], '#000000', onChange);
		document.body.appendChild(pair);

		const controls = pair.querySelectorAll('color-control');
		expect(controls.length).toBe(2);

		controls[0].dispatchEvent(
			new CustomEvent('change', {
				detail: { value: '#123456' },
				bubbles: true,
				composed: true,
			}),
		);

		const preview = pair.querySelector('.db-contrast-pair__preview') as HTMLElement;
		expect(preview.style.backgroundColor).toBe('rgb(18, 52, 86)');
		expect(onChange).toHaveBeenCalledWith('--color-primary', '#123456');
	});

	it('groups swatch band rows by color prefix', () => {
		const band = createSwatchBand([
			{
				variable: '--color--black-10',
				label: 'Black 10',
				type: 'color',
				default: '#111111',
			},
			{
				variable: '--color--black-20',
				label: 'Black 20',
				type: 'color',
				default: '#222222',
			},
			{
				variable: '--color--white-10',
				label: 'White 10',
				type: 'color',
				default: '#f8f8f8',
			},
		]);
		document.body.appendChild(band);

		const rows = band.querySelectorAll('.db-swatch-band__row');
		expect(rows.length).toBe(2);
		expect(rows[0].querySelector('.db-swatch-band__var')?.textContent).toContain('--color--black-[%]');
		expect(rows[1].querySelector('.db-swatch-band__var')?.textContent).toContain('--color--white-[%]');
	});
});
