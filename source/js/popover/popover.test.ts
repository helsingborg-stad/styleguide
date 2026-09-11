import { afterEach, describe, expect, it, jest } from '@jest/globals';
import Popover from './popover';

describe('Popover', () => {
    function createPopoverWithCustomPositioning(action?: 'show' | 'hide' | 'toggle') {
        const trigger = document.createElement('button');
        const popover = document.createElement('div');
        let isOpen = false;

        if (action) {
            trigger.setAttribute('popovertargetaction', action);
        }

        Object.defineProperty(popover, 'showPopover', {
            configurable: true,
            value: jest.fn(() => {
                isOpen = true;
            }),
        });

        Object.defineProperty(popover, 'hidePopover', {
            configurable: true,
            value: jest.fn(() => {
                isOpen = false;
            }),
        });

        Object.defineProperty(popover, 'matches', {
            configurable: true,
            value: jest.fn((selector: string) => selector === ':popover-open' && isOpen),
        });

        const placement = {
            syncResponsiveWidth: jest.fn(),
            setPosition: jest.fn(),
            resetCustomPosition: jest.fn(),
        };

        const calculator = {
            hasCustomPositioning: jest.fn(() => true),
            calculate: jest.fn(() => ({
                left: 100,
                top: 120,
                horizontal: 'center',
                vertical: 'bottom',
                mode: 'relative',
                placement: 'relative-bottom-center',
            })),
        };

        const animator = {
            bind: jest.fn(),
        };

        const requestAnimationFrameSpy = jest
            .spyOn(window, 'requestAnimationFrame')
            .mockImplementation((callback: FrameRequestCallback): number => {
                callback(0);
                return 0;
            });

        const instance = new Popover(
            { trigger, popover, mode: 'relative', horizontalPlacement: 'center', verticalPlacement: 'bottom', key: 'test' },
            placement as any,
            calculator as any,
            animator as any,
        );

        instance.init();

        return {
            trigger,
            popover,
            requestAnimationFrameSpy,
        };
    }

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('syncs width before calculating the placement', () => {
        const trigger = document.createElement('button');
        const popover = document.createElement('div');

        const placement = {
            syncResponsiveWidth: jest.fn((element: HTMLElement) => {
                element.style.width = '272px';
            }),
            setPosition: jest.fn(),
            resetCustomPosition: jest.fn(),
        };

        const calculator = {
            hasCustomPositioning: jest.fn(() => true),
            calculate: jest.fn((config: PopoverConfig) => {
                expect(config.popover.style.width).toBe('272px');
                return {
                    left: 100,
                    top: 120,
                    horizontal: 'center',
                    vertical: 'bottom',
                    mode: 'relative',
                    placement: 'relative-bottom-center',
                };
            }),
        };

        const animator = {
            bind: jest.fn(),
        };

        const instance = new Popover(
            { trigger, popover, mode: 'relative', horizontalPlacement: 'center', verticalPlacement: 'bottom', key: 'test' },
            placement as any,
            calculator as any,
            animator as any,
        );

        (instance as any).position();

        expect(placement.syncResponsiveWidth).toHaveBeenCalledWith(popover);
        expect(calculator.calculate).toHaveBeenCalledTimes(1);
    });

    it('keeps a show action idempotent for custom positioning', () => {
        const { trigger, popover, requestAnimationFrameSpy } = createPopoverWithCustomPositioning('show');
        const showPopoverMock = popover.showPopover as jest.Mock;
        const hidePopoverMock = popover.hidePopover as jest.Mock;

        trigger.click();
        trigger.click();

        expect(showPopoverMock).toHaveBeenCalledTimes(1);
        expect(hidePopoverMock).not.toHaveBeenCalled();
        expect(requestAnimationFrameSpy).toHaveBeenCalledTimes(1);
    });

    it('keeps a hide action idempotent when already closed for custom positioning', () => {
        const { trigger, popover, requestAnimationFrameSpy } = createPopoverWithCustomPositioning('hide');
        const showPopoverMock = popover.showPopover as jest.Mock;
        const hidePopoverMock = popover.hidePopover as jest.Mock;

        trigger.click();

        expect(showPopoverMock).not.toHaveBeenCalled();
        expect(hidePopoverMock).not.toHaveBeenCalled();
        expect(requestAnimationFrameSpy).not.toHaveBeenCalled();
    });

    it('opens from the trigger as the popover source when supported', () => {
        const { trigger, popover } = createPopoverWithCustomPositioning('show');
        const showPopoverMock = popover.showPopover as jest.Mock;

        trigger.click();

        expect(showPopoverMock).toHaveBeenCalledWith({ source: trigger });
    });

    it('falls back to a plain showPopover call when the source option is unsupported', () => {
        const { trigger, popover } = createPopoverWithCustomPositioning('show');
        const showPopoverMock = popover.showPopover as jest.Mock;

        showPopoverMock.mockImplementationOnce(() => {
            throw new TypeError('source option not supported');
        }).mockImplementationOnce(() => undefined);

        trigger.click();

        expect(showPopoverMock).toHaveBeenNthCalledWith(1, { source: trigger });
        expect(showPopoverMock).toHaveBeenNthCalledWith(2);
    });
});
