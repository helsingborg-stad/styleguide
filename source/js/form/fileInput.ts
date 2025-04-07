import { FileInputController } from './controller';
import { FileInputUI } from './ui';

class FileInput {
  private form: HTMLElement;

  constructor(form: HTMLElement) {
    if (!form) return;

    this.form = form;
    this.initFileInputs();
  }

  private initFileInputs() {
    const fileInputs = this.form.querySelectorAll('[data-js-file="input"]');
    fileInputs.forEach((input) => {
      // Create and connect the controller and UI for each file input
      const controller = new FileInputController(input as HTMLInputElement);
      const dropzone = input.closest('[data-js-file="dropzone"]') as HTMLElement;

      // Initialize the UI with the controller
      if (dropzone) {
        new FileInputUI(dropzone, controller);
      }
    });
  }
}

export default FileInput;