class Message implements MessageInterface {
    constructor(
        private isReply: boolean,
        private message: HTMLElement,
        private id: string,
        private content: string
    ) {
    }

    public getMessage(): HTMLElement {
        return this.message;
    }

    public getId(): string {
        return this.id;
    }

    public getContent(): string {
        return this.content;
    }

    /**
     * Updates the message content and rendered markup.
     *
     * @param content The sanitized message content to display.
     */
    public edit(content: string): void {
        this.content = content;
        this.message.innerHTML = content;
    }

    public getIsReply(): boolean {
        return this.isReply;
    }
}

export default Message;