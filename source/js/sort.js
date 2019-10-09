const CONTAINER = 'js-sort-container';
const BUTTON = 'js-sort-button';
const SORTABLE = 'js-sort-sortable';
const ORDER = 'js-sort-order'
const DATA = 'js-sort-data'

var sort_data = function(a, b) {
    return a.data.toLowerCase().localeCompare(b.data.toLowerCase());
}


const sortClass = () => {
    const sortButtons = document.querySelectorAll(`[${BUTTON}]`)
    const sortContainer = document.querySelectorAll(`[${CONTAINER}]`);
    
    sortContainer.forEach( container =>{
        sortButtons.forEach( button => {

//            let icon = document.createElement('<i class="c-icon c-icon--size-m c-icon--arrow-drop-down"></i>')
            let icon = document.createElement('i')
            icon.className = 'c-icon c-icon--size-m c-icon--arrow-drop-down';

            button.appendChild(icon) 
            button.addEventListener('click', (event)=>{
                let sorted = [];
                let columnIndex = button.getAttributeNode(BUTTON).value
                let sortOrder = container.getAttributeNode(ORDER).value
                let sortableElements = container.querySelectorAll(`[${SORTABLE}]`)
                let sortData = container.querySelectorAll(`[${DATA}="${columnIndex}"]`)
                let comparableData = [...sortData].map((data) => { return {data: data.innerText, index: data.parentElement.getAttributeNode('js-sort-sortable').value}})

                if(sortOrder === 'asc'){
                    sorted = comparableData.sort(sort_data)
                    container.setAttribute(ORDER, "desc")
                }else{
                    sorted = comparableData.reverse(sort_data)
                    container.setAttribute(ORDER, "asc")
                }
                
                sorted.forEach( (sort,index) => {
                    let toAppend = sortableElements[sort.index]
                    toAppend.setAttribute('js-sort-sortable', index)
                    container.appendChild(toAppend)
                })
            });
        });
    });
    
    
}

export default sortClass;