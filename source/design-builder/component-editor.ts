/**
 * Component Editor
 *
 * Standalone script that can be included on any page.
 * Scans for [data-component] elements, marks them as editable,
 * and shows a sidebar form for CSS token overrides.
 *
 * Expected data-component format:
 *   { "className": "c-button", "tokens": ["color", "background-color"] }
 *
 * Token overrides are injected as CSS custom properties on the component class
 * via a <style id="ce-overrides"> tag using a doubled selector for higher specificity:
 *   .c-button.c-button { --c-button--color: red; }
 *
 * All elements sharing the same className are affected simultaneously.
 * Overrides are persisted to localStorage under "design-component-overrides".
 */

const COMPONENT_OVERRIDES_KEY = 'design-component-overrides';

interface ComponentConfig {
	className: string;
	tokens: string[];
}

class ComponentEditor {
	private panel: HTMLElement;
	private styleEl: HTMLStyleElement;

	constructor() {
		this.styleEl = this.buildStyleElement();
		this.panel = this.buildPanel();
		document.body.appendChild(this.panel);
		this.scan();
		document.addEventListener('click', () => this.closePanel());
	}

	// --- Style injection ---

	private buildStyleElement(): HTMLStyleElement {
		const style = document.createElement('style');
		style.id = 'ce-overrides';
		document.head.appendChild(style);
		return style;
	}

	private applyTypeOverrides(type: string, overrides: Record<string, string>): void {
		const sheet = this.styleEl.sheet!;
		for (let i = sheet.cssRules.length - 1; i >= 0; i--) {
			if ((sheet.cssRules[i] as CSSStyleRule).selectorText === `.${type}.${type}`) {
				sheet.deleteRule(i);
			}
		}
		if (Object.keys(overrides).length > 0) {
			const props = Object.entries(overrides)
				.map(([k, v]) => `${k}: ${v}`)
				.join('; ');
			sheet.insertRule(`.${type}.${type} { ${props} }`, sheet.cssRules.length);
		}
	}

	// --- Scan ---

	private scan(): void {
		const elements = document.querySelectorAll<HTMLElement>('[data-component]');
		const allOverrides = this.loadAllOverrides();
		const restoredTypes = new Set<string>();

		for (const el of elements) {
			let config: ComponentConfig;
			try {
				config = JSON.parse(el.dataset.component ?? '{}') as ComponentConfig;
			} catch {
				continue;
			}

			if (config.className && Array.isArray(config.tokens)) {
				const storageKey = config.className;

				// Restore saved overrides onto the class once per type
				if (!restoredTypes.has(storageKey)) {
					const saved = allOverrides[storageKey];
					if (saved) {
						this.applyTypeOverrides(storageKey, saved);
					}
					restoredTypes.add(storageKey);
				}

				el.classList.add('ce-editable');
				el.addEventListener('click', (e) => {
					e.stopPropagation();
					this.openPanel(el, config, storageKey);
				});
			}
		}
	}

	// --- Panel ---

	private buildPanel(): HTMLElement {
		const panel = document.createElement('div');
		panel.className = 'ce-panel';
		panel.setAttribute('hidden', '');
		panel.addEventListener('click', (e) => e.stopPropagation());
		return panel;
	}

	private openPanel(el: HTMLElement, config: ComponentConfig, storageKey: string): void {
		for (const e of document.querySelectorAll<HTMLElement>('.ce-selected')) {
			e.classList.remove('ce-selected');
		}
		el.classList.add('ce-selected');

		const overrides = { ...this.loadOverrides(storageKey) };

		this.panel.innerHTML = '';

		// Header
		const header = document.createElement('div');
		header.className = 'ce-panel__header';
		header.innerHTML = `<span class="ce-panel__type">${config.className}</span>`;

		const closeBtn = document.createElement('button');
		closeBtn.type = 'button';
		closeBtn.className = 'ce-panel__close material-symbols-outlined';
		closeBtn.textContent = 'close';
		closeBtn.addEventListener('click', () => this.closePanel());
		header.appendChild(closeBtn);
		this.panel.appendChild(header);

		// Fields
		const fields = document.createElement('div');
		fields.className = 'ce-panel__fields';

		for (const token of config.tokens) {
			fields.appendChild(this.buildField(el, config.className, token, overrides, storageKey));
		}

		this.panel.appendChild(fields);

		// Footer
		const footer = document.createElement('div');
		footer.className = 'ce-panel__footer';

		const exportBtn = document.createElement('button');
		exportBtn.type = 'button';
		exportBtn.className = 'c-button c-button--sm c-button__outlined c-button__outlined--default';
		exportBtn.innerHTML = '<span class="c-button__label"><span class="c-button__label-text">Export</span></span>';
		exportBtn.addEventListener('click', () => this.exportOverrides());

		const importBtn = document.createElement('button');
		importBtn.type = 'button';
		importBtn.className = 'c-button c-button--sm c-button__outlined c-button__outlined--default';
		importBtn.innerHTML = '<span class="c-button__label"><span class="c-button__label-text">Import</span></span>';
		importBtn.addEventListener('click', () => this.importOverrides());

		const resetAllBtn = document.createElement('button');
		resetAllBtn.type = 'button';
		resetAllBtn.className = 'c-button c-button--sm c-button__outlined c-button__outlined--primary';
		resetAllBtn.innerHTML = '<span class="c-button__label"><span class="c-button__label-text">Reset all</span></span>';
		resetAllBtn.addEventListener('click', () => {
			this.resetAllOverrides();
			this.openPanel(el, config, storageKey);
		});

		footer.appendChild(exportBtn);
		footer.appendChild(importBtn);
		footer.appendChild(resetAllBtn);
		this.panel.appendChild(footer);

		this.panel.removeAttribute('hidden');
	}

