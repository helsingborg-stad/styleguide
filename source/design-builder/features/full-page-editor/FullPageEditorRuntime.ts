import { html, nothing, render as renderTemplate, type TemplateResult } from 'lit-html';
import { createDesignBuilderCategory, createDesignBuilderControl, createDesignBuilderSwatchBand, createReadOnlyDesignBuilderControl } from '../../shared/control-elements/createDesignBuilderControls';
import type { DesignBuilderThemeMode } from '../../shared/control-elements/controls/layout/ThemeModeSelector';
import { previewDesignBuilderScheme } from '../../shared/state/previewDesignBuilderScheme';
import { isThemeEditableVariable } from '../../shared/state/designBuilderColorSchemes';
import { emitDesignBuilderActionEvent } from '../../shared/events/designBuilderActionEvents';
import { createDetailsMenuDismissController, type DetailsMenuDismissController } from '../../shared/menus/createDetailsMenuDismissController';
import { createDesignBuilderModeSwitcher } from '../../shared/mode-switch/createDesignBuilderModeSwitcher';
import { DesignBuilderPresetManager } from '../../shared/presets/DesignBuilderPresetManager';
import { type DesignBuilderPresetTargets, type DesignBuilderProvidedPreset, designBuilderPresetMatchesState } from '../../shared/presets/designBuilderPresetDefinitions';
import { applyComponentOverridesToPage, applyDefaultThemeVariantsToPage, applyThemeOverridesToPage, clearComponentOverridesFromPage, clearTokenOverridesFromRootDocument, restoreDefaultThemeVariantsToPage } from '../../shared/state/applyDesignBuilderOverridesToPage';
import { type DesignBuilderOverrideState, normalizeDesignBuilderOverrideState } from '../../shared/state/designBuilderOverrideState';
import { registerControlInfoTooltips } from '../../shared/tooltips/registerControlInfoTooltips';
import { parseComponentTokenData } from '../../features/component-customizer/componentTokenDefinitions';
import type { TokenCategory, TokenData } from '../../shared/types/designBuilderDataTypes';
import type { TokenSetting } from '../../shared/control-elements/controls/types';
import type { DesignBuilderModeSwitch, DesignBuilderRootElement } from '../../web-component/designBuilderRootContracts';
import { translations } from '../translations';

interface RuntimePresetOption {
	key: string;
	id: string;
	label: string;
	source: 'provided' | 'saved';
	state: DesignBuilderOverrideState;
	targets: DesignBuilderPresetTargets;
}

interface PaletteFamilyGroup {
	family: string;
	label: string;
	order: number;
	baseSetting?: TokenCategory['settings'][number];
	contrastSetting?: TokenCategory['settings'][number];
}

const BRAND_PALETTE_CATEGORY_ID = 'colors-brand-palette';
const PALETTE_VARIABLE_PATTERN = /^--color--(palette-(\d+))(?:-(contrast))?$/;
type ThemeMode = DesignBuilderThemeMode;

function createThemeComponentCategories(componentData: unknown): TokenCategory[] {
	const categories: TokenCategory[] = [];

	for (const [componentName, component] of Object.entries(parseComponentTokenData(componentData)).sort(([left], [right]) => left.localeCompare(right))) {
		const componentSlug = component.slug || componentName;
		const componentLabel = component.name || componentSlug;

		for (const category of component.componentSettings || []) {
			const settings = category.settings
				.filter((setting): setting is TokenSetting => 'variable' in setting && setting.themeable === true)
				.map((setting) => ({
					...setting,
					variable: `--c-${componentSlug}--${setting.variable.slice(2)}-default`,
					default: setting.unit && !setting.default.endsWith(setting.unit) ? `${setting.default}${setting.unit}` : setting.default,
				}));

			if (settings.length > 0) {
				categories.push({
					id: `component-${componentSlug}-${category.id}`,
					label: `${componentLabel}: ${category.label}`,
					...(category.description ? { description: category.description } : {}),
					settings,
				});
			}
		}
	}

	return categories;
}

export class FullPageEditorRuntime {
	private container: HTMLElement;
	private hostElement: DesignBuilderRootElement;
	private tokens: TokenData;
	private themeComponentCategories: TokenCategory[];
	private overrides: Record<string, string>;
	private presetManager: DesignBuilderPresetManager;
	private root: HTMLElement | null = null;
	private presetBarHost: HTMLElement | null = null;
	private menuDismissController: DetailsMenuDismissController | null = null;
	private showLockedFields = false;
	private modeSwitch?: DesignBuilderModeSwitch;
	private showSaveButton: boolean;
	private activePaletteFamilies = new Set<string>();
	private activeThemeMode: ThemeMode = 'base';
	private darkOverrides: Record<string, string> | null;
	private contrastOverrides: Record<string, string> | null;

