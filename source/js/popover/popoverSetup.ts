import { PopoverSetup as PopoverSetupEnums } from './popoverEnums';

class PopoverSetup {
    private onSetupPair: ((trigger: HTMLElement, popover: HTMLElement) => void) | null = null;
    private onViewportChange: (() => void) | null = null;

    public init(
        callbacks: PopoverSetupCallbacks,
        root: HTMLElement = document.body
    ): void {
        this.onSetupPair = callbacks.onSetupPair;
        this.onViewportChange = callbacks.onViewportChange;
        this.bindWithin(root);
        this.observeDom();
    }

    private bindWithin(root: HTMLElement): void {
        for (const trigger of this.getTriggers(root)) {
            const popover = this.getPopover(trigger);

            if (!popover) {
                continue;
            }

            this.onSetupPair?.(trigger, popover);
        }
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

        window.addEventListener('resize', () => this.onViewportChange?.(), { passive: true });
        document.addEventListener('scroll', () => this.onViewportChange?.(), { capture: true, passive: true });
    }

    private getTriggers(root: HTMLElement): HTMLElement[] {
        return [
            ...(root.matches(PopoverSetupEnums.TriggerSelector) ? [root] : []),
            ...Array.from(root.querySelectorAll<HTMLElement>(PopoverSetupEnums.TriggerSelector)),
        ];
    }

    private getPopover(trigger: HTMLElement): HTMLElement | null {
        const popoverId = trigger.getAttribute('popovertarget')?.trim();

        if (!popoverId) {
            return null;
        }

        const popover = document.getElementById(popoverId);
        return popover && popover.matches(PopoverSetupEnums.PopoverSelector) ? popover : null;
    }
}

export default PopoverSetup;