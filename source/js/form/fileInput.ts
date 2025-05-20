import { FileInputController } from './fileinput/controller';
import { FileInputUI } from './fileinput/ui';
import { FileInputDropzone } from './fileinput/dropzone';
import { HasMaxFiles } from './fileinput/hasMaxFiles';
import { FileCounter } from './fileinput/fileCounter';
import { FileInputisEmpty } from './fileinput/isEmpty';

class FileInput {
  constructor() {
      this.initFileInputs();
  }

  private initFileInputs() {
    const fileInputs = document.querySelectorAll('[data-js-file="input"]') || [];
    fileInputs.forEach((input) => {
      const controller  = new FileInputController(input as HTMLInputElement);
      const dropzone    = input.closest('[data-js-file="dropzone"]') as HTMLElement;
      
      if (dropzone) {
        //Main functionality
        new FileInputUI(dropzone, controller);
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