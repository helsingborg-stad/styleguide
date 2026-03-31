import type { TokenSetting } from '../types';

export class DbSwatchBand extends HTMLElement {
	configure(settings: TokenSetting[]): void {
		this.render(settings);
	}

	private render(settings: TokenSetting[]): void {
		this.className = 'db-swatch-band';

		const groups = new Map<string, TokenSetting[]>();
		for (const setting of settings) {
			const match = setting.variable.match(/^--color--(\w+)-\d+$/);
			const groupKey = match ? match[1] : 'other';
			if (!groups.has(groupKey)) groups.set(groupKey, []);
			groups.get(groupKey)!.push(setting);
		}

		for (const [groupKey, groupSettings] of groups) {
			const row = document.createElement('div');
			row.className = 'db-swatch-band__row';

			const varLabel = document.createElement('code');
			varLabel.className = 'db-swatch-band__var';
			varLabel.textContent = `--color--${groupKey}-[%]`;
			row.appendChild(varLabel);

			const strip = document.createElement('div');
			strip.className = 'db-swatch-band__strip';

			for (const setting of groupSettings) {
				const swatch = document.createElement('div');
				swatch.className = 'db-swatch-band__swatch';
				swatch.style.backgroundColor = setting.default;

				const pctMatch = setting.variable.match(/-(\d+)$/);
				const pct = pctMatch ? pctMatch[1] : '';
				swatch.title = `${setting.variable}\n${setting.default}`;

				const pctLabel = document.createElement('span');
				pctLabel.className = 'db-swatch-band__pct';
				pctLabel.textContent = pct;

				swatch.appendChild(pctLabel);
				strip.appendChild(swatch);
			}

			row.appendChild(strip);
			this.appendChild(row);
		}
	}
}

customElements.define('db-swatch-band', DbSwatchBand);
