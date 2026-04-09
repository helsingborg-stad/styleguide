jest.mock('../../shared/control-elements/createDesignBuilderControls', () => ({
	createDesignBuilderControl: () => document.createElement('div'),
}));

import { ComponentCustomizerRuntime } from './ComponentCustomizerRuntime';
import { GENERAL_SCOPE_KEY } from '../../shared/constants/designBuilderRuntimeConstants';
import { normalizeDesignBuilderOverrideState } from '../../shared/state/designBuilderOverrideState';
import type { DesignBuilderActionEventDetail } from '../../shared/events/designBuilderActionEvents';
import type { ComponentTokenData, TokenData } from '../../shared/types/designBuilderDataTypes';

describe('ComponentCustomizerRuntime pick mode', () => {
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
		document.documentElement.style.removeProperty('--color--primary');
		localStorage.clear();
	});

	afterEach(() => {
		document.body.innerHTML = '';
		document.documentElement.style.removeProperty('--color--primary');
		localStorage.clear();
	});

	it('keeps page target picking disabled until manually activated', () => {
		const mount = document.createElement('div');
		document.body.appendChild(mount);

		new ComponentCustomizerRuntime(componentData, tokenLibrary, mount);

		const target = document.querySelector<HTMLElement>('[data-component="button"]');
		const toggleButton = mount.querySelector<HTMLButtonElement>('[data-action="toggle-target-selection"]');
		const toggleLabel = () => mount.querySelector<HTMLElement>('[data-role="toggle-target-selection-label"]')?.textContent?.trim();

		expect(target?.classList.contains('db-component-target')).toBe(false);
		expect(toggleLabel()).toBe('Pick on page');

		toggleButton?.click();
		expect(target?.classList.contains('db-component-target')).toBe(true);
		expect(toggleLabel()).toBe('Stop picking');

		target?.click();
		expect(target?.classList.contains('db-component-target')).toBe(false);
		expect(toggleLabel()).toBe('Pick on page');
	});

	it('emits action events for component changes, resets, and saves', () => {
		const mount = document.createElement('div');
		document.body.appendChild(mount);
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

		const runtime = new ComponentCustomizerRuntime(componentData, tokenLibrary, mount, { hostElement: hostElement as any });
		const runtimeInternals = runtime as unknown as {
			handleChange(componentName: string, scopeKey: string, variable: string, value: string, defaultValue: string): void;
			handleSaveClick(): void;
			resetAllComponents(): void;
		};

		runtimeInternals.handleChange('button', GENERAL_SCOPE_KEY, '--c-button--color--primary', '#123456', '#000000');
		expect(actionEvents.at(-1)).toMatchObject({
			action: 'change',
			mode: 'component-customizer',
			metadata: {
				componentName: 'button',
				scopeKey: GENERAL_SCOPE_KEY,
				variable: '--c-button--color--primary',
				value: '#123456',
			},
		});

		const confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(true);
		runtimeInternals.resetAllComponents();
		expect(actionEvents.at(-1)).toMatchObject({
			action: 'reset-all',
			mode: 'component-customizer',
		});

		runtimeInternals.handleSaveClick();
		expect(saveEvents.at(-1)).toMatchObject({
			action: 'save',
			mode: 'component-customizer',
		});

		confirmSpy.mockRestore();
		hostElement.remove();
		mount.remove();
	});

	it('applies saved token overrides when booting in component mode', () => {
		const mount = document.createElement('div');
		document.body.appendChild(mount);
		const hostElement = document.createElement('design-builder') as HTMLElement & {
			overrideState: ReturnType<typeof normalizeDesignBuilderOverrideState>;
		};
		hostElement.overrideState = normalizeDesignBuilderOverrideState({
			token: {
				'--color--primary': '#123456',
			},
		});
		document.body.appendChild(hostElement);

		new ComponentCustomizerRuntime(componentData, tokenLibrary, mount, { hostElement: hostElement as any });

		expect(document.documentElement.style.getPropertyValue('--color--primary')).toBe('#123456');

		hostElement.remove();
		mount.remove();
	});
});
