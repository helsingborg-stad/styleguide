import { COMPONENT_ACTIVE_PRESET_KEY, COMPONENT_PRESETS_KEY } from '../../features/component-customizer/persistence/ComponentOverrideLocalStorageStore';
import { ACTIVE_PRESET_KEY, PRESETS_KEY } from '../persistence/TokenOverrideLocalStorageStore';
import { normalizeDesignBuilderOverrideState, type DesignBuilderOverrideState } from '../state/designBuilderOverrideState';
import { browserLocalStorageAdapter, type DesignBuilderStorageAdapter } from '../persistence/DesignBuilderStorageAdapter';

export const SHARED_PRESETS_KEY = 'design-builder-presets';
export const SHARED_ACTIVE_PRESET_KEY = 'design-builder-active-preset';

export class DesignBuilderPresetManager {
	private presetsKey: string;
	private activeKey: string;
	private storage: DesignBuilderStorageAdapter;

	constructor(
		presetsKey: string = SHARED_PRESETS_KEY,
		activeKey: string = SHARED_ACTIVE_PRESET_KEY,
		storage: DesignBuilderStorageAdapter = browserLocalStorageAdapter,
	) {
		this.presetsKey = presetsKey;
		this.activeKey = activeKey;
		this.storage = storage;
	}

	public loadAll(): Record<string, DesignBuilderOverrideState> {
		try {
			const raw = this.storage.getItem(this.presetsKey);
			if (raw) {
				return this.normalizePresetCollection(JSON.parse(raw));
			}
		} catch {
			// Fall through to legacy migration below.
		}

		return this.loadLegacyPresets();
	}

	public save(name: string, overrides: DesignBuilderOverrideState): void {
		const all = this.loadAll();
		all[name] = normalizeDesignBuilderOverrideState(overrides);
		this.storage.setItem(this.presetsKey, JSON.stringify(all));
	}

	public delete(name: string): void {
		const all = this.loadAll();
		delete all[name];
		if (Object.keys(all).length === 0) {
			this.storage.removeItem(this.presetsKey);
		} else {
			this.storage.setItem(this.presetsKey, JSON.stringify(all));
		}
		if (this.getActive() === name) {
			this.clearActive();
		}
	}

	public getActive(): string | null {
		return this.storage.getItem(this.activeKey) || this.storage.getItem(ACTIVE_PRESET_KEY) || this.storage.getItem(COMPONENT_ACTIVE_PRESET_KEY);
	}

	public setActive(name: string): void {
		this.storage.setItem(this.activeKey, name);
	}

	public clearActive(): void {
		this.storage.removeItem(this.activeKey);
		this.storage.removeItem(ACTIVE_PRESET_KEY);
		this.storage.removeItem(COMPONENT_ACTIVE_PRESET_KEY);
	}

	public names(): string[] {
		return Object.keys(this.loadAll()).sort();
	}

	private normalizePresetCollection(input: unknown): Record<string, DesignBuilderOverrideState> {
		if (!input || typeof input !== 'object' || Array.isArray(input)) {
			return {};
		}

		const normalized: Record<string, DesignBuilderOverrideState> = {};
		for (const [name, preset] of Object.entries(input as Record<string, unknown>)) {
			normalized[name] = normalizeDesignBuilderOverrideState(preset);
		}

		return normalized;
	}

	private loadLegacyPresets(): Record<string, DesignBuilderOverrideState> {
		const merged: Record<string, DesignBuilderOverrideState> = {};

		try {
			const raw = this.storage.getItem(PRESETS_KEY);
			if (raw) {
				const tokenPresets = JSON.parse(raw) as Record<string, unknown>;
				for (const [name, preset] of Object.entries(tokenPresets)) {
					merged[name] = normalizeDesignBuilderOverrideState({
						token: preset,
						component: merged[name]?.component ?? {},
					});
				}
			}
		} catch {
			// Ignore legacy token preset parse errors.
		}

		try {
			const raw = this.storage.getItem(COMPONENT_PRESETS_KEY);
			if (raw) {
				const componentPresets = JSON.parse(raw) as Record<string, unknown>;
				for (const [name, preset] of Object.entries(componentPresets)) {
					merged[name] = normalizeDesignBuilderOverrideState({
						token: merged[name]?.token ?? {},
						component: preset,
					});
				}
			}
		} catch {
			// Ignore legacy component preset parse errors.
		}

		return merged;
	}
}
