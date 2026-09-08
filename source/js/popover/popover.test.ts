import Popover from './popover';

type RectInit = {
    top: number;
    left: number;
    width: number;
    height: number;
};

function createRect({ top, left, width, height }: RectInit): DOMRect {
    return {
        x: left,
        y: top,
        top,
        left,
        width,
        height,
        right: left + width,
        bottom: top + height,
        toJSON: () => '',
    } as DOMRect;
}

describe('popover', () => {
    const originalInnerWidth = window.innerWidth;
    const originalInnerHeight = window.innerHeight;

    beforeEach(() => {
        document.body.innerHTML = `
            <button type="button" popovertarget="info-popover">Open</button>
            <div id="info-popover" popover>Helpful content</div>
        `;

        Object.defineProperty(window, 'innerWidth', { configurable: true, value: 1200 });
        Object.defineProperty(window, 'innerHeight', { configurable: true, value: 800 });

        Object.defineProperty(HTMLElement.prototype, 'showPopover', {
            configurable: true,
            value: function showPopover(this: HTMLElement): void {
                this.hidden = false;
                this.dispatchEvent(new Event('toggle'));
            },
        });

        Object.defineProperty(HTMLElement.prototype, 'hidePopover', {
            configurable: true,
            value: function hidePopover(this: HTMLElement): void {
                this.hidden = true;
                this.dispatchEvent(new Event('toggle'));
            },
        });
    });

    afterEach(() => {
        document.body.innerHTML = '';
        jest.restoreAllMocks();
        Object.defineProperty(window, 'innerWidth', { configurable: true, value: originalInnerWidth });
        Object.defineProperty(window, 'innerHeight', { configurable: true, value: originalInnerHeight });
    });

    it('positions a popover relative to its trigger when the browser opens it', () => {
        const trigger = document.querySelector<HTMLButtonElement>('[popovertarget]');
        const popover = document.getElementById('info-popover') as HTMLElement;

        jest.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function mockGetBoundingClientRect(this: HTMLElement): DOMRect {
            if (this === trigger) {
                return createRect({ top: 100, left: 80, width: 120, height: 40 });
            }

            if (this === popover) {
                return createRect({ top: 0, left: 0, width: 200, height: 80 });
            }

            return createRect({ top: 0, left: 0, width: 0, height: 0 });
        });

        new Popover().init();
        popover.showPopover();

        expect(trigger?.getAttribute('aria-expanded')).toBe('true');
        expect(popover.dataset.placement).toBe('bottom');
        expect(popover.style.getPropertyValue('--o-popover-x')).toBe('40px');
        expect(popover.style.getPropertyValue('--o-popover-y')).toBe('148px');
    });
});
