import Chat from "./script/chat";
import ChatInput from "./script/chatInput";
import MessageFactory from "./script/messageFactory";
import MessageStore from "./script/messageStore";

/**
 * Initializes all chat component instances on the page.
 */
export function init() {
    document.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll('[data-js-chat]').forEach((chatContainer) => {
            const id = chatContainer.getAttribute('data-js-chat');
            const messageArea = chatContainer.querySelector('[data-js-message-area]') as HTMLElement | null;
            const replyMessageTemplate = chatContainer.querySelector('[data-js-reply-message-template]') as HTMLTemplateElement | null;
            const userMessageTemplate = chatContainer.querySelector('[data-js-user-message-template]') as HTMLTemplateElement | null;
            const chatInputContainer = chatContainer.querySelector('[data-js-chat-input]') as HTMLDivElement | null;
            const chatInput = chatContainer.querySelector('[data-js-chat-editable]') as HTMLElement | null;
            const sendButton = chatContainer.querySelector('[data-js-chat-send]') as HTMLInputElement | null;

            if (!id || !messageArea || !replyMessageTemplate || !userMessageTemplate || !chatInput || !sendButton || !chatInputContainer) {
                console.error('Chat component initialization failed: Missing required attributes or elements.');
                return;
            }

            const input = new ChatInput(chatInputContainer,chatInput, sendButton);
            const messageFactory = new MessageFactory(replyMessageTemplate, userMessageTemplate);
            const messageStore = new MessageStore();

            const chat = new Chat(
                messageArea,
                input,
                messageFactory,
                messageStore
            );

            document.dispatchEvent(new CustomEvent('chat:initialized', { detail: { 
                chat: chat
            }}));
        });
    }, { once: true });
}