class GoogleTranslate {
    element: HTMLAnchorElement;
    originalLink: string | null;
    constructor(element: HTMLAnchorElement) {
        this.element = element;
        this.originalLink = element.getAttribute('data-js-original-link');

        if (this.originalLink && this.originalLink !== '') {
            this.element.href = this.originalLink;
        }
    }
}

function runCondition(htmlElement: HTMLElement) {
    if (htmlElement.classList.contains('translated-ltr') || htmlElement.classList.contains('translated-rtl')) {
        [...document.querySelectorAll('a[data-js-original-link]')].forEach(element => {
            new GoogleTranslate(element as HTMLAnchorElement);
        });
    }  
}

export function initializeGoogleTranslate() {
    document.addEventListener('DOMContentLoaded', () => {
        const htmlElement = document.documentElement;
        runCondition(htmlElement);

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'class') {
                    runCondition(htmlElement);   
                }
            });
        });
          const config = { attributes: true, attributeFilter: ['class'] };
          observer.observe(htmlElement, config);
    });
}