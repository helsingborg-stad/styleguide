class Banner implements BannerInterface {
    private content: string | null = null;
	private isVisibleClass = 'is-visible';

	public constructor(
		private bannerElement: HTMLElement,
	) {
		this.content = this.bannerElement.innerHTML ?? null;
	}

	public getBanner(): HTMLElement {
		return this.bannerElement;
	}

	public hide(): void {
        this.getBanner().classList.remove(this.isVisibleClass);
	}

	public show(): void {
        this.getBanner().classList.add(this.isVisibleClass);
	}

	public isVisible(): boolean {
		return this.getBanner().classList.contains(this.isVisibleClass);
	}

	public getContent(): string {
		return this.content ?? '';
	}

    public setContent(content: Node): void
    {
        this.getBanner().replaceChildren(content);

        this.content = this.getBanner().innerHTML;
    }
}

export default Banner;
