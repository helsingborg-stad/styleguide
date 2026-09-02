import { AttributeNames } from "../enum";

class Items implements ItemsInterface {

    private readonly targetWithoutSummaryRow: string = `[${AttributeNames.RowIndex}]:not([${AttributeNames.SummaryRow}])`;

    constructor(private readonly tableConfig: TableConfigInterface) {}

    public getHeadingCells(): HTMLElement[] {
        return Array.from(this.tableConfig.getTableHead().querySelectorAll(`[${AttributeNames.TableCell}]`));
    }

    public getDataCells(): HTMLElement[] {
        return Array.from(this.tableConfig.getTableBody().querySelectorAll(`${this.targetWithoutSummaryRow} [${AttributeNames.TableCell}]`));
    }

    public getRows(): HTMLElement[] {
        return Array.from(this.tableConfig.getTableBody().querySelectorAll(this.targetWithoutSummaryRow));
    }

    public getDataCellsFromColumnIndex(columnIndex: number): HTMLElement[] {
        return Array.from(this.tableConfig.getTableBody().querySelectorAll(`${this.targetWithoutSummaryRow} [${AttributeNames.TableCell}][${AttributeNames.ColumnIndex}="${columnIndex}"]`));
    }

    public getSummaryRow(): HTMLElement | null {
        return this.tableConfig.getTableBody().querySelector(`[${AttributeNames.SummaryRow}]`);
    }
}

export default Items;