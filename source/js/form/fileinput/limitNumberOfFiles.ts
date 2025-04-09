import { FileInputController } from './controller';

/**
 * Limits the number of files in the input element based on maxFiles.
 */
export function LimitNumberOfFiles(
  controller: FileInputController,
  dropzone: HTMLElement
): void {
  const input = dropzone.querySelector<HTMLInputElement>('[data-js-file="input"]');
  if (!input) return;

  const maxAttr = dropzone.getAttribute('data-js-file-max');
  const maxFiles = maxAttr ? parseInt(maxAttr, 10) : Infinity;

  const isMulti = dropzone.getAttribute('data-js-file-is-multi') === '1';

  const trimFileList = () => {
    if (!input.files || input.files.length === 0) return;

    const shouldTrim = input.files.length > maxFiles || (!isMulti && input.files.length > 1);
    if (!shouldTrim) return;

    const dataTransfer = new DataTransfer();
    const filesToKeep = isMulti
      ? Array.from(input.files).slice(0, maxFiles)
      : [input.files[0]];

    filesToKeep.forEach(file => dataTransfer.items.add(file));
    input.files = dataTransfer.files;

    // Re-dispatch a change event since we manually updated the input
    input.dispatchEvent(new Event('change', { bubbles: true }));
  };

  // Watch for changes to the input
  input.addEventListener('change', trimFileList);
}