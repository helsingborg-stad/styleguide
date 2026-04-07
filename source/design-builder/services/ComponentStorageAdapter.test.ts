import { ComponentStorageAdapter } from './ComponentStorageAdapter';
import { COMPONENT_STORAGE_KEY, GENERAL_SCOPE_KEY, LEGACY_COMPONENT_STORAGE_KEY } from '../state/runtimeConstants';

describe('ComponentStorageAdapter compatibility', () => {
	beforeEach(() => {
		localStorage.clear();
	});

	it('migrates legacy unscoped overrides into general scope', () => {
		const legacyOverrides = {
			button: {
				'--c-button--color-bg': '#fff',
			},
		};

		localStorage.setItem(LEGACY_COMPONENT_STORAGE_KEY, JSON.stringify(legacyOverrides));
		const adapter = new ComponentStorageAdapter();

		expect(adapter.load()).toEqual({
			[GENERAL_SCOPE_KEY]: legacyOverrides,
		});
	});

	it('normalizes legacy global scope key to general scope when loading scoped data', () => {
		const scopedOverrides = {
			__global__: {
				button: {
					'--c-button--color-bg': '#111',
				},
			},
			scope: {
				button: {
					'--c-button--color-bg': '#222',
				},
			},
		};

		localStorage.setItem(LEGACY_COMPONENT_STORAGE_KEY, JSON.stringify(scopedOverrides));
		const adapter = new ComponentStorageAdapter();

		expect(adapter.load()).toEqual({
			[GENERAL_SCOPE_KEY]: {
				button: {
					'--c-button--color-bg': '#111',
				},
			},
			scope: {
				button: {
					'--c-button--color-bg': '#222',
				},
			},
		});
	});

	it('reads component overrides from the shared merged storage shape', () => {
		localStorage.setItem(
			COMPONENT_STORAGE_KEY,
			JSON.stringify({
				token: {
					'--color-primary': '#123456',
				},
				component: {
					[GENERAL_SCOPE_KEY]: {
						button: {
							'--c-button--color-bg': '#abc',
						},
					},
				},
			}),
		);

		const adapter = new ComponentStorageAdapter();

		expect(adapter.load()).toEqual({
			[GENERAL_SCOPE_KEY]: {
				button: {
					'--c-button--color-bg': '#abc',
				},
			},
		});
	});
});
