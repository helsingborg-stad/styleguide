class MessageRenderer {
    constructor(private messageArea: HTMLElement, private container: HTMLElement) {
    }

    public render(message: MessageInterface, pendingMessage: MessageInterface | null = null): void {
        const shouldAutoScroll = !message.getIsReply();

        if (pendingMessage && pendingMessage.getId() !== message.getId()) {
            this.messageArea.insertBefore(message.getMessage(), pendingMessage.getMessage());

            if (shouldAutoScroll) {
                this.scrollToBottom();
            }

            return;
        }

        this.messageArea.appendChild(message.getMessage());

        if (shouldAutoScroll) {
            this.scrollToBottom();
        }
    }

    public moveToBottom(message: MessageInterface): void {
        this.messageArea.appendChild(message.getMessage());
    }

    private scrollToBottom(): void {
        requestAnimationFrame(() => {
            this.container.scrollTop = this.container.scrollHeight;
        });
    }
}

export default MessageRenderer;