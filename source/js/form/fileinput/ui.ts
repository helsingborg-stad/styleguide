export class FileInputController {
  private input: HTMLInputElement;
  private files: File[] = [];
  private fileAddedCallbacks: ((file: File) => void)[] = [];
  private fileRemovedCallbacks: ((file: File) => void)[] = [];

  constructor(input: HTMLInputElement) {
    this.input = input;
    this.bindEvents();
  }

  private bindEvents() {
    // Handle file selection
    this.input.addEventListener('change', (event) => {
      const newFiles = Array.from(this.input.files || []);
      this.addFiles(newFiles);
    });
  }

  private addFiles(files: File[]) {
    files.forEach((file) => {
      // Add file to the internal list and trigger callbacks
      if (!this.files.includes(file)) {
        this.files.push(file);
        this.triggerFileAdded(file);
      }
    });
  }

  private removeFile(file: File) {
    this.files = this.files.filter((f) => f !== file);
    this.triggerFileRemoved(file);
  }

  private triggerFileAdded(file: File) {
    this.fileAddedCallbacks.forEach((callback) => callback(file));
  }

  private triggerFileRemoved(file: File) {
    this.fileRemovedCallbacks.forEach((callback) => callback(file));
  }

  public onFileAdded(callback: (file: File) => void) {
    this.fileAddedCallbacks.push(callback);
  }

  public onFileRemoved(callback: (file: File) => void) {
    this.fileRemovedCallbacks.push(callback);
  }

  public removeFileFromList(file: File) {
    this.removeFile(file);
  }
}