	private buildField(
		el: HTMLElement,
		className: string,
		token: string,
		overrides: Record<string, string>,
		storageKey: string,
	): HTMLElement {
		const varName = `--${className}--${token}`;
		const defaultValue = `var(--${token})`;
		const currentValue = overrides[varName] ?? '';
		const isColor = token.includes('color');

		const field = document.createElement('div');
		field.className = 'ce-field';

		const label = document.createElement('label');
		label.className = 'ce-field__label';
		label.textContent = token;

		const code = document.createElement('code');
		code.className = 'ce-field__var';
		code.textContent = varName;

		const inputRow = document.createElement('div');
		inputRow.className = 'ce-field__inputs';

		const applyValue = (value: string) => {
			const trimmed = value.trim();
			if (!trimmed || trimmed === defaultValue) {
				delete overrides[varName];
			} else {
				overrides[varName] = trimmed;
			}
			this.applyTypeOverrides(className, overrides);
			this.saveOverrides(storageKey, overrides);
		};

		if (isColor) {
			const colorInput = document.createElement('input');
			colorInput.type = 'color';
			colorInput.className = 'ce-field__color';
			try {
				colorInput.value = currentValue || '#000000';
			} catch {
				colorInput.value = '#000000';
			}

			const textInput = document.createElement('input');
			textInput.type = 'text';
			textInput.className = 'ce-field__text';
			textInput.value = currentValue;
			textInput.placeholder = defaultValue;

			colorInput.addEventListener('input', () => {
				textInput.value = colorInput.value;
				applyValue(colorInput.value);
			});
			textInput.addEventListener('change', () => {
				try {
					colorInput.value = textInput.value;
				} catch {
					/* ignore */
				}
				applyValue(textInput.value);
			});

			inputRow.appendChild(colorInput);
			inputRow.appendChild(textInput);
		} else {
			const textInput = document.createElement('input');
			textInput.type = 'text';
			textInput.className = 'ce-field__text';
			textInput.value = currentValue;
			textInput.placeholder = defaultValue;
			textInput.addEventListener('change', () => applyValue(textInput.value));
			inputRow.appendChild(textInput);
		}

		const resetBtn = document.createElement('button');
		resetBtn.type = 'button';
		resetBtn.className = 'ce-field__reset';
		resetBtn.textContent = 'Reset';
		resetBtn.addEventListener('click', () => {
			applyValue('');
			const config = this.parseConfig(el);
			if (config) this.openPanel(el, config, storageKey);
		});
		inputRow.appendChild(resetBtn);

		field.appendChild(label);
		field.appendChild(code);
		field.appendChild(inputRow);
		return field;
	}

	private closePanel(): void {
		this.panel.setAttribute('hidden', '');
		for (const e of document.querySelectorAll<HTMLElement>('.ce-selected')) {
			e.classList.remove('ce-selected');
		}
	}

	// --- Export / Import / Reset ---

	private exportOverrides(): void {
		const all = this.loadAllOverrides();
		const blob = new Blob([JSON.stringify(all, null, 2)], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'design-component-overrides.json';
		a.click();
		URL.revokeObjectURL(url);
	}

	private importOverrides(): void {
		const input = document.createElement('input');
		input.type = 'file';
		input.accept = 'application/json';
		input.addEventListener('change', () => {
			const file = input.files?.[0];
			if (!file) return;
			const reader = new FileReader();
			reader.onload = () => {
				try {
					const data = JSON.parse(reader.result as string) as Record<string, Record<string, string>>;
					localStorage.setItem(COMPONENT_OVERRIDES_KEY, JSON.stringify(data));
					for (const [className, overrides] of Object.entries(data)) {
						this.applyTypeOverrides(className, overrides);
					}
				} catch { /* ignore invalid JSON */ }
			};
			reader.readAsText(file);
		});
		input.click();
	}

	private resetAllOverrides(): void {
		localStorage.removeItem(COMPONENT_OVERRIDES_KEY);
		const sheet = this.styleEl.sheet!;
		while (sheet.cssRules.length > 0) {
			sheet.deleteRule(0);
		}
	}

	// --- Storage ---

	private saveOverrides(storageKey: string, overrides: Record<string, string>): void {
		const all = this.loadAllOverrides();
		if (Object.keys(overrides).length === 0) {
			delete all[storageKey];
		} else {
			all[storageKey] = overrides;
		}
		if (Object.keys(all).length === 0) {
			localStorage.removeItem(COMPONENT_OVERRIDES_KEY);
		} else {
			localStorage.setItem(COMPONENT_OVERRIDES_KEY, JSON.stringify(all));
		}
	}

	private loadOverrides(storageKey: string): Record<string, string> {
		return this.loadAllOverrides()[storageKey] ?? {};
	}

	private loadAllOverrides(): Record<string, Record<string, string>> {
		try {
			const raw = localStorage.getItem(COMPONENT_OVERRIDES_KEY);
			return raw ? (JSON.parse(raw) as Record<string, Record<string, string>>) : {};
		} catch {
			return {};
		}
	}

	// --- Helpers ---

	private parseConfig(el: HTMLElement): ComponentConfig | null {
		try {
			const config = JSON.parse(el.dataset.component ?? '{}') as ComponentConfig;
			return config.className && Array.isArray(config.tokens) ? config : null;
		} catch {
			return null;
		}
	}
}

// --- Init ---

function init(): void {
	new ComponentEditor();
}

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', init);
} else {
	init();
}
