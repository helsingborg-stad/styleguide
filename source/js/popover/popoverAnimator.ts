import { PopoverSetup, PopoverTiming } from './popoverEnums';

class PopoverAnimator {
    private readonly closeAnimationTimeouts = new WeakMap<HTMLElement, number>();

    public bind(popover: HTMLElement): void {
        popover.addEventListener('beforetoggle', (event) => {
            const beforeToggleEvent = event as BeforeToggleEvent;

            if (beforeToggleEvent.newState === 'open') {
                this.clearCloseAnimation(popover);
                return;
            }

            if (beforeToggleEvent.newState !== 'closed') {
                return;
            }

            if (popover.getAttribute(PopoverSetup.SkipCloseAnimationAttribute) === 'true') {
                popover.removeAttribute(PopoverSetup.SkipCloseAnimationAttribute);
                return;
            }

            if (typeof popover.hidePopover !== 'function') {
                return;
            }

            event.preventDefault();
            this.startCloseAnimation(popover);
        });
    }

    private startCloseAnimation(popover: HTMLElement): void {
        this.clearCloseAnimation(popover);
        popover.setAttribute(PopoverSetup.ClosingAttribute, 'true');

        const timeoutId = window.setTimeout(() => {
            popover.setAttribute(PopoverSetup.SkipCloseAnimationAttribute, 'true');
            popover.removeAttribute(PopoverSetup.ClosingAttribute);
            popover.hidePopover();
            this.closeAnimationTimeouts.delete(popover);
        }, PopoverTiming.CloseAnimationDurationMs);

        this.closeAnimationTimeouts.set(popover, timeoutId);
    }

    private clearCloseAnimation(popover: HTMLElement): void {
        const timeoutId = this.closeAnimationTimeouts.get(popover);

        if (timeoutId !== undefined) {
            window.clearTimeout(timeoutId);
            this.closeAnimationTimeouts.delete(popover);
        }

        popover.removeAttribute(PopoverSetup.ClosingAttribute);
        popover.removeAttribute(PopoverSetup.SkipCloseAnimationAttribute);
    }
}

export default PopoverAnimator;

interface BeforeToggleEvent extends Event {
    newState?: 'open' | 'closed';
}