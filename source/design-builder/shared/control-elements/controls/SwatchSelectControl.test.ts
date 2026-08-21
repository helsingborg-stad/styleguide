import './SwatchSelectControl';

describe('SwatchSelectControl', () => {
	afterEach(() => {
		document.body.innerHTML = '';
	});

	it('dispatches the selected token value and linked values', () => {
		const control = document.createElement('swatch-select-control');
		control.setAttribute(
			'options',
			JSON.stringify([
				{
					value: 'var(--color--primary)',
					label: 'Primary',
					swatch: 'var(--color--primary)',
					contrastSwatch: 'var(--color--primary-contrast)',
				},
				{
					value: 'var(--color--secondary)',
					label: 'Secondary',
					swatch: 'var(--color--secondary)',
					contrastSwatch: 'var(--color--secondary-contrast)',
					extraValues: {
						'--c-card--color--primary-contrast': 'var(--color--secondary-contrast)',
					},
				},
			]),
		);
		control.setAttribute('value', 'var(--color--primary)');
		document.body.appendChild(control);

		const changeHandler = jest.fn();
		control.addEventListener('change', changeHandler);

		const options = control.querySelectorAll<HTMLButtonElement>('.db-swatch-select-option');
		expect(options.length).toBe(2);
		expect(control.querySelector('.db-swatch-select-option[aria-selected="true"]')).toBe(options[0]);
		expect(control.querySelector('.db-swatch-select-chip-contrast')?.textContent).toBe('text_fields');
		options[1].click();

		expect(changeHandler).toHaveBeenCalledTimes(1);
		expect(control.getAttribute('value')).toBe('var(--color--secondary)');
		expect(control.querySelector('.db-swatch-select-option[aria-selected="true"]')).toBe(control.querySelectorAll<HTMLButtonElement>('.db-swatch-select-option')[1]);
		expect(changeHandler).toHaveBeenCalledWith(
			expect.objectContaining({
				detail: {
					value: 'var(--color--secondary)',
					extraValues: {
						'--c-card--color--primary-contrast': 'var(--color--secondary-contrast)',
					},
					options: {
						preserveMatchingDefault: true,
					},
				},
			}),
		);
	});
});
