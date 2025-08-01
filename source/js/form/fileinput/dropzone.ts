export class Dropzone {
  private dropzone: HTMLElement;
  private input: HTMLInputElement;
  private dragCounter = 0;

  constructor(dropzone: HTMLElement, input: HTMLInputElement) {
    this.dropzone = dropzone;
    this.input = input;

    this.registerEvents();
  }

  /**
   * Register drag and drop events on the dropzone
   */
  private registerEvents() {
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(event => {
      this.dropzone.addEventListener(event, (e) => e.preventDefault());
    });

    this.dropzone.addEventListener('dragenter', () => {
      this.dragCounter++;
      this.setDragging(true);
    });

    this.dropzone.addEventListener('dragleave', () => {
      this.dragCounter--;
      if (this.dragCounter <= 0) {
        this.setDragging(false);
      }
    });

    this.dropzone.addEventListener('drop', (e) => {
      this.dragCounter = 0;
      this.setDragging(false);
      this.handleDrop(e);
    });
  }

  /**
   * Set the dragging state of the dropzone
   * @param isDragging 
   */
  private setDragging(isDragging: boolean) {
    this.dropzone.classList.toggle('is-dragging', isDragging);
  }

  /**
   * Handle the drop event
   * @param event 
   */
  private handleDrop(event: DragEvent) {
    if (!event.dataTransfer?.files.length) {
      return;
    }

    //If input (this.input) is full, prevent drop.
    const fileCount = this.input.files ? this.input.files.length : 0;
    const maxFiles = this.input.hasAttribute('multiple') ? Infinity : 1;
    if (fileCount >= maxFiles) {
      event.preventDefault();
      return;
    }

    
    const droppedFiles = Array.from(event.dataTransfer.files);
  
    const validFiles = this.filterAcceptedFiles(droppedFiles);
  
    if (!validFiles.length) return;
  
    const finalFiles = this.limitFilesByMultiple(validFiles);
  
    const dataTransfer = new DataTransfer();
    finalFiles.forEach(file => dataTransfer.items.add(file));
    this.input.files = dataTransfer.files;
  
    const eventChange = new Event('change', { bubbles: true });
    this.input.dispatchEvent(eventChange);
  }

  /**
   * Prevent user from uploading files that are not accepted by the input
   * @param files 
   * @returns 
   */
  private filterAcceptedFiles(files: File[]): File[] {
    const acceptAttr = this.input.accept;
    if (!acceptAttr) return files;
  
    const acceptedTypes = acceptAttr
      .split(',')
      .map(type => type.trim().toLowerCase());
  
    return files.filter(file => {
      const fileType = file.type.toLowerCase();
      const fileExt = '.' + file.name.split('.').pop()?.toLowerCase();
  
      return acceptedTypes.some(accept => {
        if (accept.startsWith('.')) return fileExt === accept;
        if (accept.endsWith('/*')) return fileType.startsWith(accept.replace('/*', ''));
        return fileType === accept;
      });
    });
  }
  
  /**
   * Limit the number of files to be uploaded
   * @param files 
   * @returns 
   */
  private limitFilesByMultiple(files: File[]): File[] {
    return this.input.hasAttribute('multiple') ? files : files.slice(0, 1);
  }
}