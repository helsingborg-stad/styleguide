
interface TableConfigInterface {
    getRoot(): HTMLElement;
    getTableBody(): HTMLElement;
    getTableHead(): HTMLElement;
    getTableWrapper(): HTMLElement | null;
    getTableElement(): HTMLElement | null;
    getScrollIndicatorContainer(): HTMLElement | null;
    getScrollIndicator(): HTMLElement | null;
    isTableSortable(): boolean;
    isTableFilterable(): boolean;
    isTableMultidimensional(): boolean;
    hasTableSummaryRow(): boolean;
};

interface ItemsInterface {
    getHeadingCells(): HTMLElement[];
    getDataCells(): HTMLElement[];
    getRows(): HTMLElement[];
    getDataCellsFromColumnIndex(columnIndex: number): HTMLElement[];
    getSummaryRow(): HTMLElement | null;
}

type SortOrder = 'asc' | 'desc';