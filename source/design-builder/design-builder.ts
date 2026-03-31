import { PresetManager, type StorageAdapter } from './core/storage';
import { TokenOverrideManager } from './core/token-override-manager';
import { CategoryRenderer } from './category-renderer';
import { DbPresetBar } from './core/components/db-preset-bar';
import type { TokenData } from './core/types';

// Ensure the preset bar component is registered
import './core/components/db-preset-bar';

/**
 * Full-page Design Builder orchestrator.
 *
 * Wires together TokenOverrideManager, PresetBar, and CategoryRenderer
 * to provide the complete design token editing experience.
 */
export class DesignBuilder {
	private container: HTMLElement;
	private tokens: TokenData;
	private overrideManager: TokenOverrideManager;
	private presetManager: PresetManager;
	private presetBar: DbPresetBar | null = null;
	private showLockedFields = false;

	constructor(container: HTMLElement, tokens: TokenData, storage: StorageAdapter) {
		this.container = container;
		this.tokens = tokens;
		this.overrideManager = new TokenOverrideManager(storage, document.documentElement);
		this.presetManager = new PresetManager();

		this.removeLockedOverrides();
		this.render();
		this.overrideManager.applyAllToTarget();
	}

	private removeLockedOverrides(): void {
		const lockedVariables = new Set<string>();
		for (const category of this.tokens.categories) {
			for (const setting of category.settings) {
				if (setting.locked) {
					lockedVariables.add(setting.variable);
				}
			}
		}
		this.overrideManager.removeLockedVariables(lockedVariables);
	}

	private render(): void {
		const header = document.createElement('div');
		header.className = 'db-header';
		header.innerHTML = `
			<h1 class="db-header__title">Design Builder</h1>
			<p class="db-header__subtitle">${this.tokens.name} v${this.tokens.version}</p>
			<div class="db-header__actions">
				<label class="db-header__toggle-row" title="Show non-editable fields">
					<input type="checkbox" data-action="toggle-locked" ${this.showLockedFields ? 'checked' : ''}>
					<span>Show uneditable</span>
				</label>
				<button type="button" class="db-btn" data-action="export">Export JSON</button>
				<button type="button" class="db-btn" data-action="import">Import JSON</button>
				<button type="button" class="db-btn db-btn--danger" data-action="reset">Reset All</button>
				<button type="button" class="db-btn db-btn--primary" data-action="save-preset">Save preset</button>
				<input type="file" accept=".json,application/json" data-action="import-file" hidden>
			</div>
		`;
		this.container.appendChild(header);

		this.bindHeaderActions(header);

		this.presetBar = document.createElement('db-preset-bar') as DbPresetBar;
		this.presetBar.configure(this.presetManager);
		this.presetBar.addEventListener('db-preset-load', ((e: CustomEvent<{ name: string }>) => {
			this.loadPreset(e.detail.name);
		}) as EventListener);
		this.presetBar.addEventListener('db-preset-delete', ((e: CustomEvent<{ name: string }>) => {
			this.deletePreset(e.detail.name);
		}) as EventListener);
		this.container.appendChild(this.presetBar);

		const categoriesWrap = document.createElement('div');
		categoriesWrap.className = 'db-categories';

		const renderer = new CategoryRenderer(this.showLockedFields);
		for (const category of this.tokens.categories) {
			categoriesWrap.appendChild(
				renderer.render(
					category,
					(variable) => this.overrideManager.get(variable),
					(variable, value, defaultValue) => {
						this.overrideManager.set(variable, value, defaultValue);
						this.presetManager.clearActive();
						this.presetBar?.refresh();
					},
				),
			);
		}

		this.container.appendChild(categoriesWrap);
	}

	private bindHeaderActions(header: HTMLElement): void {
		const importInput = header.querySelector<HTMLInputElement>('[data-action="import-file"]');
		const toggleLockedInput = header.querySelector<HTMLInputElement>('[data-action="toggle-locked"]');

		toggleLockedInput?.addEventListener('change', () => {
			this.showLockedFields = toggleLockedInput.checked;
			this.container.innerHTML = '';
			this.render();
		});

		header.querySelector('[data-action="export"]')?.addEventListener('click', () => this.exportJson());
		header.querySelector('[data-action="import"]')?.addEventListener('click', () => importInput?.click());
		importInput?.addEventListener('change', () => {
			const file = importInput.files?.[0];
			if (!file) return;
			void this.importJson(file);
			importInput.value = '';
		});
		header.querySelector('[data-action="reset"]')?.addEventListener('click', () => this.resetAll());
		header.querySelector('[data-action="save-preset"]')?.addEventListener('click', () => this.savePreset());
	}

	private resetAll(): void {
		if (!confirm('Reset all tokens to their default values? This clears all customizations.')) return;
		this.overrideManager.clearAll();
		this.presetManager.clearActive();
		this.container.innerHTML = '';
		this.render();
	}

	private exportJson(): void {
		const data = JSON.stringify(this.overrideManager.getAll(), null, 2);
		const blob = new Blob([data], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'design-tokens-overrides.json';
		a.click();
		URL.revokeObjectURL(url);
	}

	private async importJson(file: File): Promise<void> {
		let fileContent: string;
		try {
			fileContent = await file.text();
		} catch {
			alert('Error: Could not read the selected JSON file.');
			return;
		}

		let parsed: unknown;
		try {
			parsed = JSON.parse(fileContent);
		} catch {
			alert('Error: Invalid JSON file.');
			return;
		}

		if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
			alert('Error: Imported JSON must be an object of CSS variable/value pairs.');
			return;
		}

		const tokenVariables = new Set<string>();
		const lockedVariables = new Set<string>();
		for (const category of this.tokens.categories) {
			for (const setting of category.settings) {
				tokenVariables.add(setting.variable);
				if (setting.locked) lockedVariables.add(setting.variable);
			}
		}

		const importedOverrides: Record<string, string> = {};
		const entries = Object.entries(parsed as Record<string, unknown>);

		for (const [variable, value] of entries) {
			if (!tokenVariables.has(variable)) continue;
			if (lockedVariables.has(variable)) continue;
			if (typeof value !== 'string' || !value.trim()) continue;
			importedOverrides[variable] = value;
		}

		if (entries.length > 0 && Object.keys(importedOverrides).length === 0) {
			alert('Error: No recognized design token overrides were found in the selected file.');
			return;
		}

		this.overrideManager.replaceAll(importedOverrides);
		this.presetManager.clearActive();
		this.container.innerHTML = '';
		this.render();
	}

	private savePreset(): void {
		const name = prompt('Preset name:');
		if (!name || !name.trim()) return;

		const trimmed = name.trim();
		const existing = this.presetManager.names();
		if (existing.includes(trimmed)) {
			if (!confirm(`A preset named "${trimmed}" already exists. Overwrite it?`)) return;
		}

		this.presetManager.save(trimmed, this.overrideManager.getAll());
		this.presetManager.setActive(trimmed);
		this.presetBar?.refresh();
	}

	private loadPreset(name: string): void {
		const all = this.presetManager.loadAll();
		const presetOverrides = all[name];
		if (!presetOverrides) return;

		this.overrideManager.replaceAll({ ...presetOverrides });
		this.presetManager.setActive(name);
		this.container.innerHTML = '';
		this.render();
	}

	private deletePreset(name: string): void {
		if (!confirm(`Delete preset "${name}"?`)) return;
		this.presetManager.delete(name);
		this.presetBar?.refresh();
	}
}