	constructor(container: HTMLElement, tokens: TokenData, hostElement: DesignBuilderRootElement, modeSwitch?: DesignBuilderModeSwitch, showSaveButton = true) {
		this.container = container;
		this.hostElement = hostElement;
		this.activeThemeMode = hostElement.colorScheme ?? 'base';
		this.tokens = tokens;
		this.themeComponentCategories = createThemeComponentCategories(hostElement.componentData);
		this.presetManager = new DesignBuilderPresetManager();
		this.overrides = { ...hostElement.overrideState.token };
		this.darkOverrides = hostElement.overrideState._dark ? { ...hostElement.overrideState._dark } : null;
		this.contrastOverrides = hostElement.overrideState._contrast ? { ...hostElement.overrideState._contrast } : null;
		this.showLockedFields = hostElement.showLockedFields;
		this.modeSwitch = modeSwitch;
		this.showSaveButton = showSaveButton;
		this.removeLockedOverrides();
		this.syncPaletteFamiliesFromOverrides();
		this.darkOverrides = this.normalizeThemeForAvailableTokens(this.darkOverrides);
		this.contrastOverrides = this.normalizeThemeForAvailableTokens(this.contrastOverrides);
		this.syncOverrideState();

		this.render();
		this.applyAll();
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

		let changed = false;
		for (const variable of lockedVariables) {
			if (variable in this.overrides) {
				delete this.overrides[variable];
				changed = true;
			}
		}

		if (changed) {
			this.syncOverrideState();
		}
	}

	private render(): void {
		registerControlInfoTooltips();

		if (!this.root) {
			this.root = document.createElement('div');
			this.root.className = 'db-builder db-builder-fullpage';
			this.container.appendChild(this.root);
			this.menuDismissController = createDetailsMenuDismissController(this.root);
		}

		renderTemplate(this.renderShellTemplate(), this.root);
		this.presetBarHost = this.root.querySelector<HTMLElement>('[data-preset-bar]');
		this.renderPresetBar();
	}

	public destroy(): void {
		this.menuDismissController?.dispose();
		this.menuDismissController = null;
		renderTemplate(nothing, this.container);
		this.root = null;
		this.presetBarHost = null;
	}

	private renderShellTemplate(): TemplateResult {
		const modeSwitcher = this.modeSwitch ? createDesignBuilderModeSwitcher(this.modeSwitch) : null;
		const lockedFieldsLabel = this.showLockedFields ? translations.hideUneditable : translations.showUneditable;
		const lockedFieldsTitle = this.showLockedFields ? 'Hide non-editable fields' : 'Show non-editable fields';

		return html`
			<div class="db-header">
				${this.renderThemeModeTemplate()}
				<div class="db-header-actions">
					${modeSwitcher ?? nothing}
					<button
						type="button"
						class="db-btn db-header-toggle-row"
						data-action="toggle-locked"
						aria-pressed=${this.showLockedFields ? 'true' : 'false'}
						aria-label=${lockedFieldsLabel}
						title=${lockedFieldsTitle}
						@click=${this.handleLockedFieldsToggle}
					>
						<svg class="db-btn-icon" viewBox="0 -960 960 960" aria-hidden="true" focusable="false">
							<path fill="currentColor" d="m644-428-58-58q9-47-27-88t-93-32l-58-58q17-8 34.5-12t37.5-4q75 0 127.5 52.5T660-500q0 20-4 37.5T644-428Zm128 126-58-56q38-29 67.5-63.5T832-500q-50-101-143.5-160.5T480-720q-29 0-57 4t-55 12l-62-62q41-17 84-25.5t90-8.5q151 0 269 83.5T920-500q-23 59-60.5 109.5T772-302Zm20 246L624-222q-35 11-70.5 16.5T480-200q-151 0-269-83.5T40-500q21-53 53-98.5t73-81.5L56-792l56-56 736 736-56 56ZM222-624q-29 26-53 57t-41 67q50 101 143.5 160.5T480-280q20 0 39-2.5t39-5.5l-36-38q-11 3-21 4.5t-21 1.5q-75 0-127.5-52.5T300-500q0-11 1.5-21t4.5-21l-84-82Zm319 93Zm-151 75Z" />
						</svg>
						<span>${lockedFieldsLabel}</span>
					</button>
					<div class="db-header-actions-right">
						<details class="db-header-menu">
							<summary class="db-btn db-header-menu-trigger db-tooltip-target" aria-label="${translations.importExportJson}" data-tooltip="${translations.importExportJson}">
								<svg class="db-btn-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
									<title>${translations.importExportJson}</title>
									<path
										fill="currentColor"
										d="M7 4h10v2H7l2.5 2.5L8 10 3 5l5-5 1.5 1.5L7 4Zm10 16H7v-2h10l-2.5-2.5L16 14l5 5-5 5-1.5-1.5L17 20Z"
									/>
								</svg>
							</summary>
							<div class="db-header-menu-content" role="menu" aria-label="${translations.importExportJson}">
								<button type="button" class="db-btn" data-action="export" role="menuitem" @click=${this.handleExportClick}>${translations.exportJson}</button>
								<button type="button" class="db-btn" data-action="import" role="menuitem" @click=${this.handleImportClick}>${translations.importJson}</button>
							</div>
						</details>
						${
							this.showSaveButton
								? html`
									<button type="button" class="db-btn db-btn-primary db-tooltip-target" data-action="save" aria-label="Save" data-tooltip="Save" @click=${this.handleSaveClick}>
										<svg class="db-btn-icon" viewBox="0 -960 960 960" aria-hidden="true" focusable="false">
											<title>Save</title>
											<path fill="currentColor" d="M840-680v480q0 33-23.5 56.5T760-120H200q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h480l160 160Zm-80 34L646-760H200v560h560v-446ZM565-275q35-35 35-85t-35-85q-35-35-85-35t-85 35q-35 35-35 85t35 85q35 35 85 35t85-35ZM240-560h360v-160H240v160Zm-40-86v446-560 114Z" />
										</svg>
									</button>
								`
								: nothing
						}
						<details class="db-header-menu db-header-menu-danger">
							<summary class="db-btn db-header-menu-trigger db-tooltip-target" aria-label="${translations.resetActions}" data-tooltip="${translations.resetActions}">
								<svg class="db-btn-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
									<title>${translations.resetActions}</title>
									<path fill="currentColor" d="M12 3a9 9 0 1 1-8.66 11.43l1.93-.52A7 7 0 1 0 12 5h-1.59l2.3 2.29-1.42 1.42L6.58 4l4.71-4.71 1.42 1.42L10.41 3H12Z" />
								</svg>
							</summary>
							<div class="db-header-menu-content" role="menu" aria-label="${translations.resetActions}">
								<button type="button" class="db-btn db-btn-danger" data-action="reset" role="menuitem" @click=${this.handleResetClick}>${translations.resetAll}</button>
							</div>
						</details>
					</div>
					<input
						type="file"
						accept=".json,application/json"
						data-action="import-file"
						hidden
						@change=${this.handleImportFileChange}
					>
				</div>
			</div>
			<div data-preset-bar></div>
			<div class="db-categories">
				${this.getVisibleCategories().map((category) => this.renderCategoryElement(category))}
			</div>
		`;
	}

