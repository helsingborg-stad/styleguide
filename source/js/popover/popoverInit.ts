import Popover from './popover';
import PopoverAnimator from './popoverAnimator';
import PopoverPlacement from './popoverPlacement';
import PopoverPositionCalculator from './popoverPositionCalculator';
import { PopoverSetup } from './popoverEnums';

let popoverInstance: Popover | null = null;

document.addEventListener('DOMContentLoaded', () => {
    getPopoverInstance().init();

    document.querySelectorAll<HTMLElement>(PopoverSetup.TriggerSelector).forEach((trigger) => {
        const popover = getPopover(trigger);

        if (!popover) {
            return;
        }

        getPopoverInstance().setupPopover(trigger, popover);
    });

    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            for (const node of Array.from(mutation.addedNodes)) {
                if (!(node instanceof HTMLElement)) {
                    continue;
                }

                const newTriggers = [
                    ...(node.matches(PopoverSetup.TriggerSelector) ? [node] : []),
                    ...Array.from(node.querySelectorAll<HTMLElement>(PopoverSetup.TriggerSelector)),
                ];

                for (const trigger of newTriggers) {
                    const popover = getPopover(trigger);

                    if (!popover) {
                        continue;
                    }

                    getPopoverInstance().setupPopover(trigger, popover);
                }
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
});

function getPopover(trigger: HTMLElement): HTMLElement | null {
    const popoverId = trigger.getAttribute('popovertarget');

    if (!popoverId) {
        console.warn('Popover trigger does not have a popovertarget attribute:', trigger);
        return null;
    }

    const popover = document.querySelector<HTMLElement>(`#${popoverId}`);

    return popover;
}

function getPopoverInstance(): Popover {
    if (!popoverInstance) {
        popoverInstance = new Popover(
            new PopoverPlacement(),
            new PopoverPositionCalculator(),
            new PopoverAnimator()
        );
    }

    return popoverInstance;
}