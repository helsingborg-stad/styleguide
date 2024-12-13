class BrandViewBoxManager {
    private svg: SVGElement;
    private textElement: HTMLElement;
    private figureElement: HTMLElement | null;
    private container: HTMLElement;

    constructor(private brand: HTMLElement) {
        this.container = this.brand.querySelector<HTMLElement>('.c-brand__container')!;
        this.svg = this.brand.querySelector<SVGElement>('.c-brand__viewbox')!;
        this.textElement = this.brand.querySelector<HTMLElement>('.c-brand__text')!;
        this.figureElement = this.brand.querySelector<HTMLElement>('.c-brand__logotype'); // Optional

        this.updateViewBox();
    }

    public updateViewBox(): void {
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

        this.svg.setAttribute('viewBox', `0 0 ${totalWidth} 100`);
    }
}

export function initializeBrand(): void {
    let instances: BrandViewBoxManager[] = [];
    document.querySelectorAll<HTMLElement>('.c-brand').forEach((brandElement) => {
        if (brandElement) {
            instances.push(new BrandViewBoxManager(brandElement));
        }
    });

    let resizeTimeout: NodeJS.Timeout;

    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            instances.forEach((instance) => {
                instance.updateViewBox();
            });
        }, 300);
    });
}