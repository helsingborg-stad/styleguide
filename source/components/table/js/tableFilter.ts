import { AttributeNames } from "../enum";
import Items from "./items";
import Table from "./table";

/**
 * Handles real-time text filtering of table rows.
 */
class TableFilter {
	constructor(
		private tableInstance: Table,
		private tableConfig: TableConfigInterface,
		private itemsInstance: Items
	) {
		this.setupFilterInput();
	}

	private setupFilterInput(): void {
		const input = this.tableConfig.getRoot().querySelector<HTMLInputElement>(`[${AttributeNames.FilterInput}]`);

		input?.addEventListener('input', () => {
			this.handleInput(input.value);
		});
	}

	private handleInput(query: string): void {
		const lowerQuery = query.toLowerCase().trim();

		this.itemsInstance.getRows().forEach(row => {
			const cells = Array.from(row.querySelectorAll<HTMLElement>(`[${AttributeNames.TableCell}]`));
			const rowText = cells.map(cell => cell.textContent?.toLowerCase() ?? '').join(' ');

			row.hidden = !rowText.includes(lowerQuery);
		});
	}
}

export default TableFilter;
