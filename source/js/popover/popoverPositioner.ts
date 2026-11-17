import { PopoverEnums } from './popoverEnums';
import type { PopoverData } from './popoverInterface';

class PopoverPositioner {
	public applyPosition(popoverData: PopoverData) {
		this.resetPositionStyles(popoverData);

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

	private resetPositionStyles(popoverData: PopoverData) {
		const { popoverElement, relativeElement } = popoverData;

		popoverElement.style.left = '';
		popoverElement.style.right = '';
		popoverElement.style.top = '';
		popoverElement.style.bottom = '';
		popoverElement.style.transform = '';
		popoverElement.style.translate = '';
		popoverElement.style.setProperty('position-area', '');
		popoverElement.style.setProperty('position-anchor', '');

		if (relativeElement) {
			relativeElement.style.setProperty('anchor-name', '');
		}
	}

	private setRelativeAnchorStyles(popoverData: PopoverData) {
		const anchorName = `--${popoverData.id}`;
		popoverData.relativeElement!.style.setProperty('anchor-name', anchorName);
		popoverData.popoverElement.style.setProperty('position-anchor', anchorName);
	}

	private isCoverPopover(popoverData: PopoverData): boolean {
		return popoverData.popoverElement.hasAttribute(PopoverEnums.CoverAttribute);
	}

	private setRelativePositionStyles(popoverData: PopoverData) {
		popoverData.popoverElement.style.setProperty('position-area', popoverData.verticalPlacement);

		if (popoverData.verticalPlacement === 'center') {
			popoverData.popoverElement.style.setProperty('position-area', `center ${popoverData.horizontalPlacement}`);
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
		} else if (popoverData.horizontalPlacement === 'right') {
			popoverElement.style.right = '0';
			popoverElement.style.left = 'auto';
		} else {
			popoverElement.style.left = '50%';
		}

		if (popoverData.verticalPlacement === 'top') {
			popoverElement.style.top = '0';
			popoverElement.style.bottom = 'auto';
		} else if (popoverData.verticalPlacement === 'bottom') {
			popoverElement.style.bottom = '0';
			popoverElement.style.top = 'auto';
		} else {
			popoverElement.style.top = '50%';
		}

		if (popoverData.horizontalPlacement === 'center' || popoverData.verticalPlacement === 'center') {
			popoverElement.style.translate = `${popoverData.horizontalPlacement === 'center' ? '-50%' : '0'} ${popoverData.verticalPlacement === 'center' ? '-50%' : '0'}`;
		}
	}
}

export default PopoverPositioner;
