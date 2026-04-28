interface MessageStoreInterface {
    add(message: MessageInterface): void;
    remove(message: MessageInterface): void;
    get(message: MessageInterface): MessageInterface | undefined;
    getAll(): Map<string, MessageInterface>;
}