class PopoverEvents implements PopoverEventsInterface {
    constructor(private readonly callbacks: PopoverEventsCallbacks) {}

    public bindTriggers(triggers: HTMLElement[]): void {
        triggers.forEach((trigger) => {
            trigger.addEventListener('click', this.handleTriggerClick);
        });
    }

    public addGlobalListeners(): void {
        document.addEventListener('click', this.handleDocumentClick, true);
        document.addEventListener('keydown', this.handleKeyDown, true);
        window.addEventListener('resize', this.handleViewportChange, { passive: true });
        document.addEventListener('scroll', this.handleViewportChange, { capture: true, passive: true });
    }

    public removeGlobalListeners(): void {
        document.removeEventListener('click', this.handleDocumentClick, true);
        document.removeEventListener('keydown', this.handleKeyDown, true);
        window.removeEventListener('resize', this.handleViewportChange);
        document.removeEventListener('scroll', this.handleViewportChange, true);
    }

    private handleTriggerClick = (event: Event): void => {
        const trigger = event.currentTarget as HTMLElement | null;

        if (trigger) {
            this.callbacks.onTriggerClick(trigger);
        }
    };

    private handleDocumentClick = (event: Event): void => {
        const target = event.target;

        if (!(target instanceof Element)) {
            return;
        }

        const trigger = target.closest<HTMLElement>('[popovertarget]');

        if (trigger) {
            return;
        }

        this.callbacks.onDocumentClick(target);
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

export default PopoverEvents;

interface PopoverEventsCallbacks {
    onTriggerClick(trigger: HTMLElement): void;
    onDocumentClick(target: Element): void;
    onEscape(): void;
    onViewportChange(): void;
}

interface PopoverEventsInterface {
    bindTriggers(triggers: HTMLElement[]): void;
    addGlobalListeners(): void;
    removeGlobalListeners(): void;
}
