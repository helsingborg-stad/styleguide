type PopoverPosition = {
    left: number;
    top: number;
    horizontal: PopoverHorizontalPlacement;
    vertical: PopoverVerticalPlacement;
    mode: PopoverPositionMode;
    placement: string;
}

interface PopoverConfig {
    trigger: HTMLElement;
    popover: HTMLElement;
    mode?: PopoverPositionMode | null;
    horizontalPlacement?: PopoverHorizontalPlacement;
    verticalPlacement?: PopoverVerticalPlacement;
    key?: string;
}

type PopoverHorizontalPlacement = 'left' | 'center' | 'right';
type PopoverVerticalPlacement = 'top' | 'bottom' | 'center';
type PopoverPositionMode = 'relative' | 'viewport';

interface BeforeToggleEvent extends Event {
    newState?: 'open' | 'closed';
}

interface PopoverSetupCallbacks {
    onSetupPair(trigger: HTMLElement, popover: HTMLElement): void;
    onViewportChange(): void;
}