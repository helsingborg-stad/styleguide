import Chat from "./script/chat";
import Message from "./script/message";

/**
 * Initializes all chat component instances on the page.
 */
export function init() {
    document.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll('[data-js-chat]').forEach((chatContainer) => {
            const id = chatContainer.getAttribute('data-js-chat');
            const form = chatContainer.querySelector('[data-js-chat-form]') as HTMLFormElement | null;
            const messageArea = chatContainer.querySelector('[data-js-message-area]') as HTMLElement | null;
            const replyMessageTemplate = chatContainer.querySelector('[data-js-reply-message-template]') as HTMLTemplateElement | null;
            const userMessageTemplate = chatContainer.querySelector('[data-js-user-message-template]') as HTMLTemplateElement | null;
            const chatInput = chatContainer.querySelector('[data-js-message-input]') as HTMLInputElement | null;

            console.log(`Initializing chat component with ID: ${id}`, {
                form,
                messageArea,
                replyMessageTemplate,
                userMessageTemplate,
                chatInput
            });
            if (!id || !form || !messageArea || !replyMessageTemplate || !userMessageTemplate || !chatInput) {
                console.error('Chat component initialization failed: Missing required attributes or elements.');
                return;
            }

            const message = new Message(replyMessageTemplate, userMessageTemplate);

            const chat = new Chat(
                chatContainer as HTMLElement,
                form,
                messageArea,
                message,
                chatInput,
                id
            );

            document.dispatchEvent(new CustomEvent('chat:initialized', { detail: { 
                chat: chat
            }}));
        });
    }, { once: true });
}