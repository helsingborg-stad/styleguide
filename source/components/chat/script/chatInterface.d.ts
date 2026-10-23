interface ChatInterface {
	addMessage(message: string, isReply?: boolean, shouldPersist?: boolean, id?: string, data?: MessageData): MessageInterface;
	addInfo(content: string, shouldPersist?: boolean, id?: string): InfoInterface;
	setDefaultShouldPersist(shouldPersist: boolean): void;
	clearMessages(): void;
	deleteMessage(message: MessageInterface): void;
	editMessage(newContent: string, message: MessageInterface): void;
	updateMessage(message: MessageInterface): void;
	getElement(): HTMLElement;
	getScrollContainer(): HTMLElement;
	addPendingMessage(): MessageInterface;
	getPendingMessage(): MessageInterface | null;
	showBanner(): void;
	hideBanner(): void;
	setBannerContent(content: string): void;
	getBannerContent(): string;
	disable(): void;
	enable(): void;
	disableSend(): void;
	enableSend(): void;
	init(): void;
	getMessages(): MessageInterface[];
}
