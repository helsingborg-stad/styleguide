interface MessageInterface {
    getMessage(): HTMLElement;
    getMessageContainer(): HTMLElement;
    getId(): string;
    getContent(): string;
    getData(): MessageData;
    getIsReply(): boolean;
    setData(data: MessageData): void;
    edit(content: string): void;
    delete(): void;
}