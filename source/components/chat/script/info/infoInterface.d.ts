interface InfoInterface extends ChatItemInterface {
	getInfo(): HTMLElement;
	edit(content: string): void;
}

interface InfoFactoryInterface {
	create(content: string, id?: string): InfoInterface;
}
