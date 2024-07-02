class ShowIfNotEmpty {
    constructor(private container: HTMLElement, private baseClass: string) {
        const sidebar = this.container.querySelector(`.${this.baseClass}__sidebar`);
        const expandIcon = this.container.querySelector(`.${this.baseClass}__expand-icon`);

        if (sidebar && expandIcon) {
            this.checkForInnerBlocks(sidebar as HTMLElement, expandIcon as HTMLElement);
            this.listenForEndpointPosts(sidebar as HTMLElement, expandIcon as HTMLElement);
        }
    }

    private checkForInnerBlocks(sidebar: HTMLElement, expandIcon: HTMLElement): void {
        const innerBlocks = sidebar.querySelector(`.${this.baseClass}__inner-blocks`);

        if (innerBlocks && !innerBlocks.querySelector('innerblocks')) {
            this.removeDisplayNoneUtility(sidebar, expandIcon);
        }
    }

    private listenForEndpointPosts(sidebar: HTMLElement, expandIcon: HTMLElement): void {
        this.container.addEventListener('fetchingPosts', () => {
            this.removeDisplayNoneUtility(sidebar, expandIcon);
        });
    }

    private removeDisplayNoneUtility(sidebar: HTMLElement, expandIcon: HTMLElement): void {
        sidebar.classList.remove('u-display--none');
        expandIcon.classList.remove('u-display--none');
    }
}

export default ShowIfNotEmpty;