import { PopoverOffset } from './popoverEnums';

class PopoverPositioner {
    public calculate(trigger: HTMLElement, popover: HTMLElement): PopoverPosition {
        const triggerRect = trigger.getBoundingClientRect();
        const popoverRect = popover.getBoundingClientRect();
        const triggerCenter = triggerRect.left + triggerRect.width / 2;
        const preferredLeft = triggerCenter - popoverRect.width / 2;
        const maxLeft = Math.max(PopoverOffset.Viewport, window.innerWidth - popoverRect.width - PopoverOffset.Viewport);
        const left = Math.min(maxLeft, Math.max(PopoverOffset.Viewport, preferredLeft));
        const wouldOverflowBelow = triggerRect.bottom + popoverRect.height + PopoverOffset.Top > window.innerHeight;
        const top = wouldOverflowBelow ? triggerRect.top - popoverRect.height - PopoverOffset.Top : triggerRect.bottom + PopoverOffset.Top;
        const placement = wouldOverflowBelow ? 'top' : 'bottom';

        return {
            left: Math.round(left),
            top: Math.round(top),
            placement,
        };
    }
}

export default PopoverPositioner;

interface PopoverPosition {
    left: number;
    top: number;
    placement: 'top' | 'bottom';
}
