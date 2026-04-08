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
				<label class="db-control-row-label">${setting.label}</label>
				<div class="db-control-row-readonly-value">
					${setting.type === 'color' || setting.type === 'rgba' ? html`<div class="db-control-row-swatch" style=${`background-color: ${this._value}`}></div>` : ''}
					<span class="db-control-value-display db-control-value-readonly">${this._value}</span>
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
