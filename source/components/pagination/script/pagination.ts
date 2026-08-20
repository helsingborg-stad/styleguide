import PaginationDomRenderer from './paginationDomRenderer';
import PaginationNavigation from './paginationNavigation';
import PaginationSorter from './paginationSorter';
import PaginationUrlState from './paginationUrlState';
import PaginationInitializer from './paginationInitializer';
import { PAGINATION_ATTRIBUTES, type PaginationAttributes, type PaginationElements, type PaginationInitialization, type PaginationSortMode } from './types';

/**
 * Runtime controller for one pagination instance.
 */
class Pagination {
	public static instances: Map<string, Pagination> = new Map();

	private readonly elements: PaginationElements | null;
	private readonly urlState: PaginationUrlState;
	private readonly renderer: PaginationDomRenderer | null;
	private readonly navigation: PaginationNavigation | null;
	private readonly sorter: PaginationSorter;
	private readonly attributes: PaginationAttributes | null;

	private readonly sourceList: Element[];
	private activeList: Element[];
	private currentPage: number;

	constructor(private readonly container: HTMLElement, index: number, initialization: PaginationInitialization | null = null) {
		this.urlState = new PaginationUrlState();
		this.sorter = new PaginationSorter();

		const resolvedInitialization = initialization ?? new PaginationInitializer().resolve(this.container);

		if (!resolvedInitialization) {
			this.elements = null;
			this.renderer = null;
			this.navigation = null;
			this.attributes = null;
			this.sourceList = [];
			this.activeList = [];
			this.currentPage = 1;
			return;
		}

		this.elements = resolvedInitialization.elements;

		if (!this.elements) {
			this.renderer = null;
			this.navigation = null;
			this.attributes = null;
			this.sourceList = [];
			this.activeList = [];
			this.currentPage = 1;
			return;
		}

		this.attributes = resolvedInitialization.attributes;
		this.sourceList = resolvedInitialization.sourceList;
		this.activeList = this.sorter.getSortedList(this.sourceList, 'default', this.attributes.randomize);
		this.currentPage = this.clampPage(this.urlState.getCurrentPage());
		this.renderer = new PaginationDomRenderer(this.elements, this.attributes);
		this.navigation = new PaginationNavigation(this.elements);

		this.setPageNumberAttribute();
		this.bindControlListeners();
		this.bindSortListener();
		this.bindPopstateListener();
		this.refresh();

		const instanceId = `pagination-${index}`;
		this.container.dataset.paginationInstance = instanceId;
		Pagination.instances.set(instanceId, this);
	}

	public static getInstance(instanceId: string): Pagination | undefined {
		return Pagination.instances.get(instanceId);
	}

	public paginateSetCurrent(current: number = 1): void {
		if (!this.attributes) {
			return;
		}

		this.setCurrentPage(current, true);
		this.refresh();
	}

	private bindControlListeners(): void {
		if (!this.navigation) {
			return;
		}

		this.navigation.bindListeners({
			onNavigate: (action, pageNumber) => {
				if (action === 'next') {
					this.setCurrentPage(this.currentPage + 1, true);
					this.refresh();
					this.renderer?.scrollToTop();
					return;
				}

				if (action === 'previous') {
					this.setCurrentPage(this.currentPage - 1, true);
					this.refresh();
					this.renderer?.scrollToTop();
					return;
				}

				if (typeof pageNumber !== 'number') {
					return;
				}

				this.setCurrentPage(pageNumber, true);
				this.refresh();
				this.renderer?.scrollToTop();
				this.renderer?.setFocusToFirstItem();
			},
		});
	}

	private bindSortListener(): void {
		const sortElement = this.elements?.sortElement;
		if (!sortElement) {
			return;
		}

		const urlSortMode = this.urlState.getSortMode();
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
			const pageFromUrl = this.clampPage(this.urlState.getCurrentPage());
			if (pageFromUrl !== this.currentPage) {
				this.setCurrentPage(pageFromUrl, false);
				this.refresh();
			}
		});
	}

	private refresh(): void {
		if (!this.attributes || !this.renderer) {
			return;
		}

		this.container.setAttribute(PAGINATION_ATTRIBUTES.currentPage, this.currentPage.toString());
		this.renderer.renderPageItems(this.paginateList(this.activeList));
		this.renderer.renderLinks(this.paginatePages(), this.currentPage);
		this.navigation?.updateButtonState(this.currentPage, this.paginatePages());
	}

	private applySort(mode: PaginationSortMode, resetPage: boolean): void {
		this.activeList = this.sorter.getSortedList(this.sourceList, mode, this.attributes?.randomize ?? false);

		this.setPageNumberAttribute();
		this.urlState.setSortMode(mode === 'default' ? 'default' : mode);

		if (resetPage) {
			this.setCurrentPage(1, true);
		}
	}

	private setPageNumberAttribute(): void {
		const attributes = this.attributes;
		if (!attributes) {
			return;
		}

		this.activeList.forEach((item, index) => {
			const pageNumber = Math.floor(index / attributes.perPage) + 1;
			item.setAttribute(PAGINATION_ATTRIBUTES.itemPage, pageNumber.toString());
		});
	}

	private paginatePages(): number {
		if (!this.attributes) {
			return 0;
		}

		const numberOfPages = Math.ceil(this.activeList.length / this.attributes.perPage);
		if (this.attributes.maxPages && numberOfPages > this.attributes.maxPages) {
			return this.attributes.maxPages;
		}

		return numberOfPages;
	}

	private paginateList(list: Element[]): Element[] {
		if (!this.attributes) {
			return [];
		}

		const firstIndex = (this.currentPage - 1) * this.attributes.perPage;
		const lastIndex = this.currentPage * this.attributes.perPage;

		return Array.from(list).slice(firstIndex, lastIndex);
	}

	private setCurrentPage(pageNumber: number, updateUrl: boolean): void {
		const nextPage = this.clampPage(pageNumber);
		this.currentPage = nextPage;

		if (updateUrl) {
			this.urlState.setCurrentPage(nextPage, false);
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
