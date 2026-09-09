import { PopoverSetup } from './popoverEnums';
import PopoverAnimator from './popoverAnimator';
import PopoverPlacement from './popoverPlacement';
import PopoverPositionCalculator from './popoverPositionCalculator';

class Popover {
    public constructor(
        private readonly popoverPlacement: PopoverPlacement = new PopoverPlacement(),
        private readonly positionCalculator: PopoverPositionCalculator = new PopoverPositionCalculator(),
        private readonly animator: PopoverAnimator = new PopoverAnimator(),
    ) {
    }

    public init(root: HTMLElement = document.body): void {
        this.bindWithin(root);
        this.observeDom();
        this.repositionOpenPopovers();
    }

    public setupPopover(trigger: HTMLElement, popover: HTMLElement): void {
        this.bindTrigger(trigger, popover);
        this.bindPopover(popover);
        this.updateExpandedState(trigger, popover);
    }

    private bindWithin(root: HTMLElement): void {
        for (const trigger of this.getTriggers(root)) {
            const popover = this.getPopover(trigger);

            if (!popover) {
                continue;
            }

            this.setupPopover(trigger, popover);
        }
    }

    private observeDom(): void {
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                for (const node of Array.from(mutation.addedNodes)) {
                    if (!(node instanceof HTMLElement)) {
                        continue;
                    }

                    this.bindWithin(node);
                }
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
        console.log('Popover DOM observer initialized');
        window.addEventListener('resize', () => this.repositionOpenPopovers(), { passive: true });
        document.addEventListener('scroll', () => this.repositionOpenPopovers(), { capture: true, passive: true });
    }

    private bindTrigger(trigger: HTMLElement, popover: HTMLElement): void {
        if (trigger.hasAttribute(PopoverSetup.TriggerInitializedAttribute)) {
            return;
        }

        trigger.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();

            if (this.isOpen(popover)) {
                popover.hidePopover?.();
                return;
            }

            popover.setAttribute(PopoverSetup.PendingPositionAttribute, 'true');
            popover.style.visibility = 'hidden';
            popover.showPopover?.();

            window.requestAnimationFrame(() => {
                this.position(trigger, popover);
                popover.style.visibility = '';
                popover.removeAttribute(PopoverSetup.PendingPositionAttribute);
            });
        });

        trigger.setAttribute(PopoverSetup.TriggerInitializedAttribute, '');
    }

    private bindPopover(popover: HTMLElement): void {
        if (popover.hasAttribute(PopoverSetup.InitializedAttribute)) {
            return;
        }

        this.animator.bind(popover);

        popover.addEventListener('toggle', () => {
            const trigger = this.getTrigger(popover);
            const isOpen = this.isOpen(popover);

            if (trigger) {
                trigger.setAttribute('aria-expanded', String(isOpen));
            }

            if (!isOpen) {
                this.popoverPlacement.resetResponsiveWidth(popover);
                popover.style.visibility = '';
                popover.removeAttribute(PopoverSetup.PendingPositionAttribute);
                return;
            }

            if (trigger) {
                this.position(trigger, popover);
                popover.removeAttribute(PopoverSetup.PendingPositionAttribute);
            }
        });

        popover.setAttribute(PopoverSetup.InitializedAttribute, '');
    }

    private updateExpandedState(trigger: HTMLElement, popover: HTMLElement): void {
        trigger.setAttribute('aria-expanded', String(this.isOpen(popover)));
    }

    private repositionOpenPopovers(): void {
        document.querySelectorAll<HTMLElement>(PopoverSetup.PopoverSelector).forEach((popover) => {
            if (!popover.id) {
                return;
            }

            const trigger = this.getTrigger(popover);

            if (!trigger) {
                return;
            }

            const isOpen = this.isOpen(popover);
            const isPending = popover.hasAttribute(PopoverSetup.PendingPositionAttribute);

            if (!isOpen && !isPending) {
                return;
            }

            this.position(trigger, popover);
        });
    }

    private position(trigger: HTMLElement, popover: HTMLElement): void {
        this.popoverPlacement.syncResponsiveWidth(popover);
        const position = this.positionCalculator.calculate(trigger, popover);
        this.popoverPlacement.setPosition(popover, position);
    }

    private getTriggers(root: HTMLElement): HTMLElement[] {
        return [
            ...(root.matches(PopoverSetup.TriggerSelector) ? [root] : []),
            ...Array.from(root.querySelectorAll<HTMLElement>(PopoverSetup.TriggerSelector)),
        ];
    }

    private getPopover(trigger: HTMLElement): HTMLElement | null {
        const popoverId = trigger.getAttribute('popovertarget')?.trim();

        if (!popoverId) {
            return null;
        }

        const popover = document.getElementById(popoverId);
        return popover && popover.matches(PopoverSetup.PopoverSelector) ? popover : null;
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

export default Popover;