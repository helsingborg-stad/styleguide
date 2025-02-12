class MegaMenu {
    private isOpen = false;

    constructor(private megaMenu: Element, private triggers: NodeListOf<Element>) {
        this.setupListeners();
    }

    /**
     * Sets up event listeners for the mega menu.
     */
    private setupListeners() {
        this.triggers.forEach(trigger => {
            trigger.addEventListener('click', () => {
                this.triggerClickHandler(trigger);
            });
        });

        document.addEventListener('click', (e) => {
            this.handleClickOutside(e as PointerEvent);
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.close();
            }
        });
    }

    /**
     * Handles the click event on the trigger element.
     * Toggles the visibility of the mega menu and updates the aria-hidden attribute accordingly.
     * Also updates the state of the triggers based on the visibility of the mega menu.
     * 
     * @param trigger - The trigger element that was clicked.
     */
    private triggerClickHandler(trigger: Element) {
        this.megaMenu.classList.toggle('u-display--none');
        this.isOpen = this.megaMenu.classList.contains('u-display--none') ? false : true;

        this.megaMenu.setAttribute('aria-hidden', this.isOpen.toString());

        this.changeTriggersStates();
    }

    /**
     * Changes the states of the triggers based on the specified isOpen value.
     */
    private changeTriggersStates() {
        this.triggers.forEach(trigger => {
            trigger.setAttribute('aria-pressed', this.isOpen.toString());
        });
    }

    /**
     * Handles the click event outside of the mega menu.
     * If the click is not inside the menu or on any of the triggers, it closes the menu.
     * @param event - The pointer event object.
     */
    private handleClickOutside(event: PointerEvent) {
        if (!this.isOpen) return;
        const target = event.target as Element;

        const isClickInsideMenu = this.megaMenu.contains(target);
        const isClickOnTrigger = Array.from(this.triggers).some(trigger => trigger.contains(target));

        if (!isClickInsideMenu && !isClickOnTrigger) {
            this.close();
        }
    }

    /**
     * Closes the mega menu.
     * 
     * This method adds the 'u-display--none' class to the mega menu element, sets the 'aria-hidden' attribute to 'true',
     * and changes the triggers' states to false.
     */
    private close() {
        if (!this.isOpen) return;
        this.isOpen = false;
        this.megaMenu.classList.add('u-display--none');
        this.megaMenu.setAttribute('aria-hidden', 'true');
        this.changeTriggersStates();
    }
}

export function initializeMegaMenus() {
    document.querySelectorAll('.c-megamenu').forEach(megaMenu => {
        const id = megaMenu.id;
        const triggers = document.querySelectorAll(`[data-js-mega-menu-trigger="${id}"]`);

        if (triggers.length <= 0) {
            return;
        }

        new MegaMenu(megaMenu, triggers);
    });
}