	private renderThemeModeTemplate(): TemplateResult {
		return html`<db-theme-mode-selector
			.activeMode=${this.activeThemeMode}
			.darkEnabled=${this.darkOverrides !== null}
			.contrastEnabled=${this.contrastOverrides !== null}
			@theme-mode-change=${(event: CustomEvent<{ mode: ThemeMode }>) => this.setActiveThemeMode(event.detail.mode)}
			@theme-enable=${this.enableActiveTheme}
			@theme-disable=${this.disableActiveTheme}
		></db-theme-mode-selector>`;
	}

	private getVisibleCategories(): TokenCategory[] {
		if (this.activeThemeMode === 'base') {
			return this.tokens.categories;
		}

		if (this.getThemeOverrides(this.activeThemeMode) === null) {
			return [];
		}

		return [...this.tokens.categories.map((category) => ({ ...category, settings: category.settings.filter((setting) => isThemeEditableVariable(setting.variable)) })).filter((category) => category.settings.length > 0), ...this.themeComponentCategories];
	}

	private getThemeEditableSettings(): TokenSetting[] {
		return [...this.tokens.categories.flatMap((category) => category.settings.filter((setting) => isThemeEditableVariable(setting.variable))), ...this.themeComponentCategories.flatMap((category) => category.settings)];
	}

	private renderCategoryElement(category: TokenCategory): HTMLElement {
		return createDesignBuilderCategory(category, this.renderCategoryBody(category), true);
	}

	private renderCategoryBody(category: TokenCategory): Array<HTMLElement> {
		if (category.present === 'swatch') {
			return [createDesignBuilderSwatchBand(category.settings)];
		}

		if (category.id === BRAND_PALETTE_CATEGORY_ID) {
			return this.renderPaletteCategoryBody(category);
		}

		const items: HTMLElement[] = [];
		for (const setting of category.settings) {
			if (setting.locked) {
				if (!this.showLockedFields) {
					continue;
				}

				const currentValue = this.overrides[setting.variable] || setting.default;
				items.push(createReadOnlyDesignBuilderControl(setting, currentValue));
				continue;
			}

			const currentValue = this.getCurrentValue(setting.variable, setting.default);
			items.push(
				createDesignBuilderControl(setting, currentValue, (variable, value) => {
					this.handleChange(variable, value, setting.default);
				}),
			);
		}

		return items;
	}

