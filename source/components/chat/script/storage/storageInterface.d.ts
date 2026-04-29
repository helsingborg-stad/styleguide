type PersistentMessage = {
    id: string;
    content: string;
    isReply: boolean;
}

interface StorageInterface {
	getAll(): MessageInterface[];
    deleteAll(): void;
    restore(message: MessageInterface): void;
    save(message: MessageInterface): void;
    getSavedMessages(): PersistentMessage[];
}