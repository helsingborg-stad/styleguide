import { resolveDesignBuilderRootConfiguration } from './resolveDesignBuilderRootConfiguration';
import type { DesignBuilderRootElement } from './designBuilderRootContracts';

describe('resolveDesignBuilderRootConfiguration', () => {
	function createRoot(): DesignBuilderRootElement {
		return document.createElement('design-builder') as DesignBuilderRootElement;
	}

	it('defaults to full-page when token data is available', () => {
		const root = createRoot();
		root.setAttribute('token-data', JSON.stringify({ name: 'Tokens' }));

		const configuration = resolveDesignBuilderRootConfiguration({
			hostElement: root,
			preferredMode: null,
			propertyTokenData: undefined,
			propertyTokenLibraryData: undefined,
			propertyComponentData: undefined,
		});

		expect(configuration.mode).toBe('full-page');
		expect(configuration.availableModes).toEqual(['full-page']);
		expect(configuration.showSaveButton).toBe(true);
	});

	it('honors an explicit component-customizer mode when both payloads are available', () => {
		const root = createRoot();
		root.setAttribute('mode', 'component-customizer');
		root.setAttribute('component-data', JSON.stringify({ button: { name: 'Button', tokens: ['color--primary'] } }));
		root.setAttribute('token-data', JSON.stringify({ name: 'Tokens', version: '1.0.0', categories: [] }));

		const configuration = resolveDesignBuilderRootConfiguration({
			hostElement: root,
			preferredMode: null,
			propertyTokenData: undefined,
			propertyTokenLibraryData: undefined,
			propertyComponentData: undefined,
		});

		expect(configuration.mode).toBe('component-customizer');
		expect(configuration.availableModes).toEqual(['full-page', 'component-customizer']);
	});

	it('falls back to the legacy token-library payload when token-data is missing', () => {
		const root = createRoot();
		root.setAttribute('component-data', JSON.stringify({ button: { name: 'Button', tokens: ['color--primary'] } }));
		root.setAttribute('token-library', JSON.stringify({ name: 'Tokens', version: '1.0.0', categories: [] }));

		const configuration = resolveDesignBuilderRootConfiguration({
			hostElement: root,
			preferredMode: null,
			propertyTokenData: undefined,
			propertyTokenLibraryData: undefined,
			propertyComponentData: undefined,
		});

		expect(configuration.tokenData).toEqual({ name: 'Tokens', version: '1.0.0', categories: [] });
		expect(configuration.mode).toBe('component-customizer');
		expect(configuration.availableModes).toEqual(['full-page', 'component-customizer']);
	});

	it('keeps an internally selected mode when it is still available', () => {
		const root = createRoot();
		root.setAttribute('token-data', JSON.stringify({ name: 'Tokens' }));
		root.setAttribute('component-data', JSON.stringify({ button: { name: 'Button', tokens: ['color--primary'] } }));

		const configuration = resolveDesignBuilderRootConfiguration({
			hostElement: root,
			preferredMode: 'component-customizer',
			propertyTokenData: undefined,
			propertyTokenLibraryData: undefined,
			propertyComponentData: undefined,
		});

		expect(configuration.mode).toBe('component-customizer');
		expect(configuration.availableModes).toEqual(['full-page', 'component-customizer']);
	});

	it('ignores legacy config attributes when inferring the initial mode', () => {
		const root = createRoot();
		root.setAttribute('config', JSON.stringify({ mode: 'full-page' }));
		root.setAttribute('component-data', JSON.stringify({ button: { name: 'Button', tokens: ['color--primary'] } }));
		root.setAttribute('token-data', JSON.stringify({ name: 'Tokens', version: '1.0.0', categories: [] }));

		const configuration = resolveDesignBuilderRootConfiguration({
			hostElement: root,
			preferredMode: null,
			propertyTokenData: undefined,
			propertyTokenLibraryData: undefined,
			propertyComponentData: undefined,
		});

		expect(configuration.mode).toBe('full-page');
		expect(configuration.availableModes).toEqual(['full-page', 'component-customizer']);
	});

	it('normalizes provided presets from the root attribute', () => {
		const root = createRoot();
		root.setAttribute('token-data', JSON.stringify({ name: 'Tokens' }));
		root.setAttribute(
			'presets',
			JSON.stringify([
				{
					id: 'dark',
					label: 'Dark Ember',
					token: {
						'--color-primary': '#111111',
					},
				},
			]),
		);

		const configuration = resolveDesignBuilderRootConfiguration({
			hostElement: root,
			preferredMode: null,
			propertyTokenData: undefined,
			propertyTokenLibraryData: undefined,
			propertyComponentData: undefined,
		});

		expect(configuration.presets).toEqual([
			{
				id: 'dark',
				label: 'Dark Ember',
				state: {
					token: {
						'--color-primary': '#111111',
					},
					component: {},
				},
				targets: {
					token: true,
					component: false,
				},
			},
		]);
	});

	it('allows the save button to be disabled from the root attribute', () => {
		const root = createRoot();
		root.setAttribute('token-data', JSON.stringify({ name: 'Tokens' }));
		root.setAttribute('show-save-button', 'false');

		const configuration = resolveDesignBuilderRootConfiguration({
			hostElement: root,
			preferredMode: null,
			propertyTokenData: undefined,
			propertyTokenLibraryData: undefined,
			propertyComponentData: undefined,
		});

		expect(configuration.showSaveButton).toBe(false);
	});
});
