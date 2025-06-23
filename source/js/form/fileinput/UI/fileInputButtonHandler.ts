class FileInputButtonHandler {
    constructor(
        private input: HTMLInputElement,
        private button: HTMLButtonElement
    ) {}

    public init() {
        this.setupButton();
    }

    /**
     * Setup the button to trigger the file input click event.
     */
    private setupButton() {
        let isOpeningFilePicker = false;

        this.button.addEventListener('focusout', () => {
            if (isOpeningFilePicker) {
                isOpeningFilePicker = false;
                return;
            }

            this.input.dispatchEvent(new Event('blur'));
        });

        this.button.addEventListener('click', () => {
            isOpeningFilePicker = true;
            this.button.focus();
            this.input.click();
        });

        this.input.addEventListener('focusin', (e) => {
            this.button.focus();
        });
    }
}

export default FileInputButtonHandler;