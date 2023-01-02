class Nav {
    constructor() {
        this.setListeners();
    }

    setListeners() {
        const menu = document.querySelector('#main-menu');
        let menuItems = menu.querySelectorAll('.c-nav--depth-0 > li');
        menuItems.forEach(menuItem => {
            const hasChildren = menuItem.querySelectorAll('.c-nav__item');

            if (hasChildren.length <= 0) {
                return;
            }

            menuItem.addEventListener('focusout', (e) => {
                if (!e.relatedTarget || !e.relatedTarget.classList.contains('c-nav__link')) {
                    this.handleVisible(false, menuItems);
                }
            })
            menuItem.addEventListener('focusin', (e) => {
                if(!e.relatedTarget) {
                    return;
                } 
                this.handleVisible(menuItem, menuItems);
            })

        });
    }

    handleVisible(menuItem, menuItems) {
        menuItems.forEach(item => {
            if (menuItem) {
                if (item === menuItem) {
                    item.classList.add('is-visible');
                } else {
                    item.classList.remove('is-visible');
                }
            } else {
                item.classList.remove('is-visible');
            }
        })
    }
}

export default Nav;