import { FileInputController } from "../../controller";
import FileIdCreator from "../helper/fileIdCreator";
import FileNameFormatter from "../helper/fileNameFormatter";
import FileSizeFormatter from "../helper/fileSizeFormatter";
import PreviewCreator from "./previewCreator";

class FilePreviewCardRenderer implements FilePreviewRenderer {
    private fileNameTarget: string = '[data-js-file="filename"]';
    private fileSizeTarget: string = '[data-js-file="filesize"]';
    private removeButtonTarget: string = '[data-js-file="remove"]';
    private listItemTarget: string = '[data-js-file="listitem"]';
    private filePreviewTarget: string = '[data-js-file="preview"]';
    private fileIdAttribute: string = 'data-js-file-id';

    constructor(
        private list: HTMLElement,
        private listitemTemplate: HTMLTemplateElement,
        private controller: FileInputController,
        private fileNameFormatter: FileNameFormatter,
        private fileSizeFormatter: FileSizeFormatter,
        private fileIdCreator: FileIdCreator,
        private previewCreator: PreviewCreator
    ) {
    }

    /**
     * Adds a file to the preview list.
     * @param {File} file - The file to be added.
     */
    public add(file: File): void {
        const [listItem, fileName, fileSize, removeButton, filePreview] = this.getCloneTemplateElements();

        if (!(listItem && fileName && fileSize && removeButton && filePreview)) {
            console.error("Failed to clone template elements for file preview list.");
            return;
        }

        listItem.setAttribute(this.fileIdAttribute, this.fileIdCreator.create(file));
        this.setFileInfo(file, fileName, fileSize);
        this.setupRemoveButton(file, removeButton);
        const previewItem = this.previewCreator.createPreview(file);

        if (!previewItem) {
            filePreview.classList.add('is-unsupported');
        } else {
            filePreview.appendChild(previewItem);
        }

        this.list.appendChild(listItem);
    }

    /**
     * Removes a file from the preview list.
     * @param {File} file - The file to be removed.
     */
    public remove(file: File): void {
        const items = this.list.querySelectorAll(this.listItemTarget);
        items.forEach((item) => {
            if (item.getAttribute(this.fileIdAttribute) === this.fileIdCreator.create(file)) {
                item.remove();
            }
        });
    }

    /**
     * Sets up the remove button for the file preview.
     * @param {File} file - The file associated with the remove button.
     * @param {HTMLButtonElement} removeButton - The button element to set up.
     */
    private setupRemoveButton(file: File, removeButton: HTMLButtonElement): void {
        removeButton.addEventListener('click', () => {
            this.controller.removeFileFromList(file);
        });
    }

    /**
     * Sets the file name and size in the preview.
     * @param {HTMLElement} fileName - The element to display the file name.
     * @param {HTMLElement} fileSize - The element to display the file size.
     */
    private setFileInfo(file: File, fileName: HTMLElement, fileSize: HTMLElement): void {
        fileName.textContent = this.fileNameFormatter.format(file.name);
        fileSize.textContent = this.fileSizeFormatter.format(file.size || (file as any).fakeSize || 0);
    }

    /**
     * Retrieves the cloned template elements for file preview.
     * @returns {HTMLElement[]} An array containing the cloned list item, file name, file size, and remove button.
     */
    private getCloneTemplateElements(): [HTMLElement, HTMLElement, HTMLElement, HTMLButtonElement , HTMLElement] {
        const fragment = this.listitemTemplate.content.cloneNode(true) as DocumentFragment;
        const listItem = fragment.firstElementChild as HTMLElement;
        const fileName = listItem?.querySelector(this.fileNameTarget) as HTMLElement;
        const fileSize = listItem?.querySelector(this.fileSizeTarget) as HTMLElement;
        const removeButton = listItem?.querySelector(this.removeButtonTarget) as HTMLButtonElement;
        const filePreview = listItem?.querySelector(this.filePreviewTarget) as HTMLElement;

        return [listItem, fileName, fileSize, removeButton, filePreview];
    }
}

export default FilePreviewCardRenderer;