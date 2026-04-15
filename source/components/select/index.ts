import { Select } from './script/select';

class SelectComponentObserver {
	private readonly selectComponentElementAttribute = 'data-js-select-component'; //Add to main div of component

	constructor() {
		const container = document.documentElement || document.body;

		this.createInstance([...container.querySelectorAll(`[${this.selectComponentElementAttribute}]`)] as HTMLElement[]);
	}

	public observe(): void {
		const container = document.documentElement || document.body;
		const observerOptions = {
			childList: true,
			subtree: true,
		};

		const observer = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				if (mutation.type === 'childList') {
					mutation.addedNodes.forEach((node) => {
						if (node instanceof HTMLElement) {
							const selects = [...node.querySelectorAll(`[${this.selectComponentElementAttribute}]`)];

							if (node.hasAttribute(this.selectComponentElementAttribute)) {
								selects.push(node);
							}

							this.createInstance(selects as HTMLElement[]);
						}
					});
				}
			});
		});

		observer.observe(container, observerOptions);
	}

	public createInstance(selects: HTMLElement[]): void {
		selects.forEach((select) => {
			new Select(select);
		});
	}
}

// Initialize the SelectComponentObserver when the DOM is fully loaded
export function init() {
	document.addEventListener('DOMContentLoaded', () => {
		const selectComponentObserverInstance = new SelectComponentObserver();
		selectComponentObserverInstance.observe();
	});
}
