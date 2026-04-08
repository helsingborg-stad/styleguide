/**
 * Storage Adapters for Design Token Overrides
 *
 * Pluggable storage interface. Default: localStorage.
 * Future: JsonExportAdapter for file download/upload.
 */

import { LEGACY_COMPONENT_STORAGE_KEY } from '../../features/component-customizer/persistence/ComponentOverrideLocalStorageStore';
import { createEmptyOverrideState, type DesignBuilderOverrideState, hasOverrideStateData, normalizeDesignBuilderOverrideState, normalizeTokenOverrides } from '../state/designBuilderOverrideState';

export const STORAGE_KEY = 'design-builder-overrides';
export const LEGACY_TOKEN_STORAGE_KEY = 'design-tokens-overrides';
export const PRESETS_KEY = 'design-tokens-presets';
export const ACTIVE_PRESET_KEY = 'design-tokens-active-preset';

export interface TokenOverrideStore {
	load(): Record<string, string>;
	save(overrides: Record<string, string>): void;
	clear(): void;
}

export class TokenOverrideLocalStorageStore implements TokenOverrideStore {
	private key: string;

	constructor(key: string = STORAGE_KEY) {
		this.key = key;
	}

	load(): Record<string, string> {
		try {
			const raw = localStorage.getItem(this.key);
			if (raw) {
				return normalizeDesignBuilderOverrideState(JSON.parse(raw)).token;
			}

			const legacyRaw = localStorage.getItem(LEGACY_TOKEN_STORAGE_KEY);
			if (!legacyRaw) {
				return {};
			}

			return normalizeDesignBuilderOverrideState(JSON.parse(legacyRaw)).token;
		} catch {
			return {};
		}
	}

	save(overrides: Record<string, string>): void {
		const filtered = normalizeDesignBuilderOverrideState({ token: overrides }).token;
		const nextState = this.loadState();
		nextState.token = filtered;
		this.saveState(nextState);
	}

	clear(): void {
		const nextState = this.loadState();
		nextState.token = {};
		this.saveState(nextState);
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
			const legacyRaw = localStorage.getItem(LEGACY_TOKEN_STORAGE_KEY);
			if (legacyRaw) {
				fallbackState.token = normalizeTokenOverrides(JSON.parse(legacyRaw));
			}
		} catch {
			// Ignore legacy token parse errors.
		}

		try {
			const legacyComponentRaw = localStorage.getItem(LEGACY_COMPONENT_STORAGE_KEY);
			if (legacyComponentRaw) {
				fallbackState.component = normalizeDesignBuilderOverrideState(JSON.parse(legacyComponentRaw)).component;
			}
		} catch {
			// Ignore legacy component parse errors.
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
