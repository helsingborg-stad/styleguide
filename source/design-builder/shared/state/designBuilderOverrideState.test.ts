import { GENERAL_SCOPE_KEY } from '../constants/designBuilderRuntimeConstants';
import { normalizeComponentOverrides, normalizeDesignBuilderOverrideState, normalizeTokenOverrides } from './designBuilderOverrideState';

describe('designBuilderOverrideState normalization', () => {
	it('preserves numeric token overrides by stringifying them', () => {
		expect(
			normalizeTokenOverrides({
				'--color-primary': '#123456',
				'--border-radius': 4,
				'--empty': '',
			}),
		).toEqual({
			'--color-primary': '#123456',
			'--border-radius': '4',
		});
	});

	it('preserves numeric component overrides by stringifying them', () => {
		expect(
			normalizeComponentOverrides({
				[GENERAL_SCOPE_KEY]: {
					button: {
						'--c-button--border-radius': 4,
						'--c-button--color-bg': '#abcdef',
						'--c-button--empty': '',
					},
				},
			}),
		).toEqual({
			[GENERAL_SCOPE_KEY]: {
				button: {
					'--c-button--border-radius': '4',
					'--c-button--color-bg': '#abcdef',
				},
			},
		});
	});

	it('preserves numeric overrides across the full shared state shape', () => {
		expect(
			normalizeDesignBuilderOverrideState({
				token: {
					'--border-radius': 1.5,
				},
				component: {
					[GENERAL_SCOPE_KEY]: {
						button: {
							'--c-button--border-radius': 4,
						},
					},
				},
			}),
		).toEqual({
			token: {
				'--border-radius': '1.5',
			},
			component: {
				[GENERAL_SCOPE_KEY]: {
					button: {
						'--c-button--border-radius': '4',
					},
				},
			},
		});
	});

	it('treats legacy unscoped numeric component overrides as general scoped overrides', () => {
		expect(
			normalizeComponentOverrides({
				button: {
					'--c-button--border-radius': 4,
				},
			}),
		).toEqual({
			[GENERAL_SCOPE_KEY]: {
				button: {
					'--c-button--border-radius': '4',
				},
			},
		});
	});
});
