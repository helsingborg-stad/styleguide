import { FileInputController } from './controller';

export function FileCounter(
  controller: FileInputController,
  dropzone: HTMLElement
): void {
  const counter = dropzone.querySelector<HTMLElement>('[data-js-file="counter"]');

  if (!counter) return;

  const maxAttr = dropzone.getAttribute('data-js-file-max');
  const maxFiles = maxAttr ? parseInt(maxAttr, 10) : Infinity;

  counter.setAttribute('data-counter-max', maxFiles.toString());

  const updateCounter = () => {
    const fileCount             = (controller.getFiles().length).toString();
    const fileCountCurrentValue = counter.getAttribute('data-counter-current');

    // If the value is new, trigger a the css animation again
    if (fileCountCurrentValue !== fileCount) {
      counter.classList.remove('do-animate');
      void counter.offsetWidth;
      counter.classList.add('do-animate');
    }

    counter.setAttribute('data-counter-current', fileCount);
  };

  controller.onFileAdded(updateCounter);
  controller.onFileRemoved(updateCounter);

  updateCounter();
}