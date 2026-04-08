import type { ScopedComponentOverrides } from '../../../shared/types/designBuilderDataTypes';
import { createEmptyOverrideState, hasOverrideStateData, normalizeComponentOverrides, normalizeDesignBuilderOverrideState, normalizeTokenOverrides, type DesignBuilderOverrideState } from '../../../shared/state/designBuilderOverrideState';
import { LEGACY_TOKEN_STORAGE_KEY } from '../../../shared/persistence/TokenOverrideLocalStorageStore';

export const COMPONENT_STORAGE_KEY = 'design-builder-overrides';
export const LEGACY_COMPONENT_STORAGE_KEY = 'design-tokens-component-overrides';
export const COMPONENT_PRESETS_KEY = 'design-tokens-component-presets';
export const COMPONENT_ACTIVE_PRESET_KEY = 'design-tokens-component-active-preset';

export class ComponentOverrideLocalStorageStore {
	private key: string;

	constructor(key: string = COMPONENT_STORAGE_KEY) {
		this.key = key;
	}

	public load(): ScopedComponentOverrides {
		try {
			const raw = localStorage.getItem(this.key);
			if (raw) {
				return normalizeDesignBuilderOverrideState(JSON.parse(raw)).component;
			}

			const legacyRaw = localStorage.getItem(LEGACY_COMPONENT_STORAGE_KEY);
			if (!legacyRaw) return {};
			return normalizeComponentOverrides(JSON.parse(legacyRaw));
		} catch {
			return {};
		}
	}

	public save(overrides: ScopedComponentOverrides): void {
		const nextState = this.loadState();
		nextState.component = this.normalize(overrides);
		this.saveState(nextState);
	}

	public normalize(input: unknown): ScopedComponentOverrides {
		return normalizeComponentOverrides(input);
	}

	private loadState(): DesignBuilderOverrideState {
		const fallbackState = createEmptyOverrideState();

		try {
			const raw = localStorage.getItem(this.key);
			if (raw) {
				return normalizeDesignBuilderOverrideState(JSON.parse(raw));
			}
		} catch {
			// Fall through to legacy migration below.
		}

		try {
			const legacyRaw = localStorage.getItem(LEGACY_COMPONENT_STORAGE_KEY);
			if (legacyRaw) {
				fallbackState.component = normalizeComponentOverrides(JSON.parse(legacyRaw));
			}
		} catch {
			// Ignore legacy component parse errors.
		}

		try {
			const legacyTokenRaw = localStorage.getItem(LEGACY_TOKEN_STORAGE_KEY);
			if (legacyTokenRaw) {
				fallbackState.token = normalizeTokenOverrides(JSON.parse(legacyTokenRaw));
			}
		} catch {
			// Ignore legacy token parse errors.
		}

		return fallbackState;
	}

	private saveState(state: DesignBuilderOverrideState): void {
		if (!hasOverrideStateData(state)) {
			localStorage.removeItem(this.key);
			return;
		}

		localStorage.setItem(this.key, JSON.stringify(state));
	}
}
