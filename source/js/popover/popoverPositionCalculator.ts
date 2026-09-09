import { PopoverOffset } from './popoverEnums';

class PopoverPositionCalculator {
    public calculate(trigger: HTMLElement, popover: HTMLElement): PopoverPosition {
        const triggerRect = trigger.getBoundingClientRect();
        const popoverRect = popover.getBoundingClientRect();

        const preferredLeft = triggerRect.left + triggerRect.width / 2 - popoverRect.width / 2;
        const maxLeft = Math.max(PopoverOffset.Viewport, window.innerWidth - popoverRect.width - PopoverOffset.Viewport);
        const left = Math.min(maxLeft, Math.max(PopoverOffset.Viewport, preferredLeft));

        const availableSpaceBelow = window.innerHeight - triggerRect.bottom - PopoverOffset.Top;
        const availableSpaceAbove = triggerRect.top - PopoverOffset.Top;
        const shouldPlaceTop = popoverRect.height > availableSpaceBelow && availableSpaceAbove > availableSpaceBelow;
        const preferredTop = shouldPlaceTop
            ? triggerRect.top - popoverRect.height - PopoverOffset.Top
            : triggerRect.bottom + PopoverOffset.Top;
        const maxTop = Math.max(PopoverOffset.Viewport, window.innerHeight - popoverRect.height - PopoverOffset.Viewport);
        const top = Math.min(maxTop, Math.max(PopoverOffset.Viewport, preferredTop));
        const placement = shouldPlaceTop ? 'top' : 'bottom';

        return {
            left: Math.round(left),
            top: Math.round(top),
            placement,
        };
    }
}

export default PopoverPositionCalculator;