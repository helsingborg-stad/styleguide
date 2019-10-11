/* Filter lists */
const   CONTAINER = "[js-filter-container]",
        ITEM = "[js-filter-item]",
        DATA = "[js-filter-data]",
        INPUT = "[js-filter-input]";

export default class Filter {
    constructor() {
        this.list = [];

        this.enableSearch();
    }

    enableSearch() {
        let containers = document.querySelectorAll(CONTAINER);//Get filterable elements

        containers.forEach((container) => {

            //Get filterable items
            container.querySelectorAll(ITEM).forEach((item) => {
                let dataItems = item.querySelectorAll(DATA);
                let dataString = '';

                //Build search string
                dataItems.forEach((data) => {
                    dataString = dataString.concat(data.innerText);
                });

                //Add to search array
                this.list.push({
                    searchId: container.getAttribute('js-filter-container'), //Get id
                    element: item,
                    parent: item.parentNode,
                    data: dataString.toLowerCase()
                });
            });

            //Get inputs
            container.querySelectorAll(INPUT).forEach((input) => {
                input.addEventListener('keydown', () => {
                    let inputId = input.getAttribute('js-filter-input');

                    this.list.forEach((item) => {
                        if (item.searchId === inputId) {
                            //Get search term and search in item
                            let res = item.data.search(input.value.toLocaleLowerCase());

                            if (res < 0) {
                                item.element.remove(); //Remove unmatched
                            } else {
                                item.parent.append(item.element); //Readd match
                            }
                        }
                    });
                });
            });
        });
    }
}