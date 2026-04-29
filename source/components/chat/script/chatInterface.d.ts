interface ChatInterface {
    addMessage(message: string, isReply?: boolean, id?: string): MessageInterface;
    clearMessages(): void;
    deleteMessage(message: MessageInterface): void;
    editMessage(newContent: string, message: MessageInterface): void;
    getElement(): HTMLElement;
    addPendingMessage(): MessageInterface;
    getPendingMessage(): MessageInterface | null;
    disable(): void;
    enable(): void;
    disableSend(): void;
    enableSend(): void;
    subscribeToMessages(callback: (messages: MessageInterface[]) => void): void;
    subscribeToUserMessages(callback: (message: MessageInterface) => void): void;
    init(): void;
}