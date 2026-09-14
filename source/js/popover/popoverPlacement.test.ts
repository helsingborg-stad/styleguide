import { afterAll, beforeEach, describe, expect, jest, test } from '@jest/globals';
import PopoverPlacement from './popoverPlacement';

describe('PopoverPlacement', () => {
    const originalInnerWidth = window.innerWidth;
    const originalInnerHeight = window.innerHeight;

    beforeEach(() => {
        Object.defineProperty(window, 'innerWidth', {
            configurable: true,
            writable: true,
            value: 1200,
        });

        Object.defineProperty(window, 'innerHeight', {
            configurable: true,
            writable: true,
            value: 800,
        });
    });

    afterAll(() => {
        Object.defineProperty(window, 'innerWidth', {
            configurable: true,
            writable: true,
            value: originalInnerWidth,
        });

        Object.defineProperty(window, 'innerHeight', {
            configurable: true,
            writable: true,
            value: originalInnerHeight,
        });
    });

    test('uses layout width instead of transformed bounding box width', () => {
        const placement = new PopoverPlacement();
        const popover = document.createElement('div');

        Object.defineProperty(popover, 'offsetWidth', {
            configurable: true,
            get: () => 300,
        });

        popover.getBoundingClientRect = jest.fn(() => ({
            width: 294,
            height: 50,
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            x: 0,
            y: 0,
            toJSON: () => ({}),
        })) as unknown as () => DOMRect;

        placement.syncResponsiveWidth(popover);

        expect(popover.style.width).toBe('300px');
        expect(popover.style.maxWidth).toBe('1176px');
        expect(popover.style.maxHeight).toBe('776px');
    });

    test('falls back to bounding box width when layout width is unavailable', () => {
        const placement = new PopoverPlacement();
        const popover = document.createElement('div');

        Object.defineProperty(popover, 'offsetWidth', {
            configurable: true,
            get: () => 0,
        });

        popover.getBoundingClientRect = jest.fn(() => ({
            width: 250,
            height: 50,
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            x: 0,
            y: 0,
            toJSON: () => ({}),
        })) as unknown as () => DOMRect;

        placement.syncResponsiveWidth(popover);

        expect(popover.style.width).toBe('250px');
        expect(popover.style.maxHeight).toBe('776px');
    });

    test('remeasures cached width on viewport resize', () => {
        const placement = new PopoverPlacement();
        const popover = document.createElement('div');

        Object.defineProperty(popover, 'offsetWidth', {
            configurable: true,
            get: () => {
                if (popover.style.width) {
                    return parseInt(popover.style.width, 10);
                }

                return Math.min(600, window.innerWidth - 24);
            },
        });

        popover.getBoundingClientRect = jest.fn(() => ({
            width: Math.min(600, window.innerWidth - 24),
            height: 50,
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            x: 0,
            y: 0,
            toJSON: () => ({}),
        })) as unknown as () => DOMRect;

        Object.defineProperty(window, 'innerWidth', {
            configurable: true,
            writable: true,
            value: 320,
        });

        placement.syncResponsiveWidth(popover);

        expect(popover.style.width).toBe('296px');

        Object.defineProperty(window, 'innerWidth', {
            configurable: true,
            writable: true,
            value: 1200,
        });

        placement.syncResponsiveWidth(popover);

        expect(popover.style.width).toBe('600px');
        expect(popover.style.maxHeight).toBe('776px');
    });

    test('resets viewport max height when responsive sizing is cleared', () => {
        const placement = new PopoverPlacement();
        const popover = document.createElement('div');

        Object.defineProperty(popover, 'offsetWidth', {
            configurable: true,
            get: () => 300,
        });

        placement.syncResponsiveWidth(popover);
        placement.resetResponsiveWidth(popover);

        expect(popover.style.maxHeight).toBe('');
    });
});
