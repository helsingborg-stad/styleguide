import './ColorControl';

describe('ColorControl', () => {
	afterEach(() => {
		document.body.innerHTML = '';
	});

	it('renders with provided value and placeholder', () => {
		const control = document.createElement('color-control');
		control.setAttribute('value', '#112233');
		control.setAttribute('placeholder', '#000000');
		document.body.appendChild(control);

		const colorInput = control.querySelector('input[type="color"]') as HTMLInputElement;
		const textInput = control.querySelector('input[type="text"]') as HTMLInputElement;

		expect(colorInput.value).toBe('#112233');
		expect(textInput.value).toBe('#112233');
		expect(textInput.placeholder).toBe('#000000');
	});

	it('dispatches change event with value from color input', () => {
		const control = document.createElement('color-control');
		control.setAttribute('value', '#000000');
		document.body.appendChild(control);

		const changeHandler = jest.fn();
		control.addEventListener('change', changeHandler);

		const colorInput = control.querySelector('input[type="color"]') as HTMLInputElement;
		colorInput.value = '#ffffff';
		colorInput.dispatchEvent(new Event('input'));

		expect(changeHandler).toHaveBeenCalledWith(
			expect.objectContaining({
				detail: { value: '#ffffff' },
			}),
		);
	});
});
