import { FileInputController } from "../../controller";
import FileIdCreator from "../helper/fileIdCreator";
import FileNameFormatter from "../helper/fileNameFormatter";
import FileSizeFormatter from "../helper/fileSizeFormatter";

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
        private fileIdCreator: FileIdCreator
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
        const fileType = file.type || 'unknown';
        listItem.setAttribute(this.fileIdAttribute, this.fileIdCreator.create(file));

        fileName.textContent = this.fileNameFormatter.format(file.name);
        fileSize.textContent = this.fileSizeFormatter.format(file.size);

        removeButton.addEventListener('click', () => {
            this.controller.removeFileFromList(file);
        });

        const url = URL.createObjectURL(file);
        console.log(fileType);
        if (fileType.startsWith('image/')) {
            const image = document.createElement('img');
            image.src = url;
            filePreview.appendChild(image);
        } else if (fileType.startsWith('video/')) {
            const video = document.createElement('video');
            video.src = url;
            video.controls = true;
            filePreview.appendChild(video);
        } else if (fileType.startsWith('audio/')) {
            const audio = document.createElement('audio');
            audio.src = url;
            audio.controls = true;
            filePreview.appendChild(audio);
        } else if (fileType === 'application/pdf') {
            const pdfFrame = document.createElement('iframe');
            pdfFrame.src = url;
            pdfFrame.style.width = '100%';
            pdfFrame.style.height = '100%';
            filePreview.appendChild(pdfFrame);
        }
        else {
            filePreview.classList.add('is-unsupported');
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