type TableRow = HTMLElement;

/**
 * Handles filtering, sorting and horizontal scroll interactions for a table component.
 */
export class Table {
	private readonly table: HTMLElement;
	private readonly list: NodeListOf<TableRow>;
	private readonly isFilterable: boolean;
	private readonly isSortable: boolean;
	private readonly isMultidimensional: boolean;
	private readonly hasSumRow: boolean;
	private readonly tableInner: HTMLElement | null;
	private readonly tableTable: HTMLElement | null;
	private readonly indicatorContainer: HTMLElement | null;
	private readonly indicatorInput: HTMLElement | null;
	private readonly updateOnScrollFunc: EventListener;
	private readonly handleMouseMoveFunc: EventListener;
	private readonly handleMouseUpFunc: EventListener;
	private resizeObserver: ResizeObserver | null = null;
	private initialCursorPosition = 0;

	constructor(table: HTMLElement) {
		this.table = table;
		this.list = table.querySelectorAll<HTMLElement>('[js-table-filter-item]');
		this.isFilterable = table.hasAttribute('js-table-filter');
		this.isSortable = table.hasAttribute('js-table-sort');
		this.isMultidimensional = table.classList.contains('c-table--multidimensional');
		this.hasSumRow = this.table.hasAttribute('table-sum');
		this.tableInner = table.querySelector<HTMLElement>('.c-table__inner');
		this.tableTable = table.querySelector<HTMLElement>('.c-table__table');
		this.indicatorContainer = this.table.querySelector<HTMLElement>('.c-table__scroll-indicator-wrapper');
		this.indicatorInput = this.table.querySelector<HTMLElement>('.c-table__scroll-indicator');
		this.updateOnScrollFunc = () => this.updateOnScroll();
		this.handleMouseMoveFunc = (event) => this.handleMouseMove(event as MouseEvent);
		this.handleMouseUpFunc = (event) => this.handleMouseUp(event as MouseEvent);

		if (this.indicatorInput) {
			this.indicatorInput.style.marginLeft = '0px';
		}

		if (this.isFilterable) this.filterInput();

		if (this.isSortable) this.sortAddButtons();

		if (this.isMultidimensional) this.addCollapsibleEvent();

		this.setupResizeObserver();
		this.slider();
		this.tableRefresh();
	}

	private addCollapsibleEvent(): void {
		const collapseButton = this.table.querySelector<HTMLElement>('.c-table__collapse-button');

		collapseButton?.addEventListener('click', () => {
			this.table.classList.toggle('is-collapsed');
		});
	}

	private tableRefresh(): void {
		let list = Array.from(this.list);

		if (this.isFilterable) {
			list = this.filterList(list, this.filterValue());
		}

		if (this.isSortable) {
			list = this.sortList(list);
		}

		this.renderTable(list);
	}

	private renderTable(list: TableRow[]): void {
		const body = this.table.querySelector<HTMLTableSectionElement>('tbody');

		if (!body) {
			return;
		}

		body.innerHTML = '';
		body.append(...list);
	}

	private filterInput(): void {
		const input = this.table.querySelector<HTMLInputElement>('[js-table-filter-input]');

		input?.addEventListener('input', () => {
			this.tableRefresh();
		});
	}

	private filterList(list: TableRow[], query: string): TableRow[] {
		const rows = this.hasSumRow ? list.slice(0, -1) : list;
		const sumRow = this.hasSumRow ? list[list.length - 1] : null;
		const lowerQuery = query.toLowerCase();

		const filtered = rows.filter((element) => {
			const data = Array.from(element.querySelectorAll<HTMLElement>('[js-table-filter-data]'))
				.map((item) => item.textContent?.toLowerCase() ?? '')
				.join('');
			return data.includes(lowerQuery);
		});

		if (sumRow) {
			filtered.push(sumRow);
		}

		return filtered;
	}

	private compare(a: string, b: string): number {
		return a.localeCompare(b, 'en', { numeric: true, sensitivity: 'base' });
	}

	private sortList(list: TableRow[]): TableRow[] {
		const sortOrder = this.table.getAttribute('js-table-sort--order');

		if (!sortOrder) {
			return list;
		}

		const sortableRows = [...list];
		let sumRow: TableRow | undefined;

		if (this.hasSumRow) {
			sumRow = sortableRows.pop();
		}

		const sortDictator = this.table.getAttribute('js-table-sort--dictator');

		if (!sortDictator) {
			if (sumRow) {
				sortableRows.push(sumRow);
			}

			return sortableRows;
		}

		sortableRows.sort((rowA, rowB) => {
			const firstValue = this.getSortValue(rowA, sortDictator);
			const secondValue = this.getSortValue(rowB, sortDictator);

			return this.compare(firstValue, secondValue);
		});

		if (sortOrder === 'desc') {
			sortableRows.reverse();
		}

		if (sumRow) {
			sortableRows.push(sumRow);
		}

		return sortableRows;
	}

	private sortAddButtons(): void {
		const sortButtons = this.table.querySelectorAll<HTMLElement>('[js-table-sort--btn]');

		sortButtons.forEach((sortButton, index) => {
			if (!sortButton.hasAttribute('js-table-sort--order')) {
				sortButton.setAttribute('js-table-sort--order', 'asc');
			}

			if (this.isSortable && this.isMultidimensional && index === 0) {
				sortButton.removeAttribute('js-table-sort--order');
				return;
			}

			sortButton.addEventListener('click', (event: MouseEvent) => {
				const sortOrder = this.table.getAttribute('js-table-sort--order');
				const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
				const buttonElement = event.currentTarget as HTMLElement | null;

				this.table.setAttribute('js-table-sort--order', newOrder);

				const dataId = buttonElement?.getAttribute('js-table-sort--btn');

				if (!dataId) {
					return;
				}

				this.table.setAttribute('js-table-sort--dictator', dataId);
				this.tableRefresh();
			});
		});
	}

