import { PAGINATION_ATTRIBUTES, PaginationNavigationCallbacks, type PaginationElements } from './interface';

/**
 * Encapsulates pagination navigation event handling and button state updates.
 */
class PaginationNavigation {
	constructor(private readonly elements: PaginationElements) {}

	public bindListeners(callbacks: PaginationNavigationCallbacks): void {
		this.elements.nextButton?.addEventListener('click', (event) => {
			event.preventDefault();
			callbacks.onNavigate('next');
		});

		this.elements.prevButton?.addEventListener('click', (event) => {
			event.preventDefault();
			callbacks.onNavigate('previous');
		});

		this.elements.linksContainer.addEventListener('click', (event) => {
			event.preventDefault();
			const target = (event.target as HTMLElement).closest(`[${PAGINATION_ATTRIBUTES.indexLink}]`) as HTMLElement | null;
			if (!target) {
				return;
			}

			const nextPage = target.getAttribute(PAGINATION_ATTRIBUTES.indexLink);
			if (!nextPage) {
				return;
			}

			const parsedPage = parseInt(nextPage, 10);
			if (Number.isNaN(parsedPage)) {
				return;
			}

			callbacks.onNavigate('index', parsedPage);
		});
	}

	public updateButtonState(currentPage: number, numberOfPages: number): void {
		this.elements.nextButton?.toggleAttribute('disabled', currentPage >= numberOfPages);
		this.elements.prevButton?.toggleAttribute('disabled', currentPage <= 1);
	}
}

export default PaginationNavigation;