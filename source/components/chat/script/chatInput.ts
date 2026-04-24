class ChatInput implements ChatInputInterface {
    private ACTION_BAR_ATTRIBUTE = 'data-js-chat-actions';

    constructor(
        private container: HTMLDivElement,
        private input: HTMLInputElement,
        private sendButton: HTMLInputElement
    ) {
        this.setupContainerListener();
    }

    
    public subscribeToSend(callback: () => void): void {
        this.sendButton.addEventListener('click', (event) => {
            event.preventDefault();
            callback();
        });
    }
    
    public get(): string {
        return this.input.innerHTML;
    }
    
    public clear(): void {
        this.input.innerHTML = '';
    }

    public disable(): void {
        this.input.setAttribute('contenteditable', 'false');
        this.sendButton.setAttribute('disabled', 'true');
    }

    public enable(): void {
        this.input.setAttribute('contenteditable', 'true');
        this.sendButton.removeAttribute('disabled');
    }

    private setupContainerListener() {
        this.container.addEventListener('click', (event) => {
            if ((event.target as HTMLElement).hasAttribute(this.ACTION_BAR_ATTRIBUTE)) {
                event.preventDefault();
                this.input.focus();
            }
        });
    }
}

export default ChatInput;