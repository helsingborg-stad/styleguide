import { html, render } from 'lit-html';
import { live } from 'lit-html/directives/live.js';

export type FontControlProps = {
	locked: boolean;
	value: string;
	placeholder?: string;
};

class FontControl extends HTMLElement {
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
					type="text"
					class="db-control__text db-control__text--font"
					.value=${live(value)}
					?disabled=${isDisabled}
					placeholder=${placeholder}
					@change=${(event: Event) => this.onInputChange(event)}
				/>
				<span class="db-control__font-preview" style="font-family: ${value}">The quick brown fox</span>
			`;

		render(markup(), this);
	}

	private onInputChange(event: Event) {
		const value = (event.target as HTMLInputElement).value;
		this.dispatchEvent(
			new CustomEvent('change', {
				detail: { value },
				bubbles: true,
				composed: true,
			}),
		);
	}
}

customElements.define('font-control', FontControl);
