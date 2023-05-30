export default class Pagination {
    container: HTMLElement;
    link: HTMLElement | null;
    indexLinks: string;
    paginationContainer: HTMLElement | null;
    listContainer: HTMLElement | null;
    prevBtn: string;
    nextBtn: string;
    perPage: number = 10;
    maxPages: number = 0;
    list: Element[] | [];

    constructor(container: HTMLElement) {
        this.container = container;
        this.link = null;
        this.list = [...this.container.querySelectorAll(`[js-pagination-item]`)];

        //Targeting attributes
        this.indexLinks = 'js-pagination-index';
        this.paginationContainer = this.container.querySelector(`[js-pagination]`);
        this.listContainer = this.container.querySelector(`[js-pagination-container]`);
        this.prevBtn = 'js-pagination-prev';
        this.nextBtn = 'js-pagination-next';

        if (!this.paginationContainer) {
            return;
        }

        let attributes = this.getAttributes();

        this.perPage = attributes.perPage;
        this.maxPages = attributes.maxPages;

        if (attributes.randomize) {
            this.list = this.list.sort(() => Math.random() - 0.5);
        }

        this.container.setAttribute('js-table-pagination--current', '1');

        this.tableRefresh();
        this.paginationButtons();
    }

    getAttributes() {
        let perPage = this.paginationContainer?.getAttribute('js-pagination-per-page');
        let maxPages = this.paginationContainer?.getAttribute('js-pagination-max-pages');
        let randomize = this.paginationContainer?.hasAttribute('js-pagination-randomize-order');

        return {
            'perPage': perPage ? parseInt(perPage) : 10,
            'maxPages': maxPages ? parseInt(maxPages) : 0,
            'randomize': randomize,
        }
        
    }

    tableRefresh() {
        let list = this.paginateList(this.list);

        this.renderTable(list);
        this.paginatePages();
        this.paginationLinks();
        this.paginateLinkListeners();
    }

    renderTable(list: Element[] | null = null) {
        const body = this.listContainer;
        if (!body) return;
        body.innerHTML = "";

        list?.forEach(element => {
            body.appendChild(element);
        });
    }

    paginatePages(): number {
        const numberOfPages = Math.ceil(this.list.length / this.perPage);

        if (this.maxPages && (numberOfPages > this.maxPages)) {
            return this.maxPages;
        }

        return numberOfPages;
    }

    paginationLinks() {
        if (!this.link) {
            this.link = this.container.querySelector(`[${this.indexLinks}]`);
            this.link?.classList.remove("c-pagination__item--is-active");
        }

        const body = this.container.querySelector(`[js-table-pagination--links]`);
        const navigation = this.container.querySelector('[js-pagination]');
        let pagesToShow = 0;
        if (navigation?.hasAttribute('js-pagination-pages-to-show')) {
            pagesToShow = parseInt(navigation.getAttribute('js-pagination-pages-to-show') ?? '0', 10);
            pagesToShow = pagesToShow % 2 === 0 ? pagesToShow : pagesToShow + 1;
        }
        this.paginationContainer?.classList.remove('u-display--none');
        if (!body) return;
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
                const elm = this.link?.cloneNode(true) as HTMLElement;
                elm.setAttribute(this.indexLinks, index.toString());
                elm.querySelector('.c-button__label-text')!.innerHTML = index.toString();

                elm.querySelector('.c-button')!.classList.remove('c-button__filled--primary');
                elm.querySelector('.c-button')!.classList.add('c-button__filled--default');

                if (index === currentPage) {
                    elm.querySelector('.c-button')!.classList.add('c-button__filled--primary');
                    elm.querySelector('.c-button')!.classList.remove('c-button__filled--default');
                }

                body.appendChild(elm);
            }
        } else {
            this.paginationContainer?.classList.add('u-display--none');
        }
    }

    paginateLinkListeners() {
        const btns = [...this.container.querySelectorAll(`[${this.indexLinks}]`)];

        btns.forEach((btn) => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                let next = (e.target as HTMLElement)?.closest(`[${this.indexLinks}]`)!.getAttribute(this.indexLinks);
                next && this.paginateSetCurrent(parseInt(next));
                this.tableRefresh();
                this.scrollToTop();
            });
        });
    }

    scrollToTop() {
        let element = this.listContainer?.querySelector('[js-pagination-item]:first-child');
        if (!element) return;
        let offset = document.querySelector('.c-header--sticky') ? 100 : 0;
        let elementPosition = element.getBoundingClientRect().top;
        let offsetPosition = elementPosition + window.pageYOffset - offset;
        window.scrollTo({
            top: offsetPosition,
        });
    }

    paginateList(list: Element[]): Element[] {
        const first = (this.paginationCurrent() - 1) * this.perPage;
        const last = this.paginationCurrent() * this.perPage;

        return Array.from(list).slice(first, last);
    }

    paginationButtons() {
        this.paginateSetCurrent();

        this.container.querySelector(`[${this.nextBtn}]`)?.addEventListener('click', (e) => {
            e.preventDefault();

            if ((this.paginationCurrent()) != this.paginatePages()) {
                this.paginateSetCurrent(this.paginationCurrent() + 1);
                this.scrollToTop();
            }

            this.tableRefresh();
        });

        this.container.querySelector(`[${this.prevBtn}]`)?.addEventListener('click', (e) => {
            e.preventDefault();
            this.paginateSetCurrent(this.paginationCurrent() - 1);
            this.tableRefresh();
            this.scrollToTop();
        });
    }

    paginateSetCurrent(current: number = 1) {
        this.container.setAttribute('js-table-pagination--current', current.toString());
        this.container.querySelector(`[${this.nextBtn}]`)?.removeAttribute('disabled');
        this.container.querySelector(`[${this.prevBtn}]`)?.removeAttribute('disabled');

        if (current === this.paginatePages()) {
            this.container.querySelector(`[${this.nextBtn}]`)?.setAttribute('disabled', 'true');

        } else if (current === 1) {
            this.container.querySelector(`[${this.prevBtn}]`)?.setAttribute('disabled', 'true');

        }
    }

    paginationCurrent(): number {
        return parseInt(this.container.getAttribute('js-table-pagination--current') ?? '0', 10);
    }
}

export function initializePagination() {
    const paginations = [...document.querySelectorAll('[js-pagination-target]')];

    paginations.forEach((pagination) => {
        new Pagination(pagination as HTMLElement);
    });
}
