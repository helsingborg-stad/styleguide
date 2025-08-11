import { FileInputController } from './fileinput/controller';
import { FileInputUI } from './fileinput/ui';
import { FileInputDropzone } from './fileinput/dropzone';
import { HasMaxFiles } from './fileinput/hasMaxFiles';
import { FileCounter } from './fileinput/fileCounter';
import { FileInputisEmpty } from './fileinput/isEmpty';
import Notice from './fileinput/notice';
import { MaxFileSize } from './fileinput/maxFileSize';

class FileInput {
  constructor() {
      this.initFileInputs();
  }

  private initFileInputs() {
    document.querySelectorAll('[data-js-file="input"]').forEach((input) => {
      const controller  = new FileInputController(input as HTMLInputElement);
      const dropzone    = input.closest('[data-js-file="dropzone"]') as HTMLElement;
      
      if (dropzone) {
        //Main functionality
        const noticeHandler = new Notice(dropzone);
        new FileInputUI(dropzone, controller, input as HTMLInputElement);
        new FileInputDropzone(dropzone, noticeHandler, input as HTMLInputElement);

        //Detached event listeners
        MaxFileSize(controller, dropzone, noticeHandler);
        HasMaxFiles(controller, dropzone);
        FileCounter(controller, dropzone);
        FileInputisEmpty(controller, dropzone);
      }
    });
  }
}

export default FileInput;