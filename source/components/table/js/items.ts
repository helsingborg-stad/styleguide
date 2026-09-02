import { AttributeNames } from "../enum";

class Items implements ItemsInterface {

    private targetWithoutSummaryRow: string = `[${AttributeNames.RowIndex}]:not([${AttributeNames.SummaryRow}])`;
    constructor(private config: TableConfigInterface) {}

    public getHeadingCells(): HTMLElement[] {
        return Array.from(this.config.getTableHead().querySelectorAll(`[${AttributeNames.TableCell}]`));
    }

    public getDataCells(): HTMLElement[] {
        return Array.from(this.config.getTableBody().querySelectorAll(`${this.targetWithoutSummaryRow} [${AttributeNames.TableCell}]`));
    }

    public getRows(): HTMLElement[] {
        return Array.from(this.config.getTableBody().querySelectorAll(this.targetWithoutSummaryRow));
    }

    public getDataCellsFromColumnIndex(columnIndex: number): HTMLElement[] {
        return Array.from(this.config.getTableBody().querySelectorAll(`${this.targetWithoutSummaryRow} [${AttributeNames.TableCell}][${AttributeNames.ColumnIndex}="${columnIndex}"]`));
    }

    public getSummaryRow(): HTMLElement | null {
        return this.config.getTableBody().querySelector(`[${AttributeNames.SummaryRow}]`);
    }
}

export default Items;