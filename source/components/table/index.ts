import TableSort from "./js/tableSort";
import TableFilter from "./js/tableFilter";
import Table from "./js/table";
import TableConfig from "./js/tableConfig";
import Items from "./js/items";
import TableScrollIndicator from "./js/tableScrollIndicator";

class TableFactory {
	private static factoryInstance: TableFactory | null = null;
	public create(table: HTMLElement): Table | null{
		const config = new TableConfig(table);

		if (this.hasRequiredElements(config)) {
			console.error('Table element, table body, or table head is missing.');
			return null;
		}

		const itemsInstance = new Items(config);
		const tableInstance = new Table(config);

		if (config.isTableSortable()) {
			new TableSort(config, itemsInstance);
		}

		if (config.isTableFilterable()) {
			new TableFilter(config, itemsInstance);
		}

		if (
			config.getScrollIndicator() &&
			config.getScrollIndicatorContainer() &&
			config.getTableElement() &&
			config.getTableWrapper()
		) {
			new TableScrollIndicator(config);
		}

		return tableInstance;
	}

	private hasRequiredElements(config: TableConfig): boolean {
		return (
			!config.getTableElement() ||
			!config.getTableBody() ||
			!config.getTableHead()
		);
	}

	public static getInstance(): TableFactory {
		return TableFactory.factoryInstance ?? (TableFactory.factoryInstance = new TableFactory());
	}
}

/**
 * Initializes all table components on the page after the DOM is ready.
 */
export function init(): void {
	document.addEventListener('DOMContentLoaded', () => {
		document.querySelectorAll<HTMLElement>('[data-js-table]').forEach((table) => {
			TableFactory.getInstance().create(table);
		});
	});
}
