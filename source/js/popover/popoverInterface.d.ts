type PopoverPosition = {
    left: number;
    top: number;
    placement: 'top' | 'bottom';
}

interface BeforeToggleEvent extends Event {
    newState?: 'open' | 'closed';
}