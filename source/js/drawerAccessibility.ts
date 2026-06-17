/**
 * Represents a drawer toggle button that controls the opening and closing of a drawer.
 */
class DrawerAccessibility {
    private static hasGlobalViewOffsetListeners = false;
    closeButton: HTMLElement;
    firstMenuItem: HTMLElement|null;
    lastItem: HTMLElement;

    constructor(private button: HTMLElement, private drawer: HTMLElement) {

        //Assume drawer is hidden initially
        this.drawer.setAttribute('aria-hidden', 'true');

        this.closeButton    = drawer.querySelector('.c-drawer__close') as HTMLElement;
        this.firstMenuItem  = this.getFirstMenuItem();
        this.lastItem       = this.getLastItem();

        this.setupViewOffsetListeners();

        (this.lastItem && this.closeButton) && this.setupAccessibilityListeners();
    }

    /**
     * Watches drawer state and size-affecting changes so global view offsets stay current.
     */
    private setupViewOffsetListeners() {
        const observer = new MutationObserver(() => updateDrawerViewOffsets());
        observer.observe(this.drawer, {
            attributes: true,
            attributeFilter: ['class', 'style']
        });

        DrawerAccessibility.setupGlobalViewOffsetListeners();
        updateDrawerViewOffsets();
    }

    /**
     * Adds viewport listeners once, shared by all drawer instances.
     */
    private static setupGlobalViewOffsetListeners() {
        if (DrawerAccessibility.hasGlobalViewOffsetListeners) {
            return;
        }

        window.addEventListener('resize', updateDrawerViewOffsets);
        window.visualViewport?.addEventListener('resize', updateDrawerViewOffsets);
        DrawerAccessibility.hasGlobalViewOffsetListeners = true;
    }

    /**
     * Focuses on the first menu item (or the close button if there are no menu items)
     * Loop the focus back to the close button when tabbing past the last item.
     * Sets the focus back on the "open" button when the close button is clicked.
     */
    private setupAccessibilityListeners() {

        //Focus on open
        this.button.addEventListener('click', () => {
            (this.firstMenuItem || this.closeButton).focus();
        });

        //Close by tabbing
        this.lastItem.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                e.preventDefault();
                this.closeButton.focus();
            }
        });

        //When the close button is clicked, focus
        this.closeButton.addEventListener('click', () => {
            this.button.focus();
        });

        //Close by escape
        document.addEventListener('keydown', (e) => {
            if (this.drawer.classList.contains('is-open') && e.key === 'Escape') {
                this.closeButton.click();
                this.button.focus();
            }
        });

        //When the drawer is being opened
        this.drawer.addEventListener('transitionend', () => {
            if (this.drawer.classList.contains('is-open')) {
                this.drawer.removeAttribute('aria-hidden');
                this.drawer.querySelectorAll('a').forEach((element) => {
                    element.setAttribute('tabindex', '0');
                });
            }
        });

        //When the drawer is being closed
        this.drawer.addEventListener('transitionend', () => {
            if (!this.drawer.classList.contains('is-open')) {
                this.drawer.setAttribute('aria-hidden', 'true');
            }
        });

        //When items is being added to the drawer, add tabindex
        this.drawer.addEventListener('DOMNodeInserted', (event) => {
            const target = event.target as HTMLElement;
            if (target.matches('a')) {
                target.setAttribute('tabindex', '0');
            }
        });
    }

    /**
     * Retrieves the first menu item element within the drawer.
     * 
     * @param drawer - The drawer element.
     * @returns The first menu item element, or null if not found.
     */
    private getFirstMenuItem() {
        return this.drawer.querySelector('.c-drawer__body a, .c-drawer__body button') as HTMLElement|null;
    }

    /**
     * Retrieves the last item in the drawer.
     * 
     * @param drawer - The HTML element representing the drawer.
     * @returns The last item in the drawer.
     */
    private getLastItem() {
        const drawerItems = ([...this.drawer.querySelectorAll('button, a, input')] as Array<HTMLElement>);
        
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

/**
 * Updates global view offsets based on currently open drawers.
 */
export function updateDrawerViewOffsets() {
    const openDrawers = [...document.querySelectorAll<HTMLElement>('.c-drawer.is-open')];
    const baseUnit = getBaseUnitInPixels();
    const leftOffset = getMaxDrawerOffsetInBaseUnits(
        openDrawers.filter((drawer) => !drawer.classList.contains('c-drawer--right')),
        baseUnit
    );
    const rightOffset = getMaxDrawerOffsetInBaseUnits(
        openDrawers.filter((drawer) => drawer.classList.contains('c-drawer--right')),
        baseUnit
    );

    setViewOffset('left', leftOffset);
    setViewOffset('right', rightOffset);
}

/**
 * Sets a global view offset and easing direction for the side being updated.
 *
 * @param side - The viewport side being offset.
 * @param offset - The offset expressed as a base-unit multiplier.
 */
function setViewOffset(side: 'left'|'right', offset: number) {
    const property = `--view-offset-${side}`;
    const currentOffset = Number.parseFloat(document.documentElement.style.getPropertyValue(property)) || 0;
    const easing = offset < currentOffset ? 'ease-in' : 'ease-out';

    document.documentElement.style.setProperty(`--view-offset-${side}-transition-easing`, easing);
    document.documentElement.style.setProperty(property, offset.toString());
}

/**
 * Gets the largest drawer width in base units from a drawer list.
 *
 * @param drawers - Drawers to measure.
 * @param baseUnit - Current base unit size in pixels.
 * @returns The largest drawer width expressed as a base-unit multiplier.
 */
function getMaxDrawerOffsetInBaseUnits(drawers: HTMLElement[], baseUnit: number) {
    const maxWidth = drawers.reduce((width, drawer) => {
        const drawerWidth = drawer.getBoundingClientRect().width || drawer.offsetWidth;

        return Math.max(width, drawerWidth);
    }, 0);

    return Number((maxWidth / baseUnit).toFixed(4));
}

/**
 * Resolves the current CSS base unit in pixels.
 *
 * @returns The base unit size in pixels.
 */
function getBaseUnitInPixels() {
    const rawBaseValue = getComputedStyle(document.documentElement).getPropertyValue('--base').trim();
    const parsedBaseValue = Number.parseFloat(rawBaseValue);

    if (rawBaseValue.endsWith('px') && parsedBaseValue > 0) {
        return parsedBaseValue;
    }

    const measuringElement = document.createElement('div');
    measuringElement.style.position = 'absolute';
    measuringElement.style.visibility = 'hidden';
    measuringElement.style.width = 'var(--base, 8px)';
    document.body.appendChild(measuringElement);

    const measuredBaseValue = measuringElement.getBoundingClientRect().width;
    measuringElement.remove();

    return measuredBaseValue || 8;
}

export default DrawerAccessibility;

