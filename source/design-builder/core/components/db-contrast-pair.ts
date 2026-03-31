import { toHex } from '../color-utils';
import type { TokenSetting, ChangeCallback } from '../types';

export class DbContrastPair extends HTMLElement {
	configure(
		base: TokenSetting,
		contrasts: { setting: TokenSetting; value: string }[],
		baseValue: string,
		onChange: ChangeCallback,
	): void {
		this.render(base, contrasts, baseValue, onChange);
	}

	private render(
		base: TokenSetting,
		contrasts: { setting: TokenSetting; value: string }[],
		baseValue: string,
		onChange: ChangeCallback,
	): void {
		this.className = 'db-pair';

		const previews: HTMLElement[] = [];

		const baseCol = document.createElement('div');
		baseCol.className = 'db-pair__col';
		baseCol.appendChild(
			this.buildColorCell(base, baseValue, onChange, (val) => {
				for (const p of previews) p.style.backgroundColor = val;
			}),
		);
		this.appendChild(baseCol);

		const contrastsWrap = document.createElement('div');
		contrastsWrap.className = 'db-pair__contrasts';

		for (const { setting: contrastSetting, value: contrastValue } of contrasts) {
			const contrastRow = document.createElement('div');
			contrastRow.className = 'db-pair__contrast-row';

			const contrastCol = document.createElement('div');
			contrastCol.className = 'db-pair__col';

			const previewCol = document.createElement('div');
			previewCol.className = 'db-pair__preview-col';
			const preview = document.createElement('div');
			preview.className = 'db-pair__preview';
			preview.style.backgroundColor = baseValue;
			preview.style.color = contrastValue;
			preview.innerHTML =
				'<span class="db-pair__preview-lg">Aa</span><span class="db-pair__preview-sm">The quick brown fox jumps over the lazy dog</span>';
			previews.push(preview);
			previewCol.appendChild(preview);

			contrastCol.appendChild(
				this.buildColorCell(contrastSetting, contrastValue, onChange, (val) => {
					preview.style.color = val;
				}),
			);

			contrastRow.appendChild(contrastCol);
			contrastRow.appendChild(previewCol);
			contrastsWrap.appendChild(contrastRow);
		}

		this.appendChild(contrastsWrap);
	}

	private buildColorCell(
		setting: TokenSetting,
		currentValue: string,
		onChange: ChangeCallback,
		onPreviewUpdate: (val: string) => void,
	): HTMLElement {
		const cell = document.createElement('div');
		cell.className = 'db-pair__cell';
		cell.dataset.variable = setting.variable;

		const label = document.createElement('label');
		label.className = 'db-pair__label';
		label.textContent = setting.label;
		cell.appendChild(label);

		const varName = document.createElement('code');
		varName.className = 'db-pair__variable';
		varName.textContent = setting.variable;
		cell.appendChild(varName);

		const inputRow = document.createElement('div');
		inputRow.className = 'db-pair__inputs';

		const colorInput = document.createElement('input');
		colorInput.type = 'color';
		colorInput.className = 'db-control__color-hidden';
		colorInput.value = toHex(currentValue);
		inputRow.appendChild(colorInput);

		const swatch = document.createElement('div');
		swatch.className = 'db-control__swatch db-control__swatch--clickable';
		swatch.style.backgroundColor = currentValue;
		swatch.addEventListener('click', () => colorInput.click());
		inputRow.appendChild(swatch);

		const textInput = document.createElement('input');
		textInput.type = 'text';
		textInput.className = 'db-control__text';
		textInput.value = currentValue;
		textInput.placeholder = setting.default;
		inputRow.appendChild(textInput);

		colorInput.addEventListener('input', () => {
			textInput.value = colorInput.value;
			swatch.style.backgroundColor = colorInput.value;
			onPreviewUpdate(colorInput.value);
			onChange(setting.variable, colorInput.value);
		});

		textInput.addEventListener('change', () => {
			swatch.style.backgroundColor = textInput.value;
			colorInput.value = toHex(textInput.value);
			onPreviewUpdate(textInput.value);
			onChange(setting.variable, textInput.value);
		});

		cell.appendChild(inputRow);

		const resetBtn = document.createElement('button');
		resetBtn.className = 'db-control__reset';
		resetBtn.type = 'button';
		resetBtn.title = `Reset to ${setting.default}`;
		resetBtn.textContent = 'Reset';
		resetBtn.addEventListener('click', () => {
			onChange(setting.variable, '');
			colorInput.value = toHex(setting.default);
			textInput.value = setting.default;
			swatch.style.backgroundColor = setting.default;
			onPreviewUpdate(setting.default);
		});
		cell.appendChild(resetBtn);

		return cell;
	}
}

customElements.define('db-contrast-pair', DbContrastPair);
