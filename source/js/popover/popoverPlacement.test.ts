import { afterAll, beforeEach, describe, expect, jest, test } from '@jest/globals';
import PopoverPlacement from './popoverPlacement';

describe('PopoverPlacement', () => {
    const originalInnerWidth = window.innerWidth;

    beforeEach(() => {
        Object.defineProperty(window, 'innerWidth', {
            configurable: true,
            writable: true,
            value: 1200,
        });
    });

    afterAll(() => {
        Object.defineProperty(window, 'innerWidth', {
            configurable: true,
            writable: true,
            value: originalInnerWidth,
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
    });
});
