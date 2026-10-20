import ButtonToggleContent from './ButtonToggleContent';

type ViewTransitionMock = {
    finished: Promise<void>;
};

describe('ButtonToggleContent', () => {
    beforeEach(() => {
        document.body.innerHTML = `
            <button data-toggle-label="Close" data-toggle-icon="close">
                <span class="c-button__label-text">Open</span>
                <span class="c-icon"><span>menu</span></span>
            </button>
        `;
        delete (document as Partial<Document>).startViewTransition;
        Object.defineProperty(window, 'matchMedia', {
            configurable: true,
            value: jest.fn().mockReturnValue({ matches: false }),
        });
    });

    afterEach(() => {
        jest.useRealTimers();
        document.body.innerHTML = '';
        jest.restoreAllMocks();
    });

    it('swaps label and icon content without view transition support', () => {
        jest.useFakeTimers();
        new ButtonToggleContent();

        const button = document.querySelector('button')!;
        button.click();

        expect(button.querySelector('.c-button__label-text')?.innerHTML).toBe('Close');
        expect(button.querySelector('.c-icon > span')?.innerHTML).toBe('close');
        expect(button.getAttribute('data-toggle-label')).toBe('Open');
        expect(button.getAttribute('data-toggle-icon')).toBe('menu');
        expect(button.getAttribute('aria-label')).toBe('Close');
        expect(button.querySelector('.c-button__label-text')?.classList).toContain('is-toggle-content-entering');

        jest.runAllTimers();
        expect(button.querySelector('.c-button__label-text')?.classList).not.toContain('is-toggle-content-entering');
    });

    it('uses a view transition for the content swap when supported', async () => {
        let resolveFinished: (() => void) | undefined;
        const finished = new Promise<void>((resolve) => {
            resolveFinished = resolve;
        });
        const startViewTransition = jest.fn((update: () => void): ViewTransitionMock => {
            update();
            return { finished };
        });
        Object.defineProperty(document, 'startViewTransition', {
            configurable: true,
            value: startViewTransition,
        });
        new ButtonToggleContent();

        const button = document.querySelector('button')!;
        button.click();

        expect(startViewTransition).toHaveBeenCalledTimes(1);
        expect(button.querySelector('.c-button__label-text')?.getAttribute('style')).toContain('view-transition-name');
        expect(button.querySelector('.c-icon > span')?.getAttribute('style')).toContain('view-transition-name');
        expect(button.querySelector('.c-button__label-text')?.innerHTML).toBe('Close');

        resolveFinished?.();
        await finished;
        await Promise.resolve();

        expect(button.querySelector('.c-button__label-text')?.getAttribute('style')).toBe('');
        expect(button.querySelector('.c-icon > span')?.getAttribute('style')).toBe('');
    });

    it('interpolates the button width between label states', () => {
        const button = document.querySelector('button')!;
        jest.spyOn(button, 'getBoundingClientRect').mockImplementation(() => ({
            width: button.querySelector('.c-button__label-text')?.textContent?.trim() === 'Open' ? 80 : 112,
        } as DOMRect));
        const animate = jest.fn().mockReturnValue({
            addEventListener: jest.fn(),
            cancel: jest.fn(),
        });
        Object.defineProperty(button, 'animate', { configurable: true, value: animate });
        new ButtonToggleContent();

        button.click();

        expect(animate).toHaveBeenCalledWith(
            [{ width: '80px' }, { width: '112px' }],
            expect.objectContaining({ duration: 50 }),
        );
    });

    it('waits for an expanding width animation before swapping the label', () => {
        const button = document.querySelector('button')!;
        jest.spyOn(button, 'getBoundingClientRect').mockImplementation(() => ({
            width: button.querySelector('.c-button__label-text')?.textContent?.trim() === 'Open' ? 80 : 112,
        } as DOMRect));

        let finishGrow: (() => void) | undefined;
        const animation = {
            addEventListener: jest.fn((event: string, listener: () => void) => {
                if (event === 'finish') {
                    finishGrow = listener;
                }
            }),
            cancel: jest.fn(),
        };
        Object.defineProperty(button, 'animate', {
            configurable: true,
            value: jest.fn().mockReturnValue(animation),
        });
        new ButtonToggleContent();

        button.click();

        expect(button.querySelector('.c-button__label-text')?.textContent?.trim()).toBe('Open');
        finishGrow?.();
        expect(button.querySelector('.c-button__label-text')?.textContent?.trim()).toBe('Close');
    });

    it('clears the completed shrink before measuring the following grow', () => {
        const button = document.querySelector('button')!;
        jest.spyOn(button, 'getBoundingClientRect').mockImplementation(() => ({
            width: button.querySelector('.c-button__label-text')?.textContent?.trim() === 'Open' ? 112 : 80,
        } as DOMRect));

        let finishShrink: (() => void) | undefined;
        const shrinkAnimation = {
            addEventListener: jest.fn((event: string, listener: () => void) => {
                if (event === 'finish') {
                    finishShrink = listener;
                }
            }),
            cancel: jest.fn(),
        };
        const growAnimation = {
            addEventListener: jest.fn(),
            cancel: jest.fn(),
        };
        const animate = jest.fn()
            .mockReturnValueOnce(shrinkAnimation)
            .mockReturnValueOnce(growAnimation);
        Object.defineProperty(button, 'animate', { configurable: true, value: animate });
        new ButtonToggleContent();

        button.click();
        finishShrink?.();
        button.click();

        expect(animate).toHaveBeenNthCalledWith(
            1,
            [{ width: '112px' }, { width: '80px' }],
            expect.objectContaining({ duration: 50 }),
        );
        expect(shrinkAnimation.cancel).toHaveBeenCalledTimes(1);
        expect(animate).toHaveBeenNthCalledWith(
            2,
            [{ width: '80px' }, { width: '112px' }],
            expect.objectContaining({ duration: 50 }),
        );
    });

    it('skips motion when reduced motion is preferred', () => {
        const startViewTransition = jest.fn();
        Object.defineProperty(document, 'startViewTransition', {
            configurable: true,
            value: startViewTransition,
        });
        Object.defineProperty(window, 'matchMedia', {
            configurable: true,
            value: jest.fn().mockReturnValue({ matches: true }),
        });
        new ButtonToggleContent();

        document.querySelector('button')!.click();

        expect(startViewTransition).not.toHaveBeenCalled();
        expect(document.querySelector('.c-button__label-text')?.innerHTML).toBe('Close');
        expect(document.querySelector('.c-button__label-text')?.classList).not.toContain('is-toggle-content-entering');
    });
});
