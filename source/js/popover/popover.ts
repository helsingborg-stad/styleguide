import { PopoverSetup } from './popoverEnums';
import PopoverAnimator from './popoverAnimator';
import PopoverPlacement from './popoverPlacement';
import PopoverPositionCalculator from './popoverPositionCalculator';

class Popover {
    public constructor(
        private readonly config: PopoverConfig,
        private readonly popoverPlacement: PopoverPlacement,
        private readonly positionCalculator: PopoverPositionCalculator,
        private readonly animator: PopoverAnimator,
    ) {}

    public init(): void {
        this.bindTrigger();
        this.bindPopover();
        this.updateExpandedState();
        this.repositionIfOpen();
    }

    public repositionIfOpen(): void {
        const { popover } = this.config;

        if (!this.positionCalculator.hasCustomPositioning(this.config)) {
            return;
        }

        const isOpen = this.isOpen(popover);
        const isPending = popover.hasAttribute(PopoverSetup.PendingPositionAttribute);

        if (!isOpen && !isPending) {
            return;
        }

        this.position();
    }

    private bindTrigger(): void {
        const { trigger, popover } = this.config;

        if (trigger.hasAttribute(PopoverSetup.TriggerInitializedAttribute)) {
            return;
        }

        trigger.addEventListener('click', (event) => {
            const hasCustomPositioning = this.positionCalculator.hasCustomPositioning(this.config);

            if (!hasCustomPositioning) {
                return;
            }

            const action = this.getTargetAction(trigger);
            const isOpen = this.isOpen(popover);

            event.preventDefault();
            event.stopPropagation();

            if (action === 'hide') {
                if (isOpen) {
                    popover.hidePopover?.();
                }
                return;
            }

            if (isOpen) {
                if (action === 'toggle') {
                    popover.hidePopover?.();
                }

                return;
            }

            popover.setAttribute(PopoverSetup.PendingPositionAttribute, 'true');
            popover.style.visibility = 'hidden';
            this.showPopoverFromTrigger(trigger, popover);

            window.requestAnimationFrame(() => {
                this.position();
                popover.style.visibility = '';
                popover.removeAttribute(PopoverSetup.PendingPositionAttribute);
            });
        });

        trigger.setAttribute(PopoverSetup.TriggerInitializedAttribute, '');
    }

    private getTargetAction(trigger: HTMLElement): 'toggle' | 'show' | 'hide' {
        const action = trigger.getAttribute('popovertargetaction')?.trim().toLowerCase();

        if (action === 'show' || action === 'hide') {
            return action;
        }

        return 'toggle';
    }

    private showPopoverFromTrigger(trigger: HTMLElement, popover: HTMLElement): void {
        const showPopover = popover.showPopover as ((options?: unknown) => void) | undefined;

        if (!showPopover) {
            return;
        }

        try {
            showPopover.call(popover, { source: trigger });
        } catch {
            showPopover.call(popover);
        }
    }

    private bindPopover(): void {
        const { trigger, popover } = this.config;

        if (popover.hasAttribute(PopoverSetup.InitializedAttribute)) {
            return;
        }

        this.animator.bind(popover);

        popover.addEventListener('toggle', () => {
            const isOpen = this.isOpen(popover);
            const hasCustomPositioning = this.positionCalculator.hasCustomPositioning(this.config);

            trigger.setAttribute('aria-expanded', String(isOpen));

            if (!isOpen) {
                if (!hasCustomPositioning) {
                    this.popoverPlacement.resetCustomPosition(popover);
                }
                return;
            }

            if (!hasCustomPositioning) {
                this.popoverPlacement.resetCustomPosition(popover);
                return;
            }

            this.position();
            popover.removeAttribute(PopoverSetup.PendingPositionAttribute);
        });

        popover.setAttribute(PopoverSetup.InitializedAttribute, '');
    }

    private updateExpandedState(): void {
        const { trigger, popover } = this.config;
        trigger.setAttribute('aria-expanded', String(this.isOpen(popover)));
    }

    private position(): void {
        const { popover } = this.config;

        this.popoverPlacement.syncResponsiveWidth(popover);

        const position = this.positionCalculator.calculate(this.config);

        if (!position) {
            this.popoverPlacement.resetCustomPosition(popover);
            return;
        }

        this.popoverPlacement.setPosition(popover, position);
    }

    private isOpen(popover: HTMLElement): boolean {
        return typeof popover.matches === 'function' ? popover.matches(':popover-open') : !popover.hidden;
    }
}

export default Popover;