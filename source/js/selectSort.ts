
class SelectSort {
    private sortedItemsCache: { [key: string]: Element[] } = {};
    private observer: MutationObserver;

    constructor(private selectSort: HTMLSelectElement, private sortContainer: HTMLElement) {
        this.observer = new MutationObserver(this.handleMutations.bind(this));
        this.observe();
        this.setSortListener();
    }

    private setSortListener(): void {
        this.selectSort.addEventListener('change', () => this.sort());
    }

    private sortFunction(a: Element, b: Element, order: number): number {
        const aValue = a.getAttribute('data-js-sort-item') || '';
        const bValue = b.getAttribute('data-js-sort-item') || '';
        return aValue.localeCompare(bValue) * order;
    }

    private getSortedItems(sortOrder: string): Element[] {
        const sortableItems = this.sortContainer.querySelectorAll('[data-js-sort-item]');
        if (this.sortedItemsCache[sortOrder] && this.sortedItemsCache[sortOrder].length === sortableItems.length) {
            return this.sortedItemsCache[sortOrder];
        }

        let sortedItems: Element[] = [];

        switch (sortOrder) {
            case 'asc':
                sortedItems = [...sortableItems].sort((a, b) => this.sortFunction(a, b, 1));
                break;
            case 'desc':
                sortedItems = [...sortableItems].sort((a, b) => this.sortFunction(a, b, -1));
                break;
            case 'rand':
                sortedItems = [...sortableItems].sort(() => Math.random() - 0.5);
                break;
            default:
                sortedItems = [...sortableItems];
                break;
        }

        this.sortedItemsCache[sortOrder] = sortedItems;
        return this.sortedItemsCache[sortOrder] || [];
    }

    private sort() {
        this.disconnect();

        const sortOrder = this.selectSort.value;
        const sortedItems = this.getSortedItems(sortOrder ?? '');
        this.sortContainer.innerHTML = '';
        sortedItems.forEach((item) => {
            this.sortContainer.appendChild(item);
        });

        this.observe();
    }

    private handleMutations(mutations: MutationRecord[]) {
        let sortableWasAdded = false;
        mutations.forEach(mutation => {
            if (mutation.type === 'childList') {
                sortableWasAdded = false;
                mutation.addedNodes.forEach(node => {
                    if (node instanceof HTMLElement && node.hasAttribute('data-js-sort-item')) {
                        sortableWasAdded = true;
                    }
                });

                if (sortableWasAdded) {
                    this.sort();
                }
            }
        });
    }

    private disconnect(): void {
        this.observer.disconnect();
    }

    private observe(): void {
        this.observer.observe(this.sortContainer, { childList: true, subtree: true });
    }
}

export function initializeSelectSort(): void {
    const sortSelects = document.querySelectorAll('[data-js-sort-select]');

    sortSelects.forEach((sortSelect) => {
        const sortableContainerId = sortSelect.getAttribute('data-js-sort-select');
        const sortableContainer = document.querySelector(`#${sortableContainerId}`);
        
        if (sortableContainer) {
            new SelectSort(sortSelect as HTMLSelectElement, sortableContainer as HTMLElement);
        }
    });
}