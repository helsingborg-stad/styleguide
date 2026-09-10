import Popover from './popover';
import { PopoverSetup as PopoverSetupEnums } from './popoverEnums';
import PopoverAnimator from './popoverAnimator';
import PopoverPlacement from './popoverPlacement';
import PopoverPositionCalculator from './popoverPositionCalculator';
import PopoverSetup from './popoverSetup';

const popoverInstances = new Map<string, Popover>();
const elementKeys = new WeakMap<HTMLElement, string>();
let nextElementKey = 0;

document.addEventListener('DOMContentLoaded', () => {
    initPopovers();
});

function initPopovers(): void {
    const setup = new PopoverSetup();
    const popoverPlacement = new PopoverPlacement();
    const positionCalculator = new PopoverPositionCalculator();
    const animator = new PopoverAnimator();

    setup.init(document.body, {
        onSetupPair: (trigger, popover) => {
            const key = getPairKey(trigger, popover);

            if (popoverInstances.has(key)) {
                return;
            }

            const config: PopoverConfig = {
                trigger,
                popover,
                mode: getMode(popover),
                horizontalPlacement: getHorizontalPlacement(popover),
                verticalPlacement: getVerticalPlacement(popover),
                key,
            };

            const popoverInstance = new Popover(
                config,
                popoverPlacement,
                positionCalculator,
                animator
            );

            popoverInstances.set(key, popoverInstance);
            popoverInstance.init();
        },
        onViewportChange: () => {
            popoverInstances.forEach((popoverInstance) => {
                popoverInstance.repositionIfOpen();
            });
        },
    });

    popoverInstances.forEach((popoverInstance) => {
        popoverInstance.repositionIfOpen();
    });
}

function getPairKey(trigger: HTMLElement, popover: HTMLElement): string {
    const triggerKey = getElementKey(trigger);
    const popoverKey = getElementKey(popover);
    return `${triggerKey}::${popoverKey}`;
}

function getElementKey(element: HTMLElement): string {
    const existingKey = elementKeys.get(element);

    if (existingKey) {
        return existingKey;
    }

    nextElementKey += 1;
    const generatedKey = `popover-node-${nextElementKey}`;
    elementKeys.set(element, generatedKey);
    return generatedKey;
}

function getMode(popover: HTMLElement): PopoverPositionMode | null {
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

function getHorizontalPlacement(popover: HTMLElement): PopoverHorizontalPlacement | undefined {
    const placement = popover.getAttribute(PopoverSetupEnums.HorizontalPlacementAttribute)?.trim().toLowerCase();

    if (placement === 'left' || placement === 'center' || placement === 'right') {
        return placement;
    }

    return undefined;
}

function getVerticalPlacement(popover: HTMLElement): PopoverVerticalPlacement | undefined {
    const placement = popover.getAttribute(PopoverSetupEnums.VerticalPlacementAttribute)?.trim().toLowerCase();

    if (placement === 'top' || placement === 'center' || placement === 'bottom') {
        return placement;
    }

    return undefined;
}