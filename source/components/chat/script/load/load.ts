class Load implements LoadInterface {
    constructor(
        private chat: ChatInterface,
        private storage: StorageInterface,
        private container: HTMLElement
    ) {

    }

    public load(): void {
        const persistedMessages = this.storage.getSavedMessages();

        persistedMessages.forEach((message) => {
            this.chat.addMessage(message.content, message.isReply, message.id);
        });

        this.scrollToBottom();
    }

    private scrollToBottom(): void {
        this.container.scrollTop = this.container.scrollHeight;
    }
}

export default Load;