import TooltipController from './tooltipController';
import { TooltipSetup } from './tooltipEnums';
import TooltipEvents from './tooltipEvents';
import TooltipPositioner from './tooltipPositioner';
import TooltipView from './tooltipView';

class Tooltip {
    public init(): void {
        const triggers = Array.from(document.querySelectorAll<HTMLElement>(TooltipSetup.UninitializedSelector));

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

        triggers.forEach((trigger) => {
            trigger.setAttribute(TooltipSetup.InitializedAttribute, '');
        });

        this.observeDom(controller);
    }

    private observeDom(controller: TooltipController): void {
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                for (const node of Array.from(mutation.addedNodes)) {
                    if (!(node instanceof HTMLElement)) {
                        continue;
                    }

                    const newTriggers = [
                        ...(node.matches(TooltipSetup.UninitializedSelector) ? [node] : []),
                        ...Array.from(node.querySelectorAll<HTMLElement>(TooltipSetup.UninitializedSelector)),
                    ];

                    for (const trigger of newTriggers) {
                        trigger.setAttribute(TooltipSetup.InitializedAttribute, '');
                        controller.registerTrigger(trigger);
                    }
                }
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Tooltip().init();
});

export default Tooltip;