import { readFileSync } from 'node:fs';

type DefaultTheme = {
	token: Record<string, string>;
	_dark: Record<string, string>;
	_contrast: Record<string, string>;
	component: Record<string, unknown>;
};

describe('default theme variants', () => {
	const theme = JSON.parse(readFileSync('source/themes/default.json', 'utf8')) as DefaultTheme;

	it('defines native dark and contrast colour slices without importing unrelated tokens', () => {
		expect(theme.token).toEqual({});
		expect(theme.component).toEqual({});
		expect(theme._dark['--color--surface']).toBe('#1f1f1f');
		expect(theme._contrast['--color--background']).toBe('#000000');
		expect(theme._dark['--c-link--color-mix-amount']).toBe('90%');
		expect(theme._contrast['--c-link--state-color-mix-amount']).toBe('100%');

		for (const variant of [theme._dark, theme._contrast]) {
			expect(Object.keys(variant).some((token) => token.endsWith('-border') || token.endsWith('-alt') || token.endsWith('-contrast-muted') && token !== '--color--background-contrast-muted' && token !== '--color--surface-contrast-muted')).toBe(false);
		}
	});
});
