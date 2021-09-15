export default class Table{
    constructor(table){
        this.table = table
        this.list = table.querySelectorAll('[js-table-filter-item]');
        this.isPagination = table.hasAttribute('js-table-pagination')
        this.isFilterable = table.hasAttribute('js-table-filter')
        this.isSortable = table.hasAttribute('js-table-sort')
        this.isMultidimensional = table.classList.contains('c-table--multidimensional');        
        this.link = null
        this.rowHref = 'js-row-href';
        this.hasSumRow    = this.table.hasAttribute('table-sum');

        this.tableRefresh();

        if (this.isPagination) this.paginationButtons()

        if (this.isFilterable) this.filterInput();

        if (this.isSortable) this.sortAddButtons();

        if (this.isMultidimensional) this.addCollapsibleEvent();
        
        const resizeObserver = new ResizeObserver(entries => {
           
            const tableInner = table.querySelector('.c-table__inner');
            const tableInnerWidth = tableInner.offsetWidth;
            const tableLineWidth = tableInner.querySelector('.c-table__line').offsetWidth;
            const tableScrollIndicator = table.querySelector('.c-table__scroll-indicator');
            const tableScrollIndicatorWrapper = table.querySelector('.c-table__scroll-indicator-wrapper');
            const tableScrollIndicatorWidth = `${(tableInnerWidth / tableLineWidth) * 100}%`;

            if(tableScrollIndicatorWidth !== '100%') {
                tableScrollIndicator.classList.remove('u-display--none');
                tableScrollIndicatorWrapper.classList.remove('u-display--none');
            }
            tableScrollIndicator.style.width = tableScrollIndicatorWidth;

            tableInner.addEventListener('scroll', (event) => {
                const scrolledPixels = tableInner.scrollLeft;
                tableScrollIndicator.style.marginLeft = `${(scrolledPixels / tableLineWidth) * 100}%`;
            })
        
        });

        resizeObserver.observe(table);
    }

    addCollapsibleEvent() {
        const collapseButton = this.table.querySelector('.c-table__collapse-button');
        console.log(collapseButton);
        collapseButton.addEventListener('click', () => {
            console.log('CLICK')
            this.table.classList.toggle('is-collapsed');
            
        });
    }

    tableRefresh() {
        // eslint-disable-next-line prefer-destructuring
        let list = this.list;
        
        if (this.isFilterable) {
            list = this.filterList(list, this.filterValue());
        }

        if (this.isSortable) {
            list = this.sortList(list)
        }

        if (this.isPagination) {
            list = this.paginateList(list)
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
            if(element.index) {
                body.appendChild(element.index)
            } else {
                body.appendChild(element)
            }
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
        const lastIndex = list.length - 1;
        const lastRow = list[lastIndex];

        list.forEach(element => {
            let data = "";

            element.querySelectorAll('[js-table-filter-data]').forEach(item => {
                data += item.innerHTML.toLowerCase();
            })

            if (data.includes(query.toLowerCase())) {
                newList.push(element);
            }
        });

        if(this.hasSumRow) {            
            newList[lastIndex] = lastRow;
        }

        return newList;
    }

    // eslint-disable-next-line class-methods-use-this
    compare(a, b) {
        return a.data.toLowerCase().localeCompare(b.data.toLowerCase(), 'en', {numeric: true});
    }

    sortList(list) {
        const sortOrder = this.table.getAttribute('js-table-sort--order');
        let sumRow = '';

        if (!sortOrder) {
            return list;
        }
        
        if(this.hasSumRow) {
            sumRow = list.pop();
        }

        const sortData = []
        const sortDictator = this.table.getAttribute('js-table-sort--dictator');

        list.forEach(element => {
            sortData.push(element.querySelector(`[js-table-sort-data="${sortDictator}"]`))
        });

        const comparableData = [...sortData].map((data) => {
            return { data: data.innerText.trim(), index: data.closest(`[js-table-sort--sortable]`) }
        });

        comparableData.sort(this.compare);
        
        if (sortOrder === 'desc') {

            if(this.hasSumRow) {
                comparableData.unshift({index: sumRow});
            }

            return comparableData.reverse(this.compare);
        }

        if(this.hasSumRow) {
            comparableData.push({index: sumRow});
        }

        return comparableData;
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

        current = parseInt(current, 10);
        
        if (current === this.paginatePages()) {
            this.table.querySelector('[js-table-pagination-btn="next"]').setAttribute('disabled', true);
            this.table.querySelector('[js-table-pagination-btn="prev"]').removeAttribute('disabled');
        } else if (current === 1) {
            this.table.querySelector('[js-table-pagination-btn="prev"]').setAttribute('disabled', true);
            this.table.querySelector('[js-table-pagination-btn="next"]').removeAttribute('disabled');
        } else {
            this.table.querySelector('[js-table-pagination-btn="next"]').removeAttribute('disabled');
            this.table.querySelector('[js-table-pagination-btn="prev"]').removeAttribute('disabled');
        }
    }

    sortAddButtons() {
        const sortButtons = this.table.querySelectorAll(`[js-table-sort--btn]`);
        
        for (let i = 0; i < sortButtons.length; i++ ) {

            if (!sortButtons[i].hasAttribute('js-table-sort--order')){
                sortButtons[i].setAttribute('js-table-sort--order', 'asc')
            }
            
            if(this.isSortable && this.isMultidimensional && i === 0) {
                sortButtons[i].removeAttribute('js-table-sort--order');
                continue;
            }

            sortButtons[i].addEventListener('click', (e) => {
                if (this.isPagination) this.paginateSetCurrent();

                const sortOrder = this.table.getAttribute('js-table-sort--order');
                const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
                this.table.setAttribute('js-table-sort--order', newOrder);

                const buttonId = e.target.closest('[js-table-sort--btn]')
                const dataId = buttonId.getAttribute('js-table-sort--btn');
                this.table.setAttribute('js-table-sort--dictator', dataId)
                this.tableRefresh();
            });
        };
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