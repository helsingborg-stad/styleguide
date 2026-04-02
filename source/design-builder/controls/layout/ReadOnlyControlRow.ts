import { html, render } from 'lit-html';
import type { TokenSetting } from '../types';

class DbReadOnlyControlRow extends HTMLElement {
	private _setting?: TokenSetting;
	private _value = '';

	set setting(value: TokenSetting | undefined) {
		this._setting = value;
		this.render();
	}

	set value(value: string) {
		this._value = value;
		this.render();
	}

	connectedCallback() {
		this.render();
	}

	render() {
		const setting = this._setting;
		if (!setting) {
			return;
		}

		const markup = html`
			<div class="db-control-row" data-variable=${setting.variable}>
				<label class="db-control-row__label">${setting.label}</label>
				<div class="db-control-row__readonly-value">
					${setting.type === 'color' || setting.type === 'rgba'
						? html`<div class="db-control-row__swatch" style=${`background-color: ${this._value}`}></div>`
						: ''}
					<span class="db-control__value-display db-control__value-display--readonly">${this._value}</span>
				</div>
			</div>
		`;

		this.setAttribute('readonly', '');
		this.setAttribute('locked', '');
		render(markup, this);
	}
}

if (!customElements.get('db-readonly-control-row')) {
	customElements.define('db-readonly-control-row', DbReadOnlyControlRow);
}
