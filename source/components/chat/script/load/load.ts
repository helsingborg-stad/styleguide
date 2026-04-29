class Load implements LoadInterface {
    constructor(
        private chat: ChatInterface,
        private storage: StorageInterface
    ) {

    }

    public load(): void {
        const persistedMessages = this.storage.getSavedMessages();

        persistedMessages.forEach((message) => {
            this.chat.addMessage(message.content, message.isReply);
        });
    }
}

export default Load;