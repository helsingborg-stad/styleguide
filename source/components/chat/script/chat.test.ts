import Chat from './chat';
import MessageFactory from './messages/messageFactory';
import MessageRenderer from './messages/messageRenderer';
import PendingMessageManager from './messages/pendingMessageManager';

function createMessageMock(): MessageInterface {
    let data: MessageData = {};

    return {
        getMessage: jest.fn(() => document.createElement('div')),
        getMessageContainer: jest.fn(() => document.createElement('div')),
        getId: jest.fn(() => 'message-1'),
        getContent: jest.fn(() => 'Hello world'),
        getData: jest.fn(() => ({ ...data })),
        getIsReply: jest.fn(() => false),
        setData: jest.fn((nextData: MessageData) => {
            data = { ...nextData };
        }),
        edit: jest.fn(),
        delete: jest.fn(),
    };
}

describe('Chat', () => {
    afterEach(() => {
        document.body.innerHTML = '';
    });

    it('lets an event listener add custom data before a message is persisted', () => {
        const container = document.createElement('div');
        const message = createMessageMock();
        const input = {
            subscribeToSend: jest.fn(),
            get: jest.fn(() => ''),
            clear: jest.fn(),
            disableSend: jest.fn(),
            enableSend: jest.fn(),
            disable: jest.fn(),
            enable: jest.fn(),
        } as unknown as ChatInputInterface;
        const messageFactory = {
            create: jest.fn(() => message),
        } as unknown as MessageFactory;
        const messageStore = {
            getAll: jest.fn(() => [message]),
            delete: jest.fn(),
            deleteAll: jest.fn(),
            restore: jest.fn(),
            save: jest.fn(),
            getSavedMessages: jest.fn(() => []),
        } as unknown as StorageInterface;
        const clear = {
            clear: jest.fn(),
        } as unknown as ClearInterface;
        const messageRenderer = {
            render: jest.fn(),
            moveToBottom: jest.fn(),
        } as unknown as MessageRenderer;
        const pendingMessageManager = {
            get: jest.fn(() => null),
            getOrCreate: jest.fn(() => message),
            resolve: jest.fn(),
            clear: jest.fn(),
        } as unknown as PendingMessageManager;

        container.addEventListener('chat:beforePersistMessage', (event: Event) => {
            const customEvent = event as CustomEvent<{ data: MessageData }>;
            customEvent.detail.data.source = 'listener';
            customEvent.detail.data.priority = 1;
        });

        const chat = new Chat(
            container,
            input,
            messageFactory,
            messageStore,
            clear,
            messageRenderer,
            pendingMessageManager,
        );

        chat.addMessage('Hello world');

        expect(message.setData).toHaveBeenCalledWith({
            source: 'listener',
            priority: 1,
        });
        expect(messageStore.save).toHaveBeenCalledWith(message);
    });
});
