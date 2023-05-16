class Nav {
    private targetMenuSelector: string;
    private targetItemSelector: string;

    constructor() {
        this.targetMenuSelector = '.c-nav.c-nav--depth-1';
        this.targetItemSelector = '.c-nav__item.has-children.has-toggle';

        const menus = [...document.querySelectorAll(
            this.targetMenuSelector
        )] as HTMLElement[];

        menus.forEach((menu) => {
            let selectorArray: string[] = [
                this.targetItemSelector,
                '> .c-nav__item-wrapper',
            ];
            if (menu.classList.contains('c-nav--vertical')) {
                selectorArray.push('.c-nav__toggle');
            }

            const items = [...menu.querySelectorAll(selectorArray.join(' '))] as HTMLElement[];
            if (items.length > 0) {
                this.setListeners(items, menu);
            }

            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (
                        mutation.type === 'childList' &&
                        mutation.addedNodes.length > 0 &&
                        (mutation.target as HTMLElement)?.classList?.contains('c-nav__item')
                    ) {
                        const newItems: HTMLElement[] = [];
                        [...mutation.addedNodes].forEach((node) => {
                            if (
                                node.nodeType === Node.ELEMENT_NODE &&
                                (node as HTMLElement).classList?.contains('c-nav') &&
                                !(node as HTMLElement).classList?.contains('preloader')
                            ) {
                                const buttons = [...(node as HTMLElement).querySelectorAll('.c-nav__toggle')] as HTMLElement[];
                                buttons.forEach((button) => {
                                    newItems.push(button);
                                });
                                this.setListeners(newItems, node as HTMLElement);
                            }
                        });
                    }
                });
            });
            observer.observe(menu, { childList: true, subtree: true });
        });
    }

    private setListeners(items: HTMLElement[], menu: HTMLElement) {
        items.forEach((item) => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (menu.classList.contains('c-nav--horizontal')) {
                    this.closeSiblings(item.closest(this.targetItemSelector) as HTMLElement);
                }

                this.toggleChildren(item.closest(this.targetItemSelector) as HTMLElement);
            });
        });
    }

    private closeSiblings(clickItem: HTMLElement) {
        const items = this.getSiblings(clickItem);
        items.forEach((item) => {
            item.classList.remove('is-open');
        });
        return true;
    }

    private toggleChildren(toggle: HTMLElement) {
        if (!toggle.classList.contains('is-open')) {
            this.openChildren(toggle);
            return true;
        }
        this.closeChildren(toggle);
        return false;
    }

    private openChildren(toggle: HTMLElement) {
        toggle.classList.add('is-open');
        toggle
            .querySelector('.c-nav__toggle')
            ?.setAttribute('aria-pressed', 'true');
    }

    private closeChildren(toggle: HTMLElement) {
        toggle.classList.remove('is-open');
        toggle
            .querySelector('.c-nav__toggle')
            ?.setAttribute('aria-pressed', 'false');
    }

    private getSiblings(elem: HTMLElement) {
        const siblings: HTMLElement[] = [];
        let sibling = elem.parentNode?.firstChild;
        while (sibling) {
            if (sibling.nodeType === Node.ELEMENT_NODE && sibling !== elem) {
                siblings.push(sibling as HTMLElement);
            }
            sibling = sibling.nextSibling;


        }
        return siblings;
    }
}

export function initializeMenus() {
    // Your initialization logic here
}

export default Nav;
