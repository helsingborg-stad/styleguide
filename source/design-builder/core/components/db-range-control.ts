import type { TokenSetting, ChangeCallback } from '../types';

export class DbRangeControl extends HTMLElement {
	private setting!: TokenSetting;
	private onChange!: ChangeCallback;
	private rangeInput!: HTMLInputElement;
	private display!: HTMLElement;

	configure(setting: TokenSetting, currentValue: string, onChange: ChangeCallback): void {
		this.setting = setting;
		this.onChange = onChange;
		this.render(currentValue);
	}

	setValue(value: string): void {
		const numVal = parseFloat(value);
		if (!Number.isNaN(numVal)) this.rangeInput.value = String(numVal);
		this.display.textContent = value;
	}

	private render(currentValue: string): void {
		const isLocked = this.setting.locked === true;
		const numVal = parseFloat(currentValue);
		const unit = this.setting.unit || '';

		this.rangeInput = document.createElement('input');
		this.rangeInput.type = 'range';
		this.rangeInput.disabled = isLocked;
		if (this.setting.min !== undefined) this.rangeInput.min = String(this.setting.min);
		if (this.setting.max !== undefined) this.rangeInput.max = String(this.setting.max);
		if (this.setting.step !== undefined) this.rangeInput.step = String(this.setting.step);
		this.rangeInput.value = Number.isNaN(numVal) ? '0' : String(numVal);
		this.appendChild(this.rangeInput);

		this.display = document.createElement('span');
		this.display.className = 'db-control__value-display';
		this.display.textContent = currentValue;
		this.appendChild(this.display);

		if (!isLocked) {
			this.rangeInput.addEventListener('input', () => {
				const val = unit ? `${this.rangeInput.value}${unit}` : this.rangeInput.value;
				this.display.textContent = val;
				this.onChange(this.setting.variable, val);
			});
		}
	}
}

customElements.define('db-range-control', DbRangeControl);
