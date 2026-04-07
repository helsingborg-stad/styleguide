import { SharedPresetManager, SHARED_PRESETS_KEY } from './SharedPresetManager';

describe('SharedPresetManager', () => {
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

		const presetManager = new SharedPresetManager();

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
		const presetManager = new SharedPresetManager();
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
});