	private parsePaletteVariable(variable: string): { family: string; order: number; isContrast: boolean } | null {
		const match = variable.match(PALETTE_VARIABLE_PATTERN);
		if (!match) {
			return null;
		}

		return {
			family: match[1],
			order: Number(match[2]),
			isContrast: match[3] === 'contrast',
		};
	}

	private syncPaletteFamiliesFromOverrides(): void {
		this.activePaletteFamilies.clear();
		for (const variable of Object.keys(this.overrides)) {
			const paletteToken = this.parsePaletteVariable(variable);
			if (paletteToken) {
				this.activePaletteFamilies.add(paletteToken.family);
			}
		}
	}

	private getPaletteFamilyGroups(category: TokenCategory): PaletteFamilyGroup[] {
		const groups = new Map<string, PaletteFamilyGroup>();

		for (const setting of category.settings) {
			const paletteToken = this.parsePaletteVariable(setting.variable);
			if (!paletteToken) {
				continue;
			}

			const group = groups.get(paletteToken.family) ?? {
				family: paletteToken.family,
				label: `Palette ${paletteToken.order}`,
				order: paletteToken.order,
			};

			if (paletteToken.isContrast) {
				group.contrastSetting = setting;
			} else {
				group.baseSetting = setting;
			}

			groups.set(paletteToken.family, group);
		}

		return [...groups.values()].sort((left, right) => left.order - right.order);
	}

	private createPaletteFamilyElement(group: PaletteFamilyGroup): HTMLElement {
		const wrapper = document.createElement('div');
		wrapper.className = 'db-palette-family';
		wrapper.dataset.paletteFamily = group.family;

		const header = document.createElement('div');
		header.className = 'db-palette-family-header';

		const title = document.createElement('p');
		title.className = 'db-palette-family-title';
		title.textContent = group.label;
		header.appendChild(title);

		const removeButton = document.createElement('button');
		removeButton.type = 'button';
		removeButton.className = 'db-btn db-palette-family-remove';
		removeButton.dataset.action = 'remove-palette-family';
		removeButton.dataset.paletteFamily = group.family;
		removeButton.setAttribute('aria-label', `${translations.removePaletteColor}: ${group.label}`);
		removeButton.setAttribute('title', translations.removePaletteColor);
		removeButton.innerHTML = `
			<span class="db-material-symbol" aria-hidden="true">close</span>
		`;
		removeButton.addEventListener('click', () => this.removePaletteFamily(group));
		if (this.activeThemeMode === 'base') {
			header.appendChild(removeButton);
		}

		wrapper.appendChild(header);

		for (const setting of [group.baseSetting, group.contrastSetting]) {
			if (!setting) {
				continue;
			}

			const paletteSetting = {
				...setting,
				label: setting === group.baseSetting ? 'Color' : 'Contrast',
			};
			const currentValue = this.getCurrentValue(setting.variable, setting.default);
			wrapper.appendChild(
				createDesignBuilderControl(paletteSetting, currentValue, (variable, value) => {
					this.handleChange(variable, value, setting.default);
				}),
			);
		}

		return wrapper;
	}

	private renderPaletteCategoryBody(category: TokenCategory): Array<HTMLElement> {
		const groups = this.getPaletteFamilyGroups(category);
		const items = groups.filter((group) => this.activePaletteFamilies.has(group.family)).map((group) => this.createPaletteFamilyElement(group));

		const nextGroup = this.activeThemeMode === 'base' ? groups.find((group) => !this.activePaletteFamilies.has(group.family)) : undefined;
		if (nextGroup) {
			const addButton = document.createElement('button');
			addButton.type = 'button';
			addButton.className = 'db-btn db-btn-primary db-palette-add';
			addButton.dataset.action = 'add-palette-family';
			addButton.innerHTML = `
				<svg class="db-btn-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
					<path fill="currentColor" d="M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6V5Z" />
				</svg>
				<span>${translations.addPaletteColor}</span>
			`;
			addButton.addEventListener('click', () => {
				if (nextGroup.baseSetting) {
					this.handleChange(nextGroup.baseSetting.variable, '#ffffff', nextGroup.baseSetting.default);
				}

				if (nextGroup.contrastSetting) {
					this.handleChange(nextGroup.contrastSetting.variable, '#000000', nextGroup.contrastSetting.default);
				}

				this.activePaletteFamilies.add(nextGroup.family);
				for (const setting of [nextGroup.baseSetting, nextGroup.contrastSetting]) {
					if (!setting) continue;
					const value = this.getBaseValue(setting.variable, setting.default);
					if (this.darkOverrides) this.darkOverrides[setting.variable] = value;
					if (this.contrastOverrides) this.contrastOverrides[setting.variable] = value;
				}
				this.syncOverrideState();
				this.render();
			});
			items.push(addButton);
		}

		return items;
	}

