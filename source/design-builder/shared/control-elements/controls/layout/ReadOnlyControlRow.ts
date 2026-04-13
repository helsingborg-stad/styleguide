import { html, render } from 'lit-html';
import '../../../tooltips/registerControlInfoTooltips';
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

		const variableDescription = setting.description?.trim() ?? '';
		const tooltipText = [variableDescription, setting.variable].filter(Boolean).join('\n');

		const markup = html`
			<div
				class="db-control-row"
				data-variable=${setting.variable}
				data-tip-variable=${setting.variable}
				data-tip-description=${variableDescription}
			>
				<label class="db-control-row-label"><span class="db-control-row-label-text">${setting.label}</span>${tooltipText ? html`<button type="button" class="db-control-info-btn db-tooltip-target" data-tooltip=${tooltipText} aria-label="Token info" tabindex="-1"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" aria-hidden="true" focusable="false"><path d="M440-280h80v-240h-80v240Zm68.5-331.5Q520-623 520-640t-11.5-28.5Q497-680 480-680t-28.5 11.5Q440-657 440-640t11.5 28.5Q463-600 480-600t28.5-11.5ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg></button>` : ''}</label>
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
