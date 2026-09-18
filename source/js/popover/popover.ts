import type PopoverPositioner from "./popoverPositioner";

class Popover {
    constructor(
        private popoverData: PopoverData,
        private popoverPositioner: PopoverPositioner
    ) {
    }

    public init() {
        this.popoverPositioner.init();
    }
}

export default Popover;