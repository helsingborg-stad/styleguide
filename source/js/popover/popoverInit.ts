import Popover from './popover';
import { PopoverSetup as PopoverSetupEnums } from './popoverEnums';
import PopoverAnimator from './popoverAnimator';
import PopoverPlacement from './popoverPlacement';
import PopoverPositionCalculator from './popoverPositionCalculator';
import PopoverSetup from './popoverSetup';

class PopoverManager {
    private readonly popoverInstances = new Map<string, Popover>();
    private readonly elementKeys = new WeakMap<HTMLElement, string>();
    private nextElementKey = 0;

    public constructor(
        private readonly setup: PopoverSetup,
        private readonly popoverPlacement: PopoverPlacement,
        private readonly positionCalculator: PopoverPositionCalculator,
        private readonly animator: PopoverAnimator,
    ) {}

    public init(root: HTMLElement = document.body): void {
        this.setup.init({
            onSetupPair: (trigger, popover) => {
                this.registerPopover(trigger, popover);
            },
            onViewportChange: () => {
                this.repositionOpenPopovers();
            },
        }, root);

        this.repositionOpenPopovers();
    }

    private registerPopover(trigger: HTMLElement, popover: HTMLElement): void {
        const key = this.getPairKey(trigger, popover);

        if (this.popoverInstances.has(key)) {
            return;
        }

        const config: PopoverConfig = {
            trigger,
            popover,
            mode: this.getMode(popover),
            horizontalPlacement: this.getHorizontalPlacement(popover),
            verticalPlacement: this.getVerticalPlacement(popover),
            key,
        };

        const popoverInstance = new Popover(
            config,
            this.popoverPlacement,
            this.positionCalculator,
            this.animator
        );

        this.popoverInstances.set(key, popoverInstance);
        popoverInstance.init();
    }

    private repositionOpenPopovers(): void {
        this.popoverInstances.forEach((popoverInstance) => {
            popoverInstance.repositionIfOpen();
        });
    }

    private getPairKey(trigger: HTMLElement, popover: HTMLElement): string {
        const triggerKey = this.getElementKey(trigger);
        const popoverKey = this.getElementKey(popover);
        return `${triggerKey}::${popoverKey}`;
    }

    private getElementKey(element: HTMLElement): string {
        const existingKey = this.elementKeys.get(element);

        if (existingKey) {
            return existingKey;
        }

        this.nextElementKey += 1;
        const generatedKey = `popover-node-${this.nextElementKey}`;
        this.elementKeys.set(element, generatedKey);
        return generatedKey;
    }

    private getMode(popover: HTMLElement): PopoverPositionMode | null {
        const relativeToTrigger = popover.getAttribute(PopoverSetupEnums.RelativeToTrigger)?.trim().toLowerCase();

        if (relativeToTrigger === 'true' || relativeToTrigger === '1') {
            return 'relative';
        }

        const hasHorizontalPlacement = popover.hasAttribute(PopoverSetupEnums.HorizontalPlacementAttribute);
        const hasVerticalPlacement = popover.hasAttribute(PopoverSetupEnums.VerticalPlacementAttribute);

        if (hasHorizontalPlacement || hasVerticalPlacement) {
            return 'viewport';
        }

        return null;
    }

    private getHorizontalPlacement(popover: HTMLElement): PopoverHorizontalPlacement | undefined {
        const placement = popover.getAttribute(PopoverSetupEnums.HorizontalPlacementAttribute)?.trim().toLowerCase();

        if (placement === 'left' || placement === 'center' || placement === 'right') {
            return placement;
        }

        return undefined;
    }

    private getVerticalPlacement(popover: HTMLElement): PopoverVerticalPlacement | undefined {
        const placement = popover.getAttribute(PopoverSetupEnums.VerticalPlacementAttribute)?.trim().toLowerCase();

        if (placement === 'top' || placement === 'center' || placement === 'bottom') {
            return placement;
        }

        return undefined;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const manager = new PopoverManager(
        new PopoverSetup(),
        new PopoverPlacement(),
        new PopoverPositionCalculator(),
        new PopoverAnimator()
    );

    manager.init(document.body);
});