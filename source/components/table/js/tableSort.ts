import { AttributeNames } from "../enum";
import Items from "./items";

/**
 * Handles sorting interactions and row ordering for table components.
 */
class TableSort {
	constructor(
		private readonly tableConfig: TableConfigInterface,
		private readonly itemsInstance: Items
	) {
		this.setupSortingButtons();
	}

	private setupSortingButtons(): HTMLElement[] {
		const sortingButtons = this.itemsInstance.getHeadingCells();

		sortingButtons.forEach(sortingButton => {
			if (!sortingButton.hasAttribute(`${AttributeNames.SortingOrder}`)) {
				sortingButton.setAttribute(`${AttributeNames.SortingOrder}`, 'desc');
			}

			sortingButton.addEventListener('click', (e: MouseEvent) => {
				this.handleClick(sortingButton);
			});
		});

		return sortingButtons;
	}

	private handleClick(sortingButton: HTMLElement): void {
		const nextSortOrder = this.getNextSortOrder(sortingButton);
		const sortingColumn = this.getSortingColumn(sortingButton);

		if (sortingColumn === null) {
			console.warn('Sorting column index is not defined.');
			return;
		}
		
		const dataCells = this.itemsInstance.getDataCellsFromColumnIndex(sortingColumn);

		const sortedDataCells = dataCells.sort((a, b) => {
			const aValue = a.textContent?.trim() ?? '';
			const bValue = b.textContent?.trim() ?? '';

			if (nextSortOrder === 'asc') {
				return aValue.localeCompare(bValue, undefined, { numeric: true, sensitivity: 'base' });
			} else {
				return bValue.localeCompare(aValue, undefined, { numeric: true, sensitivity: 'base' });
			}
		});

		const sortedRows = sortedDataCells
			.map(dataCell => dataCell.closest<HTMLElement>(`[${AttributeNames.RowIndex}]`))
			.filter((row): row is HTMLElement => row !== null);

		sortedRows.forEach((row) => {
			this.tableConfig.getTableBody().appendChild(row);
		});
	}

	private getSortingColumn(sortingButton: HTMLElement): number | null {
		return sortingButton.hasAttribute(`${AttributeNames.ColumnIndex}`) ? parseInt(sortingButton.getAttribute(`${AttributeNames.ColumnIndex}`) as string, 10) : null;
	}

	private getNextSortOrder(sortingButton: HTMLElement): SortOrder {
		const states: SortOrder[] = ['asc', 'desc'];

		const currentState = sortingButton.getAttribute(`${AttributeNames.SortingOrder}`) as SortOrder;
		const currentIndex = states.indexOf(currentState);

		const nextState = states[(currentIndex + 1) % states.length];

		sortingButton.setAttribute(`${AttributeNames.SortingOrder}`, nextState);

		return nextState;
	}
}

export default TableSort;