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
            const loadedMessage = this.chat.addMessage(message.content, message.isReply, true, message.id, message.data);
            loadedMessages.push(loadedMessage);
        });

        this.scrollToBottom();
    }

    private scrollToBottom(): void {
        this.messagesScrollContainer.scrollTop = this.messagesScrollContainer.scrollHeight;
    }
}

export default Load;