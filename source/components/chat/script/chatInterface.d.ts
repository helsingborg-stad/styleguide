interface ChatInterface {
    addMessage(message: string, isReply?: boolean): MessageInterface;
    editMessage(newContent: string, message: MessageInterface): void;
    getMessageStore(): MessageStoreInterface;
    addPendingMessage(): MessageInterface;
    getPending(): MessageInterface | null;
    disable(): void;
    enable(): void;
}