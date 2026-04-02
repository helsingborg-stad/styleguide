import './controls/RangeControl';
import './controls/SelectControl';
import { createControl, type TokenSetting } from './controls';

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
});
