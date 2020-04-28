export default class Navbar{
    constructor() {
        
        this.navbars = document.querySelectorAll('.c-navbar');

        this.navbars.forEach((navbar) => {
            this.navbarList = navbar.querySelector('.c-navbar__list');

            if(this.constructor.isOverFlowing(navbar)) {
                this.constructor.switchToMobileMenu(navbar);
            }
            
            this.dynamicNavBar = navbar.getAttribute('[js-is-dynamic]');
    
            if(this.dynamicNavBar){
                this.pageID = this.dynamicNavBar.getAttribute('data-page-id');
                this.pageParentID = this.dynamicNavBar.getAttribute('data-page-parent-id');
            
                this.navbarExpandedGrid = this.dynamicNavBar.querySelector('.c-navbar__expanded_grid');
                this.navBarGridItems = this.navbarExpandedGrid.querySelectorAll('a');
                this.navbarExpandedMain = this.dynamicNavBar.querySelector('.c-navbar__expanded_main');
                this.childItemsUrl = this.dynamicNavBar.getAttribute('js-child-items-url');
        
                this.cleanUpNavBarContent();
                this.populateNavBarContent();
                this.setupPrevButton();
            }
        });
        
    }

    static switchToMobileMenu(navbar){
        const navbarToggle = navbar.querySelector('.c-navbar__toggle');
        const navbarList = navbar.querySelector('.c-navbar__list');
        const sidebar = document.querySelector('.c-sidebar');
        console.log(sidebar);
        // sidebar.classList.remove("c-sidebar--collapsed");

        console.log('OVERFLOW')
        navbarToggle.style.display = 'block';
        navbarList.style.display = 'none';
    }

    static isOverFlowing(navbarList) {
        return navbarList.clientWidth < navbarList.scrollWidth;
    }

    cleanUpNavBarContent() {
        this.navbarExpandedGrid.innerHTML = ' ';
    }

    getPageData(id) {

        return fetch(`${this.childItemsUrl}?pageID=${id}`)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            return data;
        });
    }

    populateNavBarContent() {
        this.getPageData(this.pageID).then((currentPageItems) => {
            
            currentPageItems.items.forEach((item) => {
                const anchorElement = this.constructor.createAnchorElement(item);

                this.navbarExpandedGrid.innerHTML += anchorElement;
                this.navbarExpandedMain.querySelector('h2').innerText = currentPageItems.title;
            });
        });
    
    }

    setupPrevButton() {
        this.getPageData(this.pageParentID).then((previousPage) => {
            const previousButton = this.navbarExpandedMain.querySelector('a');

            previousButton.href = previousPage.href;
            previousButton.querySelector('.c-button__label-text--reverse').innerText = previousPage.title;
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
}