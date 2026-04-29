import { sanitizeMarkup } from "../helper/sanitize";

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

    public delete(): void {
        this.getMessage().remove();
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
        const sanitizedContent = sanitizeMarkup(content);

        this.content = sanitizedContent;
        this.message.innerHTML = sanitizedContent;
    }

    public getIsReply(): boolean {
        return this.isReply;
    }
}

export default Message;