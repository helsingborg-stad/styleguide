interface BannerInterface {
    getBanner(): HTMLElement;
    hide(): void;
    show(): void;
    isVisible(): boolean;
    getContent(): string;
    setContent(content: Node): void;
}