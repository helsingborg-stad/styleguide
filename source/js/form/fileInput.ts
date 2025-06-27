import { FileInputController } from './fileinput/controller';
import { FileInputUI } from './fileinput/ui';
import { FileInputDropzone } from './fileinput/dropzone';
import { HasMaxFiles } from './fileinput/hasMaxFiles';
import { FileCounter } from './fileinput/fileCounter';
import { FileInputisEmpty } from './fileinput/isEmpty';
import FileInputButtonHandler from './fileinput/UI/fileInputButtonHandler';
import FileList from './fileinput/UI/fileList';
import FileNameFormatter from './fileinput/UI/helper/fileNameFormatter';
import FileIdCreator from './fileinput/UI/helper/fileIdCreator';
import FileSizeFormatter from './fileinput/UI/helper/fileSizeFormatter';

class FileInput {
    constructor() {
        this.initFileInputs();
    }

    private initFileInputs() {
        document.querySelectorAll('[data-js-file="input"]').forEach(input => {
            const controller = new FileInputController(input as HTMLInputElement);
            const dropzone = input.closest('[data-js-file="dropzone"]') as HTMLElement;
            const button = dropzone.querySelector('[data-js-file="button"]') as HTMLButtonElement;

            if (dropzone && button) {
                this.setupFileList(dropzone, controller, button);
                this.setupInputButton(input as HTMLInputElement, button);
                //Main functionality
                // new FileList(dropzone, controller, input as HTMLInputElement);
                new FileInputDropzone(dropzone, input as HTMLInputElement);

                //Detached event listeners
                HasMaxFiles(controller, dropzone);
                FileCounter(controller, dropzone);
                FileInputisEmpty(controller, dropzone);
            }
        });
    }

    private setupInputButton(
        input: HTMLInputElement,
        button: HTMLButtonElement
    ) {
        new FileInputButtonHandler(input as HTMLInputElement, button).init();
    }

    private setupFileList(
        dropzone: HTMLElement,
        controller: FileInputController,
        button: HTMLButtonElement
    ) {
        const fileList          = dropzone.querySelector('[data-js-file="list"]') as HTMLElement;
        const listitemTemplate  = dropzone.querySelector('[data-js-file="listitem-template"]') as HTMLTemplateElement;
        const fileNameFormatter = new FileNameFormatter();
        const fileSizeFormatter = new FileSizeFormatter();
        const fileIdCreator     = new FileIdCreator();

        new FileList(
            fileList,
            listitemTemplate,
            controller,
            fileNameFormatter,
            fileSizeFormatter,
            fileIdCreator
        ).init();
    }
}

export default FileInput;