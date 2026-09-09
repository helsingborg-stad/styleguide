import { PopoverSetup } from './popoverEnums';
import PopoverAnimator from './popoverAnimator';
import PopoverPositioner from './popoverPositioner';
import PopoverView from './popoverView';

class Popover {
    private readonly view = new PopoverView();
    private readonly positioner = new PopoverPositioner();
    private readonly animator = new PopoverAnimator();
    private readonly lastInteractionTrigger = new WeakMap<HTMLElement, HTMLElement>();

    public init(): void {
        this.bindWithin(document.body);
        this.observeDom();
        this.positionOpenPopovers();
        this.addViewportListeners();
    }

    private observeDom(): void {
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                for (const node of Array.from(mutation.addedNodes)) {
                    if (!(node instanceof HTMLElement)) {
                        continue;
                    }

                    this.bindWithin(node);
                }
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    private addViewportListeners(): void {
        const syncPositionWhenOpen = () => {
            this.positionOpenPopovers();
        };

        window.addEventListener('resize', syncPositionWhenOpen, { passive: true });
        document.addEventListener('scroll', syncPositionWhenOpen, { capture: true, passive: true });
    }

    private bindWithin(root: HTMLElement): void {
        this.getPopovers(root).forEach((popover) => this.bindPopover(popover));
        this.getTriggers(root).forEach((trigger) => this.bindTrigger(trigger));
    }

    private getPopovers(root: HTMLElement): HTMLElement[] {
        return [
            ...(root.matches(PopoverSetup.PopoverSelector) ? [root] : []),
            ...Array.from(root.querySelectorAll<HTMLElement>(PopoverSetup.PopoverSelector)),
        ];
    }

    private getTriggers(root: HTMLElement): HTMLElement[] {
        return [
            ...(root.matches(PopoverSetup.TriggerSelector) ? [root] : []),
            ...Array.from(root.querySelectorAll<HTMLElement>(PopoverSetup.TriggerSelector)),
        ];
    }

    private bindTrigger(trigger: HTMLElement): void {
        if (trigger.hasAttribute(PopoverSetup.TriggerInitializedAttribute)) {
            return;
        }

        trigger.addEventListener('click', () => {
            const popover = this.getPopoverByTrigger(trigger);

            if (!popover) {
                return;
            }

            this.lastInteractionTrigger.set(popover, trigger);
            popover.setAttribute(PopoverSetup.PendingPositionAttribute, 'true');

            window.requestAnimationFrame(() => {
                this.positionIfOpen(popover, trigger);
            });
        });

        trigger.setAttribute(PopoverSetup.TriggerInitializedAttribute, '');
    }

    private bindPopover(popover: HTMLElement): void {
        if (popover.hasAttribute(PopoverSetup.InitializedAttribute)) {
            return;
        }

        this.animator.bind(popover);

        popover.addEventListener('beforetoggle', (event) => {
            const beforeToggleEvent = event as BeforeToggleEvent;

            if (beforeToggleEvent.newState === 'open') {
                popover.setAttribute(PopoverSetup.PendingPositionAttribute, 'true');
                return;
            }

            if (beforeToggleEvent.newState === 'closed') {
                popover.removeAttribute(PopoverSetup.PendingPositionAttribute);
            }
        });

        popover.addEventListener('toggle', () => {
            this.onPopoverToggle(popover);
        });

        popover.setAttribute(PopoverSetup.InitializedAttribute, '');
    }

    private onPopoverToggle(popover: HTMLElement): void {
        if (this.isOpen(popover)) {
            const trigger = this.getTrigger(popover);

            if (trigger) {
                this.position(trigger, popover);
            }

            window.requestAnimationFrame(() => {
                popover.removeAttribute(PopoverSetup.PendingPositionAttribute);
            });

            this.setTriggersExpanded(popover, true);
            return;
        }

        this.view.resetResponsiveWidth(popover);
        popover.removeAttribute(PopoverSetup.PendingPositionAttribute);
        this.setTriggersExpanded(popover, false);
    }

    private positionOpenPopovers(): void {
        Array.from(document.querySelectorAll<HTMLElement>(PopoverSetup.PopoverSelector)).forEach((popover) => {
            if (!this.isOpen(popover)) {
                return;
            }

            const trigger = this.getTrigger(popover);

            if (trigger) {
                this.position(trigger, popover);
            }
        });
    }

    private positionIfOpen(popover: HTMLElement, fallbackTrigger?: HTMLElement): void {
        if (!this.isOpen(popover)) {
            return;
        }

        const trigger = fallbackTrigger ?? this.getTrigger(popover);

        if (!trigger) {
            return;
        }

        this.position(trigger, popover);
    }

    private position(trigger: HTMLElement, popover: HTMLElement): void {
        this.view.syncResponsiveWidth(popover);
        const { left, top, placement } = this.positioner.calculate(trigger, popover);
        this.view.setPosition(popover, { left, top, placement });
    }

    private getPopoverByTrigger(trigger: HTMLElement): HTMLElement | null {
        const popoverId = trigger.getAttribute('popovertarget')?.trim();

        if (!popoverId) {
            return null;
        }

        const popover = document.getElementById(popoverId);
        return popover && popover.matches(PopoverSetup.PopoverSelector) ? popover : null;
    }

    private getTrigger(popover: HTMLElement): HTMLElement | null {
        const lastTrigger = this.lastInteractionTrigger.get(popover);

        if (lastTrigger && document.contains(lastTrigger)) {
            return lastTrigger;
        }

        const popoverId = popover.id.trim();

        if (!popoverId) {
            return null;
        }

        const triggers = Array.from(document.querySelectorAll<HTMLElement>(PopoverSetup.TriggerSelector));
        return triggers.find((trigger) => trigger.getAttribute('popovertarget')?.trim() === popoverId) ?? null;
    }

    private setTriggersExpanded(popover: HTMLElement, isExpanded: boolean): void {
        const popoverId = popover.id.trim();

        if (!popoverId) {
            return;
        }

        const triggers = Array.from(document.querySelectorAll<HTMLElement>(PopoverSetup.TriggerSelector)).filter(
            (trigger) => trigger.getAttribute('popovertarget')?.trim() === popoverId,
        );

        triggers.forEach((trigger) => {
            trigger.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
        });
    }

    private isOpen(popover: HTMLElement): boolean {
        return typeof popover.matches === 'function' ? popover.matches(':popover-open') : !popover.hidden;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Popover().init();
});

export default Popover;

interface BeforeToggleEvent extends Event {
    newState?: 'open' | 'closed';
}