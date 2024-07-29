class HandlePostsLoadingSpinner {
    constructor(private container: HTMLElement) {
        const spinner = this.container.querySelector('[data-js-map-endpoint-spinner]');
        const noPostsTemplate = this.container.querySelector('[data-js-map-no-posts-found]');

        if (spinner && noPostsTemplate) {
            this.listenForPostsDoneFetching(spinner as HTMLElement, noPostsTemplate as HTMLTemplateElement);
        }
    }

    private listenForPostsDoneFetching(spinner: HTMLElement, noPostsTemplate: HTMLTemplateElement): void {
        this.container.addEventListener('doneFetchingPostsEvent', (e: Event) => {
            const pageNumber = (e as CustomEvent).detail;
            this.removeSpinner(spinner, noPostsTemplate, pageNumber);
        });
    }

    private removeSpinner(spinner: HTMLElement, noPostsTemplate: HTMLTemplateElement, pageNumber: number): void {
        if (pageNumber <= 1) {
            const noPostsContent = document.importNode(noPostsTemplate.content, true);
            const noPostsContainer = document.createElement('div');
            noPostsContainer.appendChild(noPostsContent);
            noPostsTemplate.insertAdjacentElement('afterend', noPostsContainer);
        }
        
        spinner.remove();
    }
}

export default HandlePostsLoadingSpinner;