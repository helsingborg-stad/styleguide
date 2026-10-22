class Banner implements BannerInterface {
    private content: string | null = null;

	public constructor(
		private bannerElement: HTMLElement,
	) {}

	public getBanner(): HTMLElement {
		return this.bannerElement;
	}

	public hide(): void {
        this.getBanner().classList.remove('is-visible');
	}

	public show(): void {
        this.getBanner().classList.add('is-visible');
	}

	public getContent(): string {
		return this.getBanner().textContent ?? '';
	}

    public setContent(content: string): void
    {
        this.content = content;
        this.getBanner().textContent = content;
    }
}

export default Banner;
