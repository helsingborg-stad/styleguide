import { FileInputController } from './controller';

export function FileInputisEmpty(
  controller: FileInputController,
  dropzone: HTMLElement
): void {
  const updateClass = () => {
    const hasFiles = controller.getFiles().length > 0;
    dropzone.classList.toggle('is-empty', !hasFiles);
  };

  controller.onFileAdded(updateClass);
  controller.onFileRemoved(updateClass);

  updateClass();
}