import { normalizePagesToShow } from './paginationMath';
import type { PaginationAttributes } from './types';

/**
 * Reads runtime options from pagination element attributes.
 */
export function resolvePaginationAttributes(paginationContainer: HTMLElement): PaginationAttributes {
	const perPage = paginationContainer.getAttribute('data-js-pagination-per-page');
	const maxPages = paginationContainer.getAttribute('data-js-pagination-max-pages');
	const pagesToShow = paginationContainer.hasAttribute('data-js-pagination-pages-to-show')
		? parseInt(paginationContainer.getAttribute('data-js-pagination-pages-to-show') ?? '0', 10)
		: 0;

	return {
		perPage: perPage ? parseInt(perPage, 10) : 10,
		maxPages: maxPages ? parseInt(maxPages, 10) : 0,
		randomize: paginationContainer.hasAttribute('data-js-pagination-randomize-order'),
		keepDOM: paginationContainer.hasAttribute('data-js-pagination-keep-dom'),
		pagesToShow: normalizePagesToShow(Number.isNaN(pagesToShow) ? 0 : pagesToShow),
	};
}
