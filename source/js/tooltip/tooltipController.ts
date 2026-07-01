import { TooltipDom, TooltipSetup } from './tooltipEnums';
import type TooltipEvents from './tooltipEvents';
import type TooltipPositioner from './tooltipPositioner';
import type TooltipView from './tooltipView';

class TooltipController {
    private activeTrigger: HTMLElement | null = null;
    private repositionFrameId: number | null = null;
    private showFrameId: number | null = null;

    constructor(
        private readonly triggers: HTMLElement[],
        private readonly view: TooltipView,
        private readonly positioner: TooltipPositioner,
        private readonly events: TooltipEvents,
    ) {
    }

    public init(): void {
        this.events.bindTriggers(this.triggers);
    }

    public registerTrigger(trigger: HTMLElement): void {
        this.events.bindTriggers([trigger]);
    }

    public show(trigger: HTMLElement): void {
        const content = trigger.dataset.tooltip?.trim();

        if (!content || this.activeTrigger === trigger) {
            return;
        }

        if (this.activeTrigger) {
            this.activeTrigger.removeAttribute(TooltipDom.AriaDescribedBy);
        }

        this.activeTrigger = trigger;
        this.events.addGlobalListeners();
        trigger.setAttribute(TooltipDom.AriaDescribedBy, this.view.id);
        this.view.show(content);
        this.position(trigger);
        this.scheduleShow(trigger);
    }

    public hide(trigger?: HTMLElement | null): void {
        if (trigger && this.activeTrigger !== trigger) {
            return;
        }

        this.activeTrigger?.removeAttribute(TooltipDom.AriaDescribedBy);
        this.activeTrigger = null;
        this.events.removeGlobalListeners();
        this.cancelScheduledShow();
        this.cancelScheduledReposition();
        this.view.hide();
    }

    public handlePointerDown(target: EventTarget | null): void {
        if (this.activeTrigger && this.getTrigger(target) !== this.activeTrigger) {
            this.hide(this.activeTrigger);
        }
    }

    public repositionActiveTooltip(): void {
        if (!this.activeTrigger || !this.view.isVisible()) {
            return;
        }

        this.schedulePosition(this.activeTrigger);
    }

    private schedulePosition(trigger: HTMLElement): void {
        this.cancelScheduledReposition();

        this.repositionFrameId = requestAnimationFrame(() => {
            this.position(trigger);
            this.repositionFrameId = null;
        });
    }

    private scheduleShow(trigger: HTMLElement): void {
        this.cancelScheduledShow();

        this.showFrameId = requestAnimationFrame(() => {
            if (this.activeTrigger !== trigger) {
                this.showFrameId = null;
                return;
            }

            this.view.reveal();
            this.showFrameId = null;
        });
    }

    private position(trigger: HTMLElement): void {
        this.view.setPosition(this.positioner.calculate(trigger, this.view.element));
    }

    private cancelScheduledReposition(): void {
        if (this.repositionFrameId === null) {
            return;
        }

        cancelAnimationFrame(this.repositionFrameId);
        this.repositionFrameId = null;
    }

    private cancelScheduledShow(): void {
        if (this.showFrameId === null) {
            return;
        }

        cancelAnimationFrame(this.showFrameId);
        this.showFrameId = null;
    }

    private getTrigger(target: EventTarget | null): HTMLElement | null {
        if (!(target instanceof Element)) {
            return null;
        }

        return target.closest<HTMLElement>(TooltipSetup.TriggerSelector);
    }
}

export default TooltipController;