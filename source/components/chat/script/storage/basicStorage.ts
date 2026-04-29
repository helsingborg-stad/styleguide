class BasicStorage implements StorageInterface {
    private messages: Map<string, MessageInterface> = new Map();

    public getAll(): MessageInterface[] {
        return Array.from(this.messages.values());
    }

    public save(message: MessageInterface): void {
        this.messages.set(message.getId(), message);
    }

    public getSavedMessages(): PersistentMessage[] {
        return this.getAll().map((message) => ({
            id: message.getId(),
            content: message.getContent(),
            isReply: message.getIsReply()
        }));
    }
}

export default BasicStorage;