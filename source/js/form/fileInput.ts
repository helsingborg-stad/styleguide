import { FileInputController } from './fileinput/controller';
import { FileInputUI } from './fileinput/ui';
import { FileInputDropzone } from './fileinput/dropzone';
import { HasMaxFiles } from './fileinput/hasMaxFiles';
import { FileCounter } from './fileinput/fileCounter';
import { FileInputisEmpty } from './fileinput/isEmpty';
import FileInputButtonHandler from './fileinput/UI/fileInputButtonHandler';

class FileInput {
  constructor() {
      this.initFileInputs();
  }

  private initFileInputs() {
    document.querySelectorAll('[data-js-file="input"]').forEach(input => {
      const controller  = new FileInputController(input as HTMLInputElement);
      const dropzone    = input.closest('[data-js-file="dropzone"]') as HTMLElement;
      const button      = dropzone.querySelector('[data-js-file="button"]') as HTMLButtonElement;
      
      if (dropzone && button) {
        //Main functionality
        new FileInputButtonHandler(input as HTMLInputElement, button)
        new FileInputUI(dropzone, controller, input as HTMLInputElement);
        new FileInputDropzone(dropzone, input as HTMLInputElement);

        //Detached event listeners
        HasMaxFiles(controller, dropzone);
        FileCounter(controller, dropzone);
        FileInputisEmpty(controller, dropzone);
      }
    });
  }
}

export default FileInput;