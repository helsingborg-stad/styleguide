class Load implements LoadInterface {
    constructor(
        private chat: ChatInterface,
        private storage: StorageInterface
    ) {

    }

    public load(): void {
        const persistedMessages = this.storage.getSavedMessages();

        persistedMessages.forEach((message) => {
            this.chat.restoreMessage(message.content, message.isReply, message.id);
        });
    }
}

export default Load;