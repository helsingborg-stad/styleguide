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
	private _infoOpen = false;

	private handleDocumentPointerDown = (event: Event) => {
		if (!this._infoOpen) {
			return;
		}

		const target = event.target;
		if (target instanceof Node && this.contains(target)) {
			return;
		}

		this._infoOpen = false;
		this.render();
	};

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
		document.addEventListener('pointerdown', this.handleDocumentPointerDown, true);
		this.render();
	}

	disconnectedCallback() {
		document.removeEventListener('pointerdown', this.handleDocumentPointerDown, true);
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
		const rawValue = getControlChangeValue(event);
		if (rawValue === undefined) {
			return;
		}

		const setting = this._setting;
		if (!setting) {
			return;
		}

		let value = rawValue;
		if (setting.type === 'range' && setting.unit) {
			const unit = setting.unit;
			if (!value.endsWith(unit)) {
				value = `${value}${unit}`;
			}
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

	private onInfoButtonClick(event: Event) {
		event.preventDefault();
		event.stopPropagation();
		this._infoOpen = !this._infoOpen;
		this.render();
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

		const variableDescription = setting.description?.trim() ?? '';
		const tooltipText = [variableDescription, setting.variable].filter(Boolean).join('\n');
		const infoPanelId = `db-control-row-info-${setting.variable.replace(/[^a-z0-9_-]/gi, '-').toLowerCase()}`;
		const showInfoPanel = tooltipText !== '' && this._infoOpen;

		const markup = html`
			<div
				class="db-control-row"
				data-variable=${setting.variable}
				data-tip-variable=${setting.variable}
				data-tip-description=${variableDescription}
			>
				<label class="db-control-row-label"><span class="db-control-row-label-text">${setting.label}</span>${tooltipText ? html`<button type="button" class="db-control-info-btn" aria-label="Token info" aria-expanded=${showInfoPanel ? 'true' : 'false'} aria-controls=${infoPanelId} @click=${(event: Event) => this.onInfoButtonClick(event)}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" aria-hidden="true" focusable="false"><path d="M440-280h80v-240h-80v240Zm68.5-331.5Q520-623 520-640t-11.5-28.5Q497-680 480-680t-28.5 11.5Q440-657 440-640t11.5 28.5Q463-600 480-600t28.5-11.5ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg></button>` : ''}</label>
				${showInfoPanel ? html`<div class="db-control-row-info" id=${infoPanelId}>${variableDescription ? html`<p class="db-control-row-info-description">${variableDescription}</p>` : ''}<code class="db-control-row-info-variable">css-variable: ${setting.variable}</code></div>` : ''}
				${setting.description ? html`<span class="db-control-row-description">${setting.description}</span>` : ''}
				<code class="db-control-row-variable">${setting.variable}</code>
				<div class="db-control-row-input">${this.renderInput(setting)}</div>
				${
					!setting.locked
						? html`<button class="db-control-row-reset" type="button" title=${`Reset to ${setting.default}`} @click=${() => this.onReset()}>
							Reset
					  </button>`
						: ''
				}
			</div>
		`;

		this.toggleAttribute('info-open', showInfoPanel);
		this.toggleAttribute('locked', setting.locked === true);
		render(markup, this);
	}
}

if (!customElements.get('db-control-row')) {
	customElements.define('db-control-row', DbControlRow);
}
