import { FileInputController } from './fileinput/controller';
import { FileInputUI } from './fileinput/ui';
import { FileInputDropzone } from './fileinput/dropzone';

class FileInput {
  private form: HTMLElement | undefined;

  constructor(form: HTMLElement) {
    if(form) {
        this.form = form;
        this.initFileInputs();
    }
  }

  private initFileInputs() {
    const fileInputs = this.form?.querySelectorAll('[data-js-file="input"]') || [];
    fileInputs.forEach((input) => {
      const controller  = new FileInputController(input as HTMLInputElement);
      const dropzone    = input.closest('[data-js-file="dropzone"]') as HTMLElement;
      if (dropzone) {
        new FileInputUI(dropzone, controller);
        new FileInputDropzone(dropzone, input as HTMLInputElement);
      }
    });
  }
}

export default FileInput;