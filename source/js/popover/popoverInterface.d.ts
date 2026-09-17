type PopoverData = {
    id: string;
    popoverElement: HTMLElement;
    popoverTarget: HTMLElement;
    relativeElement: HTMLElement | null;
    horizontalPlacement: PopoverHorizontalPlacement;
    verticalPlacement: PopoverVerticalPlacement;
    relative: boolean;
};

type PopoverHorizontalPlacement = 'left' | 'center' | 'right';
type PopoverVerticalPlacement = 'top' | 'center' | 'bottom';