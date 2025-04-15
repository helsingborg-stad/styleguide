export function debounce(func: () => void, delay: number): () => void {
  let timer: number | undefined;

  return () => {
    if (timer) clearTimeout(timer);
    timer = window.setTimeout(func, delay);
  };
}