interface BannerInterface {
    getBanner(): HTMLElement;
    hide(): void;
    show(): void;
    getContent(): string;
    setContent(content: Node): void;
}