import type { TokenSetting } from '../../shared/control-elements/controls/types';
import type {
	ComponentSettingCategory,
	ComponentSettingDefinition,
	ComponentTokenData,
	ComponentTokenReferenceSetting,
} from '../../shared/types/designBuilderDataTypes';

function isRecord(value: unknown): value is Record<string, unknown> {
	return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function normalizeComponentVariableSetting(setting: unknown): TokenSetting | null {
	if (!isRecord(setting)) {
		return null;
	}

	const variable = typeof setting.variable === 'string' ? setting.variable.trim() : '';
	const label = typeof setting.label === 'string' ? setting.label.trim() : '';
	const type = typeof setting.type === 'string' ? setting.type.trim() : '';
	const defaultValue = setting.default;

	if (!variable.startsWith('--') || label === '' || type === '' || defaultValue === undefined || defaultValue === null) {
		return null;
	}

	const normalized: TokenSetting = {
		variable,
		label,
		type: type as TokenSetting['type'],
		default: String(defaultValue),
	};

	if (typeof setting.description === 'string' && setting.description.trim() !== '') {
		normalized.description = setting.description.trim();
	}

	if (typeof setting.unit === 'string') {
		normalized.unit = setting.unit;
	}

	if (typeof setting.locked === 'boolean') {
		normalized.locked = setting.locked;
	}

	if (typeof setting.min === 'number') {
		normalized.min = setting.min;
	}

	if (typeof setting.max === 'number') {
		normalized.max = setting.max;
	}

	if (typeof setting.step === 'number') {
		normalized.step = setting.step;
	}

	if (Array.isArray(setting.options)) {
		const options = setting.options
			.filter(isRecord)
			.map((option) => {
				const value = typeof option.value === 'string' ? option.value : null;
				const optionLabel = typeof option.label === 'string' ? option.label : null;
				return value && optionLabel ? { value, label: optionLabel } : null;
			})
			.filter((option): option is { value: string; label: string } => option !== null);

		if (options.length > 0) {
			normalized.options = options;
		}
	}

	if (typeof setting.contrast === 'string') {
		normalized.contrast = setting.contrast;
	} else if (Array.isArray(setting.contrast)) {
		const contrast = setting.contrast.filter((value): value is string => typeof value === 'string' && value.trim() !== '');
		if (contrast.length > 0) {
			normalized.contrast = contrast;
		}
	}

	return normalized;
}

function normalizeComponentTokenReferenceSetting(setting: unknown): ComponentTokenReferenceSetting | null {
	if (!isRecord(setting)) {
		return null;
	}

	const token = typeof setting.token === 'string' ? setting.token.trim() : '';
	const label = typeof setting.label === 'string' ? setting.label.trim() : '';

	if (token === '' || label === '') {
		return null;
	}

	const normalized: ComponentTokenReferenceSetting = {
		token,
		label,
	};

	if (typeof setting.description === 'string' && setting.description.trim() !== '') {
		normalized.description = setting.description.trim();
	}

	return normalized;
}

function normalizeComponentSetting(setting: unknown): ComponentSettingDefinition | null {
	return normalizeComponentVariableSetting(setting) ?? normalizeComponentTokenReferenceSetting(setting);
}

function normalizeComponentSettings(input: unknown): ComponentSettingCategory[] {
	if (!Array.isArray(input)) {
		return [];
	}

	return input
		.filter(isRecord)
		.map((category) => {
			const id = typeof category.id === 'string' ? category.id.trim() : '';
			const label = typeof category.label === 'string' ? category.label.trim() : '';
			const settings = Array.isArray(category.settings)
				? category.settings.map(normalizeComponentSetting).filter((setting): setting is ComponentSettingDefinition => setting !== null)
				: [];

			if (id === '' || label === '' || settings.length === 0) {
				return null;
			}

			const normalized: ComponentSettingCategory = {
				id,
				label,
				settings,
			};

			if (typeof category.description === 'string' && category.description.trim() !== '') {
				normalized.description = category.description.trim();
			}

			if (category.present === 'swatch') {
				normalized.present = 'swatch';
			}

			return normalized;
		})
		.filter((category): category is ComponentSettingCategory => category !== null);
}

export function normalizeComponentName(value: string): string {
	return value.trim().toLowerCase().replace(/^c-/, '');
}

export function parseComponentTokenData(raw: unknown): ComponentTokenData {
	if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
		return {};
	}

	const parsed: ComponentTokenData = {};
	for (const [key, value] of Object.entries(raw)) {
		const normalizedKey = normalizeComponentName(key);
		if (!normalizedKey) continue;

		if (!value || typeof value !== 'object' || Array.isArray(value)) {
			continue;
		}

		const definition = value as Record<string, unknown>;
		parsed[normalizedKey] = {
			name: typeof definition.name === 'string' ? definition.name : undefined,
			slug: typeof definition.slug === 'string' ? normalizeComponentName(definition.slug) : normalizedKey,
			tokens: Array.isArray(definition.tokens)
				? definition.tokens
						.filter((token): token is string => typeof token === 'string')
						.map((token) => token.trim())
						.filter(Boolean)
				: [],
			componentSettings: normalizeComponentSettings(definition.componentSettings),
		};
	}

	return parsed;
}
