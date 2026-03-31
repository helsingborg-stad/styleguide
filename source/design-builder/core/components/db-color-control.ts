import { toHex } from '../color-utils';
import type { TokenSetting, ChangeCallback } from '../types';

export class DbColorControl extends HTMLElement {
	private setting!: TokenSetting;
	private onChange!: ChangeCallback;
	private colorInput!: HTMLInputElement;
	private textInput!: HTMLInputElement;
	private swatch!: HTMLElement;

	configure(setting: TokenSetting, currentValue: string, onChange: ChangeCallback): void {
		this.setting = setting;
		this.onChange = onChange;
		this.render(currentValue);
	}

	setValue(value: string): void {
		this.colorInput.value = toHex(value);
		this.textInput.value = value;
		this.swatch.style.backgroundColor = value;
	}

	private render(currentValue: string): void {
		const isLocked = this.setting.locked === true;

		this.colorInput = document.createElement('input');
		this.colorInput.type = 'color';
		this.colorInput.className = 'db-control__color-hidden';
		this.colorInput.value = toHex(currentValue);
		this.colorInput.disabled = isLocked;
		this.appendChild(this.colorInput);

		this.swatch = document.createElement('div');
		this.swatch.className = 'db-control__swatch';
		this.swatch.style.backgroundColor = currentValue;
		if (!isLocked) {
			this.swatch.classList.add('db-control__swatch--clickable');
			this.swatch.addEventListener('click', () => this.colorInput.click());
		}
		this.appendChild(this.swatch);

		this.textInput = document.createElement('input');
		this.textInput.type = 'text';
		this.textInput.className = 'db-control__text';
		this.textInput.value = currentValue;
		this.textInput.disabled = isLocked;
		this.textInput.placeholder = this.setting.default;
		this.appendChild(this.textInput);

		if (!isLocked) {
			this.colorInput.addEventListener('input', () => {
				this.textInput.value = this.colorInput.value;
				this.swatch.style.backgroundColor = this.colorInput.value;
				this.onChange(this.setting.variable, this.colorInput.value);
			});

			this.textInput.addEventListener('change', () => {
				this.swatch.style.backgroundColor = this.textInput.value;
				this.colorInput.value = toHex(this.textInput.value);
				this.onChange(this.setting.variable, this.textInput.value);
			});
		}
	}
}

customElements.define('db-color-control', DbColorControl);
