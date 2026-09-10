import { PopoverOffset } from './popoverEnums';

class PopoverPositionCalculator {
    public hasCustomPositioning(trigger: HTMLElement): boolean {
        return this.getDirection(trigger) !== null || this.getPlacement(trigger) !== null;
    }

    public calculate(trigger: HTMLElement, popover: HTMLElement): PopoverPosition | null {
        if (!this.hasCustomPositioning(trigger)) {
            return null;
        }

        const triggerRect = trigger.getBoundingClientRect();
        const popoverRect = popover.getBoundingClientRect();

        const placement = this.getPlacement(trigger) ?? 'center';
        const preferredLeft = this.getPreferredLeft(triggerRect, popoverRect, placement);
        const maxLeft = Math.max(PopoverOffset.Viewport, window.innerWidth - popoverRect.width - PopoverOffset.Viewport);
        const left = Math.min(maxLeft, Math.max(PopoverOffset.Viewport, preferredLeft));

        const availableSpaceBelow = window.innerHeight - triggerRect.bottom - PopoverOffset.Top;
        const availableSpaceAbove = triggerRect.top - PopoverOffset.Top;
        const preferredDirection = this.getDirection(trigger);
        const shouldPlaceTop = preferredDirection
            ? preferredDirection === 'top'
            : popoverRect.height > availableSpaceBelow && availableSpaceAbove > availableSpaceBelow;
        const preferredTop = shouldPlaceTop
            ? triggerRect.top - popoverRect.height - PopoverOffset.Top
            : triggerRect.bottom + PopoverOffset.Top;
        const maxTop = Math.max(PopoverOffset.Viewport, window.innerHeight - popoverRect.height - PopoverOffset.Viewport);
        const top = Math.min(maxTop, Math.max(PopoverOffset.Viewport, preferredTop));
        const direction = shouldPlaceTop ? 'top' : 'bottom';

        return {
            left: Math.round(left),
            top: Math.round(top),
            placement: direction,
        };
    }

    private getPreferredLeft(triggerRect: DOMRect, popoverRect: DOMRect, placement: 'left' | 'center' | 'right'): number {
        if (placement === 'left') {
            return triggerRect.left;
        }

        if (placement === 'right') {
            return triggerRect.right - popoverRect.width;
        }

        return triggerRect.left + triggerRect.width / 2 - popoverRect.width / 2;
    }

    private getDirection(trigger: HTMLElement): 'bottom' | 'top' | null {
        const direction = trigger.getAttribute('data-js-popover-direction')?.trim().toLowerCase();
        return direction === 'bottom' || direction === 'top' ? direction : null;
    }

    private getPlacement(trigger: HTMLElement): 'left' | 'center' | 'right' | null {
        const placement = trigger.getAttribute('data-js-popover-placement')?.trim().toLowerCase();
        return placement === 'left' || placement === 'center' || placement === 'right' ? placement : null;
    }
}

export default PopoverPositionCalculator;