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

    public delete(message: MessageInterface): void {
        this.basicStorage.delete(message);
        this.syncLocalStorage();
    }

    public restore(message: MessageInterface): void {
        this.basicStorage.restore(message);
    }

    public deleteAll(): void {
        this.basicStorage.deleteAll();

        try {
            window.localStorage.removeItem(this.storageKey);
        } catch {
            console.warn('Failed to clear messages from localStorage. Messages may persist across page reloads.');
        }
    }

    public save(message: MessageInterface): void {
        this.basicStorage.save(message);
        this.syncLocalStorage();
    }

    private syncLocalStorage(): void {
        try {
            const savedMessages = this.basicStorage.getSavedMessages();

            if (savedMessages.length === 0) {
                window.localStorage.removeItem(this.storageKey);
                return;
            }

            window.localStorage.setItem(this.storageKey, JSON.stringify(savedMessages));
        } catch {
            console.warn('Failed to save messages to localStorage. Messages will not persist across page reloads.');
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
            && typeof (message as PersistentMessage).isReply === 'boolean'
            && typeof (message as PersistentMessage).data === 'object'
            && (message as PersistentMessage).data !== null
            && !Array.isArray((message as PersistentMessage).data);
    }
}

export default LocalStorage;