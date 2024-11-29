export function initializeBrand(): void {
    document.querySelectorAll('.c-brand').forEach((brand) => {
        const svg = brand.querySelector('svg');
        const brandText = brand.querySelector('.c-brand__text');
        const brandFigure = brand.querySelector('figure');
        const container = brand.querySelector('.c-brand__container');

        
        
        if (svg && brandText && brandFigure && container) {
            const svgRect = svg.getBoundingClientRect();
            const figureRect = brandFigure.getBoundingClientRect();
            const textRect = brandText.getBoundingClientRect();

            const svgScale = svg.viewBox.baseVal.width / svgRect.width;

            const figureWidth = figureRect.width * svgScale;
            const textWidth = textRect.width * svgScale;

            const totalWidth = figureWidth + textWidth + 24;
            
            svg.setAttribute('viewBox', `0 0 ${totalWidth} 100`);
        }
    });
}