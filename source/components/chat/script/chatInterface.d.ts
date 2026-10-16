interface ChatInterface {
	addMessage(message: string, isReply?: boolean, shouldPersist?: boolean, id?: string, data?: MessageData): MessageInterface;
	addInfo(content: string, shouldPersist?: boolean, id?: string): InfoInterface;
	clearMessages(): void;
	deleteMessage(message: MessageInterface): void;
	editMessage(newContent: string, message: MessageInterface): void;
	updateMessage(message: MessageInterface): void;
	setTtl(ttlMs: number | null): void;
	getElement(): HTMLElement;
	getScrollContainer(): HTMLElement;
	addPendingMessage(): MessageInterface;
	getPendingMessage(): MessageInterface | null;
	disable(): void;
	enable(): void;
	disableSend(): void;
	enableSend(): void;
	init(): void;
	getMessages(): MessageInterface[];
}
