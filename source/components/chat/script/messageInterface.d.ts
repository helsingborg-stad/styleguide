interface MessageInterface {
    getMessage(): HTMLElement;
    getId(): string;
    getContent(): string;
    getIsReply(): boolean;
    edit(content: string): void;
}