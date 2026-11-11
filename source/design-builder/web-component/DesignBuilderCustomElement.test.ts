jest.mock('../shared/styling/designBuilderStyleText', () => ({
	designBuilderStyles: '',
}));

import { normalizeDesignBuilderOverrideState } from '../shared/state/designBuilderOverrideState';
import { registerDesignBuilderCustomElement, registerDesignBuilderModeAdapter } from './DesignBuilderCustomElement';
import { DESIGN_BUILDER_MODE_FULL_PAGE, type DesignBuilderRootConfiguration, type DesignBuilderRootElement } from './designBuilderRootContracts';

describe('DesignBuilderCustomElement root attribute hydration', () => {
	const configurations: DesignBuilderRootConfiguration[] = [];

	beforeAll(() => {
		registerDesignBuilderModeAdapter(DESIGN_BUILDER_MODE_FULL_PAGE, ({ configuration }) => {
			configurations.push(configuration);
		});
		registerDesignBuilderCustomElement();
	});

	beforeEach(() => {
		configurations.length = 0;
		document.body.innerHTML = '';
	});

	async function waitForInitialization(rootElement: HTMLElement): Promise<void> {
		await new Promise<void>((resolve) => {
			rootElement.addEventListener('design-builder:initialized', () => resolve(), { once: true });
		});
	}

	it('starts in the preferred scheme and preserves a manual choice across renders', async () => {
		const originalMatchMedia = Object.getOwnPropertyDescriptor(window, 'matchMedia');
		Object.defineProperty(window, 'matchMedia', {
			configurable: true,
			value: (query: string) => ({ matches: query === '(prefers-color-scheme: dark)' }),
		});
		try {
			const rootElement = document.createElement('design-builder') as DesignBuilderRootElement;
			rootElement.setAttribute('token-data', JSON.stringify({ name: 'Tokens', version: '1.0.0', categories: [] }));
			let initialized = waitForInitialization(rootElement);
			document.body.appendChild(rootElement);
			await initialized;
			expect(rootElement.colorScheme).toBe('dark');

			rootElement.colorScheme = 'base';
			initialized = waitForInitialization(rootElement);
			rootElement.setAttribute('show-save-button', 'false');
			await initialized;
			expect(rootElement.colorScheme).toBe('base');
		} finally {
			if (originalMatchMedia) Object.defineProperty(window, 'matchMedia', originalMatchMedia);
			else Reflect.deleteProperty(window, 'matchMedia');
		}
	});

	it('hydrates override-state from the root attribute on first render', async () => {
		const rootElement = document.createElement('design-builder');
		rootElement.setAttribute('token-data', JSON.stringify({ name: 'Tokens', version: '1.0.0', categories: [] }));
		rootElement.setAttribute(
			'override-state',
			JSON.stringify({
				token: { '--color--primary': '#123456' },
				component: {},
			}),
		);

		const initialized = waitForInitialization(rootElement);
		document.body.appendChild(rootElement);
		await initialized;

		expect(configurations.at(-1)?.overrideState).toEqual(
			normalizeDesignBuilderOverrideState({
				token: { '--color--primary': '#123456' },
				component: {},
			}),
		);
		expect((rootElement as typeof rootElement & { overrideState: unknown }).overrideState).toEqual(
			normalizeDesignBuilderOverrideState({
				token: { '--color--primary': '#123456' },
				component: {},
			}),
		);
	});

	it('rehydrates when override-state is updated via attribute after initialization', async () => {
		const rootElement = document.createElement('design-builder');
		rootElement.setAttribute('token-data', JSON.stringify({ name: 'Tokens', version: '1.0.0', categories: [] }));

		let initialized = waitForInitialization(rootElement);
		document.body.appendChild(rootElement);
		await initialized;

		initialized = waitForInitialization(rootElement);
		rootElement.setAttribute(
			'override-state',
			JSON.stringify({
				token: { '--color--primary': '#abcdef' },
				component: {},
			}),
		);
		await initialized;

		expect(configurations.at(-1)?.overrideState).toEqual(
			normalizeDesignBuilderOverrideState({
				token: { '--color--primary': '#abcdef' },
				component: {},
			}),
		);
	});

	it('hydrates presets from the root attribute on first render', async () => {
		const rootElement = document.createElement('design-builder');
		rootElement.setAttribute('token-data', JSON.stringify({ name: 'Tokens', version: '1.0.0', categories: [] }));
		rootElement.setAttribute(
			'presets',
			JSON.stringify([
				{
					id: 'dark',
					label: 'Dark Ember',
					token: {
						'--color--primary': '#123456',
					},
				},
			]),
		);

		const initialized = waitForInitialization(rootElement);
		document.body.appendChild(rootElement);
		await initialized;

		expect(configurations.at(-1)?.presets).toEqual([
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
		]);
		expect((rootElement as typeof rootElement & { presets: unknown }).presets).toEqual(configurations.at(-1)?.presets);
	});

	it('hydrates the save button visibility from the root attribute', async () => {
		const rootElement = document.createElement('design-builder');
		rootElement.setAttribute('token-data', JSON.stringify({ name: 'Tokens', version: '1.0.0', categories: [] }));
		rootElement.setAttribute('show-save-button', 'false');

		const initialized = waitForInitialization(rootElement);
		document.body.appendChild(rootElement);
		await initialized;

		expect(configurations.at(-1)?.showSaveButton).toBe(false);
	});

	it('persists shared locked-field visibility on the root element', async () => {
		const rootElement = document.createElement('design-builder') as HTMLElement & { showLockedFields: boolean };
		rootElement.setAttribute('token-data', JSON.stringify({ name: 'Tokens', version: '1.0.0', categories: [] }));

		const initialized = waitForInitialization(rootElement);
		document.body.appendChild(rootElement);
		await initialized;

		expect(rootElement.showLockedFields).toBe(false);

		rootElement.showLockedFields = true;

		expect(rootElement.showLockedFields).toBe(true);
	});
});
