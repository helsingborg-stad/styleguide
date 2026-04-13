import './controls/RangeControl';
import './controls/SelectControl';
import './controls/ColorControl';
import './controls/RgbaControl';
import './controls/FontControl';
import { createDesignBuilderControl, createDesignBuilderSwatchBand, createReadOnlyDesignBuilderControl, type TokenSetting } from './createDesignBuilderControls';

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

		const row = createDesignBuilderControl(setting, '16px', onChange);
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

		const row = createDesignBuilderControl(setting, '8', onChange);
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

	it('emits range control values with unit suffix when defined', () => {
		const setting: TokenSetting = {
			variable: '--color--border-mix-amount',
			label: 'Border mix amount',
			type: 'range',
			default: '10%',
			min: 0,
			max: 100,
			step: 1,
			unit: '%',
		};
		const onChange = jest.fn();

		const row = createDesignBuilderControl(setting, '10%', onChange);
		document.body.appendChild(row);

		const input = row.querySelector('range-control input[type="range"]') as HTMLInputElement;
		expect(input).toBeTruthy();

		input.value = '12';
		expect(() => {
			input.dispatchEvent(new Event('input', { bubbles: true }));
			input.dispatchEvent(new Event('change', { bubbles: true }));
		}).not.toThrow();

		expect(onChange).toHaveBeenCalledTimes(1);
		expect(onChange).toHaveBeenCalledWith('--color--border-mix-amount', '12%');
	});

	it('ignores native bubbling events for color controls and uses custom event detail value', () => {
		const setting: TokenSetting = {
			variable: '--color-primary',
			label: 'Primary color',
			type: 'color',
			default: '#ff0000',
		};
		const onChange = jest.fn();

		const row = createDesignBuilderControl(setting, '#ff0000', onChange);
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

		const row = createDesignBuilderControl(setting, 'rgba(0, 0, 0, 0.5)', onChange);
		document.body.appendChild(row);

		const alphaInput = row.querySelector('rgba-control input.db-control-alpha') as HTMLInputElement;
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

		const row = createDesignBuilderControl(setting, 'Arial, sans-serif', onChange);
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
			description: 'Cannot be changed',
			type: 'color',
			default: '#112233',
			locked: true,
		};

		const row = createReadOnlyDesignBuilderControl(setting, '#112233');
		document.body.appendChild(row);

		expect(row.hasAttribute('readonly')).toBe(true);
		expect(row.hasAttribute('locked')).toBe(true);
		expect(row.querySelector('.db-control-row-label')?.textContent).toBe('Fixed color');
		expect(row.querySelector('.db-control-value-readonly')?.textContent).toBe('#112233');
		expect(row.querySelector('[data-tip-variable]')?.getAttribute('data-tip-variable')).toBe('--color-fixed');
		expect(row.querySelector('[data-tip-description]')?.getAttribute('data-tip-description')).toBe('Cannot be changed');
	});

	it('renders editable rows with hover tip data attributes', () => {
		const setting: TokenSetting = {
			variable: '--font-size-body',
			label: 'Body size',
			description: 'Controls body text size',
			type: 'select',
			default: '16px',
			options: [
				{ value: '16px', label: '16px' },
				{ value: '18px', label: '18px' },
			],
		};

		const row = createDesignBuilderControl(setting, '16px', jest.fn());
		document.body.appendChild(row);

		expect(row.querySelector('[data-tip-variable]')?.getAttribute('data-tip-variable')).toBe('--font-size-body');
		expect(row.querySelector('[data-tip-description]')?.getAttribute('data-tip-description')).toBe('Controls body text size');
	});

	it('shows an inline info panel when the info button is clicked and hides it on outside click', () => {
		const setting: TokenSetting = {
			variable: '--font-size-body',
			label: 'Body size',
			description: 'Controls body text size',
			type: 'select',
			default: '16px',
			options: [
				{ value: '16px', label: '16px' },
				{ value: '18px', label: '18px' },
			],
		};

		const row = createDesignBuilderControl(setting, '16px', jest.fn());
		document.body.appendChild(row);

		const infoButton = row.querySelector<HTMLButtonElement>('.db-control-info-btn');
		expect(infoButton).toBeTruthy();

		infoButton?.click();

		const infoPanel = row.querySelector<HTMLElement>('.db-control-row-info');
		expect(infoButton?.getAttribute('aria-expanded')).toBe('true');
		expect(row.hasAttribute('info-open')).toBe(true);
		expect(infoPanel?.textContent).toContain('Controls body text size');
		expect(infoPanel?.textContent).toContain('--font-size-body');

		document.body.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true }));

		expect(row.querySelector('.db-control-row-info')).toBeNull();
		expect(infoButton?.getAttribute('aria-expanded')).toBe('false');
		expect(row.hasAttribute('info-open')).toBe(false);
	});

	it('groups swatch band rows by color prefix', () => {
		const band = createDesignBuilderSwatchBand([
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

		const rows = band.querySelectorAll('.db-swatch-band-row');
		expect(rows.length).toBe(2);
		expect(rows[0].querySelector('.db-swatch-band-var')?.textContent).toContain('--color--black-[%]');
		expect(rows[1].querySelector('.db-swatch-band-var')?.textContent).toContain('--color--white-[%]');
	});
});
