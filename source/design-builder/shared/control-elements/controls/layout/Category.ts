import { html, nothing, render } from 'lit-html';
import type { TokenCategory } from '../../../types/designBuilderDataTypes';

type CategoryMeta = Pick<TokenCategory, 'id' | 'label' | 'description'>;

class DbCategory extends HTMLElement {
	private _category?: CategoryMeta;
	private _items: HTMLElement[] = [];
	private _collapsible = false;
	private _collapsed = false;

	set category(value: CategoryMeta | undefined) {
		this._category = value;
		this.render();
	}

	set items(value: HTMLElement[]) {
		this._items = value;
		this.render();
	}

	set collapsible(value: boolean) {
		this._collapsible = value;
		this.render();
	}

	connectedCallback() {
		this.render();
	}

	private toggleCollapsed() {
		if (!this._collapsible || this._items.length === 0) {
			return;
		}

		this._collapsed = !this._collapsed;
		this.render();
	}

	private render() {
		if (!this._category || this._items.length === 0) {
			this.hidden = true;
			render(nothing, this);
			return;
		}

		this.hidden = false;
		const categoryId = this._category.id;
		const bodyId = `db-category-body-${categoryId}`;
		const headingId = `db-category-title-${categoryId}`;

		const markup = html`
			<section class=${`db-category${this._collapsed ? ' db-category-collapsed' : ''}`} data-category-id=${categoryId}>
				<div
					class="db-category-header"
					role=${this._collapsible ? 'button' : nothing}
					tabindex=${this._collapsible ? '0' : nothing}
					aria-controls=${this._collapsible ? bodyId : nothing}
					aria-expanded=${this._collapsible ? String(!this._collapsed) : nothing}
					@click=${() => this.toggleCollapsed()}
					@keydown=${(event: KeyboardEvent) => {
						if (!this._collapsible) {
							return;
						}

						if (event.key === 'Enter' || event.key === ' ') {
							event.preventDefault();
							this.toggleCollapsed();
						}
					}}
				>
					<h2 class="db-category-title" id=${headingId}>${this._category.label}</h2>
					${this._category.description ? html`<p class="db-category-description">${this._category.description}</p>` : nothing}
					${this._collapsible ? html`<span class="db-category-toggle" aria-hidden="true"></span>` : nothing}
				</div>
				<div class="db-category-body" id=${bodyId} aria-labelledby=${headingId}>
					${this._items}
				</div>
			</section>
		`;

		render(markup, this);
	}
}

if (!customElements.get('db-category')) {
	customElements.define('db-category', DbCategory);
}