import { PopoverOffset, PopoverSetup } from './popoverEnums';

class PopoverPositionCalculator {
    public hasCustomPositioning(config: PopoverConfig): boolean {
        return this.getPositionMode(config) !== null;
    }

    public getPositionMode(config: PopoverConfig): PopoverPositionMode | null {
        if (config.mode) {
            return config.mode;
        }

        const { popover } = config;
        const hasHorizontalPlacement = popover.hasAttribute(PopoverSetup.HorizontalPlacementAttribute);
        const hasVerticalPlacement = popover.hasAttribute(PopoverSetup.VerticalPlacementAttribute);
        const isRelativeToTrigger = this.isRelativeToTrigger(popover);

        if (!isRelativeToTrigger && !hasHorizontalPlacement && !hasVerticalPlacement) {
            return null;
        }

        return isRelativeToTrigger ? 'relative' : 'viewport';
    }

    public calculate(config: PopoverConfig): PopoverPosition | null {
        const mode = this.getPositionMode(config);

        if (!mode) {
            return null;
        }

        const { trigger, popover } = config;

        const triggerRect = trigger.getBoundingClientRect();
        const popoverRect = popover.getBoundingClientRect();

        const horizontalPlacement = this.getHorizontalPlacement(config);
        const verticalPlacement = this.getVerticalPlacement(config);
        const preferredLeft = this.getPreferredLeft(mode, triggerRect, popoverRect, horizontalPlacement);
        const preferredTop = this.getPreferredTop(mode, triggerRect, popoverRect, verticalPlacement);
        const left = this.clampToViewport(preferredLeft, popoverRect.width, window.innerWidth);
        const top = this.clampToViewport(preferredTop, popoverRect.height, window.innerHeight);

        return {
            left: Math.round(left),
            top: Math.round(top),
            horizontal: horizontalPlacement,
            vertical: verticalPlacement,
            mode,
            placement: `${mode}-${verticalPlacement}-${horizontalPlacement}`,
        };
    }

    private getPreferredLeft(
        mode: PopoverPositionMode,
        triggerRect: DOMRect,
        popoverRect: DOMRect,
        placement: PopoverHorizontalPlacement
    ): number {
        if (mode === 'viewport') {
            if (placement === 'left') {
                return PopoverOffset.Viewport;
            }

            if (placement === 'right') {
                return window.innerWidth - popoverRect.width - PopoverOffset.Viewport;
            }

            return (window.innerWidth - popoverRect.width) / 2;
        }

        if (placement === 'left') {
            return triggerRect.left;
        }

        if (placement === 'right') {
            return triggerRect.right - popoverRect.width;
        }

        return triggerRect.left + triggerRect.width / 2 - popoverRect.width / 2;
    }

    private getPreferredTop(
        mode: PopoverPositionMode,
        triggerRect: DOMRect,
        popoverRect: DOMRect,
        placement: PopoverVerticalPlacement
    ): number {
        if (mode === 'viewport') {
            if (placement === 'top') {
                return PopoverOffset.Viewport;
            }

            if (placement === 'bottom') {
                return window.innerHeight - popoverRect.height - PopoverOffset.Viewport;
            }

            return (window.innerHeight - popoverRect.height) / 2;
        }

        if (placement === 'top') {
            return triggerRect.top - popoverRect.height - PopoverOffset.Top;
        }

        if (placement === 'bottom') {
            return triggerRect.bottom + PopoverOffset.Top;
        }

        return triggerRect.top + triggerRect.height / 2 - popoverRect.height / 2;
    }

    private clampToViewport(position: number, size: number, viewportSize: number): number {
        const min = PopoverOffset.Viewport;
        const max = Math.max(min, viewportSize - size - PopoverOffset.Viewport);
        return Math.min(max, Math.max(min, position));
    }

    private isRelativeToTrigger(popover: HTMLElement): boolean {
        const relativeToTrigger = popover.getAttribute(PopoverSetup.RelativeToTrigger)?.trim().toLowerCase();
        return relativeToTrigger === 'true' || relativeToTrigger === '1';
    }

    private getVerticalPlacement(config: PopoverConfig): PopoverVerticalPlacement {
        if (config.verticalPlacement) {
            return config.verticalPlacement;
        }

        const { popover } = config;
        const placement = popover.getAttribute(PopoverSetup.VerticalPlacementAttribute)?.trim().toLowerCase();
        if (placement && ['top', 'bottom', 'center'].includes(placement)) {
            return placement as PopoverVerticalPlacement;
        }

        return config.mode === 'relative' ? 'bottom' : 'center';
    }

    private getHorizontalPlacement(config: PopoverConfig): PopoverHorizontalPlacement {
        if (config.horizontalPlacement) {
            return config.horizontalPlacement;
        }

        const { popover } = config;
        const placement = popover.getAttribute(PopoverSetup.HorizontalPlacementAttribute)?.trim().toLowerCase();

        if (placement && ['left', 'center', 'right'].includes(placement)) {
            return placement as PopoverHorizontalPlacement;
        }
        return 'center';
    }
}

export default PopoverPositionCalculator;