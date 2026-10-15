interface MessageInterface extends ChatItemInterface {
	getMessage(): HTMLElement;
	getMessageContainer(): HTMLElement;
	getData(): MessageData;
	getIsReply(): boolean;
	setData(data: MessageData): void;
	edit(content: string): void;
}
