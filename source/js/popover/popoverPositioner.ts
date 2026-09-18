import { PopoverEnums } from './popoverEnums';

class PopoverPositioner {
	constructor(private popoverData: PopoverData) {}

	public init() {
		if (this.isCoverPopover()) {
			return;
		}

		if (this.popoverData.relativeElement) {
			this.setRelativeAnchorStyles();
			this.setRelativePositionStyles();
			return;
		}

		this.setViewportPositionStyles();
	}

	private setRelativeAnchorStyles() {
		const anchorName = `--${this.popoverData.id}`;
		this.popoverData.relativeElement!.style.anchorName = anchorName;
		this.popoverData.popoverElement.style.positionAnchor = anchorName;
	}

	private isCoverPopover(): boolean {
		return this.popoverData.popoverElement.hasAttribute(PopoverEnums.CoverAttribute);
	}

	private setRelativePositionStyles() {
		this.popoverData.popoverElement.style.positionArea = this.popoverData.verticalPlacement;

		if (this.popoverData.verticalPlacement === 'center') {
			this.popoverData.popoverElement.style.positionArea = `center ${this.popoverData.horizontalPlacement}`;
		}

		if (this.popoverData.horizontalPlacement === 'left') {
			this.popoverData.popoverElement.style.left = `anchor(left)`;
		}

		if (this.popoverData.horizontalPlacement === 'right') {
			this.popoverData.popoverElement.style.right = `anchor(right)`;
		}
	}

	private setViewportPositionStyles() {
		const popoverElement = this.popoverData.popoverElement;

		if (this.popoverData.horizontalPlacement === 'left') {
			popoverElement.style.left = '0';
			popoverElement.style.transform = 'none';
		} else if (this.popoverData.horizontalPlacement === 'right') {
			popoverElement.style.right = '0';
			popoverElement.style.left = 'auto';
			popoverElement.style.transform = 'none';
		} else {
			popoverElement.style.left = '50%';
			popoverElement.style.transform = 'translateX(-50%)';
		}

		if (this.popoverData.verticalPlacement === 'top') {
			popoverElement.style.top = '0';
			popoverElement.style.bottom = 'auto';
			popoverElement.style.transform += ' translateY(0)';
		} else if (this.popoverData.verticalPlacement === 'bottom') {
			popoverElement.style.bottom = '0';
			popoverElement.style.top = 'auto';
			popoverElement.style.transform += ' translateY(0)';
		} else {
			popoverElement.style.top = '50%';
			popoverElement.style.transform += `translateY(-50%)`;
		}
	}
}

export default PopoverPositioner;
