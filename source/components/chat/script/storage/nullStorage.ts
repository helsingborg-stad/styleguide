class NullStorage implements StorageInterface {
    public getAll(): MessageInterface[] {
        return [];
    }

    public save(_message: MessageInterface): void {
        // Intentionally empty. This storage implementation disables persistence.
    }

    public getSavedMessages(): PersistentMessage[] {
        return [];
    }
}

export default NullStorage;