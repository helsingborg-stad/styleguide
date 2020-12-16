export default class Table{
    constructor(table){
        this.table = table
        this.list = table.querySelectorAll('[js-table-filter-item]');
        this.isPagination = table.hasAttribute('js-table-pagination')
        this.isFilterable = table.hasAttribute('js-table-filter')
        this.link = null
        this.rowHref = 'js-row-href';

        this.tableRefresh();

        if (this.isPagination) this.paginationButtons()

        if (this.isFilterable) this.filterInput();
    }

    tableRefresh() {
        // eslint-disable-next-line prefer-destructuring
        let list = this.list;

        if (this.isPagination) {
            list = this.paginateList(list)
        }

        if (this.isFilterable) {
            list = this.filterList(list, this.filterValue());
        }

        this.renderTable(list);
        
        if (this.isPagination) {
            this.paginatePages();
            this.paginationLinks();
            this.paginateLinkListeners();
        }
    }

    renderTable(list = null) {
        const body = this.table.querySelector('tbody');
        body.innerHTML = "";

        list.forEach(element => {
            body.appendChild(element)
        });
    }

    paginatePages() {
        const items = this.isFilterable ? 
            this.filterList(this.list, this.filterValue()).length :
            this.list.length;

        return Math.ceil(items / this.paginationRows());
    }

    paginationLinks() {
        if(!this.link) {
            this.link = this.table.querySelector('[js-table-pagination--link]');
        }
        
        const body = this.table.querySelector('[js-table-pagination--links]');
        body.closest('[js-table-pagination]').classList.remove('u-display--none')
        body.innerHTML = "";

        if(this.paginatePages() > 1) {
            // eslint-disable-next-line no-plusplus
            for (let index = 0; index < this.paginatePages(); index++) {
                const elm = this.link.cloneNode(true);
                elm.innerHTML = index +1;
                elm.classList.remove('c-button__outlined--primary');
                elm.setAttribute('js-table-pagination--link', index +1);

                if((index +1) === this.paginationCurrent() ){
                    elm.classList.add('c-button__outlined--primary');
                }

                body.appendChild(elm);
            }
        } else {
            body.closest('[js-table-pagination]').classList.add('u-display--none')
        }
    }

    paginateLinkListeners() {
        const btns = this.table.querySelectorAll('[js-table-pagination--link]')

        btns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.paginateSetCurrent(btn.getAttribute('js-table-pagination--link'));
                this.tableRefresh();
            })
        });
    }

    // eslint-disable-next-line class-methods-use-this
    paginateList(list) {
        const first = (this.paginationCurrent() - 1) * this.paginationRows();
        const last = this.paginationCurrent() * this.paginationRows();
        
        return Array.from(list).slice(first, last);
    }

    // Add event listener filter
    filterInput() {
        const input = this.table.querySelector('[js-table-filter-input]');
        
        input.addEventListener('input', (e) => {
            if (this.isPagination) this.paginateSetCurrent();
            this.tableRefresh();
        })
    }

    // eslint-disable-next-line class-methods-use-this
    filterList(list, query) {
        const newList = [];

        list.forEach(element => {
            let data = "";

            element.querySelectorAll('[js-table-filter-data]').forEach(item => {
                data += item.innerHTML.toLowerCase();
            })

            if (data.includes(query.toLowerCase())) {
                newList.push(element);
            }
        });

        return newList;
    }

    paginationButtons() {
        const buttons = this.table.querySelectorAll('[js-table-pagination-btn]');
        this.paginateSetCurrent();

        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                const type = btn.getAttribute('js-table-pagination-btn');

                this.paginateSetCurrent(type === 'next' ?
                    this.paginationCurrent() +1 :
                    this.paginationCurrent() -1
                );

                this.tableRefresh();
            })
        });
    }

    paginateSetCurrent(current = 1) {
        this.table.setAttribute('js-table-pagination--current', current);

        if (current === this.paginatePages()) {
            this.table.querySelector('[js-table-pagination-btn="next"]').setAttribute('disabled', true);

        } else if (current === 1) {
            this.table.querySelector('[js-table-pagination-btn="prev"]').setAttribute('disabled', true);

        } else {
            this.table.querySelector('[js-table-pagination-btn="next"]').removeAttribute('disabled');
            this.table.querySelector('[js-table-pagination-btn="prev"]').removeAttribute('disabled');
        }
    }

    filterValue() {
        return this.table.querySelector('[js-table-filter-input]').value;
    }

    paginationCurrent() {
        return parseInt(this.table.getAttribute('js-table-pagination--current'), 10)
    }

    paginationRows() {
        return this.table.getAttribute('js-table-pagination')
    }
}