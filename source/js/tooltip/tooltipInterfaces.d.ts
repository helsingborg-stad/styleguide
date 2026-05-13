interface TooltipPosition {
    left: number;
    top: number;
    arrowLeft: number;
}

interface TooltipViewInterface {
    readonly element: HTMLDivElement;
    readonly id: string;
    show(content: string): void;
    reveal(): void;
    hide(): void;
    setPosition(position: TooltipPosition): void;
    isVisible(): boolean;
}

interface TooltipEventsCallbacks {
    onTriggerEnter(trigger: HTMLElement): void;
    onTriggerLeave(trigger: HTMLElement): void;
    onTriggerFocus(trigger: HTMLElement): void;
    onTriggerBlur(trigger: HTMLElement): void;
    onPointerDown(target: EventTarget | null): void;
    onEscape(): void;
    onViewportChange(): void;
}

interface TooltipEventsInterface {
    bindTriggers(triggers: HTMLElement[]): void;
    addGlobalListeners(): void;
    removeGlobalListeners(): void;
}