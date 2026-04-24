import { sanitizeMarkup } from "./helper/sanitize";
import Message from "./message";

class MessageFactory {
    constructor(
        private replyMessageTemplate: HTMLTemplateElement,
        private userMessageTemplate: HTMLTemplateElement
    ) {
    }

    public create(message: string, isReply: boolean = false): MessageInterface {
        const template = isReply ? this.replyMessageTemplate : this.userMessageTemplate;
        const sanitizedMessage = sanitizeMarkup(message);
        const messageElement = template.content.firstElementChild?.cloneNode(true) as HTMLElement;

        messageElement.innerHTML = sanitizedMessage;
        const messageId = `message-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        messageElement.setAttribute('data-js-message-id', messageId);

        return new Message(isReply, messageElement, messageId, sanitizedMessage);
    }
}

export default MessageFactory;