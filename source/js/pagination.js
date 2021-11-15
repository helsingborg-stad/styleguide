export default class Pagination {
    constructor(
        container
    ){
        this.container = container
        this.link = null
        this.list = this.container.querySelectorAll(`[js-pagination-item]`);

        //Targeting attributes
        this.indexLinks = 'js-pagination-index';
        this.paginationContainer = this.container.querySelector(`[js-pagination]`);
        this.listContainer = this.container.querySelector(`[js-pagination-container]`);
        this.prevBtn = 'js-pagination-prev'
        this.nextBtn = 'js-pagination-next'

        if (!this.paginationContainer) {
            return;
        }

        this.perPage = parseInt(this.paginationContainer.getAttribute('js-pagination-per-page'))
        this.maxPages = this.paginationContainer.getAttribute('js-pagination-max-pages')

        this.container.setAttribute('js-table-pagination--current', 1);

        this.tableRefresh();
        this.paginationButtons()
    }

    tableRefresh() {
        // eslint-disable-next-line prefer-destructuring
        let list = this.paginateList(this.list)

        this.renderTable(list);
        this.paginatePages();
        this.paginationLinks();
        this.paginateLinkListeners();
    }

    renderTable(list = null) {
        const body = this.listContainer;
        body.innerHTML = "";

        list.forEach(element => {
            body.appendChild(element)
        });
    }

    paginatePages() {
        const numberOfPages = Math.ceil(this.list.length / this.perPage);

        if(this.maxPages && (numberOfPages > this.maxPages)) {
            return this.maxPages;
        }

        return numberOfPages;
    }

    paginationLinks() {
        if(!this.link) {
            this.link = this.container.querySelector(`[${this.indexLinks}]`);
            this.link.classList.remove("c-pagination__item--is-active");
        }
        
        const body = this.container.querySelector(`[js-table-pagination--links]`);
        this.paginationContainer.classList.remove('u-display--none')
        body.innerHTML = "";

        if(this.paginatePages() > 1) {
            // eslint-disable-next-line no-plusplus
            for (let index = 0; index < this.paginatePages(); index++) {
                const elm = this.link.cloneNode(true);
                // elm.innerHTML = index +1;
                elm.classList.remove('c-button__filled--primary');
                elm.setAttribute(this.indexLinks, index +1);
                elm.querySelector('.c-pagination__label').innerHTML = index +1;

                if((index +1) === this.paginationCurrent() ){
                    elm.classList.add('c-button__filled--primary');
                }

                body.appendChild(elm);
            }
        } else {
            this.paginationContainer.classList.add('u-display--none')
        }
    }

    paginateLinkListeners() {
        const btns = this.container.querySelectorAll(`[${this.indexLinks}]`)

        btns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                let next = e.target.closest(`[${this.indexLinks}]`).getAttribute(this.indexLinks);
                this.paginateSetCurrent(next);
                this.tableRefresh();
            })
        });
    }

    // eslint-disable-next-line class-methods-use-this
    paginateList(list) {
        const first = (this.paginationCurrent() - 1) * this.perPage;
        const last = this.paginationCurrent() * this.perPage;

        return Array.from(list).slice(first, last);
    }

    paginationButtons() {
        this.paginateSetCurrent();

        this.container.querySelector(`[${this.nextBtn}]`).addEventListener('click', (e) => {
            e.preventDefault();

            if ((this.paginationCurrent()) != this.paginatePages()) {
                this.paginateSetCurrent(this.paginationCurrent() +1);
            }

            this.tableRefresh();
        })

        this.container.querySelector(`[${this.prevBtn}]`).addEventListener('click', (e) => {
            e.preventDefault();
            this.paginateSetCurrent(this.paginationCurrent() -1);
            this.tableRefresh();
        })
    }

    paginateSetCurrent(current = 1) {
        current = parseInt(current)
        this.container.setAttribute('js-table-pagination--current', current);
        this.container.querySelector(`[${this.nextBtn}]`).removeAttribute('disabled');
        this.container.querySelector(`[${this.prevBtn}]`).removeAttribute('disabled');

        if (current === this.paginatePages()) {
            this.container.querySelector(`[${this.nextBtn}]`).setAttribute('disabled', true);

        } else if (current === 1) {
            this.container.querySelector(`[${this.prevBtn}]`).setAttribute('disabled', true);

        }
    }

    paginationCurrent() {
        return parseInt(this.container.getAttribute('js-table-pagination--current'), 10)
    }
}