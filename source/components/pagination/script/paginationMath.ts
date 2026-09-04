/**
 * Calculates number of pages for a list.
 */
export function getTotalPages(totalItems: number, perPage: number, maxPages: number): number {
	if (perPage <= 0) {
		return 0;
	}

	const numberOfPages = Math.ceil(totalItems / perPage);

	if (maxPages > 0 && numberOfPages > maxPages) {
		return maxPages;
	}

	return numberOfPages;
}

/**
 * Clamps a requested page inside valid bounds.
 */
export function clampPage(pageNumber: number, totalPages: number): number {
	if (totalPages <= 1) {
		return 1;
	}

	if (pageNumber <= 1) {
		return 1;
	}

	if (pageNumber > totalPages) {
		return totalPages;
	}

	return pageNumber;
}

/**
 * Returns the sub-list visible for a page.
 */
export function sliceForPage<T>(list: T[], pageNumber: number, perPage: number): T[] {
	if (perPage <= 0) {
		return [];
	}

	const firstIndex = (pageNumber - 1) * perPage;
	const lastIndex = pageNumber * perPage;

	return list.slice(firstIndex, lastIndex);
}

/**
 * Normalizes page-window input to a non-negative even number.
 */
export function normalizePagesToShow(rawPagesToShow: number): number {
	if (rawPagesToShow <= 0) {
		return 0;
	}

	return rawPagesToShow % 2 === 0 ? rawPagesToShow : rawPagesToShow + 1;
}

/**
 * Resolves page range that should be rendered as pagination links.
 */
export function getPageRenderRange(currentPage: number, totalPages: number, pagesToShow: number): { start: number; end: number } {
	const fallbackWindow = 100;
	const windowSize = pagesToShow || fallbackWindow;
	const halfWindow = Math.floor(windowSize / 2);

	let start = Math.max(currentPage - halfWindow, 1);
	let end = Math.min(currentPage + halfWindow, totalPages);

	if (start === 1) {
		end = Math.min(totalPages, start + windowSize);
	} else if (end === totalPages) {
		start = Math.max(1, end - windowSize);
	}

	return { start, end };
}
