jest.mock('../../controls', () => ({
	createControl: () => document.createElement('div'),
}));

import { ComponentCustomizationRuntime } from './ComponentCustomizationRuntime';
import type { ComponentTokenData, TokenData } from '../../types/runtime';

describe('ComponentCustomizationRuntime pick mode', () => {
	const componentData: ComponentTokenData = {
		button: {
			name: 'Button',
			tokens: ['color--primary'],
		},
	};

	const tokenLibrary: TokenData = {
		name: 'Tokens',
		version: '1.0.0',
		categories: [
			{
				id: 'colors',
				label: 'Colors',
				settings: [
					{
						variable: '--color--primary',
						label: 'Primary',
						type: 'color',
						default: '#000000',
					},
				],
			},
		],
	};

	beforeEach(() => {
		document.body.innerHTML = `
			<div data-component="button">
				<a href="/test">Button</a>
			</div>
		`;
		localStorage.clear();
	});

	afterEach(() => {
		document.body.innerHTML = '';
		localStorage.clear();
	});

	it('keeps page target picking disabled until manually activated', () => {
		const mount = document.createElement('div');
		document.body.appendChild(mount);

		new ComponentCustomizationRuntime(componentData, tokenLibrary, mount);

		const target = document.querySelector<HTMLElement>('[data-component="button"]');
		const toggleButton = mount.querySelector<HTMLButtonElement>('[data-action="toggle-target-selection"]');
		const toggleLabel = () =>
			mount.querySelector<HTMLElement>('[data-role="toggle-target-selection-label"]')?.textContent?.trim();

		expect(target?.classList.contains('db-component-target')).toBe(false);
		expect(toggleLabel()).toBe('Pick on page');

		toggleButton?.click();
		expect(target?.classList.contains('db-component-target')).toBe(true);
		expect(toggleLabel()).toBe('Stop picking');

		target?.click();
		expect(target?.classList.contains('db-component-target')).toBe(false);
		expect(toggleLabel()).toBe('Pick on page');
	});
});
