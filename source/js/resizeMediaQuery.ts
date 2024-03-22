/* eslint-disable no-restricted-globals */
/* eslint-disable class-methods-use-this */
/**
 * Component Image
 */
class ResizeMediaQuery {
    private prefixName: string;
    private element: HTMLElement;
    private defaultBreakpoints: Object;
    private resizeClass: string | null;

    constructor(element: HTMLElement) {
  
        // Class vars
        this.prefixName = "--size-"; 
        this.defaultBreakpoints = {xs: 384, sm: 576, md: 768, lg: 960, xl: 1200};
        this.element = element;
        this.resizeClass = null;

        let resizeClass = element.getAttribute('data-observe-resizes');
        if (resizeClass !== '') {
            this.resizeClass = resizeClass;
        }

        // Init only if browser supports ResizeObserver
        if ('ResizeObserver' in self) {
            this.resizeObserver();
        }
    }

    private resizeObserver () {
        new ResizeObserver((entries) => {
            entries.forEach((entry) => {
                this.handleResize(entry);
            });  
        }).observe(this.element); 
    }

    private handleResize(entry: ResizeObserverEntry) {
        // If breakpoints are defined on the observed element,
        
        const element = entry.target as HTMLElement;
        const breakpoints = element.dataset.breakpoints ?
        JSON.parse(element.dataset.breakpoints) :
        this.defaultBreakpoints;

        // Update the matching breakpoints on the observed element.
        Object.keys(breakpoints).forEach((breakpoint) => {
            const minWidth = breakpoints[breakpoint];
            if (entry.contentRect.width >= minWidth) {
                element.classList.add((this.resizeClass ?? element.classList[0]) + this.prefixName + breakpoint);
            } else {
                element.classList.remove((this.resizeClass ?? element.classList[0]) + this.prefixName + breakpoint);
            }
        });
    }
}

export function initializeResizeMediaQuery() {
    const elements = document.querySelectorAll('[data-observe-resizes]');

    if (elements.length) {
        elements.forEach((element) => {
            new ResizeMediaQuery(element as HTMLElement);
        }); 
    }
    
    const observer = new MutationObserver(mutationsList => {
        mutationsList.forEach(mutation => {
        const elements = mutation.addedNodes;
        if (elements?.length) {
            elements.forEach(element => {
                    if (element?.nodeType === Node.ELEMENT_NODE && (element as HTMLElement).matches('[data-observe-resizes]')) {
                        new ResizeMediaQuery(element as HTMLElement);
                    }
                });
            }
        });
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });
}