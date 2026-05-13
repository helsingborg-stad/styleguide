import TooltipController from './tooltipController';
import { TooltipSetup } from './tooltipEnums';
import TooltipEvents from './tooltipEvents';
import TooltipPositioner from './tooltipPositioner';
import TooltipView from './tooltipView';

class Tooltip {
    public init(): void {
        const triggers = Array.from(document.querySelectorAll<HTMLElement>(TooltipSetup.TriggerSelector));

        if (triggers.length === 0) {
            return;
        }

        const view = new TooltipView(TooltipSetup.TooltipId);
        const positioner = new TooltipPositioner();

        let controller: TooltipController;

        const events = new TooltipEvents({
            onTriggerEnter: (trigger) => controller.show(trigger),
            onTriggerLeave: (trigger) => controller.hide(trigger),
            onTriggerFocus: (trigger) => controller.show(trigger),
            onTriggerBlur: (trigger) => controller.hide(trigger),
            onPointerDown: (target) => controller.handlePointerDown(target),
            onEscape: () => controller.hide(),
            onViewportChange: () => controller.repositionActiveTooltip(),
        });

        controller = new TooltipController(triggers, view, positioner, events);
        controller.init();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Tooltip().init();
});

export default Tooltip;