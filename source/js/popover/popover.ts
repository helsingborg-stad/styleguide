import type { PopoverData } from './popoverInterface';
import type PopoverPositioner from './popoverPositioner';

class Popover {
	constructor(
		private popoverData: PopoverData,
		private popoverPositioner: PopoverPositioner,
	) {}

	public init() {
		this.reposition();
		this.dispatchCustomEvent();
	}

    public getPopoverData() {
        return this.popoverData;
    }

    public setPopoverData(popoverData: PopoverData) {
        this.popoverData = popoverData;
    }

	public reposition() {
		this.popoverPositioner.applyPosition(this.popoverData);
	}

	private dispatchCustomEvent() {
		const event = new CustomEvent('popoverInitialized', {
			detail: this,
		});
		this.popoverData.popoverElement.dispatchEvent(event);
	}
}

export default Popover;
