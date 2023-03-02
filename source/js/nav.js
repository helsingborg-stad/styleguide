class Nav {
    constructor() {

        const targetMenuSelector    = '.c-nav.c-nav--depth-1'; 
        const targetItemSelector    = '.c-nav__item.has-children.has-toggle'; 

        const menus = [...document.querySelectorAll(
            targetMenuSelector
        )];

        menus.forEach(menu => {

            let selectorArray = [
                targetItemSelector,
                '> .c-nav__item-wrapper'
            ]; 
            if(menu.classList.contains('c-nav--vertical')) {
                selectorArray.push('.c-nav__toggle'); 
            }

            let items = [...menu.querySelectorAll(selectorArray.join(' '))];

            items.forEach(item => {
                item.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    this.closeSiblings(item.closest(targetItemSelector));

                    this.toggleChildren(
                        item.closest(targetItemSelector)
                    );
                });
            });
        });
    }

    closeSiblings(clickItem) {
        let items = this.getSiblings(clickItem); 
        items.forEach(item => {
            item.classList.remove('is-active'); 
        });
        return true;
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

    getSiblings(elem) {
        var siblings = [];
        var sibling = elem.parentNode.firstChild;
        while (sibling) {
            if (sibling.nodeType === 1 && sibling !== elem) {
                siblings.push(sibling);
            }
            sibling = sibling.nextSibling
        }
        return siblings;
    }
}

export default Nav;