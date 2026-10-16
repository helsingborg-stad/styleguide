import type MessageFactory from '../messages/messageFactory';
import type MessageRenderer from '../messages/messageRenderer';
import type PendingMessageManager from '../messages/pendingMessageManager';

class MessageHandler {
	constructor(
		private chatElement: HTMLElement,
		private messageFactory: MessageFactory,
		private messageStore: StorageInterface,
		private messageRenderer: MessageRenderer,
		private pendingMessageManager: PendingMessageManager,
	) {}

	public add(messageContent: string, isReply: boolean = false, shouldPersist: boolean = true, id?: string, data: MessageData = {}): MessageInterface {
		const message = this.messageFactory.create(messageContent, isReply, id, data);

		this.messageRenderer.render(message, this.pendingMessageManager.get());
		this.chatElement.dispatchEvent(new CustomEvent('chat:message-added', { detail: message }));

		if (shouldPersist) {
			this.messageStore.save(message);
		} else {
			this.messageStore.restore(message);
		}

		return message;
	}

	public delete(message: MessageInterface): void {
		this.pendingMessageManager.resolve(message);
		message.delete();
		this.messageStore.delete(message);
		this.chatElement.dispatchEvent(new CustomEvent('chat:message-deleted', { detail: message }));
	}

	public edit(newContent: string, message: MessageInterface): void {
		message.edit(newContent);
		this.pendingMessageManager.resolve(message);

		this.messageStore.save(message);
		this.chatElement.dispatchEvent(new CustomEvent('chat:message-edited', { detail: message }));
	}

	public update(message: MessageInterface): void {
		this.messageStore.save(message);
	}

	public getMessages(): MessageInterface[] {
		return this.messageStore.getAll().filter(this.isMessageItem);
	}

	private isMessageItem(item: ChatItemInterface): item is MessageInterface {
		return item.getType() === 'message';
	}
}

export default MessageHandler;
