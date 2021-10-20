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
        this.tableInner = table.querySelector('.c-table__inner');
        this.tableTable = table.querySelector('.c-table__table');



        this.tableRefresh();

        if (this.isPagination) this.paginationButtons()

        if (this.isFilterable) this.filterInput();

        if (this.isSortable) this.sortAddButtons();

        if (this.isMultidimensional) this.addCollapsibleEvent();

        this.updateOnScrollFunc = this.updateOnScroll.bind(this);
        
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
            } else {
                tableScrollIndicator.classList.add('u-display--none');
                tableScrollIndicatorWrapper.classList.add('u-display--none');
            }
            tableScrollIndicator.style.width = tableScrollIndicatorWidth;

            this.tableInner.addEventListener('scroll', this.updateOnScrollFunc, false)
        });

        resizeObserver.observe(table);

        this.indicatorContainer = this.table.querySelector('.c-table__scroll-indicator-wrapper');
        this.indicatorInput = this.table.querySelector('.c-table__scroll-indicator');
        this.indicatorInputLeft = this.indicatorInput.offsetLeft;
        this.initialCursorPosition = 0;
        this.indicatorInput.style.marginLeft = "0px";

        this.slider()

        this.handleMouseMoveFunc = this.handleMouseMove.bind(this);
    }

    addCollapsibleEvent() {
        const collapseButton = this.table.querySelector('.c-table__collapse-button');
        collapseButton.addEventListener('click', () => {
            this.table.classList.toggle('is-collapsed');
        });
    }

    tableRefresh() {
        // eslint-disable-next-line prefer-destructuring
        let list = Array.from(this.list);
        
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

    slider() {
        this.indicatorInput.addEventListener("mousedown", (e) => {
            e.preventDefault();
            this.initialCursorPosition = e.clientX;
            this.tableInner.removeEventListener('scroll', this.updateOnScrollFunc, false)


            window.addEventListener('mousemove', this.handleMouseMoveFunc, false);

            window.addEventListener("mouseup", (ev) => {
                ev.preventDefault();
                this.tableInner.addEventListener('scroll', this.updateOnScrollFunc, false)
                window.removeEventListener('mousemove', this.handleMouseMoveFunc, false);
            })
        })
    }

    updateOnScroll() {
        const scrolledPixels = this.tableInner.scrollLeft;
        const tableLineWidth = this.tableInner.querySelector('.c-table__line').offsetWidth;

        this.indicatorInput.style.marginLeft = `${(scrolledPixels / tableLineWidth) * 100}%`;
    }

    handleMouseMove(event) {
        event.preventDefault();
        const scrollMax         = this.indicatorContainer.offsetWidth - this.indicatorInput.offsetWidth;
        const inner             = this.table.querySelector('.c-table__inner');
        const mouseMovedAmount  = (event.clientX - this.initialCursorPosition);
        const scrolledAmount    = this.indicatorInput.getBoundingClientRect().left - this.indicatorContainer.getBoundingClientRect().left;

        if(scrolledAmount <= 0 && !((scrolledAmount + mouseMovedAmount) > 0)) {
            this.indicatorInput.style.marginLeft    = "0px";            // Move scroll indicator
            this.initialCursorPosition              = event.clientX;    // Reset cursor position
            inner.scrollLeft                        = 0;                // Set scroll
        }
        else if(scrolledAmount >= scrollMax && !((scrolledAmount + mouseMovedAmount) <= scrollMax)) {
            this.indicatorInput.style.marginLeft = `${scrollMax}px`;
        }
        else {
            const amountOfOverflow  = this.tableTable.offsetWidth - inner.offsetWidth; // The amount of overflow the table has
            const indicatorPosition = parseInt(this.indicatorInput.style.marginLeft, 10)

            this.indicatorInput.style.marginLeft    = `${indicatorPosition + mouseMovedAmount}px`;  // Move scroll indicator
            this.initialCursorPosition              = event.clientX;                        // Reset cursor position
            inner.scrollLeft                        = amountOfOverflow * (scrolledAmount / scrollMax); // Set scroll
        }
    }
}