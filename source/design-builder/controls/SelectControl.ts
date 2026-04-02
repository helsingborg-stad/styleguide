import { html, render } from 'lit-html';
import { live } from 'lit-html/directives/live.js';

export type SelectControlProps = {
	locked: boolean;
	value: string;
	options?: string;
};

/**
 * A custom select control web component that renders a dropdown select element. It supports attributes for locking the control and setting the selected value. The component dispatches a custom 'change' event with the selected value when the user changes the selection.
 *
 * Attributes:
 * - `value`: The currently selected value of the select control.
 * - `locked`: If present, the select control will be disabled and not interactable.
 * - `options`: A JSON string representing the options for the select control. It can be either an object with key-value pairs (where keys are option values and values are option labels) or an array of strings (where each string is both the option value and label). Example: '{"option1": "Option 1", "option2": "Option 2", "option3": "Option 3";}' or '["option1", "Option 2", "Option 3"]'.
 *
 * Events:
 * - `change`: Dispatched when the user changes the selection. The event detail contains the selected value in the format `{ value: string }`.
 */
class SelectControl extends HTMLElement {
	connectedCallback() {
		this.render();
	}

	// Specify which attributes to observe
	static get observedAttributes() {
		return ['value', 'locked', 'options'];
	}

	// React to attribute changes
	attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
		if (oldValue !== newValue) {
			this.render();
		}
	}

	render() {
		const isDisabled = this.hasAttribute('locked');
		const value = this.getAttribute('value') || '';
		const options = this.getOptions();

		const markup = () =>
			html`
				<select .value=${live(value)} ?disabled=${isDisabled} @change=${(e: Event) => this._onInput(e)}>
					${options.map((option) => html`<option value=${option.value}>${option.label}</option>`)}
				</select>
            `;

		render(markup(), this);
	}

	private getOptions(): { value: string; label: string; selected?: boolean }[] {
		const optionsAttr = this.getAttribute('options');
		const value = this.getAttribute('value') || '';

		if (!optionsAttr) {
			return [];
		}

		try {
			const parsedOptions = JSON.parse(optionsAttr);
			if (Array.isArray(parsedOptions)) {
				return parsedOptions.map((option) => ({ value: option, label: option, selected: option === value }));
			} else if (typeof parsedOptions === 'object') {
				return Object.entries(parsedOptions).map(([key, label]) => ({
					value: key,
					label,
					selected: key === value,
				})) as {
					value: string;
					label: string;
					selected?: boolean;
				}[];
			}
		} catch (error) {
			console.error('Failed to parse options attribute:', error);
		}

		return [];
	}

	_onInput(e: Event) {
		const value = (e.target as HTMLSelectElement).value;

		this.dispatchEvent(
			new CustomEvent('change', {
				detail: { value },
				bubbles: true,
				composed: true,
			}),
		);
	}
}

customElements.define('select-control', SelectControl);
