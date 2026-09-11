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
                this.position();
                popover.style.visibility = '';
                popover.removeAttribute(PopoverSetup.PendingPositionAttribute);
            });
        });

        trigger.setAttribute(PopoverSetup.TriggerInitializedAttribute, '');
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