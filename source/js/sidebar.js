export default class Sidebar {
    constructor() {
        this.ATTR = "js-sidebar";
        this.EXPAND = "c-sidebar__item--is-expanded";
        this.EXPANDABLE = "c-sidebar__subcontainer";
        this.ACTIVE = "item-active";
        this.TRIGGER = "js-sidebar-trigger";
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
                activeItems.forEach((item) => {
                    if (item.closest('.c-sidebar__subcontainer')) {
                        this.expandItem(item.closest('.c-sidebar__subcontainer'), sb);
                    }
                })
            }
            
            this.addTriggers(sb);
        }
    }

    /**
     * Expands items
     * @param {Object} item The sidebar item
     * @param {Object} sb The sidebar
     */
    expandItem(item, sb) {
        const subcontainer = item.closest('.c-sidebar__subcontainer');
        subcontainer.classList.add(this.EXPAND);
        const id = subcontainer.getAttribute('js-toggle-item');
        sb.querySelector(`[js-toggle-trigger="${id}"]`).setAttribute('aria-pressed', true);

        if (subcontainer.closest('.c-sidebar__item').closest('.c-sidebar__subcontainer')) {
            this.expandItem(subcontainer.closest('.c-sidebar__item').closest('.c-sidebar__subcontainer'), sb);
        }
    }

    /**
     * Adds listeners to buttons
     * @param {Object} sb The sidebar
     */
    addTriggers(sb) {
        const sbTriggers = document.querySelectorAll(`[${this.TRIGGER}]`);

        sbTriggers.forEach(btn => {
            btn.addEventListener('click', (e) => {
                sb.classList.toggle('c-sidebar--collapsed');
            })
        });
    }
}