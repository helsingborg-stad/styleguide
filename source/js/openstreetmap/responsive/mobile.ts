export function mobile(container: HTMLElement, baseClass: string) {
    const element = container.querySelector('.c-openstreetmap__map');
        console.log(element);
    if (element) {
        isSticky(element);
    }
}

function isSticky(element: Element) {
    const addObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                element.classList.add('is-sticky');
            }
        });
    }, { threshold: [0] });

    const removeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                element.classList.remove('is-sticky');
            }
        });
    }, { threshold: [1] });

    addObserver.observe(element);
    removeObserver.observe(element);
}