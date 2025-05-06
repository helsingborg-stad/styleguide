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

  private bindEvents = (): void => {
    this.input.addEventListener('change', () => {
      const dropzone = this.input.closest('[data-js-file="dropzone"]') as HTMLElement;
      if (!dropzone) return;
  
      // Extract config from dropzone attributes
      const getMaxFiles = (): number =>
        parseInt(dropzone.getAttribute('data-js-file-max') || '', 10) || Infinity;
  
      const isMulti = dropzone.getAttribute('data-js-file-is-multi') === '1';
      const maxFiles = getMaxFiles();
  
      const existingFiles = this.getFiles();
      const newFiles = Array.from(this.input.files || []);
  
      // Determine how many files can be added
      const getRemainingSlots = (): number =>
        isMulti ? maxFiles - existingFiles.length : (existingFiles.length === 0 ? 1 : 0);
  
      const remainingSlots = getRemainingSlots();
  
      if (remainingSlots <= 0) {
        return;
      }
  
      // Limit incoming files
      const acceptedFiles = newFiles.slice(0, remainingSlots);
  
      // Create new FileList
      const dataTransfer = new DataTransfer();
      acceptedFiles.forEach(file => dataTransfer.items.add(file));
      this.input.files = dataTransfer.files;
  
      this.addFiles(acceptedFiles);
    });
  };

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
    this.input.dispatchEvent(new Event('change'));
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
