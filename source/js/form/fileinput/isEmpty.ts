export function FileInputisEmpty(input: HTMLInputElement, dropzone: HTMLElement): void {
  const updateClass = () => {
    const hasFiles = input.files && input.files.length > 0;
    dropzone.classList.toggle('is-empty', !hasFiles);
  };

  // Watch for manual file selection
  input.addEventListener('change', updateClass);

  // Initial check on load
  updateClass();
}