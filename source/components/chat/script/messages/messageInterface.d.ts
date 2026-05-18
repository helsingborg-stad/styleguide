interface MessageInterface {
    getMessage(): HTMLElement;
    getMessageContainer(): HTMLElement;
    getId(): string;
    getContent(): string;
    getIsReply(): boolean;
    edit(content: string): void;
    delete(): void;
}