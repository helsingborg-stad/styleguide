type PopoverPosition = {
    left: number;
    top: number;
    horizontal: PopoverHorizontalPlacement;
    vertical: PopoverVerticalPlacement;
    mode: PopoverPositionMode;
    placement: string;
}

type ResponsiveWidthState = {
    preferredWidth: number;
    viewportWidth: number;
};

interface PopoverConfig {
    trigger: HTMLElement;
    popover: HTMLElement;
    relativeElement?: HTMLElement | null;
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

interface PopoverPositionCalculatorInterface {
    calculate(config: PopoverConfig): PopoverPosition | null;
}

interface PopoverPlacementInterface {
    syncResponsiveWidth(popover: HTMLElement): void;
    resetResponsiveWidth(popover: HTMLElement): void;
    setPosition(popover: HTMLElement, position: PopoverPosition): void;
    resetCustomPosition(popover: HTMLElement): void;
}