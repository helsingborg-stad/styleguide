import { toHex, hexToRgb, parseRgba, toRgbaString } from '../color-utils';
import type { TokenSetting, ChangeCallback } from '../types';

export class DbRgbaControl extends HTMLElement {
	private setting!: TokenSetting;
	private onChange!: ChangeCallback;
	private colorInput!: HTMLInputElement;
	private alphaInput!: HTMLInputElement;
	private alphaDisplay!: HTMLElement;
	private textInput!: HTMLInputElement;
	private swatch!: HTMLElement;

	configure(setting: TokenSetting, currentValue: string, onChange: ChangeCallback): void {
		this.setting = setting;
		this.onChange = onChange;
		this.render(currentValue);
	}

	setValue(value: string): void {
		const p = parseRgba(value);
		this.colorInput.value = toHex(`rgb(${p.r}, ${p.g}, ${p.b})`);
		this.alphaInput.value = String(p.a);
		this.alphaDisplay.textContent = String(p.a);
		this.textInput.value = value;
		this.swatch.style.backgroundColor = value;
	}

	private render(currentValue: string): void {
		const isLocked = this.setting.locked === true;
		const parsed = parseRgba(currentValue);

		this.colorInput = document.createElement('input');
		this.colorInput.type = 'color';
		this.colorInput.className = 'db-control__color-hidden';
		this.colorInput.value = toHex(`rgb(${parsed.r}, ${parsed.g}, ${parsed.b})`);
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

		this.alphaInput = document.createElement('input');
		this.alphaInput.type = 'range';
		this.alphaInput.className = 'db-control__alpha';
		this.alphaInput.min = '0';
		this.alphaInput.max = '1';
		this.alphaInput.step = '0.01';
		this.alphaInput.value = String(parsed.a);
		this.alphaInput.disabled = isLocked;
		this.appendChild(this.alphaInput);

		this.alphaDisplay = document.createElement('span');
		this.alphaDisplay.className = 'db-control__value-display db-control__alpha-display';
		this.alphaDisplay.textContent = String(parsed.a);
		this.appendChild(this.alphaDisplay);

		this.textInput = document.createElement('input');
		this.textInput.type = 'text';
		this.textInput.className = 'db-control__text';
		this.textInput.value = currentValue;
		this.textInput.disabled = isLocked;
		this.textInput.placeholder = this.setting.default;
		this.appendChild(this.textInput);

		if (!isLocked) {
			const syncFromInputs = () => {
				const { r, g, b } = hexToRgb(this.colorInput.value);
				const a = parseFloat(this.alphaInput.value);
				const rgba = toRgbaString(r, g, b, a);
				this.textInput.value = rgba;
				this.swatch.style.backgroundColor = rgba;
				this.alphaDisplay.textContent = String(a);
				this.onChange(this.setting.variable, rgba);
			};

			this.colorInput.addEventListener('input', syncFromInputs);
			this.alphaInput.addEventListener('input', syncFromInputs);

			this.textInput.addEventListener('change', () => {
				const p = parseRgba(this.textInput.value);
				const rgba = toRgbaString(p.r, p.g, p.b, p.a);
				this.swatch.style.backgroundColor = rgba;
				this.colorInput.value = toHex(`rgb(${p.r}, ${p.g}, ${p.b})`);
				this.alphaInput.value = String(p.a);
				this.alphaDisplay.textContent = String(p.a);
				this.onChange(this.setting.variable, rgba);
			});
		}
	}
}

customElements.define('db-rgba-control', DbRgbaControl);
