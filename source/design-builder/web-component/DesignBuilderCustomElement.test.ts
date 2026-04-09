jest.mock('../shared/styling/designBuilderStyleText', () => ({
	designBuilderStyles: '',
}));

import { registerDesignBuilderCustomElement, registerDesignBuilderModeAdapter } from './DesignBuilderCustomElement';
import { normalizeDesignBuilderOverrideState } from '../shared/state/designBuilderOverrideState';
import { DESIGN_BUILDER_MODE_FULL_PAGE, type DesignBuilderRootConfiguration } from './designBuilderRootContracts';

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
});
