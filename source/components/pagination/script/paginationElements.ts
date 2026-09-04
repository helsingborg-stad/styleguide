import type { PaginationElements } from './types';
import { PAGINATION_ATTRIBUTES } from './types';

/**
 * Resolves and validates markup references required by pagination runtime.
 */
export function resolvePaginationElements(container: HTMLElement): PaginationElements | null {
	const paginationContainer = container.querySelector(`[${PAGINATION_ATTRIBUTES.root}]`) as HTMLElement | null;
	const listContainer = container.querySelector(`[${PAGINATION_ATTRIBUTES.container}]`) as HTMLElement | null;
	const linksContainer = container.querySelector(`[${PAGINATION_ATTRIBUTES.linksContainer}]`) as HTMLElement | null;

	if (!paginationContainer || !listContainer || !linksContainer) {
		return null;
	}

	const linkTemplate = container.querySelector(`[${PAGINATION_ATTRIBUTES.indexLink}]`) as HTMLElement | null;
	linkTemplate?.classList.remove('c-pagination__item--is-active');

	return {
		container,
		paginationContainer,
		listContainer,
		linksContainer,
		prevButton: container.querySelector(`[${PAGINATION_ATTRIBUTES.previous}]`) as HTMLElement | null,
		nextButton: container.querySelector(`[${PAGINATION_ATTRIBUTES.next}]`) as HTMLElement | null,
		linkTemplate,
		sortElement: container.querySelector(`[${PAGINATION_ATTRIBUTES.sort}] select`) as HTMLSelectElement | null,
	};
}
