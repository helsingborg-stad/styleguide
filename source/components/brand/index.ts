class BrandViewBoxManager {
	private resizeFrame: number | null = null;

	constructor(
		private svg: SVGElement,
		private container: HTMLElement,
		private textElement: HTMLElement,
		private figureElement: HTMLElement | null,
	) {
		this.updateViewBox();
		window.addEventListener('resize', this.handleResize);
	}

	private handleResize = (): void => {
		if (this.resizeFrame !== null) {
			window.cancelAnimationFrame(this.resizeFrame);
		}

		this.resizeFrame = window.requestAnimationFrame(() => {
			this.updateViewBox();
			this.resizeFrame = null;
		});
	};

	private updateViewBox(): void {
		const containerStyles = window.getComputedStyle(this.container);
		const containerHeight = parseFloat(containerStyles.getPropertyValue('height'));
		const renderedHeight = this.container.getBoundingClientRect().height;
		const scale = renderedHeight > 0 ? containerHeight / renderedHeight : 1;
		const gap = parseFloat(containerStyles.getPropertyValue('gap')) * scale;
		const textWidth = this.textElement.getBoundingClientRect().width * scale;
		const figureWidth = this.figureElement ? this.figureElement.getBoundingClientRect().width * scale : 0;

		// Normalize the rendered logo and text widths back to the fixed internal canvas height.
		const totalWidth = Math.ceil(figureWidth + textWidth + gap);

		// Update the viewBox of the SVG
		this.svg.setAttribute('viewBox', `0 0 ${totalWidth} ${Math.ceil(containerHeight)}`);
	}
}

export function init() {
	document.addEventListener('DOMContentLoaded', () => {
		document.querySelectorAll<HTMLElement>('.c-brand').forEach((brandElement) => {
			if (brandElement.dataset.aspectRatio) {
				return;
			}

			const svg = brandElement.querySelector<SVGElement>('.c-brand__viewbox');
			const container = brandElement.querySelector<HTMLElement>('.c-brand__container');
			const textElement = brandElement.querySelector<HTMLElement>('.c-brand__text');
			const figureElement = brandElement.querySelector<HTMLElement>('.c-brand__logotype');

			if (!svg || !container || !textElement) {
				return;
			}

			const img = brandElement.querySelector<HTMLImageElement>('.c-brand__logotype img');

			const initViewBoxManager = () => {
				new BrandViewBoxManager(svg, container, textElement, figureElement);
			};

			if (!img || img.complete) {
				initViewBoxManager();
			} else {
				img.addEventListener('load', initViewBoxManager);
			}
		});
	});
}
