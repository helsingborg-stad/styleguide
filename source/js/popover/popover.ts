import type { PopoverData, PopoverPlacement } from './popoverInterface';
import { HorizontalPlacement, PopoverEnums, VerticalPlacement } from './popoverEnums';
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

    public setPositionData(positionData: PopoverPlacement) {
        this.popoverData.horizontalPlacement = HorizontalPlacement[positionData.horizontalPlacement ?? this.popoverData.horizontalPlacement] || 'center';

        this.popoverData.verticalPlacement = VerticalPlacement[positionData.verticalPlacement ?? this.popoverData.verticalPlacement] || 'center';
    }

    public setCover(isCover: boolean) {
        this.popoverData.cover = isCover;
        this.popoverData.popoverElement.toggleAttribute(PopoverEnums.CoverAttribute, isCover);
    }

    public setRelativeElement(relativeElement: HTMLElement | null) {
        const previousRelativeElement = this.popoverData.relativeElement;
        const generatedAnchorName = `--${this.popoverData.id}`;

        if (
            previousRelativeElement &&
            previousRelativeElement !== relativeElement &&
            previousRelativeElement.style.getPropertyValue('anchor-name') === generatedAnchorName
        ) {
            previousRelativeElement.style.setProperty('anchor-name', '');
        }

        this.popoverData.relativeElement = relativeElement;
        this.reposition();
    }

	public reposition() {
		this.popoverPositioner.applyPosition(this.popoverData);
	}

	private dispatchCustomEvent() {
		const event = new CustomEvent('popover:initialized', {
			detail: {
                popover: this,
                id: this.popoverData.id,
                element: this.popoverData.popoverElement,
            }
		});

		document.dispatchEvent(event);
	}
}

export default Popover;
