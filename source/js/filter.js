/* Filter lists */
const CONTAINER = "[js-filter-container]";
const ITEM = "[js-filter-item]";
const DATA = "[js-filter-data]";
const INPUT = "[js-filter-input]";

const filterBox = () => {

    var list = [];

    //Get filterable elements
    let containers = document.querySelectorAll(CONTAINER);
    containers.forEach((container) => {
        let items = container.querySelectorAll(ITEM);

        items.forEach((item) => {
            let dataItems = item.querySelectorAll(DATA);
            let dataString = '';

            //Build search string
            dataItems.forEach((data) => {
                dataString = dataString.concat(data.innerText);
            });

            //Add to search array
            list.push({
                searchId: container.getAttribute('js-filter-container'), //Get id
                element: item,
                parent: item.parentNode,
                data: dataString.toLowerCase()
            });
        });
    });

    //Add listeners to inputs
    containers.forEach(container => {
        let inputs = container.querySelectorAll(INPUT);

        inputs.forEach((input) => {
            input.addEventListener('change', () => {
                let inputId = input.getAttribute('js-filter-input');

                list.forEach((item) => {
                    if (item.searchId === inputId) {
                        let res = item.data.search(input.value.toLocaleLowerCase());

                        if (res < 0) {
                            item.element.remove();
                        } else {
                            item.parent.append(item.element);
                        }
                    }
                });
            });
        });
    });
};

export default filterBox;