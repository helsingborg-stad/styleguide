import MessageFactory from "./messages/messageFactory";
import MessageRenderer from "./messages/messageRenderer";
import PendingMessageManager from "./messages/pendingMessageManager";

type BeforePersistMessageEventDetail = {
    chat: ChatInterface;
    message: MessageInterface;
    data: MessageData;
};

class Chat implements ChatInterface {
    private messageCallbacks: ((messages: MessageInterface[]) => void)[] = [];
    private userMessageCallbacks: ((message: MessageInterface) => void)[] = [];

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
                this.runUserMessageCallback(message);
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
        this.runMessageCallbacks();

        return message;
    }

    public subscribeToMessages(callback: (messages: MessageInterface[]) => void): void {
        this.messageCallbacks.push(callback);
    }

    private runUserMessageCallback(message: MessageInterface): void {
        this.userMessageCallbacks.forEach((callback) => callback(message));
    }

    public subscribeToUserMessages(callback: (message: MessageInterface) => void): void {
        this.userMessageCallbacks.push(callback);
    }

    public addMessage(messageContent: string, isReply: boolean = false, shouldPersist: boolean = true, id?: string, data: MessageData = {}): MessageInterface {
        return this.createMessage(messageContent, isReply, shouldPersist, id, data);
    }

    public deleteMessage(message: MessageInterface): void {
        this.pendingMessageManager.resolve(message);
        message.delete();
        this.messageStore.delete(message);
        this.runMessageCallbacks();
    }

    public clearMessages(): void {
        this.clear.clear();
        this.pendingMessageManager.clear();
        this.runMessageCallbacks();
    }

    public editMessage(newContent: string, message: MessageInterface): void {
        message.edit(newContent);
        this.pendingMessageManager.resolve(message);

        this.saveMessage(message);
        this.runMessageCallbacks();
    }

    public updateMessage(message: MessageInterface): void {
        this.saveMessage(message);
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

        if (shouldPersist) {
            this.saveMessage(message);
        } else {
            this.messageStore.restore(message);
        }

        this.runMessageCallbacks();

        return message;
    }

    private saveMessage(message: MessageInterface): void {
        const event = new CustomEvent<BeforePersistMessageEventDetail>('chat:beforePersistMessage', {
            bubbles: true,
            detail: {
                chat: this,
                message,
                data: message.getData(),
            },
        });

        this.container.dispatchEvent(event);
        message.setData(event.detail.data);
        this.messageStore.save(message);
    }

    private runMessageCallbacks(): void {
        const messages = this.messageStore.getAll();

        this.messageCallbacks.forEach((callback) => callback(messages));
    }
}

export default Chat;