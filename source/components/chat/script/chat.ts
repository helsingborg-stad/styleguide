class Chat implements ChatInterface {
    constructor(
        private chat: HTMLElement,
        private form: HTMLFormElement,
        private messageArea: HTMLElement,
        private message: MessageInterface,
        private input: HTMLInputElement,
        private id: string
    ) {
        this.setupFormListener();

        console.log(`Chat ${this.id} initialized successfully with elements:`, {
            chat: this.chat,
            form: this.form,
            messageArea: this.messageArea,
            input: this.input
        });
    }

    private setupFormListener() {
        this.form.addEventListener('submit', (event) => {
            event.preventDefault();
            console.log(`Chat ${this.id} - User submitted message:`, this.input.value);
            const message = this.input.value.trim();
            if (message) {
                this.addMessage(message, false);
                this.input.value = '';
            }
        });
    }

    public addMessage(messageContent: string, isReply: boolean = false): void {
        const messageElement = this.message.create(messageContent, isReply);
        this.messageArea.appendChild(messageElement);
    }
}

export default Chat;