/**
 * Represents a drawer toggle button that controls the opening and closing of a drawer.
 */
class DrawerAccessibility {
    closeButton: HTMLElement;
    firstMenuItem: HTMLElement | null;
    lastItem: HTMLElement | null;

    constructor(private button: HTMLElement, private drawer: HTMLElement) {
        this.closeButton   = drawer.querySelector('.c-drawer__close') as HTMLElement;
        this.firstMenuItem = this.getFirstMenuItem();
        this.lastItem      = this.getLastItem();

        // Setup ARIA attributes for accessibility
        this.setupAriaAttributes();

        // Start closed by default
        this.drawer.setAttribute('aria-hidden', 'true');

        (this.lastItem && this.closeButton) && this.setupAccessibilityListeners();
    }

    /**
     * Sets up core accessibility attributes for the drawer and its toggle button.
     */
    private setupAriaAttributes() {
        // Ensure the drawer has an ID (needed for aria-controls)
        if (!this.drawer.id) {
            this.drawer.id = `drawer-${Math.random().toString(36).slice(2, 9)}`;
        }

        // Button controls the drawer
        this.button.setAttribute('aria-controls', this.drawer.id);
        this.button.setAttribute('aria-expanded', 'false');
        this.button.setAttribute('aria-haspopup', 'true');
    }

    /**
     * Focuses on the first menu item (or the close button if there are no menu items)
     * Loop the focus back to the close button when tabbing past the last item.
     * Sets the focus back on the "open" button when the close button is clicked.
     * Toggles aria-hidden when opening/closing.
     */
    private setupAccessibilityListeners() {
        // Open drawer
        this.button.addEventListener('click', () => {
            const isOpen = this.drawer.classList.toggle('is-open');

            if (isOpen) {
                // Show drawer and announce it
                this.drawer.removeAttribute('aria-hidden');
                this.button.setAttribute('aria-expanded', 'true');

                // Focus first interactive element
                (this.firstMenuItem || this.closeButton).focus();
            } else {
                // Hide drawer
                this.drawer.setAttribute('aria-hidden', 'true');
                this.button.setAttribute('aria-expanded', 'false');

                // Return focus to trigger button
                this.button.focus();
            }
        });

        // Loop focus back to close button when tabbing past last element
        if (this.lastItem) {
            this.lastItem.addEventListener('keydown', (e) => {
                if (e.key === 'Tab' && !e.shiftKey) {
                    e.preventDefault();
                    this.closeButton.focus();
                }
            });
        }

        // Close button restores focus to trigger
        if (this.closeButton) {
            this.closeButton.addEventListener('click', () => {
                this.drawer.classList.remove('is-open');
                this.drawer.setAttribute('aria-hidden', 'true');
                this.button.setAttribute('aria-expanded', 'false');
                this.button.focus();
            });
        }

        // Escape closes drawer
        document.addEventListener('keydown', (e) => {
            if (this.drawer.classList.contains('is-open') && e.key === 'Escape') {
                this.closeButton.click();
                this.button.focus();
            }
        });
    }

    /**
     * Retrieves the first menu item element within the drawer.
     * 
     * @returns The first menu item element, or null if not found.
     */
    private getFirstMenuItem() {
        return this.drawer.querySelector('.c-drawer__body a, .c-drawer__body button') as HTMLElement | null;
    }

    /**
     * Retrieves the last item in the drawer.
     * 
     * @returns The last item in the drawer.
     */
    private getLastItem() {
        const drawerItems = [...this.drawer.querySelectorAll<HTMLElement>('button, a, input, select, textarea')];
        return drawerItems.length ? drawerItems[drawerItems.length - 1] : null;
    }
}

/**
 * Initializes the drawer toggle buttons.
 * This function finds all elements with the class 'c-drawer__toggle' and attaches a click event listener to each button.
 * If a button has a 'data-js-toggle-trigger' attribute and there is a corresponding element with a 'data-js-toggle-item' attribute,
 * a new instance of the DrawerAccessibility class is created and associated with the button and the corresponding drawer element.
 */
export function initializeDrawerAccessibility() {
    const drawerToggleButtons = document.querySelectorAll('.c-drawer__toggle');
    drawerToggleButtons.forEach((button) => {
        if (
            button.hasAttribute('data-js-toggle-trigger') &&
            document.querySelector(`[data-js-toggle-item="${button.getAttribute('data-js-toggle-trigger')}"]`)
        ) {
            const drawer = document.querySelector(`[data-js-toggle-item="${button.getAttribute('data-js-toggle-trigger')}"]`);
            new DrawerAccessibility(button as HTMLElement, drawer as HTMLElement);
        }
    });
}

export default DrawerAccessibility;