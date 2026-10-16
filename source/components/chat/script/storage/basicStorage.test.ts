import BasicStorage from './basicStorage';

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

describe('BasicStorage', () => {
	it('persists both message and info items in insertion order', () => {
		const storage = new BasicStorage();
		const message = new FakeMessageItem('message-1', 'Hello world', false, { provider: 'test' });
		const info = new FakeInfoItem('info-1', 'Agent joined');

		storage.save(message);
		storage.save(info);

		expect(storage.getItems()).toEqual([
			{
				type: 'message',
				id: 'message-1',
				content: 'Hello world',
				isReply: false,
				data: { provider: 'test' },
			},
			{
				type: 'info',
				id: 'info-1',
				content: 'Agent joined',
			},
		]);
	});

	it('restores non-persisted items without adding them to persisted items', () => {
		const storage = new BasicStorage();
		const message = new FakeMessageItem('message-1', 'Transient', false);

		storage.restore(message);

		expect(storage.getAll()).toHaveLength(1);
		expect(storage.getItems()).toEqual([]);
	});
});
