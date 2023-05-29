class Compressed {
    element: Element | null;
    parentElement: Element | null;
    siblingElements: HTMLElement[] | [];
    compressedAmount: number | null;
    className: string | null;
    toggle: boolean;

    constructor(element: Element) {
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

        if (this.element && this.parentElement) this.init();
    }

    private init() {
        this.element?.setAttribute('is-compressed', '');
        this.clickListener();
    }

    private clickListener() {
        this.element?.addEventListener('click', (e) => {
            e.preventDefault();
            this.handleClick();
            this.element?.remove();
        });
    }

    private handleClick() {
        if (this.element?.hasAttribute('is-compressed')) {
            this.element.removeAttribute('is-compressed');
            this.toggleSiblingElements(false);
        } else {
            this.element?.setAttribute('is-compressed', '');
            this.toggleSiblingElements(true);
        }
    }

    private toggleSiblingElements(isCompressed: boolean) {
        this.siblingElements?.forEach(sibling => {
            if (this.className) {
                isCompressed ? sibling.classList.add('is-hidden') : sibling.classList.remove(this.className);
            } else {
                sibling.style.display = isCompressed ? 'none' : '';
            }
        });
    }
}

export function initializeCompressed() {
    [...document.querySelectorAll('[data-js-compressed]')].forEach(element => {
        new Compressed(element);
    });
}

export default Compressed;
