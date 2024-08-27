export interface FilterSelects {
    [key: string]: {
        selects: Array<HTMLElement>;
        selected: Array<string>;
    }
}

export interface FilterableElementComponent {
    element: HTMLElement;
    filterProperties: FilterProperties;
}

interface FilterProperties {
    [key: string]: Array<string>;
}