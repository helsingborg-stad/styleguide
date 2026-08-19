/**
 * Pagination attribute values resolved from markup.
 */
export interface PaginationAttributes {
	perPage: number;
	maxPages: number;
	randomize: boolean;
	keepDOM: boolean;
	pagesToShow: number;
}

/**
 * Markup references needed by the pagination runtime.
 */
export interface PaginationElements {
	container: HTMLElement;
	paginationContainer: HTMLElement;
	listContainer: HTMLElement;
	linksContainer: HTMLElement;
	prevButton: HTMLElement | null;
	nextButton: HTMLElement | null;
	linkTemplate: HTMLElement | null;
	sortElement: HTMLSelectElement | null;
}

/**
 * Available sort modes for paginated items.
 */
export type PaginationSortMode = 'default' | 'alphabetical' | 'random';

/**
 * Shared data-attribute constants used by pagination.
 */
export const PAGINATION_ATTRIBUTES = {
	target: 'data-js-pagination-target',
	root: 'data-js-pagination',
	container: 'data-js-pagination-container',
	item: 'data-js-pagination-item',
	itemTitle: 'data-js-pagination-item-title',
	itemPage: 'data-js-pagination-page',
	indexLink: 'data-js-pagination-index',
	previous: 'data-js-pagination-prev',
	next: 'data-js-pagination-next',
	sort: 'data-js-pagination-sort',
	linksContainer: 'js-table-pagination--links',
	currentPage: 'js-table-pagination--current',
} as const;