	private removePaletteFamily(group: PaletteFamilyGroup): void {
		this.activePaletteFamilies.delete(group.family);
		for (const setting of [group.baseSetting, group.contrastSetting]) {
			if (!setting) {
				continue;
			}

			delete this.overrides[setting.variable];
			delete this.darkOverrides?.[setting.variable];
			delete this.contrastOverrides?.[setting.variable];
			document.documentElement.style.removeProperty(setting.variable);
		}

		this.syncOverrideState();
		this.render();
		this.emitAction('change', {
			family: group.family,
			value: '',
		});
	}

	private handleChange(variable: string, value: string, defaultValue: string): void {
		const activeOverrides = this.getThemeOverrides(this.activeThemeMode);
		if (this.activeThemeMode !== 'base' && !activeOverrides) {
			return;
		}

		if (this.activeThemeMode !== 'base') {
			activeOverrides![variable] = value || this.getBaseValue(variable, defaultValue);
			this.applyThemePreview();
			this.syncOverrideState();
			this.presetManager.clearActive();
			this.refreshPresetBar();
			this.emitAction('change', { variable, value, theme: this.activeThemeMode });
			return;
		}

		if (!value || value === defaultValue) {
			delete this.overrides[variable];
		} else {
			this.overrides[variable] = value;
		}

		if (value && value !== defaultValue) {
			document.documentElement.style.setProperty(variable, value);
		} else {
			document.documentElement.style.removeProperty(variable);
		}

		this.syncOverrideState();
		this.presetManager.clearActive();
		this.refreshPresetBar();
		this.emitAction('change', {
			variable,
			value,
			defaultValue,
		});
	}

	private getThemeOverrides(mode: ThemeMode): Record<string, string> | null {
		if (mode === 'dark') return this.darkOverrides;
		if (mode === 'contrast') return this.contrastOverrides;
		return this.overrides;
	}

	private getBaseValue(variable: string, defaultValue: string): string {
		return this.overrides[variable] || defaultValue;
	}

	private getCurrentValue(variable: string, defaultValue: string): string {
		const themeOverrides = this.getThemeOverrides(this.activeThemeMode);
		if (this.activeThemeMode !== 'base' && themeOverrides) {
			return themeOverrides[variable] || this.getBaseValue(variable, defaultValue);
		}

		return this.getBaseValue(variable, defaultValue);
	}

	private collectThemeDefaults(mode: ThemeMode = 'base'): Record<string, string> {
		const themeTemplate = this.getThemeTemplate(mode);
		const theme: Record<string, string> = {};
		for (const setting of this.getThemeEditableSettings()) {
			if (!this.parsePaletteVariable(setting.variable) || this.activePaletteFamilies.has(this.parsePaletteVariable(setting.variable)!.family)) {
				theme[setting.variable] = themeTemplate?.[setting.variable] ?? this.getBaseValue(setting.variable, setting.default);
			}
		}
		return theme;
	}

	private getThemeTemplate(mode: ThemeMode): Record<string, string> | null {
		if (mode === 'base') return null;

		const defaultPreset = this.getProvidedPresets().find((preset) => preset.id === 'default');
		const defaultVariant = mode === 'dark' ? defaultPreset?.state._dark : defaultPreset?.state._contrast;
		return defaultVariant ?? null;
	}

	private normalizeThemeForAvailableTokens(theme: Record<string, string> | null): Record<string, string> | null {
		if (theme === null) return null;

		const allowed = new Set(
			this.getThemeEditableSettings()
				.filter((setting) => {
					const palette = this.parsePaletteVariable(setting.variable);
					return !palette || this.activePaletteFamilies.has(palette.family);
				})
				.map((setting) => setting.variable),
		);

		const normalized = Object.fromEntries(Object.entries(theme).filter(([variable]) => allowed.has(variable))) as Record<string, string>;
		for (const setting of this.getThemeEditableSettings()) {
			if (allowed.has(setting.variable) && !(setting.variable in normalized)) {
				normalized[setting.variable] = this.getBaseValue(setting.variable, setting.default);
			}
		}

		return normalized;
	}

	private setActiveThemeMode(mode: ThemeMode): void {
		this.activeThemeMode = mode;
		this.hostElement.colorScheme = mode;
		this.applyThemePreview();
		this.render();
	}

	private enableActiveTheme = (): void => {
		const theme = this.collectThemeDefaults(this.activeThemeMode);
		if (this.activeThemeMode === 'dark') this.darkOverrides = theme;
		if (this.activeThemeMode === 'contrast') this.contrastOverrides = theme;
		this.syncOverrideState();
		this.applyThemePreview();
		this.render();
		this.emitAction('change', { theme: this.activeThemeMode, enabled: true });
	};

