export enum PopoverSetup {
    TriggerSelector = '[popovertarget]',
    PopoverSelector = '[popover]',
    InitializedAttribute = 'data-popover-initialized',
    TriggerInitializedAttribute = 'data-popover-trigger-initialized',
    PendingPositionAttribute = 'data-popover-pending-position',
    ClosingAttribute = 'data-popover-closing',
    SkipCloseAnimationAttribute = 'data-popover-skip-close-animation',
    VerticalPlacementAttribute = 'data-js-popover-vertical-placement',
    HorizontalPlacementAttribute = 'data-js-popover-horizontal-placement',
    Relative = 'data-js-popover-relative',
}

export enum PopoverOffset {
    Top = 8,
    Viewport = 12,
}

export enum PopoverTiming {
    CloseAnimationDurationMs = 180,
}

export enum PopoverStyleProperty {
    X = '--o-popover-x',
    Y = '--o-popover-y',
}
