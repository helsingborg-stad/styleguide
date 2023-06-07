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
    attributes!: PaginationAttributes;
    static instances: Map<string, Pagination> = new Map();

    constructor(container: HTMLElement, index: number) {
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

        this.attributes = this.getAttributes();

        if (this.attributes.randomize) {
            this.list = this.list.sort(() => Math.random() - 0.5);
        }

        if (this.list) {
            this.list.forEach((item, index) => {
                const pageNumber = Math.floor(index / this.attributes.perPage) + 1;
                item.setAttribute('js-pagination-page', pageNumber.toString());
            });
        }

        this.container.setAttribute('js-table-pagination--current', '1');

        this.tableRefresh();
        this.paginationButtons();

        const instanceId = `pagination-${index}`;
        this.container.dataset.paginationInstance = instanceId;
        Pagination.instances.set(instanceId, this);
    }

    static getInstance(instanceId: string): Pagination | undefined {
        return Pagination.instances.get(instanceId);
    }

    private getAttributes() {
        const perPage = this.paginationContainer?.getAttribute('js-pagination-per-page');
        const maxPages = this.paginationContainer?.getAttribute('js-pagination-max-pages');
        const randomize = this.paginationContainer?.hasAttribute('js-pagination-randomize-order');
        const keepDOM = this.paginationContainer?.hasAttribute('js-pagination-keep-dom');

        return {
            'perPage': perPage ? parseInt(perPage) : 10,
            'maxPages': maxPages ? parseInt(maxPages) : 0,
            'randomize': randomize,
            'keepDOM': keepDOM,
        }
    }

    private tableRefresh() {
        let list = this.paginateList(this.list);

        this.renderTable(list);
        this.paginatePages();
        this.paginationLinks();
        this.paginateLinkListeners();
    }

    private renderTable(list: Element[] | null = null) {
        const body = this.listContainer;
        if (!body || !list) return;
        if (this.attributes.keepDOM) {
            Array.from(body.children).forEach(element => {
                (element as HTMLElement).classList.add('u-display--none');
            });

            list.forEach(element => {
                (element as HTMLElement).classList.remove('u-display--none'); // Show the element
                body.appendChild(element);
            });
        } else {
            body.innerHTML = "";
    
            list?.forEach(element => {
                body.appendChild(element);
            });
        }
    }

    private paginatePages(): number {
        const numberOfPages = Math.ceil(this.list.length / this.attributes.perPage);

        if (this.attributes.maxPages && (numberOfPages > this.attributes.maxPages)) {
            return this.attributes.maxPages;
        }

        return numberOfPages;
    }

    private paginationLinks() {
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

    private paginateLinkListeners() {
        const btns = [...this.container.querySelectorAll(`[${this.indexLinks}]`)];

        btns.forEach((btn) => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                let next = (e.target as HTMLElement)?.closest(`[${this.indexLinks}]`)!.getAttribute(this.indexLinks);
                next && this.paginateSetCurrent(parseInt(next));
                this.tableRefresh();
                this.scrollToTop();
                this.setFocus();
            });
        });
    }

    private scrollToTop() {
        let offset = document.querySelector('.c-header--sticky') ? 100 : 0;
        let elementPosition = this.listContainer?.getBoundingClientRect().top ?? 0;
        let offsetPosition = elementPosition + window.pageYOffset - offset;
        window.scrollTo({
            top: offsetPosition,
        });
    }

    setFocus() {
        let element = this.listContainer?.querySelector('[js-pagination-item]:first-child') as HTMLElement;
        if (!element) return;
        element.focus();
    }

    private paginateList(list: Element[]): Element[] {
        const first = (this.paginationCurrent() - 1) * this.attributes.perPage;
        const last = this.paginationCurrent() * this.attributes.perPage;

        return Array.from(list).slice(first, last);
    }

    private paginationButtons() {
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

    private paginateSetCurrent(current: number = 1) {
        this.container.setAttribute('js-table-pagination--current', current.toString());
        this.container.querySelector(`[${this.nextBtn}]`)?.removeAttribute('disabled');
        this.container.querySelector(`[${this.prevBtn}]`)?.removeAttribute('disabled');

        if (current === this.paginatePages()) {
            this.container.querySelector(`[${this.nextBtn}]`)?.setAttribute('disabled', 'true');

        } else if (current === 1) {
            this.container.querySelector(`[${this.prevBtn}]`)?.setAttribute('disabled', 'true');

        }
    }

    private paginationCurrent(): number {
        return parseInt(this.container.getAttribute('js-table-pagination--current') ?? '0', 10);
    }
}

export function initializePagination() {
    const paginations = [...document.querySelectorAll('[js-pagination-target]')];

    paginations.forEach((pagination, index) => {
        new Pagination(pagination as HTMLElement, index + 1);
    });
}

interface PaginationAttributes {
    perPage: number;
    maxPages: number;
    randomize?: boolean;
    keepDOM?: boolean;
}
