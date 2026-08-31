import type { PaginationAttributes, PaginationElements } from './interface';
import { PAGINATION_ATTRIBUTES } from './interface';

/**
 * Renders pagination-controlled markup and control links.
 */
class PaginationDomRenderer {
	constructor(private readonly elements: PaginationElements, private readonly attributes: PaginationAttributes) {}

	public renderPageItems(listItems: Element[]): void {
		const isAsyncPagination = this.elements.container.hasAttribute(PAGINATION_ATTRIBUTES.async)
			|| this.elements.paginationContainer.hasAttribute(PAGINATION_ATTRIBUTES.async);

		if (this.attributes.keepDOM && !isAsyncPagination) {
			Array.from(this.elements.listContainer.children).forEach((element) => {
				if (!(element as HTMLElement).querySelector(`[${PAGINATION_ATTRIBUTES.sort}]`)) {
					(element as HTMLElement).classList.add('u-display--none');
				}
			});

			listItems.forEach((element) => {
				(element as HTMLElement).classList.remove('u-display--none');
				this.elements.listContainer.appendChild(element);
			});

			return;
		}

		this.elements.listContainer.innerHTML = '';
		listItems.forEach((element) => {
			this.elements.listContainer.appendChild(element);
		});
	}

	public renderLinks(numberOfPages: number, currentPage: number): void {
		this.elements.paginationContainer.classList.remove('u-display--none');

		if (numberOfPages <= 1 || !this.elements.linkTemplate) {
			this.elements.paginationContainer.classList.add('u-display--none');
			this.elements.linksContainer.innerHTML = '';
			return;
		}

		this.elements.linksContainer.innerHTML = '';

		const range = this.getPageRangeToRender(currentPage, numberOfPages);
		for (let pageNumber = range.start; pageNumber <= range.end; pageNumber++) {
			const linkElement = this.elements.linkTemplate.cloneNode(true) as HTMLElement;
			linkElement.setAttribute(PAGINATION_ATTRIBUTES.indexLink, pageNumber.toString());

			const buttonLabel = linkElement.querySelector('.c-button__label-text');
			if (buttonLabel) {
				buttonLabel.innerHTML = pageNumber.toString();
			}

			const buttonElement = linkElement.querySelector('.c-button');
			if (buttonElement) {
				buttonElement.classList.remove('c-button__filled--primary');
				buttonElement.classList.add('c-button__filled--default');

				if (pageNumber === currentPage) {
					buttonElement.classList.add('c-button__filled--primary');
					buttonElement.classList.remove('c-button__filled--default');
				}
			}

			this.elements.linksContainer.appendChild(linkElement);
		}
	}

	public setFocusToFirstItem(): void {
		const firstVisibleItem = this.elements.listContainer.querySelector(`[${PAGINATION_ATTRIBUTES.item}]:first-child`) as HTMLElement | null;
		firstVisibleItem?.focus();
	}

	public scrollToTop(): void {
		const offset = document.querySelector('.c-header--sticky') ? 100 : 0;
		const elementPosition = this.elements.container.getBoundingClientRect().top;
		const offsetPosition = elementPosition + window.pageYOffset - offset;

		window.scrollTo({ top: offsetPosition });
	}

	private getPageRangeToRender(currentPage: number, numberOfPages: number): { start: number; end: number } {
		const fallbackWindow = 100;
		const windowSize = this.attributes.pagesToShow || fallbackWindow;
		const halfWindow = Math.floor(windowSize / 2);

		let start = Math.max(currentPage - halfWindow, 1);
		let end = Math.min(currentPage + halfWindow, numberOfPages);

		if (start === 1) {
			end = Math.min(numberOfPages, start + windowSize);
		} else if (end === numberOfPages) {
			start = Math.max(1, end - windowSize);
		}

		return { start, end };
	}
}

export default PaginationDomRenderer;