	private disableActiveTheme = (): void => {
		if (this.activeThemeMode === 'dark') this.darkOverrides = null;
		if (this.activeThemeMode === 'contrast') this.contrastOverrides = null;
		if (this.activeThemeMode !== 'base') {
			this.hostElement.overrideState = { ...this.hostElement.overrideState, componentSchemes: { ...this.hostElement.overrideState.componentSchemes, [this.activeThemeMode]: {} } };
		}
		this.syncOverrideState();
		this.applyThemePreview();
		this.render();
		this.emitAction('change', { theme: this.activeThemeMode, enabled: false });
	};

	private applyThemePreview(): void {
		previewDesignBuilderScheme(this.hostElement.overrideState, this.activeThemeMode, this.tokens);
		for (const setting of this.getThemeEditableSettings()) {
			if (this.activeThemeMode !== 'base') {
				document.documentElement.style.removeProperty(setting.variable);
			}
		}

		if (this.activeThemeMode === 'base') {
			for (const [variable, value] of Object.entries(this.collectThemeDefaults())) document.documentElement.style.setProperty(variable, value);
			return;
		}

		for (const [variable, value] of Object.entries(this.getThemeOverrides(this.activeThemeMode) || {})) {
			document.documentElement.style.setProperty(variable, value);
		}
	}

	private applyAll(): void {
		for (const [prop, value] of Object.entries(this.overrides)) {
			document.documentElement.style.setProperty(prop, value);
		}

		applyComponentOverridesToPage(this.hostElement.overrideState.component);
		applyThemeOverridesToPage(this.darkOverrides, this.contrastOverrides);
		this.applyThemePreview();
	}

	private resetAll(): void {
		if (!confirm('Reset all tokens to their default values? This clears all customizations.')) {
			return;
		}

		for (const prop of Object.keys(this.overrides)) {
			document.documentElement.style.removeProperty(prop);
		}

		this.overrides = {};
		this.darkOverrides = null;
		this.contrastOverrides = null;
		restoreDefaultThemeVariantsToPage();
		applyThemeOverridesToPage(null, null);
		this.syncPaletteFamiliesFromOverrides();
		this.syncOverrideState();
		this.presetManager.clearActive();
		this.render();
		this.applyThemePreview();
		this.emitAction('reset-all');
	}

