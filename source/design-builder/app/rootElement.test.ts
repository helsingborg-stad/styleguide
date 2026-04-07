import { resolveRootElementsToInitialize } from './rootElement';

describe('resolveRootElementsToInitialize', () => {
	beforeEach(() => {
		document.body.innerHTML = '';
	});

	it('normalizes and returns all explicit design-builder roots on the page', () => {
		document.body.innerHTML = `
			<design-builder token-data='{"name":"tokens"}'></design-builder>
			<design-builder data-component-data='{"button":{"name":"Button","tokens":["color--primary"]}}' data-token-library='{"name":"tokens","version":"1.0.0","categories":[]}'></design-builder>
		`;

		const roots = resolveRootElementsToInitialize();

		expect(roots).toHaveLength(2);
		expect(roots[1].getAttribute('component-data')).toContain('"button"');
		expect(roots[1].getAttribute('token-library')).toContain('"categories"');
	});
});
