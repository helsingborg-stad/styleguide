class BrandViewBoxAdjuster {
  constructor(private svg: SVGElement, private container: HTMLElement) {
      this.adjustViewBox();
  }

  private adjustViewBox(): void {
      const textElement = this.container.querySelector<HTMLElement>(".c-brand__text");
      if (textElement) {
          this.calculateViewBoxDimensions(textElement);
      }
  }

  private calculateViewBoxDimensions(
      textElement: HTMLElement
  ): void {
      const computedStyles = window.getComputedStyle(textElement);

      const textWidth = parseFloat(computedStyles.getPropertyValue("width"));
      const textHeight = parseFloat(computedStyles.getPropertyValue("height"));

      this.svg.setAttribute("viewBox", `0 0 ${textWidth} ${textHeight}`);

      const foreignObject = this.svg.querySelector<HTMLElement>("foreignObject");
      if (foreignObject) {
          foreignObject.setAttribute("width", textWidth.toString());
          foreignObject.setAttribute("height", textHeight.toString());
      }
  }
}

export function initializeBrandViewBoxAdjuster(): void {
  document.querySelectorAll(".c-brand").forEach((brandElement) => {
      const svg = brandElement.querySelector<SVGElement>(".c-brand__text-wrapper");
      const container = brandElement.querySelector<HTMLElement>(".c-brand__container");
      if (svg && container) {
          new BrandViewBoxAdjuster(svg, container);
      }
  });
}