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
	});

	it('rejects legacy untyped payloads', () => {
		const storage = new LocalStorage(chatId, new BasicStorage());

		window.localStorage.setItem(
			storageKey,
			JSON.stringify([
				{
					id: 'message-legacy',
					content: 'Legacy message',
					isReply: true,
					data: {},
				},
			]),
		);

		expect(storage.getItems()).toEqual([]);
	});
});
