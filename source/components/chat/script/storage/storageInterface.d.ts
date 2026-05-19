type MessageData = Record<string, unknown>;

type PersistentMessage = {
    id: string;
    content: string;
    isReply: boolean;
    data: MessageData;
}

interface StorageInterface {
	getAll(): MessageInterface[];
    delete(message: MessageInterface): void;
    deleteAll(): void;
    restore(message: MessageInterface): void;
    save(message: MessageInterface): void;
    getSavedMessages(): PersistentMessage[];
}