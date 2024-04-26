/**
 * Represents a drawer toggle button that controls the opening and closing of a drawer.
 */
class DrawerAccessibility {
    button: HTMLElement;
    closeButton: HTMLElement;
    firstMenuItem: HTMLElement|null;
    lastItem: HTMLElement;

    constructor(button: HTMLElement, drawer: HTMLElement) {
        this.button         = button;
        this.closeButton    = drawer.querySelector('.c-drawer__close') as HTMLElement;
        this.firstMenuItem  = this.getFirstMenuItem(drawer);
        this.lastItem       = this.getLastItem(drawer);

        (this.lastItem && this.closeButton) && this.setupAccessibilityListeners();
    }

    /**
     * Focuses on the first menu item (or the close button if there are no menu items)
     * Loop the focus back to the close button when tabbing past the last item.
     * Sets the focus back on the "open" button when the close button is clicked.
     */
    private setupAccessibilityListeners() {
        this.button.addEventListener('click', () => {
            (this.firstMenuItem || this.closeButton).focus();
        });

        this.lastItem.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                e.preventDefault();
                this.closeButton.focus();
            }
        });

        this.closeButton.addEventListener('click', () => {
            this.button.focus();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeButton.click();
                this.button.focus();
            }
        });
    }

    /**
     * Retrieves the first menu item element within the drawer.
     * 
     * @param drawer - The drawer element.
     * @returns The first menu item element, or null if not found.
     */
    private getFirstMenuItem(drawer: HTMLElement) {
        return drawer.querySelector('.c-drawer__body a, .c-drawer__body button') as HTMLElement|null;
    }

    /**
     * Retrieves the last item in the drawer.
     * 
     * @param drawer - The HTML element representing the drawer.
     * @returns The last item in the drawer.
     */
    private getLastItem(drawer: HTMLElement) {
        const drawerItems = ([...drawer.querySelectorAll('button, a, input')] as Array<HTMLElement>);
        
        return drawerItems[drawerItems.length - 1];
    }
}

/**
 * Initializes the drawer toggle buttons.
 * This function finds all elements with the class 'c-drawer__toggle' and attaches a click event listener to each button.
 * If a button has a 'data-js-toggle-trigger' attribute and there is a corresponding element with a 'data-js-toggle-item' attribute,
 * a new instance of the DrawerToggleButton class is created and associated with the button and the corresponding drawer element.
 */
export function initializeDrawerAccessibility() {
    const drawerToggleButtons = document.querySelectorAll('.c-drawer__toggle');
    drawerToggleButtons.forEach((button) => {
        if (
            button.hasAttribute('data-js-toggle-trigger') && 
            document.querySelector(`[data-js-toggle-item="${button.getAttribute('data-js-toggle-trigger')}"]`)
        ) {
            const drawer = document.querySelector(`[data-js-toggle-item="${button.getAttribute('data-js-toggle-trigger')}"]`);

            new DrawerAccessibility((button as HTMLElement), (drawer as HTMLElement));
        }
    });
}

export default DrawerAccessibility;

