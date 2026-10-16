import type InfoRenderer from '../info/infoRenderer';

class InfoHandler {
	constructor(
		private chatElement: HTMLElement,
		private infoFactory: InfoFactoryInterface,
		private infoRenderer: InfoRenderer,
		private messageStore: StorageInterface,
	) {}

	public add(content: string, shouldPersist: boolean = false, id?: string): InfoInterface {
		const info = this.infoFactory.create(content, id);

		this.infoRenderer.render(info);
		this.chatElement.dispatchEvent(new CustomEvent('chat:info-added', { detail: info }));

		if (shouldPersist) {
			this.messageStore.save(info);
		} else {
			this.messageStore.restore(info);
		}

		return info;
	}
}

export default InfoHandler;
