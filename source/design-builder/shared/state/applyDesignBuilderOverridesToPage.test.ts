import { applyComponentOverridesToPage, applyTokenOverridesToRootDocument, clearComponentOverridesFromPage, clearTokenOverridesFromRootDocument } from './applyDesignBuilderOverridesToPage';
import { GENERAL_SCOPE_KEY } from '../constants/designBuilderRuntimeConstants';

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
});
