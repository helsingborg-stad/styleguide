import { FileInputController } from './controller';

export function HasMinFiles(
    controller: FileInputController,
    dropzone: HTMLElement
): void {

    const minAttr = dropzone.getAttribute('data-js-file-min');
    const minFiles = minAttr ? parseInt(minAttr, 10) : 0;
    const input = controller.getInputElement();
    const validationMessage = dropzone.querySelector<HTMLElement>('[data-js-upload-error-message-min-files]')?.getAttribute('data-js-upload-error-message-min-files') || 'Please upload the minimum required number of files.';

    const updateLimitState = () => {
        const fileCount = controller.getFiles().length;
        const hasPassedRequirement = fileCount >= minFiles || minFiles === 0;

        if (!hasPassedRequirement) {
            dropzone.classList.add('has-min-files-not-met');
            input.setCustomValidity(validationMessage);
        } else {
            dropzone.classList.remove('has-min-files-not-met');
            input.setCustomValidity('');
        }

        input.dispatchEvent(new Event('blur', { bubbles: true }));
    };

    controller.onFileAdded(updateLimitState);
    controller.onFileRemoved(updateLimitState);
}