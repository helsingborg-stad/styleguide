class MessageRenderer {
    private readonly autoScrollThreshold = 80;

    constructor(private messageArea: HTMLElement, private container: HTMLElement) {
    }

    public render(message: MessageInterface, pendingMessage: MessageInterface | null = null): void {
        const shouldAutoScroll = this.shouldAutoScroll(message);

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
        const shouldAutoScroll = this.isNearBottom();

        this.messageArea.appendChild(message.getMessage());

        if (shouldAutoScroll) {
            this.scrollToBottom();
        }
    }

    private shouldAutoScroll(message: MessageInterface): boolean {
        return !message.getIsReply() || this.isNearBottom();
    }

    private isNearBottom(): boolean {
        const distanceFromBottom = this.container.scrollHeight - this.container.scrollTop - this.container.clientHeight;

        return distanceFromBottom <= this.autoScrollThreshold;
    }

    private scrollToBottom(): void {
        requestAnimationFrame(() => {
            this.container.scrollTop = this.container.scrollHeight;
        });
    }
}

export default MessageRenderer;