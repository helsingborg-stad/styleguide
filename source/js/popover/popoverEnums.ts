export enum PopoverSetup {
    TriggerSelector = '[popovertarget]',
    PopoverSelector = '[popover]',
    InitializedAttribute = 'data-popover-initialized',
    UninitializedSelector = '[popover]:not([data-popover-initialized])',
}

export enum PopoverOffset {
    Top = 8,
    Viewport = 12,
}

export enum PopoverStyleProperty {
    X = '--o-popover-x',
    Y = '--o-popover-y',
}
