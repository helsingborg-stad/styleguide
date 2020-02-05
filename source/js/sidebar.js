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

        sb.querySelectorAll(`[${this.ACTIVE}="true"]`).forEach((item) => {
            if (item.closest('.c-sidebar__subcontainer')) {
                item.closest('.c-sidebar__subcontainer').classList.add(this.EXPAND);
                const id = item.closest('.c-sidebar__subcontainer').getAttribute('js-toggle-item')
                sb.querySelector(`[js-toggle-trigger="${id}"]`).setAttribute('aria-pressed', true)
            }
        })

        this.addTriggers(sb);
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