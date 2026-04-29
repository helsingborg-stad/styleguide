type PersistentMessage = {
    id: string;
    content: string;
    isReply: boolean;
}

interface StorageInterface {
	getAll(): MessageInterface[];
    save(message: MessageInterface): void;
    getSavedMessages(): PersistentMessage[];
}