class FileInputButtonHandler {
    constructor(
        private input: HTMLInputElement,
        private button: HTMLButtonElement
    ) {}

    /**
     * Setup the button to trigger the file input click event.
     */
    public init() {
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
            console.log(this.button);
            this.button.focus();
            this.input.click();
        });

        this.input.addEventListener('focusin', (e) => {
            this.button.focus();
        });
    }
}

export default FileInputButtonHandler;