	private filterValue(): string {
		return this.table.querySelector<HTMLInputElement>('[js-table-filter-input]')?.value ?? '';
	}

	private slider(): void {
		if (!this.indicatorInput || !this.tableInner) {
			return;
		}

		this.indicatorInput.addEventListener('mousedown', (event: MouseEvent) => {
			event.preventDefault();
			this.initialCursorPosition = event.clientX;
			this.tableInner?.removeEventListener('scroll', this.updateOnScrollFunc, false);

			window.addEventListener('mousemove', this.handleMouseMoveFunc, false);
			window.addEventListener('mouseup', this.handleMouseUpFunc, false);
		});
	}

	private updateOnScroll(): void {
		if (!this.tableInner || !this.indicatorInput) {
			return;
		}

		const scrolledPixels = this.tableInner.scrollLeft;
		const tableLineWidth = this.tableInner.querySelector<HTMLElement>('.c-table__line')?.offsetWidth ?? 0;

		if (tableLineWidth === 0) {
			this.indicatorInput.style.marginLeft = '0px';
			return;
		}

		this.indicatorInput.style.marginLeft = `${(scrolledPixels / tableLineWidth) * 100}%`;
	}

	private handleMouseMove(event: MouseEvent): void {
		if (!this.indicatorContainer || !this.indicatorInput || !this.tableInner || !this.tableTable) {
			return;
		}

		event.preventDefault();
		const scrollMax = this.indicatorContainer.offsetWidth - this.indicatorInput.offsetWidth;
		const inner = this.tableInner;
		const mouseMovedAmount = event.clientX - this.initialCursorPosition;
		const scrolledAmount = this.indicatorInput.getBoundingClientRect().left - this.indicatorContainer.getBoundingClientRect().left;

		if (scrolledAmount <= 0 && !(scrolledAmount + mouseMovedAmount > 0)) {
			this.indicatorInput.style.marginLeft = '0px';
			this.initialCursorPosition = event.clientX;
			inner.scrollLeft = 0;
		} else if (scrolledAmount >= scrollMax && !(scrolledAmount + mouseMovedAmount <= scrollMax)) {
			this.indicatorInput.style.marginLeft = `${scrollMax}px`;
		} else {
			const amountOfOverflow = this.tableTable.offsetWidth - inner.offsetWidth;
			const indicatorPosition = Number.parseInt(this.indicatorInput.style.marginLeft || '0', 10) || 0;

			this.indicatorInput.style.marginLeft = `${indicatorPosition + mouseMovedAmount}px`;
			this.initialCursorPosition = event.clientX;
			inner.scrollLeft = amountOfOverflow * (scrolledAmount / scrollMax);
		}
	}

	destroy(): void {
		this.resizeObserver?.disconnect();
		this.tableInner?.removeEventListener('scroll', this.updateOnScrollFunc, false);
		window.removeEventListener('mousemove', this.handleMouseMoveFunc, false);
		window.removeEventListener('mouseup', this.handleMouseUpFunc, false);
	}

	private getSortValue(row: TableRow, sortDictator: string): string {
		return row.querySelector<HTMLElement>(`[js-table-sort-data="${sortDictator}"]`)?.textContent?.trim() ?? '';
	}

	private handleMouseUp(event: MouseEvent): void {
		event.preventDefault();
		this.tableInner?.addEventListener('scroll', this.updateOnScrollFunc, false);
		window.removeEventListener('mousemove', this.handleMouseMoveFunc, false);
		window.removeEventListener('mouseup', this.handleMouseUpFunc, false);
	}

	private setupResizeObserver(): void {
		if (!this.tableInner || !this.indicatorInput || !this.indicatorContainer) {
			return;
		}

		this.resizeObserver = new ResizeObserver(() => {
			if (!this.tableInner || !this.indicatorInput || !this.indicatorContainer) {
				return;
			}

			const tableLine = this.tableInner.querySelector<HTMLElement>('.c-table__line');

			if (!tableLine) {
				return;
			}

			const tableInnerWidth = this.tableInner.offsetWidth;
			const tableLineWidth = tableLine.offsetWidth;
			const tableScrollIndicatorWidth = tableLineWidth > 0 ? `${(tableInnerWidth / tableLineWidth) * 100}%` : '100%';

			if (tableScrollIndicatorWidth !== '100%') {
				this.indicatorInput.classList.remove('u-display--none');
				this.indicatorContainer.classList.remove('u-display--none');
			} else {
				this.indicatorInput.classList.add('u-display--none');
				this.indicatorContainer.classList.add('u-display--none');
			}

			this.indicatorInput.style.width = tableScrollIndicatorWidth;
			this.tableInner.removeEventListener('scroll', this.updateOnScrollFunc, false);
			this.tableInner.addEventListener('scroll', this.updateOnScrollFunc, false);
		});

		this.resizeObserver.observe(this.table);
	}
}

/**
 * Initializes all table components on the page after the DOM is ready.
 */
export function init(): void {
	document.addEventListener('DOMContentLoaded', () => {
		document.querySelectorAll<HTMLElement>('.c-table').forEach((table) => {
			new Table(table);
		});
	});
}
