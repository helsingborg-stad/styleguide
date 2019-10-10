const CONTAINER = 'js-sort-container';
const BUTTON = 'js-sort-button';
const SORTABLE = 'js-sort-sortable';
const ORDER = 'js-sort-order';
const DATA = 'js-sort-data';

function compare(a, b) {
    return a.data.toLowerCase().localeCompare(b.data.toLowerCase());
}

function appendSortable(container, dataId){
    let sorted = [];
    let sortOrder = container.getAttribute(ORDER);
    let sortData = container.querySelectorAll(`[${DATA}="${dataId}"]`);
    let comparableData = [...sortData].map((data) => 
        {return {data: data.innerText, index: data.closest(`[${SORTABLE}]`)}
    });

    if(sortOrder === 'asc'){
        sorted = comparableData.sort(compare);
        container.setAttribute(ORDER, "desc");
    }else{
        sorted = comparableData.reverse(compare);
        container.setAttribute(ORDER, "asc");
    }
    sorted.forEach( sort => {
        container.appendChild(sort.index);
    });
}

const sortClass = () => {
    const sortContainers = document.querySelectorAll(`[${CONTAINER}]`);
    
    sortContainers.forEach( container =>{
        const sortButtons = container.querySelectorAll(`[${BUTTON}]`);
        sortButtons.forEach( (button) => {

            let dataId = button.getAttribute(BUTTON);
           
            button.addEventListener('click', (event)=>{
                appendSortable(container, dataId);
            });
        });
    });
}

export default sortClass;