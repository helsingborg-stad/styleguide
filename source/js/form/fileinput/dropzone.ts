export class FileInputDropzone {
  private dropzone: HTMLElement;
  private input: HTMLInputElement;

  constructor(dropzone: HTMLElement, input: HTMLInputElement) {
    this.dropzone = dropzone;
    this.input = input;

    this.registerEvents();
  }

  private registerEvents() {
    // Prevent default drag behavior
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(event => {
      this.dropzone.addEventListener(event, (e) => e.preventDefault());
    });

    this.dropzone.addEventListener('dragenter', () => this.setDragging(true));
    this.dropzone.addEventListener('dragover', () => this.setDragging(true));
    this.dropzone.addEventListener('dragleave', () => this.setDragging(false));
    this.dropzone.addEventListener('drop', this.handleDrop.bind(this));
  }

  private setDragging(isDragging: boolean) {
    this.dropzone.classList.toggle('is-dragging', isDragging);
  }

  private handleDrop(event: DragEvent) {
    this.setDragging(false);

    if (!event.dataTransfer?.files.length) return;

    const droppedFiles = event.dataTransfer.files;

    // Update input files manually (not all browsers allow this directly)
    const dataTransfer = new DataTransfer();
    Array.from(droppedFiles).forEach(file => dataTransfer.items.add(file));
    this.input.files = dataTransfer.files;

    // Trigger change event manually
    const eventChange = new Event('change', { bubbles: true });
    this.input.dispatchEvent(eventChange);
  }
}