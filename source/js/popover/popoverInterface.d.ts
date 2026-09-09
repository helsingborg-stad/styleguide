type PopoverPosition = {
    left: number;
    top: number;
    placement: 'top' | 'bottom';
}

interface BeforeToggleEvent extends Event {
    newState?: 'open' | 'closed';
}

interface PopoverSetupCallbacks {
    onSetupPair(trigger: HTMLElement, popover: HTMLElement): void;
    onViewportChange(): void;
}