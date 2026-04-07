import { parseDesignBuilderRootConfiguration } from './config';
import type { DesignBuilderRootElement } from './types';

describe('parseDesignBuilderRootConfiguration', () => {
	function createRoot(): DesignBuilderRootElement {
		return document.createElement('design-builder') as DesignBuilderRootElement;
	}

	it('defaults to full-page when token data is available', () => {
		const root = createRoot();
		root.setAttribute('token-data', JSON.stringify({ name: 'Tokens' }));

		const configuration = parseDesignBuilderRootConfiguration({
			hostElement: root,
			propertyConfig: null,
			propertyTokenData: undefined,
			propertyTokenLibraryData: undefined,
			propertyComponentData: undefined,
		});

		expect(configuration.mode).toBe('full-page');
		expect(configuration.availableModes).toEqual(['full-page']);
	});

	it('defaults to component customization when component payloads are available', () => {
		const root = createRoot();
		root.setAttribute('component-data', JSON.stringify({ button: { name: 'Button', tokens: ['color--primary'] } }));
		root.setAttribute('token-library', JSON.stringify({ name: 'Tokens', version: '1.0.0', categories: [] }));

		const configuration = parseDesignBuilderRootConfiguration({
			hostElement: root,
			propertyConfig: null,
			propertyTokenData: undefined,
			propertyTokenLibraryData: undefined,
			propertyComponentData: undefined,
		});

		expect(configuration.mode).toBe('component-customizer');
		expect(configuration.availableModes).toEqual(['full-page', 'component-customizer']);
	});

	it('respects an explicit mode override while keeping inferred available modes', () => {
		const root = createRoot();
		root.setAttribute('mode', 'full-page');
		root.setAttribute('component-data', JSON.stringify({ button: { name: 'Button', tokens: ['color--primary'] } }));
		root.setAttribute('token-library', JSON.stringify({ name: 'Tokens', version: '1.0.0', categories: [] }));

		const configuration = parseDesignBuilderRootConfiguration({
			hostElement: root,
			propertyConfig: null,
			propertyTokenData: undefined,
			propertyTokenLibraryData: undefined,
			propertyComponentData: undefined,
		});

		expect(configuration.mode).toBe('full-page');
		expect(configuration.availableModes).toEqual(['full-page', 'component-customizer']);
	});
});
