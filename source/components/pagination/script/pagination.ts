import PaginationDomRenderer from './paginationDomRenderer';
import PaginationNavigation from './paginationNavigation';
import PaginationSorter from './paginationSorter';
import PaginationUrlState from './paginationUrlState';
import { PAGINATION_ATTRIBUTES, type PaginationAttributes, type PaginationElements, type PaginationInitialization, type PaginationSortMode } from './interface';

/**
 * Runtime controller for one pagination instance.
 */
class Pagination {
	private renderer: PaginationDomRenderer;
	private navigation: PaginationNavigation;
	private activeList: HTMLElement[];
	private currentPage: number;

	constructor(
		private container: HTMLElement,
		index: number,
		private urlHandler: PaginationUrlState,
		private sorter: PaginationSorter,
		private paginationElements: PaginationElements,
		private paginationAttributes: PaginationAttributes,
		private paginationItems: HTMLElement[]
	) {
		this.activeList = this.sorter.getSortedList(this.paginationItems, 'default', this.paginationAttributes.randomize);
		this.currentPage = this.clampPage(this.urlHandler.getCurrentPage());
		this.renderer = new PaginationDomRenderer(this.paginationElements, this.paginationAttributes);
		this.navigation = new PaginationNavigation(this.paginationElements);

		this.setPageNumberAttribute();
		this.bindControlListeners();
		this.bindSortListener();
		this.bindPopstateListener();
		this.refresh();

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
		this.container.setAttribute(PAGINATION_ATTRIBUTES.currentPage, this.currentPage.toString());
		this.renderer.renderPageItems(this.paginateList(this.activeList));
		this.renderer.renderLinks(this.paginatePages(), this.currentPage);
		this.navigation.updateButtonState(this.currentPage, this.paginatePages());
	}

	private applySort(mode: PaginationSortMode, resetPage: boolean): void {
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

}

export default Pagination;
