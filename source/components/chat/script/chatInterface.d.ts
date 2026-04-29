interface ChatInterface {
    addMessage(message: string, isReply?: boolean): MessageInterface;
    restoreMessage(message: string, isReply: boolean, id: string): MessageInterface;
    clearMessages(): void;
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