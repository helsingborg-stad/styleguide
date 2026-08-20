import { PAGINATION_ATTRIBUTES, type PaginationElements } from './types';

/**
 * Supported navigation actions emitted from pagination controls.
 */
export type PaginationNavigationAction = 'next' | 'previous' | 'index';

/**
 * Callback contract used by pagination navigation controls.
 */
export interface PaginationNavigationCallbacks {
	onNavigate: (action: PaginationNavigationAction, pageNumber?: number) => void;
}

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
		this.elements.nextButton?.removeAttribute('disabled');
		this.elements.prevButton?.removeAttribute('disabled');

		if (currentPage >= numberOfPages) {
			this.elements.nextButton?.setAttribute('disabled', 'true');
		}

		if (currentPage <= 1) {
			this.elements.prevButton?.setAttribute('disabled', 'true');
		}
	}
}

export default PaginationNavigation;