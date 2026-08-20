import { PAGINATION_ATTRIBUTES, type PaginationSortMode } from './interface';

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

	public getSortedList(sourceList: HTMLElement[], mode: PaginationSortMode, randomizeByDefault: boolean): HTMLElement[] {
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

	public randomizeList(list: HTMLElement[]): HTMLElement[] {
		return [...list].sort(() => Math.random() - 0.5);
	}
}

export default PaginationSorter;