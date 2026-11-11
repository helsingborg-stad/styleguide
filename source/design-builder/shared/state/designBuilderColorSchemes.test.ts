import { getPreferredDesignBuilderColorScheme } from './designBuilderColorSchemes';

describe('getPreferredDesignBuilderColorScheme', () => {
	const originalMatchMedia = Object.getOwnPropertyDescriptor(window, 'matchMedia');

	afterEach(() => {
		if (originalMatchMedia) Object.defineProperty(window, 'matchMedia', originalMatchMedia);
		else Reflect.deleteProperty(window, 'matchMedia');
	});

	it.each([
		[[], 'base'],
		[['(prefers-color-scheme: dark)'], 'dark'],
		[['(prefers-contrast: more)'], 'contrast'],
		[['(forced-colors: active)'], 'contrast'],
		[['(prefers-color-scheme: dark)', '(prefers-contrast: more)'], 'contrast'],
		[['(prefers-color-scheme: dark)', '(forced-colors: active)'], 'contrast'],
	] as const)('resolves %j to %s', (matches, expected) => {
		Object.defineProperty(window, 'matchMedia', {
			configurable: true,
			value: (query: string) => ({ matches: (matches as readonly string[]).includes(query) }),
		});
		expect(getPreferredDesignBuilderColorScheme()).toBe(expected);
	});

	it('falls back to Default when media queries are unavailable', () => {
		Reflect.deleteProperty(window, 'matchMedia');
		expect(getPreferredDesignBuilderColorScheme()).toBe('base');
	});
});
