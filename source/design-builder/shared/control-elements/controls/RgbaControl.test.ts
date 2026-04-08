import './RgbaControl';

describe('RgbaControl', () => {
	afterEach(() => {
		document.body.innerHTML = '';
	});

	it('renders with provided rgba value', () => {
		const control = document.createElement('rgba-control');
		control.setAttribute('value', 'rgba(10, 20, 30, 0.4)');
		document.body.appendChild(control);

		const textInput = control.querySelector('input[type="text"]') as HTMLInputElement;
		const alphaInput = control.querySelector('input.db-control-alpha') as HTMLInputElement;
		const alphaDisplay = control.querySelector('.db-control-alpha-display') as HTMLElement;

		expect(textInput.value).toBe('rgba(10, 20, 30, 0.4)');
		expect(alphaInput.value).toBe('0.4');
		expect(alphaDisplay.textContent).toBe('0.4');
	});

	it('dispatches change event when alpha changes', () => {
		const control = document.createElement('rgba-control');
		control.setAttribute('value', 'rgba(0, 0, 0, 0.5)');
		document.body.appendChild(control);

		const changeHandler = jest.fn();
		control.addEventListener('change', changeHandler);

		const alphaInput = control.querySelector('input.db-control-alpha') as HTMLInputElement;
		alphaInput.value = '0.8';
		alphaInput.dispatchEvent(new Event('input'));

		expect(changeHandler).toHaveBeenCalledWith(
			expect.objectContaining({
				detail: { value: 'rgba(0, 0, 0, 0.8)' },
			}),
		);
	});
});