	private exportJson(): void {
		const state = normalizeDesignBuilderOverrideState({
			...this.hostElement.overrideState,
			token: this.overrides,
			...this.getThemeStateFields(),
			component: this.hostElement.overrideState.component,
		});
		const data = JSON.stringify(state, null, 2);
		const blob = new Blob([data], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const anchor = document.createElement('a');
		anchor.href = url;
		anchor.download = 'design-builder-overrides.json';
		anchor.click();
		URL.revokeObjectURL(url);
		this.emitAction('export', {
			fileName: anchor.download,
		});
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

		const tokenVariables = new Set<string>();
		const lockedVariables = new Set<string>();
		for (const category of this.tokens.categories) {
			for (const setting of category.settings) {
				tokenVariables.add(setting.variable);
				if (setting.locked) {
					lockedVariables.add(setting.variable);
				}
			}
		}

		const importedState = normalizeDesignBuilderOverrideState(parsed);
		const importedOverrides: Record<string, string> = {};
		const entries = Object.entries(importedState.token);

		for (const [variable, value] of entries) {
			if (!tokenVariables.has(variable)) continue;
			if (lockedVariables.has(variable)) continue;
			importedOverrides[variable] = value;
		}

		if (entries.length > 0 && Object.keys(importedOverrides).length === 0) {
			alert('Error: No recognized design token overrides were found in the selected file.');
			return;
		}

		for (const prop of Object.keys(this.overrides)) {
			document.documentElement.style.removeProperty(prop);
		}

		clearComponentOverridesFromPage(this.hostElement.overrideState.component);
		applyComponentOverridesToPage(importedState.component);

		this.overrides = importedOverrides;
		this.darkOverrides = this.normalizeThemeForAvailableTokens(importedState._dark ?? null);
		this.contrastOverrides = this.normalizeThemeForAvailableTokens(importedState._contrast ?? null);
		applyDefaultThemeVariantsToPage(this.darkOverrides, this.contrastOverrides);
		this.syncPaletteFamiliesFromOverrides();
		this.hostElement.overrideState = normalizeDesignBuilderOverrideState({
			...importedState,
			token: importedOverrides,
			...this.getThemeStateFields(),
			component: importedState.component,
		});
		this.applyAll();
		this.presetManager.clearActive();

		this.render();
		this.emitAction('import', {
			fileName: file.name,
			tokenOverrideCount: Object.keys(importedOverrides).length,
			componentScopeCount: Object.keys(importedState.component).length,
		});
	}

	private renderPresetBar(): void {
		if (!this.presetBarHost) {
			return;
		}
		const presetOptions = this.getPresetOptions();
		const activePresetKey = this.getActivePresetKey(presetOptions);
		const hasProvidedPresets = presetOptions.some((preset) => preset.source === 'provided');
		const savedPresetOptions = presetOptions.filter((preset) => preset.source === 'saved');
		const activeSavedPreset = savedPresetOptions.find((preset) => preset.key === activePresetKey) ?? null;

		renderTemplate(
			html`
				<div class=${presetOptions.length === 0 ? 'db-presets u-display--none' : 'db-presets'} ?hidden=${presetOptions.length === 0}>
					<label class="db-builder-context-row" for="db-full-page-preset-select">
						${translations.preset}
						<select
							id="db-full-page-preset-select"
							class="db-control-text"
							data-action="select-preset"
							.value=${activePresetKey}
							@change=${this.handlePresetSelectChange}
						>
							<option value="">${translations.chooseAPreset}</option>
							${
								hasProvidedPresets
									? html`
										<optgroup label="Built-in presets">
											${presetOptions.filter((preset) => preset.source === 'provided').map((preset) => html`<option value=${preset.key}>${preset.label}</option>`)}
										</optgroup>
									`
									: nothing
							}
							${
								savedPresetOptions.length > 0
									? html`
										<optgroup label="${translations.savedPresets}">
											${savedPresetOptions.map((preset) => html`<option value=${preset.key}>${preset.label}</option>`)}
										</optgroup>
									`
									: nothing
							}
						</select>
					</label>
					<details class="db-presets-menu">
						<summary class="db-btn db-presets-menu-trigger db-tooltip-target" aria-label="${translations.presetActions}" data-tooltip="${translations.presetActions}">
							<svg class="db-btn-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
								<title>${translations.presetActions}</title>
								<path
									fill="currentColor"
									d="M12 7a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm0 6.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm0 6.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"
								/>
							</svg>
						</summary>
						<div class="db-presets-menu-content" role="menu" aria-label="${translations.presetActions}">
							<button type="button" class="db-btn db-btn-primary" data-action="save-preset" role="menuitem" @click=${this.handleSavePresetClick}>
								${translations.savePreset}
							</button>
							<button
								type="button"
								class="db-btn"
								data-action="delete-preset"
								role="menuitem"
								?disabled=${activeSavedPreset === null}
								@click=${this.handleDeleteActivePresetClick}
							>
								${translations.deletePreset}
							</button>
						</div>
					</details>
				</div>
			`,
			this.presetBarHost,
		);
	}

	private savePreset(): void {
		const name = prompt('Preset name:');
		if (!name || !name.trim()) return;

		const trimmed = name.trim();
		const normalizedName = trimmed.toLowerCase();
		if (this.getProvidedPresets().some((preset) => preset.id.toLowerCase() === normalizedName || preset.label.toLowerCase() === normalizedName)) {
			alert(`A built-in preset already uses the name "${trimmed}". Choose another preset name.`);
			return;
		}

		const existing = this.presetManager.names();
		if (existing.includes(trimmed)) {
			if (!confirm(`A preset named "${trimmed}" already exists. Overwrite it?`)) {
				return;
			}
		}

		this.presetManager.save(trimmed, this.getCurrentPresetState());
		this.presetManager.setActive(trimmed);
		this.refreshPresetBar();
		this.emitAction('preset-save', {
			presetName: trimmed,
		});
	}

	private loadPreset(option: RuntimePresetOption): void {
		if (option.targets.token) {
			clearTokenOverridesFromRootDocument(this.overrides);
			this.overrides = { ...option.state.token };
			this.darkOverrides = this.normalizeThemeForAvailableTokens(option.state._dark ? { ...option.state._dark } : null);
			this.contrastOverrides = this.normalizeThemeForAvailableTokens(option.state._contrast ? { ...option.state._contrast } : null);
			applyDefaultThemeVariantsToPage(this.darkOverrides, this.contrastOverrides);
			this.removeLockedOverrides();
			this.syncPaletteFamiliesFromOverrides();
		}

		const nextComponentOverrides = option.targets.component ? normalizeDesignBuilderOverrideState({ component: option.state.component }).component : this.hostElement.overrideState.component;
		if (option.targets.component) {
			clearComponentOverridesFromPage(this.hostElement.overrideState.component);
		}

		this.hostElement.overrideState = normalizeDesignBuilderOverrideState({
			...this.hostElement.overrideState,
			token: this.overrides,
			...this.getThemeStateFields(),
			component: nextComponentOverrides,
			componentSchemes: option.targets.component ? option.state.componentSchemes : this.hostElement.overrideState.componentSchemes,
		});
		this.syncOverrideState();
		this.removeLockedOverrides();
		this.applyAll();

		if (option.source === 'saved') {
			this.presetManager.setActive(option.id);
		} else {
			this.presetManager.clearActive();
		}

		this.render();
		this.emitAction('preset-load', {
			presetName: option.label,
			presetSource: option.source,
		});
	}

	private deletePreset(name: string): void {
		if (!confirm(`Delete preset "${name}"?`)) return;
		this.presetManager.delete(name);
		this.refreshPresetBar();
		this.emitAction('preset-delete', {
			presetName: name,
		});
	}

	private refreshPresetBar(): void {
		this.renderPresetBar();
	}

	private getProvidedPresets(): DesignBuilderProvidedPreset[] {
		return Array.isArray(this.hostElement.presets) ? this.hostElement.presets : [];
	}

	private getPresetOptions(): RuntimePresetOption[] {
		const providedOptions = this.getProvidedPresets().map((preset) => ({
			key: `provided:${preset.id}`,
			id: preset.id,
			label: preset.label,
			source: 'provided' as const,
			state: preset.state,
			targets: preset.targets,
		}));

		const savedOptions = Object.entries(this.presetManager.loadAll())
			.sort(([leftName], [rightName]) => leftName.localeCompare(rightName))
			.map(([name, state]) => ({
				key: `saved:${name}`,
				id: name,
				label: name,
				source: 'saved' as const,
				state,
				targets: {
					token: true,
					component: true,
				},
			}));

		return [...providedOptions, ...savedOptions];
	}

	private getActivePresetKey(presetOptions: RuntimePresetOption[]): string {
		const activeSavedPresetName = this.presetManager.getActive();
		if (activeSavedPresetName) {
			const activeSavedPreset = presetOptions.find((preset) => preset.source === 'saved' && preset.id === activeSavedPresetName);
			if (activeSavedPreset) {
				return activeSavedPreset.key;
			}
		}

		const currentState = this.getCurrentPresetState();
		return (
			presetOptions.find((preset) =>
				designBuilderPresetMatchesState(
					{
						id: preset.id,
						label: preset.label,
						state: preset.state,
						targets: preset.targets,
					},
					currentState,
				),
			)?.key ?? ''
		);
	}

	private findPresetOption(key: string): RuntimePresetOption | null {
		return this.getPresetOptions().find((preset) => preset.key === key) ?? null;
	}

	private getCurrentPresetState(): DesignBuilderOverrideState {
		return {
			...this.hostElement.overrideState,
			token: { ...this.overrides },
			...this.getThemeStateFields(),
			component: this.hostElement.overrideState.component,
		};
	}

	private syncOverrideState(): void {
		const { _dark, _contrast, ...sharedState } = this.hostElement.overrideState;
		this.hostElement.overrideState = normalizeDesignBuilderOverrideState({
			...sharedState,
			token: this.overrides,
			...this.getThemeStateFields(),
			component: this.hostElement.overrideState.component,
		});
		applyThemeOverridesToPage(this.darkOverrides, this.contrastOverrides);
	}

	private getThemeStateFields(): Pick<DesignBuilderOverrideState, '_dark' | '_contrast'> | Record<string, never> {
		if (this.darkOverrides === null && this.contrastOverrides === null) {
			return {};
		}

		return {
			_dark: this.darkOverrides ? { ...this.darkOverrides } : null,
			_contrast: this.contrastOverrides ? { ...this.contrastOverrides } : null,
		};
	}

	private emitAction(action: 'change' | 'save' | 'reset-all' | 'import' | 'export' | 'preset-save' | 'preset-load' | 'preset-delete', metadata?: Record<string, unknown>): void {
		emitDesignBuilderActionEvent(this.hostElement, {
			action,
			mode: 'full-page',
			state: this.hostElement.overrideState,
			metadata,
		});
	}

	private readonly handleLockedFieldsToggle = (): void => {
		this.showLockedFields = !this.showLockedFields;
		this.hostElement.showLockedFields = this.showLockedFields;
		this.render();
	};

	private readonly handleExportClick = (): void => {
		this.exportJson();
	};

	private readonly handleImportClick = (): void => {
		this.root?.querySelector<HTMLInputElement>('[data-action="import-file"]')?.click();
	};

	private readonly handleImportFileChange = (event: Event): void => {
		const input = event.currentTarget as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) {
			return;
		}

		void this.importJson(file);
		input.value = '';
	};

	private readonly handleResetClick = (): void => {
		this.resetAll();
	};

	private readonly handleSavePresetClick = (): void => {
		this.savePreset();
	};

	private readonly handleSaveClick = (): void => {
		this.emitAction('save');
	};

	private readonly handlePresetSelectChange = (event: Event): void => {
		const option = this.findPresetOption((event.currentTarget as HTMLSelectElement).value);
		if (!option) {
			this.presetManager.clearActive();
			this.refreshPresetBar();
			return;
		}

		this.loadPreset(option);
	};

	private readonly handleDeleteActivePresetClick = (): void => {
		const activePreset = this.findPresetOption(this.getActivePresetKey(this.getPresetOptions()));
		if (!activePreset || activePreset.source !== 'saved') {
			return;
		}

		this.deletePreset(activePreset.id);
	};
}
