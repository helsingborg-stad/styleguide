import { PAGINATION_ATTRIBUTES, type PaginationSortMode } from './types';

/**
 * Encapsulates sorting behavior for pagination items.
 */
class PaginationSorter {
	public resolveSortMode(value: string): PaginationSortMode {
		if (value === 'alphabetical' || value === 'random') {
			return value;
		}

		return 'default';
	}

	public getSortedList(sourceList: Element[], mode: PaginationSortMode, randomizeByDefault: boolean): Element[] {
		const defaultList = randomizeByDefault ? this.randomizeList(sourceList) : [...sourceList];

		if (mode === 'random') {
			return this.randomizeList(sourceList);
		}

		if (mode === 'alphabetical') {
			return [...sourceList].sort((a, b) => {
				const firstTitle = a.getAttribute(PAGINATION_ATTRIBUTES.itemTitle) || '';
				const secondTitle = b.getAttribute(PAGINATION_ATTRIBUTES.itemTitle) || '';

				return firstTitle.localeCompare(secondTitle);
			});
		}

		return defaultList;
	}

	public randomizeList(list: Element[]): Element[] {
		return [...list].sort(() => Math.random() - 0.5);
	}
}

export default PaginationSorter;