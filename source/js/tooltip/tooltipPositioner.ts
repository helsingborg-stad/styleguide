import { TooltipOffset } from './tooltipEnums';

class TooltipPositioner {
    public calculate(trigger: HTMLElement, tooltip: HTMLElement): TooltipPosition {
        const triggerRect = trigger.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();
        const triggerCenter = triggerRect.left + triggerRect.width / 2;
        const maxLeft = Math.max(TooltipOffset.Viewport, window.innerWidth - tooltipRect.width - TooltipOffset.Viewport);
        const preferredLeft = triggerCenter - tooltipRect.width / 2;
        const left = Math.min(maxLeft, Math.max(TooltipOffset.Viewport, preferredLeft));
        const top = triggerRect.top - tooltipRect.height - TooltipOffset.Top;
        const arrowLeft = Math.min(tooltipRect.width - TooltipOffset.Arrow, Math.max(TooltipOffset.Arrow, triggerCenter - left));

        return {
            left: Math.round(left),
            top: Math.round(top),
            arrowLeft: Math.round(arrowLeft),
        };
    }
}

export default TooltipPositioner;