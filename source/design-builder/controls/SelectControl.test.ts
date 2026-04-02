import './SelectControl';

describe('SelectControl', () => {
	afterEach(() => {
		document.body.innerHTML = '';
	});

	it('renders with default attributes', () => {
		const selectControl = document.createElement('select-control');
		document.body.appendChild(selectControl);

		const select = selectControl.querySelector('select') as HTMLSelectElement;

		expect(select).toBeTruthy();
		expect(select.disabled).toBe(false);
		expect(select.value).toBe('');
	});

	it('renders with custom attributes', () => {
		const selectControl = document.createElement('select-control');
		selectControl.setAttribute(
			'options',
			JSON.stringify({ option1: 'Option 1', option2: 'Option 2', option3: 'Option 3' }),
		);
		selectControl.setAttribute('value', 'option2');
		selectControl.setAttribute('locked', '');
		document.body.appendChild(selectControl);

		const select = selectControl.querySelector('select') as HTMLSelectElement;

		expect(select).toBeTruthy();
		expect(select.disabled).toBe(true);
		expect(select.value).toBe('option2');
	});

	it('dispatches change event on input', () => {
		const selectControl = document.createElement('select-control');
		selectControl.setAttribute(
			'options',
			JSON.stringify({ option1: 'Option 1', option2: 'Option 2', option3: 'Option 3' }),
		);
		document.body.appendChild(selectControl);

		const select = selectControl.querySelector('select') as HTMLSelectElement;
		const changeHandler = jest.fn();
		selectControl.addEventListener('change', changeHandler);

		select.value = 'option2';
		select.dispatchEvent(new Event('change'));

		expect(changeHandler).toHaveBeenCalledTimes(1);
		expect(changeHandler).toHaveBeenCalledWith(
			expect.objectContaining({
				detail: { value: 'option2' },
			}),
		);
	});

	it('handles empty options gracefully', () => {
		const selectControl = document.createElement('select-control');
		document.body.appendChild(selectControl);

		const select = selectControl.querySelector('select') as HTMLSelectElement;

		expect(select).toBeTruthy();
		expect(select.options.length).toBe(0);
	});

	it('handles invalid options JSON gracefully', () => {
		const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {}); // Suppress console error output for this test
		const selectControl = document.createElement('select-control');
		selectControl.setAttribute('options', 'invalid json');
		document.body.appendChild(selectControl);

		const select = selectControl.querySelector('select') as HTMLSelectElement;

		expect(select).toBeTruthy();
		expect(select.options.length).toBe(0);
		consoleErrorSpy.mockRestore(); // Restore original console.error behavior
	});
});
