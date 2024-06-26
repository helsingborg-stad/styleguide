class ShowIfNotEmpty {
    constructor(private container: HTMLElement, private baseClass: string) {
        const sidebar = this.container.querySelector(`.${this.baseClass}__sidebar`);

        if (sidebar) {
            this.checkForInnerBlocks(sidebar as HTMLElement);
        }
    }

    private checkForInnerBlocks(sidebar: HTMLElement) {
        const innerBlocks = sidebar.querySelectorAll(`.${this.baseClass}__block`);

        if (innerBlocks.length > 0) {
            this.container.classList.add('is-not-empty');
        }
    }
}

export default ShowIfNotEmpty;