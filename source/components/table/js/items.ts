import { AttributeNames } from "../enum";

class Items implements ItemsInterface {
    constructor(private config: TableConfigInterface) {}

    public getHeadingCells(): HTMLElement[] {
        return Array.from(this.config.getTableHead().querySelectorAll(`[${AttributeNames.TableCell}]`));
    }

    public getDataCells(): HTMLElement[] {
        return Array.from(this.config.getTableBody().querySelectorAll(`[${AttributeNames.TableCell}]`));
    }

    public getRows(): HTMLElement[] {
        return Array.from(this.config.getTableBody().querySelectorAll(`[${AttributeNames.RowIndex}]`));
    }

    public getDataCellsFromColumnIndex(columnIndex: number): HTMLElement[] {
        return Array.from(this.config.getTableBody().querySelectorAll(`[${AttributeNames.TableCell}][${AttributeNames.ColumnIndex}="${columnIndex}"]`));
    }

    public addItems(items: HTMLElement[]): void {
        // Implement logic to add items to storage
    }
}

export default Items;