import './ThemeModeSelector';

describe('db-theme-mode-selector', () => {
	beforeEach(() => {
		document.body.innerHTML = '';
	});

	it('announces a missing theme and requests creation', () => {
		const control = document.createElement('db-theme-mode-selector') as HTMLElement & {
			activeMode: 'base' | 'dark' | 'contrast';
			darkEnabled: boolean;
		};
		control.activeMode = 'dark';
		control.darkEnabled = false;
		document.body.appendChild(control);

		const enable = jest.fn();
		control.addEventListener('theme-enable', enable);

		expect(control.textContent).toContain('No dark scheme has been created');
		const createButton = Array.from(control.querySelectorAll('button')).find((button) => button.textContent === 'Create dark scheme');
		createButton?.click();

		expect(enable).toHaveBeenCalledTimes(1);
	});

	it('emits the selected editing mode and supports disabling an enabled variant', () => {
		const control = document.createElement('db-theme-mode-selector') as HTMLElement & {
			activeMode: 'base' | 'dark' | 'contrast';
			contrastEnabled: boolean;
		};
		control.activeMode = 'contrast';
		control.contrastEnabled = true;
		document.body.appendChild(control);

		const modeChange = jest.fn();
		const disable = jest.fn();
		control.addEventListener('theme-mode-change', modeChange);
		control.addEventListener('theme-disable', disable);

		expect(control.textContent).toContain('Editing Contrast');
		Array.from(control.querySelectorAll('button')).find((button) => button.textContent === 'Default')?.click();
		Array.from(control.querySelectorAll('button')).find((button) => button.textContent === 'Use Default only')?.click();

		expect(modeChange.mock.calls[0][0].detail).toEqual({ mode: 'base' });
		expect(disable).toHaveBeenCalledTimes(1);
	});
});
