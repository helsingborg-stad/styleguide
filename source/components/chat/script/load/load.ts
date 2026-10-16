class Load implements LoadInterface {
	constructor(
		private chat: ChatInterface,
		private storage: StorageInterface,
		private messagesScrollContainer: HTMLElement,
	) {}

	public load(): void {
		const persistedItems = this.storage.getItems();

		persistedItems.forEach((item) => {
			if (item.type === 'message') {
				this.chat.addMessage(item.content, item.isReply, true, item.id, item.data);
				return;
			}

			this.chat.addInfo(item.content, true, item.id);
		});

		this.scrollToBottom();
	}

	private scrollToBottom(): void {
		this.messagesScrollContainer.scrollTop = this.messagesScrollContainer.scrollHeight;
	}
}

export default Load;
