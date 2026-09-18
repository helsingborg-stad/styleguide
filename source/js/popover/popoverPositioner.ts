import { PopoverEnums } from './popoverEnums';

class PopoverPositioner {
	public applyPosition(popoverData: PopoverData) {
		if (this.isCoverPopover(popoverData)) {
			return;
		}

		if (popoverData.relativeElement) {
			this.setRelativeAnchorStyles(popoverData);
			this.setRelativePositionStyles(popoverData);
			return;
		}

		this.setViewportPositionStyles(popoverData);
	}

	private setRelativeAnchorStyles(popoverData: PopoverData) {
		const anchorName = `--${popoverData.id}`;
		popoverData.relativeElement!.style.anchorName = anchorName;
		popoverData.popoverElement.style.positionAnchor = anchorName;
	}

	private isCoverPopover(popoverData: PopoverData): boolean {
		return popoverData.popoverElement.hasAttribute(PopoverEnums.CoverAttribute);
	}

	private setRelativePositionStyles(popoverData: PopoverData) {
		popoverData.popoverElement.style.positionArea = popoverData.verticalPlacement;

		if (popoverData.verticalPlacement === 'center') {
			popoverData.popoverElement.style.positionArea = `center ${popoverData.horizontalPlacement}`;
		}

		if (popoverData.horizontalPlacement === 'left') {
			popoverData.popoverElement.style.left = `anchor(left)`;
		}

		if (popoverData.horizontalPlacement === 'right') {
			popoverData.popoverElement.style.right = `anchor(right)`;
		}
	}

	private setViewportPositionStyles(popoverData: PopoverData) {
		const popoverElement = popoverData.popoverElement;

		if (popoverData.horizontalPlacement === 'left') {
			popoverElement.style.left = '0';
			popoverElement.style.transform = 'none';
		} else if (popoverData.horizontalPlacement === 'right') {
			popoverElement.style.right = '0';
			popoverElement.style.left = 'auto';
			popoverElement.style.transform = 'none';
		} else {
			popoverElement.style.left = '50%';
			popoverElement.style.transform = 'translateX(-50%)';
		}

		if (popoverData.verticalPlacement === 'top') {
			popoverElement.style.top = '0';
			popoverElement.style.bottom = 'auto';
			popoverElement.style.transform += ' translateY(0)';
		} else if (popoverData.verticalPlacement === 'bottom') {
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
