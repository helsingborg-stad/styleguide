import { PopoverSetup } from './popoverEnums';
import PopoverPositioner from './popoverPositioner';
import PopoverView from './popoverView';

class Popover {
    private readonly view = new PopoverView();
    private readonly positioner = new PopoverPositioner();

    public init(): void {
        const popovers = Array.from(document.querySelectorAll<HTMLElement>(PopoverSetup.PopoverSelector));

        popovers.forEach((popover) => {
            this.bindPopover(popover);
            popover.setAttribute(PopoverSetup.InitializedAttribute, '');
        });

        this.observeDom();
        this.positionOpenPopovers();
    }

    private observeDom(): void {
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                for (const node of Array.from(mutation.addedNodes)) {
                    if (!(node instanceof HTMLElement)) {
                        continue;
                    }

                    const newPopovers = [
                        ...(node.matches(PopoverSetup.PopoverSelector) ? [node] : []),
                        ...Array.from(node.querySelectorAll<HTMLElement>(PopoverSetup.PopoverSelector)),
                    ];

                    for (const popover of newPopovers) {
                        if (popover.hasAttribute(PopoverSetup.InitializedAttribute)) {
                            continue;
                        }

                        this.bindPopover(popover);
                        popover.setAttribute(PopoverSetup.InitializedAttribute, '');
                    }
                }
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    private bindPopover(popover: HTMLElement): void {
        if (popover.dataset.hasPositionListener === 'true') {
            return;
        }

        popover.addEventListener('toggle', () => {
            const trigger = this.getTrigger(popover);

            if (trigger && this.isOpen(popover)) {
                this.position(trigger, popover);
            }
        });

        popover.dataset.hasPositionListener = 'true';
    }

    private positionOpenPopovers(): void {
        Array.from(document.querySelectorAll<HTMLElement>(PopoverSetup.PopoverSelector)).forEach((popover) => {
            if (!this.isOpen(popover)) {
                return;
            }

            const trigger = this.getTrigger(popover);

            if (trigger) {
                this.position(trigger, popover);
            }
        });
    }

    private position(trigger: HTMLElement, popover: HTMLElement): void {
        const { left, top, placement } = this.positioner.calculate(trigger, popover);
        this.view.setPosition(popover, { left, top, placement });
    }

    private getTrigger(popover: HTMLElement): HTMLElement | null {
        const popoverId = popover.id.trim();

        if (!popoverId) {
            return null;
        }

        const triggers = Array.from(document.querySelectorAll<HTMLElement>(PopoverSetup.TriggerSelector));
        return triggers.find((trigger) => trigger.getAttribute('popovertarget')?.trim() === popoverId) ?? null;
    }

    private isOpen(popover: HTMLElement): boolean {
        return typeof popover.matches === 'function' ? popover.matches(':popover-open') : !popover.hidden;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Popover().init();
});

export default Popover;