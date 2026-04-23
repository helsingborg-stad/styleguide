class Message {
    constructor(
        private replyMessageTemplate: HTMLTemplateElement,
        private userMessageTemplate: HTMLTemplateElement
    ) {
    }
    public create(message: string, isReply: boolean = false): HTMLElement {
        const template = isReply ? this.replyMessageTemplate : this.userMessageTemplate;
        const messageElement = template.content.firstElementChild?.cloneNode(true) as HTMLElement;

        messageElement.textContent = message;
        messageElement.setAttribute('data-js-message-id', `message-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
        return messageElement;
    }
}

export default Message;