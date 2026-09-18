import type PopoverPositioner from "./popoverPositioner";

class Popover {
    constructor(
        private popoverData: PopoverData,
        private popoverPositioner: PopoverPositioner
    ) {
    }

    public init() {
        this.popoverPositioner.applyPosition(this.popoverData);
        this.dispatchCustomEvent();
    }

    public applyPosition() {
        this.popoverPositioner.applyPosition(this.popoverData);
    }

    public setPopoverData(popoverData: PopoverData) {
        this.popoverData = popoverData;
    }

    public getPopoverData() {
        return this.popoverData;
    }

    private dispatchCustomEvent() {
        const event = new CustomEvent('popoverInitialized', {
            detail: this
        });
        this.popoverData.popoverElement.dispatchEvent(event);
    }
}

export default Popover;