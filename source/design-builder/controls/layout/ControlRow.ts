import { html, render } from 'lit-html';
import type { TokenSetting } from '../types';

export type ControlRowValueChangeDetail = {
	variable: string;
	value: string;
};

function getControlChangeValue(event: Event): string | undefined {
	if (!(event instanceof CustomEvent)) {
		return undefined;
	}

	const detail = event.detail;
	if (!detail || typeof detail !== 'object' || !('value' in detail)) {
		return undefined;
	}

	const value = (detail as { value?: unknown }).value;
	return value === undefined || value === null ? undefined : String(value);
}

class DbControlRow extends HTMLElement {
	private _setting?: TokenSetting;
	private _value = '';

	set setting(value: TokenSetting | undefined) {
		this._setting = value;
		this.render();
	}

	get setting(): TokenSetting | undefined {
		return this._setting;
	}

	set value(value: string) {
		this._value = value;
		this.render();
	}

	get value(): string {
		return this._value;
	}

	connectedCallback() {
		this.render();
	}

	private emitChange(value: string) {
		const setting = this._setting;
		if (!setting) {
			return;
		}

		this.dispatchEvent(
			new CustomEvent<ControlRowValueChangeDetail>('control-change', {
				detail: {
					variable: setting.variable,
					value,
				},
				bubbles: true,
				composed: true,
			}),
		);
	}

	private onControlChange(event: Event) {
		const value = getControlChangeValue(event);
		if (value === undefined) {
			return;
		}

		this._value = value;
		this.render();
		this.emitChange(value);
	}

	private onReset() {
		const setting = this._setting;
		if (!setting) {
			return;
		}

		this._value = setting.default;
		this.render();
		this.emitChange('');
	}

	private renderInput(setting: TokenSetting) {
		switch (setting.type) {
			case 'color':
				return html`<color-control value=${this._value} ?locked=${setting.locked === true} placeholder=${setting.default} @change=${(e: Event) => this.onControlChange(e)} />`;
			case 'rgba':
				return html`<rgba-control value=${this._value} ?locked=${setting.locked === true} placeholder=${setting.default} @change=${(e: Event) => this.onControlChange(e)} />`;
			case 'range':
				return html`<range-control
					value=${Number.isNaN(parseFloat(this._value)) ? '0' : String(parseFloat(this._value))}
					?locked=${setting.locked === true}
					min=${setting.min !== undefined ? String(setting.min) : undefined}
					max=${setting.max !== undefined ? String(setting.max) : undefined}
					step=${setting.step !== undefined ? String(setting.step) : undefined}
					unit=${setting.unit}
					@change=${(e: Event) => this.onControlChange(e)}
				/>`;
			case 'select': {
				const options = Object.fromEntries((setting.options || []).map((option) => [option.value, option.label]));
				return html`<select-control
					value=${this._value}
					?locked=${setting.locked === true}
					options=${JSON.stringify(options)}
					@change=${(e: Event) => this.onControlChange(e)}
				/>`;
			}
			case 'font':
				return html`<font-control value=${this._value} ?locked=${setting.locked === true} placeholder=${setting.default} @change=${(e: Event) => this.onControlChange(e)} />`;
		}
	}

	render() {
		const setting = this._setting;
		if (!setting) {
			return;
		}

		const markup = html`
			<div class="db-control-row" data-variable=${setting.variable}>
				<label class="db-control-row__label">${setting.label}</label>
				${setting.description ? html`<span class="db-control-row__description">${setting.description}</span>` : ''}
				<code class="db-control-row__variable">${setting.variable}</code>
				<div class="db-control-row__input">${this.renderInput(setting)}</div>
				${
					!setting.locked
						? html`<button class="db-control-row__reset" type="button" title=${`Reset to ${setting.default}`} @click=${() => this.onReset()}>
							Reset
					  </button>`
						: ''
				}
			</div>
		`;

		this.toggleAttribute('locked', setting.locked === true);
		render(markup, this);
	}
}

if (!customElements.get('db-control-row')) {
	customElements.define('db-control-row', DbControlRow);
}
