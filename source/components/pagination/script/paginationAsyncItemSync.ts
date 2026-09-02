import { PAGINATION_ATTRIBUTES, type PaginationAsyncItemsChange } from './interface';

/**
 * Observes async pagination item rendering and notifies when items are updated.
 */
class PaginationAsyncItemSync {
	private observer: MutationObserver | null = null;

	constructor(
		private listContainer: HTMLElement
	) {
	}

	public start(onItemsChanged: (itemsChange: PaginationAsyncItemsChange) => void): void {
		if (typeof MutationObserver === 'undefined') {
			return;
		}

		this.observer = new MutationObserver((mutations) => {
			const itemsChange = this.getItemsChange(mutations);
			if (itemsChange.addedItems.length === 0 && itemsChange.removedItems.length === 0) {
				return;
			}

			onItemsChanged(itemsChange);
		});

		this.resume();
	}

	public pause(): void {
		this.observer?.disconnect();
	}

	public resume(): void {
		this.observer?.observe(this.listContainer, { childList: true, subtree: true });
	}

	private getItemsChange(mutations: MutationRecord[]): PaginationAsyncItemsChange {
		const addedItems = this.extractItemsFromMutations(mutations, 'addedNodes');
		const removedItems = this.extractItemsFromMutations(mutations, 'removedNodes');

		return {
			addedItems,
			removedItems,
		};
	}

	private extractItemsFromMutations(mutations: MutationRecord[], nodeListKey: 'addedNodes' | 'removedNodes'): HTMLElement[] {
		const extractedItems: HTMLElement[] = [];

		mutations.forEach((mutation) => {
			mutation[nodeListKey].forEach((node) => {
				if (!(node instanceof HTMLElement)) {
					return;
				}

				if (node.hasAttribute(PAGINATION_ATTRIBUTES.item)) {
					extractedItems.push(node);
				}

				extractedItems.push(...[...node.querySelectorAll(`[${PAGINATION_ATTRIBUTES.item}]`)] as HTMLElement[]);
			});
		});

		return extractedItems;
	}
}

export default PaginationAsyncItemSync;