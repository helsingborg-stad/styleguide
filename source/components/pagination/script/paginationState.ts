import type { PaginationAttributes, PaginationSortMode, PaginationStateSnapshot } from './types';
import { clampPage, getTotalPages, sliceForPage } from './paginationMath';

/**
 * State manager for one pagination runtime.
 */
class PaginationState {
	private readonly attributes: PaginationAttributes;
	private readonly sourceList: Element[];
	private activeList: Element[];
	private currentPage: number;
	private sortMode: PaginationSortMode;

	constructor(sourceList: Element[], attributes: PaginationAttributes, initialPage: number, initialSortMode: PaginationSortMode = 'default') {
		this.attributes = attributes;
		this.sourceList = [...sourceList];
		this.activeList = [...sourceList];
		this.sortMode = initialSortMode;
		this.currentPage = this.clampPage(initialPage);
	}

	public getSourceList(): Element[] {
		return [...this.sourceList];
	}

	public getActiveList(): Element[] {
		return [...this.activeList];
	}

	public setActiveList(list: Element[]): void {
		this.activeList = [...list];
		this.currentPage = this.clampPage(this.currentPage);
	}

	public getCurrentPage(): number {
		return this.currentPage;
	}

	public setCurrentPage(pageNumber: number): number {
		this.currentPage = this.clampPage(pageNumber);
		return this.currentPage;
	}

	public getSortMode(): PaginationSortMode {
		return this.sortMode;
	}

	public setSortMode(sortMode: PaginationSortMode): void {
		this.sortMode = sortMode;
	}

	public getTotalPages(): number {
		return getTotalPages(this.activeList.length, this.attributes.perPage, this.attributes.maxPages);
	}

	public getVisibleItems(): Element[] {
		return sliceForPage(this.activeList, this.currentPage, this.attributes.perPage);
	}

	public applyItemPageAttribute(itemPageAttribute: string): void {
		this.activeList.forEach((item, index) => {
			const pageNumber = Math.floor(index / this.attributes.perPage) + 1;
			item.setAttribute(itemPageAttribute, pageNumber.toString());
		});
	}

	public snapshot(): PaginationStateSnapshot {
		return {
			sourceList: this.getSourceList(),
			activeList: this.getActiveList(),
			currentPage: this.currentPage,
			sortMode: this.sortMode,
		};
	}

	private clampPage(pageNumber: number): number {
		const totalPages = this.getTotalPages() || 1;
		return clampPage(pageNumber, totalPages);
	}
}

export default PaginationState;
