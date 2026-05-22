class MessageRenderer {
    constructor(private messageArea: HTMLElement, private container: HTMLElement) {
    }

    public render(message: MessageInterface, pendingMessage: MessageInterface | null = null): void {
        const shouldAutoScroll = !message.getIsReply();
        const messageContainer = message.getMessageContainer();

        if (pendingMessage && pendingMessage.getId() !== message.getId()) {
            this.messageArea.insertBefore(messageContainer, pendingMessage.getMessageContainer());

            if (shouldAutoScroll) {
                this.scrollToBottom();
            }

            return;
        }

        this.messageArea.appendChild(messageContainer);

        if (shouldAutoScroll) {
            this.scrollToBottom();
        }
    }

    public moveToBottom(message: MessageInterface): void {
        this.messageArea.appendChild(message.getMessageContainer());
    }

    private scrollToBottom(): void {
        requestAnimationFrame(() => {
            this.container.scrollTop = this.container.scrollHeight;
        });
    }
}

export default MessageRenderer;