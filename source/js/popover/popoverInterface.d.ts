export type PopoverPlacement = {
	horizontalPlacement?: PopoverHorizontalPlacement;
	verticalPlacement?: PopoverVerticalPlacement;
};

export type PopoverData = {
	id: string;
	popoverElement: HTMLElement;
	popoverTarget: HTMLElement;
	relativeElement: HTMLElement | null;
	horizontalPlacement: PopoverHorizontalPlacement;
	verticalPlacement: PopoverVerticalPlacement;
	relative: boolean;
    cover: boolean;
};

export type PopoverHorizontalPlacement = 'left' | 'center' | 'right';
export type PopoverVerticalPlacement = 'top' | 'center' | 'bottom';
