interface ChatInterface {
    addMessage(message: string, isReply: boolean = false): void;
}