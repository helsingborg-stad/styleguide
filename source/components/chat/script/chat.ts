import type MessageFactory from "./messages/messageFactory";
import type MessageRenderer from "./messages/messageRenderer";
import type PendingMessageManager from "./messages/pendingMessageManager";


class Chat implements ChatInterface {
    constructor(
        private container: HTMLElement,
        private input: ChatInputInterface,
        private messageFactory: MessageFactory,
        private messageStore: StorageInterface,
        private clear: ClearInterface,
        private messageRenderer: MessageRenderer,
        private pendingMessageManager: PendingMessageManager

    ) {
    }

    public init(): void {
        this.input.subscribeToSend(() => {
            const messageContent = this.input.get();
            if (messageContent) {
                const message = this.addMessage(messageContent, false);
                this.input.clear();
            }
        });
    }

    public disableSend(): void {
        this.input.disableSend();
    }

    public getElement(): HTMLElement {
        return this.container;
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
        const existingPendingMessage = this.pendingMessageManager.get();

        if (existingPendingMessage) {
            this.messageRenderer.moveToBottom(existingPendingMessage);
            return existingPendingMessage;
        }

        const message = this.pendingMessageManager.getOrCreate();

        this.messageRenderer.moveToBottom(message);
        this.messageStore.restore(message);
        this.getElement().dispatchEvent(new CustomEvent('chat:pending-message-added', { detail: message }));

        return message;
    }

    public addMessage(messageContent: string, isReply: boolean = false, shouldPersist: boolean = true, id?: string, data: MessageData = {}): MessageInterface {
        return this.createMessage(messageContent, isReply, shouldPersist, id, data);
    }

    public deleteMessage(message: MessageInterface): void {
        this.pendingMessageManager.resolve(message);
        message.delete();
        this.messageStore.delete(message);
        this.getElement().dispatchEvent(new CustomEvent('chat:message-deleted', { detail: message }));
    }

    public clearMessages(): void {
        this.clear.clear();
        this.pendingMessageManager.clear();
        this.getElement().dispatchEvent(new CustomEvent('chat:messages-cleared'));
    }

    public editMessage(newContent: string, message: MessageInterface): void {
        message.edit(newContent);
        this.pendingMessageManager.resolve(message);

        this.messageStore.save(message);
        this.getElement().dispatchEvent(new CustomEvent('chat:message-edited', { detail: message }));
    }

    public updateMessage(message: MessageInterface): void {
        this.messageStore.save(message);
    }

    public getPendingMessage(): MessageInterface | null {
        return this.pendingMessageManager.get();
    }

    public getMessages(): MessageInterface[] {
        return this.messageStore.getAll();
    }

    private createMessage(messageContent: string, isReply: boolean, shouldPersist: boolean, id?: string, data: MessageData = {}): MessageInterface {
        const message = this.messageFactory.create(messageContent, isReply, id, data);

        this.messageRenderer.render(message, this.pendingMessageManager.get());

        this.getElement().dispatchEvent(new CustomEvent('chat:message-added', { detail: message }));

        if (shouldPersist) {
            this.messageStore.save(message);
        } else {
            this.messageStore.restore(message);
        }

        return message;
    }
}

export default Chat;