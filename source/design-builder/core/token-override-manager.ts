import type { StorageAdapter } from './storage';

/**
 * Manages design token override state and applies/removes
 * CSS custom properties on a target element (typically :root).
 */
export class TokenOverrideManager {
	private overrides: Record<string, string>;
	private storage: StorageAdapter;
	private target: HTMLElement;
	private saveTimeout: ReturnType<typeof setTimeout> | null = null;

	constructor(storage: StorageAdapter, target: HTMLElement) {
		this.storage = storage;
		this.target = target;
		this.overrides = storage.load();
	}

	getAll(): Record<string, string> {
		return { ...this.overrides };
	}

	get(variable: string): string | undefined {
		return this.overrides[variable];
	}

	set(variable: string, value: string, defaultValue: string): void {
		if (!value || value === defaultValue) {
			delete this.overrides[variable];
			this.target.style.removeProperty(variable);
		} else {
			this.overrides[variable] = value;
			this.target.style.setProperty(variable, value);
		}
		this.debounceSave();
	}

	replaceAll(overrides: Record<string, string>): void {
		this.removeAllFromTarget();
		this.overrides = { ...overrides };
		this.applyAllToTarget();
		this.storage.save(this.overrides);
	}

	clearAll(): void {
		this.removeAllFromTarget();
		this.overrides = {};
		this.storage.clear();
	}

	applyAllToTarget(): void {
		for (const [prop, value] of Object.entries(this.overrides)) {
			this.target.style.setProperty(prop, value);
		}
	}

	removeLockedVariables(lockedVariables: Set<string>): void {
		let changed = false;
		for (const variable of lockedVariables) {
			if (variable in this.overrides) {
				delete this.overrides[variable];
				changed = true;
			}
		}
		if (changed) {
			this.storage.save(this.overrides);
		}
	}

	private removeAllFromTarget(): void {
		for (const prop of Object.keys(this.overrides)) {
			this.target.style.removeProperty(prop);
		}
	}

	private debounceSave(): void {
		if (this.saveTimeout) clearTimeout(this.saveTimeout);
		this.saveTimeout = setTimeout(() => {
			this.storage.save(this.overrides);
		}, 300);
	}
}
