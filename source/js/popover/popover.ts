import { PopoverSetup } from './popoverEnums';
import PopoverAnimator from './popoverAnimator';
import PopoverPlacement from './popoverPlacement';
import PopoverPositionCalculator from './popoverPositionCalculator';
import PopoverSetupController from './popoverSetup';

class Popover {
    public constructor(
        private readonly setupController: PopoverSetupController,
        private readonly popoverPlacement: PopoverPlacement,
        private readonly positionCalculator: PopoverPositionCalculator,
        private readonly animator: PopoverAnimator,
    ) {}

    public init(root: HTMLElement = document.body): void {
        this.setupController.init(root, {
            onSetupPair: (trigger, popover) => this.setupPopover(trigger, popover),
            onViewportChange: () => this.repositionOpenPopovers(),
        });
        this.repositionOpenPopovers();
    }

    public setupPopover(trigger: HTMLElement, popover: HTMLElement): void {
        this.bindTrigger(trigger, popover);
        this.bindPopover(popover);
        this.updateExpandedState(trigger, popover);
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