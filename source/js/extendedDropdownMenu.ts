class ExtendedDropdownMenu {
    private readonly MAX_ROWS_PER_COLUMN = 5;
    private readonly NAV_ITEM_PADDING = 48;
    private readonly MIN_EDGE_PADDING = 32;
    private triggerElementPosition!: DOMRect;
    private resizeTimeout: number = 0;
    private calculatedLeftPosition: number|null = null;
    private cachedResults: { [key: string]: number } = {};

    constructor(
        private parentContainer: HTMLElement,
        private titleElement: HTMLElement,
        private triggerElement: HTMLElement
    ) {}

    init() {
        // Making it run after styles are applied
        requestAnimationFrame(() => {
            this.setElementPositionsAndSizes();
        });

        this.setupResizeListener();
        this.correctColumnBorders();
    }

    /**
     * Sets up a listener for window resize events to adjust the position and size of the dropdown menu.
     */
    private setupResizeListener() {
        window.addEventListener('resize', () => {
            clearTimeout(this.resizeTimeout);
            this.resizeTimeout = window.setTimeout(() => {
                this.setElementPositionsAndSizes();
            }, 200);
        });
    }

    /**
     * Sets the positions and sizes of the dropdown menu elements based on the trigger element's position.
     */
    public setElementPositionsAndSizes(ignoreCache: boolean = false) {
        this.triggerElementPosition = this.triggerElement.getBoundingClientRect();

        if (this.cachedResults[this.triggerElementPosition.left] && !ignoreCache) {
            this.parentContainer.style.left = `${this.cachedResults[this.triggerElementPosition.left]}px`;
            return;
        }

        const titleElementSize = this.titleElement.offsetWidth;
        const parentContainerSize = this.parentContainer.offsetWidth;
        const maxLeft = window.innerWidth - parentContainerSize + this.NAV_ITEM_PADDING - this.MIN_EDGE_PADDING;
        const calculatedLeftPosition = this.triggerElementPosition.left - titleElementSize - this.NAV_ITEM_PADDING;

        this.calculatedLeftPosition = calculatedLeftPosition > maxLeft ? maxLeft : (calculatedLeftPosition < this.MIN_EDGE_PADDING ? this.MIN_EDGE_PADDING : calculatedLeftPosition);
        this.cachedResults[this.triggerElementPosition.left] = this.calculatedLeftPosition;

        this.parentContainer.style.left = `${this.calculatedLeftPosition}px`;
    }

    /**
     * Adjusts the grid row spans of the last item in the dropdown menu to ensure proper border alignment.
     */
    public correctColumnBorders() {
        const items = this.parentContainer.querySelectorAll<HTMLElement>('[data-js-extended-dropdown-child-menu] > .c-nav__item');

        if (!items.length) return;
        const totalItems = items.length;
        const lastItem = items[totalItems - 1];
        
        const itemsInLastColumn = totalItems % this.MAX_ROWS_PER_COLUMN || this.MAX_ROWS_PER_COLUMN;
        const emptySlots = this.MAX_ROWS_PER_COLUMN - itemsInLastColumn;

        if (emptySlots > 0) {
            // Fill all the remaining rows in the last column
            lastItem.style.gridRow = `span ${emptySlots + 1}`;
        }
    }
}

/**
 * Initializes all extended dropdown menus on the page.
 */
export function initializeExtendedDropdownMenu() {
    document.querySelectorAll('[data-js-extended-dropdown-content]').forEach(extendedDropdownMenu => {
        const openElement = extendedDropdownMenu.closest('.c-nav__item')?.querySelector('.c-nav__item-wrapper');
        const titleElement = extendedDropdownMenu.querySelector('[data-js-extended-dropdown-title]');
        const asyncChildContainer = extendedDropdownMenu.querySelector('[data-js-async-children]');

        if (!openElement || !titleElement) {
            console.error('ExtendedDropdownMenu: Sibling element with class .c-nav__item-wrapper not found.');
            return;
        }

        const extendedDropdownMenuInstance = new ExtendedDropdownMenu(
            extendedDropdownMenu as HTMLElement,
            titleElement as HTMLElement,
            openElement as HTMLElement
        );

        extendedDropdownMenuInstance.init();

        if (asyncChildContainer) {
            addObserverForAsyncContent(asyncChildContainer as HTMLElement, extendedDropdownMenuInstance);
        }
    });
}

function addObserverForAsyncContent(targetNode: HTMLElement, extendedDropdownMenuInstance: ExtendedDropdownMenu) {
    if (!targetNode.parentElement) {
        console.error('ExtendedDropdownMenu: asyncChildContainer has no parent element.');
        return;
    }

    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            for (const removedNode of mutation.removedNodes) {
                if (removedNode === targetNode) {
                    extendedDropdownMenuInstance.correctColumnBorders();
                    extendedDropdownMenuInstance.setElementPositionsAndSizes(true);
                    observer.disconnect();
                }
            }
        }
    });

    observer.observe(targetNode.parentElement, { childList: true, subtree: true });
}