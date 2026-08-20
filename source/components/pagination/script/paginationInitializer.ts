import { PAGINATION_ATTRIBUTES, type PaginationAttributes, type PaginationElements, type PaginationInitialization } from './types';

/**
 * Resolves markup and attribute configuration for pagination instances.
 */
class PaginationInitializer {
	public resolve(container: HTMLElement): PaginationInitialization | null {
		const elements = this.resolveElements(container);
		if (!elements) {
			return null;
		}

		return {
			elements,
			attributes: this.getAttributes(elements.paginationContainer),
			sourceList: [...container.querySelectorAll(`[${PAGINATION_ATTRIBUTES.item}]`)],
		};
	}

	private resolveElements(container: HTMLElement): PaginationElements | null {
		const paginationContainer = container.querySelector(`[${PAGINATION_ATTRIBUTES.root}]`) as HTMLElement | null;
		const listContainer = container.querySelector(`[${PAGINATION_ATTRIBUTES.container}]`) as HTMLElement | null;
		const linksContainer = container.querySelector(`[${PAGINATION_ATTRIBUTES.linksContainer}]`) as HTMLElement | null;

		if (!paginationContainer || !listContainer || !linksContainer) {
			return null;
		}

		const linkTemplate = container.querySelector(`[${PAGINATION_ATTRIBUTES.indexLink}]`) as HTMLElement | null;
		linkTemplate?.classList.remove('c-pagination__item--is-active');

		const sortElement = container.querySelector(`[${PAGINATION_ATTRIBUTES.sort}] select`) as HTMLSelectElement | null;

		return {
			container,
			paginationContainer,
			listContainer,
			linksContainer,
			prevButton: container.querySelector(`[${PAGINATION_ATTRIBUTES.previous}]`) as HTMLElement | null,
			nextButton: container.querySelector(`[${PAGINATION_ATTRIBUTES.next}]`) as HTMLElement | null,
			linkTemplate,
			sortElement,
		};
	}

	private getAttributes(paginationContainer: HTMLElement): PaginationAttributes {
		const perPage = paginationContainer.getAttribute('data-js-pagination-per-page');
		const maxPages = paginationContainer.getAttribute('data-js-pagination-max-pages');
		const randomize = paginationContainer.hasAttribute('data-js-pagination-randomize-order');
		const keepDOM = paginationContainer.hasAttribute('data-js-pagination-keep-dom');
		const pagesToShow = paginationContainer.hasAttribute('data-js-pagination-pages-to-show')
			? parseInt(paginationContainer.getAttribute('data-js-pagination-pages-to-show') ?? '0', 10)
			: 0;

		return {
			perPage: perPage ? parseInt(perPage, 10) : 10,
			maxPages: maxPages ? parseInt(maxPages, 10) : 0,
			randomize,
			keepDOM,
			pagesToShow: pagesToShow > 0 ? (pagesToShow % 2 === 0 ? pagesToShow : pagesToShow + 1) : 0,
		};
	}
}

export default PaginationInitializer;