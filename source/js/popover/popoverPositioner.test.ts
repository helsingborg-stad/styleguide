import PopoverPositioner from './popoverPositioner';
import type { PopoverData, PopoverHorizontalPlacement, PopoverVerticalPlacement } from './popoverInterface';

describe('PopoverPositioner', () => {
    it.each([
        ['left', 'top', ''],
        ['right', 'bottom', ''],
        ['center', 'top', '-50% 0'],
        ['left', 'center', '0 -50%'],
        ['center', 'center', '-50% -50%'],
    ])('positions %s / %s without overriding the animation transform', (horizontal, vertical, translate) => {
        const element = document.createElement('div');
        const data: PopoverData = {
            id: 'test',
            popoverElement: element,
            popoverTarget: document.createElement('button'),
            relativeElement: null,
            horizontalPlacement: horizontal as PopoverHorizontalPlacement,
            verticalPlacement: vertical as PopoverVerticalPlacement,
            relative: false,
            cover: false,
        };

        new PopoverPositioner().applyPosition(data);

        expect(element.style.translate).toBe(translate);
        expect(element.style.transform).toBe('');
    });

    it('clears viewport centering when switching to a cover or relative popover', () => {
        const element = document.createElement('div');
        const anchor = document.createElement('button');
        const data: PopoverData = {
            id: 'test',
            popoverElement: element,
            popoverTarget: anchor,
            relativeElement: null,
            horizontalPlacement: 'center',
            verticalPlacement: 'center',
            relative: false,
            cover: false,
        };
        const positioner = new PopoverPositioner();

        positioner.applyPosition(data);
        data.relativeElement = anchor;
        positioner.applyPosition(data);

        expect(element.style.translate).toBe('');
        expect(element.style.getPropertyValue('position-anchor')).toBe('--test');

        data.relativeElement = null;
        element.setAttribute('data-js-popover-cover', '');
        positioner.applyPosition(data);
        expect(element.style.translate).toBe('');
    });
});
