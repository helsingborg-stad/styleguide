import { PopoverSetup } from './popoverEnums';
import type PopoverPositioner from './popoverPositioner';
import type PopoverView from './popoverView';

class PopoverController {
    constructor(
        private readonly view: PopoverView,
        private readonly positioner: PopoverPositioner,
    ) {}

    public positionOpenPopovers(): void {
        Array.from(document.querySelectorAll<HTMLElement>(PopoverSetup.PopoverSelector)).forEach((popover) => {
            if (!this.isOpen(popover)) {
                return;
            }

            const trigger = this.getTrigger(popover);

            if (!trigger) {
                return;
            }

            const position = this.positioner.calculate(trigger, popover);
            this.view.setPosition(popover, position);
        });
    }

    public bindPopover(popover: HTMLElement): void {
        if (popover.dataset.positionListenerBound === 'true') {
            return;
        }

        popover.addEventListener('toggle', () => {
            const trigger = this.getTrigger(popover);

            if (trigger && this.isOpen(popover)) {
                const position = this.positioner.calculate(trigger, popover);
                this.view.setPosition(popover, position);
            }
        });

        popover.dataset.positionListenerBound = 'true';
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

export default PopoverController;
