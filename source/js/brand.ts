class BrandViewBoxManager {
    constructor(
        private svg: SVGElement, 
        private container: HTMLElement, 
        private textElement: HTMLElement, 
        private figureElement: HTMLElement | null
    ) {
        this.updateViewBox();
    }

    private updateViewBox(): void {
        const textStyles = window.getComputedStyle(this.textElement);
        const containerStyles = window.getComputedStyle(this.container);
        const textWidth = parseFloat(textStyles.getPropertyValue('width'));
        const gap = parseFloat(containerStyles.getPropertyValue('gap'));

        // Calculate figure width if the element exists
        const figureWidth = this.figureElement 
            ? parseFloat(window.getComputedStyle(this.figureElement).getPropertyValue('width')) 
            : 0;

        // Calculate the total width of the SVG
        const totalWidth = !figureWidth ? Math.ceil(textWidth) : Math.ceil(figureWidth + textWidth + gap);

        // Update the viewBox of the SVG
        this.svg.setAttribute('viewBox', `0 0 ${totalWidth} 100`);
    }
}

export function initializeBrand(): void {
    document.querySelectorAll<HTMLElement>('.c-brand').forEach((brandElement) => {
        if (brandElement) {
            const svg = brandElement.querySelector<SVGElement>('.c-brand__viewbox');
            const container = brandElement.querySelector<HTMLElement>('.c-brand__container');
            const textElement = brandElement.querySelector<HTMLElement>('.c-brand__text');
            const figureElement = brandElement.querySelector<HTMLElement>('.c-brand__logotype');

            if (!svg || !container || !textElement) {
                return;
            }

            const img = figureElement?.querySelector('img');

            const initViewBoxManager = () => {
                new BrandViewBoxManager(svg, container, textElement, figureElement);
            }

            if (!img || img.complete) {
                initViewBoxManager();
            } else {
                img.addEventListener('load', initViewBoxManager);
            }
        }
    });
}