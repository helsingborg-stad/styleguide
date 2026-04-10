jest.mock('../../shared/control-elements/createDesignBuilderControls', () => ({
	createDesignBuilderControl: (setting: { variable: string; description?: string }) => {
		const row = document.createElement('div');
		row.setAttribute('data-tip-variable', setting.variable);
		row.setAttribute('data-tip-description', setting.description ?? '');
		return row;
	},
}));

import { GENERAL_SCOPE_KEY } from '../../shared/constants/designBuilderRuntimeConstants';
import type { DesignBuilderActionEventDetail } from '../../shared/events/designBuilderActionEvents';
import { normalizeDesignBuilderOverrideState } from '../../shared/state/designBuilderOverrideState';
import type { ComponentTokenData, TokenData } from '../../shared/types/designBuilderDataTypes';
import { ComponentCustomizerRuntime } from './ComponentCustomizerRuntime';

type RuntimeHostElement = NonNullable<NonNullable<ConstructorParameters<typeof ComponentCustomizerRuntime>[3]>['hostElement']>;

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
						description: 'Primary color for component',
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

		const runtime = new ComponentCustomizerRuntime(componentData, tokenLibrary, mount, { hostElement: hostElement as RuntimeHostElement });
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

		new ComponentCustomizerRuntime(componentData, tokenLibrary, mount, { hostElement: hostElement as RuntimeHostElement });

		expect(document.documentElement.style.getPropertyValue('--color--primary')).toBe('#123456');

		hostElement.remove();
		mount.remove();
	});

	it('keeps component overrides when loading a token-only provided preset', () => {
		const mount = document.createElement('div');
		document.body.appendChild(mount);
		const hostElement = document.createElement('design-builder') as HTMLElement & {
			overrideState: ReturnType<typeof normalizeDesignBuilderOverrideState>;
			presets?: unknown;
		};
		hostElement.overrideState = normalizeDesignBuilderOverrideState({
			component: {
				[GENERAL_SCOPE_KEY]: {
					button: {
						'--c-button--color--primary': '#abcdef',
					},
				},
			},
		});
		hostElement.presets = [
			{
				id: 'dark',
				label: 'Dark Ember',
				state: {
					token: {
						'--color--primary': '#123456',
					},
					component: {},
				},
				targets: {
					token: true,
					component: false,
				},
			},
		];
		document.body.appendChild(hostElement);

		new ComponentCustomizerRuntime(componentData, tokenLibrary, mount, { hostElement: hostElement as RuntimeHostElement });

		const presetSelect = mount.querySelector<HTMLSelectElement>('[data-action="select-preset"]');
		if (presetSelect) {
			presetSelect.value = 'provided:dark';
			presetSelect.dispatchEvent(new Event('change'));
		}

		const target = document.querySelector<HTMLElement>('[data-component="button"]');
		expect(document.documentElement.style.getPropertyValue('--color--primary')).toBe('#123456');
		expect(target?.style.getPropertyValue('--c-button--color--primary')).toBe('#abcdef');
		expect(hostElement.overrideState.component).toEqual({
			[GENERAL_SCOPE_KEY]: {
				button: {
					'--c-button--color--primary': '#abcdef',
				},
			},
		});

		hostElement.remove();
		mount.remove();
	});

	it('renders save and delete preset actions together in the preset bar', () => {
		const mount = document.createElement('div');
		document.body.appendChild(mount);
		const hostElement = document.createElement('design-builder') as HTMLElement & {
			overrideState: ReturnType<typeof normalizeDesignBuilderOverrideState>;
		};
		hostElement.overrideState = normalizeDesignBuilderOverrideState({});
		document.body.appendChild(hostElement);

		new ComponentCustomizerRuntime(componentData, tokenLibrary, mount, { hostElement: hostElement as RuntimeHostElement });

		const savePresetButton = mount.querySelector<HTMLButtonElement>('[data-action="save-preset"]');
		const deletePresetButton = mount.querySelector<HTMLButtonElement>('[data-action="delete-preset"]');
		const presetsMenu = mount.querySelector<HTMLElement>('.db-presets-menu-content');
		expect(savePresetButton).toBeTruthy();
		expect(deletePresetButton).toBeTruthy();
		expect(presetsMenu).toBeTruthy();
		expect(savePresetButton?.closest('.db-presets')).toBe(deletePresetButton?.closest('.db-presets'));
		expect(savePresetButton?.closest('.db-presets-menu-content')).toBe(presetsMenu);
		expect(deletePresetButton?.closest('.db-presets-menu-content')).toBe(presetsMenu);

		hostElement.remove();
		mount.remove();
	});

	it('shows variable and description in the hover tip bar when hovering controls', () => {
		const mount = document.createElement('div');
		document.body.appendChild(mount);
		const hostElement = document.createElement('design-builder') as HTMLElement & {
			overrideState: ReturnType<typeof normalizeDesignBuilderOverrideState>;
		};
		hostElement.overrideState = normalizeDesignBuilderOverrideState({});
		document.body.appendChild(hostElement);

		new ComponentCustomizerRuntime(componentData, tokenLibrary, mount, { hostElement: hostElement as RuntimeHostElement });

		const tipVariable = mount.querySelector<HTMLElement>('[data-hover-tip-variable]');
		const tipDescription = mount.querySelector<HTMLElement>('[data-hover-tip-description]');
		expect(tipVariable?.textContent).toContain('Hover an option to preview token details');
		expect(tipDescription?.textContent).toContain('Token description is shown here when available.');

		const row = mount.querySelector<HTMLElement>('[data-tip-variable="--c-button--color--primary"]');
		expect(row).toBeTruthy();
		row?.dispatchEvent(new MouseEvent('pointerover', { bubbles: true }));

		expect(tipVariable?.textContent).toContain('--c-button--color--primary');
		expect(tipDescription?.textContent).toContain('Primary color for component');

		row?.dispatchEvent(new MouseEvent('pointerout', { bubbles: true, relatedTarget: null }));
		expect(tipVariable?.textContent).toContain('Hover an option to preview token details');
		expect(tipDescription?.textContent).toContain('Token description is shown here when available.');

		hostElement.remove();
		mount.remove();
	});
});
