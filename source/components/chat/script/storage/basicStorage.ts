class BasicStorage implements StorageInterface {
    private messages: Map<string, MessageInterface> = new Map();
    private persistentMessageIds: string[] = [];

    public getAll(): MessageInterface[] {
        return Array.from(this.messages.values());
    }

    public delete(message: MessageInterface): void {
        this.messages.delete(message.getId());
        const idx = this.persistentMessageIds.indexOf(message.getId());
        if (idx !== -1) {
            this.persistentMessageIds.splice(idx, 1);
        }
    }

    public deleteAll(): void {
        this.messages.clear();
        this.persistentMessageIds = [];
    }

    public restore(message: MessageInterface): void {
        this.messages.set(message.getId(), message);
        const idx = this.persistentMessageIds.indexOf(message.getId());
        if (idx !== -1) {
            this.persistentMessageIds.splice(idx, 1);
        }
    }

    public save(message: MessageInterface): void {
        const id = message.getId();
        this.messages.set(id, message);
        const idx = this.persistentMessageIds.indexOf(id);
        if (idx === -1) {
            this.persistentMessageIds.push(id);
        }
    }

    public getSavedMessages(): PersistentMessage[] {
        return this.persistentMessageIds
            .map((id) => this.messages.get(id))
            .filter((message): message is MessageInterface => !!message)
            .map((message) => ({
                id: message.getId(),
                content: message.getContent(),
                isReply: message.getIsReply(),
                data: message.getData()
            }));
    }
}

export default BasicStorage;