import { PopoverStyleProperty, PopoverSetup } from './popoverEnums';

class PopoverPlacement {
    private readonly preferredWidths = new WeakMap<HTMLElement, number>();

    public syncResponsiveWidth(popover: HTMLElement): void {
        const measuredWidth = this.getLayoutWidth(popover);
        const preferredWidth = this.preferredWidths.get(popover);

        if (preferredWidth === undefined && measuredWidth > 0) {
            this.preferredWidths.set(popover, measuredWidth);
        }

        const lockedWidth = this.preferredWidths.get(popover);
        const viewportMaxWidth = Math.max(0, window.innerWidth - 24);

        if (lockedWidth === undefined) {
            popover.style.maxWidth = `${viewportMaxWidth}px`;
            popover.style.width = '';
            return;
        }

        popover.style.maxWidth = `${viewportMaxWidth}px`;
        popover.style.width = `${Math.min(lockedWidth, viewportMaxWidth)}px`;
    }

    private getLayoutWidth(popover: HTMLElement): number {
        const offsetWidth = Math.round(popover.offsetWidth);

        if (offsetWidth > 0) {
            return offsetWidth;
        }

        return Math.round(popover.getBoundingClientRect().width);
    }

    public resetResponsiveWidth(popover: HTMLElement): void {
        this.preferredWidths.delete(popover);
        popover.style.width = '';
        popover.style.maxWidth = '';
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