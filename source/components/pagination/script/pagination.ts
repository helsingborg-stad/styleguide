import PaginationDomRenderer from './paginationDomRenderer';
import PaginationUrlState from './paginationUrlState';
import PaginationEventBinder from './paginationEventBinder';
import PaginationState from './paginationState';
import { createSortedLists, getSortedListByMode, resolveSortMode } from './paginationSort';
import { resolvePaginationElements } from './paginationElements';
import { resolvePaginationAttributes } from './paginationAttributes';
import { PAGINATION_ATTRIBUTES, type PaginationAttributes, type PaginationElements, type PaginationSortedLists, type PaginationSortMode } from './types';

/**
 * Runtime controller for one pagination instance.
 */
class Pagination {
	public static instances: Map<string, Pagination> = new Map();

	private readonly elements: PaginationElements | null;
	private readonly urlState: PaginationUrlState;
	private readonly renderer: PaginationDomRenderer | null;
	private readonly attributes: PaginationAttributes | null;
	private readonly eventBinder: PaginationEventBinder | null;
	private readonly state: PaginationState | null;
	private readonly sortedLists: PaginationSortedLists | null;

	constructor(private readonly container: HTMLElement, index: number) {
		this.elements = resolvePaginationElements(this.container);
		this.urlState = new PaginationUrlState();

		if (!this.elements) {
			this.renderer = null;
			this.attributes = null;
			this.eventBinder = null;
			this.state = null;
			this.sortedLists = null;
			return;
		}

		this.attributes = resolvePaginationAttributes(this.elements.paginationContainer);

		const sourceList = [...this.container.querySelectorAll(`[${PAGINATION_ATTRIBUTES.item}]`)];
		this.sortedLists = createSortedLists(
			sourceList,
			PAGINATION_ATTRIBUTES.itemTitle,
			this.attributes.randomize,
		);
		this.state = new PaginationState(sourceList, this.attributes, this.urlState.getCurrentPage());

		const initialSortMode = this.resolveInitialSortMode();
		this.applySort(initialSortMode, false, false);
		this.state.setCurrentPage(this.urlState.getCurrentPage());

		this.renderer = new PaginationDomRenderer(this.elements, this.attributes);
		this.eventBinder = new PaginationEventBinder(this.elements);

		if (this.elements.sortElement) {
			this.elements.sortElement.value = initialSortMode;
		}

		this.bindEvents();
		this.refresh();

		const instanceId = `pagination-${index}`;
		this.container.dataset.paginationInstance = instanceId;
		Pagination.instances.set(instanceId, this);
	}

	public static getInstance(instanceId: string): Pagination | undefined {
		return Pagination.instances.get(instanceId);
	}

	public paginateSetCurrent(current: number = 1): void {
		if (!this.state) {
			return;
		}

		this.setCurrentPage(current, true);
		this.refresh();
	}

	private bindEvents(): void {
		if (!this.eventBinder) {
			return;
		}

		this.eventBinder.bind({
			onNext: () => {
				this.setCurrentPage((this.state?.getCurrentPage() ?? 1) + 1, true);
				this.refresh();
				this.renderer?.scrollToTop();
			},
			onPrevious: () => {
				this.setCurrentPage((this.state?.getCurrentPage() ?? 1) - 1, true);
				this.refresh();
				this.renderer?.scrollToTop();
			},
			onPageSelected: (pageNumber) => {
				this.setCurrentPage(pageNumber, true);
				this.refresh();
				this.renderer?.scrollToTop();
				this.renderer?.setFocusToFirstItem();
			},
			onSortChanged: (sortMode) => {
				this.applySort(sortMode, true);
				this.refresh();
			},
			onPopstate: () => {
				this.restoreStateFromUrl();
			},
		});
	}

	private refresh(): void {
		if (!this.renderer || !this.state) {
			return;
		}

		const currentPage = this.state.getCurrentPage();
		const totalPages = this.state.getTotalPages();

		this.container.setAttribute(PAGINATION_ATTRIBUTES.currentPage, currentPage.toString());
		this.renderer.renderPageItems(this.state.getVisibleItems());
		this.renderer.renderLinks(totalPages, currentPage);
		this.renderer.updateNavigationButtonState(currentPage, totalPages);
	}

	private applySort(mode: PaginationSortMode, resetPage: boolean, updateUrl: boolean = true): void {
		if (!this.state || !this.sortedLists) {
			return;
		}

		const sortedList = getSortedListByMode(mode, this.sortedLists);

		this.state.setSortMode(mode);
		this.state.setActiveList(sortedList);
		this.state.applyItemPageAttribute(PAGINATION_ATTRIBUTES.itemPage);

		if (updateUrl) {
			this.urlState.setSortMode(mode);
		}

		if (resetPage) {
			this.setCurrentPage(1, true);
		}
	}

	private setCurrentPage(pageNumber: number, updateUrl: boolean): void {
		if (!this.state) {
			return;
		}

		const nextPage = this.state.setCurrentPage(pageNumber);

		if (updateUrl) {
			this.urlState.setCurrentPage(nextPage, false);
		}
	}

	private restoreStateFromUrl(): void {
		if (!this.state || !this.elements) {
			return;
		}

		let shouldRefresh = false;

		if (this.elements.sortElement) {
			const urlSortMode = resolveSortMode(this.urlState.getSortMode() ?? this.elements.sortElement.value ?? 'default');
			if (urlSortMode !== this.state.getSortMode()) {
				this.applySort(urlSortMode, false, false);
				shouldRefresh = true;
				this.elements.sortElement.value = urlSortMode;
			}
		}

		const pageFromUrl = this.urlState.getCurrentPage();
		if (pageFromUrl !== this.state.getCurrentPage()) {
			this.setCurrentPage(pageFromUrl, false);
			shouldRefresh = true;
		}

		if (shouldRefresh) {
			this.refresh();
		}
	}

	private resolveInitialSortMode(): PaginationSortMode {
		if (!this.elements?.sortElement) {
			return 'default';
		}

		return resolveSortMode(this.urlState.getSortMode() ?? this.elements.sortElement.value ?? 'default');
	}
}

export default Pagination;
