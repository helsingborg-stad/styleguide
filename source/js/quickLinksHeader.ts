class QuickLinksHeader {
    constructor() {
        this.handleQuickLinksMenu() && this.setAttribute();
    }

    handleQuickLinksMenu() :HTMLElement|null {
        return document.querySelector('#quicklinks-header');
    }
    
    setAttribute() {
        const quickLinksHeader = document.querySelector('#quicklinks-header');
        console.log(quickLinksHeader);

        const observer = new IntersectionObserver(
            ([e]) => e.target.classList.toggle('is-stuck', e.intersectionRatio < 1),
            { threshold: [1] }
        );

        if (quickLinksHeader) {
            observer.observe(quickLinksHeader);
        }
    }
}
export default QuickLinksHeader;