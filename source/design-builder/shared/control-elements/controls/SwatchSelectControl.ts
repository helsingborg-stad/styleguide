import { html, render } from 'lit-html';
import type { TokenSettingOption } from './types';

function isTokenSettingOption(value: unknown): value is TokenSettingOption {
	if (!value || typeof value !== 'object' || Array.isArray(value)) {
		return false;
	}

	const option = value as Record<string, unknown>;
	return typeof option.value === 'string' && typeof option.label === 'string';
}

function normalizeExtraValues(value: unknown): Record<string, string> | undefined {
	if (!value || typeof value !== 'object' || Array.isArray(value)) {
		return undefined;
	}

	const entries = Object.entries(value as Record<string, unknown>).filter(([, entryValue]) => typeof entryValue === 'string');
	if (entries.length === 0) {
		return undefined;
	}

	return Object.fromEntries(entries) as Record<string, string>;
}

class SwatchSelectControl extends HTMLElement {
	connectedCallback() {
		this.render();
	}

	static get observedAttributes() {
		return ['value', 'locked', 'options'];
	}

	attributeChangedCallback(_name: string, oldValue: string | null, newValue: string | null) {
		if (oldValue !== newValue) {
			this.render();
		}
	}

	private getOptions(): TokenSettingOption[] {
		const rawOptions = this.getAttribute('options');
		if (!rawOptions) {
			return [];
		}

		try {
			const parsed = JSON.parse(rawOptions);
			if (!Array.isArray(parsed)) {
				return [];
			}

			return parsed.filter(isTokenSettingOption).map((option) => ({
				value: option.value,
				label: option.label,
				swatch: typeof option.swatch === 'string' ? option.swatch : undefined,
				contrastSwatch: typeof option.contrastSwatch === 'string' ? option.contrastSwatch : undefined,
				extraValues: normalizeExtraValues(option.extraValues),
			}));
		} catch (error) {
			console.error('Failed to parse swatch select options:', error);
			return [];
		}
	}

	private getSelectedOption(options: TokenSettingOption[]): TokenSettingOption | undefined {
		const value = this.getAttribute('value') || '';
		return options.find((option) => option.value === value) ?? options[0];
	}

	private selectOption(option: TokenSettingOption) {
		if (this.hasAttribute('locked')) {
			return;
		}

		// The component customizer applies the override to the preview without
		// rebuilding every control. Keep this control's value in sync locally so
		// the selected chip immediately reflects the applied color.
		this.setAttribute('value', option.value);

		this.dispatchEvent(
			new CustomEvent('change', {
				detail: {
					value: option.value,
					extraValues: option.extraValues,
					options: {
						preserveMatchingDefault: true,
					},
				},
				bubbles: true,
				composed: true,
			}),
		);
	}

	private renderSwatch(option: TokenSettingOption, selected = false) {
		return html`
			<span class="db-swatch-select-chip${selected ? ' is-selected' : ''}">
				<span class="db-swatch-select-chip-fill" style=${`background: ${option.swatch ?? option.value}`}></span>
				${
					option.contrastSwatch
						? html`<span class="db-swatch-select-chip-contrast material-symbols" style=${`color: ${option.contrastSwatch}`} aria-hidden="true">text_fields</span>`
						: ''
				}
			</span>
		`;
	}

	render() {
		const isDisabled = this.hasAttribute('locked');
		const options = this.getOptions();
		const selectedOption = this.getSelectedOption(options);

		const markup = html`
			<div class="db-swatch-select" role="listbox" aria-label="Color token options" aria-disabled=${isDisabled ? 'true' : 'false'}>
				${
					options.length > 0
						? options.map(
								(option) => html`
									<button
										type="button"
										class="db-swatch-select-option db-tooltip-target"
										role="option"
										?disabled=${isDisabled}
										aria-selected=${selectedOption?.value === option.value ? 'true' : 'false'}
										title=${option.label}
										aria-label=${option.label}
										data-tooltip=${option.label}
										@click=${() => this.selectOption(option)}
									>
										${this.renderSwatch(option, selectedOption?.value === option.value)}
									</button>
								`,
							)
						: html`<span class="db-swatch-select-empty"></span>`
				}
			</div>
		`;

		render(markup, this);
	}
}

if (!customElements.get('swatch-select-control')) {
	customElements.define('swatch-select-control', SwatchSelectControl);
}
