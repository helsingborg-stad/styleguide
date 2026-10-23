class Banner implements BannerInterface {
    private content: string | null = null;
	private isVisibleClass = 'is-visible';

	public constructor(
		private bannerElement: HTMLElement,
	) {
		this.content = this.bannerElement.textContent ?? null;
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

	public getContent(): string {
		return this.content ?? '';
	}

    public setContent(content: string): void
    {
        this.content = content;
        this.getBanner().textContent = content;
    }
}

export default Banner;
