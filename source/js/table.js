export default class Table{
    constructor(){
        this.rowHref = 'js-row-href';
        this.constructor.makeRowClickable();
    }

    static makeRowClickable() { 
        const tables = document.querySelectorAll('.c-table');

        tables.forEach(table => {
            const rows = table.querySelectorAll('tr');
            rows.forEach(row => {
                const href = row.getAttribute('js-row-href');
                if(href) {
                    row.style.cursor = 'pointer';
                }
                
                if(href) { 
                    row.addEventListener('click', (event) => {
                        window.location = href;
                    });
                }
            });

        });
    }
}