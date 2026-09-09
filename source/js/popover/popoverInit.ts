import Popover from './popover';
import PopoverAnimator from './popoverAnimator';
import PopoverPlacement from './popoverPlacement';
import PopoverPositionCalculator from './popoverPositionCalculator';
import PopoverSetup from './popoverSetup';

let popoverInstance: Popover | null = null;

document.addEventListener('DOMContentLoaded', () => {
    getPopoverInstance().init();
});

function getPopoverInstance(): Popover {
    if (!popoverInstance) {
        popoverInstance = new Popover(
            new PopoverSetup(),
            new PopoverPlacement(),
            new PopoverPositionCalculator(),
            new PopoverAnimator()
        );
    }

    return popoverInstance;
}