class ExtendedDropdownMenu {
    constructor(private menuElement: HTMLElement) {}

    init() {
        const items = this.menuElement.querySelectorAll('.c-nav__item') as NodeListOf<HTMLElement>;
        const amount = items.length;
        const lastItem = items[amount - 1];
        // Using 6 as it's own space doesn't count
        const spanCount = 6 - (Math.ceil(amount / 5));

        lastItem.style.gridRow = `span ${spanCount}`;
    }
}

export function initializeExtendedDropdownMenu() {
    document.querySelectorAll('[data-js-extended-dropdown-child-menu]').forEach(extendedDropdownMenu => {
        new ExtendedDropdownMenu(extendedDropdownMenu as HTMLElement).init();
    });
}