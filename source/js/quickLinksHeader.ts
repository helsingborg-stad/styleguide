class QuickLinksHeader {
    constructor() {
        this.handleQuickLinksMenu() && this.setAttribute();
    }

    handleQuickLinksMenu() :HTMLElement|null {
        return document.querySelector('#quicklinks-header.c-header--sticky');
    }
    
    setAttribute() {
        const quickLinksHeader = document.querySelector('#quicklinks-header');

        const observer = new IntersectionObserver(
            ([e]) => this.setClasses(e),
            { threshold: [1] }
        );

        if (quickLinksHeader) {
            observer.observe(quickLinksHeader);
        }
    }

    setClasses(event: IntersectionObserverEntry) {
        if (event.boundingClientRect.top <= 0) {
            event.target.classList.remove('not-stuck');
        } else {
            event.target.classList.add('not-stuck');
        }
    }
}
export default QuickLinksHeader;