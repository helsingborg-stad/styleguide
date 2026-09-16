import { afterEach, describe, expect, it, jest } from '@jest/globals';
import PopoverSetup from './popoverSetup';

describe('PopoverSetup', () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('skips viewport updates when no popover is open', () => {
        const onViewportChange = jest.fn();
        jest.spyOn(document, 'querySelector').mockReturnValue(null);

        const setup = new PopoverSetup();
        setup.init({
            onSetupPair: jest.fn(),
            onViewportChange,
        });

        document.dispatchEvent(new Event('scroll'));
        window.dispatchEvent(new Event('resize'));

        expect(onViewportChange).not.toHaveBeenCalled();
    });

    it('runs viewport updates when a popover is open', () => {
        const onViewportChange = jest.fn();
        const popover = document.createElement('div');

        jest.spyOn(document, 'querySelector').mockReturnValue(popover);

        const setup = new PopoverSetup();
        setup.init({
            onSetupPair: jest.fn(),
            onViewportChange,
        });

        document.dispatchEvent(new Event('scroll'));
        window.dispatchEvent(new Event('resize'));

        expect(onViewportChange).toHaveBeenCalledTimes(2);
    });
});