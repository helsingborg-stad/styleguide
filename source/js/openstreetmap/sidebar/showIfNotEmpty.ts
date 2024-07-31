class ShowIfNotEmpty {
    constructor(private container: HTMLElement, private baseClass: string) {
        const sidebar = this.container.querySelector(`.${this.baseClass}__sidebar`);

        if (sidebar) {
            this.checkForInnerBlocks(sidebar as HTMLElement);
            this.listenForEndpointPosts(sidebar as HTMLElement);
        }
    }

    private checkForInnerBlocks(sidebar: HTMLElement): void {
        const innerBlocks = sidebar.querySelector(`.${this.baseClass}__inner-blocks`);

        if (innerBlocks && !innerBlocks.querySelector('innerblocks')) {
            this.removeDisplayNoneUtility(sidebar);
        }
    }

    private listenForEndpointPosts(sidebar: HTMLElement): void {
        this.container.addEventListener('fetchingPosts', () => {
            this.removeDisplayNoneUtility(sidebar);
        });
    }

    private removeDisplayNoneUtility(sidebar: HTMLElement): void {
        sidebar.classList.remove('u-display--none');
    }
}

export default ShowIfNotEmpty;