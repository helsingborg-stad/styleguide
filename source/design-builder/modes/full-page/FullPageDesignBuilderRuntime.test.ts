jest.mock('../../controls', () => ({
	createControl: () => document.createElement('div'),
	createReadOnlyControl: () => document.createElement('div'),
	createSwatchBand: () => document.createElement('div'),
}));

import { FullPageDesignBuilderRuntime } from './FullPageDesignBuilderRuntime';
import { normalizeDesignBuilderOverrideState } from '../../services/overrideState';
import type { TokenData } from '../../types/runtime';

describe('FullPageDesignBuilderRuntime preset compatibility', () => {
	const tokenData: TokenData = {
		name: 'Test Tokens',
		version: '1.0.0',
		categories: [
			{
				id: 'colors',
				label: 'Colors',
				description: '',
				settings: [
					{
						variable: '--color-free',
						label: 'Free',
						description: '',
						type: 'color',
						default: '#000',
					},
					{
						variable: '--color-locked',
						label: 'Locked',
						description: '',
						type: 'color',
						default: '#fff',
						locked: true,
					},
				],
			},
		],
	};

	beforeEach(() => {
		document.documentElement.style.removeProperty('--color-free');
		document.documentElement.style.removeProperty('--color-locked');
		localStorage.clear();
	});

	it('filters locked variables when loading a preset', () => {
		const container = document.createElement('div');
		document.body.appendChild(container);
		localStorage.setItem(
			'design-tokens-presets',
			JSON.stringify({
				myPreset: {
					'--color-free': '#123456',
					'--color-locked': '#654321',
				},
			}),
		);
		const hostElement = document.createElement('design-builder') as HTMLElement & {
			overrideState: ReturnType<typeof normalizeDesignBuilderOverrideState>;
		};
		hostElement.overrideState = normalizeDesignBuilderOverrideState({});
		document.body.appendChild(hostElement);
		new FullPageDesignBuilderRuntime(container, tokenData, hostElement as any);

		const presetButton = Array.from(container.querySelectorAll<HTMLButtonElement>('.db-presets-chip')).find(
			(button) => button.querySelector('.db-presets-chip-label')?.textContent === 'myPreset',
		);

		expect(presetButton).toBeTruthy();
		presetButton?.click();

		expect(document.documentElement.style.getPropertyValue('--color-free')).toBe('#123456');
		expect(document.documentElement.style.getPropertyValue('--color-locked')).toBe('');

		expect(hostElement.overrideState).toEqual({
			token: {
				'--color-free': '#123456',
			},
			component: {},
		});

		hostElement.remove();
		container.remove();
	});
});
