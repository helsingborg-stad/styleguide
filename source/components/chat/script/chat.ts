import type InfoHandler from './handler/infoHandler';
import type MessageHandler from './handler/messageHandler';
import type PendingMessageHandler from './handler/pendingMessageHandler';

class Chat implements ChatInterface {
	constructor(
		private container: HTMLElement,
		private messagesScrollContainer: HTMLElement,
		private input: ChatInputInterface,
		private clear: ClearInterface,
		private messageHandler: MessageHandler,
		private pendingMessageHandler: PendingMessageHandler,
		private infoHandler: InfoHandler,
		private defaultShouldPersist: boolean = true,
	) {}

	public init(): void {
		this.input.subscribeToSend(() => {
			const messageContent = this.input.get();
			if (messageContent) {
				this.addMessage(messageContent, false);
				this.input.clear();
			}
		});

		this.input.subscribeToTyping(() => {
			this.getElement().dispatchEvent(new CustomEvent('chat:typing'));
		});
	}

	public disableSend(): void {
		this.input.disableSend();
	}

	public getElement(): HTMLElement {
		return this.container;
	}

	public getScrollContainer(): HTMLElement {
		return this.messagesScrollContainer;
	}

	public enableSend(): void {
		this.input.enableSend();
	}

	public disable(): void {
		this.input.disable();
	}

	public enable(): void {
		this.input.enable();
	}

	public addPendingMessage(): MessageInterface {
		return this.pendingMessageHandler.add();
	}

	public addMessage(messageContent: string, isReply: boolean = false, shouldPersist?: boolean, id?: string, data: MessageData = {}): MessageInterface {
		const effectiveShouldPersist = shouldPersist ?? this.defaultShouldPersist;

		return this.messageHandler.add(messageContent, isReply, effectiveShouldPersist, id, data);
	}

	public addInfo(content: string, shouldPersist?: boolean, id?: string): InfoInterface {
		const effectiveShouldPersist = shouldPersist ?? this.defaultShouldPersist;

		return this.infoHandler.add(content, effectiveShouldPersist, id);
	}

	public setDefaultShouldPersist(shouldPersist: boolean): void {
		this.defaultShouldPersist = shouldPersist;
	}

	public deleteMessage(message: MessageInterface): void {
		this.messageHandler.delete(message);
	}

	public clearMessages(): void {
		this.clear.clear();
		this.pendingMessageHandler.clear();
		this.getElement().dispatchEvent(new CustomEvent('chat:messages-cleared'));
	}

	public editMessage(newContent: string, message: MessageInterface): void {
		this.messageHandler.edit(newContent, message);
	}

	public updateMessage(message: MessageInterface): void {
		this.messageHandler.update(message);
	}

	public getPendingMessage(): MessageInterface | null {
		return this.pendingMessageHandler.get();
	}

	public getMessages(): MessageInterface[] {
		return this.messageHandler.getMessages();
	}
}

export default Chat;
