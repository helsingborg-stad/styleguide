import Popover from './popover';
import type { PopoverData } from './popoverInterface';
import PopoverPositioner from './popoverPositioner';

describe('Popover', () => {
    it('updates the relative element and repositions against it', () => {
        const popoverElement = document.createElement('div');
        const firstAnchor = document.createElement('button');
        const secondAnchor = document.createElement('button');
        const popoverData: PopoverData = {
            id: 'test',
            popoverElement,
            popoverTarget: firstAnchor,
            relativeElement: null,
            horizontalPlacement: 'center',
            verticalPlacement: 'bottom',
            relative: false,
            cover: false,
        };
        const popover = new Popover(popoverData, new PopoverPositioner());

        popover.setRelativeElement(firstAnchor);
        expect(popoverData.relativeElement).toBe(firstAnchor);
        expect(popoverElement.style.getPropertyValue('position-anchor')).toBe('--test');

        popover.setRelativeElement(secondAnchor);
        expect(popoverData.relativeElement).toBe(secondAnchor);
        expect(popoverElement.style.getPropertyValue('position-anchor')).toBe('--test');
        expect(secondAnchor.style.getPropertyValue('anchor-name')).toBe('--test');
        expect(firstAnchor.style.getPropertyValue('anchor-name')).toBe('');

        popover.setRelativeElement(firstAnchor);
        expect(popoverData.relativeElement).toBe(firstAnchor);
        expect(firstAnchor.style.getPropertyValue('anchor-name')).toBe('--test');
        expect(secondAnchor.style.getPropertyValue('anchor-name')).toBe('');

        popover.setRelativeElement(null);
        expect(popoverData.relativeElement).toBeNull();
        expect(popoverElement.style.getPropertyValue('position-anchor')).toBe('');
        expect(firstAnchor.style.getPropertyValue('anchor-name')).toBe('');
    });
});
