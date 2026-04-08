import './RangeControl';

describe('RangeControl', () => {
	afterEach(() => {
		document.body.innerHTML = '';
	});

	it('renders with default attributes', () => {
		const rangeControl = document.createElement('range-control');
		document.body.appendChild(rangeControl);

		const input = rangeControl.querySelector('input[type="range"]') as HTMLInputElement;
		const output = rangeControl.querySelector('output') as HTMLOutputElement;

		expect(input).toBeTruthy();
		expect(input.min).toBe('0');
		expect(input.max).toBe('100');
		expect(input.step).toBe('1');
		expect(input.value).toBe('50');
		expect(output).toBeTruthy();
		expect(output.textContent).toBe(' ');
	});

	it('renders with custom attributes', () => {
		const rangeControl = document.createElement('range-control');
		rangeControl.setAttribute('min', '10');
		rangeControl.setAttribute('max', '200');
		rangeControl.setAttribute('step', '5');
		rangeControl.setAttribute('value', '60');
		rangeControl.setAttribute('unit', 'px');
		document.body.appendChild(rangeControl);

		const input = rangeControl.querySelector('input[type="range"]') as HTMLInputElement;
		const output = rangeControl.querySelector('output') as HTMLOutputElement;

		expect(input).toBeTruthy();
		expect(input.min).toBe('10');
		expect(input.max).toBe('200');
		expect(input.step).toBe('5');
		expect(input.value).toBe('60');
		expect(output).toBeTruthy();
		expect(output.textContent).toBe('60 px');
	});

	it('dispatches change event on input', () => {
		const rangeControl = document.createElement('range-control');
		document.body.appendChild(rangeControl);

		const input = rangeControl.querySelector('input[type="range"]') as HTMLInputElement;
		const changeHandler = jest.fn();
		rangeControl.addEventListener('change', changeHandler);

		input.value = '70';
		input.dispatchEvent(new Event('input'));

		expect(changeHandler).toHaveBeenCalledTimes(1);
		expect(changeHandler).toHaveBeenCalledWith(
			expect.objectContaining({
				detail: { value: '70' },
			}),
		);
	});

	it('keeps slider state in sync when value updates after connect', () => {
		const rangeControl = document.createElement('range-control');
		document.body.appendChild(rangeControl);

		rangeControl.setAttribute('value', '20');

		const input = rangeControl.querySelector('input[type="range"]') as HTMLInputElement;
		const output = rangeControl.querySelector('output') as HTMLOutputElement;

		expect(output.textContent).toBe('20 ');
		expect(input.value).toBe('20');
	});

	it('updates slider constraints when min max and step change after connect', () => {
		const rangeControl = document.createElement('range-control');
		rangeControl.setAttribute('value', '60');
		document.body.appendChild(rangeControl);

		rangeControl.setAttribute('min', '10');
		rangeControl.setAttribute('max', '200');
		rangeControl.setAttribute('step', '5');

		const input = rangeControl.querySelector('input[type="range"]') as HTMLInputElement;

		expect(input.min).toBe('10');
		expect(input.max).toBe('200');
		expect(input.step).toBe('5');
		expect(input.value).toBe('60');
	});

	it('keeps value synced when value arrives before min and max', () => {
		const rangeControl = document.createElement('range-control');
		document.body.appendChild(rangeControl);

		rangeControl.setAttribute('value', '160');
		rangeControl.setAttribute('min', '112');
		rangeControl.setAttribute('max', '206');
		rangeControl.setAttribute('step', '2');

		const input = rangeControl.querySelector('input[type="range"]') as HTMLInputElement;

		expect(input.min).toBe('112');
		expect(input.max).toBe('206');
		expect(input.step).toBe('2');
		expect(input.value).toBe('160');
	});
});
