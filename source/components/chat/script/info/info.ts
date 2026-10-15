class Info implements InfoInterface {
	public constructor(
		private infoElement: HTMLElement,
		private infoId: string,
		private content: string,
	) {}

	public getInfo(): HTMLElement {
		return this.infoElement;
	}

	public getType(): ChatItemType {
		return 'info';
	}

	public delete(): void {
		this.getInfo().remove();
	}

	public edit(content: string): void {
		this.content = content;
		this.getInfo().textContent = content;
	}

	public getContent(): string {
		return this.content;
	}

	public getId(): string {
		return this.infoId;
	}
}

export default Info;
