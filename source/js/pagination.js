export default class Pagination {
    constructor(
        container
    ){
        this.container = container
        this.link = null
        let list = [...this.container.querySelectorAll(`[js-pagination-item]`)];

        //Targeting attributes
        this.indexLinks = 'js-pagination-index';
        this.paginationContainer = this.container.querySelector(`[js-pagination]`);
        this.listContainer = this.container.querySelector(`[js-pagination-container]`);
        this.prevBtn = 'js-pagination-prev';
        this.nextBtn = 'js-pagination-next';

        if (!this.paginationContainer) {
            return;
        }

        this.perPage = parseInt(this.paginationContainer.getAttribute('js-pagination-per-page'));
        this.maxPages = this.paginationContainer.getAttribute('js-pagination-max-pages');

        if (this.paginationContainer && this.paginationContainer.hasAttribute('js-pagination-randomize-order')) {
            list = list.sort(() => Math.random() - 0.5);
        }

        this.list = list;

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
        if (!this.link) {
            this.link = this.container.querySelector(`[${this.indexLinks}]`);
            this.link.classList.remove("c-pagination__item--is-active");
        }

        const body = this.container.querySelector(`[js-table-pagination--links]`);
        const navigation = this.container.querySelector('[js-pagination]');
        let pagesToShow = false;
        if (navigation?.hasAttribute('js-pagination-pages-to-show')) {
            pagesToShow = parseInt(navigation.getAttribute('js-pagination-pages-to-show'));
            pagesToShow = pagesToShow % 2 === 0 ? pagesToShow : pagesToShow + 1;
        }
        this.paginationContainer.classList.remove('u-display--none');
        body.innerHTML = "";

        const numPages = this.paginatePages();
        const currentPage = this.paginationCurrent();

        if (numPages > 1) {
            let start = Math.max(currentPage - Math.floor(pagesToShow ? (pagesToShow / 2) : 100), 1);
            let end = Math.min(currentPage + Math.floor(pagesToShow ? (pagesToShow / 2) : 100), numPages);

            if (start === 1) {
                end = Math.min(numPages, start + (pagesToShow ? pagesToShow : 100));
            } else if (end === numPages) {
                start = Math.max(1, end - (pagesToShow ? pagesToShow : 100));
            }

            for (let index = start; index <= end; index++) {
                const elm = this.link.cloneNode(true);
                elm.setAttribute(this.indexLinks, index);
                elm.querySelector('.c-button__label-text').innerHTML = index;

                elm.querySelector('.c-button').classList.remove('c-button__filled--primary');
                elm.querySelector('.c-button').classList.add('c-button__filled--default');

                if (index === currentPage) {
                    elm.querySelector('.c-button').classList.add('c-button__filled--primary');
                    elm.querySelector('.c-button').classList.remove('c-button__filled--default');
                }

                body.appendChild(elm);
            }
        } else {
            this.paginationContainer.classList.add('u-display--none');
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
                this.scrollToTop();
            })
        });
    }

    scrollToTop() {
        let element = this.listContainer.querySelector('[js-pagination-item]:first-child');
        if (!element) { return };
        let offset = document.querySelector('.c-header--sticky') ? 100 : 0;
        let elementPosition = element.getBoundingClientRect().top;
        let offsetPosition = elementPosition + window.pageYOffset - offset;
        window.scrollTo({
            top: offsetPosition,
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
                this.scrollToTop();
            }

            this.tableRefresh();
        })

        this.container.querySelector(`[${this.prevBtn}]`).addEventListener('click', (e) => {
            e.preventDefault();
            this.paginateSetCurrent(this.paginationCurrent() -1);
            this.tableRefresh();
            this.scrollToTop();
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

export function initializePagination() {
    const paginations = [...document.querySelectorAll('[js-pagination-target]')];

    paginations.forEach((pagination) => {
        new Pagination(pagination);
    });
}