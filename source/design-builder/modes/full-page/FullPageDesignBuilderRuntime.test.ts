jest.mock('../../controls', () => ({
	createContrastPair: () => document.createElement('div'),
	createControl: () => document.createElement('div'),
	createReadOnlyControl: () => document.createElement('div'),
	createSwatchBand: () => document.createElement('div'),
}));

import { FullPageDesignBuilderRuntime } from './FullPageDesignBuilderRuntime';
import type { TokenData } from '../../types/runtime';
import { STORAGE_KEY } from '../../storage';

class FakeStorage {
	public data: Record<string, string> = {};

	load(): Record<string, string> {
		return { ...this.data };
	}

	save(overrides: Record<string, string>): void {
		this.data = { ...overrides };
		if (Object.keys(this.data).length === 0) {
			localStorage.removeItem(STORAGE_KEY);
			return;
		}
		localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
	}

	clear(): void {
		this.data = {};
		localStorage.removeItem(STORAGE_KEY);
	}
}

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
		const storage = new FakeStorage();
		new FullPageDesignBuilderRuntime(container, tokenData, storage);

		const presetButton = Array.from(container.querySelectorAll<HTMLButtonElement>('.db-presets__chip')).find(
			(button) => button.querySelector('.db-presets__chip-label')?.textContent === 'myPreset',
		);

		expect(presetButton).toBeTruthy();
		presetButton?.click();

		expect(document.documentElement.style.getPropertyValue('--color-free')).toBe('#123456');
		expect(document.documentElement.style.getPropertyValue('--color-locked')).toBe('');

		const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
		expect(saved).toEqual({
			'--color-free': '#123456',
		});

		container.remove();
	});
});
