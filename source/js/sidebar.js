export default class Sidebar {
    constructor() {
        this.ATTR = 'js-sidebar';
        this.ACTIVE = 'item-active';
        this.TRIGGER = 'js-sidebar-trigger';
        this.TOGGLE_ITEM = 'js-toggle-item';
        this.TOGGLE_TRIGGER = 'js-toggle-trigger';
        this.EXPAND = 'c-sidebar__item--is-expanded';
        this.SUBCONTAINER = 'c-sidebar__subcontainer';
        this.ITEM = 'c-sidebar__item';
        this.TOGGLE = 'c-sidebar__toggle';
        this.COLLAPSED = '.c-sidebar--collapsed';
    }

    /**
     * Finds all sidebars and applies appropriate classes and attributes on load
     * @return {void}
     */
    applySidebar() {
        const sb = document.querySelector(`[${this.ATTR}]`);

        if (sb) {
            const activeItems = sb.querySelectorAll(`[${this.ACTIVE}="true"]`);

            if (activeItems.length > 0) {
                activeItems.forEach(item => {
                    if (item.closest(`.${this.SUBCONTAINER}`)) {
                        item.closest(`.${this.SUBCONTAINER}`).classList.add(this.EXPAND);
                        const id = item
                            .closest(`.${this.SUBCONTAINER}`)
                            .getAttribute(this.TOGGLE_ITEM);
                        sb.querySelector(`[${this.TOGGLE_TRIGGER}="${id}"]`).setAttribute(
                            'aria-pressed',
                            true
                        );
                    }
                    this.expandCurrentItem(item);
                });
            }

            this.addTriggers(sb);
        }
    }

    /**
     * Expand current item
     * @param {Object} item The current item to expand
     */
    expandCurrentItem(item) {
        const parent = item.closest(`.${this.ITEM}`);
        parent.querySelector(`.${this.SUBCONTAINER}`).classList.add(this.EXPAND);
        parent.querySelector(`.${this.TOGGLE}`).setAttribute('aria-pressed', true);
    }

    /**
     * Adds listeners to buttons
     * @param {Object} sb The sidebar
     */
    addTriggers(sb) {
        const sbTriggers = document.querySelectorAll(`[${this.TRIGGER}]`);

        sbTriggers.forEach(btn => {
            btn.addEventListener('click', e => {
                sb.classList.toggle(`.${this.COLLAPSED}`);
            });
        });
    }
}
