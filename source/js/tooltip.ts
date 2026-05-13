const TOOLTIP_SELECTOR = '[data-tooltip]';
const TOOLTIP_ID = 'styleguide-tooltip';
const TOOLTIP_OFFSET = 7;
const TOOLTIP_VIEWPORT_MARGIN = 12;
const TOOLTIP_ARROW_MARGIN = 12;

class Tooltip {
    private activeTrigger: HTMLElement | null = null;
    private tooltip!: HTMLDivElement;
    private repositionFrameId: number | null = null;
    private showFrameId: number | null = null;
    private readonly triggers: HTMLElement[];

    constructor() {
        this.triggers = Array.from(document.querySelectorAll<HTMLElement>(TOOLTIP_SELECTOR));

        if (this.triggers.length === 0) {
            return;
        }

        this.tooltip = this.createTooltip();

        this.registerEvents();
    }

    public destroy(): void {
        if (!this.tooltip) {
            return;
        }

        this.cancelScheduledShow();
        this.cancelScheduledReposition();
        this.hideTooltip(this.activeTrigger);
        this.unregisterEvents();
        this.removeGlobalListeners();
        this.tooltip.remove();
    }

    private createTooltip(): HTMLDivElement {
        const existingTooltip = document.getElementById(TOOLTIP_ID) as HTMLDivElement | null;

        if (existingTooltip) {
            return existingTooltip;
        }

        const el = document.createElement('div');
        el.id = TOOLTIP_ID;
        el.className = 'o-tooltip';
        el.setAttribute('role', 'tooltip');
        el.setAttribute('aria-hidden', 'true');
        document.body.appendChild(el);

        return el;
    }

    private registerEvents(): void {
        this.triggers.forEach((trigger) => {
            trigger.addEventListener('pointerenter', this.handleTriggerPointerEnter, { passive: true });
            trigger.addEventListener('pointerleave', this.handleTriggerPointerLeave, { passive: true });
            trigger.addEventListener('focus', this.handleTriggerFocus);
            trigger.addEventListener('blur', this.handleTriggerBlur);
        });
    }

    private unregisterEvents(): void {
        this.triggers.forEach((trigger) => {
            trigger.removeEventListener('pointerenter', this.handleTriggerPointerEnter);
            trigger.removeEventListener('pointerleave', this.handleTriggerPointerLeave);
            trigger.removeEventListener('focus', this.handleTriggerFocus);
            trigger.removeEventListener('blur', this.handleTriggerBlur);
        });
    }

    private addGlobalListeners(): void {
        document.addEventListener('pointerdown', this.handlePointerDown, true);
        document.addEventListener('keydown', this.handleKeyDown, true);
        window.addEventListener('resize', this.repositionActiveTooltip, { passive: true });
        document.addEventListener('scroll', this.repositionActiveTooltip, { capture: true, passive: true });
    }

    private removeGlobalListeners(): void {
        document.removeEventListener('pointerdown', this.handlePointerDown, true);
        document.removeEventListener('keydown', this.handleKeyDown, true);
        window.removeEventListener('resize', this.repositionActiveTooltip);
        document.removeEventListener('scroll', this.repositionActiveTooltip, true);
    }

    private handleTriggerPointerEnter = (event: Event): void => {
        const trigger = event.currentTarget as HTMLElement | null;

        if (!trigger || this.activeTrigger === trigger) {
            return;
        }

        this.showTooltip(trigger);
    };

    private handleTriggerPointerLeave = (event: Event): void => {
        const trigger = event.currentTarget as HTMLElement | null;
        if (!trigger) {
            return;
        }

        this.hideTooltip(trigger);
    };

    private handleTriggerFocus = (event: Event): void => {
        const trigger = event.currentTarget as HTMLElement | null;
        if (!trigger) {
            return;
        }

        this.showTooltip(trigger);
    };

    private handleTriggerBlur = (event: Event): void => {
        const trigger = event.currentTarget as HTMLElement | null;
        if (!trigger) {
            return;
        }

        this.hideTooltip(trigger);
    };

