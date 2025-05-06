export class PreventContentJumpObserver {

	private readonly attribute = 'data-js-prevent-content-jump';

	constructor() {
		const container = document.documentElement || document.body;
		[...container.querySelectorAll<HTMLElement>(`[${this.attribute}]`)].forEach((element) => {
			this.observeElement(element);
		});
	}

	observe(): void {
		const container = document.documentElement || document.body;
		const observerOptions = {
			childList: true,
			subtree: true
		};

		const observer = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				if (mutation.type === 'childList') {
					mutation.addedNodes.forEach((node) => {
						if (node instanceof HTMLElement && node.hasAttribute(this.attribute)) {
							this.observeElement(node);
						}
					});
				}
			});
		});

		observer.observe(container, observerOptions);
	}

	private observeElement(element: HTMLElement): void {
		const resizeObserver = new ResizeObserver((entries) => {
			for (const entry of entries) {
				const el = entry.target as HTMLElement;
				const prevHeight = parseFloat(el.dataset.prevHeight ?? '') || el.offsetHeight;
				const newHeight = el.scrollHeight;

				if (prevHeight !== newHeight) {
					el.style.transition = 'height 0.3s ease';
					el.style.overflow = 'hidden';
					el.style.height = `${prevHeight}px`;

					requestAnimationFrame(() => {
						el.style.height = `${newHeight}px`;
						el.dataset.prevHeight = newHeight.toString();
					});

					const cleanup = () => {
						el.style.height = '';
						el.style.overflow = '';
						el.style.transition = '';
						el.removeEventListener('transitionend', cleanup);
					};

					el.addEventListener('transitionend', cleanup);
				}
			}
		});

		resizeObserver.observe(element);
	}
}