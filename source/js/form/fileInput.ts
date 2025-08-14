import { FileInputController } from './fileinput/controller';
import { HasMaxFiles } from './fileinput/hasMaxFiles';
import { FileCounter } from './fileinput/fileCounter';
import { FileInputisEmpty } from './fileinput/isEmpty';
import Notice from './fileinput/notice';
import { MaxFileSize } from './fileinput/maxFileSize';
import { Dropzone } from './fileinput/dropzone';
import FileList from './fileinput/UI/fileList';
import FilePreviewFactory from './fileinput/UI/preview/filePreviewFactory';
import FileInputButtonHandler from './fileinput/UI/fileInputButtonHandler';

class FileInput {
    constructor() {
        this.initFileInputs();
    }

    private initFileInputs() {
        document.querySelectorAll<HTMLElement>('[data-js-file="dropzone"]').forEach((dropzone) => {
            const [
                input,
                button,
                listArea,
                template
            ] = this.getElementsFromDropzone(dropzone);

            if (!(input && button && listArea && template)) {
                console.error('FileInput: Missing required elements in dropzone.');
                return;
            }

            const controller = new FileInputController(input as HTMLInputElement);

            if (dropzone) {
                //Main functionality
                const noticeHandler = new Notice(dropzone);

                new FileList(controller, FilePreviewFactory.createFilePreviewRenderer(
                    controller,
                    dropzone,
                    listArea as HTMLElement,
                    template as HTMLTemplateElement
                )).init();

                new FileInputButtonHandler(input as HTMLInputElement, button as HTMLButtonElement).init();
                new Dropzone(dropzone, noticeHandler, input as HTMLInputElement);

                //Detached event listeners
                MaxFileSize(controller, dropzone, noticeHandler);
                HasMaxFiles(controller, dropzone);
                FileCounter(controller, dropzone);
                FileInputisEmpty(controller, dropzone);
            }
        });
    }

    private getElementsFromDropzone(dropzone: HTMLElement): [HTMLInputElement, HTMLButtonElement, HTMLElement, HTMLTemplateElement] {
        const input = dropzone.querySelector('[data-js-file="input"]') as HTMLInputElement;
        const button = dropzone.querySelector('[data-js-file="button"]') as HTMLButtonElement;
        const listArea = dropzone.querySelector('[data-js-file="list"]') as HTMLElement;
        const template = dropzone.querySelector('[data-js-file="listitem-template"]') as HTMLTemplateElement;

        return [input, button, listArea, template];
    }
}

export default FileInput;