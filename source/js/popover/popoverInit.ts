import Popover from './popover';
import { PopoverEnums } from './popoverEnums';
import PopoverPositioner from './popoverPositioner';

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll(`[${PopoverEnums.PopoverSelectorAttribute}]`).forEach((popoverElement) => {
        const popoverData = tryGetPopoverData(popoverElement as HTMLElement);

        if (!popoverData) {
            return;
        }

        new Popover(
            popoverData,
            new PopoverPositioner(popoverData)
        );
    });
});

function tryGetPopoverData(popoverElement: HTMLElement): PopoverData | null {
    const id = popoverElement.id;
    const horizontalPlacement = getHorizontalPlacement(popoverElement);
    const verticalPlacement = getVerticalPlacement(popoverElement);
    const relative = popoverElement.hasAttribute(PopoverEnums.RelativeAttribute);

    const popoverTarget = document.querySelector(`[${PopoverEnums.PopoverTargetSelectorAttribute}="${id}"]`) as HTMLElement | null;

    const relativeElement = getRelativeElement(popoverElement, popoverTarget, relative);

    if (!id || !popoverTarget) {
        console.error(`Popover with id "${id}" or target "${popoverTarget}" is missing.`);

        return null;
    }

    return { id, popoverElement, popoverTarget, relativeElement, horizontalPlacement, verticalPlacement, relative };
}

function getRelativeElement(popoverElement: HTMLElement, popoverTarget: HTMLElement | null, relative: boolean): HTMLElement | null {
    return (document.querySelector(`[${PopoverEnums.RelativeElementAttribute}="${popoverElement.id}"]`) || (relative ? popoverTarget : null)) as HTMLElement | null;
}

function getHorizontalPlacement(popoverElement: HTMLElement): PopoverHorizontalPlacement {
    const horizontalPlacement = popoverElement.getAttribute(PopoverEnums.HorizontalPlacementAttribute) || 'center';

    if (!['left', 'center', 'right'].includes(horizontalPlacement)) {
        return 'center';
    }

    return horizontalPlacement as PopoverHorizontalPlacement;
}

function getVerticalPlacement(popoverElement: HTMLElement): PopoverVerticalPlacement {
    const verticalPlacement = popoverElement.getAttribute(PopoverEnums.VerticalPlacementAttribute) || 'center';

    if (!['top', 'center', 'bottom'].includes(verticalPlacement)) {
        return 'center';
    }

    return verticalPlacement as PopoverVerticalPlacement;
}