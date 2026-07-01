import { getPendingMarkup } from "../helper/pending";
import type MessageFactory from "./messageFactory";

class PendingMessageManager {
    private pendingMessage: MessageInterface | null = null;

    constructor(private messageFactory: MessageFactory) {
    }

    public get(): MessageInterface | null {
        return this.pendingMessage;
    }

    public getOrCreate(): MessageInterface {
        if (this.pendingMessage) {
            return this.pendingMessage;
        }

        this.pendingMessage = this.messageFactory.create(getPendingMarkup(), true);

        return this.pendingMessage;
    }

    public resolve(message: MessageInterface): void {
        if (this.pendingMessage?.getId() === message.getId()) {
            this.pendingMessage = null;
        }
    }

    public clear(): void {
        this.pendingMessage = null;
    }
}

export default PendingMessageManager;