    private handlePointerDown = (event: Event): void => {
        if (this.activeTrigger && this.getTrigger(event.target) !== this.activeTrigger) {
            this.hideTooltip(this.activeTrigger);
        }
    };

    private handleKeyDown = (event: Event): void => {
        if ((event as KeyboardEvent).key === 'Escape') {
            this.hideTooltip(this.activeTrigger);
        }
    };

    private getTrigger(target: EventTarget | null): HTMLElement | null {
        if (!(target instanceof Element)) {
            return null;
        }

        return target.closest<HTMLElement>(TOOLTIP_SELECTOR);
    }

    private showTooltip(trigger: HTMLElement): void {
        const content = trigger.dataset.tooltip?.trim();

        if (!content) {
            return;
        }

        if (this.activeTrigger && this.activeTrigger !== trigger) {
            this.activeTrigger.removeAttribute('aria-describedby');
        }

        this.activeTrigger = trigger;
        this.addGlobalListeners();
        trigger.setAttribute('aria-describedby', TOOLTIP_ID);
        this.tooltip.textContent = content;
        this.tooltip.style.visibility = 'hidden';
        this.tooltip.classList.remove('is-visible');
        this.tooltip.setAttribute('aria-hidden', 'false');

        this.positionTooltip(trigger);
        this.scheduleShow(trigger);
    }

    private hideTooltip(trigger?: HTMLElement | null): void {
        if (trigger && this.activeTrigger !== trigger) {
            return;
        }

        this.activeTrigger?.removeAttribute('aria-describedby');
        this.activeTrigger = null;
        this.removeGlobalListeners();
        this.cancelScheduledShow();
        this.cancelScheduledReposition();
        this.tooltip.classList.remove('is-visible');
        this.tooltip.setAttribute('aria-hidden', 'true');
        this.tooltip.style.visibility = '';
        this.tooltip.textContent = '';
        this.tooltip.style.removeProperty('--o-tooltip-x');
        this.tooltip.style.removeProperty('--o-tooltip-y');
        this.tooltip.style.removeProperty('--o-tooltip-arrow-left');
    }

    private repositionActiveTooltip = (): void => {
        if (!this.activeTrigger || this.tooltip.getAttribute('aria-hidden') !== 'false') {
            return;
        }

        this.schedulePositionTooltip(this.activeTrigger);
    };

    private schedulePositionTooltip(trigger: HTMLElement): void {
        this.cancelScheduledReposition();

        this.repositionFrameId = requestAnimationFrame(() => {
            this.positionTooltip(trigger);
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

            this.tooltip.style.visibility = '';
            this.tooltip.classList.add('is-visible');
            this.showFrameId = null;
        });
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

    private positionTooltip(trigger: HTMLElement): void {
        const triggerRect = trigger.getBoundingClientRect();
        const tooltipRect = this.tooltip.getBoundingClientRect();
        const triggerCenter = triggerRect.left + triggerRect.width / 2;
        const maxLeft = Math.max(TOOLTIP_VIEWPORT_MARGIN, window.innerWidth - tooltipRect.width - TOOLTIP_VIEWPORT_MARGIN);
        const preferredLeft = triggerCenter - tooltipRect.width / 2;
        const left = Math.min(maxLeft, Math.max(TOOLTIP_VIEWPORT_MARGIN, preferredLeft));
        const top = triggerRect.top - tooltipRect.height - TOOLTIP_OFFSET;
        const arrowLeft = Math.min(tooltipRect.width - TOOLTIP_ARROW_MARGIN, Math.max(TOOLTIP_ARROW_MARGIN, triggerCenter - left));

        this.tooltip.style.setProperty('--o-tooltip-x', `${Math.round(left)}px`);
        this.tooltip.style.setProperty('--o-tooltip-y', `${Math.round(top)}px`);
        this.tooltip.style.setProperty('--o-tooltip-arrow-left', `${Math.round(arrowLeft)}px`);
    }
}

export default Tooltip;