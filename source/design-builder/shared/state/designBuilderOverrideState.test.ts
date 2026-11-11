import { GENERAL_SCOPE_KEY } from '../constants/designBuilderRuntimeConstants';
import { getSchemeComponentOverrides, normalizeComponentOverrides, normalizeDesignBuilderOverrideState, normalizeTokenOverrides } from './designBuilderOverrideState';

describe('designBuilderOverrideState normalization', () => {
	it('masks other schemes during forced previews without persisting reset values', () => {
		const state = normalizeDesignBuilderOverrideState({
			token: {},
			component: { __general__: { footer: { '--c-footer--color--surface': 'var(--color--primary)' } } },
			componentSchemes: { dark: { 'scope:footer': { footer: { '--c-footer--color--surface': 'var(--color--secondary)', '--c-footer--color': 'var(--color--secondary-contrast)' } } } },
		});
		expect(getSchemeComponentOverrides(state, 'contrast', true)['scope:footer'].footer).toEqual({ '--c-footer--color--surface': 'var(--color--primary)', '--c-footer--color': 'initial' });
		expect(getSchemeComponentOverrides(state, 'base')).toEqual(state.component);
		expect(JSON.stringify(state)).not.toContain('initial');
	});
	it('round trips sparse scoped scheme assignments without changing Default', () => {
		const state = normalizeDesignBuilderOverrideState({
			token: {},
			component: { 'scope:footer': { button: { '--c-button--color--primary': 'var(--color--primary)', '--c-button--space': '2rem' } } },
			componentSchemes: { dark: { 'scope:footer': { button: { '--c-button--color--primary': 'var(--color--palette-1)' } } }, contrast: {}, unknown: { bad: {} } },
		});
		expect(normalizeDesignBuilderOverrideState(JSON.parse(JSON.stringify(state)))).toEqual(state);
		expect(state.componentSchemes).not.toHaveProperty('unknown');
		expect(getSchemeComponentOverrides(state, 'base')['scope:footer'].button['--c-button--color--primary']).toBe('var(--color--primary)');
		expect(getSchemeComponentOverrides(state, 'dark')['scope:footer'].button).toEqual({ '--c-button--color--primary': 'var(--color--palette-1)', '--c-button--space': '2rem' });
		expect(getSchemeComponentOverrides(state, 'contrast')).toEqual(state.component);
	});
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

	it('keeps optional dark and high-contrast maps while accepting null themes', () => {
		expect(
			normalizeDesignBuilderOverrideState({
				token: { '--color--primary': '#0055aa' },
				_dark: null,
				_contrast: { '--color--primary': '#ffffff', '--color--primary-border': 1 },
				component: {},
			}),
		).toEqual({
			token: { '--color--primary': '#0055aa' },
			_dark: null,
			_contrast: { '--color--primary': '#ffffff', '--color--primary-border': '1' },
			component: {},
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
