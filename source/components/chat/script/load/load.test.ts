import Load from './load';

describe('Load', () => {
	it('replays persisted message and info items in order', () => {
		const addMessage = jest.fn();
		const addInfo = jest.fn();

		const chat = {
			addMessage,
			addInfo,
			clearMessages: jest.fn(),
			deleteMessage: jest.fn(),
			editMessage: jest.fn(),
			updateMessage: jest.fn(),
			getElement: jest.fn(),
			getScrollContainer: jest.fn(),
			addPendingMessage: jest.fn(),
			getPendingMessage: jest.fn(),
			disable: jest.fn(),
			enable: jest.fn(),
			disableSend: jest.fn(),
			enableSend: jest.fn(),
			init: jest.fn(),
			getMessages: jest.fn(),
		} as unknown as ChatInterface;

		const storage = {
			getItems: jest.fn(() => [
				{
					type: 'message',
					id: 'message-1',
					content: 'Hello',
					isReply: false,
					data: { source: 'user' },
				},
				{
					type: 'info',
					id: 'info-1',
					content: 'Agent joined',
				},
				{
					type: 'message',
					id: 'message-2',
					content: 'Hi there',
					isReply: true,
					data: { source: 'agent' },
				},
			]),
		} as unknown as StorageInterface;

		const scrollContainer = document.createElement('div');
		Object.defineProperty(scrollContainer, 'scrollHeight', { value: 320, configurable: true });

		const load = new Load(chat, storage, scrollContainer);

		load.load();

		expect(addMessage).toHaveBeenNthCalledWith(1, 'Hello', false, true, 'message-1', { source: 'user' });
		expect(addInfo).toHaveBeenNthCalledWith(1, 'Agent joined', true, 'info-1');
		expect(addMessage).toHaveBeenNthCalledWith(2, 'Hi there', true, true, 'message-2', { source: 'agent' });
		expect(scrollContainer.scrollTop).toBe(320);
	});
});
