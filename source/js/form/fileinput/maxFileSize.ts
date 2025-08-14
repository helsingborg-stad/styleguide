import { FileInputController } from './controller';
import Notice from './notice';

export function MaxFileSize(
    controller: FileInputController,
    dropzone: HTMLElement,
    noticeHandler: Notice
): void {
    const maxFileSize = dropzone.getAttribute('data-js-file-max-size');

    if (!maxFileSize) return;

    const maxFileSizeBytes = parseFloat(maxFileSize) * 1024 * 1024;

    controller.onFileAdded((file) => {
        dropzone.classList.remove('file-size-error');
        if (file.size > maxFileSizeBytes) {
            controller.removeFileFromList(file);
            noticeHandler.showNotice([file]);
            dropzone.classList.add('file-size-error');
        }
    });
}