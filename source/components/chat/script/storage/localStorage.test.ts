import BasicStorage from './basicStorage';
import LocalStorage from './localStorage';

function createMessageMock(data: MessageData = {}): MessageInterface {
    return {
        getMessage: jest.fn(() => document.createElement('div')),
        getMessageContainer: jest.fn(() => document.createElement('div')),
        getId: jest.fn(() => 'message-1'),
        getContent: jest.fn(() => 'Hello world'),
        getData: jest.fn(() => data),
        getIsReply: jest.fn(() => false),
        setData: jest.fn(),
        edit: jest.fn(),
        delete: jest.fn(),
    };
}

describe('LocalStorage', () => {
    beforeEach(() => {
        window.localStorage.clear();
    });

    it('saves custom data together with the persisted message', () => {
        const storage = new LocalStorage('chat-id', new BasicStorage());

        storage.save(createMessageMock({
            userId: 42,
            source: 'event',
        }));

        expect(JSON.parse(window.localStorage.getItem('styleguide:chat:chat-id:messages') || '[]')).toEqual([
            {
                id: 'message-1',
                content: 'Hello world',
                isReply: false,
                data: {
                    userId: 42,
                    source: 'event',
                },
            },
        ]);
    });

    it('ignores persisted records that do not match the new data shape', () => {
        window.localStorage.setItem('styleguide:chat:chat-id:messages', JSON.stringify([
            {
                id: 'message-1',
                content: 'Hello world',
                isReply: false,
            },
        ]));

        const storage = new LocalStorage('chat-id', new BasicStorage());

        expect(storage.getSavedMessages()).toEqual([]);
    });
});
