import type MessageRenderer from '../messages/messageRenderer';
import type PendingMessageManager from '../messages/pendingMessageManager';

class PendingMessageHandler {
	constructor(
		private chatElement: HTMLElement,
		private pendingMessageManager: PendingMessageManager,
		private messageRenderer: MessageRenderer,
		private messageStore: StorageInterface,
	) {}

	public add(): MessageInterface {
		const existingPendingMessage = this.pendingMessageManager.get();

		if (existingPendingMessage) {
			this.messageRenderer.moveToBottom(existingPendingMessage);
			return existingPendingMessage;
		}

		const message = this.pendingMessageManager.getOrCreate();

		this.messageRenderer.moveToBottom(message);
		this.messageStore.restore(message);
		this.chatElement.dispatchEvent(new CustomEvent('chat:pending-message-added', { detail: message }));

		return message;
	}

	public get(): MessageInterface | null {
		return this.pendingMessageManager.get();
	}

	public clear(): void {
		this.pendingMessageManager.clear();
	}
}

export default PendingMessageHandler;
