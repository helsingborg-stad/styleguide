// Core portable module — no styleguide-specific dependencies

export type {
	TokenSetting,
	TokenCategory,
	TokenData,
	ChangeCallback,
	ComponentTokenDefinition,
	ComponentTokenData,
	ComponentVariableOverrides,
	ComponentOverrides,
	ScopedComponentOverrides,
} from './types';

export { hexToRgb, parseRgba, toRgbaString, toHex } from './color-utils';
export { LocalStorageAdapter, PresetManager, type StorageAdapter, STORAGE_KEY, PRESETS_KEY, ACTIVE_PRESET_KEY } from './storage';
export { TokenOverrideManager } from './token-override-manager';
export {
	ComponentDiscovery,
	normalizeComponentName,
	getScopeKeyForElement,
	getScopeLabel,
	getScopeOptionLabel,
	GLOBAL_SCOPE_KEY,
	GENERAL_SCOPE_KEY,
} from './component-discovery';
export { buildCategoriesForComponent } from './component-token-mapper';
export { ComponentOverrideManager } from './component-override-manager';
export {
	DbControl,
	DbColorControl,
	DbRgbaControl,
	DbRangeControl,
	DbSelectControl,
	DbFontControl,
	DbContrastPair,
	DbSwatchBand,
} from './components';
export { DbPresetBar } from './components/db-preset-bar';
