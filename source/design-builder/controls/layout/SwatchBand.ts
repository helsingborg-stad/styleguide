import { html, render } from 'lit-html';
import type { TokenSetting } from '../types';

class DbSwatchBand extends HTMLElement {
	private _settings: TokenSetting[] = [];

	set settings(value: TokenSetting[]) {
		this._settings = value;
		this.render();
	}

	connectedCallback() {
		this.render();
	}

	private groupedSettings(): Array<{ groupKey: string; settings: TokenSetting[] }> {
		const groups = new Map<string, TokenSetting[]>();

		for (const setting of this._settings) {
			const match = setting.variable.match(/^--color--(\w+)-\d+$/);
			const groupKey = match ? match[1] : 'other';
			if (!groups.has(groupKey)) {
				groups.set(groupKey, []);
			}
			groups.get(groupKey)?.push(setting);
		}

		return [...groups.entries()].map(([groupKey, settings]) => ({ groupKey, settings }));
	}

	render() {
		const markup = html`
			<div class="db-swatch-band">
				${this.groupedSettings().map(
					({ groupKey, settings }) => html`
						<div class="db-swatch-band__row">
							<code class="db-swatch-band__var">${`--color--${groupKey}-[%]`}</code>
							<div class="db-swatch-band__strip">
								${settings.map((setting) => {
									const pctMatch = setting.variable.match(/-(\d+)$/);
									const pct = pctMatch ? `${pctMatch[1]}` : '';
									return html`
										<div class="db-swatch-band__swatch" style=${`background-color: ${setting.default}`} title=${`${setting.variable}\n${setting.default}`}>
											<span class="db-swatch-band__pct">${pct}</span>
										</div>
									`;
								})}
							</div>
						</div>
					`,
				)}
			</div>
		`;

		render(markup, this);
	}
}

if (!customElements.get('db-swatch-band')) {
	customElements.define('db-swatch-band', DbSwatchBand);
}
