import { AttributeNames } from "../enum";

class TableConfig implements TableConfigInterface {
    private isSortable: boolean;
    private isFilterable: boolean;
    private innerContainer: HTMLElement | null;
    private tableElement: HTMLElement | null;
    private scrollIndicatorContainer: HTMLElement | null;
    private scrollElement: HTMLElement | null;
    private isMultidimensional: boolean;
    private hasSummaryRow: boolean;
    private tableBody: HTMLElement | null;
    private tableHead: HTMLElement | null;

    constructor(
        private root: HTMLElement
    ) {
        this.isSortable = root.hasAttribute(`${AttributeNames.HasTableSort}`);
        this.isFilterable = root.hasAttribute(`${AttributeNames.HasTableFilter}`);
        this.innerContainer = root.querySelector(`[${AttributeNames.TableInnerContainer}]`);
        this.tableElement = root.querySelector(`[${AttributeNames.TableElement}]`);
        this.scrollIndicatorContainer = root.querySelector(`[${AttributeNames.TableScrollIndicatorContainer}]`);
        this.scrollElement = root.querySelector(`[${AttributeNames.TableScrollIndicator}]`);
        this.isMultidimensional = root.hasAttribute(`${AttributeNames.HasMultidimensional}`);
        this.hasSummaryRow = root.querySelector(`[${AttributeNames.SummaryRow}]`) ? true : false;
        this.tableBody = root.querySelector(`[${AttributeNames.TableBody}]`);
        this.tableHead = root.querySelector(`[${AttributeNames.TableHead}]`);
    }

    public getRoot(): HTMLElement {
        return this.root;
    }

    public getTableBody(): HTMLElement {
        return this.tableBody as HTMLElement;
    }

    public getTableHead(): HTMLElement {
        return this.tableHead as HTMLElement;
    }

    public getInnerContainer(): HTMLElement | null {
        return this.innerContainer;
    }

    public getTableElement(): HTMLElement | null {
        return this.tableElement;
    }

    public getScrollIndicatorContainer(): HTMLElement | null {
        return this.scrollIndicatorContainer;
    }

    public getScrollElement(): HTMLElement | null {
        return this.scrollElement;
    }

    public isTableSortable(): boolean {
        return this.isSortable;
    }

    public isTableFilterable(): boolean {
        return this.isFilterable;
    }

    public isTableMultidimensional(): boolean {
        return this.isMultidimensional;
    }

    public hasTableSummaryRow(): boolean {
        return this.hasSummaryRow;
    }
}

export default TableConfig;