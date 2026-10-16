import Info from './info';

class InfoFactory implements InfoFactoryInterface {
	constructor(private infoTemplate: HTMLTemplateElement) {}

	public create(content: string, id?: string): InfoInterface {
		const infoElement = this.infoTemplate.content.firstElementChild?.cloneNode(true) as HTMLElement;
		const infoContentArea = infoElement.querySelector('[data-js-chat-info]') as HTMLElement | null;
		const infoId = id || `info-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
		infoElement.setAttribute('data-js-info-id', infoId);

		if (infoContentArea) {
			infoContentArea.textContent = content;
		}

		return new Info(infoElement, infoId, content);
	}
}

export default InfoFactory;
