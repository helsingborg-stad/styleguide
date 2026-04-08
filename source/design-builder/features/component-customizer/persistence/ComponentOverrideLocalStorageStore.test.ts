import { GENERAL_SCOPE_KEY } from '../../../shared/constants/designBuilderRuntimeConstants';
import { COMPONENT_STORAGE_KEY, LEGACY_COMPONENT_STORAGE_KEY, ComponentOverrideLocalStorageStore } from './ComponentOverrideLocalStorageStore';
import type { DesignBuilderStorageAdapter } from '../../../shared/persistence/DesignBuilderStorageAdapter';

function createMemoryStorage(initialState: Record<string, string> = {}): DesignBuilderStorageAdapter {
	const storage = new Map(Object.entries(initialState));

	return {
		getItem(key) {
			return storage.get(key) ?? null;
		},
		setItem(key, value) {
			storage.set(key, value);
		},
		removeItem(key) {
			storage.delete(key);
		},
	};
}

describe('ComponentOverrideLocalStorageStore compatibility', () => {
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
		const adapter = new ComponentOverrideLocalStorageStore();

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
		const adapter = new ComponentOverrideLocalStorageStore();

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

		const adapter = new ComponentOverrideLocalStorageStore();

		expect(adapter.load()).toEqual({
			[GENERAL_SCOPE_KEY]: {
				button: {
					'--c-button--color-bg': '#abc',
				},
			},
		});
	});

	it('supports injected storage adapters', () => {
		const storage = createMemoryStorage({
			[COMPONENT_STORAGE_KEY]: JSON.stringify({
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
		});

		const adapter = new ComponentOverrideLocalStorageStore(COMPONENT_STORAGE_KEY, storage);

		expect(adapter.load()).toEqual({
			[GENERAL_SCOPE_KEY]: {
				button: {
					'--c-button--color-bg': '#abc',
				},
			},
		});
	});
});
