import { Table } from '..';

class ResizeObserverMock {
	observe() {}
	unobserve() {}
	disconnect() {}
}

function createTableMarkup(): HTMLElement {
	document.body.innerHTML = `
		<div class="c-table" js-table-filter js-table-sort js-table-sort--order="asc" js-table-sort--dictator="name">
			<input js-table-filter-input value="" />
			<button js-table-sort--btn="name"></button>
			<div class="c-table__inner">
				<div class="c-table__line">
					<table class="c-table__table">
						<tbody>
							<tr js-table-filter-item js-table-sort--sortable>
								<td js-table-filter-data js-table-sort-data="name">Beta</td>
							</tr>
							<tr js-table-filter-item js-table-sort--sortable>
								<td js-table-filter-data js-table-sort-data="name">Alpha</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
			<div class="c-table__scroll-indicator-wrapper">
				<div class="c-table__scroll-indicator"></div>
			</div>
		</div>
	`;

	return document.querySelector('.c-table') as HTMLElement;
}

function getRenderedValues(): string[] {
	return Array.from(document.querySelectorAll('tbody tr')).map((row) => row.textContent?.trim() ?? '');
}

describe('Table', () => {
	beforeEach(() => {
		(globalThis as typeof globalThis & { ResizeObserver: typeof ResizeObserver }).ResizeObserver = ResizeObserverMock as unknown as typeof ResizeObserver;
	});

	afterEach(() => {
		document.body.innerHTML = '';
	});

	it('sorts table rows during initialization', () => {
		const tableElement = createTableMarkup();

		new Table(tableElement);

		expect(getRenderedValues()).toEqual(['Alpha', 'Beta']);
	});

	it('filters rendered rows when the filter input changes', () => {
		const tableElement = createTableMarkup();

		new Table(tableElement);

		const input = document.querySelector('[js-table-filter-input]') as HTMLInputElement;
		input.value = 'beta';
		input.dispatchEvent(new Event('input'));

		expect(getRenderedValues()).toEqual(['Beta']);
	});

	it('toggles sort order when a sort button is clicked', () => {
		const tableElement = createTableMarkup();

		new Table(tableElement);

		const sortButton = document.querySelector('[js-table-sort--btn="name"]') as HTMLButtonElement;
		sortButton.click();

		expect(getRenderedValues()).toEqual(['Beta', 'Alpha']);
	});

	it('can be created without scroll indicator markup', () => {
		document.body.innerHTML = `
			<div class="c-table" js-table-filter>
				<input js-table-filter-input value="" />
				<table class="c-table__table">
					<tbody>
						<tr js-table-filter-item>
							<td js-table-filter-data>Alpha</td>
						</tr>
					</tbody>
				</table>
			</div>
		`;

		const tableElement = document.querySelector('.c-table') as HTMLElement;

		expect(() => new Table(tableElement)).not.toThrow();
	});
});
