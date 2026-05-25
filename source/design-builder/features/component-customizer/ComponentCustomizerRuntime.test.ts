jest.mock('../../shared/control-elements/createDesignBuilderControls', () => ({
	createDesignBuilderControl: (setting: { variable: string; description?: string }) => {
		const row = document.createElement('div');
		row.setAttribute('data-tip-variable', setting.variable);
		row.setAttribute('data-tip-description', setting.description ?? '');
		return row;
	},
	createDesignBuilderCategory: (_category: { id: string }, items: HTMLElement[]) => {
		const element = document.createElement('section');
		element.className = 'db-category';
		for (const item of items) {
			element.appendChild(item);
		}
		return element;
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
			tokens: ['color--primary', 'color--primary-contrast', 'space'],
			componentSettings: [
				{
					id: 'settings',
					label: 'Settings',
					settings: [
						{
							token: 'color--primary',
							label: 'Text Color',
							description: 'Overrides the default text color for the button component',
							includeStateColors: false,
						},
						{
							variable: '--font-size-multiplier',
							label: 'Font Size Multiplier',
							description: 'Scales component font sizes locally',
							type: 'range',
							default: '1',
							min: 0.1,
							max: 4,
							step: 0.1,
						},
					],
				},
			],
		},
		image: {
			name: 'Image',
			tokens: ['color--primary-border'],
		},
	};

	const tokenLibrary: TokenData = {
		name: 'Tokens',
		version: '1.0.0',
		categories: [
			{
				id: 'colors-brand',
				label: 'Brand Colors',
				settings: [
					{
						variable: '--color--primary',
						label: 'Primary',
						description: 'Primary color for component',
						type: 'color',
						default: '#000000',
						contrast: '--color--primary-contrast',
						locked: true,
					},
					{
						variable: '--color--primary-contrast',
						label: 'Primary Contrast',
						type: 'color',
						default: '#ffffff',
					},
					{
						variable: '--color--primary-border',
						label: 'Primary Border',
						type: 'color',
						default: '#111111',
						locked: true,
					},
					{
						variable: '--color--secondary',
						label: 'Secondary',
						type: 'color',
						default: '#444444',
						contrast: '--color--secondary-contrast',
					},
					{
						variable: '--color--secondary-contrast',
						label: 'Secondary Contrast',
						type: 'color',
						default: '#fefefe',
					},
				],
			},
			{
				id: 'colors-brand-palette',
				label: 'Brand Palette',
				settings: [
					{
						variable: '--color--palette-1',
						label: 'Palette 1',
						type: 'color',
						default: 'transparent',
						contrast: '--color--palette-1-contrast',
					},
					{
						variable: '--color--palette-1-contrast',
						label: 'Palette 1 Contrast',
						type: 'color',
						default: 'transparent',
					},
					{
						variable: '--color--palette-2',
						label: 'Palette 2',
						type: 'color',
						default: 'transparent',
						contrast: '--color--palette-2-contrast',
					},
					{
						variable: '--color--palette-2-contrast',
						label: 'Palette 2 Contrast',
						type: 'color',
						default: 'transparent',
					},
				],
			},
			{
				id: 'colors-state',
				label: 'State Colors',
				settings: [
					{
						variable: '--color--success',
						label: 'Success',
						type: 'color',
						default: '#00875a',
						contrast: '--color--success-contrast',
					},
					{
						variable: '--color--success-contrast',
						label: 'Success Contrast',
						type: 'color',
						default: '#ffffff',
					},
				],
			},
			{
				id: 'colors-ui',
				label: 'UI Colors',
				settings: [
					{
						variable: '--color--focus',
						label: 'Focus',
						type: 'color',
						default: '#0066cc',
					},
					{
						variable: '--color--alpha',
						label: 'Alpha Color',
						type: 'rgba',
						default: 'rgba(0, 0, 0, 0.4)',
						contrast: '--color--alpha-contrast',
					},
					{
						variable: '--color--alpha-contrast',
						label: 'Alpha Contrast',
						type: 'color',
						default: '#ffffff',
					},
				],
			},
			{
				id: 'spacing',
				label: 'Spacing',
				settings: [
					{
						variable: '--space',
						label: 'Space',
						type: 'range',
						default: '1',
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

	it('only exposes configured palette variants in token-color options', () => {
		const mount = document.createElement('div');
		document.body.appendChild(mount);
		const hostElement = document.createElement('design-builder') as HTMLElement & {
			overrideState: ReturnType<typeof normalizeDesignBuilderOverrideState>;
		};
		hostElement.overrideState = normalizeDesignBuilderOverrideState({
			token: {
				'--color--palette-2': '#224466',
				'--color--palette-2-contrast': '#ffffff',
			},
		});
		document.body.appendChild(hostElement);

		const runtime = new ComponentCustomizerRuntime(componentData, tokenLibrary, mount, { hostElement: hostElement as RuntimeHostElement });
		const runtimeInternals = runtime as unknown as {
			buildCategoriesForComponent(componentName: string): TokenData['categories'];
		};

		const categories = runtimeInternals.buildCategoriesForComponent('button');
		const settingsCategory = categories.find((category) => category.id === 'settings');
		const colorSetting = settingsCategory?.settings.find((setting) => setting.variable === '--c-button--color--primary');

		expect(colorSetting?.options).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					label: 'Palette 2',
					value: 'var(--color--palette-2)',
				}),
			]),
		);
		expect(colorSetting?.options).not.toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					label: 'Palette 1',
				}),
			]),
		);

		hostElement.remove();
		mount.remove();
	});

	it('keeps derived locked colors uneditable in legacy component controls', () => {
		const mount = document.createElement('div');
		document.body.innerHTML = `
			<div data-component="image">
				<div>Image</div>
			</div>
		`;
		document.body.appendChild(mount);

		const runtime = new ComponentCustomizerRuntime(componentData, tokenLibrary, mount);
		const runtimeInternals = runtime as unknown as {
			buildCategoriesForComponent(componentName: string): TokenData['categories'];
		};

		const categories = runtimeInternals.buildCategoriesForComponent('image');
		const colorCategory = categories.find((category) => category.id === 'colors-brand');
		const borderSetting = colorCategory?.settings.find((setting) => setting.variable === '--c-image--color--primary-border');

		expect(borderSetting).toMatchObject({
			variable: '--c-image--color--primary-border',
			label: 'Primary Border',
			type: 'token-color',
			locked: true,
			default: 'var(--color--primary-border)',
		});

		mount.remove();
	});

	it('does not render the save button when disabled', () => {
		const mount = document.createElement('div');
		document.body.appendChild(mount);
		const hostElement = document.createElement('design-builder') as HTMLElement & {
			overrideState: ReturnType<typeof normalizeDesignBuilderOverrideState>;
		};
		hostElement.overrideState = normalizeDesignBuilderOverrideState({});
		document.body.appendChild(hostElement);

		new ComponentCustomizerRuntime(componentData, tokenLibrary, mount, {
			hostElement: hostElement as RuntimeHostElement,
			showSaveButton: false,
		});

		expect(mount.querySelector('[data-action="save"]')).toBeNull();

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

	it('splits semicolon-separated data-scope values into individual scope options', () => {
		document.body.innerHTML = `
			<div data-scope="scope-1; scope-2;">
				<div data-component="button">
					<a href="/test">Button</a>
				</div>
			</div>
		`;

		const mount = document.createElement('div');
		document.body.appendChild(mount);

		new ComponentCustomizerRuntime(componentData, tokenLibrary, mount);

		const scopeOptions = Array.from(mount.querySelectorAll<HTMLOptionElement>('#db-scope-select option')).map((option) => ({
			value: option.value,
			label: option.textContent?.trim(),
		}));

		expect(scopeOptions).toEqual([
			{ value: GENERAL_SCOPE_KEY, label: 'Scope: General (all scopes)' },
			{ value: 'scope:scope-1', label: 'Scope: scope-1' },
			{ value: 'scope:scope-2', label: 'Scope: scope-2' },
		]);

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

	it('builds explicit token-backed and component-local settings into localized controls', () => {
		const mount = document.createElement('div');
		document.body.appendChild(mount);

		const runtime = new ComponentCustomizerRuntime(componentData, tokenLibrary, mount);
		const runtimeInternals = runtime as unknown as {
			buildCategoriesForComponent(componentName: string): TokenData['categories'];
		};

		const categories = runtimeInternals.buildCategoriesForComponent('button');
		const settingsCategory = categories.find((category) => category.id === 'settings');
		const colorSetting = settingsCategory?.settings.find((setting) => setting.variable === '--c-button--color--primary');
		const multiplierSetting = settingsCategory?.settings.find((setting) => setting.variable === '--c-button--font-size-multiplier');
		const spaceSetting = settingsCategory?.settings.find((setting) => setting.variable === '--c-button--space');

		expect(colorSetting).toMatchObject({
			label: 'Text Color',
			description: 'Overrides the default text color for the button component',
			type: 'token-color',
			default: 'var(--color--primary)',
			locked: false,
			linkedDefaults: {
				'--c-button--color--primary-contrast': 'var(--color--primary-contrast)',
			},
		});
		expect(colorSetting?.options).toEqual([
			expect.objectContaining({
				label: 'Primary',
				value: 'var(--color--primary)',
			}),
			expect.objectContaining({
				label: 'Secondary',
				value: 'var(--color--secondary)',
			}),
		]);

		expect(multiplierSetting).toMatchObject({
			label: 'Font Size Multiplier',
			type: 'range',
			default: '1',
			min: 0.1,
			max: 4,
			step: 0.1,
		});
		expect(spaceSetting).toMatchObject({
			variable: '--c-button--space',
			label: 'Space',
			type: 'range',
			default: '1',
		});

		mount.remove();
	});

	it('hides state color options unless a component setting explicitly opts in', () => {
		const mount = document.createElement('div');
		document.body.appendChild(mount);

		const runtime = new ComponentCustomizerRuntime(componentData, tokenLibrary, mount);
		const runtimeInternals = runtime as unknown as {
			buildCategoriesForComponent(componentName: string): TokenData['categories'];
		};

		const categories = runtimeInternals.buildCategoriesForComponent('button');
		const settingsCategory = categories.find((category) => category.id === 'settings');
		const colorSetting = settingsCategory?.settings.find((setting) => setting.variable === '--c-button--color--primary');

		expect(colorSetting?.options).not.toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					label: 'Focus',
				}),
				expect.objectContaining({
					label: 'Alpha Color',
				}),
				expect.objectContaining({
					label: 'Success',
				}),
			]),
		);

		mount.remove();
	});

	it('falls back to token-based controls when componentSettings are not provided', () => {
		const mount = document.createElement('div');
		document.body.appendChild(mount);

		const runtime = new ComponentCustomizerRuntime(
			{
				button: {
					name: 'Button',
					tokens: ['color--primary', 'space'],
				},
			},
			tokenLibrary,
			mount,
		);
		const runtimeInternals = runtime as unknown as {
			buildCategoriesForComponent(componentName: string): TokenData['categories'];
		};

		const categories = runtimeInternals.buildCategoriesForComponent('button');
		const colorCategory = categories.find((category) => category.id === 'colors-brand');
		const spacingCategory = categories.find((category) => category.id === 'spacing');

		expect(colorCategory?.settings).toEqual([
			expect.objectContaining({
				variable: '--c-button--color--primary',
				label: 'Primary',
				type: 'token-color',
				default: 'var(--color--primary)',
			}),
		]);
		expect(spacingCategory?.settings).toEqual([
			expect.objectContaining({
				variable: '--c-button--space',
				label: 'Space',
				type: 'range',
				default: '1',
			}),
		]);

		mount.remove();
	});

	it('applies linked contrast overrides together with a token-color selection', () => {
		const mount = document.createElement('div');
		document.body.appendChild(mount);

		const runtime = new ComponentCustomizerRuntime(componentData, tokenLibrary, mount);
		const runtimeInternals = runtime as unknown as {
			handleChange(componentName: string, scopeKey: string, variable: string, value: string, defaultValue: string, linkedDefaults?: Record<string, string>, extraValues?: Record<string, string>): void;
		};

		runtimeInternals.handleChange(
			'button',
			GENERAL_SCOPE_KEY,
			'--c-button--color--primary',
			'var(--color--secondary)',
			'var(--color--primary)',
			{
				'--c-button--color--primary-contrast': 'var(--color--primary-contrast)',
			},
			{
				'--c-button--color--primary-contrast': 'var(--color--secondary-contrast)',
			},
		);

		const target = document.querySelector<HTMLElement>('[data-component="button"]');
		expect(target?.style.getPropertyValue('--c-button--color--primary')).toBe('var(--color--secondary)');
		expect(target?.style.getPropertyValue('--c-button--color--primary-contrast')).toBe('var(--color--secondary-contrast)');

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

	it('does not render a static hover tip bar', () => {
		const mount = document.createElement('div');
		document.body.appendChild(mount);
		const hostElement = document.createElement('design-builder') as HTMLElement & {
			overrideState: ReturnType<typeof normalizeDesignBuilderOverrideState>;
		};
		hostElement.overrideState = normalizeDesignBuilderOverrideState({});
		document.body.appendChild(hostElement);

		new ComponentCustomizerRuntime(componentData, tokenLibrary, mount, { hostElement: hostElement as RuntimeHostElement });

		expect(mount.querySelector('.db-hover-tip')).toBeNull();
		expect(mount.querySelector('[data-hover-tip-variable]')).toBeNull();
		expect(mount.querySelector('[data-hover-tip-description]')).toBeNull();

		hostElement.remove();
		mount.remove();
	});

	it('closes details menus when selecting an action or clicking outside', () => {
		const mount = document.createElement('div');
		document.body.appendChild(mount);
		const hostElement = document.createElement('design-builder') as HTMLElement & {
			overrideState: ReturnType<typeof normalizeDesignBuilderOverrideState>;
		};
		hostElement.overrideState = normalizeDesignBuilderOverrideState({});
		document.body.appendChild(hostElement);

		new ComponentCustomizerRuntime(componentData, tokenLibrary, mount, { hostElement: hostElement as RuntimeHostElement });

		const presetMenu = mount.querySelector<HTMLDetailsElement>('.db-presets-menu');
		const savePresetButton = mount.querySelector<HTMLButtonElement>('[data-action="save-preset"]');
		expect(presetMenu).toBeTruthy();
		const promptSpy = jest.spyOn(window, 'prompt').mockReturnValue(null);
		presetMenu!.open = true;
		savePresetButton?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
		expect(presetMenu?.open).toBe(false);

		const headerMenu = mount.querySelector<HTMLDetailsElement>('.db-header-menu');
		expect(headerMenu).toBeTruthy();
		headerMenu!.open = true;
		document.body.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true }));
		expect(headerMenu?.open).toBe(false);
		promptSpy.mockRestore();

		hostElement.remove();
		mount.remove();
	});
});
