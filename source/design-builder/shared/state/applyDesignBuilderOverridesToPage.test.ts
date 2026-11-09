import { applyDefaultThemeVariantsToPage, applyThemeOverridesToPage } from './applyDesignBuilderOverridesToPage';

describe('applyThemeOverridesToPage', () => {
	afterEach(() => {
		document.getElementById('design-builder-theme-overrides')?.remove();
		document.getElementById('default-theme-variants')?.remove();
	});

	it('replaces the server-rendered variants when a preset has its own theme slices', () => {
		document.head.insertAdjacentHTML('beforeend', '<style id="default-theme-variants">:root { --color--primary: #000000; }</style>');

		applyDefaultThemeVariantsToPage({ '--color--primary': '#9cc2ff' }, null);
		expect(document.getElementById('default-theme-variants')?.textContent).toContain('--color--primary: #9cc2ff;');

		applyDefaultThemeVariantsToPage(null, null);
		expect(document.getElementById('default-theme-variants')).toBeNull();
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
