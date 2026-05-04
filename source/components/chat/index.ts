import Chat from "./script/chat";
import ChatInput from "./script/input/chatInput";
import Clear from "./script/clear/clear";
import MessageFactory from "./script/messages/messageFactory";
import StorageFactory from "./script/storage/storageFactory";
import Load from "./script/load/load";
import PendingMessageManager from "./script/messages/pendingMessageManager";
import MessageRenderer from "./script/messages/messageRenderer";

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

            const store = new StorageFactory().create(id, chatContainer.hasAttribute('data-js-chat-persistent'));
            const clear = new Clear(store);
            const messageRenderer = new MessageRenderer(messageArea);
            const pendingMessageManager = new PendingMessageManager(messageFactory);

            const chat = new Chat(
                chatContainer as HTMLElement,
                messageArea,
                input,
                messageFactory,
                store,
                clear,
                messageRenderer,
                pendingMessageManager
            );

            new Load(chat, store, chatContainer as HTMLElement).load();
            chat.init();

            document.dispatchEvent(new CustomEvent('chat:initialized', { detail: { 
                chat: chat
            }}));
        });
    }, { once: true });
}