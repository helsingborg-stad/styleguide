import { describe, expect, test } from '@jest/globals';
import PopoverPositionCalculator from './popoverPositionCalculator';

describe('PopoverPositionCalculator', () => {
    test('uses layout width for initial relative horizontal placement', () => {
        const calculator = new PopoverPositionCalculator();
        const trigger = document.createElement('button');
        const popover = document.createElement('div');

        Object.defineProperty(window, 'innerWidth', {
            configurable: true,
            writable: true,
            value: 1600,
        });

        Object.defineProperty(window, 'innerHeight', {
            configurable: true,
            writable: true,
            value: 1200,
        });

        trigger.getBoundingClientRect = () => ({
            top: 200,
            right: 600,
            bottom: 240,
            left: 500,
            width: 100,
            height: 40,
            x: 500,
            y: 200,
            toJSON: () => ({}),
        }) as DOMRect;

        Object.defineProperty(popover, 'offsetWidth', {
            configurable: true,
            get: () => 300,
        });

        Object.defineProperty(popover, 'offsetHeight', {
            configurable: true,
            get: () => 120,
        });

        popover.getBoundingClientRect = () => ({
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            width: 294,
            height: 118,
            x: 0,
            y: 0,
            toJSON: () => ({}),
        }) as DOMRect;

        const position = calculator.calculate({
            trigger,
            popover,
            mode: 'relative',
            horizontalPlacement: 'center',
            verticalPlacement: 'bottom',
            key: 'popover-test',
        });

        expect(position).not.toBeNull();
        expect(position?.left).toBe(400);
        expect(position?.top).toBe(248);
    });
});
