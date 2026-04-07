/**
 * Storage Adapters for Design Token Overrides
 *
 * Pluggable storage interface. Default: localStorage.
 * Future: JsonExportAdapter for file download/upload.
 */

import {
	createEmptyOverrideState,
	hasOverrideStateData,
	normalizeDesignBuilderOverrideState,
	normalizeTokenOverrides,
	type DesignBuilderOverrideState,
} from './services/overrideState';
import { LEGACY_COMPONENT_STORAGE_KEY } from './state/runtimeConstants';

export const STORAGE_KEY = 'design-builder-overrides';
export const LEGACY_TOKEN_STORAGE_KEY = 'design-tokens-overrides';
export const PRESETS_KEY = 'design-tokens-presets';
export const ACTIVE_PRESET_KEY = 'design-tokens-active-preset';

export interface StorageAdapter {
	load(): Record<string, string>;
	save(overrides: Record<string, string>): void;
	clear(): void;
}

export class LocalStorageAdapter implements StorageAdapter {
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

export class PresetManager<PresetValue extends object = Record<string, string>> {
	private presetsKey: string;
	private activeKey: string;

	constructor(presetsKey: string = PRESETS_KEY, activeKey: string = ACTIVE_PRESET_KEY) {
		this.presetsKey = presetsKey;
		this.activeKey = activeKey;
	}

	loadAll(): Record<string, PresetValue> {
		try {
			const raw = localStorage.getItem(this.presetsKey);
			return raw ? (JSON.parse(raw) as Record<string, PresetValue>) : {};
		} catch {
			return {};
		}
	}

	save(name: string, overrides: PresetValue): void {
		const all = this.loadAll();
		all[name] = { ...overrides };
		localStorage.setItem(this.presetsKey, JSON.stringify(all));
	}

	delete(name: string): void {
		const all = this.loadAll();
		delete all[name];
		if (Object.keys(all).length === 0) {
			localStorage.removeItem(this.presetsKey);
		} else {
			localStorage.setItem(this.presetsKey, JSON.stringify(all));
		}
		if (this.getActive() === name) {
			this.clearActive();
		}
	}

	getActive(): string | null {
		return localStorage.getItem(this.activeKey);
	}

	setActive(name: string): void {
		localStorage.setItem(this.activeKey, name);
	}

	clearActive(): void {
		localStorage.removeItem(this.activeKey);
	}

	names(): string[] {
		return Object.keys(this.loadAll()).sort();
	}
}
