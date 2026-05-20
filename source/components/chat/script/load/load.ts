class Load implements LoadInterface {
    constructor(
        private chat: ChatInterface,
        private storage: StorageInterface,
        private messagesScrollContainer: HTMLElement
    ) {
    }

    public load(): void {
        const persistedMessages = this.storage.getSavedMessages();

        const loadedMessages: MessageInterface[] = [];
        persistedMessages.forEach((message) => {
            loadedMessages.push(this.chat.addMessage(message.content, message.isReply, true, message.id, message.data));
        });

        this.scrollToBottom();
        this.dispatchMessagesLoaded(loadedMessages);
    }

    private dispatchMessagesLoaded(messages: MessageInterface[]): void {
        this.chat.getElement().dispatchEvent(new CustomEvent('chat:messages-loaded', { detail: messages }));
    }

    private scrollToBottom(): void {
        this.messagesScrollContainer.scrollTop = this.messagesScrollContainer.scrollHeight;
    }
}

export default Load;