class SizeObserver {
    constructor(
        private element: HTMLElement, 
        private propertyName: string|null, 
        private axis: string|null,
        private includePadding: boolean,
        private includeFullSize: boolean
    ) {
        this.axis = this.axis || 'both';
        this.propertyName = this.propertyName || 'size-observer';

        const resizeObserver = new ResizeObserver(entries => {
            for (const entry of entries) {
                const { width, height } = this.getHeightWidth(entry)
                this.setElementProperties(width, height);
            }
        });
  
        resizeObserver.observe(element);
    }

    private getHeightWidth(entry: ResizeObserverEntry) {
        if (this.includeFullSize && entry.target) {
            return {width: entry.target.scrollWidth ?? 0, height: entry.target.scrollHeight ?? 0};
        }

        if (this.includePadding && entry.borderBoxSize) {
            return {width: entry.borderBoxSize[0].inlineSize, height: entry.borderBoxSize[0].blockSize};
        }

        return {width: entry.contentRect.width, height: entry.contentRect.height};
    } 

    private setElementProperties(width: number, height: number): void {
        if (this.axis == 'y' || this.axis == 'both') {
            this.element.style.setProperty(`--${this.propertyName}-height`, `${height}px`);
        }

        if (this.axis == 'x' || this.axis == 'both') {
            this.element.style.setProperty(`--${this.propertyName}-width`, `${width}px`);
        }
    }
}

  
  // Initializing the SizeObserver class
  export function initializeSizeObserver(): void {
    document.querySelectorAll('[data-js-sizeobserver]').forEach((element) => {
        const axis = element.getAttribute('data-js-sizeobserver-axis');
        const propertyName = element.getAttribute('data-js-sizeobserver');
        const includePadding = element.hasAttribute('data-js-sizeobserver-use-box-size');
        const includeFullSize = element.hasAttribute('data-js-sizeobserver-element-full-size');

        new SizeObserver(element as HTMLElement, propertyName, axis, includePadding, includeFullSize);
    });
  }