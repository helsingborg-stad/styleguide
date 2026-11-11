import { html, render } from 'lit-html';

export type DesignBuilderThemeMode = 'base' | 'dark' | 'contrast';

type ThemeModeChangeDetail = {
	mode: DesignBuilderThemeMode;
};

class DbThemeModeSelector extends HTMLElement {
	private _activeMode: DesignBuilderThemeMode = 'base';
	private _darkEnabled = false;
	private _contrastEnabled = false;

	set activeMode(value: DesignBuilderThemeMode) {
		this._activeMode = value;
		this.render();
	}

	set darkEnabled(value: boolean) {
		this._darkEnabled = value === true;
		this.render();
	}

	set contrastEnabled(value: boolean) {
		this._contrastEnabled = value === true;
		this.render();
	}

	connectedCallback(): void {
		this.render();
	}

	private dispatch(name: string, detail?: ThemeModeChangeDetail): void {
		this.dispatchEvent(new CustomEvent(name, { detail, bubbles: true, composed: true }));
	}

	private render(): void {
		const themeEnabled = this._activeMode === 'dark' ? this._darkEnabled : this._contrastEnabled;
		const themeName = this._activeMode === 'dark' ? 'dark scheme' : 'contrast scheme';
		render(
			html`
				<section class="db-theme-mode" aria-label="Colour schemes">
					<div class="db-theme-mode-heading">
						<div>
							<h2>Colour schemes</h2>
						</div>
						<div class="db-theme-mode-switch" role="group" aria-label="Edit colour scheme">
							${(['base', 'dark', 'contrast'] as const).map(
								(mode) => html`<button type="button" class="db-theme-mode-button ${this._activeMode === mode ? 'db-theme-mode-button-active' : ''}" aria-pressed=${this._activeMode === mode ? 'true' : 'false'} @click=${() => this.dispatch('theme-mode-change', { mode })}>${mode === 'base' ? 'Default' : mode === 'dark' ? 'Dark' : 'Contrast'}</button>`,
							)}
						</div>
					</div>
					${
						this._activeMode === 'base'
							? html`<p class="db-theme-mode-status">Editing Default. Layout is shared; palette assignments can differ in Dark and Contrast.</p>`
							: themeEnabled
								? html`<div class="db-theme-mode-status"><span>Editing ${this._activeMode === 'dark' ? 'Dark' : 'Contrast'}. Unchanged component colours inherit Default.</span><button type="button" class="db-btn" @click=${() => this.dispatch('theme-disable')}>Use Default only</button></div>`
								: html`<div class="db-theme-mode-status"><span>No ${themeName} has been created. Visitors will use Default for this preference.</span><button type="button" class="db-btn db-btn-primary" @click=${() => this.dispatch('theme-enable')}>Create ${themeName}</button></div>`
					}
				</section>
			`,
			this,
		);
	}
}

if (!customElements.get('db-theme-mode-selector')) {
	customElements.define('db-theme-mode-selector', DbThemeModeSelector);
}
