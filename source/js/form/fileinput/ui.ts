import { FileInputController } from './controller';

export class FileInputUI {

  /**
   * Constructor for the FileInputUI class.
   * This class handles the UI interactions for the file input.
   * 
   * @param dropzone  HTMLElement
   * @param controller  FileInputController
   */
  constructor(
    private dropzone: HTMLElement, 
    private controller: FileInputController,
    private input: HTMLInputElement
  ) {
    this.initUI();
  }

  /**
   * Initialize the UI components of the file input.
   * This includes setting up the button, file list, and empty state.
   * 
   * @returns {void}
   */
  private initUI(): void {
    const button  = this.dropzone.querySelector('[data-js-file="button"]') as HTMLButtonElement;
    const input   = this.dropzone.querySelector('[data-js-file="input"]') as HTMLInputElement;

    // Binds
    this.focusButtonWhenInputGetFocus(button);
    // this.setupButton(button, input);
    this.setupFileList();
  }

//   /**
//    * Setup the button to trigger the file input click event.
//    * 
//    * @param button  HTMLButtonElement
//    * @param input  HTMLInputElement File input element
//    */
//   private setupButton(button: HTMLButtonElement, input: HTMLInputElement) {
//     let isOpeningFilePicker = false;

//     button.addEventListener('focusout', () => {
//       if (isOpeningFilePicker) {
//         isOpeningFilePicker = false;
//         return;
//       }

//       input.dispatchEvent(new Event('blur'));
//     });

//     button.addEventListener('click', () => {
//       isOpeningFilePicker = true;
//       button.focus();
//       input.click();
//     });
// }

  private focusButtonWhenInputGetFocus(button: HTMLButtonElement): void {
    this.input.addEventListener('focusin', (e) => {
      button.focus();
    });
  }


  /**
   * Setup the file list UI, synchronizing with the controller.
   * This includes adding and removing files from the list.
   * 
   * @returns {void}
   */
  private setupFileList(): void {
    const fileList          = this.dropzone.querySelector('[data-js-file="list"]') as HTMLElement;
    const listitemTemplate  = this.dropzone.querySelector('[data-js-file="listitem-template"]') as HTMLTemplateElement;

    /**
     * Add a file to the list when it is added to the controller.
     * This is triggered by the controller when a file is selected.
     * 
     * @param file  File
     */
    // this.controller.onFileAdded((file) => {
    //   const fragment      = listitemTemplate.content.cloneNode(true) as DocumentFragment;
    //   const listItem      = fragment.firstElementChild as HTMLElement;
    //   const fileName      = listItem.querySelector('[data-js-file="filename"]') as HTMLElement;
    //   const fileSize      = listItem.querySelector('[data-js-file="filesize"]') as HTMLElement;
    //   const removeButton  = listItem.querySelector('[data-js-file="remove"]') as HTMLButtonElement;
    //   console.log(file);

    //   // Create a unique ID for the file
    //   listItem.setAttribute('data-js-file-id', this.createFileId(file));

    //   // Set the file name and size, instead of placeholder
    //   fileName.textContent = this.formatName(file.name);
    //   fileSize.textContent = this.formatFileSize(file.size);

    //   // Bind on file remove action
    //   removeButton.addEventListener('click', () => {
    //     this.controller.removeFileFromList(file);
    //   });

    //   // Append the item to the file list
    //   fileList.appendChild(listItem);
    // });

    /**
     * Remove a file from the list when it is removed from the controller.
     * This is triggered by the controller when a file is removed.
     *  
     * @param file  File
     */
    // this.controller.onFileRemoved((file) => {
    //   const fileItems = fileList.querySelectorAll('[data-js-file="listitem"]');
    //   fileItems.forEach((item) => {
    //     if (item.getAttribute('data-js-file-id') === this.createFileId(file)) {
    //       item.remove();
    //     }
    //   });
    // });
  }

  /**
   * Create a unique ID for the file based on its properties.
   * This is used to identify files in the list.
   * 
   * @param file  File
   * @returns string
   */
  // private createFileId(file: File): string {
  //   const fileSignature = `${file.name}-${file.size}-${file.type}-${file.lastModified}`;
  //   return this.simpleHash(fileSignature);
  // }

  /**
   * Generate a simple hash from the input string.
   * 
   * @param input string
   * @returns string
   */
  // private simpleHash(input: string): string {
  //   let hash = 0;
  //   for (let i = 0; i < input.length; i++) {
  //       const char = input.charCodeAt(i);
  //       hash = (hash << 5) - hash + char; 
  //       hash |= 0;
  //   }
  //   return hash.toString(16);
  // }

  /**
   * Format file name to a more readable format.
   * This includes replacing underscores and dashes with spaces,
   * and capitalizing the first letter of each word.
   * @param file string
   * @returns 
   */
  // private formatName(file: string): string {
  //   // Split file into name and extension
  //   const lastDot = file.lastIndexOf('.');
  //   const namePart = lastDot !== -1 ? file.substring(0, lastDot) : file;
  //   const extension = lastDot !== -1 ? file.substring(lastDot) : '';
  
  //   // Replace underscores and dashes with spaces
  //   const cleanName = namePart.replace(/[_-]/g, ' ');
  
  //   // Normalize and capitalize each word
  //   const titleCased = cleanName
  //     .normalize('NFC') // Normalize combining characters
  //     .replace(/\p{L}+/gu, (word) =>
  //       word.charAt(0).toLocaleUpperCase() + word.slice(1)
  //     );
  
  //   return titleCased + extension;
  // }

  /**
   * Format file size to a human-readable format.
   * This includes converting bytes to KB, MB, or GB as appropriate.
   * @param size number
   * @returns string
   */
  // private formatFileSize(size: number): string {
  //   const kb = 1024;
  //   const mb = kb * 1024;
  //   const gb = mb * 1024;

  //   if (size >= gb) {
  //     return `${(size / gb).toFixed(2)} GB`;
  //   }
  //   if (size >= mb) {
  //     return `${(size / mb).toFixed(2)} MB`;
  //   }
  //   if (size >= kb) {
  //     return `${(size / kb).toFixed(2)} KB`;
  //   }

  //   return `${size} B`;
  // }
}