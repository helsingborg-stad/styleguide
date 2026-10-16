import BasicStorage from './basicStorage';
import LocalStorage from './localStorage';

class FakeMessageItem implements MessageInterface {
	private container = document.createElement('div');

	constructor(
		private id: string,
		private content: string,
		private isReply: boolean,
		private data: MessageData = {},
	) {}

	public getMessage(): HTMLElement {
		return this.container;
	}

	public getMessageContainer(): HTMLElement {
		return this.container;
	}

	public getType(): ChatItemType {
		return 'message';
	}

	public getId(): string {
		return this.id;
	}

	public getContent(): string {
		return this.content;
	}

	public getData(): MessageData {
		return { ...this.data };
	}

	public getIsReply(): boolean {
		return this.isReply;
	}

	public setData(data: MessageData): void {
		this.data = { ...data };
	}

	public edit(content: string): void {
		this.content = content;
	}

	public delete(): void {
		this.container.remove();
	}
}

class FakeInfoItem implements InfoInterface {
	private container = document.createElement('div');

	constructor(
		private id: string,
		private content: string,
	) {}

	public getInfo(): HTMLElement {
		return this.container;
	}

	public getType(): ChatItemType {
		return 'info';
	}

	public getId(): string {
		return this.id;
	}

	public getContent(): string {
		return this.content;
	}

	public edit(content: string): void {
		this.content = content;
	}

	public delete(): void {
		this.container.remove();
	}
}

describe('LocalStorage', () => {
	const chatId = 'chat-storage-test';
	const storageKey = `styleguide:chat:${chatId}:items`;

	beforeEach(() => {
		window.localStorage.clear();
	});

	it('stores and returns typed chat items from localStorage', () => {
		const storage = new LocalStorage(chatId, new BasicStorage());
		const message = new FakeMessageItem('message-1', 'Hello', false, { status: 'ok' });
		const info = new FakeInfoItem('info-1', 'User entered queue');

		storage.save(message);
		storage.save(info);

		expect(storage.getItems()).toEqual([
			{
				type: 'message',
				id: 'message-1',
				content: 'Hello',
				isReply: false,
				data: { status: 'ok' },
			},
			{
				type: 'info',
				id: 'info-1',
				content: 'User entered queue',
			},
		]);

		const raw = window.localStorage.getItem(storageKey);
		expect(raw).not.toBeNull();

		const parsed = JSON.parse(raw as string) as { removeAt: number | null; items: PersistentChatItem[] };
		expect(parsed.removeAt).toBeNull();
		expect(parsed.items).toEqual([
			{
				type: 'message',
				id: 'message-1',
				content: 'Hello',
				isReply: false,
				data: { status: 'ok' },
			},
			{
				type: 'info',
				id: 'info-1',
				content: 'User entered queue',
			},
		]);
	});

	it('does not crash and returns empty array on malformed payload', () => {
		const storage = new LocalStorage(chatId, new BasicStorage());

		window.localStorage.setItem(
			storageKey,
			JSON.stringify({ foo: 'bar' }),
		);

		expect(storage.getItems()).toEqual([]);
	});

	it('removes expired payload and returns empty array', () => {
		const storage = new LocalStorage(chatId, new BasicStorage());

		window.localStorage.setItem(
			storageKey,
			JSON.stringify({
				removeAt: 1,
				items: [
					{
						type: 'info',
						id: 'info-1',
						content: 'Expired',
					},
				],
			}),
		);

		expect(storage.getItems()).toEqual([]);
		expect(window.localStorage.getItem(storageKey)).toBeNull();
	});

	it('writes removeAt when setTtl is configured', () => {
		const nowSpy = jest.spyOn(Date, 'now').mockReturnValue(1000);
		const storage = new LocalStorage(chatId, new BasicStorage());
		const message = new FakeMessageItem('message-1', 'Hello', false, { status: 'ok' });

		storage.setTtl(5000);
		storage.save(message);

		const raw = window.localStorage.getItem(storageKey);
		expect(raw).not.toBeNull();

		const parsed = JSON.parse(raw as string) as { removeAt: number | null; items: PersistentChatItem[] };
		expect(parsed.removeAt).toBe(6000);

		nowSpy.mockRestore();
	});
});
