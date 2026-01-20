import { FileInputController } from './controller';

export function HasMinFiles(
    controller: FileInputController,
    dropzone: HTMLElement
): void {

    const minAttr = dropzone.getAttribute('data-js-file-min');
    const minFiles = minAttr ? parseInt(minAttr, 10) : 0;
    const input = controller.getInputElement();

    const updateLimitState = () => {
        const fileCount = controller.getFiles().length;
        console.log('File count:', fileCount, 'Min files required:', minFiles);
        const hasPassedRequirement = fileCount >= minFiles || minFiles === 0;

        if (!hasPassedRequirement) {
            dropzone.classList.add('has-min-files-not-met');
            input.setCustomValidity('-');
        } else {
            dropzone.classList.remove('has-min-files-not-met');
            input.setCustomValidity('');
        }
    };

    controller.onFileAdded(updateLimitState);
    controller.onFileRemoved(updateLimitState);

    updateLimitState();
}