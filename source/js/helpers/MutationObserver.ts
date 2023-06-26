export function mutationObserver(target: HTMLElement, options: Object, callback: Function) {
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            callback(mutation);
        });
    });
    observer.observe(target, options);
}