export function FileInputisEmpty(input: HTMLInputElement, dropzone: HTMLElement): void {
  let storedFiles: File[] = [];

  input.addEventListener('change', () => {
    if (input.files && input.files.length > 0) {
      storedFiles = Array.from(input.files);
    }
    const hasFiles = storedFiles.length > 0;
    dropzone.classList.toggle('is-empty', !hasFiles);
  });

  // Initial check
  const hasFiles = storedFiles.length > 0;
  dropzone.classList.toggle('is-empty', !hasFiles);
}