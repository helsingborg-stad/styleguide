import { Select } from "./Select";

export class SelectComponentObserver {

	private readonly selectComponentElementAttribute = 'data-js-select-component'; //Add to main div of component

	constructor() {
		const container = document.documentElement || document.body;
		container.querySelectorAll(`[${this.selectComponentElementAttribute}]`).forEach((element) => {
			new Select(element as HTMLElement);
		})
	}

	observe(): void {
		const container = document.documentElement || document.body;
		const observerOptions = {
			childList: true,
			subtree: true
		};

		const observer = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				if (mutation.type === "childList") {
					mutation.addedNodes.forEach((node) => {
						if (node instanceof HTMLElement && node.hasAttribute(`[${this.selectComponentElementAttribute}]`)) {
							new Select(node);
						}
					});
				}
			});
		});

		observer.observe(container, observerOptions);
	}
}