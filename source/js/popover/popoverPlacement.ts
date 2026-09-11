import { PopoverStyleProperty, PopoverSetup } from './popoverEnums';

type ResponsiveWidthState = {
    preferredWidth: number;
    viewportWidth: number;
};

class PopoverPlacement {
    private readonly responsiveWidths = new WeakMap<HTMLElement, ResponsiveWidthState>();

    public syncResponsiveWidth(popover: HTMLElement): void {
        const viewportWidth = window.innerWidth;
        const viewportMaxWidth = Math.max(0, window.innerWidth - 24);
        const viewportMaxHeight = Math.max(0, window.innerHeight - 24);
        const preferredWidth = this.getPreferredWidth(popover, viewportWidth, viewportMaxWidth);

        popover.style.maxHeight = `${viewportMaxHeight}px`;

        if (preferredWidth === undefined) {
            popover.style.maxWidth = `${viewportMaxWidth}px`;
            popover.style.width = '';
            return;
        }

        popover.style.maxWidth = `${viewportMaxWidth}px`;
        popover.style.width = `${Math.min(preferredWidth, viewportMaxWidth)}px`;
    }

    private getPreferredWidth(popover: HTMLElement, viewportWidth: number, viewportMaxWidth: number): number | undefined {
        const cachedWidth = this.responsiveWidths.get(popover);

        if (cachedWidth && cachedWidth.viewportWidth === viewportWidth) {
            return cachedWidth.preferredWidth;
        }

        const preferredWidth = this.measurePreferredWidth(popover, viewportMaxWidth);

        if (preferredWidth > 0) {
            this.responsiveWidths.set(popover, {
                preferredWidth,
                viewportWidth,
            });
            return preferredWidth;
        }

        return cachedWidth?.preferredWidth;
    }

    private measurePreferredWidth(popover: HTMLElement, viewportMaxWidth: number): number {
        const previousWidth = popover.style.width;
        const previousMaxWidth = popover.style.maxWidth;

        popover.style.width = '';
        popover.style.maxWidth = `${viewportMaxWidth}px`;

        const measuredWidth = this.getLayoutWidth(popover);

        popover.style.width = previousWidth;
        popover.style.maxWidth = previousMaxWidth;

        return measuredWidth;
    }

    private getLayoutWidth(popover: HTMLElement): number {
        const offsetWidth = Math.round(popover.offsetWidth);

        if (offsetWidth > 0) {
            return offsetWidth;
        }

        return Math.round(popover.getBoundingClientRect().width);
    }

    public resetResponsiveWidth(popover: HTMLElement): void {
        this.responsiveWidths.delete(popover);
        popover.style.width = '';
        popover.style.maxWidth = '';
        popover.style.maxHeight = '';
    }

    public setPosition(popover: HTMLElement, position: PopoverPosition): void {
        popover.dataset.placement = position.placement;
        popover.style.zIndex = '10';
        popover.style.right = 'auto';
        popover.style.bottom = 'auto';
        popover.style.setProperty(PopoverStyleProperty.X, `${position.left}px`);
        popover.style.setProperty(PopoverStyleProperty.Y, `${position.top}px`);
        popover.style.left = `${position.left}px`;
        popover.style.top = `${position.top}px`;
    }

    public resetCustomPosition(popover: HTMLElement): void {
        this.resetResponsiveWidth(popover);
        popover.style.visibility = '';
        popover.removeAttribute(PopoverSetup.PendingPositionAttribute);
        popover.style.left = '';
        popover.style.top = '';
        popover.style.right = '';
        popover.style.bottom = '';
        popover.style.removeProperty('--o-popover-x');
        popover.style.removeProperty('--o-popover-y');
        popover.style.removeProperty('z-index');
        delete popover.dataset.placement;
    }
    
}

export default PopoverPlacement;