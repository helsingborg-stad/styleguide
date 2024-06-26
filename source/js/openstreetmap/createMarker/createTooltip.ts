import { Tooltip } from '../interface/interface';

class CreateTooltip {
    constructor(private container: HTMLElement) {
    }

    public create(tooltip: Tooltip, id: String|null = null) {
        let template = this.container?.querySelector('.c-openstreetmap__pin-tooltip');
        let clone = template?.cloneNode(true) as HTMLTemplateElement;

        if (!tooltip.image?.src) {
            const figure = clone.content.querySelector('figure');
            if (figure) {
                figure.remove();
            }
        }

        if (!tooltip.url) {
            let link = clone.content.querySelector('.c-openstreetmap__tooltip-link');
            let title = clone.content.querySelector('.c-openstreetmap__tooltip-title');
            const parent = link?.parentNode;

            if (parent && title && link) {
                parent.insertBefore(title, link);
                link.remove();
            }
        }
        let html = clone.innerHTML;
        html = html
            .replace('{TOOLTIP_HEADING}', tooltip.title ? tooltip.title as string : '')
            .replace('{TOOLTIP_DIRECTIONS_URL}', tooltip.directions?.url ? tooltip.directions.url as string : '')
            .replace('{TOOLTIP_DIRECTIONS_LABEL}', tooltip.directions?.label ? tooltip.directions.label as string : '')
            .replace('{TOOLTIP_EXCERPT}', tooltip.excerpt ? tooltip.excerpt as string : '')
            .replace('{TOOLTIP_IMAGE_SRC}', tooltip.image?.src ? tooltip.image.src as string : '')
            .replace('{TOOLTIP_IMAGE_ALT}', tooltip.image?.alt ? tooltip.image.alt as string : '')
            .replace('{TOOLTIP_MODAL_ID}', id ? id as string : '');
        return html;
    }
}

export default CreateTooltip;