class Nav {
    constructor() {

        this.targetMenuSelector = '.c-nav.c-nav--depth-1'; 
        this.targetItemSelector = '.c-nav__item.has-children.has-toggle'; 

        const menus = [...document.querySelectorAll(
            this.targetMenuSelector
        )];

        menus.forEach(menu => {
            let selectorArray = [
                this.targetItemSelector,
                '> .c-nav__item-wrapper'
            ]; 
            if(menu.classList.contains('c-nav--vertical')) {
                selectorArray.push('.c-nav__toggle'); 
            }

            let items = [...menu.querySelectorAll(selectorArray.join(' '))];
            items.length > 0 && this.setListeners(items, menu);

            const observer = new MutationObserver((mutations) => {
                mutations.forEach(mutation => {
                    if (
                        mutation.type === 'childList' &&
                        mutation.addedNodes.length > 0 &&
                        mutation.target?.classList?.contains('c-nav__item')
                        ) {
                            
                        let newItems = [];
                        [...mutation.addedNodes].forEach(node => {
                            if (node.classList?.contains('c-nav') && !node.classList?.contains('preloader')) {
                                const buttons = [...node.querySelectorAll('.c-nav__toggle')];
                                buttons.forEach(button => {
                                    newItems.push(button);
                                });
                                this.setListeners(newItems, node);
                            }
                        });
                    }
                });
            });
            observer.observe(menu, { childList: true, subtree: true });
        });
    }

    setListeners(items, menu) {
        items.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (menu.classList.contains('c-nav--horizontal')) {
                    this.closeSiblings(item.closest(this.targetItemSelector));
                }

                this.toggleChildren(
                    item.closest(this.targetItemSelector)
                );
            });
        });
    }

    closeSiblings(clickItem) {
        let items = this.getSiblings(clickItem); 
        items.forEach(item => {
            item.classList.remove('is-open'); 
        });
        return true;
    }

    toggleChildren(toggle) {
        if(!toggle.classList.contains('is-open')) {
            this.openChildren(toggle); 
            return true;
        }
        this.closeChildren(toggle);
        return false;
    }

    openChildren(toggle) {
        toggle.classList.add('is-open');
        toggle.querySelector('.c-nav__toggle').setAttribute(
            'aria-pressed',
            true
        )
    }

    closeChildren(toggle) {
        toggle.classList.remove('is-open');
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

export function initializeMenus() {

}

export default Nav;