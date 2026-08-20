import type { PaginationElements, PaginationEventCallbacks } from './types';
import { PAGINATION_ATTRIBUTES } from './types';
import { resolveSortMode } from './paginationSort';

/**
 * Registers pagination DOM event listeners.
 */
class PaginationEventBinder {
	constructor(private readonly elements: PaginationElements) {}

	public bind(callbacks: PaginationEventCallbacks): void {
		this.bindNextButton(callbacks);
		this.bindPreviousButton(callbacks);
		this.bindPageLinks(callbacks);
		this.bindSort(callbacks);
		this.bindPopstate(callbacks);
	}

	private bindNextButton(callbacks: PaginationEventCallbacks): void {
		this.elements.nextButton?.addEventListener('click', (event) => {
			event.preventDefault();
			callbacks.onNext();
		});
	}

	private bindPreviousButton(callbacks: PaginationEventCallbacks): void {
		this.elements.prevButton?.addEventListener('click', (event) => {
			event.preventDefault();
			callbacks.onPrevious();
		});
	}

	private bindPageLinks(callbacks: PaginationEventCallbacks): void {
		this.elements.linksContainer.addEventListener('click', (event) => {
			event.preventDefault();
			const target = (event.target as HTMLElement).closest(`[${PAGINATION_ATTRIBUTES.indexLink}]`) as HTMLElement | null;
			if (!target) {
				return;
			}

			const targetPage = target.getAttribute(PAGINATION_ATTRIBUTES.indexLink);
			if (!targetPage) {
				return;
			}

			const parsedPage = parseInt(targetPage, 10);
			if (Number.isNaN(parsedPage)) {
				return;
			}

			callbacks.onPageSelected(parsedPage);
		});
	}

	private bindSort(callbacks: PaginationEventCallbacks): void {
		const sortElement = this.elements.sortElement;
		if (!sortElement) {
			return;
		}

		sortElement.addEventListener('change', (event) => {
			const selectedMode = resolveSortMode((event.target as HTMLSelectElement).value);
			callbacks.onSortChanged(selectedMode);
		});
	}

	private bindPopstate(callbacks: PaginationEventCallbacks): void {
		window.addEventListener('popstate', () => {
			callbacks.onPopstate();
		});
	}
}

export default PaginationEventBinder;
