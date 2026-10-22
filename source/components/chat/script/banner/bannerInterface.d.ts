interface BannerInterface {
    getBanner(): HTMLElement;
    hide(): void;
    show(): void;
    getContent(): string;
    setContent(content: string): void;
}