export function mutationObserver(target: HTMLElement, options: Object, callback: Function) {
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            callback(mutation);
        });
    });
    observer.observe(target, options);
}

export function intersectionObserver(target: HTMLElement, options: Object, callback: Function) {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            callback(entry);
        })
    }, options);

    observer.observe(target);
}