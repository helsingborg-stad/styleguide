interface InfoInterface {
    getInfo(): HTMLElement;
    delete(): void;
    edit(content: string): void;
    getContent(): string;
    getId(): string;
}

interface InfoFactoryInterface {
    create(content: string, id?: string): InfoInterface;
}