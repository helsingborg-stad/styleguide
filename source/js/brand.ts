class Brand {
    constructor(
        private brand: HTMLElement,
        private svg: SVGSVGElement,
        private container: HTMLElement
    ) {
        this.setCorrectedViewBox();
    }

    private setCorrectedViewBox(): void {
        const height = this.getCorrectedViewBoxHeight();
        this.svg.setAttribute('viewBox', `0 0 ${height} 100`);
    }

    private getCorrectedViewBoxHeight(): number {
        const containerRect = this.container.getBoundingClientRect();

        return containerRect.width / (containerRect.height / 100);
    }
}

export function initializeBrand(): void {
    document.querySelectorAll('.c-brand').forEach((brand) => {
        const svg = brand.querySelector('svg');
        const container = brand.querySelector('.c-brand__container');

        if (svg && container) {
            new Brand(brand as HTMLElement, svg as SVGSVGElement, container as HTMLElement);
        }
    });
}