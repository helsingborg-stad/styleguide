import PaginationDomRenderer from './paginationDomRenderer';
import PaginationNavigation from './paginationNavigation';
import PaginationSorter from './paginationSorter';
import PaginationUrlState from './paginationUrlState';
import PaginationAsyncItemSync from './paginationAsyncItemSync';
import { PAGINATION_ATTRIBUTES, type PaginationAsyncItemsChange, type PaginationAttributes, type PaginationElements, type PaginationInitialization, type PaginationSortMode } from './interface';

/**
 * Runtime controller for one pagination instance.
 */
class Pagination {
	private activeList: HTMLElement[];
	private currentPage: number;
	private currentSortMode: PaginationSortMode;

	constructor(
		private container: HTMLElement,
		index: number,
		private urlHandler: PaginationUrlState,
		private sorter: PaginationSorter,
		private renderer: PaginationDomRenderer,
		private navigation: PaginationNavigation,
		private asyncItemSync: PaginationAsyncItemSync | null,
		private paginationElements: PaginationElements,
		private paginationAttributes: PaginationAttributes,
		private paginationItems: HTMLElement[]
	) {
		this.activeList = this.sorter.getSortedList(this.paginationItems, 'default', this.paginationAttributes.randomize);
		this.currentPage = this.clampPage(this.urlHandler.getCurrentPage());
		this.currentSortMode = 'default';

		this.setPageNumberAttribute();
		this.bindControlListeners();
		this.bindSortListener();
		this.bindPopstateListener();
		this.refresh();
		this.bindAsyncItemSync();

		const instanceId = `pagination-${index}`;
		this.container.dataset.paginationInstance = instanceId;
	}

	public paginateSetCurrent(current: number = 1): void {
		this.setCurrentPage(current, true);
		this.refresh();
	}

	private bindControlListeners(): void {
		this.navigation.bindListeners({
			onNavigate: (action, pageNumber) => {
				if (action === 'next') {
					this.setCurrentPage(this.currentPage + 1, true);
					this.refresh();
					this.renderer.scrollToTop();
					return;
				}

				if (action === 'previous') {
					this.setCurrentPage(this.currentPage - 1, true);
					this.refresh();
					this.renderer.scrollToTop();
					return;
				}

				if (typeof pageNumber !== 'number') {
					return;
				}

				this.setCurrentPage(pageNumber, true);
				this.refresh();
				this.renderer.scrollToTop();
				this.renderer.setFocusToFirstItem();
			},
		});
	}

	private bindSortListener(): void {
		const sortElement = this.paginationElements.sortElement;
		if (!sortElement) {
			return;
		}

		const urlSortMode = this.urlHandler.getSortMode();
		const initialSortMode = this.sorter.resolveSortMode(urlSortMode ?? sortElement.value ?? 'default');
		sortElement.value = initialSortMode;
		this.applySort(initialSortMode, false);

		sortElement.addEventListener('change', (event) => {
			const selectedSortMode = this.sorter.resolveSortMode((event.target as HTMLSelectElement).value);
			this.applySort(selectedSortMode, true);
			this.refresh();
		});
	}

	private bindPopstateListener(): void {
		window.addEventListener('popstate', () => {
			const pageFromUrl = this.clampPage(this.urlHandler.getCurrentPage());
			if (pageFromUrl !== this.currentPage) {
				this.setCurrentPage(pageFromUrl, false);
				this.refresh();
			}
		});
	}

	private refresh(): void {
		this.asyncItemSync?.pause();
		this.container.setAttribute(PAGINATION_ATTRIBUTES.currentPage, this.currentPage.toString());
		this.renderer.renderPageItems(this.paginateList(this.activeList));
		this.renderer.renderLinks(this.paginatePages(), this.currentPage);
		this.navigation.updateButtonState(this.currentPage, this.paginatePages());
		this.asyncItemSync?.resume();
	}

	private applySort(mode: PaginationSortMode, resetPage: boolean): void {
		this.currentSortMode = mode;
		this.activeList = this.sorter.getSortedList(this.paginationItems, mode, this.paginationAttributes.randomize);

		this.setPageNumberAttribute();
		this.urlHandler.setSortMode(mode === 'default' ? 'default' : mode);

		if (resetPage) {
			this.setCurrentPage(1, true);
		}
	}

	private setPageNumberAttribute(): void {
		this.activeList.forEach((item, index) => {
			const pageNumber = Math.floor(index / this.paginationAttributes.perPage) + 1;
			item.setAttribute(PAGINATION_ATTRIBUTES.itemPage, pageNumber.toString());
		});
	}

	private paginatePages(): number {
		const numberOfPages = Math.ceil(this.activeList.length / this.paginationAttributes.perPage);
		if (this.paginationAttributes.maxPages && numberOfPages > this.paginationAttributes.maxPages) {
			return this.paginationAttributes.maxPages;
		}

		return numberOfPages;
	}

	private paginateList(list: Element[]): Element[] {
		const firstIndex = (this.currentPage - 1) * this.paginationAttributes.perPage;
		const lastIndex = this.currentPage * this.paginationAttributes.perPage;

		return Array.from(list).slice(firstIndex, lastIndex);
	}

	private setCurrentPage(pageNumber: number, updateUrl: boolean): void {
		const nextPage = this.clampPage(pageNumber);
		this.currentPage = nextPage;

		if (updateUrl) {
			this.urlHandler.setCurrentPage(nextPage, false);
		}
	}

	private clampPage(pageNumber: number): number {
		if (pageNumber <= 1) {
			return 1;
		}

		const maxPage = this.paginatePages() || 1;
		if (pageNumber > maxPage) {
			return maxPage;
		}

		return pageNumber;
	}

	private bindAsyncItemSync(): void {
		if (!this.asyncItemSync) {
			return;
		}

		this.asyncItemSync.start((itemsChange) => {
			this.handleAsyncItemsUpdated(itemsChange);
		});
	}

	private handleAsyncItemsUpdated(itemsChange: PaginationAsyncItemsChange): void {
		const nextItems = this.getNextPaginationItems(itemsChange);
		if (this.isSameItemsReferenceOrder(nextItems, this.paginationItems)) {
			return;
		}

		this.paginationItems = nextItems;
		this.activeList = this.sorter.getSortedList(this.paginationItems, this.currentSortMode, this.paginationAttributes.randomize);
		this.setCurrentPage(this.currentPage, false);
		this.setPageNumberAttribute();
		this.refresh();
	}

	private getNextPaginationItems(itemsChange: PaginationAsyncItemsChange): HTMLElement[] {
		const removedSet = new Set(itemsChange.removedItems);
		const nextItems = this.paginationItems.filter((item) => !removedSet.has(item));

		itemsChange.addedItems.forEach((item) => {
			if (!nextItems.includes(item)) {
				nextItems.push(item);
			}
		});

		return nextItems;
	}

	private isSameItemsReferenceOrder(a: HTMLElement[], b: HTMLElement[]): boolean {
		if (a.length !== b.length) {
			return false;
		}

		for (let index = 0; index < a.length; index++) {
			if (a[index] !== b[index]) {
				return false;
			}
		}

		return true;
	}

}

export default Pagination;
