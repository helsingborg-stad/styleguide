import { FileInputController } from './fileinput/controller';
import { HasMaxFiles } from './fileinput/hasMaxFiles';
import { FileCounter } from './fileinput/fileCounter';
import { FileInputisEmpty } from './fileinput/isEmpty';
import FileInputButtonHandler from './fileinput/UI/fileInputButtonHandler';
import FileList from './fileinput/UI/fileList';
import FilePreviewFactory from './fileinput/UI/preview/filePreviewFactory';

class FileInput {
    constructor() {
        this.init();
    }

    private init() {
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

            const controller = new FileInputController(input);

            new FileList(controller, FilePreviewFactory.createFilePreviewRenderer(controller, dropzone, listArea, template)).init();
            new FileInputButtonHandler(input, button).init();

            /* Detached listeners */
            HasMaxFiles(controller, dropzone);
            FileCounter(controller, dropzone);
            FileInputisEmpty(controller, dropzone);


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