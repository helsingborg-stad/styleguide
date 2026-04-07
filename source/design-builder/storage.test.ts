import { LocalStorageAdapter, STORAGE_KEY } from './storage';
import { GENERAL_SCOPE_KEY } from './state/runtimeConstants';

describe('LocalStorageAdapter shared override storage', () => {
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

		const adapter = new LocalStorageAdapter();

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

		const adapter = new LocalStorageAdapter();
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
});
