import { COMPONENT_ACTIVE_PRESET_KEY, COMPONENT_PRESETS_KEY } from '../../features/component-customizer/persistence/ComponentOverrideLocalStorageStore';
import { ACTIVE_PRESET_KEY, PRESETS_KEY } from '../persistence/TokenOverrideLocalStorageStore';
import { normalizeDesignBuilderOverrideState, type DesignBuilderOverrideState } from '../state/designBuilderOverrideState';

export const SHARED_PRESETS_KEY = 'design-builder-presets';
export const SHARED_ACTIVE_PRESET_KEY = 'design-builder-active-preset';

export class DesignBuilderPresetManager {
	private presetsKey: string;
	private activeKey: string;

	constructor(presetsKey: string = SHARED_PRESETS_KEY, activeKey: string = SHARED_ACTIVE_PRESET_KEY) {
		this.presetsKey = presetsKey;
		this.activeKey = activeKey;
	}

	public loadAll(): Record<string, DesignBuilderOverrideState> {
		try {
			const raw = localStorage.getItem(this.presetsKey);
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
		localStorage.setItem(this.presetsKey, JSON.stringify(all));
	}

	public delete(name: string): void {
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

	public getActive(): string | null {
		return localStorage.getItem(this.activeKey) || localStorage.getItem(ACTIVE_PRESET_KEY) || localStorage.getItem(COMPONENT_ACTIVE_PRESET_KEY);
	}

	public setActive(name: string): void {
		localStorage.setItem(this.activeKey, name);
	}

	public clearActive(): void {
		localStorage.removeItem(this.activeKey);
		localStorage.removeItem(ACTIVE_PRESET_KEY);
		localStorage.removeItem(COMPONENT_ACTIVE_PRESET_KEY);
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
			const raw = localStorage.getItem(PRESETS_KEY);
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
			const raw = localStorage.getItem(COMPONENT_PRESETS_KEY);
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
