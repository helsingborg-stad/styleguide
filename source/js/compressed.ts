class Compressed {
    element: HTMLElement | null = null;
    parentElement: HTMLElement | null = null;
    siblingElements: HTMLElement[] | [] = [];
    compressedAmount: number | null = null; 
    className: string | null = null;
    toggle: boolean = false;

    constructor(element: HTMLElement) {
        this.element = element;
        this.parentElement = element.parentElement;
        this.compressedAmount = this.element.hasAttribute('data-js-compressed')
            ? parseInt(this.element.getAttribute('data-js-compressed') || '0', 10)
            : 0;
        this.siblingElements = [...(this.parentElement?.children || [])]
            .filter(child => child !== this.element)
            .slice(this.compressedAmount!) as HTMLElement[];
        this.className = this.element?.getAttribute('data-js-compressed-class');
        this.toggle = this.element.hasAttribute('data-js-compressed-toggle');

        if (!this.className) {
            this.siblingElements.forEach(sibling => {
                sibling.style.display = 'none';
            });
        }

        this.init();
    }

    private init() {
        if (!this.element || !this.parentElement || this.siblingElements.length <= 0 ) return;
        this.element.setAttribute('is-compressed', '');
        this.element.style.cursor = 'pointer';
        this.clickListener();
    }

    private clickListener() {
        this.element?.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.handleClick();
            
            // if (!this.toggle) this.element?.remove();
        });
    }

    private handleClick() {
        if (this.element?.hasAttribute('is-compressed')) {
            this.element.removeAttribute('is-compressed');
            console.log("has element attribute")
            this.toggleSiblingElements(false);
        } else {
            this.element?.setAttribute('is-compressed', '');
            this.toggleSiblingElements(true);
        }
    }

    private toggleSiblingElements(isCompressed: boolean) {
        this.siblingElements?.forEach(sibling => {
            if (this.className) {
                isCompressed ? sibling.classList.add(this.className) : sibling.classList.remove(this.className);
            } else {
                sibling.style.display = isCompressed ? 'none' : '';
            }
        });
    }
}

function initializeElements(elements: Array<Element>) {
    elements.forEach(element => {
        // Only initialize if the element has not been initialized before.
        if (element.hasAttribute('compressed-was-initialized')) {
            return;
        }
        
        element.setAttribute('compressed-was-initialized', '');
        
        new Compressed(element as HTMLElement);
    });
}

export function initializeCompressed() {
    initializeElements([...document.querySelectorAll('[data-js-compressed]')]);
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (!(node instanceof HTMLElement)) {
                    return;
                }

                if (node.hasAttribute('data-js-compressed')) {
                    initializeElements([node]); 
                } else {
                    initializeElements([...node.querySelectorAll('[data-js-compressed]')]);
                }
            });
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

export default Compressed;
