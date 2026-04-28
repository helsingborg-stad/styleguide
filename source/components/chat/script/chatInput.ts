import { sanitizeMarkup } from "./helper/sanitize";

class ChatInput implements ChatInputInterface {
    private ACTION_BAR_ATTRIBUTE = 'data-js-chat-actions';

    constructor(
        private container: HTMLDivElement,
        private input: HTMLElement,
        private sendButton: HTMLInputElement
    ) {
        this.setupContainerListener();
        this.setupInputListeners();
    }

    
    public subscribeToSend(callback: () => void): void {
        this.sendButton.addEventListener('click', (event) => {
            event.preventDefault();
            callback();
        });
    }
    
    public get(): string {
        return this.input.innerHTML;
    }
    
    public clear(): void {
        this.input.innerHTML = '';
    }

    public disable(): void {
        this.input.setAttribute('contenteditable', 'false');
        this.sendButton.setAttribute('disabled', 'true');
    }

    public enable(): void {
        this.input.setAttribute('contenteditable', 'true');
        this.sendButton.removeAttribute('disabled');
    }

    private setupInputListeners(): void {
        this.input.addEventListener('paste', (event) => {
            this.handlePaste(event);
        });

        this.input.addEventListener('input', () => {
            this.sanitizeEditableContent();
        });
    }

    private setupContainerListener() {
        this.container.addEventListener('click', (event) => {
            if ((event.target as HTMLElement).hasAttribute(this.ACTION_BAR_ATTRIBUTE)) {
                event.preventDefault();
                this.input.focus();

                const range = document.createRange();
                range.selectNodeContents(this.input);
                range.collapse(false);

                const selection = window.getSelection();
                selection?.removeAllRanges();
                selection?.addRange(range);
            }
        });
    }

    private handlePaste(event: ClipboardEvent): void {
        event.preventDefault();

        const clipboardData = event.clipboardData;

        if (!clipboardData) {
            return;
        }

        const htmlContent = clipboardData.getData('text/html');
        const plainTextContent = clipboardData.getData('text/plain');
        const sanitizedContent = htmlContent
            ? sanitizeMarkup(htmlContent)
            : this.escapeHtml(plainTextContent);

        this.insertAtCaret(sanitizedContent);
        this.sanitizeEditableContent();
    }

    private sanitizeEditableContent(): void {
        const sanitizedMarkup = sanitizeMarkup(this.input.innerHTML);

        if (sanitizedMarkup === this.input.innerHTML) {
            return;
        }

        this.input.innerHTML = sanitizedMarkup;
        this.placeCaretAtEnd();
    }

    private insertAtCaret(html: string): void {
        const selection = window.getSelection();

        if (!selection || selection.rangeCount === 0 || !this.input.contains(selection.anchorNode)) {
            this.input.innerHTML += html;
            this.placeCaretAtEnd();
            return;
        }

        const range = selection.getRangeAt(0);
        range.deleteContents();

        const fragment = range.createContextualFragment(html);
        const lastInsertedNode = fragment.lastChild;
        range.insertNode(fragment);

        if (lastInsertedNode) {
            range.setStartAfter(lastInsertedNode);
            range.setEndAfter(lastInsertedNode);
            selection.removeAllRanges();
            selection.addRange(range);
        }
    }

    private placeCaretAtEnd(): void {
        const selection = window.getSelection();

        if (!selection) {
            return;
        }

        const range = document.createRange();
        range.selectNodeContents(this.input);
        range.collapse(false);

        selection.removeAllRanges();
        selection.addRange(range);
    }

    private escapeHtml(content: string): string {
        const temporaryContainer = document.createElement('div');
        temporaryContainer.textContent = content;

        return temporaryContainer.innerHTML;
    }
}

export default ChatInput;