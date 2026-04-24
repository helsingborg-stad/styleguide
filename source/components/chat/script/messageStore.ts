class MessageStore implements MessageStoreInterface {
    private messages: Map<string, MessageInterface> = new Map();

    public add(message: MessageInterface) {
        this.messages.set(message.getId(), message);
    }

    public remove(message: MessageInterface) {
        this.messages.delete(message.getId());
    }

    public get(message: MessageInterface): MessageInterface | undefined {
        return this.messages.get(message.getId());
    }

    public getAll(): Map<string, MessageInterface> {
        return this.messages;
    }
}

export default MessageStore;