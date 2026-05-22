interface ChatInputInterface {
    subscribeToSend(callback: () => void): void;
    get(): string;
    clear(): void;
    disable(): void;
    enable(): void;
    disableSend(): void;
    enableSend(): void;
}