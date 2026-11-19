import { initializeDrawerAccessibility, updateDrawerViewOffsets } from './drawerAccessibility';

describe('drawer popover integration', () => {
    beforeEach(() => {
        document.body.innerHTML = '';
        document.documentElement.removeAttribute('style');
        document.documentElement.style.setProperty('--base', '8px');
        const querySelectorAll = document.querySelectorAll.bind(document);
        jest.spyOn(document, 'querySelectorAll').mockImplementation((selector) =>
            querySelectorAll(selector === '[popover]:popover-open > .c-drawer'
                ? '[popover][data-open] > .c-drawer'
                : selector)
        );
        global.ResizeObserver = class {
            observe() {}
            unobserve() {}
            disconnect() {}
        };
    });

    afterEach(() => {
        jest.restoreAllMocks();
        document.body.innerHTML = '';
    });

    it('connects each close button to its own popover', () => {
        document.body.innerHTML = `
            <div id="first" popover><nav class="c-drawer">
                <button class="c-drawer__close" data-simulate-click=".legacy"></button>
            </nav></div>
            <div id="second" popover><nav class="c-drawer">
                <button class="c-drawer__close"></button>
            </nav></div>
        `;

        initializeDrawerAccessibility();

        const buttons = document.querySelectorAll<HTMLButtonElement>('.c-drawer__close');
        expect(buttons[0].getAttribute('popovertarget')).toBe('first');
        expect(buttons[0].getAttribute('popovertargetaction')).toBe('hide');
        expect(buttons[0].getAttribute('aria-controls')).toBe('first');
        expect(buttons[0].hasAttribute('data-simulate-click')).toBe(false);
        expect(buttons[1].getAttribute('popovertarget')).toBe('second');
    });

    it('tracks open drawer widths by popover placement and resets them on close', () => {
        document.body.innerHTML = `
            <div id="left" popover data-open data-js-popover-horizontal-placement="left"><nav class="c-drawer">
                <button class="c-drawer__close"></button>
            </nav></div>
            <div id="right" popover data-open data-js-popover-horizontal-placement="right"><nav class="c-drawer">
                <button class="c-drawer__close"></button>
            </nav></div>
        `;
        const drawers = document.querySelectorAll<HTMLElement>('.c-drawer');
        Object.defineProperty(drawers[0], 'offsetWidth', { value: 256 });
        Object.defineProperty(drawers[1], 'offsetWidth', { value: 320 });

        initializeDrawerAccessibility();

        expect(document.documentElement.style.getPropertyValue('--view-offset-left')).toBe('32');
        expect(document.documentElement.style.getPropertyValue('--view-offset-right')).toBe('40');

        const rightPopover = document.getElementById('right')!;
        rightPopover.removeAttribute('data-open');
        rightPopover.dispatchEvent(new Event('toggle'));

        expect(document.documentElement.style.getPropertyValue('--view-offset-right')).toBe('0');
        expect(document.documentElement.style.getPropertyValue('--view-offset-right-transition-easing')).toBe('ease-in');
    });

    it('does not offset the viewport for a centered or closed drawer', () => {
        document.body.innerHTML = `
            <div popover data-open data-js-popover-horizontal-placement="center"><nav class="c-drawer"></nav></div>
            <div popover data-js-popover-horizontal-placement="right"><nav class="c-drawer"></nav></div>
        `;

        updateDrawerViewOffsets();

        expect(document.documentElement.style.getPropertyValue('--view-offset-left')).toBe('0');
        expect(document.documentElement.style.getPropertyValue('--view-offset-right')).toBe('0');
    });

    it('wraps focus in both directions, excluding unavailable controls', () => {
        document.body.innerHTML = `
            <div id="drawer" popover><nav class="c-drawer">
                <button class="c-drawer__close">Close</button>
                <a href="#">Menu item</a>
                <button disabled>Disabled</button>
                <button hidden>Hidden</button>
                <div inert><button>Inert</button></div>
            </nav></div>
        `;
        const drawer = document.querySelector<HTMLElement>('.c-drawer')!;
        const first = drawer.querySelector<HTMLButtonElement>('.c-drawer__close')!;
        const last = drawer.querySelector<HTMLAnchorElement>('a')!;
        drawer.querySelectorAll<HTMLElement>('button, a').forEach((element) => {
            Object.defineProperty(element, 'getClientRects', { value: () => element.hidden ? [] : [{}] });
        });
        initializeDrawerAccessibility();

        last.focus();
        const forward = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true });
        last.dispatchEvent(forward);
        expect(forward.defaultPrevented).toBe(true);
        expect(document.activeElement).toBe(first);

        const backward = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true, cancelable: true });
        first.dispatchEvent(backward);
        expect(backward.defaultPrevented).toBe(true);
        expect(document.activeElement).toBe(last);
    });

    it('leaves normal navigation and modified keystrokes to the browser', () => {
        document.body.innerHTML = `
            <div id="drawer" popover><nav class="c-drawer">
                <button class="c-drawer__close">Close</button>
                <a href="#">Menu item</a>
            </nav></div>
        `;
        const drawer = document.querySelector<HTMLElement>('.c-drawer')!;
        const first = drawer.querySelector<HTMLButtonElement>('button')!;
        drawer.querySelectorAll<HTMLElement>('button, a').forEach((element) => {
            Object.defineProperty(element, 'getClientRects', { value: () => [{}] });
        });
        initializeDrawerAccessibility();
        first.focus();

        const tab = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true });
        const modifiedTab = new KeyboardEvent('keydown', { key: 'Tab', ctrlKey: true, shiftKey: true, bubbles: true, cancelable: true });
        first.dispatchEvent(tab);
        first.dispatchEvent(modifiedTab);

        expect(tab.defaultPrevented).toBe(false);
        expect(modifiedTab.defaultPrevented).toBe(false);
        expect(document.activeElement).toBe(first);
    });
});
