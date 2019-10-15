
class Sort {

    constructor() {
        this.CONTAINER = 'js-sort-container';
        this.BUTTON = 'js-sort-button';
        this.SORTABLE = 'js-sort-sortable';
        this.ORDER = 'js-sort-order';
        this.DATA = 'js-sort-data';
        this.DATACONTAINER = 'js-sort-data-container'
    }

    compare(a, b) {
        return a.data.toLowerCase().localeCompare(b.data.toLowerCase());
    }

    appendSortable(container, dataId) {
        let sorted = [];
        let sortOrder = container.getAttribute(this.ORDER);
        let sortData = container.querySelectorAll(`[${this.DATA}="${dataId}"]`);
        console.log(`[${this.DATA}="${dataId}"]`)
        let comparableData = [...sortData].map((data) => {
            return { data: data.innerText, index: data.closest(`[${this.SORTABLE}]`) }
        });

        if (sortOrder === 'asc') {
            sorted = comparableData.sort(this.compare);
            container.setAttribute(this.ORDER, "desc");
        } else {
            sorted = comparableData.reverse(this.compare);
            container.setAttribute(this.ORDER, "asc");
        }

        sorted.forEach(sort => {
            sort.index.closest(`[${this.DATACONTAINER}]`).appendChild(sort.index);
        });
    }

    applySort() {
        console.log("LOL")
        const sortContainers = document.querySelectorAll(`[${this.CONTAINER}]`);

        sortContainers.forEach(container => {
            const sortButtons = container.querySelectorAll(`[${this.BUTTON}]`);
            sortButtons.forEach((button) => {

                let dataId = button.getAttribute(this.BUTTON);

                button.addEventListener('click', (event) => {
                    console.log("HEJ!")
                    this.appendSortable(container, dataId);
                });
            });
        });
    }

}

export default Sort;