import { AttributeNames } from "../enum";

class TableConfig implements TableConfigInterface {
    private readonly isSortable: boolean;
    private readonly isFilterable: boolean;
    private readonly tableElement: HTMLElement | null;
    private readonly scrollIndicatorContainer: HTMLElement | null;
    private readonly scrollIndicatorElement: HTMLElement | null;
    private readonly isMultidimensional: boolean;
    private readonly hasSummaryRow: boolean;
    private readonly tableBody: HTMLElement | null;
    private readonly tableHead: HTMLElement | null;
    private readonly tableWrapper: HTMLElement | null;

    constructor(
        private root: HTMLElement
    ) {
        this.isSortable = root.hasAttribute(`${AttributeNames.HasTableSort}`);
        this.isFilterable = root.hasAttribute(`${AttributeNames.HasTableFilter}`);
        this.tableWrapper = root.querySelector(`[${AttributeNames.TableWrapper}]`);
        this.tableElement = root.querySelector(`[${AttributeNames.TableElement}]`);
        this.scrollIndicatorContainer = root.querySelector(`[${AttributeNames.TableScrollIndicatorContainer}]`);
        this.scrollIndicatorElement = root.querySelector(`[${AttributeNames.TableScrollIndicator}]`);
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

    public getTableWrapper(): HTMLElement | null {
        return this.tableWrapper;
    }

    public getTableElement(): HTMLElement | null {
        return this.tableElement;
    }

    public getScrollIndicatorContainer(): HTMLElement | null {
        return this.scrollIndicatorContainer;
    }

    public getScrollIndicator(): HTMLElement | null {
        return this.scrollIndicatorElement;
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