class Notice {
    private noticeTemplate: HTMLTemplateElement;
    private notice: HTMLElement|null = null;
    private noticeMessageElement: HTMLElement|null = null;
    private noticeMessageSelector = '[data-js-notice-message]';
    private errorMessage = "";

    constructor(private field: HTMLElement) {
        this.noticeTemplate = this.field.querySelector('[data-js-file="notice-template"]') as HTMLTemplateElement;
        this.errorMessage = this.field.dataset.jsUploadErrorMessage ?? 'Following files could not be uploaded';
    }

    /**
     * Show a notice with a message
     * @param message The message to display in the notice
     */
    public showNotice(invalidFiles: File[]): void {
        if (!this.noticeTemplate) {
            console.error("Notice template not found"); 
            return
        }

        const notice = this.cloneNotice();
        const errorMessageElement = notice.querySelector(this.noticeMessageSelector) as HTMLElement;

        if (!errorMessageElement) {
            console.error(`Notice message element not found.`);
            return;
        }

        errorMessageElement.textContent = this.createErrorMessage(invalidFiles);

        this.field.prepend(notice);
        this.notice = notice;
        this.noticeMessageElement = errorMessageElement;
    }

    /**
     * Hide the notice element
     */
    public hideNotice(): void {
        this.notice?.remove();
        this.noticeMessageElement = null;
        this.notice = null;
    }

    /**
     * Create an error message from the invalid files
     * @param invalidFiles The list of invalid files
     * @returns A formatted error message
     */
    private createErrorMessage(invalidFiles: File[]): string {
        const fileNames = invalidFiles.map(file => file.name).join(', ');
        return `${this.errorMessage}: ${fileNames}`;
    }

    /**
     * Clones the notice element from the template.
     * @returns A cloned notice element from the template
     */
    private cloneNotice(): HTMLElement {
        const notice = this.noticeTemplate.content.cloneNode(true) as HTMLElement;
        return notice.firstElementChild as HTMLElement;
    }
}

export default Notice;