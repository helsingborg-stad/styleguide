import { html, render } from 'lit-html';
import { live } from 'lit-html/directives/live.js';

type BoundsState = {
	minValue: number;
	maxValue: number;
	minBound: number;
	maxBound: number;
	step: number;
};

function toNumber(value: string | null, fallback: number): number {
	if (value === null) {
		return fallback;
	}

	const parsed = Number.parseFloat(value);
	return Number.isNaN(parsed) ? fallback : parsed;
}

class RangeBoundsControl extends HTMLElement {
	private state: BoundsState = {
		minValue: 0,
		maxValue: 100,
		minBound: 0,
		maxBound: 100,
		step: 1,
	};

	connectedCallback() {
		this.readAttributesIntoState();
		this.render();
	}

	static get observedAttributes() {
		return ['value', 'max-value', 'min', 'max', 'step', 'locked', 'unit', 'min-label', 'max-label', 'max-variable'];
	}

	attributeChangedCallback() {
		this.readAttributesIntoState();
		this.render();
	}

	private readAttributesIntoState() {
		const minBound = toNumber(this.getAttribute('min'), 0);
		const maxBound = toNumber(this.getAttribute('max'), 100);
		const step = Math.max(toNumber(this.getAttribute('step'), 1), 0.0001);
		const rawMinValue = toNumber(this.getAttribute('value'), minBound);
		const rawMaxValue = toNumber(this.getAttribute('max-value'), maxBound);
		const minValue = Math.min(Math.max(rawMinValue, minBound), maxBound);
		const maxValue = Math.max(Math.min(rawMaxValue, maxBound), minBound);

		this.state = {
			minBound,
			maxBound,
			step,
			minValue: Math.min(minValue, maxValue),
			maxValue: Math.max(maxValue, minValue),
		};
	}

	private getPercent(value: number): number {
		const { minBound, maxBound } = this.state;
		if (maxBound <= minBound) {
			return 0;
		}

		return ((value - minBound) / (maxBound - minBound)) * 100;
	}

	private render() {
		const unit = this.getAttribute('unit') || '';
		const maxVariable = this.getAttribute('max-variable') || '';
		const minLabel = this.getAttribute('min-label') || 'Min';
		const maxLabel = this.getAttribute('max-label') || 'Max';
		const isDisabled = this.hasAttribute('locked');
		const { minValue, maxValue, minBound, maxBound, step } = this.state;
		const minPercent = this.getPercent(minValue);
		const maxPercent = this.getPercent(maxValue);

		const markup = html`
			<div class="db-range-bounds">
				<div class="db-range-bounds-slider" style=${`--db-range-min:${minPercent}%; --db-range-max:${maxPercent}%;`}>
					<div class="db-range-bounds-track"></div>
					<div class="db-range-bounds-fill"></div>
					<input
						class="db-range-bounds-input db-range-bounds-input-min"
						type="range"
						min=${minBound}
						max=${maxBound}
						step=${step}
						.value=${live(String(minValue))}
						?disabled=${isDisabled}
						aria-label=${minLabel}
						@input=${(event: Event) => this.onMinInput(event, maxVariable)}
					/>
					<input
						class="db-range-bounds-input db-range-bounds-input-max"
						type="range"
						min=${minBound}
						max=${maxBound}
						step=${step}
						.value=${live(String(maxValue))}
						?disabled=${isDisabled}
						aria-label=${maxLabel}
						@input=${(event: Event) => this.onMaxInput(event, maxVariable)}
					/>
				</div>
				<output>${minValue}-${maxValue} ${unit}</output>
			</div>
		`;

		render(markup, this);
	}

	private emitChange(maxVariable: string) {
		this.dispatchEvent(
			new CustomEvent('change', {
				detail: {
					value: String(this.state.minValue),
					extraValues: {
						[maxVariable]: String(this.state.maxValue),
					},
				},
				bubbles: true,
				composed: true,
			}),
		);
	}

	private onMinInput(event: Event, maxVariable: string) {
		const input = event.target as HTMLInputElement;
		const nextMin = toNumber(input.value, this.state.minValue);
		this.state.minValue = Math.min(Math.max(nextMin, this.state.minBound), this.state.maxValue);
		this.render();
		this.emitChange(maxVariable);
	}

	private onMaxInput(event: Event, maxVariable: string) {
		const input = event.target as HTMLInputElement;
		const nextMax = toNumber(input.value, this.state.maxValue);
		this.state.maxValue = Math.max(Math.min(nextMax, this.state.maxBound), this.state.minValue);
		this.render();
		this.emitChange(maxVariable);
	}
}

if (!customElements.get('range-bounds-control')) {
	customElements.define('range-bounds-control', RangeBoundsControl);
}
