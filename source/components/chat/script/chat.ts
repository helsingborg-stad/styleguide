import { getPendingMarkup } from "./helper/pending";
import { sanitizeMarkup } from "./helper/sanitize";
import MessageFactory from "./messageFactory";

class Chat implements ChatInterface {
    private pendingMessage: MessageInterface | null = null;
    private userMessageCallbacks: ((message: MessageInterface) => void)[] = [];

    constructor(
        private messageArea: HTMLElement,
        private input: ChatInputInterface,
        private messageFactory: MessageFactory,
        private messageStore: MessageStoreInterface
    ) {
        this.setupFormListener();
    }

    private setupFormListener() {
        this.input.subscribeToSend(() => {
            const messageContent = this.input.get();
            if (messageContent) {
                const message = this.addMessage(messageContent, false);
                this.input.clear();
                this.runUserMessageCallback(message);
            }
        });
    }

    public disable(): void {
        this.input.disable();
    }

    public enable(): void {
        this.input.enable();
    }

    public addPendingMessage(): MessageInterface {
        if (this.pendingMessage) {
            this.moveMessageToBottom(this.pendingMessage);
            return this.pendingMessage;
        }

        const message = this.messageFactory.create(getPendingMarkup(), true);
        this.pendingMessage = message;
        this.moveMessageToBottom(message);
        this.messageStore.add(message);

        return message;
    }

    private runUserMessageCallback(message: MessageInterface): void {
        this.userMessageCallbacks.forEach((callback) => callback(message));
    }

    public subscribeToUserMessages(callback: (message: MessageInterface) => void): void {
        this.userMessageCallbacks.push(callback);
    }

    public addMessage(messageContent: string, isReply: boolean = false): MessageInterface {
        const message = this.messageFactory.create(messageContent, isReply);

        if (this.pendingMessage) {
            this.messageArea.insertBefore(message.getMessage(), this.pendingMessage.getMessage());
        } else {
            this.messageArea.appendChild(message.getMessage());
        }

        this.messageStore.add(message);

        return message;
    }

    public editMessage(newContent: string, message: MessageInterface): void {
        const sanitizedContent = sanitizeMarkup(newContent);

        message.edit(sanitizedContent);
        if (this.pendingMessage && this.pendingMessage.getId() === message.getId()) {
            this.pendingMessage = null;
        }

        message.edit(sanitizedContent);
    }

    public getPending(): MessageInterface | null {
        return this.pendingMessage;
    }

    private moveMessageToBottom(message: MessageInterface): void {
        this.messageArea.appendChild(message.getMessage());
    }

    public getMessageStore(): MessageStoreInterface {
        return this.messageStore;
    }
}

export default Chat;