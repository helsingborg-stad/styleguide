import Popover from './popover';
import { PopoverSetup, PopoverTiming } from './popoverEnums';

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

function createBeforeToggleEvent(newState: 'open' | 'closed', oldState: 'open' | 'closed'): Event {
    const event = new Event('beforetoggle', { cancelable: true });

    Object.defineProperty(event, 'newState', {
        configurable: true,
        value: newState,
    });

    Object.defineProperty(event, 'oldState', {
        configurable: true,
        value: oldState,
    });

    return event;
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
                const beforeToggleEvent = createBeforeToggleEvent('open', 'closed');
                this.dispatchEvent(beforeToggleEvent);

                if (beforeToggleEvent.defaultPrevented) {
                    return;
                }

                this.hidden = false;
                this.dispatchEvent(new Event('toggle'));
            },
        });

        Object.defineProperty(HTMLElement.prototype, 'hidePopover', {
            configurable: true,
            value: function hidePopover(this: HTMLElement): void {
                const beforeToggleEvent = createBeforeToggleEvent('closed', 'open');
                this.dispatchEvent(beforeToggleEvent);

                if (beforeToggleEvent.defaultPrevented) {
                    return;
                }

                this.hidden = true;
                this.dispatchEvent(new Event('toggle'));
            },
        });
    });

    afterEach(() => {
        document.body.innerHTML = '';
        jest.restoreAllMocks();
        jest.useRealTimers();
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
        expect(popover.style.getPropertyValue('--o-popover-x')).toBe('80px');
        expect(popover.style.getPropertyValue('--o-popover-y')).toBe('148px');
    });

    it('animates out before the popover closes', () => {
        jest.useFakeTimers();

        const popover = document.getElementById('info-popover') as HTMLElement;

        new Popover().init();
        popover.showPopover();
        popover.hidePopover();

        expect(popover.getAttribute(PopoverSetup.ClosingAttribute)).toBe('true');
        expect(popover.hidden).toBe(false);

        jest.advanceTimersByTime(PopoverTiming.CloseAnimationDurationMs - 1);
        expect(popover.hidden).toBe(false);

        jest.advanceTimersByTime(1);
        expect(popover.hidden).toBe(true);
        expect(popover.hasAttribute(PopoverSetup.ClosingAttribute)).toBe(false);
    });

    it('hides popover until it has been positioned when opening', () => {
        const trigger = document.querySelector<HTMLButtonElement>('[popovertarget]');
        const popover = document.getElementById('info-popover') as HTMLElement;

        jest.spyOn(window, 'requestAnimationFrame').mockImplementation((callback: FrameRequestCallback): number => {
            callback(0);
            return 0;
        });

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

        const beforeToggleStates: string[] = [];
        popover.addEventListener('beforetoggle', () => {
            beforeToggleStates.push(popover.getAttribute(PopoverSetup.PendingPositionAttribute) ?? '');
        });

        popover.showPopover();

        expect(beforeToggleStates).toContain('true');
        expect(popover.getAttribute(PopoverSetup.PendingPositionAttribute)).toBeNull();
    });

    it('keeps native popover layout while positioning', () => {
        const trigger = document.querySelector<HTMLButtonElement>('[popovertarget]');
        const popover = document.getElementById('info-popover') as HTMLElement;

        jest.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function mockGetBoundingClientRect(this: HTMLElement): DOMRect {
            if (this === trigger) {
                return createRect({ top: 100, left: 80, width: 120, height: 40 });
            }

            if (this === popover) {
                return createRect({ top: 0, left: 0, width: 260, height: 80 });
            }

            return createRect({ top: 0, left: 0, width: 0, height: 0 });
        });

        new Popover().init();
        popover.showPopover();

        expect(popover.style.position).toBe('');
        expect(popover.style.inset).toBe('');
        expect(popover.style.right).toBe('auto');
        expect(popover.style.bottom).toBe('auto');
    });

    it('repositions open popover on viewport resize', () => {
        const trigger = document.querySelector<HTMLButtonElement>('[popovertarget]');
        const popover = document.getElementById('info-popover') as HTMLElement;

        let triggerLeft = 80;

        jest.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function mockGetBoundingClientRect(this: HTMLElement): DOMRect {
            if (this === trigger) {
                return createRect({ top: 100, left: triggerLeft, width: 120, height: 40 });
            }

            if (this === popover) {
                return createRect({ top: 0, left: 0, width: 200, height: 80 });
            }

            return createRect({ top: 0, left: 0, width: 0, height: 0 });
        });

        new Popover().init();
        popover.showPopover();

        expect(popover.style.getPropertyValue('--o-popover-x')).toBe('80px');

        triggerLeft = 300;
        window.dispatchEvent(new Event('resize'));

        expect(popover.style.getPropertyValue('--o-popover-x')).toBe('300px');
    });

    it('keeps initial preferred width when viewport grows again after shrinking', () => {
        const trigger = document.querySelector<HTMLButtonElement>('[popovertarget]');
        const popover = document.getElementById('info-popover') as HTMLElement;

        let triggerLeft = 80;
        let dynamicPopoverWidth = 360;

        jest.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function mockGetBoundingClientRect(this: HTMLElement): DOMRect {
            if (this === trigger) {
                return createRect({ top: 100, left: triggerLeft, width: 120, height: 40 });
            }

            if (this === popover) {
                if (window.innerWidth <= 900) {
                    dynamicPopoverWidth = 280;
                }

                if (window.innerWidth >= 1300) {
                    dynamicPopoverWidth = 560;
                }

                return createRect({ top: 0, left: 0, width: dynamicPopoverWidth, height: 120 });
            }

            return createRect({ top: 0, left: 0, width: 0, height: 0 });
        });

        new Popover().init();
        popover.showPopover();

        expect(popover.style.width).toBe('360px');

        Object.defineProperty(window, 'innerWidth', { configurable: true, value: 900 });
        window.dispatchEvent(new Event('resize'));
        expect(popover.style.width).toBe('280px');

        Object.defineProperty(window, 'innerWidth', { configurable: true, value: 1300 });
        triggerLeft = 120;
        window.dispatchEvent(new Event('resize'));

        expect(popover.style.width).toBe('360px');
    });
});
