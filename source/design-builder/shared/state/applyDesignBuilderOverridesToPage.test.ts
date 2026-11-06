import { applyThemeOverridesToPage } from './applyDesignBuilderOverridesToPage';

describe('applyThemeOverridesToPage', () => {
	afterEach(() => {
		document.getElementById('design-builder-theme-overrides')?.remove();
	});

	it('writes separate dark and high-contrast media rules without changing base variables', () => {
		applyThemeOverridesToPage(
			{ '--color--primary': '#9cc2ff' },
			{ '--color--primary': '#ffffff', '--shadow-amount': '0' },
		);

		const css = document.getElementById('design-builder-theme-overrides')?.textContent;
		expect(css).toContain('@media (prefers-color-scheme: dark)');
		expect(css).toContain('--color--primary: #9cc2ff;');
		expect(css).toContain('@media (prefers-contrast: more), (forced-colors: active)');
		expect(css).toContain('--shadow-amount: 0;');
	});

	it('removes the generated stylesheet when both variants are absent', () => {
		applyThemeOverridesToPage({ '--color--primary': '#9cc2ff' }, null);
		expect(document.getElementById('design-builder-theme-overrides')).toBeTruthy();

		applyThemeOverridesToPage(null, null);
		expect(document.getElementById('design-builder-theme-overrides')).toBeNull();
	});
});
