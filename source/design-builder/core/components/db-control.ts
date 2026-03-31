import type { TokenSetting, ChangeCallback } from '../types';

// Side-effect imports to ensure custom elements are registered
import './db-color-control';
import './db-rgba-control';
import './db-range-control';
import './db-select-control';
import './db-font-control';

import type { DbColorControl } from './db-color-control';
import type { DbRgbaControl } from './db-rgba-control';
import type { DbRangeControl } from './db-range-control';
import type { DbSelectControl } from './db-select-control';
import type { DbFontControl } from './db-font-control';

type ControlInput = DbColorControl | DbRgbaControl | DbRangeControl | DbSelectControl | DbFontControl;

export class DbControl extends HTMLElement {
	private setting!: TokenSetting;
	private controlInput: ControlInput | null = null;

	configure(setting: TokenSetting, currentValue: string, onChange: ChangeCallback): void {
		this.setting = setting;
		this.render(currentValue, onChange);
	}

	setValue(value: string): void {
		this.controlInput?.setValue(value);
	}

	private render(currentValue: string, onChange: ChangeCallback): void {
		this.className = 'db-control';
		if (this.setting.locked) {
			this.classList.add('db-control--locked');
		}
		this.dataset.variable = this.setting.variable;

		const label = document.createElement('label');
		label.className = 'db-control__label';
		label.textContent = this.setting.label;
		this.appendChild(label);

		if (this.setting.description) {
			const desc = document.createElement('span');
			desc.className = 'db-control__description';
			desc.textContent = this.setting.description;
			this.appendChild(desc);
		}

		const varName = document.createElement('code');
		varName.className = 'db-control__variable';
		varName.textContent = this.setting.variable;
		this.appendChild(varName);

		const controlWrap = document.createElement('div');
		controlWrap.className = 'db-control__input';

		this.controlInput = this.createControlInput();
		if (this.controlInput) {
			this.controlInput.configure(this.setting, currentValue, onChange);
			controlWrap.appendChild(this.controlInput);
		}

		this.appendChild(controlWrap);

		if (!this.setting.locked) {
			const resetBtn = document.createElement('button');
			resetBtn.className = 'db-control__reset';
			resetBtn.type = 'button';
			resetBtn.title = `Reset to ${this.setting.default}`;
			resetBtn.textContent = 'Reset';
			resetBtn.addEventListener('click', () => {
				onChange(this.setting.variable, '');
				this.controlInput?.setValue(this.setting.default);
			});
			this.appendChild(resetBtn);
		}
	}

	private createControlInput(): ControlInput | null {
		switch (this.setting.type) {
			case 'color':
				return document.createElement('db-color-control') as DbColorControl;
			case 'rgba':
				return document.createElement('db-rgba-control') as DbRgbaControl;
			case 'range':
				return document.createElement('db-range-control') as DbRangeControl;
			case 'select':
				return document.createElement('db-select-control') as DbSelectControl;
			case 'font':
				return document.createElement('db-font-control') as DbFontControl;
			default:
				return null;
		}
	}
}

customElements.define('db-control', DbControl);
