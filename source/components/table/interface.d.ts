
interface TableConfigInterface {
    getRoot(): HTMLElement;
    getTableBody(): HTMLElement;
    getTableHead(): HTMLElement;
    getInnerContainer(): HTMLElement | null;
    getTableElement(): HTMLElement | null;
    getScrollIndicatorContainer(): HTMLElement | null;
    getScrollElement(): HTMLElement | null;
    isTableSortable(): boolean;
    isTableFilterable(): boolean;
    isTableMultidimensional(): boolean;
    hasTableSummaryRow(): boolean;
};

interface ItemsInterface {
    getHeadingCells(): HTMLElement[];
    getDataCells(): HTMLElement[];
    getRows(): HTMLElement[];
    addItems(items: HTMLElement[]): void;
    getDataCellsFromColumnIndex(columnIndex: number): HTMLElement[];
    getSummaryRow(): HTMLElement | null;
}

type SortOrder = 'asc' | 'desc';