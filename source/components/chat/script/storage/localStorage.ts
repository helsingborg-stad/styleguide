class LocalStorage implements StorageInterface {
	private readonly storageKey: string;
	private ttlMs: number | null = null;

	constructor(
		private id: string,
		private basicStorage: StorageInterface,
	) {
		this.storageKey = `styleguide:chat:${this.id}:items`;
	}

	public getItems(): PersistentChatItem[] {
		const localStorageItems = this.getSavedDataFromLocalStorage();

		if (localStorageItems.length > 0) {
			return localStorageItems;
		}

		return this.basicStorage.getItems();
	}

	public getAll(): ChatItemInterface[] {
		return this.basicStorage.getAll();
	}

	public delete(item: ChatItemInterface): void {
		this.basicStorage.delete(item);
		this.syncLocalStorage();
	}

	public restore(item: ChatItemInterface): void {
		this.basicStorage.restore(item);
	}

	public deleteAll(): void {
		this.basicStorage.deleteAll();

		try {
			window.localStorage.removeItem(this.storageKey);
		} catch {
			console.warn('Failed to clear chat items from localStorage. Items may persist across page reloads.');
		}
	}

	public save(item: ChatItemInterface): void {
		this.basicStorage.save(item);
		this.syncLocalStorage();
	}

	public setTtl(ttlMs: number | null): void {
		this.ttlMs = this.normalizeTtl(ttlMs);
		this.syncLocalStorage();
	}

	private syncLocalStorage(): void {
		try {
			const savedItems = this.basicStorage.getItems();

			if (savedItems.length === 0) {
				window.localStorage.removeItem(this.storageKey);
				return;
			}

			const now = Date.now();
			const payload: PersistentChatPayload = {
				removeAt: this.ttlMs === null ? null : now + this.ttlMs,
				items: savedItems,
			};

			window.localStorage.setItem(this.storageKey, JSON.stringify(payload));
		} catch {
			console.warn('Failed to save chat items to localStorage. Items will not persist across page reloads.');
		}
	}

	private getSavedDataFromLocalStorage(): PersistentChatItem[] {
		try {
			const storedItems = window.localStorage.getItem(this.storageKey);

			if (!storedItems) {
				return [];
			}

			const parsedItems = JSON.parse(storedItems) as unknown;

			if (!this.isPersistentChatPayload(parsedItems)) {
				return [];
			}

			if (this.isExpired(parsedItems.removeAt)) {
				window.localStorage.removeItem(this.storageKey);
				return [];
			}

			return parsedItems.items.filter(this.isPersistentChatItem);
		} catch {
			return [];
		}
	}

	private isPersistentChatPayload(payload: unknown): payload is PersistentChatPayload {
		if (typeof payload !== 'object' || payload === null) {
			return false;
		}

		const candidate = payload as Partial<PersistentChatPayload>;

		if (!(candidate.removeAt === null || typeof candidate.removeAt === 'number')) {
			return false;
		}

		return Array.isArray(candidate.items);
	}

	private isExpired(removeAt: number | null): boolean {
		return removeAt !== null && Date.now() >= removeAt;
	}

	private normalizeTtl(ttlMs: number | null): number | null {
		if (ttlMs === null) {
			return null;
		}

		if (!Number.isFinite(ttlMs) || ttlMs < 0) {
			return null;
		}

		return Math.floor(ttlMs);
	}

	private isPersistentChatItem(item: unknown): item is PersistentChatItem {
		if (typeof item !== 'object' || item === null) {
			return false;
		}

		const candidate = item as Partial<PersistentChatItem>;

		if (candidate.type === 'info') {
			return typeof candidate.id === 'string' && typeof candidate.content === 'string';
		}

		if (candidate.type === 'message') {
			return typeof candidate.id === 'string' && typeof candidate.content === 'string' && typeof candidate.isReply === 'boolean' && typeof candidate.data === 'object' && candidate.data !== null && !Array.isArray(candidate.data);
		}

		return false;
	}
}

export default LocalStorage;
