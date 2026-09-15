import { describe, expect, test } from '@jest/globals';
import PopoverPositionCalculator from './popoverPositionCalculator';

describe('PopoverPositionCalculator', () => {
    test('uses the trigger as relative target when no separate relative element is provided', () => {
        const calculator = new PopoverPositionCalculator();
        const trigger = document.createElement('button');
        const popover = document.createElement('div');

        popover.setAttribute('data-js-popover-relative', 'true');

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
            horizontalPlacement: 'center',
            verticalPlacement: 'bottom',
            key: 'popover-test',
        });

        expect(position).not.toBeNull();
        expect(position?.left).toBe(400);
        expect(position?.top).toBe(248);
    });

    test('positions popover relative to the provided relative element instead of the trigger', () => {
        const calculator = new PopoverPositionCalculator();
        const trigger = document.createElement('button');
        const relativeElement = document.createElement('div');
        const popover = document.createElement('div');

        popover.setAttribute('data-js-popover-relative', 'true');

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
            top: 40,
            right: 140,
            bottom: 80,
            left: 40,
            width: 100,
            height: 40,
            x: 40,
            y: 40,
            toJSON: () => ({}),
        }) as DOMRect;

        relativeElement.getBoundingClientRect = () => ({
            top: 300,
            right: 900,
            bottom: 360,
            left: 700,
            width: 200,
            height: 60,
            x: 700,
            y: 300,
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

        const position = calculator.calculate({
            trigger,
            relativeElement,
            popover,
            horizontalPlacement: 'center',
            verticalPlacement: 'bottom',
            key: 'popover-test-relative-element',
        });

        expect(position).not.toBeNull();
        expect(position?.left).toBe(650);
        expect(position?.top).toBe(368);
    });
});
