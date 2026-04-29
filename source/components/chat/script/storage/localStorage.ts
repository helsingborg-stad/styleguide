class LocalStorage implements StorageInterface {
    private readonly storageKey: string;

    constructor(
        private id: string,
        private basicStorage: StorageInterface
    ) {
        this.storageKey = `styleguide:chat:${this.id}:messages`;
    }

    public getSavedMessages(): PersistentMessage[] {
        const localStorageMessages = this.getMessagesFromLocalStorage();

        if (localStorageMessages.length > 0) {
            return localStorageMessages;
        }

        return this.basicStorage.getSavedMessages();
    }

    public getAll(): MessageInterface[] {
        return this.basicStorage.getAll();
    }

    public save(message: MessageInterface): void {
        this.basicStorage.save(message);
        this.saveToLocalStorage();
    }

    private saveToLocalStorage(): void {
        try {
            window.localStorage.setItem(this.storageKey, JSON.stringify(this.basicStorage.getSavedMessages()));
        } catch {
            // Intentionally ignored. Persistence is best-effort.
        }
    }

    private getMessagesFromLocalStorage(): PersistentMessage[] {
        try {
            const storedMessages = window.localStorage.getItem(this.storageKey);

            if (!storedMessages) {
                return [];
            }

            const parsedMessages = JSON.parse(storedMessages) as unknown;

            if (!Array.isArray(parsedMessages)) {
                return [];
            }

            return parsedMessages.filter(this.isPersistentMessage);
        } catch {
            return [];
        }
    }

    private isPersistentMessage(message: unknown): message is PersistentMessage {
        return typeof message === 'object'
            && message !== null
            && typeof (message as PersistentMessage).id === 'string'
            && typeof (message as PersistentMessage).content === 'string'
            && typeof (message as PersistentMessage).isReply === 'boolean';
    }
}

export default LocalStorage;