class Nav {
    constructor() {
        this.setListeners();
    }

    setListeners() {
        const menu = document.querySelector('#main-menu');
        const mainItems = menu.querySelectorAll('.c-nav--depth-0 > .c-nav__item');

        menu && this.clickListeners(menu, mainItems);
    }

    clickListeners(menu, mainItems) {
        const menuItems = menu.querySelectorAll('.c-nav__item');

        document.addEventListener('click', (e) => {
            e.stopPropagation();
            this.handleClickVisible(e.target, menuItems);
        });

        menuItems.forEach(menuItem => {
            if(menuItem.querySelector('.c-nav')) {
                menuItem.querySelector('a') && this.handleLinks(menuItem);
                menuItem.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (e.target.closest('li').querySelector('ul')) {
                        e.preventDefault();
                    }
                    this.handleClickVisible(menuItem, mainItems);
                })
            }
        });
    }

    handleClickVisible(menuItem, mainItems) {
        mainItems.forEach(item => {
            if(!item.contains(menuItem)) {
            item.classList.remove('is-active');
                item.querySelectorAll('.c-nav__item').forEach(childItem => {
                    childItem.classList.remove('is-active');
                })
            }
        })
        if (menuItem.classList.contains('is-active')) {
            menuItem.classList.remove('is-active');
        } else {
            menuItem.classList.add('is-active');
        }
    }

    handleLinks(menuItem) {
        const link = menuItem.querySelector('a');
        if(link.querySelector('template')) {
            let temp = link.querySelector('template');
            let clone = temp.content.cloneNode(true);
            link.appendChild(clone);
        }
    }
}

export default Nav;