export class FileInputDropzone {
  private dropzone: HTMLElement;
  private input: HTMLInputElement;
  private dragCounter = 0;

  constructor(dropzone: HTMLElement, input: HTMLInputElement) {
    this.dropzone = dropzone;
    this.input = input;

    this.registerEvents();
  }

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

  private setDragging(isDragging: boolean) {
    this.dropzone.classList.toggle('is-dragging', isDragging);
  }

  private handleDrop(event: DragEvent) {
    if (!event.dataTransfer?.files.length) return;

    const droppedFiles = event.dataTransfer.files;

    const dataTransfer = new DataTransfer();
    Array.from(droppedFiles).forEach(file => dataTransfer.items.add(file));
    this.input.files = dataTransfer.files;

    const eventChange = new Event('change', { bubbles: true });
    this.input.dispatchEvent(eventChange);
  }
}