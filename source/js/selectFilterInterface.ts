export interface FilterSelectComponents {
    [key: string]: {
        select: HTMLElement;
        selected: Array<string>;
    };
}

export interface FilterableElementComponent {
    element: HTMLElement;
    filterProperties: FilterProperties;
}

interface FilterProperties {
    [key: string]: Array<string>;
}