export default class Navbar{
    constructor() {
    
        this.dynamicNavBar = document.querySelector('.c-navbar[js-is-dynamic]');

        if(this.dynamicNavBar){
            this.pageID = this.dynamicNavBar.getAttribute('data-page-id');
            this.pageParentID = this.dynamicNavBar.getAttribute('data-page-parent-id');
            
            this.navbarExpandedGrid = this.dynamicNavBar.querySelector('.c-navbar__expanded_grid');
            this.navBarGridItems = this.navbarExpandedGrid.querySelectorAll('a');
            this.childItemsUrl = this.dynamicNavBar.getAttribute('js-child-items-url');
            this.navbarExpandedMain = this.dynamicNavBar.querySelector('.c-navbar__expanded_main');
            this.currentPageID = this.constructor.getPageID('currentPageID');
    
            this.setLinkEventHandlers();
    
            if(this.currentPageID) {
                this.cleanUpNavBarContent();
                this.populateNavBarContent();
                this.modifyPrevButton();
                this.setLinkEventHandlers();
            }
        }
        
    }

    static storePageID(id, type) {
        localStorage.setItem(type, id);
    }

    static getPageID(type) {
        return localStorage.getItem(type);
    }

    cleanUpNavBarContent() {
        this.navbarExpandedGrid.innerHTML = ' ';
    }

    getCurrentPageItems() {

        return fetch(`${this.childItemsUrl}?parentID=${this.currentPageID}`)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            return data;
        });
    }

    populateNavBarContent() {
        this.getCurrentPageItems().then((currentPageItems) => {
            
            currentPageItems.items.forEach((item) => {
                const anchorElement = this.constructor.createAnchorElement(item);

                this.navbarExpandedGrid.innerHTML += anchorElement;
                this.navbarExpandedMain.querySelector('h2').innerText = currentPageItems.title;
            });
        });
    
    }

    static createAnchorElement(item) {
        return `
            <a class="c-grid u-margin__y--4 c-grid__container__gap__col--0 c-grid__container__gap__row--0" href="${item.href}" pageid="${item.id}">
                
                <h2 class="c-typography c-navbar__title c-typography__variant--h2">
                    ${item.label}
                </h2>
        
                <p class="c-typography c-typography__variant--body">
                    ${item.preview ? item.preview : 'No Preview Available'}
                </p>
            </a>
        `;
        
    }

/*     modifyPrevButton() {
        
    } */

    setLinkEventHandlers() {
        this.navBarGridItems.forEach(item => {
            const currentPageID = item.getAttribute('pageid');
            
            item.addEventListener('click', (event) => {
                this.constructor.storePageID(currentPageID, 'currentPageID');

                if(this.currentPageID) {
                    this.storePageID(this.currentPageID, 'previousPageID');
                }
            });
        });


    }
}