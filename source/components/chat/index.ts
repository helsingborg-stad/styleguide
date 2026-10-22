import Banner from './script/banner/banner';
import Chat from './script/chat';
import Clear from './script/clear/clear';
import InfoHandler from './script/handler/infoHandler';
import MessageHandler from './script/handler/messageHandler';
import PendingMessageHandler from './script/handler/pendingMessageHandler';
import InfoFactory from './script/info/infoFactory';
import InfoRenderer from './script/info/infoRenderer';
import ChatInput from './script/input/chatInput';
import Load from './script/load/load';
import MessageFactory from './script/messages/messageFactory';
import MessageRenderer from './script/messages/messageRenderer';
import PendingMessageManager from './script/messages/pendingMessageManager';
import StorageFactory from './script/storage/storageFactory';

/**
 * Initializes all chat component instances on the page.
 */
export function init() {
	document.addEventListener(
		'DOMContentLoaded',
		() => {
			document.querySelectorAll('[data-js-chat]').forEach((chatContainer) => {
				const id = chatContainer.getAttribute('data-js-chat');
				const messagesContainer = chatContainer.querySelector('[data-js-messages-container]') as HTMLElement | null;
				const messagesScrollContainer = chatContainer.querySelector('[data-js-message-area]') as HTMLElement | null;
				const replyMessageTemplate = chatContainer.querySelector('[data-js-reply-message-template]') as HTMLTemplateElement | null;
				const userMessageTemplate = chatContainer.querySelector('[data-js-user-message-template]') as HTMLTemplateElement | null;
				const chatInputContainer = chatContainer.querySelector('[data-js-chat-input]') as HTMLDivElement | null;
				const chatInput = chatContainer.querySelector('[data-js-chat-editable]') as HTMLElement | null;
				const sendButton = chatContainer.querySelector('[data-js-chat-send]') as HTMLInputElement | null;
				const chatInfoTemplate = chatContainer.querySelector('[data-js-info-template]') as HTMLTemplateElement | null;
				const bannerElement = chatContainer.querySelector('[data-js-chat-banner]') as HTMLElement | null;

				if (!id || !messagesContainer || !messagesScrollContainer || !replyMessageTemplate || !userMessageTemplate || !chatInput || !sendButton || !chatInputContainer || !chatInfoTemplate || !bannerElement) {
					console.error('Chat component initialization failed: Missing required attributes or elements.');
					return;
				}

				const input = new ChatInput(chatInputContainer, chatInput, sendButton);
				const messageFactory = new MessageFactory(replyMessageTemplate, userMessageTemplate);
				const infoFactory = new InfoFactory(chatInfoTemplate);
				const shouldPersistByDefault = chatContainer.hasAttribute('data-js-chat-persistent');

				const store = new StorageFactory().create(id, shouldPersistByDefault);
				const clear = new Clear(store);
				const messageRenderer = new MessageRenderer(messagesContainer, messagesScrollContainer);
				const infoRenderer = new InfoRenderer(messagesContainer);
				const pendingMessageManager = new PendingMessageManager(messageFactory);
				const messageHandler = new MessageHandler(chatContainer as HTMLElement, messageFactory, store, messageRenderer, pendingMessageManager);
				const pendingMessageHandler = new PendingMessageHandler(chatContainer as HTMLElement, pendingMessageManager, messageRenderer, store);
				const infoHandler = new InfoHandler(chatContainer as HTMLElement, infoFactory, infoRenderer, store);
				const banner = new Banner(bannerElement);

				const chat = new Chat(chatContainer as HTMLElement, messagesScrollContainer as HTMLElement, input, clear, banner, messageHandler, pendingMessageHandler, infoHandler, shouldPersistByDefault);

				new Load(chat, store, messagesScrollContainer).load();
				chat.init();

				document.dispatchEvent(new CustomEvent('chat:initialized', { detail: chat }));
			});
		},
		{ once: true },
	);
}
