import type { TokenSetting, ChangeCallback } from '../types';

export class DbSelectControl extends HTMLElement {
	private setting!: TokenSetting;
	private onChange!: ChangeCallback;
	private selectEl!: HTMLSelectElement;

	configure(setting: TokenSetting, currentValue: string, onChange: ChangeCallback): void {
		this.setting = setting;
		this.onChange = onChange;
		this.render(currentValue);
	}

	setValue(value: string): void {
		this.selectEl.value = value;
	}

	private render(currentValue: string): void {
		const isLocked = this.setting.locked === true;

		this.selectEl = document.createElement('select');
		this.selectEl.disabled = isLocked;

		for (const opt of this.setting.options || []) {
			const option = document.createElement('option');
			option.value = opt.value;
			option.textContent = opt.label;
			if (opt.value === currentValue) option.selected = true;
			this.selectEl.appendChild(option);
		}

		this.appendChild(this.selectEl);

		if (!isLocked) {
			this.selectEl.addEventListener('change', () => {
				this.onChange(this.setting.variable, this.selectEl.value);
			});
		}
	}
}

customElements.define('db-select-control', DbSelectControl);
