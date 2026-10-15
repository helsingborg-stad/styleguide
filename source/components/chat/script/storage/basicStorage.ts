class BasicStorage implements StorageInterface {
	private items: Map<string, ChatItemInterface> = new Map();
	private persistentItemIds: string[] = [];

	public getAll(): ChatItemInterface[] {
		return Array.from(this.items.values());
	}

	public delete(item: ChatItemInterface): void {
		this.items.delete(item.getId());
		const idx = this.persistentItemIds.indexOf(item.getId());
		if (idx !== -1) {
			this.persistentItemIds.splice(idx, 1);
		}
	}

	public deleteAll(): void {
		this.items.clear();
		this.persistentItemIds = [];
	}

	public restore(item: ChatItemInterface): void {
		this.items.set(item.getId(), item);
		const idx = this.persistentItemIds.indexOf(item.getId());
		if (idx !== -1) {
			this.persistentItemIds.splice(idx, 1);
		}
	}

	public save(item: ChatItemInterface): void {
		const id = item.getId();
		this.items.set(id, item);
		const idx = this.persistentItemIds.indexOf(id);
		if (idx === -1) {
			this.persistentItemIds.push(id);
		}
	}

	public getItems(): PersistentChatItem[] {
		return this.persistentItemIds
			.map((id) => this.items.get(id))
			.filter((item): item is ChatItemInterface => !!item)
			.map((item) => this.toPersistentItem(item))
			.filter((item): item is PersistentChatItem => item !== null);
	}

	private toPersistentItem(item: ChatItemInterface): PersistentChatItem | null {
		if (item.getType() === 'message') {
			const messageItem = item as MessageInterface;

			return {
				type: 'message',
				id: messageItem.getId(),
				content: messageItem.getContent(),
				isReply: messageItem.getIsReply(),
				data: messageItem.getData(),
			};
		}

		if (item.getType() === 'info') {
			const infoItem = item as InfoInterface;

			return {
				type: 'info',
				id: infoItem.getId(),
				content: infoItem.getContent(),
			};
		}

		return null;
	}
}

export default BasicStorage;
