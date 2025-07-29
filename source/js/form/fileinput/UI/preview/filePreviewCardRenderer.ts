import { FileInputController } from "../../controller";
import FileIdCreator from "../helper/fileIdCreator";
import FileNameFormatter from "../helper/fileNameFormatter";
import FileSizeFormatter from "../helper/fileSizeFormatter";

class FilePreviewCardRenderer implements FilePreviewRenderer {
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
     * Adds a file to the preview list.
     * @param {File} file - The file to be added.
     */
    public add(file: File): void {
        const [listItem, fileName, fileSize, removeButton] = this.getCloneTemplateElements();

        if (!(listItem && fileName && fileSize && removeButton)) {
            console.error("Failed to clone template elements for file preview list.");
            return;
        }
        const fileType = file.type || 'unknown';
        listItem.setAttribute(this.fileIdAttribute, this.fileIdCreator.create(file));

        fileName.textContent = this.fileNameFormatter.format(file.name);
        fileSize.textContent = this.fileSizeFormatter.format(file.size);

        removeButton.addEventListener('click', () => {
            this.controller.removeFileFromList(file);
        });

        if (fileType.startsWith('image/')) {
            document.createElement('img').src = URL.createObjectURL(file);
            

        }

        this.list.appendChild(listItem);
    }

    remove(file: File): void {
        // Implementation for removing the file preview card
        // This will use the controller to find and remove the file from the list
    }

    /**
     * Retrieves the cloned template elements for file preview.
     * @returns {HTMLElement[]} An array containing the cloned list item, file name, file size, and remove button.
     */
    private getCloneTemplateElements(): [HTMLElement, HTMLElement, HTMLElement, HTMLButtonElement] {
        const fragment = this.listitemTemplate.content.cloneNode(true) as DocumentFragment;
        const listItem = fragment.firstElementChild as HTMLElement;
        const fileName = listItem?.querySelector(this.fileNameTarget) as HTMLElement;
        const fileSize = listItem?.querySelector(this.fileSizeTarget) as HTMLElement;
        const removeButton = listItem?.querySelector(this.removeButtonTarget) as HTMLButtonElement;

        return [listItem, fileName, fileSize, removeButton];
    }
}

export default FilePreviewCardRenderer;