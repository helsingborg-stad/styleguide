import { FileInputController } from './controller';

export class FileInputUI {
  private dropzone: HTMLElement;
  private controller: FileInputController;

  constructor(dropzone: HTMLElement, controller: FileInputController) {
    this.dropzone = dropzone;
    this.controller = controller;

    this.initUI();
  }

  private initUI() {
    const button = this.dropzone.querySelector('[data-js-file="button"]') as HTMLButtonElement;
    const input = this.dropzone.querySelector('[data-js-file="input"]') as HTMLInputElement;

    this.setupButton(button, input);
    this.setupFileList();
  }

  private setupButton(button: HTMLButtonElement, input: HTMLInputElement) {
    button.addEventListener('click', () => {
      input.click();
    });
  }

  private setupFileList() {
    const fileList = this.dropzone.querySelector('.c-fileinput__file-list') as HTMLElement;
    const listitemTemplate = this.dropzone.querySelector('[data-js-file="listitem-template"]') as HTMLTemplateElement;

    // Update UI when files are added
    this.controller.onFileAdded((file) => {
      const listItem = listitemTemplate.content.cloneNode(true) as HTMLElement;
      const fileName = listItem.querySelector('[data-js-file="filename"]') as HTMLElement;
      const fileSize = listItem.querySelector('[data-js-file="filesize"]') as HTMLElement;

      fileName.textContent = file.name;
      fileSize.textContent = this.formatFileSize(file.size);

      // Append the item to the file list
      fileList.appendChild(listItem);
    });

    // Update UI when files are removed
    this.controller.onFileRemoved((file) => {
      const fileItems = fileList.querySelectorAll('[data-js-file="listitem"]');
      fileItems.forEach((item) => {
        const nameElement = item.querySelector('[data-js-file="filename"]') as HTMLElement;
        if (nameElement.textContent === file.name) {
          item.remove();
        }
      });
    });
  }

  private formatFileSize(size: number): string {
    const kb = 1024;
    const mb = kb * 1024;
    const gb = mb * 1024;

    if (size >= gb) {
      return `${(size / gb).toFixed(2)} GB`;
    }
    if (size >= mb) {
      return `${(size / mb).toFixed(2)} MB`;
    }
    if (size >= kb) {
      return `${(size / kb).toFixed(2)} KB`;
    }

    return `${size} bytes`;
  }
}