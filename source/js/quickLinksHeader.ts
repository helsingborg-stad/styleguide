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
        const observer = new IntersectionObserver(
            ([e]) => this.setClasses(e),
            { threshold: [1] }
        );

        if (this.stickyQuickLinks) {
            observer.observe(this.stickyQuickLinks);
        }
    }

    private setClasses(event: IntersectionObserverEntry) {
        if (event.boundingClientRect.top <= 0) {
            event.target.classList.add('is-stuck');
        } else {
            event.target.classList.remove('is-stuck');
        }
    }
}

export default QuickLinksHeader;