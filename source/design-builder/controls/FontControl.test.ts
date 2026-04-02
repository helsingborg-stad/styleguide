import './FontControl';

describe('FontControl', () => {
	afterEach(() => {
		document.body.innerHTML = '';
	});

	it('renders input and preview with provided value', () => {
		const control = document.createElement('font-control');
		control.setAttribute('value', 'Georgia, serif');
		document.body.appendChild(control);

		const input = control.querySelector('input[type="text"]') as HTMLInputElement;
		const preview = control.querySelector('.db-control__font-preview') as HTMLElement;

		expect(input.value).toBe('Georgia, serif');
		expect(preview.style.fontFamily).toContain('Georgia');
	});

	it('dispatches change event on text input change', () => {
		const control = document.createElement('font-control');
		control.setAttribute('value', 'Arial, sans-serif');
		document.body.appendChild(control);

		const changeHandler = jest.fn();
		control.addEventListener('change', changeHandler);

		const input = control.querySelector('input[type="text"]') as HTMLInputElement;
		input.value = 'Times New Roman, serif';
		input.dispatchEvent(new Event('change'));

		expect(changeHandler).toHaveBeenCalledWith(
			expect.objectContaining({
				detail: { value: 'Times New Roman, serif' },
			}),
		);
	});
});
