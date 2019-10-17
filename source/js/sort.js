
class Sort {

    constructor() {
        this.CONTAINER = 'js-sort-container';
        this.BUTTON = 'js-sort-button';
        this.SORTABLE = 'js-sort-sortable';
        this.ORDER = 'js-sort-order';
        this.DATA = 'js-sort-data';
        this.DATACONTAINER = 'js-sort-data-container';
        this.INITIAL = 'js-sort-initial';
    }

    compare(a, b) {
        return a.data.toLowerCase().localeCompare(b.data.toLowerCase());
    }

    appendSortable(container, dataId, initialSort = false) {
        let sorted = [];
        let sortOrder = container.getAttribute(this.ORDER);
        let sortData = container.querySelectorAll(`[${this.DATA}="${dataId}"]`);
        let comparableData = [...sortData].map((data) => {
            return { data: data.innerText, index: data.closest(`[${this.SORTABLE}]`) }
        });
        
        if (sortOrder === 'asc' || (initialSort && initialSort === 'asc')) {
            sorted = comparableData.sort(this.compare);
            container.setAttribute(this.ORDER, "desc");
        } else if(initialSort && initialSort === 'desc') {
            comparableData.sort(this.compare);
            sorted = comparableData.reverse(this.compare);
            container.setAttribute(this.ORDER, 'asc');
        } else {
            sorted = comparableData.reverse(this.compare);
            container.setAttribute(this.ORDER, "asc");
        }

        sorted.forEach(sort => {
            sort.index.closest(`[${this.DATACONTAINER}]`).appendChild(sort.index);
        });
    }

    applySort() {
        const sortContainers = document.querySelectorAll(`[${this.CONTAINER}]`);

        sortContainers.forEach(container => {
            const sortButtons = container.querySelectorAll(`[${this.BUTTON}]`);
            sortButtons.forEach((button) => {

                let dataId = button.getAttribute(this.BUTTON);
                let initialSort = container.getAttribute(this.INITIAL)

                if(initialSort){
                    container.setAttribute(this.ORDER, initialSort)
                    this.appendSortable(container, dataId, initialSort);
                }
                button.addEventListener('click', (event) => {
                    this.appendSortable(container, dataId);
                });
            });
        });
    }

}

export default Sort;