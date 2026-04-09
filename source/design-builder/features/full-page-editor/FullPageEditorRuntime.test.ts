jest.mock('../../shared/control-elements/createDesignBuilderControls', () => ({
	createDesignBuilderControl: () => document.createElement('div'),
	createReadOnlyDesignBuilderControl: () => document.createElement('div'),
	createDesignBuilderSwatchBand: () => document.createElement('div'),
}));

import { FullPageEditorRuntime } from './FullPageEditorRuntime';
import { GENERAL_SCOPE_KEY } from '../../shared/constants/designBuilderRuntimeConstants';
import { normalizeDesignBuilderOverrideState } from '../../shared/state/designBuilderOverrideState';
import type { TokenData } from '../../shared/types/designBuilderDataTypes';
import type { DesignBuilderActionEventDetail } from '../../shared/events/designBuilderActionEvents';

describe('FullPageEditorRuntime preset compatibility', () => {
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
		document.body.innerHTML = '';
		document.documentElement.style.removeProperty('--color-free');
		document.documentElement.style.removeProperty('--color-locked');
		document.documentElement.style.removeProperty('--c-button--color--primary');
		localStorage.clear();
	});

	afterEach(() => {
		document.body.innerHTML = '';
		document.documentElement.style.removeProperty('--color-free');
		document.documentElement.style.removeProperty('--color-locked');
		document.documentElement.style.removeProperty('--c-button--color--primary');
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
		new FullPageEditorRuntime(container, tokenData, hostElement as any);

		const presetButton = Array.from(container.querySelectorAll<HTMLButtonElement>('.db-presets-chip')).find((button) => button.querySelector('.db-presets-chip-label')?.textContent === 'myPreset');

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

	it('emits action events for token changes, resets, and saves', () => {
		const container = document.createElement('div');
		document.body.appendChild(container);
		const hostElement = document.createElement('design-builder') as HTMLElement & {
			overrideState: ReturnType<typeof normalizeDesignBuilderOverrideState>;
		};
		hostElement.overrideState = normalizeDesignBuilderOverrideState({});
		document.body.appendChild(hostElement);

		const actionEvents: DesignBuilderActionEventDetail[] = [];
		const saveEvents: DesignBuilderActionEventDetail[] = [];
		hostElement.addEventListener('design-builder:action', (event) => {
			actionEvents.push((event as CustomEvent<DesignBuilderActionEventDetail>).detail);
		});
		hostElement.addEventListener('design-builder:save', (event) => {
			saveEvents.push((event as CustomEvent<DesignBuilderActionEventDetail>).detail);
		});

		const runtime = new FullPageEditorRuntime(container, tokenData, hostElement as any);
		const runtimeInternals = runtime as unknown as {
			handleChange(variable: string, value: string, defaultValue: string): void;
			handleSaveClick(): void;
			resetAll(): void;
		};

		runtimeInternals.handleChange('--color-free', '#123456', '#000');
		expect(actionEvents.at(-1)).toMatchObject({
			action: 'change',
			mode: 'full-page',
			metadata: {
				variable: '--color-free',
				value: '#123456',
			},
		});

		const confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(true);
		runtimeInternals.resetAll();
		expect(actionEvents.at(-1)).toMatchObject({
			action: 'reset-all',
			mode: 'full-page',
		});

		runtimeInternals.handleSaveClick();
		expect(saveEvents.at(-1)).toMatchObject({
			action: 'save',
			mode: 'full-page',
		});

		confirmSpy.mockRestore();
		hostElement.remove();
		container.remove();
	});

	it('applies saved component overrides when booting in full-page mode', () => {
		document.body.innerHTML = '<div data-component="button"></div>';
		const target = document.querySelector<HTMLElement>('[data-component="button"]');
		const container = document.createElement('div');
		document.body.appendChild(container);
		const hostElement = document.createElement('design-builder') as HTMLElement & {
			overrideState: ReturnType<typeof normalizeDesignBuilderOverrideState>;
		};
		hostElement.overrideState = normalizeDesignBuilderOverrideState({
			component: {
				[GENERAL_SCOPE_KEY]: {
					button: {
						'--c-button--color--primary': '#123456',
					},
				},
			},
		});
		document.body.appendChild(hostElement);

		new FullPageEditorRuntime(container, tokenData, hostElement as any);

		expect(target?.style.getPropertyValue('--c-button--color--primary')).toBe('#123456');

		hostElement.remove();
		container.remove();
	});
});
