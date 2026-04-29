class BasicStorage implements StorageInterface {
    private messages: Map<string, MessageInterface> = new Map();
    private persistentMessageIds: Set<string> = new Set();

    public getAll(): MessageInterface[] {
        return Array.from(this.messages.values());
    }

    public delete(message: MessageInterface): void {
        this.messages.delete(message.getId());
        this.persistentMessageIds.delete(message.getId());
    }

    public deleteAll(): void {
        this.messages.clear();
        this.persistentMessageIds.clear();
    }

    public restore(message: MessageInterface): void {
        this.messages.set(message.getId(), message);
        this.persistentMessageIds.delete(message.getId());
    }

    public save(message: MessageInterface): void {
        this.messages.set(message.getId(), message);
        this.persistentMessageIds.add(message.getId());
    }

    public getSavedMessages(): PersistentMessage[] {
        return this.getAll()
            .filter((message) => this.persistentMessageIds.has(message.getId()))
            .map((message) => ({
                id: message.getId(),
                content: message.getContent(),
                isReply: message.getIsReply()
            }));
    }
}

export default BasicStorage;