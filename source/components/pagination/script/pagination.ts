import PaginationDomRenderer from './paginationDomRenderer';
import PaginationUrlState from './paginationUrlState';
import { PAGINATION_ATTRIBUTES, type PaginationAttributes, type PaginationElements, type PaginationSortMode } from './types';

/**
 * Runtime controller for one pagination instance.
 */
class Pagination {
	public static instances: Map<string, Pagination> = new Map();

	private readonly elements: PaginationElements | null;
	private readonly urlState: PaginationUrlState;
	private readonly renderer: PaginationDomRenderer | null;
	private readonly attributes: PaginationAttributes | null;

	private readonly sourceList: Element[];
	private activeList: Element[];
	private currentPage: number;

	constructor(private readonly container: HTMLElement, index: number) {
		this.elements = this.resolveElements();
		this.urlState = new PaginationUrlState();

		if (!this.elements) {
			this.renderer = null;
			this.attributes = null;
			this.sourceList = [];
			this.activeList = [];
			this.currentPage = 1;
			return;
		}

		this.attributes = this.getAttributes(this.elements.paginationContainer);
		this.sourceList = [...this.container.querySelectorAll(`[${PAGINATION_ATTRIBUTES.item}]`)];
		this.activeList = this.attributes.randomize ? this.randomizeList(this.sourceList) : [...this.sourceList];
		this.currentPage = this.clampPage(this.urlState.getCurrentPage());
		this.renderer = new PaginationDomRenderer(this.elements, this.attributes);

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

	private resolveElements(): PaginationElements | null {
		const paginationContainer = this.container.querySelector(`[${PAGINATION_ATTRIBUTES.root}]`) as HTMLElement | null;
		const listContainer = this.container.querySelector(`[${PAGINATION_ATTRIBUTES.container}]`) as HTMLElement | null;
		const linksContainer = this.container.querySelector(`[${PAGINATION_ATTRIBUTES.linksContainer}]`) as HTMLElement | null;

		if (!paginationContainer || !listContainer || !linksContainer) {
			return null;
		}

		const linkTemplate = this.container.querySelector(`[${PAGINATION_ATTRIBUTES.indexLink}]`) as HTMLElement | null;
		linkTemplate?.classList.remove('c-pagination__item--is-active');

		const sortElement = this.container.querySelector(`[${PAGINATION_ATTRIBUTES.sort}] select`) as HTMLSelectElement | null;

		return {
			container: this.container,
			paginationContainer,
			listContainer,
			linksContainer,
			prevButton: this.container.querySelector(`[${PAGINATION_ATTRIBUTES.previous}]`) as HTMLElement | null,
			nextButton: this.container.querySelector(`[${PAGINATION_ATTRIBUTES.next}]`) as HTMLElement | null,
			linkTemplate,
			sortElement,
		};
	}

	private getAttributes(paginationContainer: HTMLElement): PaginationAttributes {
		const perPage = paginationContainer.getAttribute('data-js-pagination-per-page');
		const maxPages = paginationContainer.getAttribute('data-js-pagination-max-pages');
		const randomize = paginationContainer.hasAttribute('data-js-pagination-randomize-order');
		const keepDOM = paginationContainer.hasAttribute('data-js-pagination-keep-dom');
		const pagesToShow = paginationContainer.hasAttribute('data-js-pagination-pages-to-show')
			? parseInt(paginationContainer.getAttribute('data-js-pagination-pages-to-show') ?? '0', 10)
			: 0;

		return {
			perPage: perPage ? parseInt(perPage, 10) : 10,
			maxPages: maxPages ? parseInt(maxPages, 10) : 0,
			randomize,
			keepDOM,
			pagesToShow: pagesToShow > 0 ? (pagesToShow % 2 === 0 ? pagesToShow : pagesToShow + 1) : 0,
		};
	}

	private bindControlListeners(): void {
		if (!this.elements) {
			return;
		}

		this.elements.nextButton?.addEventListener('click', (event) => {
			event.preventDefault();
			this.setCurrentPage(this.currentPage + 1, true);
			this.refresh();
			this.renderer?.scrollToTop();
		});

		this.elements.prevButton?.addEventListener('click', (event) => {
			event.preventDefault();
			this.setCurrentPage(this.currentPage - 1, true);
			this.refresh();
			this.renderer?.scrollToTop();
		});

		this.elements.linksContainer.addEventListener('click', (event) => {
			event.preventDefault();
			const target = (event.target as HTMLElement).closest(`[${PAGINATION_ATTRIBUTES.indexLink}]`) as HTMLElement | null;
			if (!target) {
				return;
			}

			const nextPage = target.getAttribute(PAGINATION_ATTRIBUTES.indexLink);
			if (!nextPage) {
				return;
			}

			const parsedPage = parseInt(nextPage, 10);
			if (Number.isNaN(parsedPage)) {
				return;
			}

			this.setCurrentPage(parsedPage, true);
			this.refresh();
			this.renderer?.scrollToTop();
			this.renderer?.setFocusToFirstItem();
		});
	}

	private bindSortListener(): void {
		const sortElement = this.elements?.sortElement;
		if (!sortElement) {
			return;
		}

		const urlSortMode = this.urlState.getSortMode();
		const initialSortMode = this.resolveSortMode(urlSortMode ?? sortElement.value ?? 'default');
		sortElement.value = initialSortMode;
		this.applySort(initialSortMode, false);

		sortElement.addEventListener('change', (event) => {
			const selectedSortMode = this.resolveSortMode((event.target as HTMLSelectElement).value);
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
		this.renderer.updateNavigationButtonState(this.currentPage, this.paginatePages());
	}

	private applySort(mode: PaginationSortMode, resetPage: boolean): void {
		const defaultList = this.attributes?.randomize ? this.randomizeList(this.sourceList) : [...this.sourceList];

		if (mode === 'random') {
			this.activeList = this.randomizeList(this.sourceList);
		} else if (mode === 'alphabetical') {
			this.activeList = [...this.sourceList].sort((a, b) => {
				const firstTitle = a.getAttribute(PAGINATION_ATTRIBUTES.itemTitle) || '';
				const secondTitle = b.getAttribute(PAGINATION_ATTRIBUTES.itemTitle) || '';

				return firstTitle.localeCompare(secondTitle);
			});
		} else {
			this.activeList = defaultList;
		}

		this.setPageNumberAttribute();
		this.urlState.setSortMode(mode === 'default' ? 'default' : mode);

		if (resetPage) {
			this.setCurrentPage(1, true);
		}
	}

	private resolveSortMode(value: string): PaginationSortMode {
		if (value === 'alphabetical' || value === 'random') {
			return value;
		}

		return 'default';
	}

	private setPageNumberAttribute(): void {
		if (!this.attributes) {
			return;
		}

		this.activeList.forEach((item, index) => {
			const pageNumber = Math.floor(index / this.attributes.perPage) + 1;
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

	private randomizeList(list: Element[]): Element[] {
		return [...list].sort(() => Math.random() - 0.5);
	}
}

export default Pagination;
