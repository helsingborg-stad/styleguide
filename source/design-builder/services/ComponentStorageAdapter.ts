import { COMPONENT_STORAGE_KEY, LEGACY_COMPONENT_STORAGE_KEY } from '../state/runtimeConstants';
import type { ScopedComponentOverrides } from '../types/runtime';
import {
	createEmptyOverrideState,
	hasOverrideStateData,
	normalizeComponentOverrides,
	normalizeDesignBuilderOverrideState,
	normalizeTokenOverrides,
	type DesignBuilderOverrideState,
} from './overrideState';
import { LEGACY_TOKEN_STORAGE_KEY } from '../storage';

export class ComponentStorageAdapter {
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
