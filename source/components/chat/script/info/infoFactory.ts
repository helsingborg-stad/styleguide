import Info from "./info";

class InfoFactory {
    constructor(
        private infoTemplate: HTMLTemplateElement
    ) {
    }

    public create(content: string, id?: string): InfoInterface {
        const infoElement = this.infoTemplate.content.firstElementChild?.cloneNode(true) as HTMLElement;
        const infoId = id || `info-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        infoElement.setAttribute('data-js-info-id', infoId);

        return new Info(infoElement, infoId, content);
    }
}

export default InfoFactory;