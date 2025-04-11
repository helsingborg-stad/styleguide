import { FileInputController } from './controller';

export function HasMaxFiles(
  controller: FileInputController,
  dropzone: HTMLElement
): void {
  const buttons = dropzone.querySelectorAll<HTMLButtonElement>('[data-js-file="button"], [data-js-file="drop"]');

  const maxAttr = dropzone.getAttribute('data-js-file-max');
  const maxFiles = maxAttr ? parseInt(maxAttr, 10) : Infinity;

  const isMulti = dropzone.getAttribute('data-js-file-is-multi') === '1';

  const updateLimitState = () => {
    const fileCount = controller.getFiles().length;
    const isAtLimit = fileCount >= maxFiles || (!isMulti && fileCount > 0);

    if(isAtLimit) {
      dropzone.setAttribute('data-js-file-disabled', 'true');
    } else {
      dropzone.removeAttribute('data-js-file-disabled');
    }

    dropzone.classList.toggle('is-full', isAtLimit);
    buttons.forEach(btn => {
      btn.disabled = isAtLimit;
    });
  };

  controller.onFileAdded(updateLimitState);
  controller.onFileRemoved(updateLimitState);

  updateLimitState();
}