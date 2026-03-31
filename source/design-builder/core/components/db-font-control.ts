import type { ChangeCallback, TokenSetting } from '../types';

export class DbFontControl extends HTMLElement {
	private setting!: TokenSetting;
	private onChange!: ChangeCallback;
	private input!: HTMLInputElement;
	private preview!: HTMLElement;

	configure(setting: TokenSetting, currentValue: string, onChange: ChangeCallback): void {
		this.setting = setting;
		this.onChange = onChange;
		this.render(currentValue);
	}

	setValue(value: string): void {
		this.input.value = value;
		this.preview.style.fontFamily = value;
	}

	private render(currentValue: string): void {
		const isLocked = this.setting.locked === true;

		this.input = document.createElement('input');
		this.input.type = 'text';
		this.input.className = 'db-control__text db-control__text--font';
		this.input.value = currentValue;
		this.input.disabled = isLocked;
		this.input.placeholder = this.setting.default;
		this.appendChild(this.input);

		this.preview = document.createElement('span');
		this.preview.className = 'db-control__font-preview';
		this.preview.style.fontFamily = currentValue;
		this.appendChild(this.preview);

		if (!isLocked) {
			this.input.addEventListener('change', () => {
				this.preview.style.fontFamily = this.input.value;
				this.onChange(this.setting.variable, this.input.value);
			});
		}
	}
}

customElements.define('db-font-control', DbFontControl);
