import type { TokenSetting } from '../control-elements/controls/types';
import type { TokenData } from '../types/designBuilderDataTypes';

type TokenSettingWithResolvableDefault = Omit<TokenSetting, 'default'> & {
	default?: string | null;
	fontSizeScaleStep?: number;
};

function isFiniteNumber(value: unknown): value is number {
	return typeof value === 'number' && Number.isFinite(value);
}

function buildFontSizeScaleDefault(fontSizeScaleStep: number): string {
	if (fontSizeScaleStep === 0) {
		return 'var(--base-font-size)';
	}

	return `calc(var(--base-font-size) * pow(var(--font-size-scale-ratio), ${fontSizeScaleStep}))`;
}

export function resolveTokenSettingDefault(setting: Pick<TokenSettingWithResolvableDefault, 'default' | 'fontSizeScaleStep'>): string {
	if (setting.default !== undefined && setting.default !== null) {
		return String(setting.default);
	}

	if (isFiniteNumber(setting.fontSizeScaleStep)) {
		return buildFontSizeScaleDefault(setting.fontSizeScaleStep);
	}

	return '';
}

export function withResolvedTokenSettingDefaults(tokenData: TokenData): TokenData {
	return {
		...tokenData,
		categories: tokenData.categories.map((category) => ({
			...category,
			settings: category.settings.map((rawSetting) => {
				const setting = rawSetting as TokenSettingWithResolvableDefault;

				return {
					...setting,
					default: resolveTokenSettingDefault(setting),
				};
			}),
		})),
	};
}
