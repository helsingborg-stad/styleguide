import { html, render } from 'lit-html';
import { live } from 'lit-html/directives/live.js';

export type ColorControlProps = {
	locked: boolean;
	value: string;
	placeholder?: string;
};

class ColorControl extends HTMLElement {
	connectedCallback() {
		this.render();
	}

	static get observedAttributes() {
		return ['value', 'locked', 'placeholder'];
	}

	attributeChangedCallback() {
		this.render();
	}

	render() {
		const value = this.getAttribute('value') || '';
		const placeholder = this.getAttribute('placeholder') || '';
		const isDisabled = this.hasAttribute('locked');

		const markup = () =>
			html`
				<input
					type="color"
					class="db-control__color-hidden"
					.value=${live(toHex(value))}
					?disabled=${isDisabled}
					@input=${(event: Event) => this.onColorInput(event)}
				/>
				<div
					class="db-control__swatch ${isDisabled ? '' : 'db-control__swatch--clickable'}"
					style="background-color: ${value}"
					@click=${() => {
						if (isDisabled) {
							return;
						}

						const colorInput = this.querySelector<HTMLInputElement>('input[type="color"]');
						colorInput?.click();
					}}
				></div>
				<input
					type="text"
					class="db-control__text"
					.value=${live(value)}
					?disabled=${isDisabled}
					placeholder=${placeholder}
					@change=${(event: Event) => this.onTextChange(event)}
				/>
			`;

		render(markup(), this);
	}

	private onColorInput(event: Event) {
		const value = (event.target as HTMLInputElement).value;
		this.emitChange(value);
	}

	private onTextChange(event: Event) {
		const value = (event.target as HTMLInputElement).value;
		this.emitChange(value);
	}

	private emitChange(value: string) {
		this.dispatchEvent(
			new CustomEvent('change', {
				detail: { value },
				bubbles: true,
				composed: true,
			}),
		);
	}
}

customElements.define('color-control', ColorControl);

function toHex(color: string): string {
	if (/^#[0-9a-f]{6}$/i.test(color)) return color;
	if (/^#[0-9a-f]{3}$/i.test(color)) {
		return `#${color[1]}${color[1]}${color[2]}${color[2]}${color[3]}${color[3]}`;
	}

	const temp = document.createElement('div');
	temp.style.color = color;
	document.body.appendChild(temp);
	const computed = getComputedStyle(temp).color;
	document.body.removeChild(temp);

	const match = computed.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
	if (match) {
		const r = parseInt(match[1], 10).toString(16).padStart(2, '0');
		const g = parseInt(match[2], 10).toString(16).padStart(2, '0');
		const b = parseInt(match[3], 10).toString(16).padStart(2, '0');
		return `#${r}${g}${b}`;
	}

	return '#000000';
}
