import { html, render } from 'lit-html';
import { live } from 'lit-html/directives/live.js';

export type RgbaControlProps = {
	locked: boolean;
	value: string;
	placeholder?: string;
};

class RgbaControl extends HTMLElement {
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
		const parsed = parseRgba(value);
		const alphaValue = String(parsed.a);
		const colorValue = toHex(`rgb(${parsed.r}, ${parsed.g}, ${parsed.b})`);

		const markup = () =>
			html`
				<input
					type="color"
					class="db-control-color-input"
					.value=${live(colorValue)}
					?disabled=${isDisabled}
					@input=${() => this.syncFromColorAndAlpha()}
				/>
				<input
					type="range"
					class="db-control-alpha"
					min="0"
					max="1"
					step="0.01"
					.value=${live(alphaValue)}
					?disabled=${isDisabled}
					@input=${() => this.syncFromColorAndAlpha()}
				/>
				<span class="db-control-value-display db-control-alpha-display">${alphaValue}</span>
				<input
					type="text"
					class="db-control-text"
					.value=${live(value)}
					?disabled=${isDisabled}
					placeholder=${placeholder}
					@change=${(event: Event) => this.syncFromText(event)}
				/>
			`;

		render(markup(), this);
	}

	private syncFromColorAndAlpha() {
		const colorInput = this.querySelector<HTMLInputElement>('input[type="color"]');
		const alphaInput = this.querySelector<HTMLInputElement>('.db-control-alpha');
		if (!colorInput || !alphaInput) {
			return;
		}

		const { r, g, b } = hexToRgb(colorInput.value);
		const a = parseFloat(alphaInput.value);
		const value = toRgbaString(r, g, b, a);
		this.emitChange(value);
	}

	private syncFromText(event: Event) {
		const textValue = (event.target as HTMLInputElement).value;
		const parsed = parseRgba(textValue);
		const value = toRgbaString(parsed.r, parsed.g, parsed.b, parsed.a);
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

customElements.define('rgba-control', RgbaControl);

function hexToRgb(hex: string): { r: number; g: number; b: number } {
	return {
		r: parseInt(hex.slice(1, 3), 16),
		g: parseInt(hex.slice(3, 5), 16),
		b: parseInt(hex.slice(5, 7), 16),
	};
}

function parseRgba(value: string): { r: number; g: number; b: number; a: number } {
	const match = value.match(/rgba?\(\s*(\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\s*\)/);
	if (match) {
		return {
			r: parseInt(match[1], 10),
			g: parseInt(match[2], 10),
			b: parseInt(match[3], 10),
			a: match[4] !== undefined ? parseFloat(match[4]) : 1,
		};
	}

	if (/^#[0-9a-f]{6}$/i.test(value)) {
		return {
			r: parseInt(value.slice(1, 3), 16),
			g: parseInt(value.slice(3, 5), 16),
			b: parseInt(value.slice(5, 7), 16),
			a: 1,
		};
	}

	return { r: 0, g: 0, b: 0, a: 1 };
}

function toRgbaString(r: number, g: number, b: number, a: number): string {
	return `rgba(${r}, ${g}, ${b}, ${a})`;
}

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
