require("regenerator-runtime");

export default class Sidebar {
    constructor() {
        this.ATTR = "js-sidebar";
        this.EXPAND = "c-sidebar__item--is-expanded";
        this.EXPANDABLE = "c-sidebar__subcontainer";
        this.ACTIVE = "item-active";
        this.TRIGGER = "js-sidebar-trigger";
        this.SUBCONTAINER = "c-sidebar__subcontainer";
        this.TOGGLE = "c-sidebar__toggle";
        this.TOGGLE_TRIGGER = "js-toggle-trigger";
        this.TOGGLE_ITEM = "js-toggle-item";
        this.ITEM = "c-sidebar__item";
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
                    this.expandItem(item, sb);
                });
            }
            
            this.addTriggers(sb);
          
        }
    }

    /**
     * Adds listeners to buttons
     * @param {Object} sb The sidebar
    */
   addTriggers(sb) {
        const sbTriggers = document.querySelectorAll(`[${this.TRIGGER}]`);

        sbTriggers.forEach(btn => {
            btn.addEventListener('click', e => {
                sb.classList.toggle(`${this.COLLAPSED}`);
            });
        });
    }

    /**
     * Expand current item
     * @param {Object} item The current item to expand
     */
    expandItem(item, sb) {
        if (item.closest(`.${this.SUBCONTAINER}`)) {
            const id = this.getToggleId(item)
                
            const toggle = sb.querySelector(`[${this.TOGGLE_TRIGGER}="${id}"]`)

            toggle.setAttribute('aria-pressed', true);

            this.addExpandClass(item);
            this.expandItem(toggle, sb)
        }
    }
}