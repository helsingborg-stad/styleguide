class BrandViewBoxManager {
    private svg: SVGElement;
    private textElement: HTMLElement;
    private figureElement: HTMLElement;
    private container: HTMLElement;

    constructor(private brand: HTMLElement) {
        this.container = this.brand.querySelector<HTMLElement>('.c-brand__container')!;
        this.svg = this.brand.querySelector<SVGElement>('.c-brand__viewbox')!;
        this.textElement = this.brand.querySelector<HTMLElement>('.c-brand__text')!;
        this.figureElement = this.brand.querySelector<HTMLElement>('.c-brand__logotype')!;
        this.updateViewBox();
    }

    private updateViewBox(): void {
        // Get computed styles for the figure and text elements
        const figureStyles = window.getComputedStyle(this.figureElement);
        const textStyles = window.getComputedStyle(this.textElement);

        // Parse computed widths
        const figureWidth = parseFloat(figureStyles.getPropertyValue('width'));
        const textWidth = parseFloat(textStyles.getPropertyValue('width'));
        const gap = parseFloat(window.getComputedStyle(this.container).getPropertyValue('gap'));

        // Calculate the total width
        const totalWidth = Math.ceil(figureWidth + textWidth + gap);

        // Update the viewBox of the SVG
        this.svg.setAttribute(
            'viewBox', 
            `0 0 ${totalWidth} 100`
        );
    }
}

export function initializeBrand(): void {
    document.querySelectorAll<HTMLElement>('.c-brand').forEach((brandElement) => {
        if (brandElement) {
            new BrandViewBoxManager(brandElement);
        }
    });
}