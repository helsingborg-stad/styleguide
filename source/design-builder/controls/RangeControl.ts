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

	render() {
		const isDisabled = this.hasAttribute('locked');
		const min = this.getAttribute('min') || '0';
		const max = this.getAttribute('max') || '100';
		const step = this.getAttribute('step') || '1';
		const value = this.getAttribute('value') || '';
		const unit = this.getAttribute('unit') || '';

		const markup = () =>
			html`
				<input type="range" min=${min} max=${max} step=${step} .value=${live(value)} ?disabled=${isDisabled} @input=${this._onInput}/>
                <output>${value} ${unit}</output>
            `;

		render(markup(), this);
	}

	_onInput(e: Event) {
		const value = (e.target as HTMLInputElement).value;

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
