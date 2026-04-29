class MessageRenderer {
    constructor(private messageArea: HTMLElement) {
    }

    public render(message: MessageInterface, pendingMessage: MessageInterface | null = null): void {
        if (pendingMessage && pendingMessage.getId() !== message.getId()) {
            this.messageArea.insertBefore(message.getMessage(), pendingMessage.getMessage());
            return;
        }

        this.messageArea.appendChild(message.getMessage());
    }

    public moveToBottom(message: MessageInterface): void {
        this.messageArea.appendChild(message.getMessage());
    }
}

export default MessageRenderer;