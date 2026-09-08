import { PopoverStyleProperty } from './popoverEnums';

class PopoverView {
    public setPosition(popover: HTMLElement, position: PopoverPosition): void {
        popover.dataset.placement = position.placement;
        popover.style.position = 'fixed';
        popover.style.zIndex = '10';
        popover.style.inset = 'auto';
        popover.style.setProperty(PopoverStyleProperty.X, `${position.left}px`);
        popover.style.setProperty(PopoverStyleProperty.Y, `${position.top}px`);
        popover.style.left = `${position.left}px`;
        popover.style.top = `${position.top}px`;
    }
}

export default PopoverView;

interface PopoverPosition {
    left: number;
    top: number;
    placement: 'top' | 'bottom';
}
