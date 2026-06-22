import type { TokenData } from '../types/designBuilderDataTypes';
import { resolveTokenSettingDefault, withResolvedTokenSettingDefaults } from './resolveTokenSettingDefault';

describe('resolveTokenSettingDefault', () => {
	it('returns an explicit default before deriving a font-size scale value', () => {
		expect(resolveTokenSettingDefault({ default: '18px', fontSizeScaleStep: 2 })).toBe('18px');
	});

	it('derives the base font size from scale step zero', () => {
		expect(resolveTokenSettingDefault({ fontSizeScaleStep: 0 })).toBe('var(--base-font-size)');
	});

	it('derives a font-size scale formula from non-zero scale steps', () => {
		expect(resolveTokenSettingDefault({ fontSizeScaleStep: -0.6 })).toBe('calc(var(--base-font-size) * pow(var(--font-size-scale-ratio), -0.6))');
	});

	it('normalizes token data without mutating the raw token setting', () => {
		const rawSetting = {
			variable: '--font-size-200',
			label: 'Font Size 200',
			type: 'range',
			fontSizeScaleStep: 1,
			locked: true,
		};
		const tokenData = {
			name: 'Design System',
			version: '1.0.0',
			categories: [
				{
					id: 'font-sizes',
					label: 'Font Sizes',
					settings: [rawSetting],
				},
			],
		} as unknown as TokenData;

		const normalizedTokenData = withResolvedTokenSettingDefaults(tokenData);

		expect(normalizedTokenData.categories[0].settings[0].default).toBe('calc(var(--base-font-size) * pow(var(--font-size-scale-ratio), 1))');
		expect(rawSetting).not.toHaveProperty('default');
	});
});
