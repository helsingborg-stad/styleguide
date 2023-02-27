class Nav {
    constructor() {

        const targetItemSelector = '.c-nav__item.has-children.has-toggle'; 

        const menus = [...document.querySelectorAll(
            '.c-nav.c-nav--horizontal'
        )];

        menus.forEach(menu => {

            let items = [...menu.querySelectorAll(
                [targetItemSelector, '> .c-nav__item-wrapper'].join(' ')
            )];

            items.forEach(item => {
                item.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    this.toggleChildren(
                        item.closest(targetItemSelector)
                    );
                });
            });
        });
    }

    toggleChildren(toggle) {
        if(!toggle.classList.contains('is-active')) {
            this.openChildren(toggle); 
            return true;
        }
        this.closeChildren(toggle);
        return false;
    }

    openChildren(toggle) {
        toggle.classList.add('is-active');
        toggle.querySelector('.c-nav__toggle').setAttribute(
            'aria-pressed',
            true
        )
    }

    closeChildren(toggle) {
        toggle.classList.remove('is-active');
        toggle.querySelector('.c-nav__toggle').setAttribute(
            'aria-pressed',
            false
        )
    }
}

export default Nav;