class InfoRenderer {
	constructor(private messageArea: HTMLElement) {}

	public render(info: InfoInterface): void {
		this.messageArea.appendChild(info.getInfo());
	}
}

export default InfoRenderer;
