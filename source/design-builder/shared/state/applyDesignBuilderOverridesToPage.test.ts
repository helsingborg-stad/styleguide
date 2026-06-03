import { GENERAL_SCOPE_KEY } from '../constants/designBuilderRuntimeConstants';
import { applyComponentOverridesToPage, applyTokenOverridesToRootDocument, clearComponentOverridesFromPage, clearTokenOverridesFromRootDocument } from './applyDesignBuilderOverridesToPage';

describe('applyDesignBuilderOverridesToPage', () => {
	beforeEach(() => {
		document.body.innerHTML = `
			<div data-component="button"></div>
		`;
		document.documentElement.style.removeProperty('--color-primary');
	});

	afterEach(() => {
		document.body.innerHTML = '';
		document.documentElement.style.removeProperty('--color-primary');
	});

	it('applies and clears token overrides on the document root', () => {
		applyTokenOverridesToRootDocument({
			'--color-primary': '#123456',
		});

		expect(document.documentElement.style.getPropertyValue('--color-primary')).toBe('#123456');

		clearTokenOverridesFromRootDocument({
			'--color-primary': '#123456',
		});

		expect(document.documentElement.style.getPropertyValue('--color-primary')).toBe('');
	});

	it('applies and clears component overrides on matching component elements', () => {
		const target = document.querySelector<HTMLElement>('[data-component="button"]');
		const overrides = {
			[GENERAL_SCOPE_KEY]: {
				button: {
					'--c-button--color-bg': '#abcdef',
				},
			},
		};

		applyComponentOverridesToPage(overrides);
		expect(target?.style.getPropertyValue('--c-button--color-bg')).toBe('#abcdef');

		clearComponentOverridesFromPage(overrides);
		expect(target?.style.getPropertyValue('--c-button--color-bg')).toBe('');
	});

	it('applies and clears drawer component overrides on the adjacent overlay', () => {
		document.body.innerHTML = `
			<nav data-component="drawer"></nav>
			<div class="drawer-overlay"></div>
		`;

		const drawer = document.querySelector<HTMLElement>('[data-component="drawer"]');
		const overlay = document.querySelector<HTMLElement>('.drawer-overlay');
		const overrides = {
			[GENERAL_SCOPE_KEY]: {
				drawer: {
					'--c-drawer--color--alpha': 'rgba(0, 0, 0, 0.75)',
				},
			},
		};

		applyComponentOverridesToPage(overrides);
		expect(drawer?.style.getPropertyValue('--c-drawer--color--alpha')).toBe('rgba(0, 0, 0, 0.75)');
		expect(overlay?.style.getPropertyValue('--c-drawer--color--alpha')).toBe('rgba(0, 0, 0, 0.75)');

		clearComponentOverridesFromPage(overrides);
		expect(drawer?.style.getPropertyValue('--c-drawer--color--alpha')).toBe('');
		expect(overlay?.style.getPropertyValue('--c-drawer--color--alpha')).toBe('');
	});

	it('treats semicolon-separated scope lists as individual named scopes', () => {
		document.body.innerHTML = `
			<div data-scope="scope-1; scope-2;">
				<div data-component="button"></div>
			</div>
		`;

		const target = document.querySelector<HTMLElement>('[data-component="button"]');
		const overrides = {
			'scope:scope-2': {
				button: {
					'--c-button--color-bg': '#abcdef',
				},
			},
		};

		applyComponentOverridesToPage(overrides);
		expect(target?.style.getPropertyValue('--c-button--color-bg')).toBe('#abcdef');

		clearComponentOverridesFromPage(overrides);
		expect(target?.style.getPropertyValue('--c-button--color-bg')).toBe('');
	});

	it('applies overrides from outer ancestor scopes when a closer scope exists', () => {
		document.body.innerHTML = `
			<div data-scope="s-post-type-page">
				<div data-scope="s-drawer">
					<div data-component="button"></div>
				</div>
			</div>
		`;

		const target = document.querySelector<HTMLElement>('[data-component="button"]');
		const overrides = {
			'scope:s-post-type-page': {
				button: {
					'--c-button--color-bg': '#abcdef',
				},
			},
		};

		applyComponentOverridesToPage(overrides);
		expect(target?.style.getPropertyValue('--c-button--color-bg')).toBe('#abcdef');

		clearComponentOverridesFromPage(overrides);
		expect(target?.style.getPropertyValue('--c-button--color-bg')).toBe('');
	});

	it('keeps general overrides from overwriting elements with any matching local scope override', () => {
		document.body.innerHTML = `
			<div data-scope="scope-1; scope-2;">
				<div data-component="button"></div>
			</div>
		`;

		const target = document.querySelector<HTMLElement>('[data-component="button"]');
		const overrides = {
			[GENERAL_SCOPE_KEY]: {
				button: {
					'--c-button--color-bg': '#111111',
				},
			},
			'scope:scope-2': {
				button: {
					'--c-button--color-bg': '#222222',
				},
			},
		};

		applyComponentOverridesToPage(overrides);
		expect(target?.style.getPropertyValue('--c-button--color-bg')).toBe('#222222');
	});
});
