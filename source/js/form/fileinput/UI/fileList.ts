import { FileInputController } from "../controller";
import FileIdCreator from "./helper/fileIdCreator";
import FileNameFormatter from "./helper/fileNameFormatter";
import FileSizeFormatter from "./helper/fileSizeFormatter";

class FileList {
    private fileNameTarget: string = '[data-js-file="filename"]';
    private fileSizeTarget: string = '[data-js-file="filesize"]';
    private removeButtonTarget: string = '[data-js-file="remove"]';
    private listItemTarget: string = '[data-js-file="listitem"]';
    private fileIdAttribute: string = 'data-js-file-id';

    constructor(
        private list: HTMLElement,
        private listitemTemplate: HTMLTemplateElement,
        private controller: FileInputController,
        private fileNameFormatter: FileNameFormatter,
        private fileSizeFormatter: FileSizeFormatter,
        private fileIdCreator: FileIdCreator
    ) {
    }

    /**
     * Setup the file list UI, synchronizing with the controller.
     * This includes adding and removing files from the list.
     * 
     * @returns {void}
     */
    public init(): void {
        this.controller.onFileAdded((file) => {
            this.handleAdded(file);
        });

        this.controller.onFileRemoved((file) => {
            this.handleRemoved(file);
        });
    }

    /**
     * Handle the addition of a file to the list.
     * This is triggered by the controller when a file is selected.
     * 
     * @param file  File
     */
    private handleAdded(file: File): void {
        const fragment = this.listitemTemplate.content.cloneNode(true) as DocumentFragment;
        const listItem = fragment.firstElementChild as HTMLElement;
        const fileName = listItem.querySelector(this.fileNameTarget) as HTMLElement;
        const fileSize = listItem.querySelector(this.fileSizeTarget) as HTMLElement;
        const removeButton = listItem.querySelector(this.removeButtonTarget) as HTMLButtonElement;
        console.log(file);

        listItem.setAttribute(this.fileIdAttribute, this.fileIdCreator.create(file));

        fileName.textContent = this.fileNameFormatter.format(file.name);
        fileSize.textContent = this.fileSizeFormatter.format(file.size);

        removeButton.addEventListener('click', () => {
            this.controller.removeFileFromList(file);
        });

        this.list.appendChild(listItem);
    }

    /**
     * Handle the removal of a file from the list.
     * This is triggered by the controller when a file is removed.
     * 
     * @param file  File
     */
    private handleRemoved(file: File): void {
        const items = this.list.querySelectorAll(this.listItemTarget);
        items.forEach((item) => {
            if (item.getAttribute(this.fileIdAttribute) === this.fileIdCreator.create(file)) {
                item.remove();
            }
        });
    }
}

export default FileList;