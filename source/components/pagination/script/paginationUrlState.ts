/**
 * Handles URL query state used by pagination.
 */
class PaginationUrlState {
	private readonly pageQueryParameter: string;
	private readonly sortQueryParameter: string;

	constructor(pageQueryParameter: string = 'pagenum', sortQueryParameter: string = 'sortby') {
		this.pageQueryParameter = pageQueryParameter;
		this.sortQueryParameter = sortQueryParameter;
	}

	public getCurrentPage(): number {
		const pageValue = new URLSearchParams(window.location.search).get(this.pageQueryParameter);
		const currentPage = pageValue ? parseInt(pageValue, 10) : 1;

		return Number.isNaN(currentPage) ? 1 : currentPage;
	}

	public setCurrentPage(pageNumber: number, useReplaceState: boolean = false): void {
		const urlSearchParams = new URLSearchParams(window.location.search);
		urlSearchParams.set(this.pageQueryParameter, pageNumber.toString());
		this.write(urlSearchParams, useReplaceState);
	}

	public getSortMode(): string | null {
		return new URLSearchParams(window.location.search).get(this.sortQueryParameter);
	}

	public setSortMode(sortMode: string | null): void {
		const urlSearchParams = new URLSearchParams(window.location.search);

		if (sortMode) {
			urlSearchParams.set(this.sortQueryParameter, sortMode);
		} else {
			urlSearchParams.delete(this.sortQueryParameter);
		}

		this.write(urlSearchParams, true);
	}

	private write(urlSearchParams: URLSearchParams, useReplaceState: boolean): void {
		const queryString = urlSearchParams.toString();
		const updatedUrl = `${window.location.pathname}${queryString ? `?${queryString}` : ''}`;

		if (useReplaceState) {
			history.replaceState({}, '', updatedUrl);
			return;
		}

		history.pushState({}, '', updatedUrl);
	}
}

export default PaginationUrlState;
