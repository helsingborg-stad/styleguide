import { html, render } from 'lit-html';
import { live } from 'lit-html/directives/live.js';

export type RangeControlProps = {
	locked: boolean;
	value: string;
	min?: string;
	max?: string;
	step?: string;
	unit?: string;
};

class RangeControl extends HTMLElement {
	private formatOutput(value: string, unit: string): string {
		return `${value} ${unit}`;
	}

	connectedCallback() {
		this.render();
	}

	// Specify which attributes to observe
	static get observedAttributes() {
		return ['value', 'min', 'max', 'step', 'locked', 'unit'];
	}

	// React to attribute changes
	attributeChangedCallback() {
		this.render();
	}

	private getClampedValue(value: string, min: string, max: string): string {
		if (value === '') {
			return value;
		}

		const numericValue = Number.parseFloat(value);
		const numericMin = Number.parseFloat(min);
		const numericMax = Number.parseFloat(max);

		if (Number.isNaN(numericValue)) {
			return value;
		}

		const lowerBound = Number.isNaN(numericMin) ? numericValue : numericMin;
		const upperBound = Number.isNaN(numericMax) ? numericValue : numericMax;
		const clampedValue = Math.min(Math.max(numericValue, lowerBound), upperBound);

		return String(clampedValue);
	}

	render() {
		const isDisabled = this.hasAttribute('locked');
		const min = this.getAttribute('min') || '0';
		const max = this.getAttribute('max') || '100';
		const step = this.getAttribute('step') || '1';
		const value = this.getClampedValue(this.getAttribute('value') || '', min, max);
		const unit = this.getAttribute('unit') || '';

		const markup = () =>
			html`
				<input type="range" min=${min} max=${max} step=${step} .value=${live(value)} ?disabled=${isDisabled} @input=${(e: Event) => this._onInput(e)}/>
				<output>${this.formatOutput(value, unit)}</output>
            `;

		render(markup(), this);
	}

	_onInput(e: Event) {
		const input = e.target as HTMLInputElement;
		const value = this.getClampedValue(input.value, input.min, input.max);
		if (input.value !== value) {
			input.value = value;
		}

		const output = this.querySelector('output');
		if (output) {
			output.textContent = this.formatOutput(value, this.getAttribute('unit') || '');
		}

		this.dispatchEvent(
			new CustomEvent('change', {
				detail: { value },
				bubbles: true,
				composed: true,
			}),
		);
	}
}

customElements.define('range-control', RangeControl);
