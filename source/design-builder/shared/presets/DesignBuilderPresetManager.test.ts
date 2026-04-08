import { DesignBuilderPresetManager, SHARED_PRESETS_KEY } from './DesignBuilderPresetManager';
import type { DesignBuilderStorageAdapter } from '../persistence/DesignBuilderStorageAdapter';

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

describe('DesignBuilderPresetManager', () => {
	beforeEach(() => {
		localStorage.clear();
	});

	it('merges legacy token and component presets by preset name', () => {
		localStorage.setItem(
			'design-tokens-presets',
			JSON.stringify({
				shared: {
					'--color-primary': '#123456',
				},
			}),
		);
		localStorage.setItem(
			'design-tokens-component-presets',
			JSON.stringify({
				shared: {
					__general__: {
						button: {
							'--c-button--color-bg': '#abcdef',
						},
					},
				},
			}),
		);

		const presetManager = new DesignBuilderPresetManager();

		expect(presetManager.loadAll()).toEqual({
			shared: {
				token: {
					'--color-primary': '#123456',
				},
				component: {
					__general__: {
						button: {
							'--c-button--color-bg': '#abcdef',
						},
					},
				},
			},
		});
	});

	it('stores merged preset documents under the shared preset key', () => {
		const presetManager = new DesignBuilderPresetManager();
		presetManager.save('combined', {
			token: {
				'--color-primary': '#123456',
			},
			component: {
				__general__: {
					button: {
						'--c-button--color-bg': '#abcdef',
					},
				},
			},
		});

		expect(JSON.parse(localStorage.getItem(SHARED_PRESETS_KEY) || '{}')).toEqual({
			combined: {
				token: {
					'--color-primary': '#123456',
				},
				component: {
					__general__: {
						button: {
							'--c-button--color-bg': '#abcdef',
						},
					},
				},
			},
		});
	});

	it('supports injected storage adapters', () => {
		const storage = createMemoryStorage();
		const presetManager = new DesignBuilderPresetManager(SHARED_PRESETS_KEY, 'design-builder-active-preset', storage);

		presetManager.save('combined', {
			token: {
				'--color-primary': '#123456',
			},
			component: {},
		});

		expect(JSON.parse(storage.getItem(SHARED_PRESETS_KEY) || '{}')).toEqual({
			combined: {
				token: {
					'--color-primary': '#123456',
				},
				component: {},
			},
		});
	});
});
