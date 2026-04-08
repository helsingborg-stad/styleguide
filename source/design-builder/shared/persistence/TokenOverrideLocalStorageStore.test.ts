import { GENERAL_SCOPE_KEY } from '../constants/designBuilderRuntimeConstants';
import { STORAGE_KEY, TokenOverrideLocalStorageStore } from './TokenOverrideLocalStorageStore';
import type { DesignBuilderStorageAdapter } from './DesignBuilderStorageAdapter';

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

describe('TokenOverrideLocalStorageStore shared override storage', () => {
	beforeEach(() => {
		localStorage.clear();
	});

	it('loads only the token slice from the shared override document', () => {
		localStorage.setItem(
			STORAGE_KEY,
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

		const adapter = new TokenOverrideLocalStorageStore();

		expect(adapter.load()).toEqual({
			'--color-primary': '#123456',
		});
	});

	it('preserves component overrides when saving token overrides', () => {
		localStorage.setItem(
			STORAGE_KEY,
			JSON.stringify({
				token: {},
				component: {
					[GENERAL_SCOPE_KEY]: {
						button: {
							'--c-button--color-bg': '#abc',
						},
					},
				},
			}),
		);

		const adapter = new TokenOverrideLocalStorageStore();
		adapter.save({
			'--color-primary': '#123456',
		});

		expect(JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')).toEqual({
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
		});
	});

	it('supports injected storage adapters', () => {
		const storage = createMemoryStorage({
			[STORAGE_KEY]: JSON.stringify({
				token: {},
				component: {
					[GENERAL_SCOPE_KEY]: {
						button: {
							'--c-button--color-bg': '#abc',
						},
					},
				},
			}),
		});

		const adapter = new TokenOverrideLocalStorageStore(STORAGE_KEY, storage);
		adapter.save({
			'--color-primary': '#123456',
		});

		expect(JSON.parse(storage.getItem(STORAGE_KEY) || '{}')).toEqual({
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
		});
	});
});
