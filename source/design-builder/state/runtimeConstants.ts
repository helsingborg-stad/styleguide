export const COMPONENT_STORAGE_KEY = 'design-builder-overrides';
export const LEGACY_COMPONENT_STORAGE_KEY = 'design-tokens-component-overrides';
export const COMPONENT_PRESETS_KEY = 'design-tokens-component-presets';
export const COMPONENT_ACTIVE_PRESET_KEY = 'design-tokens-component-active-preset';
export const GLOBAL_SCOPE_KEY = '__global__';
export const GENERAL_SCOPE_KEY = '__general__';
export const NON_CUSTOMIZABLE_COMPONENTS = new Set(['scope', 'fab']);
export const CUSTOMIZE_INIT_MODE_ONLOAD = 'onload';
export const CUSTOMIZE_INIT_MODE_MANUAL = 'manual';
export const CUSTOMIZE_MANUAL_TRIGGER_SELECTOR = '[data-customize-init-fab]';

export type CustomizeInitMode = typeof CUSTOMIZE_INIT_MODE_ONLOAD | typeof CUSTOMIZE_INIT_MODE_MANUAL;

export const SPLIT_STORAGE_KEY = 'design-builder-split';
export const MIN_SPLIT = 20;
export const MAX_SPLIT = 80;
