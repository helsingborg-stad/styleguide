class TableMultidimensional {
	constructor(
       private readonly tableConfig: TableConfigInterface,
       private readonly itemsInstance: ItemsInterface
    ) {
        this.setupMinimizeButton();
	}

    private setupMinimizeButton(): void {
        const minimizeButton = this.itemsInstance.getHeadingCells()[0];

        if (minimizeButton) {
            minimizeButton.addEventListener('click', () => {
                this.tableConfig.getRoot().classList.toggle('is-collapsed');
            });
        }
    }
}

export default TableMultidimensional;