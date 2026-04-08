import { resolveStyleguideDesignBuilderRootElements } from './resolveStyleguideDesignBuilderRootElements';
import { STORAGE_KEY } from '../../shared/persistence/TokenOverrideLocalStorageStore';

describe('resolveStyleguideDesignBuilderRootElements', () => {
	beforeEach(() => {
		document.body.innerHTML = '';
		localStorage.clear();
	});

	it('normalizes and returns all explicit design-builder roots on the page', () => {
		document.body.innerHTML = `
			<design-builder token-data='{"name":"tokens"}'></design-builder>
			<design-builder data-component-data='{"button":{"name":"Button","tokens":["color--primary"]}}' data-token-library='{"name":"tokens","version":"1.0.0","categories":[]}'></design-builder>
		`;

		const roots = resolveStyleguideDesignBuilderRootElements();

		expect(roots).toHaveLength(2);
		expect(roots[1].getAttribute('component-data')).toContain('"button"');
		expect(roots[1].getAttribute('token-library')).toContain('"categories"');
	});

	it('hydrates persisted override state and binds the default save adapter', () => {
		localStorage.setItem(
			STORAGE_KEY,
			JSON.stringify({
				token: { '--color-primary': '#123456' },
				component: {
					__general__: {
						button: {
							'--c-button--color-primary': '#654321',
						},
					},
				},
			}),
		);
		document.body.innerHTML = `<design-builder token-data='{"name":"tokens"}'></design-builder>`;

		const [root] = resolveStyleguideDesignBuilderRootElements();
		expect(root.getAttribute('override-state')).toContain('"--color-primary"');

		root.dispatchEvent(
			new CustomEvent('design-builder:save', {
				detail: {
					state: {
						token: { '--color-primary': '#abcdef' },
						component: {
							__general__: {
								button: {
									'--c-button--color-primary': '#fedcba',
								},
							},
						},
					},
				},
			}),
		);

		expect(JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')).toEqual({
			token: { '--color-primary': '#abcdef' },
			component: {
				__general__: {
					button: {
						'--c-button--color-primary': '#fedcba',
					},
				},
			},
		});
	});
});
