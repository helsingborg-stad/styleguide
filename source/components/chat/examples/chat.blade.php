
<script>
    const getRandomResponse = () => {
        const responses = [
            "Interesting… tell me more.",
            "I see. What do you mean exactly?",
            "That sounds important.",
            "Can you explain that differently?",
            "Hmm, I'm not sure I understand.",
            "Why do you think that is?",
            "How does that make you feel?",
            "What do you think about that?",
            "That's a good point.",
            "I hadn't thought of it that way before."
        ];

        const index = Math.floor(Math.random() * responses.length);
        return responses[index];
    }

    document.addEventListener('chat:initialized', (e) => {
        const chat = e.detail;
        chat.addMessage("Hello! I'm your friendly chatbot. How can I assist you today?", true);

        chat.getElement().addEventListener('chat:message-added', (e) => {
			const message = e.detail;

			if (message.getIsReply()) {
				return;
			}

            chat.disableSend();
            const pendingMessage = chat.addPendingMessage();
            const responseToCome = getRandomResponse();

            setTimeout(() => {
                chat.editMessage(responseToCome, pendingMessage);
                chat.enableSend();
            }, Math.random() * (2000 - 500) + 500);

		});
    });
</script>

@chat([
    'id' => 'example-chat',
])
@endchat