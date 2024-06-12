import { intersectionObserver } from "./helpers/Observer";

class QuickLinksHeader {

    stickyQuickLinks: Element | null;
    
    constructor() {
        this.stickyQuickLinks = document.querySelector('#quicklinks-header.c-header--sticky');
        this.init();
    }

    private init() {
        if (!this.stickyQuickLinks) return;
        document.addEventListener('DOMContentLoaded', () => {
            this.observe();
        });
    }
    
    private observe() {
        const options = {threshold: [1]};

        intersectionObserver(this.stickyQuickLinks as HTMLElement, options, (entry: IntersectionObserverEntry) => {
            this.setClasses(entry);
        })
    }

    private setClasses(entry: IntersectionObserverEntry) {
        if (entry.boundingClientRect.top <= 0) {
            entry.target.classList.add('is-stuck');
        } else {
            entry.target.classList.remove('is-stuck');
        }
    }
}

export default QuickLinksHeader;