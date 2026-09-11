import Popover from './popover';

describe('Popover', () => {
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
});
