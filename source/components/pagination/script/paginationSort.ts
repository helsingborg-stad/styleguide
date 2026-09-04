import type { PaginationSortMode, PaginationSortedLists } from './types';

/**
 * Parses user-provided sort mode into supported values.
 */
export function resolveSortMode(value: string | null | undefined): PaginationSortMode {
	if (value === 'alphabetical' || value === 'random') {
		return value;
	}

	return 'default';
}

/**
 * Returns a shuffled copy of a list.
 */
export function shuffleList<T>(list: T[]): T[] {
	return [...list].sort(() => Math.random() - 0.5);
}

/**
	 * Creates stable list variants that mirror the original pagination behavior.
	 */
export function createSortedLists(
	sourceList: Element[],
	itemTitleAttribute: string,
	defaultShouldRandomize: boolean,
): PaginationSortedLists {
	const defaultList = defaultShouldRandomize ? shuffleList(sourceList) : [...sourceList];

	return {
		default: defaultList,
		alphabetical: [...sourceList].sort((firstItem, secondItem) => {
			const firstTitle = firstItem.getAttribute(itemTitleAttribute) || '';
			const secondTitle = secondItem.getAttribute(itemTitleAttribute) || '';

			return firstTitle.localeCompare(secondTitle);
		}),
		random: shuffleList(sourceList),
	};
}

/**
	 * Resolves the correct precomputed list for a sort mode.
 */
export function getSortedListByMode(mode: PaginationSortMode, lists: PaginationSortedLists): Element[] {
	if (mode === 'random') {
		return [...lists.random];
	}

	if (mode === 'alphabetical') {
		return [...lists.alphabetical];
	}

	return [...lists.default];
}
