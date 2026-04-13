import { resolveStyleguideDesignBuilderRootElements } from './resolveStyleguideDesignBuilderRootElements';
import { DESIGN_BUILDER_STORAGE_ATTRIBUTE, LOCAL_STORAGE_PERSISTENCE_MODE } from '../../shared/persistence/designBuilderStorageOptIn';
import { STORAGE_KEY } from '../../shared/persistence/TokenOverrideLocalStorageStore';

describe('resolveStyleguideDesignBuilderRootElements', () => {
	beforeEach(() => {
		document.body.innerHTML = '';
		localStorage.clear();
		document.documentElement.removeAttribute(DESIGN_BUILDER_STORAGE_ATTRIBUTE);
	});

	it('normalizes and returns all explicit design-builder roots on the page', () => {
		document.body.innerHTML = `
			<design-builder token-data='{"name":"tokens"}'></design-builder>
			<design-builder data-component-data='{"button":{"name":"Button","tokens":["color--primary"]}}' data-token-library='{"name":"tokens","version":"1.0.0","categories":[]}' data-show-save-button="false"></design-builder>
		`;

		const roots = resolveStyleguideDesignBuilderRootElements();

		expect(roots).toHaveLength(2);
		expect(roots[1].getAttribute('component-data')).toContain('"button"');
		expect(roots[1].getAttribute('token-library')).toContain('"categories"');
		expect(roots[1].getAttribute('show-save-button')).toBe('false');
	});

	it('hydrates persisted override state and binds the default save adapter when localStorage is enabled', () => {
		document.documentElement.setAttribute(DESIGN_BUILDER_STORAGE_ATTRIBUTE, LOCAL_STORAGE_PERSISTENCE_MODE);
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

	it('does not hydrate persisted override state or bind save persistence without a localStorage opt-in', () => {
		localStorage.setItem(
			STORAGE_KEY,
			JSON.stringify({
				token: { '--color-primary': '#123456' },
			}),
		);
		document.body.innerHTML = `<design-builder token-data='{"name":"tokens"}'></design-builder>`;

		const [root] = resolveStyleguideDesignBuilderRootElements();
		expect(root.hasAttribute('override-state')).toBe(false);

		root.dispatchEvent(
			new CustomEvent('design-builder:save', {
				detail: {
					state: {
						token: { '--color-primary': '#abcdef' },
						component: {},
					},
				},
			}),
		);

		expect(JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')).toEqual({
			token: { '--color-primary': '#123456' },
		});
	});

	it('normalizes legacy containers into explicit design-builder roots', () => {
		document.body.innerHTML = `
			<div
				data-design-builder
				data-component-data='{"button":{"name":"Button","tokens":["color--primary"]}}'
				data-token-library='{"name":"tokens","version":"1.0.0","categories":[]}'
			>
				Legacy content
			</div>
		`;

		const [root] = resolveStyleguideDesignBuilderRootElements();

		expect(root.tagName.toLowerCase()).toBe('design-builder');
		expect(root.getAttribute('component-data')).toContain('"button"');
		expect(root.getAttribute('token-library')).toContain('"categories"');
		expect(root.innerHTML).toContain('Legacy content');
	});

	it('does not create hidden roots when no design-builder markup exists', () => {
		document.body.innerHTML = '<div>No design builder root</div>';

		expect(resolveStyleguideDesignBuilderRootElements()).toEqual([]);
		expect(document.querySelector('design-builder')).toBeNull();
	});
});
