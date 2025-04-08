export class FileInputController {
  private input: HTMLInputElement;
  private files: File[] = [];
  private fileAddedCallbacks: ((file: File) => void)[] = [];
  private fileRemovedCallbacks: ((file: File) => void)[] = [];

  constructor(input: HTMLInputElement) {
    this.input = input;
    this.bindEvents();
  }

  public getFiles(): File[] {
    return this.files;
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
      if (!this.files.some((f) => this.isSameFile(f, file))) {
        this.files.push(file);
        this.triggerFileAdded(file);
      }
    });
  
    const dataTransfer = new DataTransfer();
    this.files.forEach((f) => dataTransfer.items.add(f));
    this.input.files = dataTransfer.files;
  }

  private removeFile(file: File) {
    this.files = this.files.filter((f) => !this.isSameFile(f, file));
    const dataTransfer = new DataTransfer();
    this.files.forEach((f) => dataTransfer.items.add(f));
    this.input.files = dataTransfer.files;
    this.triggerFileRemoved(file);
  }
  
  private isSameFile(a: File, b: File): boolean {
    return (
      a.name === b.name &&
      a.size === b.size &&
      a.type === b.type &&
      a.lastModified === b.lastModified
    );
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
