import { PopoverSetup } from './popoverEnums';
import PopoverAnimator from './popoverAnimator';
import PopoverPlacement from './popoverPlacement';
import PopoverPositionCalculator from './popoverPositionCalculator';

class Popover {
    private readonly triggers = new Set<HTMLElement>();
    private activeTrigger: HTMLElement;

    public constructor(
        private readonly config: PopoverConfig,
        private readonly popoverPlacement: PopoverPlacement,
        private readonly positionCalculator: PopoverPositionCalculator,
        private readonly animator: PopoverAnimator,
    ) {
        this.activeTrigger = config.trigger;
    }

    public init(): void {
        this.addTrigger(this.config.trigger);
        this.bindPopover();
        this.updateExpandedState();
        this.repositionIfOpen();
    }

    public addTrigger(trigger: HTMLElement): void {
        this.triggers.add(trigger);
        this.bindTrigger(trigger);
        trigger.setAttribute('aria-expanded', String(this.isOpen(this.config.popover)));
    }

    public repositionIfOpen(): void {
        const config = this.getPositioningConfig();
        const { popover } = config;

        if (!this.positionCalculator.hasCustomPositioning(config)) {
            return;
        }

        const isOpen = this.isOpen(popover);
        const isPending = popover.hasAttribute(PopoverSetup.PendingPositionAttribute);

        if (!isOpen && !isPending) {
            return;
        }

        this.position();
    }

    private bindTrigger(trigger: HTMLElement): void {
        const { popover } = this.config;

        if (trigger.hasAttribute(PopoverSetup.TriggerInitializedAttribute)) {
            return;
        }

        trigger.addEventListener('click', (event) => {
            const config = this.getPositioningConfig(trigger);
            const hasCustomPositioning = this.positionCalculator.hasCustomPositioning(config);

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

            this.activeTrigger = trigger;
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
        const { popover } = this.config;

        if (popover.hasAttribute(PopoverSetup.InitializedAttribute)) {
            return;
        }

        this.animator.bind(popover);

        popover.addEventListener('toggle', () => {
            const isOpen = this.isOpen(popover);
            const config = this.getPositioningConfig();
            const hasCustomPositioning = this.positionCalculator.hasCustomPositioning(config);

            this.updateExpandedState();

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
        const { popover } = this.config;
        const expandedState = String(this.isOpen(popover));

        this.triggers.forEach((trigger) => {
            trigger.setAttribute('aria-expanded', expandedState);
        });
    }

    private position(): void {
        const config = this.getPositioningConfig();
        const { popover } = config;

        this.popoverPlacement.syncResponsiveWidth(popover);

        const position = this.positionCalculator.calculate(config);

        if (!position) {
            this.popoverPlacement.resetCustomPosition(popover);
            return;
        }

        this.popoverPlacement.setPosition(popover, position);
    }

    private isOpen(popover: HTMLElement): boolean {
        return typeof popover.matches === 'function' ? popover.matches(':popover-open') : !popover.hidden;
    }

    private getPositioningConfig(trigger: HTMLElement = this.activeTrigger): PopoverConfig {
        return {
            ...this.config,
            trigger,
        };
    }
}

export default Popover;