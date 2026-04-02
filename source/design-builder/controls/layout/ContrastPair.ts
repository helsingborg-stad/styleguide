import { html, render } from 'lit-html';
import type { TokenSetting } from '../types';

export type ContrastSettingValue = { setting: TokenSetting; value: string };

export type ContrastPairValueChangeDetail = {
	variable: string;
	value: string;
};

class DbContrastPair extends HTMLElement {
	private _base?: TokenSetting;
	private _baseValue = '';
	private _contrasts: ContrastSettingValue[] = [];
	private readonly contrastValues = new Map<string, string>();

	set base(setting: TokenSetting | undefined) {
		this._base = setting;
		this.render();
	}

	set baseValue(value: string) {
		this._baseValue = value;
		this.render();
	}

	set contrasts(value: ContrastSettingValue[]) {
		this._contrasts = value;
		this.contrastValues.clear();
		for (const contrast of value) {
			this.contrastValues.set(contrast.setting.variable, contrast.value);
		}
		this.render();
	}

	connectedCallback() {
		this.render();
	}

	private emitChange(variable: string, value: string) {
		this.dispatchEvent(
			new CustomEvent<ContrastPairValueChangeDetail>('contrast-change', {
				detail: { variable, value },
				bubbles: true,
				composed: true,
			}),
		);
	}

	private onColorInput(variable: string, value: string) {
		if (this._base?.variable === variable) {
			this._baseValue = value;
		} else {
			this.contrastValues.set(variable, value);
		}

		this.render();
		this.emitChange(variable, value);
	}

	private onReset(setting: TokenSetting) {
		if (this._base?.variable === setting.variable) {
			this._baseValue = setting.default;
		} else {
			this.contrastValues.set(setting.variable, setting.default);
		}

		this.render();
		this.emitChange(setting.variable, '');
	}

	private renderColorCell(setting: TokenSetting, value: string) {
		return html`
			<div class="db-contrast-pair__cell" data-variable=${setting.variable}>
				<label class="db-contrast-pair__label">${setting.label}</label>
				<code class="db-contrast-pair__variable">${setting.variable}</code>
				<color-control value=${value} ?locked=${setting.locked === true} placeholder=${setting.default} @change=${(event: Event) => {
					const customEvent = event as CustomEvent<{ value?: string }>;
					const nextValue = customEvent?.detail?.value;
					if (typeof nextValue === 'string') {
						this.onColorInput(setting.variable, nextValue);
					}
				}} />
				<button class="db-contrast-pair__reset" type="button" title=${`Reset to ${setting.default}`} @click=${() => this.onReset(setting)}>
					Reset
				</button>
			</div>
		`;
	}

	render() {
		if (!this._base) {
			return;
		}

		const markup = html`
			<div class="db-contrast-pair">
				<div class="db-contrast-pair__base">
					${this.renderColorCell(this._base, this._baseValue)}
				</div>
				<div class="db-contrast-pair__contrasts">
					${this._contrasts.map(({ setting }) => {
						const contrastValue = this.contrastValues.get(setting.variable) ?? setting.default;
						return html`
							<div class="db-contrast-pair__contrast-row">
								<div class="db-contrast-pair__control">${this.renderColorCell(setting, contrastValue)}</div>
								<div class="db-contrast-pair__preview-col">
									<div class="db-contrast-pair__preview" style=${`background-color: ${this._baseValue}; color: ${contrastValue};`}>
										<span class="db-contrast-pair__preview-lg">Aa</span>
										<span class="db-contrast-pair__preview-sm">The quick brown fox jumps over the lazy dog</span>
									</div>
								</div>
							</div>
						`;
					})}
				</div>
			</div>
		`;

		render(markup, this);
	}
}

if (!customElements.get('db-contrast-pair')) {
	customElements.define('db-contrast-pair', DbContrastPair);
}
