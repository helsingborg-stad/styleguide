type MessageData = Record<string, unknown>;

type ChatItemType = 'message' | 'info';

interface ChatItemInterface {
	getType(): ChatItemType;
	getId(): string;
	getContent(): string;
	delete(): void;
}

type PersistentMessageItem = {
	type: 'message';
	id: string;
	content: string;
	isReply: boolean;
	data: MessageData;
};

type PersistentInfoItem = {
	type: 'info';
	id: string;
	content: string;
};

type PersistentChatItem = PersistentMessageItem | PersistentInfoItem;

type PersistentChatPayload = {
	removeAt: number | null;
	items: PersistentChatItem[];
};

interface StorageInterface {
	getAll(): ChatItemInterface[];
	delete(item: ChatItemInterface): void;
	deleteAll(): void;
	restore(item: ChatItemInterface): void;
	save(item: ChatItemInterface): void;
	getItems(): PersistentChatItem[];
	setTtl(ttlMs: number | null): void;
}
