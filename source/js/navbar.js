export default class Navbar{
    constructor() {
        this.navbarExpandedGrid = document.querySelector('.c-navbar__expanded_main[js-is-multidimensional="1"] > .c-navbar__expanded_grid');
    }

    

   static storeCurrentPageID(id) {
        localStorage.setItem('currentPageID', id);
    }

    static getCurrentPageID() {
        localStorage.getItem('currentPageID');
    }

    cleanUpNavBarContent() {
        this.navbarExpandedGrid.innerHTML = ' ';
    }

    setLinkEventHandlers() {
        const navBarGridItems = this.navbarExpandedGrid.querySelectorAll('a');
        
        navBarGridItems.forEach(item => {
            const currentPageID = item.getAttribute('pageid');
            
            item.addEventListener('click', (event) => {
                this.constructor.storeCurrentPageID(currentPageID);
            });
        });
    }

    setNavBarContent() {
        const navBarContent = this.navBarContent.innerHTML;
        const currentPageID = this.getCurrentPageID();

        /* if(navBarContent) */
    }


}