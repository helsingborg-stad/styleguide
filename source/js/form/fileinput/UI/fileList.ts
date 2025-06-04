import { FileInputController } from "../controller";

class FileList {
    private fileNameTarget: string = '[data-js-file="filename"]';
    private fileSizeTarget: string = '[data-js-file="filesize"]';
    private removeButtonTarget: string = '[data-js-file="remove"]';

    constructor(
        private list: HTMLElement,
        private listitemTemplate: HTMLTemplateElement,
        private controller: FileInputController,
    ) {
        // Initialize the file list UI
        this.setupFileList();
    }

    /**
     * Setup the file list UI, synchronizing with the controller.
     * This includes adding and removing files from the list.
     * 
     * @returns {void}
     */
  private setupFileList(): void {
    this.controller.onFileAdded((file) => {
      const fragment      = this.listitemTemplate.content.cloneNode(true) as DocumentFragment;
      const listItem      = fragment.firstElementChild as HTMLElement;
      const fileName      = listItem.querySelector(this.fileNameTarget) as HTMLElement;
      const fileSize      = listItem.querySelector(this.fileSizeTarget) as HTMLElement;
      const removeButton  = listItem.querySelector(this.removeButtonTarget) as HTMLButtonElement;
      console.log(file);

      // Create a unique ID for the file
      listItem.setAttribute('data-js-file-id', this.createFileId(file));

      // Set the file name and size, instead of placeholder
      fileName.textContent = this.formatName(file.name);
      fileSize.textContent = this.formatFileSize(file.size);

      // Bind on file remove action
      removeButton.addEventListener('click', () => {
        this.controller.removeFileFromList(file);
      });

      // Append the item to the file list
      this.list.appendChild(listItem);
    });
}

export default FileList;