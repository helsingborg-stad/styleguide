interface ChatInterface {
    addMessage(message: string, isReply?: boolean): MessageInterface;
    editMessage(newContent: string, message: MessageInterface): void;
    getElement(): HTMLElement;
    addPendingMessage(): MessageInterface;
    getPendingMessage(): MessageInterface | null;
    disable(): void;
    enable(): void;
    subscribeToMessages(callback: (messages: MessageInterface[]) => void): void;
    subscribeToUserMessages(callback: (message: MessageInterface) => void): void;
}