class TooltipEvents implements TooltipEventsInterface {
    constructor(private readonly callbacks: TooltipEventsCallbacks) {}

    public bindTriggers(triggers: HTMLElement[]): void {
        triggers.forEach((trigger) => {
            trigger.addEventListener('pointerenter', this.handlePointerEnter, { passive: true });
            trigger.addEventListener('pointerleave', this.handlePointerLeave, { passive: true });
            trigger.addEventListener('focus', this.handleFocus);
            trigger.addEventListener('blur', this.handleBlur);
        });
    }

    public addGlobalListeners(): void {
        document.addEventListener('pointerdown', this.handlePointerDown, true);
        document.addEventListener('keydown', this.handleKeyDown, true);
        window.addEventListener('resize', this.handleViewportChange, { passive: true });
        document.addEventListener('scroll', this.handleViewportChange, { capture: true, passive: true });
    }

    public removeGlobalListeners(): void {
        document.removeEventListener('pointerdown', this.handlePointerDown, true);
        document.removeEventListener('keydown', this.handleKeyDown, true);
        window.removeEventListener('resize', this.handleViewportChange);
        document.removeEventListener('scroll', this.handleViewportChange, true);
    }

    private handlePointerEnter = (event: Event): void => {
        const trigger = event.currentTarget as HTMLElement | null;

        if (trigger) {
            this.callbacks.onTriggerEnter(trigger);
        }
    };

    private handlePointerLeave = (event: Event): void => {
        const trigger = event.currentTarget as HTMLElement | null;

        if (trigger) {
            this.callbacks.onTriggerLeave(trigger);
        }
    };

    private handleFocus = (event: Event): void => {
        const trigger = event.currentTarget as HTMLElement | null;

        if (trigger) {
            this.callbacks.onTriggerFocus(trigger);
        }
    };

    private handleBlur = (event: Event): void => {
        const trigger = event.currentTarget as HTMLElement | null;

        if (trigger) {
            this.callbacks.onTriggerBlur(trigger);
        }
    };

    private handlePointerDown = (event: Event): void => {
        this.callbacks.onPointerDown(event.target);
    };

    private handleKeyDown = (event: Event): void => {
        if ((event as KeyboardEvent).key === 'Escape') {
            this.callbacks.onEscape();
        }
    };

    private handleViewportChange = (): void => {
        this.callbacks.onViewportChange();
    };
}

export default TooltipEvents;